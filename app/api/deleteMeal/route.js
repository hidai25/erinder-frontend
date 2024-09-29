// app/api/deleteMeal/route.js
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

export async function DELETE(req) {
    try {
        // Parse the URL to get the ID of the meal to delete
        const { searchParams } = new URL(req.url);
        const id = searchParams.get('id');

        if (!id) {
            return new Response(JSON.stringify({ error: 'Meal ID is required' }), {
                status: 400,
                headers: { 'Content-Type': 'application/json' },
            });
        }

        // Find and delete the meal by its ID
        const deletedMeal = await Meal.findByIdAndDelete(id);

        if (!deletedMeal) {
            return new Response(JSON.stringify({ error: 'Meal not found' }), {
                status: 404,
                headers: { 'Content-Type': 'application/json' },
            });
        }

        // Respond with a success message
        return new Response(JSON.stringify({ message: 'Meal deleted successfully' }), {
            status: 200,
            headers: { 'Content-Type': 'application/json' },
        });
    } catch (error) {
        // Log and respond with an error message
        console.error('Error deleting meal:', error);
        return new Response(JSON.stringify({ error: 'Failed to delete meal', details: error.message }), {
            status: 500,
            headers: { 'Content-Type': 'application/json' },
        });
    }
}
