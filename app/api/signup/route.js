// app/api/signup/route.js
import { hash } from 'bcryptjs';
import clientPromise from '../../lib/mongodb'; // Adjust the path to your MongoDB connection
import nodemailer from 'nodemailer';

export async function POST(request) {
    try {
        // Parse the incoming request body
        const { email, password, name, householdName, familyMembers } = await request.json();

        // Connect to MongoDB
        const client = await clientPromise;
        const db = client.db('erinder'); // Replace 'erinder' with your actual database name

        // Check if the user already exists
        const existingUser = await db.collection('users').findOne({ email });
        if (existingUser) {
            return new Response(JSON.stringify({ message: 'User already exists' }), { status: 409 });
        }

        // Hash the password before storing it
        const hashedPassword = await hash(password, 10);

        // Prepare the new user object
        const newUser = {
            email,
            password: hashedPassword,
            name,
            householdName,
            familyMembers: familyMembers.map(member => ({
                name: member.name,
                age: member.age || null,
                picture: member.picture || null
            })),
            verified: false, // Add verified field to mark the user's verification status
        };

        // Insert the new user into the users collection
        await db.collection('users').insertOne(newUser);

        // Generate a verification code
        const verificationCode = Math.floor(100000 + Math.random() * 900000); // Generate a 6-digit verification code

        // Store the verification code in the database
        await storeVerificationCodeInDB(email, verificationCode);

        // Configure Nodemailer transporter for Hotmail
        const transporter = nodemailer.createTransport({
            host: 'smtp-mail.outlook.com',
            port: 587,
            secure: false,
            auth: {
                user: process.env.EMAIL_USER,
                pass: process.env.EMAIL_PASS,
            },
            tls: {
                ciphers: 'SSLv3',
            },
        });

        // Send the verification email
        await transporter.sendMail({
            from: process.env.EMAIL_USER,
            to: email,
            subject: 'Your Verification Code',
            text: `Your verification code is ${verificationCode}`,
            html: `<p>Your verification code is: <b>${verificationCode}</b></p>`,
        });

        // Return a success response
        return new Response(JSON.stringify({ message: 'User created successfully. Verification code sent.' }), { status: 201 });
    } catch (error) {
        console.error('Error during sign-up:', error);
        return new Response(JSON.stringify({ message: 'Internal Server Error' }), { status: 500 });
    }
}

// Function to store the verification code in MongoDB
async function storeVerificationCodeInDB(email, code) {
    const client = await clientPromise;
    const db = client.db('erinder'); // Use your correct database name

    await db.collection('verificationCodes').insertOne({
        email,
        code,
        createdAt: new Date(),
    });
}
