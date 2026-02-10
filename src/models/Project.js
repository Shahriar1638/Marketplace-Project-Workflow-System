import mongoose from 'mongoose';

const ProjectSchema = new mongoose.Schema({
  title: {
    type: String,
    required: true,
  },
  description: {
    type: String,
    required: true,
  },
  techStack: [String], // Array of skills/tools e.g., ['React', 'Node.js']
  buyerId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'users',
    required: true,
  },
  assignedSolverId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'users',
    default: null,
  },
  assignmentDetails: {
    estimatedModules: Number,
    estimatedDeadlineForEntireProject: String // YYYY-MM-DD
  },
  // List of solvers who requested to work on this
  requests: [{
    solverId: { type: mongoose.Schema.Types.ObjectId, ref: 'users' },
    estimatedModules: Number,
    description: String,
    deadline: String,
    phoneNumber: String, // Optional, only if shared
    status: { type: String, enum: ['pending', 'accepted', 'rejected'], default: 'pending' },
    submittedAt: { type: String, default: () => new Date().toISOString().split('T')[0] }
  }],
  // Tasks/Milestones created by Solver (or Buyer initially)
  tasks: [{
    title: String,
    description: String,
    deadline: String,
    status: {
      type: String,
      enum: ['pending', 'submitted', 'accepted', 'rejected'],
      default: 'pending'
    },
    submission: {
      zipUrl: String,
      submittedAt: String, // YYYY-MM-DD
      note: String
    },
    feedback: String
  }],
  status: {
    type: String,
    enum: ['open', 'assigned', 'completed'],
    default: 'open',
  },
  budget: Number,
  createdAt: {
    type: String,
    default: () => new Date().toISOString().split('T')[0],
  },
});

export default mongoose.models.projects || mongoose.model('projects', ProjectSchema);
