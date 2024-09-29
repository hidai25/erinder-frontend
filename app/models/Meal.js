// models/Meal.js
import mongoose from 'mongoose';

const MealSchema = new mongoose.Schema({
  title: { type: String, required: true },
  date: { type: Date, required: true },
  type: { type: String, required: true },
  recipe: { type: String },
  assignedMember: { type: String },
});

export default mongoose.models.Meal || mongoose.model('Meal', MealSchema);
