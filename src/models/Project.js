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
    ref: 'User',
    required: true,
  },
  assignedSolverId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    default: null,
  },
  // List of solvers who requested to work on this
  requests: [{
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User'
  }],
  // Tasks/Milestones created by Solver (or Buyer initially)
  tasks: [{
    title: String,
    description: String,
    deadline: String, // YYYY-MM-DD
    status: {
      type: String,
      enum: ['pending', 'submitted', 'accepted', 'rejected'],
      default: 'pending'
    },
    submission: {
      zipUrl: String,
      submittedAt: String, // YYYY-MM-DD
      note: String
    }
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

export default mongoose.models.Project || mongoose.model('projects', ProjectSchema);
