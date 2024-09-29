'use client';

import { useState, useEffect } from 'react';
import { useDrop, useDrag } from 'react-dnd';

export default function MealPlanner() {
    const [meals, setMeals] = useState([]);
    const [newMeal, setNewMeal] = useState({
        title: '',
        date: '',
        type: '',
        recipe: '',
        assignedMember: ''
    });
    const [notification, setNotification] = useState({ message: '', visible: false });
    const [editingId, setEditingId] = useState(null);
    const [familyMembers, setFamilyMembers] = useState([]);

    useEffect(() => {
        fetchMeals();
        fetchFamilyMembers();
    }, []);

    const fetchMeals = async () => {
        try {
            const response = await fetch('/api/getMeals');
            if (!response.ok) throw new Error('Failed to fetch meals');
            const data = await response.json();
            setMeals(data);
        } catch (error) {
            console.error('Error fetching meals:', error);
            showNotification('Failed to fetch meals', 'error');
        }
    };

    const fetchFamilyMembers = async () => {
        try {
            const response = await fetch('/api/user');
            if (!response.ok) throw new Error('Failed to fetch family members');
            const data = await response.json();
            setFamilyMembers(data.familyMembers || []);
        } catch (error) {
            console.error('Error fetching family members:', error);
            showNotification('Failed to fetch family members', 'error');
        }
    };

    const [{ isOver }, drop] = useDrop(() => ({
        accept: 'familyMember',
        drop: (item) => {
            setNewMeal(prev => ({ ...prev, assignedMember: item.name }));
        },
        collect: (monitor) => ({
            isOver: !!monitor.isOver(),
        }),
    }));

    const handleInputChange = (e) => {
        const { name, value } = e.target;
        setNewMeal(prev => ({ ...prev, [name]: value }));
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            const response = await fetch('/api/addMeal', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(newMeal)
            });
            if (!response.ok) throw new Error('Failed to add meal');
            showNotification('Meal added successfully', 'success');
            setNewMeal({ title: '', date: '', type: '', recipe: '', assignedMember: '' });
            fetchMeals();
        } catch (error) {
            console.error('Error adding meal:', error);
            showNotification('Failed to add meal', 'error');
        }
    };

    const handleEdit = (id) => {
        setEditingId(id);
    };

    const handleUpdate = async (id, updatedMeal) => {
        try {
            const response = await fetch(`/api/updateMeal?id=${id}`, {
                method: 'PUT',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(updatedMeal)
            });
            if (!response.ok) throw new Error('Failed to update meal');
            showNotification('Meal updated successfully', 'success');
            setEditingId(null);
            fetchMeals();
        } catch (error) {
            console.error('Error updating meal:', error);
            showNotification('Failed to update meal', 'error');
        }
    };

    const handleDelete = async (id) => {
        try {
            const response = await fetch(`/api/deleteMeal?id=${id}`, { method: 'DELETE' });
            if (!response.ok) throw new Error('Failed to delete meal');
            showNotification('Meal deleted successfully', 'success');
            fetchMeals();
        } catch (error) {
            console.error('Error deleting meal:', error);
            showNotification('Failed to delete meal', 'error');
        }
    };

    const showNotification = (message, type = 'info') => {
        setNotification({ message, visible: true, type });
        setTimeout(() => setNotification({ message: '', visible: false, type: 'info' }), 3000);
    };

    return (
        <div className="flex h-screen">
            <div className="flex-grow p-6 max-w-4xl mx-auto space-y-6">
                <h1 className="text-3xl font-bold mb-6">Meal Planner</h1>

                {notification.visible && (
                    <div className={`p-4 rounded mb-4 ${notification.type === 'error' ? 'bg-red-500' : 'bg-green-500'} text-white`}>
                        {notification.message}
                    </div>
                )}

                <form onSubmit={handleSubmit} className={`mb-8 p-4 bg-white rounded shadow ${isOver ? 'border-blue-500' : 'border-transparent'}`} ref={drop}>
                    <div className="mb-4">
                        <label htmlFor="title" className="block mb-2 font-bold">Meal Title</label>
                        <input
                            type="text"
                            id="title"
                            name="title"
                            value={newMeal.title}
                            onChange={handleInputChange}
                            className="w-full p-2 border rounded"
                            required
                        />
                    </div>
                    <div className="mb-4">
                        <label htmlFor="date" className="block mb-2 font-bold">Date</label>
                        <input
                            type="date"
                            id="date"
                            name="date"
                            value={newMeal.date}
                            onChange={handleInputChange}
                            className="w-full p-2 border rounded"
                            required
                        />
                    </div>
                    <div className="mb-4">
                        <label htmlFor="type" className="block mb-2 font-bold">Meal Type</label>
                        <select
                            id="type"
                            name="type"
                            value={newMeal.type}
                            onChange={handleInputChange}
                            className="w-full p-2 border rounded"
                            required
                        >
                            <option value="">Select meal type</option>
                            <option value="breakfast">Breakfast</option>
                            <option value="lunch">Lunch</option>
                            <option value="dinner">Dinner</option>
                            <option value="snack">Snack</option>
                        </select>
                    </div>
                    <div className="mb-4">
                        <label htmlFor="recipe" className="block mb-2 font-bold">Recipe/Notes</label>
                        <textarea
                            id="recipe"
                            name="recipe"
                            value={newMeal.recipe}
                            onChange={handleInputChange}
                            className="w-full p-2 border rounded"
                            rows="3"
                        ></textarea>
                    </div>
                    <div className="mb-4">
                        <label htmlFor="assignedMember" className="block mb-2 font-bold">Assigned To</label>
                        <input
                            type="text"
                            id="assignedMember"
                            name="assignedMember"
                            value={newMeal.assignedMember}
                            className="w-full p-2 border rounded"
                            placeholder="Drag and drop a family member here"
                            readOnly
                        />
                    </div>
                    <button type="submit" className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600">
                        Add Meal
                    </button>
                </form>

                <div>
                    <h2 className="text-2xl font-bold mb-4">Planned Meals</h2>
                    <ul className="space-y-4">
                        {meals.map((meal) => (
                            <li key={meal._id} className="bg-white p-4 rounded shadow">
                                {editingId === meal._id ? (
                                    <MealEditForm
                                        meal={meal}
                                        onSave={(updatedMeal) => handleUpdate(meal._id, updatedMeal)}
                                        onCancel={() => setEditingId(null)}
                                    />
                                ) : (
                                    <div>
                                        <h3 className="font-bold">{meal.title}</h3>
                                        <p>Date: {new Date(meal.date).toLocaleDateString()}</p>
                                        <p>Type: {meal.type}</p>
                                        <p>Recipe/Notes: {meal.recipe}</p>
                                        <p>Assigned to: {meal.assignedMember || 'Unassigned'}</p>
                                        <div className="mt-2 space-x-2">
                                            <button
                                                onClick={() => handleEdit(meal._id)}
                                                className="bg-yellow-500 text-white px-3 py-1 rounded hover:bg-yellow-600"
                                            >
                                                Edit
                                            </button>
                                            <button
                                                onClick={() => handleDelete(meal._id)}
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

function FamilyMember({ member }) {
    const [{ isDragging }, drag] = useDrag(() => ({
        type: 'familyMember',
        item: { name: member.name },
        collect: (monitor) => ({
            isDragging: !!monitor.isDragging(),
        }),
    }));

    return (
        <li
            className="flex items-center space-x-4 mb-2"
            ref={drag}
            style={{ opacity: isDragging ? 0.5 : 1 }}
        >
            <div className="w-10 h-10 rounded-full bg-gray-200 flex items-center justify-center">
                {member.name.charAt(0).toUpperCase()}
            </div>
            <span>{member.name}</span>
        </li>
    );
}


function MealEditForm({ meal, onSave, onCancel }) {
    const [editedMeal, setEditedMeal] = useState(meal);

    const handleChange = (e) => {
        const { name, value } = e.target;
        setEditedMeal(prev => ({ ...prev, [name]: value }));
    };

    const handleSubmit = (e) => {
        e.preventDefault();
        onSave(editedMeal);
    };

    return (
        <form onSubmit={handleSubmit} className="space-y-4">
            <input
                type="text"
                name="title"
                value={editedMeal.title}
                onChange={handleChange}
                className="w-full p-2 border rounded"
                required
            />
            <input
                type="date"
                name="date"
                value={editedMeal.date.split('T')[0]}
                onChange={handleChange}
                className="w-full p-2 border rounded"
                required
            />
            <select
                name="type"
                value={editedMeal.type}
                onChange={handleChange}
                className="w-full p-2 border rounded"
                required
            >
                <option value="breakfast">Breakfast</option>
                <option value="lunch">Lunch</option>
                <option value="dinner">Dinner</option>
                <option value="snack">Snack</option>
            </select>
            <textarea
                name="recipe"
                value={editedMeal.recipe}
                onChange={handleChange}
                className="w-full p-2 border rounded"
                rows="3"
            ></textarea>
            <input
                type="text"
                name="assignedMember"
                value={editedMeal.assignedMember}
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