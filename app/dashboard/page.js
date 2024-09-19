'use client';

import { useSession } from 'next-auth/react';
import { useState, useEffect } from 'react';
import Link from 'next/link';

export default function Dashboard() {
    const { data: session, status } = useSession();
    const [userData, setUserData] = useState(null);
    const [reminders, setReminders] = useState({ today: 0, week: 0 });
    const [tasks, setTasks] = useState({ pending: 0, completed: 0 });
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    useEffect(() => {
        const fetchUserData = async () => {
            try {
                if (status === 'authenticated') {
                    const response = await fetch('/api/user');
                    if (response.ok) {
                        const data = await response.json();
                        setUserData(data);

                        // Mock fetching reminders and tasks data
                        // Replace this with actual data fetching from your API
                        setReminders({ today: 2, week: 5 });
                        setTasks({ pending: 3, completed: 7 });
                    } else {
                        throw new Error('Failed to fetch user data');
                    }
                }
                setLoading(false);
            } catch (error) {
                console.error('Error fetching user data:', error);
                setError(error.message);
                setLoading(false);
            }
        };

        fetchUserData();
    }, [status]);

    if (loading) return <p>Loading...</p>;
    if (error) return <p>Error: {error}</p>;
    if (!userData) return <p>No user data available</p>;

    return (
        <div className="flex h-screen">
            {/* Left Side: Main Content */}
            <div className="flex-grow p-6 overflow-y-auto space-y-6">
                {/* Welcome Section */}
                <div className="text-2xl font-bold">
                    <h1>Welcome Back!</h1>
                    <p className="text-sm text-gray-500">Today is {new Date().toLocaleDateString()}</p>
                </div>

                {/* Overview Cards */}
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                    {/* Reminders Card */}
                    <div className="bg-white p-4 rounded-lg shadow-md hover:shadow-lg transition-shadow duration-300">
                        <h2 className="text-xl font-semibold">Upcoming Reminders</h2>
                        <p className="text-gray-600">{reminders.today} due today, {reminders.week} this week</p>
                    </div>
                    {/* Tasks Card */}
                    <div className="bg-white p-4 rounded-lg shadow-md hover:shadow-lg transition-shadow duration-300">
                        <h2 className="text-xl font-semibold">Tasks</h2>
                        <p className="text-gray-600">{tasks.pending} pending, {tasks.completed} completed</p>
                    </div>
                    {/* Quick Actions */}
                    <div className="bg-white p-4 rounded-lg shadow-md hover:shadow-lg transition-shadow duration-300 flex flex-col space-y-2">
                        <Link href="/dashboard/reminders" className="w-full bg-indigo-500 text-white py-2 rounded-md hover:bg-indigo-600 text-center">Add Reminder</Link>
                        <Link href="/dashboard/tasks" className="w-full bg-blue-500 text-white py-2 rounded-md hover:bg-blue-600 text-center">Add Task</Link>
                        <button className="w-full bg-green-500 text-white py-2 rounded-md hover:bg-green-600">Mark All as Complete</button>
                    </div>
                </div>

                {/* Recent Activity */}
                <div className="bg-white p-4 rounded-lg shadow-md hover:shadow-lg transition-shadow duration-300">
                    <h2 className="text-xl font-semibold">Recent Activity</h2>
                    <ul className="mt-2 space-y-2">
                        <li className="text-gray-700">Reminder: Meeting at 10 AM</li>
                        <li className="text-gray-700">Task: Complete the project report</li>
                        {/* Add more recent activities dynamically */}
                    </ul>
                </div>
            </div>

            {/* Right Side: Family Members Section */}
            <div className="w-1/4 p-6 bg-white rounded-lg shadow-lg">
                <h3 className="text-xl font-semibold mb-4">Family Members</h3>
                <ul>
                    {userData.familyMembers && userData.familyMembers.map((member, index) => (
                        <li key={index} className="flex items-center space-x-4 mb-2">
                            {/* Placeholder for Avatar */}
                            <div className="w-10 h-10 rounded-full bg-gray-200 flex items-center justify-center">
                                {member.name.charAt(0).toUpperCase()}
                            </div>
                            <span>{member.name}</span>
                        </li>
                    ))}
                </ul>
            </div>
        </div>
    );
}
