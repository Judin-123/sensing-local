// models/User.js
const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');

const userSchema = new mongoose.Schema({
  email: {
    type: String,
    required: [true, 'Email is required'],
    unique: true,
    lowercase: true,
    trim: true
  },
  name: {
    type: String,
    required: [true, 'Name is required'],
    trim: true
  },
  passHash: {
    type: String,
    required: [true, 'Password is required'],
    minlength: 6
  },
  role: {
    type: String,
    enum: ['volunteer', 'admin', 'coordinator'],
    default: 'volunteer'
  },
  score: {
    type: Number,
    default: 0,
    min: 0
  },
  learningComplete: {
    type: Boolean,
    default: false
  },
  phone: {
    type: String,
    trim: true
  },
  address: {
    type: String,
    trim: true
  },
  isActive: {
    type: Boolean,
    default: true
  }
}, {
  timestamps: true
});

// Hash password before saving - ONLY if password is modified
userSchema.pre('save', async function(next) {
  // Only hash the password if it has been modified (or is new)
  if (!this.isModified('passHash')) return next();
  
  try {
    const salt = await bcrypt.genSalt(12);
    this.passHash = await bcrypt.hash(this.passHash, salt);
    next();
  } catch (error) {
    next(error);
  }
});

// Compare password method
userSchema.methods.comparePassword = async function(candidatePassword) {
  return await bcrypt.compare(candidatePassword, this.passHash);
};

// Remove sensitive data from JSON output
userSchema.methods.toJSON = function() {
  const userObject = this.toObject();
  delete userObject.passHash;
  return userObject;
};

module.exports = mongoose.model('User', userSchema);