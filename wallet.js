const express = require('express');
const router = express.Router();
const User = require('../models/User');
const Transaction = require('../models/Transaction');

// Get balance
router.get('/balance/:userId', async (req, res) => {
    const user = await User.findById(req.params.userId);
    res.json({ balance: user.balance });
});

// Add money
router.post('/add', async (req, res) => {
    const { userId, amount } = req.body;
    await User.findByIdAndUpdate(userId, { $inc: { balance: amount } });
    res.json({ message: 'Money added' });
});

// Send money
router.post('/send', async (req, res) => {
    const { fromId, toUsername, amount } = req.body;
    const fromUser = await User.findById(fromId);
    const toUser = await User.findOne({ username: toUsername });

    if (!toUser || fromUser.balance < amount) {
        return res.status(400).json({ error: 'Invalid transaction' });
    }

    await User.findByIdAndUpdate(fromId, { $inc: { balance: -amount } });
    await User.findByIdAndUpdate(toUser._id, { $inc: { balance: amount } });

    const txn = new Transaction({ from: fromUser.username, to: toUsername, amount });
    await txn.save();

    res.json({ message: 'Transfer successful' });
});

// Get transaction history
router.get('/history/:username', async (req, res) => {
    const txns = await Transaction.find({
        $or: [{ from: req.params.username }, { to: req.params.username }]
    });
    res.json(txns);
});

module.exports = router;