// app/api/addMeal/route.js
import mongoose from 'mongoose';
import Meal from '../../models/Meal';

// Ensure you have a valid MongoDB connection string
const connectionString = process.env.MONGODB_URI || 'mongodb://localhost:27017/yourdatabase';

// Connect to MongoDB
mongoose.connect(connectionString).then(() => {
    console.log('Connected to MongoDB');
}).catch((error) => {
    console.error('Error connecting to MongoDB:', error);
});

export async function POST(request) {
    try {
        // Parse the incoming data from the request
        const data = await request.json();
        console.log('Data received in addMeal API:', data);

        // Create a new meal using the parsed data
        const newMeal = new Meal(data);
        
        // Save the meal to the database
        await newMeal.save();

        // Respond with a success message
        return new Response(JSON.stringify({ message: 'Meal added successfully' }), {
            status: 201,
            headers: { 'Content-Type': 'application/json' },
        });
    } catch (error) {
        // Log the error and respond with an error message
        console.error('Error adding meal:', error);

        return new Response(JSON.stringify({ error: 'Failed to add meal', details: error.message }), {
            status: 500,
            headers: { 'Content-Type': 'application/json' },
        });
    }
}

export async function GET() {
    try {
        // Fetch all meals from the database
        const meals = await Meal.find();
        return new Response(JSON.stringify(meals), {
            status: 200,
            headers: { 'Content-Type': 'application/json' },
        });
    } catch (error) {
        console.error('Error fetching meals:', error);
        return new Response(JSON.stringify({ message: 'Error fetching meals', error }), { status: 500 });
    }
}
