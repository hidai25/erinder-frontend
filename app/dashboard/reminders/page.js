'use client';

import { useState, useEffect } from 'react';
import { useDrop, useDrag } from 'react-dnd'; // Import both useDrop and useDrag
// import DndProviderWrapper from '../../components/DndProvider'; // Import your wrapper

export default function Reminders() {
    const [reminders, setReminders] = useState([]);
    const [newReminder, setNewReminder] = useState({
        title: '',
        date: '',
        email: '',
        recurrence: '',
        assignedMember: ''
    });
    const [notification, setNotification] = useState({ message: '', visible: false });
    const [editingId, setEditingId] = useState(null);
    const [familyMembers, setFamilyMembers] = useState([]);

    // Fetch reminders on component mount
    useEffect(() => {
        fetchReminders();
        fetchFamilyMembers(); // Fetch family members to be displayed on the right sidebar
    }, []);

    // Fetch reminders from the API
    const fetchReminders = async () => {
        try {
            const response = await fetch('/api/getReminders');
            if (!response.ok) throw new Error('Failed to fetch reminders');
            const data = await response.json();
            setReminders(data);
        } catch (error) {
            console.error('Error fetching reminders:', error);
            showNotification('Failed to fetch reminders', 'error');
        }
    };

    // Fetch family members for drag-and-drop functionality
    const fetchFamilyMembers = async () => {
        try {
            const response = await fetch('/api/user'); // Assuming your user endpoint returns family members
            if (!response.ok) throw new Error('Failed to fetch family members');
            const data = await response.json();
            setFamilyMembers(data.familyMembers || []);
        } catch (error) {
            console.error('Error fetching family members:', error);
            showNotification('Failed to fetch family members', 'error');
        }
    };

    // Drag-and-drop functionality for family members
    const [{ isOver }, drop] = useDrop(() => ({
        accept: 'familyMember',
        drop: (item) => {
            setNewReminder(prev => ({ ...prev, assignedMember: item.name }));
        },
        collect: (monitor) => ({
            isOver: !!monitor.isOver(),
        }),
    }));

    // Handle input changes for the reminder form
    const handleInputChange = (e) => {
        const { name, value } = e.target;
        setNewReminder(prev => ({ ...prev, [name]: value }));
    };

    // Handle form submission for adding a reminder
    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            const response = await fetch('/api/addReminder', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(newReminder)
            });
            if (!response.ok) throw new Error('Failed to add reminder');
            showNotification('Reminder added successfully', 'success');
            setNewReminder({ title: '', date: '', email: '', recurrence: '', assignedMember: '' });
            fetchReminders();
        } catch (error) {
            console.error('Error adding reminder:', error);
            showNotification('Failed to add reminder', 'error');
        }
    };

    // Handle the start of editing a reminder
    const handleEdit = (id) => {
        setEditingId(id);
    };

    // Handle updating a reminder
    const handleUpdate = async (id, updatedReminder) => {
        try {
            const response = await fetch(`/api/updateReminder?id=${id}`, {
                method: 'PUT',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(updatedReminder)
            });
            if (!response.ok) throw new Error('Failed to update reminder');
            showNotification('Reminder updated successfully', 'success');
            setEditingId(null);
            fetchReminders();
        } catch (error) {
            console.error('Error updating reminder:', error);
            showNotification('Failed to update reminder', 'error');
        }
    };

    // Handle deleting a reminder
    const handleDelete = async (id) => {
        try {
            const response = await fetch(`/api/deleteReminder?id=${id}`, { method: 'DELETE' });
            if (!response.ok) throw new Error('Failed to delete reminder');
            showNotification('Reminder deleted successfully', 'success');
            fetchReminders();
        } catch (error) {
            console.error('Error deleting reminder:', error);
            showNotification('Failed to delete reminder', 'error');
        }
    };

    // Show notification message
    const showNotification = (message, type = 'info') => {
        setNotification({ message, visible: true, type });
        setTimeout(() => setNotification({ message: '', visible: false, type: 'info' }), 3000);
    };

    // Utility functions to get today's and tomorrow's date
    const getTodayDate = () => {
        const today = new Date();
        today.setMinutes(today.getMinutes() - today.getTimezoneOffset());
        return today.toISOString().slice(0, 16);
    };

    const getTomorrowDate = () => {
        const tomorrow = new Date();
        tomorrow.setDate(tomorrow.getDate() + 1);
        tomorrow.setMinutes(tomorrow.getMinutes() - tomorrow.getTimezoneOffset());
        return tomorrow.toISOString().slice(0, 16);
    };

    return (
        // <DndProviderWrapper> {/* Wrapping your Reminders component */}
            <div className="flex h-screen">
                {/* Left side: Reminder form */}
                <div className="flex-grow p-6 max-w-4xl mx-auto space-y-6">
                    <h1 className="text-3xl font-bold mb-6">Reminders</h1>

                    {notification.visible && (
                        <div className={`p-4 rounded mb-4 ${notification.type === 'error' ? 'bg-red-500' : 'bg-green-500'} text-white`}>
                            {notification.message}
                        </div>
                    )}

                    <form onSubmit={handleSubmit} className={`mb-8 p-4 bg-white rounded shadow ${isOver ? 'border-blue-500' : 'border-transparent'}`} ref={drop}>
                        <div className="mb-4">
                            <label htmlFor="title" className="block mb-2 font-bold">Title</label>
                            <input
                                type="text"
                                id="title"
                                name="title"
                                value={newReminder.title}
                                onChange={handleInputChange}
                                className="w-full p-2 border rounded"
                                required
                            />
                        </div>
                        <div className="mb-4">
                            <label htmlFor="date" className="block mb-2 font-bold">Date and Time</label>
                            <input
                                type="datetime-local"
                                id="date"
                                name="date"
                                value={newReminder.date}
                                onChange={handleInputChange}
                                className="w-full p-2 border rounded"
                                required
                            />
                            <div className="mt-2 space-x-2">
                                <button
                                    type="button"
                                    onClick={() => setNewReminder(prev => ({ ...prev, date: getTodayDate() }))}
                                    className="bg-blue-500 text-white px-3 py-1 rounded hover:bg-blue-600"
                                >
                                    Today
                                </button>
                                <button
                                    type="button"
                                    onClick={() => setNewReminder(prev => ({ ...prev, date: getTomorrowDate() }))}
                                    className="bg-green-500 text-white px-3 py-1 rounded hover:bg-green-600"
                                >
                                    Tomorrow
                                </button>
                            </div>
                        </div>
                        <div className="mb-4">
                            <label htmlFor="email" className="block mb-2 font-bold">Email</label>
                            <input
                                type="email"
                                id="email"
                                name="email"
                                value={newReminder.email}
                                onChange={handleInputChange}
                                className="w-full p-2 border rounded"
                                required
                            />
                        </div>
                        <div className="mb-4">
                            <label htmlFor="recurrence" className="block mb-2 font-bold">Recurrence</label>
                            <select
                                id="recurrence"
                                name="recurrence"
                                value={newReminder.recurrence}
                                onChange={handleInputChange}
                                className="w-full p-2 border rounded"
                            >
                                <option value="">None</option>
                                <option value="daily">Daily</option>
                                <option value="weekly">Weekly</option>
                                <option value="monthly">Monthly</option>
                            </select>
                        </div>
                        <div className="mb-4">
                            <label htmlFor="assignedMember" className="block mb-2 font-bold">Assigned To</label>
                            <input
                                type="text"
                                id="assignedMember"
                                name="assignedMember"
                                value={newReminder.assignedMember}
                                className="w-full p-2 border rounded"
                                placeholder="Drag and drop a family member here"
                                readOnly
                            />
                        </div>
                        <button type="submit" className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600">
                            Add Reminder
                        </button>
                    </form>

                    <div>
                        <h2 className="text-2xl font-bold mb-4">Scheduled Reminders</h2>
                        <ul className="space-y-4">
                            {reminders.map((reminder) => (
                                <li key={reminder._id} className="bg-white p-4 rounded shadow">
                                    {editingId === reminder._id ? (
                                        <ReminderEditForm
                                            reminder={reminder}
                                            onSave={(updatedReminder) => handleUpdate(reminder._id, updatedReminder)}
                                            onCancel={() => setEditingId(null)}
                                        />
                                    ) : (
                                        <div>
                                            <h3 className="font-bold">{reminder.title}</h3>
                                            <p>Date: {new Date(reminder.date).toLocaleString()}</p>
                                            <p>Email: {reminder.email}</p>
                                            <p>Recurrence: {reminder.recurrence || 'None'}</p>
                                            <p>Assigned to: {reminder.assignedMember || 'Unassigned'}</p>
                                            <div className="mt-2 space-x-2">
                                                <button
                                                    onClick={() => handleEdit(reminder._id)}
                                                    className="bg-yellow-500 text-white px-3 py-1 rounded hover:bg-yellow-600"
                                                >
                                                    Edit
                                                </button>
                                                <button
                                                    onClick={() => handleDelete(reminder._id)}
                                                    className="bg-red-500 text-white px-3 py-1 rounded hover:bg-red-600"
                                                >
                                                    Delete
                                                </button>
                                            </div>
                                        </div>
                                    )}
                                </li>
                            ))}
                        </ul>
                    </div>
                </div>

                {/* Right side: Family Members section */}
                <div className="w-1/4 p-6 bg-white rounded-lg shadow-lg">
                    <h3 className="text-xl font-semibold mb-4">Family Members</h3>
                    <ul>
                        {familyMembers.map((member, index) => (
                            <FamilyMember key={index} member={member} />
                        ))}
                    </ul>
                </div>
            </div>
        // </DndProviderWrapper>
    );
}

