import { NextResponse } from 'next/server';
import clientPromise from '../../lib/mongodb';
import { getServerSession } from 'next-auth';
import { authOptions } from '../auth/[...nextauth]/route';

export async function GET() {
    try {
        const session = await getServerSession(authOptions);
        if (!session) {
            return NextResponse.json({ message: 'Unauthorized' }, { status: 401 });
        }

        const client = await clientPromise;
        const db = client.db('erinder');

        const user = await db.collection('users').findOne({ email: session.user.email });
        
        if (!user) {
            return NextResponse.json({ message: 'User not found' }, { status: 404 });
        }

        return NextResponse.json({ familyMembers: user.familyMembers || [] });
    } catch (error) {
        console.error('Error fetching user data:', error);
        return NextResponse.json({ message: 'Failed to fetch user data', error: error.message }, { status: 500 });
    }
}