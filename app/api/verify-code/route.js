// app/api/verify-code/route.js
import { NextResponse } from 'next/server';
import clientPromise from '../../lib/mongodb'; // Adjust the path to your MongoDB connection

export async function POST(request) {
    try {
        // Parse the incoming request body
        const { email, code } = await request.json();

        // Connect to MongoDB
        const client = await clientPromise;
        const db = client.db('erinder'); // Replace 'erinder' with your actual database name

        // Debugging log
        console.log(`Received request to verify code for email: ${email}, code: ${code}`);

        // Find the verification code in the database
        const verificationRecord = await db.collection('verificationCodes').findOne({ email, code: parseInt(code) });

        if (!verificationRecord) {
            // If no record is found or the code is incorrect
            // console.log(`Verification failed: No matching record found for the provided email and code.`);
            return NextResponse.json({ error: 'Invalid verification code.' }, { status: 400 });
        }

        // Check if the code is expired (optional)
        const codeCreationTime = new Date(verificationRecord.createdAt);
        const currentTime = new Date();
        const timeDifference = (currentTime - codeCreationTime) / (1000 * 60); // Difference in minutes

        if (timeDifference > 30) { // For example, the code expires after 30 minutes
            console.log(`Verification failed: Code expired.`);
            return NextResponse.json({ error: 'Verification code expired.' }, { status: 400 });
        }

        // Mark the user as verified in the 'users' collection
        await db.collection('users').updateOne({ email }, { $set: { verified: true } });

        // Optionally, delete the verification code after successful verification
        await db.collection('verificationCodes').deleteOne({ email });

        // Debugging log for success
        console.log(`Verification successful for email: ${email}`);

        // Return a success response
        return NextResponse.json({ message: 'Verification successful.' });
    } catch (error) {
        console.error('Error during verification:', error);
        return NextResponse.json({ message: 'Internal Server Error' }, { status: 500 });
    }
}
