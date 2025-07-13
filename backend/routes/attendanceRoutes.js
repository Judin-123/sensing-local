// routes/taskRoutes.js
const express = require('express');
const { body, param, validationResult } = require('express-validator');
const Task = require('../models/Task');
const Campaign = require('../models/Campaign');
const User = require('../models/User');
const router = express.Router();

// Validation middleware
const validateRequest = (req, res, next) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({
      success: false,
      message: 'Validation failed',
      errors: errors.array()
    });
  }
  next();
};

// GetAvailableTasks - Takes campaignId and returns tasks where volunteerId is none/null
router.get('/available-tasks/:campaignId', [
  param('campaignId').isMongoId().withMessage('Invalid campaign ID format')
], validateRequest, async (req, res, next) => {
  try {
    const { campaignId } = req.params;
    
    // Verify campaign exists
    const campaign = await Campaign.findById(campaignId);
    if (!campaign) {
      return res.status(404).json({
        success: false,
        message: 'Campaign not found'
      });
    }
    
    // Find tasks with no assigned volunteer
    const availableTasks = await Task.find({
      campaignId: campaignId,
      $or: [
        { volunteerId: null },
        { volunteerId: { $exists: false } }
      ]
    }).select('_id taskId title description location priority status estimatedDuration');
    
    res.status(200).json({
      success: true,
      data: {
        campaign: {
          id: campaign._id,
          title: campaign.title
        },
        availableTasks: availableTasks.map(task => ({
          taskId: task._id,
          taskIdentifier: task.taskId,
          title: task.title,
          description: task.description,
          location: task.location,
          priority: task.priority,
          status: task.status,
          estimatedDuration: task.estimatedDuration
        })),
        totalAvailable: availableTasks.length
      }
    });
  } catch (error) {
    next(error);
  }
});

// AssignTasks - Takes campaignId, volunteerId, taskId and assigns task to volunteer
router.post('/assign-task', [
  body('campaignId').isMongoId().withMessage('Invalid campaign ID format'),
  body('volunteerId').isMongoId().withMessage('Invalid volunteer ID format'),
  body('taskId').isMongoId().withMessage('Invalid task ID format')
], validateRequest, async (req, res, next) => {
  try {
    const { campaignId, volunteerId, taskId } = req.body;
    
    // Verify campaign, volunteer, and task exist
    const [campaign, volunteer, task] = await Promise.all([
      Campaign.findById(campaignId),
      User.findById(volunteerId),
      Task.findById(taskId)
    ]);
    
    if (!campaign) {
      return res.status(404).json({
        success: false,
        message: 'Campaign not found'
      });
    }
    
    if (!volunteer) {
      return res.status(404).json({
        success: false,
        message: 'Volunteer not found'
      });
    }
    
    if (!task) {
      return res.status(404).json({
        success: false,
        message: 'Task not found'
      });
    }
    
    // Verify task belongs to the campaign
    if (task.campaignId.toString() !== campaignId) {
      return res.status(400).json({
        success: false,
        message: 'Task does not belong to the specified campaign'
      });
    }
    
    // Check if task is already assigned
    if (task.volunteerId) {
      return res.status(400).json({
        success: false,
        message: 'Task is already assigned to another volunteer'
      });
    }
    
    // Assign task to volunteer
    const updatedTask = await Task.findByIdAndUpdate(
      taskId,
      { 
        volunteerId: volunteerId,
        status: 'assigned',
        assignedAt: new Date()
      },
      { new: true }
    ).populate('volunteerId', 'name email')
     .populate('campaignId', 'title');
    
    res.status(200).json({
      success: true,
      message: 'Task assigned successfully',
      data: {
        task: updatedTask,
        volunteer: {
          id: volunteer._id,
          name: volunteer.name,
          email: volunteer.email
        },
        campaign: {
          id: campaign._id,
          title: campaign.title
        }
      }
    });
  } catch (error) {
    next(error);
  }
});

// Get all tasks for a campaign
router.get('/tasks/:campaignId', [
  param('campaignId').isMongoId().withMessage('Invalid campaign ID format')
], validateRequest, async (req, res, next) => {
  try {
    const { campaignId } = req.params;
    
    // Verify campaign exists
    const campaign = await Campaign.findById(campaignId);
    if (!campaign) {
      return res.status(404).json({
        success: false,
        message: 'Campaign not found'
      });
    }
    
    const tasks = await Task.find({ campaignId })
      .populate('volunteerId', 'name email')
      .sort({ priority: 1, createdAt: 1 });
    
    res.status(200).json({
      success: true,
      data: {
        campaign: {
          id: campaign._id,
          title: campaign.title
        },
        tasks: tasks,
        totalTasks: tasks.length,
        assignedTasks: tasks.filter(task => task.volunteerId).length,
        availableTasks: tasks.filter(task => !task.volunteerId).length
      }
    });
  } catch (error) {
    next(error);
  }
});

module.exports = router;