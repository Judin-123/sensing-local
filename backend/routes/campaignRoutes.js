// routes/campaignRoutes.js
const express = require('express');
const { body, param, validationResult } = require('express-validator');
const Campaign = require('../models/Campaign');
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

// getDateTime - Get campaign end time
router.get('/datetime/:campaignId', [
  param('campaignId').isMongoId().withMessage('Invalid campaign ID format')
], validateRequest, async (req, res, next) => {
  try {
    const { campaignId } = req.params;
    
    const campaign = await Campaign.findById(campaignId)
      .select('title endDate endTime startDate startTime');
    
    if (!campaign) {
      return res.status(404).json({
        success: false,
        message: 'Campaign not found'
      });
    }
    
    res.status(200).json({
      success: true,
      data: {
        campaignId: campaign._id,
        title: campaign.title,
        startDate: campaign.startDate,
        startTime: campaign.startTime,
        endDate: campaign.endDate,
        endTime: campaign.endTime
      }
    });
  } catch (error) {
    next(error);
  }
});

// setDateTime - Set campaign end time
router.put('/datetime/:campaignId', [
  param('campaignId').isMongoId().withMessage('Invalid campaign ID format'),
  body('endTime').notEmpty().withMessage('End time is required'),
  body('endDate').optional().isISO8601().withMessage('End date must be a valid date')
], validateRequest, async (req, res, next) => {
  try {
    const { campaignId } = req.params;
    const { endTime, endDate } = req.body;
    
    const updateData = { endTime };
    if (endDate) {
      updateData.endDate = new Date(endDate);
    }
    
    const updatedCampaign = await Campaign.findByIdAndUpdate(
      campaignId,
      updateData,
      { new: true }
    ).select('title endDate endTime startDate startTime');
    
    if (!updatedCampaign) {
      return res.status(404).json({
        success: false,
        message: 'Campaign not found'
      });
    }
    
    res.status(200).json({
      success: true,
      message: 'Campaign date/time updated successfully',
      data: {
        campaignId: updatedCampaign._id,
        title: updatedCampaign.title,
        startDate: updatedCampaign.startDate,
        startTime: updatedCampaign.startTime,
        endDate: updatedCampaign.endDate,
        endTime: updatedCampaign.endTime
      }
    });
  } catch (error) {
    next(error);
  }
});

// Get all campaigns
router.get('/campaigns', async (req, res, next) => {
  try {
    const { status, limit = 50, page = 1 } = req.query;
    
    const query = {};
    if (status) {
      query.status = status;
    }
    
    const campaigns = await Campaign.find(query)
      .populate('coordinatorId', 'name email')
      .populate('wardId', 'wardName location')
      .sort({ createdAt: -1 })
      .limit(parseInt(limit))
      .skip((parseInt(page) - 1) * parseInt(limit));
    
    const totalCount = await Campaign.countDocuments(query);
    
    res.status(200).json({
      success: true,
      count: campaigns.length,
      totalCount,
      currentPage: parseInt(page),
      totalPages: Math.ceil(totalCount / parseInt(limit)),
      data: campaigns
    });
  } catch (error) {
    next(error);
  }
});

// Get single campaign
router.get('/campaign/:campaignId', [
  param('campaignId').isMongoId().withMessage('Invalid campaign ID format')
], validateRequest, async (req, res, next) => {
  try {
    const { campaignId } = req.params;
    
    const campaign = await Campaign.findById(campaignId)
      .populate('coordinatorId', 'name email')
      .populate('wardId', 'wardName location')
      .populate('volunteerIds', 'name email role');
    
    if (!campaign) {
      return res.status(404).json({
        success: false,
        message: 'Campaign not found'
      });
    }
    
    res.status(200).json({
      success: true,
      data: campaign
    });
  } catch (error) {
    next(error);
  }
});

module.exports = router;