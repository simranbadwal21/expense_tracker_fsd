const express = require('express');
const Transaction = require('../models/Transaction');
const auth = require('../middleware/auth');

const router = express.Router();
router.use(auth); // every route below needs a logged-in user

// GET /api/transactions  -> all transactions of the logged-in user
router.get('/', async (req, res) => {
  try {
    const list = await Transaction.find({ user: req.userId }).sort({ date: -1 });
    res.json(list);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// POST /api/transactions  -> create
router.post('/', async (req, res) => {
  try {
    const { title, amount, type, category, date, note } = req.body;
    const t = await Transaction.create({
      user: req.userId, title, amount, type, category, date, note,
    });
    res.status(201).json(t);
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
});

// PUT /api/transactions/:id  -> update
router.put('/:id', async (req, res) => {
  try {
    const { title, amount, type, category, date, note } = req.body;
    const t = await Transaction.findOneAndUpdate(
      { _id: req.params.id, user: req.userId },
      { title, amount, type, category, date, note },
      { new: true, runValidators: true }
    );
    if (!t) return res.status(404).json({ message: 'Transaction not found' });
    res.json(t);
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
});

// DELETE /api/transactions/:id  -> delete
router.delete('/:id', async (req, res) => {
  try {
    const t = await Transaction.findOneAndDelete({ _id: req.params.id, user: req.userId });
    if (!t) return res.status(404).json({ message: 'Transaction not found' });
    res.json({ message: 'Deleted' });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

module.exports = router;
