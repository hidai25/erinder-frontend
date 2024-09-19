import { NextResponse } from 'next/server';
import mongoose from 'mongoose';
import nodemailer from 'nodemailer';
import Reminder from '../../models/Reminder';
import { Twilio } from 'twilio'; // Import Twilio for WhatsApp

// Ensure you have a valid MongoDB connection string
const connectionString = process.env.MONGODB_URI || 'mongodb://localhost:27017/erinder';

// Connect to MongoDB
mongoose.connect(connectionString).then(() => {
    console.log('Connected to MongoDB');
}).catch((error) => {
    console.error('Error connecting to MongoDB:', error);
});

// Define the Nodemailer transporter
const transporter = nodemailer.createTransport({
    service: 'hotmail',
    auth: {
        user: process.env.EMAIL_USER,
        pass: process.env.EMAIL_PASS
    }
});

// Initialize Twilio client for WhatsApp
const twilioClient = new Twilio(process.env.TWILIO_ACCOUNT_SID, process.env.TWILIO_AUTH_TOKEN);

export async function GET() {
    try {
        const reminders = await Reminder.find({ isSent: false });
        return NextResponse.json(reminders);
    } catch (error) {
        console.error('Error fetching reminders:', error);
        return NextResponse.json({ message: 'Error fetching reminders', error }, { status: 500 });
    }
}

export async function POST(request) {
    try {
        const { title, date, email, whatsapp, sendToWhatsapp } = await request.json();
        const reminderDate = new Date(date);

        const newReminder = new Reminder({
            title,
            date: reminderDate,
            email,
            whatsapp: sendToWhatsapp ? whatsapp : null, 
            isSent: false,
            sendToWhatsapp 
        });

        await newReminder.save();

        return NextResponse.json({ message: 'Reminder scheduled successfully. An email/WhatsApp message will be sent at the scheduled time.' });
    } catch (error) {
        console.error('Error scheduling reminder:', error);
        return NextResponse.json({ message: 'Error scheduling reminder', error }, { status: 500 });
    }
}

// Function to send scheduled reminders via email and/or WhatsApp
async function sendScheduledReminders() {
    const now = new Date();
    try {
        const reminders = await Reminder.find({ date: { $lte: now }, isSent: false });

        reminders.forEach(async (reminder) => {
            const message = `You have a scheduled reminder: ${reminder.title} on ${reminder.date}`;

            if (reminder.email) {
                const mailOptions = {
                    from: process.env.EMAIL_USER,
                    to: reminder.email,
                    subject: 'Scheduled Reminder',
                    text: message
                };

                try {
                    await transporter.sendMail(mailOptions);
                    console.log(`Reminder sent to ${reminder.email} via email`);
                } catch (error) {
                    console.error(`Failed to send reminder to ${reminder.email} via email`, error);
                }
            }

            if (reminder.sendToWhatsapp && reminder.whatsapp) {
                try {
                    await twilioClient.messages.create({
                        body: message,
                        from: `whatsapp:${process.env.TWILIO_WHATSAPP_NUMBER}`,
                        to: `whatsapp:${reminder.whatsapp}`
                    });
                    console.log(`Reminder sent to ${reminder.whatsapp} via WhatsApp`);
                } catch (error) {
                    console.error(`Failed to send reminder to ${reminder.whatsapp} via WhatsApp`, error);
                }
            }

            reminder.isSent = true;
            await reminder.save();
        });
    } catch (error) {
        console.error('Error fetching reminders for sending:', error);
    }
}

// Schedule the function to run every minute
import cron from 'node-cron';
cron.schedule('* * * * *', sendScheduledReminders);
