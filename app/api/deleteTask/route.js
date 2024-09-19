import { NextResponse } from 'next/server';
import mongoose from 'mongoose';
import Task from '../../models/Task';

const connectionString = 'mongodb://localhost:27017/erinder';

mongoose.connect(connectionString, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
});

export async function DELETE(request) {
    try {
        const { id } = await request.json();
        await Task.findByIdAndDelete(id);
        return NextResponse.json({ message: 'Task deleted successfully.' });
    } catch (error) {
        console.error('Error deleting task:', error);
        return NextResponse.json({ message: 'Error deleting task', error }, { status: 500 });
    }
}
