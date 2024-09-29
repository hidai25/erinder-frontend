import { NextResponse } from 'next/server';
import clientPromise from '../../lib/mongodb';
import sendMail from '../../lib/sendMail'; // Import sendMail from the utility file

const VERIFICATION_COOLDOWN = 60000; // 1 minute cooldown

export async function POST(request) {
    const { email } = await request.json();
    
    try {
        // Connect to MongoDB
        const client = await clientPromise;
        const db = client.db('erinder');

        // Check if a verification code was sent recently
        const recentCode = await db.collection('verificationCodes').findOne({
            email,
            createdAt: { $gt: new Date(Date.now() - VERIFICATION_COOLDOWN) }
        });

        if (recentCode) {
            return NextResponse.json({ message: 'Verification code already sent recently' }, { status: 429 });
        }

        // Remove any old verification codes for this email
        await db.collection('verificationCodes').deleteMany({ email });

        // Generate a new verification code
        const verificationCode = Math.floor(100000 + Math.random() * 900000);

        // Store the verification code in the database
        await db.collection('verificationCodes').insertOne({
            email,
            code: verificationCode,
            createdAt: new Date(),
        });

        // Send the verification email using the sendMail function
        await sendMail(
            email,
            'Your Verification Code',
            `Your verification code is ${verificationCode}`,
            `<p>Your verification code is: <b>${verificationCode}</b></p>`
        );

        // Respond with success
        return NextResponse.json({ message: 'Verification code sent successfully' });
    } catch (error) {
        console.error('Failed to send verification code:', error);
        return NextResponse.json({ error: 'Failed to send verification code' }, { status: 500 });
    }
}
