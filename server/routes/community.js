const express = require('express');
const mongoose = require('mongoose');
const router = express.Router();

const CommunityInsight = mongoose.model('CommunityInsight', new mongoose.Schema({
    userId: { type: mongoose.Schema.Types.ObjectId, required: true },
    content: { type: String, required: true },
    createdAt: { type: Date, default: Date.now }
}));

// Middleware to check if user is authenticated
const isAuthenticated = (req, res, next) => {
    if (req.isAuthenticated()) {
        return next();
    }
    return res.status(401).json({ message: 'Unauthorized' });
};

// Create a new community insight
router.post('/insights', isAuthenticated, async (req, res) => {
    try {
        const { content } = req.body;
        const newInsight = new CommunityInsight({
            userId: req.user._id,
            content
        });
        await newInsight.save();
        return res.status(201).json(newInsight);
    } catch (error) {
        console.error('Error creating insight:', error);
        return res.status(500).json({ message: 'Internal Server Error' });
    }
});

// Get all community insights
router.get('/insights', async (req, res) => {
    try {
        const insights = await CommunityInsight.find().populate('userId', 'username');
        return res.status(200).json(insights);
    } catch (error) {
        console.error('Error fetching insights:', error);
        return res.status(500).json({ message: 'Internal Server Error' });
    }
});

// Delete a community insight
router.delete('/insights/:id', isAuthenticated, async (req, res) => {
    try {
        const insight = await CommunityInsight.findById(req.params.id);
        if (!insight) {
            return res.status(404).json({ message: 'Insight not found' });
        }
        if (insight.userId.toString() !== req.user._id.toString()) {
            return res.status(403).json({ message: 'Forbidden' });
        }
        await insight.remove();
        return res.status(204).send();
    } catch (error) {
        console.error('Error deleting insight:', error);
        return res.status(500).json({ message: 'Internal Server Error' });
    }
});

module.exports = router;