import mongoose from 'mongoose';

const UserSchema = new mongoose.Schema({
  name: {
    type: String,
    required: [true, 'Please provide a name'],
  },
  email: {
    type: String,
    required: [true, 'Please provide an email'],
    unique: true,
  },
  password: {
    type: String,
    required: [true, 'Please provide a password'],
  },
  role: {
    type: String,
    enum: ['User', 'Problem Solver', 'Buyer', 'Admin'],
    default: 'User',
  },
  requestStatus: {
    requestedRole: {
      type: String,
      enum: ['Buyer', 'Problem Solver'],
    },
    status: {
      type: String,
      enum: ['pending', 'rejected'],
      default: 'pending',
    },
    submittedAt: {
      type: String,
      default: () => new Date().toISOString().split('T')[0],
    }
  },
  profile: {
    bio: String,
    skills: [String],
    phone: String,
    github: String,
  },
  createdAt: {
    type: String,
    default: () => new Date().toISOString().split('T')[0],
  },
});

export default mongoose.models.users || mongoose.model('users', UserSchema);
