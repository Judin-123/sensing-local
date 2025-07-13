// models/Ward.js
const mongoose = require('mongoose');

const wardSchema = new mongoose.Schema({
  wardId: { 
    type: String, 
    required: [true, 'Ward ID is required'],
    unique: true,
    trim: true
  },
  wardName: {
    type: String,
    required: [true, 'Ward name is required'],
    trim: true
  },
  location: { 
    type: String, 
    required: [true, 'Location is required'],
    trim: true
  },
  coordinates: {
    latitude: {
      type: Number,
      min: -90,
      max: 90
    },
    longitude: {
      type: Number,
      min: -180,
      max: 180
    }
  },
  tasks: [{ 
    type: mongoose.Schema.Types.ObjectId, 
    ref: 'Task' 
  }],
  isActive: {
    type: Boolean,
    default: true
  }
}, {
  timestamps: true
});

module.exports = mongoose.model('Ward', wardSchema);