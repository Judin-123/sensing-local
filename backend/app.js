// app.js

const express = require('express');
const cors = require('cors');
const morgan = require('morgan');
const errorHandler = require('./middleware/errorHandler');

// Import models FIRST to register them with Mongoose
const User = require('./models/User');
const Campaign = require('./models/Campaign');
const Ward = require('./models/Ward');
const Task = require('./models/Task');
const Attendance = require('./models/Attendance');

// Import routes
const coordinatorRoutes = require('./routes/coordinatorRoutes');
const attendanceRoutes = require('./routes/attendanceRoutes');
const userRoutes = require('./routes/userRoutes');
const taskRoutes = require('./routes/taskRoutes');
const campaignRoutes = require('./routes/campaignRoutes');
const authRoutes = require('./routes/authRoutes');

const app = express();

// CORS configuration
const corsOptions = {
  origin: ['http://localhost:3000', 'http://localhost:3001', 'http://127.0.0.1:3000', 'http://127.0.0.1:3001'],
  credentials: true,
  optionsSuccessStatus: 200,
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'PATCH', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization', 'X-Requested-With']
};

app.use(cors(corsOptions));

// Logging
if (process.env.NODE_ENV === 'development') {
  app.use(morgan('dev'));
}

// Body parsing middleware
app.use(express.json({
  limit: '10mb',
  strict: false,
  type: ['application/json', 'text/plain']
}));

app.use(express.urlencoded({
  extended: true,
  limit: '10mb'
}));

// Add middleware to handle empty bodies gracefully
app.use((req, res, next) => {
  if (req.method === 'GET' && req.get('Content-Type') === 'application/json') {
    req.headers['content-type'] = 'text/plain';
  }
  next();
});

// Health check endpoint
app.get('/health', (req, res) => {
  res.status(200).json({
    success: true,
    message: 'Server is running',
    timestamp: new Date().toISOString(),
    environment: process.env.NODE_ENV
  });
});

// API routes
app.use('/api', coordinatorRoutes);
app.use('/api', attendanceRoutes);
app.use('/api', userRoutes);
app.use('/api', taskRoutes);
app.use('/api', campaignRoutes);
app.use('/api', authRoutes);

// 404 handler
app.use('*', (req, res) => {
  res.status(404).json({
    success: false,
    message: `Route ${req.originalUrl} not found`
  });
});

// Error handling middleware (must be last)
app.use(errorHandler);

module.exports = app;