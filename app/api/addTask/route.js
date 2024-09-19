import { NextResponse } from 'next/server';
import mongoose from 'mongoose';
import Task from '../../models/Task'; // Import the Task model

const connectionString = 'mongodb://localhost:27017/erinder';

// Connect to MongoDB
mongoose.connect(connectionString, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
});

export async function POST(request) {
    try {
        const { taskTitle, taskCategory, taskPriority, assignedMember } = await request.json();

        // Create a new task
        const newTask = new Task({
            taskTitle,
            taskCategory,
            taskPriority,
            assignedMember,
        });

        await newTask.save(); // Save the task to the database

        return NextResponse.json({ message: 'Task added successfully.' });
    } catch (error) {
        console.error('Error adding task:', error);
        return NextResponse.json({ message: 'Error adding task', error }, { status: 500 });
    }
}
