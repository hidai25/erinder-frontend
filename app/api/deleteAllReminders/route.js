import { NextResponse } from 'next/server';
import mongoose from 'mongoose';
import Reminder from '../../models/Reminder';

const connectionString = 'mongodb://localhost:27017/erinder';

mongoose.connect(connectionString, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
});

export async function DELETE() {
    try {
        await Reminder.deleteMany({});
        return NextResponse.json({ message: 'All reminders deleted successfully.' });
    } catch (error) {
        console.error('Error deleting all reminders:', error);
        return NextResponse.json({ message: 'Error deleting all reminders', error }, { status: 500 });
    }
}
