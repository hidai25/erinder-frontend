// app/api/send-verification/route.js
import { NextResponse } from 'next/server';
import nodemailer from 'nodemailer';
import clientPromise from '../../lib/mongodb';

const VERIFICATION_COOLDOWN = 60000; // 1 minute cooldown

export async function POST(request) {
    const { email } = await request.json();
    
    try {
        const client = await clientPromise;
        const db = client.db('erinder');
        
        // Check if a verification code was sent recently
        const recentCode = await db.collection('verificationCodes').findOne({
            email,
            createdAt: { $gt: new Date(Date.now() - VERIFICATION_COOLDOWN) }
        });

        if (recentCode) {
            return NextResponse.json({ message: 'Verification code already sent recently' }, { status: 429 });
        }

        // Remove any old verification codes for this email
        await db.collection('verificationCodes').deleteMany({ email });
        
        const verificationCode = Math.floor(100000 + Math.random() * 900000);
        
        await db.collection('verificationCodes').insertOne({
            email,
            code: verificationCode,
            createdAt: new Date(),
        });

        const transporter = nodemailer.createTransport({
            host: 'smtp-mail.outlook.com',
            port: 587,
            secure: false,
            auth: {
                user: process.env.EMAIL_USER,
                pass: process.env.EMAIL_PASS,
            },
            tls: {
                ciphers: 'SSLv3',
            },
        });

        await transporter.sendMail({
            from: process.env.EMAIL_USER,
            to: email,
            subject: 'Your Verification Code',
            text: `Your verification code is ${verificationCode}`,
            html: `<p>Your verification code is: <b>${verificationCode}</b></p>`,
        });

        return NextResponse.json({ message: 'Verification code sent successfully' });
    } catch (error) {
        // console.error('Failed to send verification code:', error);
        if (error.responseCode === 535) {
            return NextResponse.json({ error: 'Invalid email credentials. Please check your SMTP settings.' }, { status: 500 });
        }
        return NextResponse.json({ error: 'Failed to send verification code' }, { status: 500 });
    }
}