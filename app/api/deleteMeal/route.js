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
    console.log('DELETE request received');
    try {
        const body = await req.json();
        console.log('Received body:', body);
        const { id } = body;

        if (!id) {
            console.log('No ID provided');
            return new Response(JSON.stringify({ error: 'Meal ID is required' }), {
                status: 400,
                headers: { 'Content-Type': 'application/json' },
            });
        }

        console.log('Attempting to delete meal with ID:', id);
        
        // Log all meals in the database
        const allMeals = await Meal.find({});
        console.log('All meals in database:', allMeals.map(meal => ({ id: meal._id, title: meal.title })));

        // Find and delete the meal by its ID
        const deletedMeal = await Meal.findByIdAndDelete(id);

        if (!deletedMeal) {
            console.log('Meal not found');
            return new Response(JSON.stringify({ error: 'Meal not found' }), {
                status: 404,
                headers: { 'Content-Type': 'application/json' },
            });
        }

        console.log('Meal deleted successfully:', deletedMeal);
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