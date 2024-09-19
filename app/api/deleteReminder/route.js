import { NextResponse } from 'next/server';
import mongoose from 'mongoose';
import Reminder from '../../models/Reminder'; // Adjust the path if necessary

const connectionString = 'mongodb://localhost:27017/erinder';

mongoose.connect(connectionString, {
    useNewUrlParser: true,
    useUnifiedTopology: true
});

export async function DELETE(request) {
    try {
        const { id } = await request.json();
        await Reminder.findByIdAndDelete(id);
        return NextResponse.json({ message: 'Reminder deleted successfully.' });
    } catch (error) {
        console.error('Error deleting reminder:', error);
        return NextResponse.json({ message: 'Error deleting reminder', error }, { status: 500 });
    }
}
