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

export async function GET() {
    try {
        const meals = await Meal.find();
        return new Response(JSON.stringify(meals), {
            status: 200,
            headers: { 'Content-Type': 'application/json' },
        });
    } catch (error) {
        console.error('Error fetching meals:', error);
        return new Response(JSON.stringify({ message: 'Error fetching meals', error }), {
            status: 500,
            headers: { 'Content-Type': 'application/json' },
        });
    }
}
