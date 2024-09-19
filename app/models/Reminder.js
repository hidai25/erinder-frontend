import mongoose from 'mongoose';

const reminderSchema = new mongoose.Schema({
    title: { type: String, required: true },
    date: { type: Date, required: true },
    email: { type: String, required: true },
    isSent: { type: Boolean, default: false }
});

// Export the model to use it in other parts of the application
const Reminder = mongoose.models.Reminder || mongoose.model('Reminder', reminderSchema);
export default Reminder;