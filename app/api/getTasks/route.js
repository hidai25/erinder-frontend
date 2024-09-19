import { NextResponse } from 'next/server';
import mongoose from 'mongoose';
import Task from '../../models/Task'; // Import the Task model

const connectionString = 'mongodb://localhost:27017/erinder';

mongoose.connect(connectionString, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
});

export async function GET() {
    try {
        const tasks = await Task.find(); // Fetch all tasks from the database
        return NextResponse.json(tasks); // Return tasks as JSON
    } catch (error) {
        console.error('Error fetching tasks:', error);
        return NextResponse.json({ message: 'Error fetching tasks', error }, { status: 500 });
    }
}
