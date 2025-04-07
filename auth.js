const express = require('express');
const router = express.Router();
const User = require('../models/User');
const bcrypt = require('bcrypt');

// Register
router.post('/register', async (req, res) => {
    const { username, password } = req.body;
    const hash = await bcrypt.hash(password, 10);
    try {
        const user = new User({ username, password: hash });
        await user.save();
        res.json({ message: 'User registered' });
    } catch {
        res.status(400).json({ error: 'User exists' });
    }
});

// Login
router.post('/login', async (req, res) => {
    const { username, password } = req.body;
    const user = await User.findOne({ username });
    if (user && await bcrypt.compare(password, user.password)) {
        res.json({ message: 'Login successful', userId: user._id });
    } else {
        res.status(401).json({ error: 'Invalid credentials' });
    }
});

module.exports = router;