// FamilyMember component for drag-and-drop functionality
function FamilyMember({ member }) {
    const [{ isDragging }, drag] = useDrag(() => ({
        type: 'familyMember',
        item: { name: member.name },
        collect: (monitor) => ({
            isDragging: !!monitor.isDragging(),
        }),
    }));

    return (
        <li className="flex items-center space-x-4 mb-2" ref={drag} style={{ opacity: isDragging ? 0.5 : 1 }}>
            <div className="w-10 h-10 rounded-full bg-gray-200 flex items-center justify-center">
                {member.name.charAt(0).toUpperCase()}
            </div>
            <span>{member.name}</span>
        </li>
    );
}

// ReminderEditForm component for editing reminders
function ReminderEditForm({ reminder, onSave, onCancel }) {
    const [editedReminder, setEditedReminder] = useState(reminder);

    const handleChange = (e) => {
        const { name, value } = e.target;
        setEditedReminder(prev => ({ ...prev, [name]: value }));
    };

    const handleSubmit = (e) => {
        e.preventDefault();
        onSave(editedReminder);
    };

    return (
        <form onSubmit={handleSubmit} className="space-y-4">
            <input
                type="text"
                name="title"
                value={editedReminder.title}
                onChange={handleChange}
                className="w-full p-2 border rounded"
                required
            />
            <input
                type="datetime-local"
                name="date"
                value={editedReminder.date.slice(0, 16)}
                onChange={handleChange}
                className="w-full p-2 border rounded"
                required
            />
            <input
                type="email"
                name="email"
                value={editedReminder.email}
                onChange={handleChange}
                className="w-full p-2 border rounded"
                required
            />
            <select
                name="recurrence"
                value={editedReminder.recurrence}
                onChange={handleChange}
                className="w-full p-2 border rounded"
            >
                <option value="">None</option>
                <option value="daily">Daily</option>
                <option value="weekly">Weekly</option>
                <option value="monthly">Monthly</option>
            </select>
            <input
                type="text"
                name="assignedMember"
                value={editedReminder.assignedMember}
                onChange={handleChange}
                className="w-full p-2 border rounded"
                placeholder="Assigned To"
            />
            <div className="space-x-2">
                <button type="submit" className="bg-green-500 text-white px-3 py-1 rounded hover:bg-green-600">
                    Save
                </button>
                <button type="button" onClick={onCancel} className="bg-gray-500 text-white px-3 py-1 rounded hover:bg-gray-600">
                    Cancel
                </button>
            </div>
        </form>
    );
}
