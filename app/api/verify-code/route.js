import { NextResponse } from 'next/server';
import clientPromise from '../../lib/mongodb'; // Adjust the path as necessary

export async function POST(request) {
    try {
        const { email, code } = await request.json();
        const client = await clientPromise;
        const db = client.db('erinder');

        console.log(`Received request to verify code for email: ${email}, code: ${code}`);

        const verificationRecord = await db.collection('verificationCodes').findOne({
            email,
            code: parseInt(code),
            createdAt: { $gt: new Date(Date.now() - 30 * 60 * 1000) } // Code valid for 30 minutes
        });

        if (!verificationRecord) {
            console.log(`Verification failed: No valid matching record found for email: ${email}`);
            return NextResponse.json({ error: 'Invalid or expired verification code.' }, { status: 400 });
        }

        // Mark the user as verified in the 'users' collection
        await db.collection('users').updateOne({ email }, { $set: { verified: true } });

        // Delete the used verification code
        await db.collection('verificationCodes').deleteOne({ _id: verificationRecord._id });

        console.log(`Verification successful for email: ${email}`);
        return NextResponse.json({ message: 'Verification successful.' });
    } catch (error) {
        console.error('Error during verification:', error);
        return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
    }
}