const express = require('express');
const Contact = require('../models/Contact');
const router = express.Router();

// POST /api/contact — Save a new contact message
router.post('/', async (req, res) => {
  const { name, email, message } = req.body;

  if (!name || !email || !message) {
    return res.status(400).json({ message: 'Please provide name, email, and message.' });
  }

  try {
    const contact = await Contact.create({ name, email, message });
    res.status(201).json(contact);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

module.exports = router;
