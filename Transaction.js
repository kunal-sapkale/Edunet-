const mongoose = require('mongoose');

const transactionSchema = new mongoose.Schema({
    from: String,
    to: String,
    amount: Number,
    date: { type: Date, default: Date.now },
});

module.exports = mongoose.model('Transaction', transactionSchema);