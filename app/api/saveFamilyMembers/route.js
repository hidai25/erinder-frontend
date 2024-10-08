import { NextResponse } from 'next/server';
import clientPromise from '../../lib/mongodb';
import { getServerSession } from 'next-auth';
import { authOptions } from '../auth/[...nextauth]/route';

export async function POST(request) {
    try {
        const session = await getServerSession(authOptions);
        if (!session) {
            return NextResponse.json({ message: 'Unauthorized' }, { status: 401 });
        }

        const client = await clientPromise;
        const db = client.db('erinder');

        const { familyMembers } = await request.json();

        const result = await db.collection('users').updateOne(
            { email: session.user.email },
            { $set: { familyMembers: familyMembers } },
            { upsert: true }
        );

        if (result.matchedCount === 0 && result.upsertedCount === 0) {
            return NextResponse.json({ message: 'User not found' }, { status: 404 });
        }

        return NextResponse.json({ message: 'Family members saved successfully', familyMembers });
    } catch (error) {
        console.error('Error saving family members:', error);
        return NextResponse.json({ message: 'Failed to save family members', error: error.message }, { status: 500 });
    }
}