// app/api/updateMeal/route.js
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

export async function PUT(req) {
    try {
        // Parse the URL to get the ID of the meal to update
        const { searchParams } = new URL(req.url);
        const id = searchParams.get('id');

        if (!id) {
            return new Response(JSON.stringify({ error: 'Meal ID is required' }), {
                status: 400,
                headers: { 'Content-Type': 'application/json' },
            });
        }

        // Parse the request body for the updated meal data
        const data = await req.json();

        // Update the meal by ID and return the new version of the meal
        const updatedMeal = await Meal.findByIdAndUpdate(id, data, { new: true });

        if (!updatedMeal) {
            return new Response(JSON.stringify({ error: 'Meal not found' }), {
                status: 404,
                headers: { 'Content-Type': 'application/json' },
            });
        }

        // Respond with the updated meal
        return new Response(JSON.stringify({ message: 'Meal updated successfully', meal: updatedMeal }), {
            status: 200,
            headers: { 'Content-Type': 'application/json' },
        });
    } catch (error) {
        // Log and respond with an error message
        console.error('Error updating meal:', error);
        return new Response(JSON.stringify({ error: 'Failed to update meal', details: error.message }), {
            status: 500,
            headers: { 'Content-Type': 'application/json' },
        });
    }
}
