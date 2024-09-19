import { NextResponse } from 'next/server';
import mongoose from 'mongoose';
import Reminder from '../../models/Reminder'; // Adjust the path if necessary

const connectionString = 'mongodb://localhost:27017/erinder';

mongoose.connect(connectionString, {
    useNewUrlParser: true,
    useUnifiedTopology: true
});

export async function PUT(request) {
    try {
        const { id, title, date, email } = await request.json();
        await Reminder.findByIdAndUpdate(id, { title, date, email });
        return NextResponse.json({ message: 'Reminder updated successfully.' });
    } catch (error) {
        console.error('Error updating reminder:', error);
        return NextResponse.json({ message: 'Error updating reminder', error }, { status: 500 });
    }
}
