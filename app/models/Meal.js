import mongoose from 'mongoose';

const MealSchema = new mongoose.Schema({
    title: { type: String, required: true },
    date: { type: Date, required: true },
    type: { type: String, required: true },
    recipe: String,
    assignedMember: String,
    image: String
}, { timestamps: true });

export default mongoose.models.Meal || mongoose.model('Meal', MealSchema);