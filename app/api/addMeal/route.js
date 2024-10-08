import { NextResponse } from 'next/server';
import clientPromise from '../../lib/mongodb';

export async function POST(request) {
    try {
        const client = await clientPromise;
        const db = client.db("erinder"); // Replace with your actual database name

        const data = await request.json();
        console.log('Data received in addMeal API:', data);

        const result = await db.collection("meals").insertOne(data);
        
        return NextResponse.json({ message: 'Meal added successfully', id: result.insertedId }, { status: 201 });
    } catch (error) {
        console.error('Error adding meal:', error);
        return NextResponse.json({ error: 'Failed to add meal', details: error.message }, { status: 500 });
    }
}