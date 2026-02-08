project_collection: {
  title: String,
  description: String,
  buyerId: { type: Schema.Types.ObjectId, ref: 'User' }, // The Buyer who created it [cite: 39]
  assignedSolverId: { type: Schema.Types.ObjectId, ref: 'User', default: null }, // Assigned after selection [cite: 41]
  status: { type: String, enum: ['open', 'assigned', 'completed'], default: 'unassigned' }, // 
  
  // List of solvers who want the job [cite: 40]
  requests: [{ type: Schema.Types.ObjectId, ref: 'User' }], 

  // Nested Tasks (Sub-modules) 
  tasks: [{
    title: String,
    description: String,
    deadline: Date,
    status: { 
      type: String, 
      enum: ['pending', 'submitted', 'accepted', 'rejected'], 
      default: 'in-progress' 
    }, // 
    submission: {
       zipUrl: String,
       submittedAt: Date,
       note: String // Solver might want to add a note
    }
  }],
  
  createdAt: { type: Date, default: Date.now }
}

