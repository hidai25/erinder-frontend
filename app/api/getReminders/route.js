import { NextResponse } from 'next/server';
import mongoose from 'mongoose';
import Reminder from '../../models/Reminder';  // Correct path to model

const connectionString = 'mongodb://localhost:27017/erinder';

mongoose.connect(connectionString, {
    useNewUrlParser: true,
    useUnifiedTopology: true
});

export async function GET() {
    try {
        // Fetch all reminders, or filter by specific criteria
        const reminders = await Reminder.find();

        // Optionally, you can sort or filter reminders based on certain conditions
        // const reminders = await Reminder.find({ isSent: false }).sort({ date: 1 });

        return NextResponse.json(reminders);
    } catch (error) {
        console.error('Error fetching reminders:', error);
        return NextResponse.json({ message: 'Error fetching reminders', error }, { status: 500 });
    }
}
