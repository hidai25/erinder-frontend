'use client';

import { useState, useEffect } from 'react';
import { useDrop, useDrag } from 'react-dnd';

export default function Tasks() {
    const [tasks, setTasks] = useState([]);
    const [newTask, setNewTask] = useState({
        taskTitle: '',
        taskCategory: 'personal',
        taskPriority: 'medium',
        assignedMember: ''
    });
    const [notification, setNotification] = useState({ message: '', visible: false });
    const [editableId, setEditableId] = useState(null);
    const [editableFields, setEditableFields] = useState({});
    const [familyMembers, setFamilyMembers] = useState([]); // State for family members

    // Fetch tasks and family members when the component mounts
    useEffect(() => {
        fetchTasks();
        fetchFamilyMembers(); // Fetch family members
    }, []);

    // Fetch tasks from the API
    const fetchTasks = async () => {
        try {
            const response = await fetch('/api/getTasks');
            if (response.ok) {
                const data = await response.json();
                setTasks(data);
            } else {
                throw new Error('Failed to fetch tasks');
            }
        } catch (error) {
            console.error('Error fetching tasks:', error);
            showNotification('Failed to fetch tasks');
        }
    };

    // Fetch family members from the API
    const fetchFamilyMembers = async () => {
        try {
            const response = await fetch('/api/user'); // Replace with your endpoint to fetch family members
            if (response.ok) {
                const data = await response.json();
                setFamilyMembers(data.familyMembers || []);
            } else {
                throw new Error('Failed to fetch family members');
            }
        } catch (error) {
            console.error('Error fetching family members:', error);
            showNotification('Failed to fetch family members');
        }
    };

    // Drag-and-drop functionality for family members
    const [{ isOver }, drop] = useDrop(() => ({
        accept: 'familyMember',
        drop: (item) => {
            setNewTask(prev => ({ ...prev, assignedMember: item.name }));
        },
        collect: (monitor) => ({
            isOver: !!monitor.isOver(),
        }),
    }));

    const handleInputChange = (e) => {
        const { name, value } = e.target;
        setNewTask(prev => ({ ...prev, [name]: value }));
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            const response = await fetch('/api/addTask', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(newTask)
            });
            if (response.ok) {
                showNotification('Task added successfully');
                setNewTask({
                    taskTitle: '',
                    taskCategory: 'personal',
                    taskPriority: 'medium',
                    assignedMember: ''
                });
                fetchTasks();
            } else {
                throw new Error('Failed to add task');
            }
        } catch (error) {
            console.error('Error adding task:', error);
            showNotification('Failed to add task');
        }
    };

    const handleDelete = async (id) => {
        try {
            const response = await fetch(`/api/deleteTask?id=${id}`, { method: 'DELETE' });
            if (response.ok) {
                showNotification('Task deleted successfully');
                fetchTasks();
            } else {
                throw new Error('Failed to delete task');
            }
        } catch (error) {
            console.error('Error deleting task:', error);
            showNotification('Failed to delete task');
        }
    };

    const handleEdit = (id) => {
        setEditableId(id);
        const task = tasks.find(t => t._id === id);
        setEditableFields({
            taskTitle: task.taskTitle,
            taskCategory: task.taskCategory,
            taskPriority: task.taskPriority,
            assignedMember: task.assignedMember
        });
    };

    const handleUpdate = async (id) => {
        try {
            const response = await fetch('/api/updateTask', {
                method: 'PUT',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ id, ...editableFields })
            });
            if (response.ok) {
                showNotification('Task updated successfully');
                setEditableId(null);
                fetchTasks();
            } else {
                throw new Error('Failed to update task');
            }
        } catch (error) {
            console.error('Error updating task:', error);
            showNotification('Failed to update task');
        }
    };

    const handleEditableChange = (e) => {
        const { name, value } = e.target;
        setEditableFields(prev => ({ ...prev, [name]: value }));
    };

    const showNotification = (message) => {
        setNotification({ message, visible: true });
        setTimeout(() => setNotification({ message: '', visible: false }), 3000);
    };

    return (
        <div className="flex h-screen">
            {/* Left Side: Task Form */}
            <div className="flex-grow p-6 max-w-4xl mx-auto space-y-6">
                <h1 className="text-3xl font-bold mb-6">Task Management</h1>
                
                {notification.visible && (
                    <div className="bg-blue-500 text-white p-3 rounded mb-4">
                        {notification.message}
                    </div>
                )}

                <form onSubmit={handleSubmit} className="mb-8 p-4 bg-white rounded shadow" ref={drop}>
                    <div className="mb-4">
                        <label htmlFor="taskTitle" className="block mb-2">Task Title</label>
                        <input
                            type="text"
                            id="taskTitle"
                            name="taskTitle"
                            value={newTask.taskTitle}
                            onChange={handleInputChange}
                            className="w-full p-2 border rounded"
                            required
                        />
                    </div>
                    <div className="mb-4">
                        <label htmlFor="taskCategory" className="block mb-2">Task Category</label>
                        <select
                            id="taskCategory"
                            name="taskCategory"
                            value={newTask.taskCategory}
                            onChange={handleInputChange}
                            className="w-full p-2 border rounded"
                        >
                            <option value="personal">Personal</option>
                            <option value="household">Household</option>
                            <option value="urgent">Urgent</option>
                            <option value="important">Important</option>
                        </select>
                    </div>
                    <div className="mb-4">
                        <label htmlFor="taskPriority" className="block mb-2">Task Priority</label>
                        <select
                            id="taskPriority"
                            name="taskPriority"
                            value={newTask.taskPriority}
                            onChange={handleInputChange}
                            className="w-full p-2 border rounded"
                        >
                            <option value="low">Low</option>
                            <option value="medium">Medium</option>
                            <option value="high">High</option>
                        </select>
                    </div>
                    <div className="mb-4">
                        <label htmlFor="assignedMember" className="block mb-2">Assigned To</label>
                        <input
                            type="text"
                            id="assignedMember"
                            name="assignedMember"
                            value={newTask.assignedMember}
                            onChange={handleInputChange}
                            className="w-full p-2 border rounded"
                            placeholder="Drag and drop a family member here"
                            readOnly
                        />
                    </div>
                    <button type="submit" className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600">
                        Add Task
                    </button>
                </form>

                <div>
                    <h2 className="text-2xl font-bold mb-4">Tasks</h2>
                    <ul className="space-y-4">
                        {tasks.map((task) => (
                            <li key={task._id} className="bg-white p-4 rounded shadow">
                                {editableId === task._id ? (
                                    <div className="space-y-2">
                                        <input
                                            type="text"
                                            name="taskTitle"
                                            value={editableFields.taskTitle}
                                            onChange={handleEditableChange}
                                            className="w-full p-2 border rounded"
                                        />
                                        <select
                                            name="taskCategory"
                                            value={editableFields.taskCategory}
                                            onChange={handleEditableChange}
                                            className="w-full p-2 border rounded"
                                        >
                                            <option value="personal">Personal</option>
                                            <option value="household">Household</option>
                                            <option value="urgent">Urgent</option>
                                            <option value="important">Important</option>
                                        </select>
                                        <select
                                            name="taskPriority"
                                            value={editableFields.taskPriority}
                                            onChange={handleEditableChange}
                                            className="w-full p-2 border rounded"
                                        >
                                            <option value="low">Low</option>
                                            <option value="medium">Medium</option>
                                            <option value="high">High</option>
                                        </select>
                                        <input
                                            type="text"
                                            name="assignedMember"
                                            value={editableFields.assignedMember}
                                            onChange={handleEditableChange}
                                            className="w-full p-2 border rounded"
                                            placeholder="Assigned To"
                                        />
                                        <button
                                            onClick={() => handleUpdate(task._id)}
                                            className="bg-green-500 text-white px-3 py-1 rounded hover:bg-green-600 mr-2"
                                        >
                                            Save
                                        </button>
                                        <button
                                            onClick={() => setEditableId(null)}
                                            className="bg-gray-500 text-white px-3 py-1 rounded hover:bg-gray-600"
                                        >
                                            Cancel
                                        </button>
                                    </div>
                                ) : (
                                    <div>
                                        <h3 className="font-bold">{task.taskTitle}</h3>
                                        <p>Category: {task.taskCategory}</p>
                                        <p>Priority: {task.taskPriority}</p>
                                        <p>Assigned to: {task.assignedMember || 'Unassigned'}</p>
                                        <div className="mt-2">
                                            <button
                                                onClick={() => handleEdit(task._id)}
                                                className="bg-blue-500 text-white px-3 py-1 rounded hover:bg-blue-600 mr-2"
                                            >
                                                Edit
                                            </button>
                                            <button
                                                onClick={() => handleDelete(task._id)}
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

            {/* Right Side: Family Members Sidebar */}
            <div className="w-1/4 p-6 bg-white rounded-lg shadow-lg">
                <h3 className="text-xl font-semibold mb-4">Family Members</h3>
                <ul>
                    {familyMembers.map((member, index) => (
                        <FamilyMember key={index} member={member} />
                    ))}
                </ul>
            </div>
        </div>
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
