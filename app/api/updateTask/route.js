import { NextResponse } from 'next/server';
import mongoose from 'mongoose';
import Task from '../../models/Task';

const connectionString = 'mongodb://localhost:27017/erinder';

mongoose.connect(connectionString, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
});

export async function PUT(request) {
    try {
        const { id, taskTitle, taskCategory, taskPriority, assignedMember } = await request.json();

        await Task.findByIdAndUpdate(id, {
            taskTitle,
            taskCategory,
            taskPriority,
            assignedMember,
        });

        return NextResponse.json({ message: 'Task updated successfully.' });
    } catch (error) {
        console.error('Error updating task:', error);
        return NextResponse.json({ message: 'Error updating task', error }, { status: 500 });
    }
}
