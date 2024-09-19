'use client';

import { useSession } from 'next-auth/react'; // Correctly import useSession
import Link from 'next/link';

export default function Layout({ children }) {
    const { data: session } = useSession(); // Fetch session data to determine if user is logged in

    return (
        <div>
            {/* Conditionally render the navigation menu if the user is authenticated */}
            {session && (
                <nav className="bg-gray-800 p-4">
                    <ul className="flex space-x-4">
                        <li>
                            <Link href="/dashboard" className="text-white hover:underline">
                                Home
                            </Link>
                        </li>
                        <li>
                            <Link href="/dashboard/reminders" className="text-white hover:underline">
                                Reminders
                            </Link>
                        </li>
                        <li>
                            <Link href="/dashboard/tasks" className="text-white hover:underline">
                                Task Management
                            </Link>
                        </li>
                    </ul>
                </nav>
            )}

            {/* Main Content */}
            <main className="p-4">{children}</main>
        </div>
    );
}
