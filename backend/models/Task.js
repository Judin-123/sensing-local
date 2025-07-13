// models/Task.js
const mongoose = require('mongoose');

const taskSchema = new mongoose.Schema({
  campaignId: { 
    type: mongoose.Schema.Types.ObjectId, 
    ref: 'Campaign',
    required: [true, 'Campaign ID is required']
  },
  taskId: { 
    type: String, 
    required: [true, 'Task ID is required'],
    trim: true
  },
  title: {
    type: String,
    required: [true, 'Task title is required'],
    trim: true
  },
  description: {
    type: String,
    trim: true
  },
  volunteerId: { 
    type: mongoose.Schema.Types.ObjectId, 
    ref: 'User'
  },
  location: { 
    type: String, 
    required: [true, 'Location is required'],
    trim: true
  },
  coordinates: {
    latitude: Number,
    longitude: Number
  },
  isCompleted: { 
    type: Boolean, 
    default: false 
  },
  completedAt: {
    type: Date
  },
  assignedAt: {
    type: Date
  },
  toolData: {
    type: String,
    trim: true
  },
  priority: { 
    type: Number,
    enum: [1, 2, 3, 4, 5],
    default: 3
  },
  estimatedDuration: {
    type: Number, // in minutes
    default: 30
  },
  status: {
    type: String,
    enum: ['pending', 'assigned', 'in-progress', 'completed', 'cancelled'],
    default: 'pending'
  }
}, {
  timestamps: true
});

// Update completedAt when task is marked as completed
taskSchema.pre('save', function(next) {
  if (this.isCompleted && !this.completedAt) {
    this.completedAt = new Date();
    this.status = 'completed';
  }
  
  if (this.volunteerId && this.status === 'pending') {
    this.status = 'assigned';
  }
  
  if (this.volunteerId && !this.assignedAt) {
    this.assignedAt = new Date();
  }
  
  next();
});

module.exports = mongoose.model('Task', taskSchema);