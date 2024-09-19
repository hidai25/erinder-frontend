'use client';

import { SessionProvider } from 'next-auth/react'; // Import SessionProvider from next-auth
import './globals.css'; // Import global styles

export default function RootLayout({ children }) {
    return (
        <html lang="en">
            <head>
                <title>Reminder & Task Management App</title>
            </head>
            <body>
                {/* Wrap the entire application with SessionProvider */}
                <SessionProvider>
                    {children}
                </SessionProvider>
            </body>
        </html>
    );
}
