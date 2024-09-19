import mongoose from 'mongoose';

const TaskSchema = new mongoose.Schema({
    taskTitle: {
        type: String,
        required: true,
    },
    taskCategory: {
        type: String,
        required: true,
    },
    taskPriority: {
        type: String,
        required: true,
        enum: ['low', 'medium', 'high'], // Ensure valid values
    },
    assignedMember: {
        type: String,
        required: true,
    },
    createdAt: {
        type: Date,
        default: Date.now,
    },
});

const Task = mongoose.models.Task || mongoose.model('Task', TaskSchema);

export default Task;
