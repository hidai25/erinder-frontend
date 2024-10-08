'use client';

import React, { useState, useEffect, useCallback } from 'react';
import Image from 'next/image';
import { DndProvider, useDrag, useDrop } from 'react-dnd';
import { HTML5Backend } from 'react-dnd-html5-backend';
import { FaEdit, FaTrash, FaPlus } from 'react-icons/fa';
import { motion, AnimatePresence } from 'framer-motion';

const MEAL_TYPES = ['breakfast', 'lunch', 'dinner', 'snack'];
const CUISINES = ['Italian', 'Asian', 'American', 'Mexican', 'Indian'];

export default function MealPlanner() {
    const [meals, setMeals] = useState([]);
    const [mealOptions, setMealOptions] = useState([]);
    const [newMeal, setNewMeal] = useState({ title: '', date: '', type: '', recipe: '', assignedMember: '', image: '' });
    const [notification, setNotification] = useState({ message: '', visible: false, type: 'info' });
    const [familyMembers, setFamilyMembers] = useState([]);
    const [selectedCuisine, setSelectedCuisine] = useState('');
    const [shoppingLists, setShoppingLists] = useState({});
    const [selectedMeal, setSelectedMeal] = useState(null);

    useEffect(() => {
        fetchMeals();
        fetchFamilyMembers();
        fetchMealOptions();
    }, []);

    const showNotification = useCallback((message, type = 'info') => {
        setNotification({ message, visible: true, type });
        setTimeout(() => setNotification({ message: '', visible: false, type: 'info' }), 3000);
    }, []);

    const fetchMeals = async () => {
        const maxRetries = 3;
        let retries = 0;
        while (retries < maxRetries) {
            try {
                const response = await fetch('/api/getMeals');
                if (!response.ok) throw new Error('Failed to fetch meals');
                const data = await response.json();
                setMeals(Array.isArray(data) ? data : []);
                return; // Success, exit the function
            } catch (error) {
                retries++;
                console.error(`Attempt ${retries} failed: ${error.message}`);
                if (retries === maxRetries) {
                    showNotification('Failed to fetch meals after multiple attempts', 'error');
                } else {
                    await new Promise(resolve => setTimeout(resolve, 1000 * retries)); // Wait before retrying
                }
            }
        }
    };

    const fetchFamilyMembers = async () => {
        try {
            const response = await fetch('/api/user');
            const data = await response.json();
            setFamilyMembers(Array.isArray(data.familyMembers) ? data.familyMembers : []);
        } catch (error) {
            showNotification('Failed to fetch family members', 'error');
        }
    };

    const fetchMealOptions = async () => {
        // Simulated API call
        const options = [
            { title: 'Spaghetti Bolognese', image: '/images/pasta.webp', cuisine: 'Italian', ingredients: ['pasta', 'tomato', 'beef'] },
            { title: 'Sushi', image: '/images/salmon.webp', cuisine: 'Asian', ingredients: ['rice', 'fish', 'seaweed'] },
            { title: 'Pizza Margherita', image: '/images/pizza.webp', cuisine: 'Italian', ingredients: ['flour', 'tomato', 'mozzarella'] },
        ];
        setMealOptions(options);
    };

    const handleMealSubmit = async (e) => {
        e.preventDefault();
        try {
            const response = await fetch('/api/addMeal', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(newMeal),
            });
            if (!response.ok) throw new Error('Failed to add meal');
            showNotification('Meal added successfully', 'success');
            setNewMeal({ title: '', date: '', type: '', recipe: '', assignedMember: '', image: '' });
            fetchMeals();
            updateShoppingList(newMeal);
        } catch (error) {
            showNotification('Failed to add meal', 'error');
        }
    };

    const updateShoppingList = (meal) => {
        const selectedMeal = mealOptions.find(option => option.title === meal.title);
        if (selectedMeal) {
            setShoppingLists(prev => ({
                ...prev,
                [meal.date]: [...(prev[meal.date] || []), ...selectedMeal.ingredients]
            }));
        }
    };

    const handleDeleteMeal = async (mealId) => {
        try {
            const response = await fetch('/api/deleteMeal', {
                method: 'DELETE',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ id: mealId }),
            });
            if (!response.ok) throw new Error('Failed to delete meal');
            setMeals(prevMeals => prevMeals.filter(meal => meal._id !== mealId));
            showNotification('Meal deleted successfully', 'success');
        } catch (error) {
            showNotification('Failed to delete meal', 'error');
        }
    };

    const handleAddMember = async (newMember) => {
        try {
            const response = await fetch('/api/saveFamilyMembers', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ familyMembers: [...familyMembers, newMember] }),
            });
            if (!response.ok) throw new Error('Failed to save family members');
            setFamilyMembers(prev => [...prev, newMember]);
            showNotification('Family member added successfully', 'success');
        } catch (error) {
            showNotification('Failed to save family member', 'error');
        }
    };

    const handleDeleteMember = async (index) => {
        const updatedMembers = familyMembers.filter((_, i) => i !== index);
        try {
            const response = await fetch('/api/saveFamilyMembers', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ familyMembers: updatedMembers }),
            });
            if (!response.ok) throw new Error('Failed to save family members');
            setFamilyMembers(updatedMembers);
            showNotification('Family member deleted successfully', 'success');
        } catch (error) {
            showNotification('Failed to delete family member', 'error');
        }
    };

    const handleDrop = useCallback((item) => {
        setNewMeal(prev => ({ ...prev, assignedMember: item.name }));
    }, []);

    return (
        <DndProvider backend={HTML5Backend}>
        <div className="flex min-h-screen bg-gray-100">
            <main className="flex-grow p-6 space-y-6 overflow-y-auto">
                <motion.h1
                    initial={{ opacity: 0, y: -20 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="text-4xl font-bold mb-6"
                >
                    Meal Planner
                </motion.h1>
                
                <NotificationBar notification={notification} />
                
                <WeeklyDashboard meals={meals} />
                
                <MealSelector
                    mealOptions={mealOptions}
                    selectedCuisine={selectedCuisine}
                    onCuisineChange={setSelectedCuisine}
                    onMealSelect={setSelectedMeal}
                />

                <MealForm
                    meal={newMeal}
                    onSubmit={handleMealSubmit}
                    onChange={setNewMeal}
                    onDrop={handleDrop}
                />

                <PlannedMeals
                    meals={meals}
                    onEdit={setNewMeal}
                    onDelete={handleDeleteMeal}
                />
            </main>

            <aside className="w-1/4 min-w-[300px] p-6 bg-white shadow-lg overflow-y-auto">
                <FamilyMemberManager
                    members={familyMembers}
                    onAdd={handleAddMember}
                    onDelete={handleDeleteMember}
                />

                <ShoppingLists lists={shoppingLists} />
            </aside>

            {selectedMeal && (
                <MealDetails
                    meal={selectedMeal}
                    onClose={() => setSelectedMeal(null)}
                    onAdd={(meal) => setNewMeal(prev => ({ ...prev, ...meal }))}
                />
            )}
        </div>
    </DndProvider>
    );
}

function NotificationBar({ notification }) {
    return (
        <AnimatePresence>
            {notification.visible && (
                <motion.div
                    initial={{ opacity: 0, y: -50 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -50 }}
                    className={`p-4 rounded mb-4 ${notification.type === 'error' ? 'bg-red-500' : 'bg-green-500'} text-white`}
                >
                    {notification.message}
                </motion.div>
            )}
        </AnimatePresence>
    );
}

function WeeklyDashboard({ meals }) {
    const daysOfWeek = ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'];
    const today = new Date();
    const startOfWeek = new Date(today.setDate(today.getDate() - today.getDay()));

    const weekMeals = daysOfWeek.map((day, index) => {
        const date = new Date(startOfWeek);
        date.setDate(date.getDate() + index);
        const formattedDate = date.toISOString().split('T')[0];
        return {
            day,
            date: formattedDate,
            meals: meals.filter(meal => meal.date === formattedDate),
        };
    });

    return (
        <motion.section
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="mb-8"
        >
            <h2 className="text-2xl font-bold mb-4">Weekly Overview</h2>
            <div className="grid grid-cols-7 gap-4">
                {weekMeals.map(({ day, date, meals }) => (
                    <motion.div
                        key={day}
                        whileHover={{ scale: 1.05 }}
                        className="bg-white p-4 rounded shadow"
                    >
                        <h3 className="font-bold mb-2">{day}</h3>
                        <p className="text-sm text-gray-600 mb-2">{new Date(date).toLocaleDateString()}</p>
                        {meals.length > 0 ? (
                            <ul>
                                {meals.map(meal => (
                                    <li key={meal._id} className="text-sm">{meal.title}</li>
                                ))}
                            </ul>
                        ) : (
                            <p className="text-sm text-gray-500">No meals planned</p>
                        )}
                    </motion.div>
                ))}
            </div>
        </motion.section>
    );
}

function MealSelector({ mealOptions, selectedCuisine, onCuisineChange, onMealSelect }) {
    return (
        <motion.section
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
        >
            <h2 className="text-3xl font-bold mb-4">Choose a Meal</h2>
            <div className="mb-4">
                <label htmlFor="cuisine" className="block mb-2 font-bold">Filter by Cuisine</label>
                <select
                    id="cuisine"
                    value={selectedCuisine}
                    onChange={(e) => onCuisineChange(e.target.value)}
                    className="w-full p-2 border rounded"
                >
                    <option value="">All Cuisines</option>
                    {CUISINES.map(cuisine => (
                        <option key={cuisine} value={cuisine}>{cuisine}</option>
                    ))}
                </select>
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
                {mealOptions
                    .filter(meal => !selectedCuisine || meal.cuisine === selectedCuisine)
                    .map((meal, index) => (
                        <MealOption key={index} meal={meal} onClick={() => onMealSelect(meal)} />
                    ))}
            </div>
        </motion.section>
    );
}

function MealOption({ meal, onClick }) {
    return (
        <motion.div
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            className="bg-white p-4 rounded-lg shadow-md hover:shadow-lg transition-shadow cursor-pointer"
            onClick={onClick}
        >
            <Image src={meal.image} alt={meal.title} width={150} height={100} className="w-full h-32 object-cover rounded mb-2" />
            <h3 className="font-semibold text-lg mb-2">{meal.title}</h3>
            <p className="text-sm text-gray-600 mb-2">{meal.cuisine}</p>
        </motion.div>
    );
}

function MealDetails({ meal, onClose, onAdd }) {
    return (
        <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4"
        >
            <motion.div
                initial={{ y: -50, opacity: 0 }}
                animate={{ y: 0, opacity: 1 }}
                className="bg-white rounded-lg p-6 max-w-md w-full"
            >
                <h2 className="text-2xl font-bold mb-4">{meal.title}</h2>
                <Image src={meal.image} alt={meal.title} width={300} height={200} className="w-full h-48 object-cover rounded mb-4" />
                <p className="mb-2"><strong>Cuisine:</strong> {meal.cuisine}</p>
                <p className="mb-4"><strong>Ingredients:</strong> {meal.ingredients.join(', ')}</p>
                <div className="flex justify-end space-x-2">
                    <motion.button
                        whileHover={{ scale: 1.05 }}
                        whileTap={{ scale: 0.95 }}
                        onClick={onClose}
                        className="px-4 py-2 bg-gray-300 text-gray-800 rounded hover:bg-gray-400"
                    >
                        Close
                    </motion.button>
                    <motion.button
                        whileHover={{ scale: 1.05 }}
                        whileTap={{ scale: 0.95 }}
                        onClick={() => onAdd(meal)}
                        className="px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600"
                    >
                        Add to Meal Plan
                    </motion.button>
                    </div>
            </motion.div>
        </motion.div>
    );
}

function MealForm({ meal, onSubmit, onChange, onDrop }) {
    const handleChange = (e) => {
        const { name, value } = e.target;
        onChange(prev => ({ ...prev, [name]: value }));
    };

    const [, drop] = useDrop(() => ({
        accept: 'familyMember',
        drop: (item) => onDrop(item),
    }));

    return (
        <motion.form
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            onSubmit={onSubmit}
            className="bg-white p-6 rounded-lg shadow-md"
        >
            <h3 className="text-2xl font-bold mb-4">Add New Meal</h3>
            <div className="mb-4">
                <label htmlFor="title" className="block mb-2 font-bold">Meal Title</label>
                <input
                    type="text"
                    id="title"
                    name="title"
                    value={meal.title}
                    onChange={handleChange}
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
                    value={meal.date}
                    onChange={handleChange}
                    className="w-full p-2 border rounded"
                    required
                />
            </div>
            <div className="mb-4">
                <label htmlFor="type" className="block mb-2 font-bold">Meal Type</label>
                <select
                    id="type"
                    name="type"
                    value={meal.type}
                    onChange={handleChange}
                    className="w-full p-2 border rounded"
                    required
                >
                    <option value="">Select meal type</option>
                    {MEAL_TYPES.map(type => (
                        <option key={type} value={type}>{type.charAt(0).toUpperCase() + type.slice(1)}</option>
                    ))}
                </select>
            </div>
            <div className="mb-4">
                <label htmlFor="recipe" className="block mb-2 font-bold">Recipe/Notes</label>
                <textarea
                    id="recipe"
                    name="recipe"
                    value={meal.recipe}
                    onChange={handleChange}
                    className="w-full p-2 border rounded"
                    rows="3"
                ></textarea>
            </div>
            <div className="mb-4" ref={drop}>
                <label htmlFor="assignedMember" className="block mb-2 font-bold">Assigned To</label>
                <input
                    type="text"
                    id="assignedMember"
                    name="assignedMember"
                    value={meal.assignedMember}
                    onChange={handleChange}
                    className="w-full p-2 border rounded"
                    placeholder="Drag and drop a family member here"
                    readOnly
                />
            </div>
            <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                type="submit"
                className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600"
            >
                Add Meal
            </motion.button>
        </motion.form>
    );
}

function PlannedMeals({ meals, onEdit, onDelete }) {
    return (
        <motion.section
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
        >
            <h2 className="text-2xl font-bold mb-4">Planned Meals</h2>
            <AnimatePresence>
                {meals.map((meal) => (
                    <MealItem key={meal._id} meal={meal} onEdit={() => onEdit(meal)} onDelete={() => onDelete(meal._id)} />
                ))}
            </AnimatePresence>
        </motion.section>
    );
}

function MealItem({ meal, onEdit, onDelete }) {
    return (
        <motion.li
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            className="bg-white p-4 rounded shadow flex items-center mb-4"
        >
            {meal.image ? (
                <Image
                    src={meal.image}
                    alt={meal.title}
                    width={50}
                    height={50}
                    className="rounded mr-4 object-cover"
                />
            ) : (
                <div className="w-12 h-12 bg-gray-200 rounded mr-4 flex items-center justify-center">
                    <span className="text-gray-500">{meal.title[0]}</span>
                </div>
            )}
            <div className="flex-grow">
                <h3 className="font-bold">{meal.title}</h3>
                <p>Date: {new Date(meal.date).toLocaleDateString()}</p>
                <p>Type: {meal.type}</p>
                <p>Assigned to: {meal.assignedMember || 'Unassigned'}</p>
            </div>
            <div className="flex-shrink-0 ml-4">
                <motion.button
                    whileHover={{ scale: 1.1 }}
                    whileTap={{ scale: 0.9 }}
                    className="text-blue-500 hover:text-blue-700 mr-2"
                    onClick={onEdit}
                >
                    <FaEdit />
                </motion.button>
                <motion.button
                    whileHover={{ scale: 1.1 }}
                    whileTap={{ scale: 0.9 }}
                    className="text-red-500 hover:text-red-700"
                    onClick={onDelete}
                >
                    <FaTrash />
                </motion.button>
            </div>
        </motion.li>
    );
}

function FamilyMemberManager({ members, onAdd, onDelete }) {
    const [newMember, setNewMember] = useState({ name: '', picture: '' });

    const handleSubmit = (e) => {
        e.preventDefault();
        onAdd(newMember);
        setNewMember({ name: '', picture: '' });
    };

    return (
        <motion.section
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="mb-8"
        >
            <h3 className="text-2xl font-semibold mb-4">Family Members</h3>
            <AnimatePresence>
                {members.map((member, index) => (
                    <FamilyMember
                        key={index}
                        member={member}
                        onDelete={() => onDelete(index)}
                    />
                ))}
            </AnimatePresence>
            <form onSubmit={handleSubmit} className="mt-4 p-4 bg-gray-100 rounded shadow-lg">
                <input
                    type="text"
                    value={newMember.name}
                    onChange={(e) => setNewMember({ ...newMember, name: e.target.value })}
                    className="w-full p-2 border rounded mb-2"
                    placeholder="Enter family member name"
                    required
                />
                <input
                    type="file"
                    onChange={(e) => setNewMember({ ...newMember, picture: URL.createObjectURL(e.target.files[0]) })}
                    className="w-full p-2 border rounded mb-2"
                />
                <motion.button
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                    type="submit"
                    className="bg-green-500 text-white px-4 py-2 rounded hover:bg-green-600 w-full"
                >
                    <FaPlus className="inline-block mr-2" /> Add Member
                </motion.button>
            </form>
        </motion.section>
    );
}

function FamilyMember({ member, onDelete }) {
    const [{ isDragging }, drag] = useDrag(() => ({
        type: 'familyMember',
        item: { name: member.name },
        collect: (monitor) => ({
            isDragging: !!monitor.isDragging(),
        }),
    }));

    return (
        <motion.li
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            ref={drag}
            className="flex items-center space-x-4 mb-2 p-2 bg-gray-100 rounded cursor-move"
            style={{ opacity: isDragging ? 0.5 : 1 }}
        >
            <div className="w-10 h-10 rounded-full bg-blue-500 text-white flex items-center justify-center">
                {member.name.charAt(0).toUpperCase()}
            </div>
            <span className="flex-grow">{member.name}</span>
            <motion.button
                whileHover={{ scale: 1.1 }}
                whileTap={{ scale: 0.9 }}
                onClick={onDelete}
                className="text-red-500 hover:text-red-700"
            >
                <FaTrash />
            </motion.button>
        </motion.li>
    );
}

function ShoppingLists({ lists }) {
    return (
        <motion.section
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
        >
            <h3 className="text-2xl font-semibold mb-4">Shopping Lists</h3>
            {Object.entries(lists).map(([date, items]) => (
                <ShoppingList key={date} date={date} items={items} />
            ))}
        </motion.section>
    );
}

function ShoppingList({ date, items }) {
    return (
        <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="shopping-list bg-gray-100 p-4 rounded-lg mb-4 shadow"
        >
            <h4 className="font-bold text-lg mb-2">
                Shopping List for {new Date(date).toLocaleDateString()}:
            </h4>
            <ul className="space-y-2">
                {items.map((item, index) => (
                    <motion.li
                        key={index}
                        initial={{ opacity: 0, x: -20 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{ delay: index * 0.1 }}
                        className="flex items-center"
                    >
                        <motion.input
                            whileTap={{ scale: 0.9 }}
                            type="checkbox"
                            className="mr-2"
                        />
                        {item}
                    </motion.li>
                ))}
            </ul>
        </motion.div>
    );
}

