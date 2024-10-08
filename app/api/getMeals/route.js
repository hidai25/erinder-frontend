import mongoose from 'mongoose';
import Meal from '../../models/Meal';
import clientPromise from '../../lib/mongodb';

export async function GET() {
    try {
        console.log('Connecting to MongoDB...');
        await clientPromise;
        console.log('MongoDB connection established');

        console.log('Fetching meals...');
        const meals = await Meal.find().lean();
        console.log(`Fetched ${meals.length} meals`);
        
        if (meals.length === 0) {
            console.log('No meals found in the database');
        } else {
            console.log('Fetched meal IDs:', meals.map(meal => meal._id));
            console.log('Sample meal:', JSON.stringify(meals[0], null, 2));
        }

        return new Response(JSON.stringify(meals), {
            status: 200,
            headers: { 'Content-Type': 'application/json' },
        });
    } catch (error) {
        console.error('Error fetching meals:', error);
        return new Response(JSON.stringify({ message: 'Error fetching meals', error: error.message }), {
            status: 500,
            headers: { 'Content-Type': 'application/json' },
        });
    }
}