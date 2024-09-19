import { NextResponse } from 'next/server';
import mongoose from 'mongoose';
import Task from '../../models/Task';

const connectionString = 'mongodb://localhost:27017/erinder';

mongoose.connect(connectionString, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
});

export async function DELETE() {
    try {
        await Task.deleteMany({});
        return NextResponse.json({ message: 'All tasks deleted successfully.' });
    } catch (error) {
        console.error('Error deleting all tasks:', error);
        return NextResponse.json({ message: 'Error deleting all tasks', error }, { status: 500 });
    }
}
