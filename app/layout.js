'use client';

import { SessionProvider } from 'next-auth/react'; // Import SessionProvider from next-auth
import './globals.css'; // Import global styles
import DndProviderWrapper from './components/DndProvider'; // Import DndProviderWrapper

export default function RootLayout({ children }) {
    return (
        <html lang="en">
            <head>
                <title>Reminder & Task Management App</title>
            </head>
            <body>
                {/* Wrap the entire application with SessionProvider and DndProviderWrapper */}
                <SessionProvider>
                    <DndProviderWrapper>
                        {children}
                    </DndProviderWrapper>
                </SessionProvider>
            </body>
        </html>
    );
}
