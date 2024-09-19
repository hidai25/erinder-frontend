// app/api/user/route.js
import { getServerSession } from 'next-auth';
import { NextResponse } from 'next/server';
import clientPromise from '../../lib/mongodb';
import { authOptions } from '../auth/[...nextauth]/route'; // Correct path to authOptions

export async function GET(request) {
    try {
        const session = await getServerSession(authOptions);
        if (!session) {
            console.log('No active session found');  // Add more logging
            return NextResponse.json({ message: 'Unauthorized' }, { status: 401 });
        }

        const client = await clientPromise;
        const db = client.db('erinder'); // Replace with your actual database name
        const user = await db.collection('users').findOne({ email: session.user.email });

        if (!user) {
            console.log('User not found in the database');  // Add more logging
            return NextResponse.json({ message: 'User not found' }, { status: 404 });
        }

        const { name, householdName, familyMembers } = user;
        return NextResponse.json({ name, householdName, familyMembers });
    } catch (error) {
        console.error('Error fetching user data:', error);
        return NextResponse.json({ message: 'Error fetching user data', error: error.message }, { status: 500 });
    }
}
