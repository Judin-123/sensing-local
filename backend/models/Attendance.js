// models/Attendance.js
const mongoose = require('mongoose');

const attendanceSchema = new mongoose.Schema({
  campaignId: { 
    type: mongoose.Schema.Types.ObjectId, 
    ref: 'Campaign',
    required: [true, 'Campaign ID is required']
  },
  volunteerId: { 
    type: mongoose.Schema.Types.ObjectId, 
    ref: 'User',
    required: [true, 'Volunteer ID is required']
  },
  numOfTasksAssigned: { 
    type: Number, 
    default: 0,
    min: 0
  },
  numOfTasksCompleted: { 
    type: Number, 
    default: 0,
    min: 0
  },
  hasAttended: { 
    type: Boolean, 
    default: false 
  },
  isCompleted: {
    type: Boolean,
    default: false
  },
  completedAt: {
    type: Date
  },
  attendanceTime: {
    type: Date
  },
  checkInTime: {
    type: Date
  },
  checkOutTime: {
    type: Date
  },
  notes: {
    type: String,
    trim: true
  },
  timestamp: { 
    type: Date, 
    default: Date.now 
  }
}, {
  timestamps: true
});

// Compound index for efficient queries
attendanceSchema.index({ campaignId: 1, volunteerId: 1 }, { unique: true });

// Update attendance time when marked as attended
attendanceSchema.pre('save', function(next) {
  if (this.hasAttended && !this.attendanceTime) {
    this.attendanceTime = new Date();
  }
  
  if (this.isCompleted && !this.completedAt) {
    this.completedAt = new Date();
  }
  
  next();
});

module.exports = mongoose.model('Attendance', attendanceSchema);