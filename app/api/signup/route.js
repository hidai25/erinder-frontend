import { hash } from 'bcryptjs';
import clientPromise from '../../lib/mongodb';
import sendMail from '../../lib/sendMail';

export async function POST(request) {
    try {
        // Parse the incoming request body
        const { email, password, name, householdName, familyMembers } = await request.json();

        // Validate required fields
        if (!email || !password || !name) {
            return new Response(JSON.stringify({ message: 'Missing required fields' }), { status: 400 });
        }

        // Connect to MongoDB
        const client = await clientPromise;
        const db = client.db('erinder');

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
            householdName: householdName || '',
            familyMembers: Array.isArray(familyMembers) ? familyMembers.map(member => ({
                name: member.name || '',
                age: member.age || null,
                picture: member.picture || null
            })) : [],
            verified: false,
        };

        // Insert the new user into the users collection
        await db.collection('users').insertOne(newUser);

        // Generate a verification code
        const verificationCode = Math.floor(100000 + Math.random() * 900000);

        // Store the verification code in the database
        await storeVerificationCodeInDB(email, verificationCode);

        // Send the verification email
        try {
            await sendMail(
                email,
                'Your Verification Code',
                `Your verification code is ${verificationCode}`,
                `<p>Your verification code is: <b>${verificationCode}</b></p>`
            );
        } catch (emailError) {
            console.error('Error sending verification email:', emailError);
            // Consider how you want to handle email sending failures
            // For now, we'll continue with the signup process
        }

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
    const db = client.db('erinder');
    await db.collection('verificationCodes').insertOne({
        email,
        code,
        createdAt: new Date(),
    });
}