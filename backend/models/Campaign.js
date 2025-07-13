// models/Campaign.js
const mongoose = require('mongoose');

const campaignSchema = new mongoose.Schema({
  title: {
    type: String,
    required: [true, 'Campaign title is required'],
    trim: true
  },
  description: {
    type: String,
    trim: true
  },
  wardId: { 
    type: mongoose.Schema.Types.ObjectId, 
    ref: 'Ward',
    required: [true, 'Ward ID is required']
  },
  startLoc: { 
    type: String, 
    required: [true, 'Start location is required'],
    trim: true
  },
  endLoc: { 
    type: String, 
    required: [true, 'End location is required'],
    trim: true
  },
  coordinatorId: { 
    type: mongoose.Schema.Types.ObjectId, 
    ref: 'User',
    required: [true, 'Coordinator ID is required']
  },
  volunteerIds: [{ 
    type: mongoose.Schema.Types.ObjectId, 
    ref: 'User' 
  }],
  startDate: { 
    type: Date, 
    required: [true, 'Start date is required']
  },
  endDate: { 
    type: Date, 
    required: [true, 'End date is required']
  },
  startTime: { 
    type: String, 
    required: [true, 'Start time is required']
  },
  endTime: { 
    type: String, 
    required: [true, 'End time is required']
  },
  isDone: { 
    type: Boolean, 
    default: false 
  },
  maxVolunteers: {
    type: Number,
    default: 10,
    min: 1
  },
  status: {
    type: String,
    enum: ['planned', 'active', 'completed', 'cancelled'],
    default: 'planned'
  }
}, {
  timestamps: true
});

// Validate end date is after start date
campaignSchema.pre('save', function(next) {
  if (this.endDate <= this.startDate) {
    next(new Error('End date must be after start date'));
  }
  next();
});

module.exports = mongoose.model('Campaign', campaignSchema);