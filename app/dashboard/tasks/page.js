'use client';

import { useState, useEffect } from 'react';

export default function Tasks() {
    const [taskTitle, setTaskTitle] = useState('');
    const [taskCategory, setTaskCategory] = useState('personal');
    const [taskPriority, setTaskPriority] = useState('medium');
    const [familyMembers, setFamilyMembers] = useState(['John', 'Jane', 'Alice']);
    const [assignedMember, setAssignedMember] = useState('John');
    const [tasks, setTasks] = useState([]);
    const [notification, setNotification] = useState({ message: '', visible: false });
    const [editableId, setEditableId] = useState(null);
    const [editableFields, setEditableFields] = useState({});

    useEffect(() => {
        fetchTasks();
    }, []);

    const fetchTasks = async () => {
        try {
            const response = await fetch('/api/getTasks');
            if (response.ok) {
                const data = await response.json();
                setTasks(data);
            } else {
                console.error('Failed to fetch tasks');
            }
        } catch (error) {
            console.error('Error fetching tasks:', error);
        }
    };

    const handleAddTask = async (e) => {
        e.preventDefault();
        const response = await fetch('/api/addTask', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({ taskTitle, taskCategory, taskPriority, assignedMember })
        });

        const result = await response.json();
        setNotification({ message: result.message, visible: true });

        setTaskTitle('');
        setTaskCategory('personal');
        setTaskPriority('medium');
        setAssignedMember('John');
        fetchTasks();
        setTimeout(() => {
            setNotification({ ...notification, visible: false });
        }, 5000);
    };

    const handleEditTask = (id) => {
        setEditableId(id);
        const task = tasks.find(task => task._id === id);
        setEditableFields({
            taskTitle: task.taskTitle,
            taskCategory: task.taskCategory,
            taskPriority: task.taskPriority,
            assignedMember: task.assignedMember
        });
    };

    const handleFieldChange = (e, field) => {
        setEditableFields({
            ...editableFields,
            [field]: e.target.value
        });
    };

    const handleUpdateTask = async (id) => {
        try {
            const response = await fetch('/api/updateTask', {
                method: 'PUT',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({ id, ...editableFields })
            });

            const result = await response.json();
            setNotification({ message: result.message, visible: true });

            setEditableId(null);
            fetchTasks();
            setTimeout(() => {
                setNotification({ ...notification, visible: false });
            }, 5000);
        } catch (error) {
            console.error('Error updating task:', error);
        }
    };

    const handleDeleteTask = async (id) => {
        try {
            const response = await fetch('/api/deleteTask', {
                method: 'DELETE',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({ id })
            });

            const result = await response.json();
            setNotification({ message: result.message, visible: true });

            fetchTasks();
            setTimeout(() => {
                setNotification({ ...notification, visible: false });
            }, 5000);
        } catch (error) {
            console.error('Error deleting task:', error);
        }
    };

    return (
        <div className="p-6 space-y-6">
            {notification.visible && (
                <div className="bg-blue-500 text-white p-4 rounded-md fixed top-4 left-1/2 transform -translate-x-1/2 shadow-lg">
                    {notification.message}
                </div>
            )}
            <h2 className="text-2xl font-bold mb-6">Task Management</h2>
            <form onSubmit={handleAddTask} className="space-y-4 bg-white p-4 rounded-md shadow-md">
                <div>
                    <label htmlFor="taskTitle" className="block text-sm font-medium text-gray-700">Task Title</label>
                    <input
                        type="text"
                        id="taskTitle"
                        value={taskTitle}
                        onChange={(e) => setTaskTitle(e.target.value)}
                        required
                        className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
                    />
                </div>
                <div>
                    <label htmlFor="taskCategory" className="block text-sm font-medium text-gray-700">Task Category</label>
                    <select
                        id="taskCategory"
                        value={taskCategory}
                        onChange={(e) => setTaskCategory(e.target.value)}
                        className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
                    >
                        <option value="personal">Personal</option>
                        <option value="household">Household</option>
                        <option value="urgent">Urgent</option>
                        <option value="important">Important</option>
                    </select>
                </div>
                <div>
                    <label htmlFor="taskPriority" className="block text-sm font-medium text-gray-700">Task Priority</label>
                    <select
                        id="taskPriority"
                        value={taskPriority}
                        onChange={(e) => setTaskPriority(e.target.value)}
                        className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
                    >
                        <option value="low">Low</option>
                        <option value="medium">Medium</option>
                        <option value="high">High</option>
                    </select>
                </div>
                <div>
                    <label htmlFor="assignedMember" className="block text-sm font-medium text-gray-700">Assign To</label>
                    <select
                        id="assignedMember"
                        value={assignedMember}
                        onChange={(e) => setAssignedMember(e.target.value)}
                        className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
                    >
                        {familyMembers.map(member => (
                            <option key={member} value={member}>{member}</option>
                        ))}
                    </select>
                </div>
                <button type="submit" className="bg-indigo-600 text-white px-6 py-2 rounded-md shadow-sm hover:bg-indigo-700 transition duration-300">Add Task</button>
            </form>

            <div className="mt-8">
                <h3 className="text-lg font-bold mb-4">Tasks</h3>
                <ul className="space-y-4">
                    {tasks.map((task) => (
                        <li key={task._id} className="bg-white p-4 rounded-md shadow-md flex justify-between items-center">
                            {editableId === task._id ? (
                                <>
                                    <div className="flex-1 space-y-2">
                                        <input
                                            type="text"
                                            value={editableFields.taskTitle}
                                            onChange={(e) => handleFieldChange(e, 'taskTitle')}
                                            className="w-full border p-1 rounded-md"
                                        />
                                        <select
                                            value={editableFields.taskCategory}
                                            onChange={(e) => handleFieldChange(e, 'taskCategory')}
                                            className="w-full border p-1 rounded-md"
                                        >
                                            <option value="personal">Personal</option>
                                            <option value="household">Household</option>
                                            <option value="urgent">Urgent</option>
                                            <option value="important">Important</option>
                                        </select>
                                        <select
                                            value={editableFields.taskPriority}
                                            onChange={(e) => handleFieldChange(e, 'taskPriority')}
                                            className="w-full border p-1 rounded-md"
                                        >
                                            <option value="low">Low</option>
                                            <option value="medium">Medium</option>
                                            <option value="high">High</option>
                                        </select>
                                        <select
                                            value={editableFields.assignedMember}
                                            onChange={(e) => handleFieldChange(e, 'assignedMember')}
                                            className="w-full border p-1 rounded-md"
                                        >
                                            {familyMembers.map(member => (
                                                <option key={member} value={member}>{member}</option>
                                            ))}
                                        </select>
                                    </div>
                                    <button
                                        onClick={() => handleUpdateTask(task._id)}
                                        className="bg-green-500 text-white px-4 py-2 rounded-md shadow-sm hover:bg-green-600 transition duration-300 ml-2"
                                    >
                                        Save
                                    </button>
                                </>
                            ) : (
                                <>
                                    <div>
                                        <p className="text-gray-700">{task.taskTitle} - {task.taskCategory} ({task.taskPriority})</p>
                                        <p className="text-gray-500">Assigned to: {task.assignedMember}</p>
                                    </div>
                                    <div>
                                        <button
                                            onClick={() => handleEditTask(task._id)}
                                            className="bg-blue-500 text-white px-4 py-2 rounded-md shadow-sm hover:bg-blue-600 transition duration-300 ml-2"
                                        >
                                            Edit
                                        </button>
                                        <button
                                            onClick={() => handleDeleteTask(task._id)}
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
