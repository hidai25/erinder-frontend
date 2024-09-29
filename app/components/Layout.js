// components/Layout.js
'use client';
import { useSession } from 'next-auth/react';
import Link from 'next/link';

export default function Layout({ children }) {
    const { data: session } = useSession();
    return (
        <div>
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
                        <li>
                            <Link href="/dashboard/mealplanner" className="text-white hover:underline">
                                Meal Planner
                            </Link>
                        </li>
                    </ul>
                </nav>
            )}
            <main className="p-4">{children}</main>
        </div>
    );
}