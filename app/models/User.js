// models/User.js
import mongoose from 'mongoose';

const UserSchema = new mongoose.Schema({
  name: String,
  familyMembers: [String],
});

export default mongoose.models.User || mongoose.model('User', UserSchema);
