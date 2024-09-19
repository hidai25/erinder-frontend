// app/dashboard/reminders/page.js
'use client';

import { useState, useEffect } from 'react';

export default function Reminders() {
    const [title, setTitle] = useState('');
    const [date, setDate] = useState('');
    const [email, setEmail] = useState('');
    const [recurrence, setRecurrence] = useState('');
    const [reminders, setReminders] = useState([]);
    const [notification, setNotification] = useState({ message: '', visible: false });
    const [editableId, setEditableId] = useState(null);
    const [editableFields, setEditableFields] = useState({});

    useEffect(() => {
        fetchReminders();
    }, []);

    const fetchReminders = async () => {
        try {
            const response = await fetch('/api/getReminders');
            if (response.ok) {
                const data = await response.json();
                setReminders(data);
            } else {
                console.error('Failed to fetch reminders');
            }
        } catch (error) {
            console.error('Error fetching reminders:', error);
        }
    };

    const handleSubmitReminder = async (e) => {
        e.preventDefault();
        const response = await fetch('/api/addReminder', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({ title, date, email, recurrence })
        });

        const result = await response.json();
        setNotification({ message: result.message, visible: true });

        setTitle('');
        setDate('');
        setEmail('');
        setRecurrence('');

        fetchReminders();

        setTimeout(() => {
            setNotification({ ...notification, visible: false });
        }, 5000);
    };

    const handleEditReminder = (id) => {
        setEditableId(id);
        const reminder = reminders.find(reminder => reminder._id === id);
        setEditableFields({
            title: reminder.title,
            date: reminder.date.slice(0, 16),
            email: reminder.email,
            recurrence: reminder.recurrence
        });
    };

    const handleFieldChange = (e, field) => {
        setEditableFields({
            ...editableFields,
            [field]: e.target.value
        });
    };

    const handleUpdateReminder = async (id) => {
        try {
            const response = await fetch('/api/updateReminder', {
                method: 'PUT',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({ id, ...editableFields })
            });

            const result = await response.json();
            setNotification({ message: result.message, visible: true });

            setEditableId(null);
            fetchReminders();

            setTimeout(() => {
                setNotification({ ...notification, visible: false });
            }, 5000);
        } catch (error) {
            console.error('Error updating reminder:', error);
        }
    };

    const handleDeleteReminder = async (id) => {
        try {
            const response = await fetch('/api/deleteReminder', {
                method: 'DELETE',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({ id })
            });

            const result = await response.json();
            setNotification({ message: result.message, visible: true });

            fetchReminders();

            setTimeout(() => {
                setNotification({ ...notification, visible: false });
            }, 5000);
        } catch (error) {
            console.error('Error deleting reminder:', error);
        }
    };

    const getTodayDate = () => {
        const today = new Date();
        today.setHours(21, 25, 0);
        return today.toISOString().slice(0, 16);
    };

    const getTomorrowDate = () => {
        const tomorrow = new Date();
        tomorrow.setDate(tomorrow.getDate() + 1);
        tomorrow.setHours(21, 25, 0);
        return tomorrow.toISOString().slice(0, 16);
    };

    return (
        <div className="p-6 space-y-6">
            {notification.visible && (
                <div className="bg-green-500 text-white p-4 rounded-md fixed top-4 left-1/2 transform -translate-x-1/2 shadow-lg">
                    {notification.message}
                </div>
            )}
            <h2 className="text-2xl font-bold">Manage Your Reminders</h2>
            <form onSubmit={handleSubmitReminder} className="space-y-4 bg-white p-4 rounded-md shadow-md">
                <div>
                    <label htmlFor="title" className="block text-sm font-medium text-gray-700">Title</label>
                    <input
                        type="text"
                        id="title"
                        value={title}
                        onChange={(e) => setTitle(e.target.value)}
                        required
                        className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
                    />
                </div>
                <div>
                    <label htmlFor="date" className="block text-sm font-medium text-gray-700">Date and Time</label>
                    <input
                        type="datetime-local"
                        id="date"
                        value={date}
                        onChange={(e) => setDate(e.target.value)}
                        required
                        className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
                    />
                    <div className="flex space-x-4 mt-2">
                        <button
                            type="button"
                            onClick={() => setDate(getTodayDate())}
                            className="text-white bg-blue-500 px-4 py-2 rounded-md hover:bg-blue-700"
                        >
                            Fill Today's Date
                        </button>
                        <button
                            type="button"
                            onClick={() => setDate(getTomorrowDate())}
                            className="text-white bg-green-500 px-4 py-2 rounded-md hover:bg-green-700"
                        >
                            Fill Tomorrow's Date
                        </button>
                    </div>
                </div>
                <div>
                    <label htmlFor="recurrence" className="block text-sm font-medium text-gray-700">Recurrence</label>
                    <select
                        id="recurrence"
                        value={recurrence}
                        onChange={(e) => setRecurrence(e.target.value)}
                        className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
                    >
                        <option value="">None</option>
                        <option value="daily">Daily</option>
                        <option value="weekly">Weekly</option>
                        <option value="monthly">Monthly</option>
                    </select>
                </div>
                <div>
                    <label htmlFor="email" className="block text-sm font-medium text-gray-700">Email</label>
                    <input
                        type="email"
                        id="email"
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        required
                        className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
                    />
                </div>
                <button type="submit" className="bg-indigo-600 text-white px-4 py-2 rounded-md hover:bg-indigo-700 transition duration-300">Add Reminder</button>
            </form>

            <div className="mt-8">
                <h3 className="text-lg font-bold mb-4">Scheduled Reminders</h3>
                <ul className="space-y-4">
                    {reminders.map((reminder) => (
                        <li key={reminder._id} className="bg-white p-4 rounded-md shadow-md flex justify-between items-center">
                            {editableId === reminder._id ? (
                                <>
                                    <div className="flex-1 space-y-2">
                                        <input
                                            type="text"
                                            value={editableFields.title}
                                            onChange={(e) => handleFieldChange(e, 'title')}
                                            className="w-full border p-1 rounded-md"
                                        />
                                        <input
                                            type="datetime-local"
                                            value={editableFields.date}
                                            onChange={(e) => handleFieldChange(e, 'date')}
                                            className="w-full border p-1 rounded-md"
                                        />
                                        <select
                                            value={editableFields.recurrence}
                                            onChange={(e) => handleFieldChange(e, 'recurrence')}
                                            className="w-full border p-1 rounded-md"
                                        >
                                            <option value="">None</option>
                                            <option value="daily">Daily</option>
                                            <option value="weekly">Weekly</option>
                                            <option value="monthly">Monthly</option>
                                        </select>
                                        <input
                                            type="email"
                                            value={editableFields.email}
                                            onChange={(e) => handleFieldChange(e, 'email')}
                                            className="w-full border p-1 rounded-md"
                                        />
                                    </div>
                                    <button
                                        onClick={() => handleUpdateReminder(reminder._id)}
                                        className="bg-green-500 text-white px-4 py-2 rounded-md shadow-sm hover:bg-green-600 transition duration-300 ml-2"
                                    >
                                        Save
                                    </button>
                                </>
                            ) : (
                                <>
                                    <div>
                                        <p className="text-gray-700">{reminder.title} - {new Date(reminder.date).toLocaleString()}</p>
                                        <p className="text-gray-500">Recurrence: {reminder.recurrence || 'None'}</p>
                                    </div>
                                    <div>
                                        <button
                                            onClick={() => handleEditReminder(reminder._id)}
                                            className="bg-blue-500 text-white px-4 py-2 rounded-md shadow-sm hover:bg-blue-600 transition duration-300 ml-2"
                                        >
                                            Edit
                                        </button>
                                        <button
                                            onClick={() => handleDeleteReminder(reminder._id)}
                                            className="bg-red-500 text-white px-4 py-2 rounded-md shadow-sm hover:bg-red-600 transition duration-300 ml-2"
                                        >
                                            Delete
                                        </button>
                                    </div>
                                </>
                            )}
                        </li>
                    ))}
                </ul>
            </div>
        </div>
    );
}