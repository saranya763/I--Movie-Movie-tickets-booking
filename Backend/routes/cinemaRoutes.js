const express = require('express');
const router = express.Router();
const Cinema = require('../models/Cinema');

// @desc    Get all cinemas
// @route   GET /api/cinemas
router.get('/', async (req, res) => {
  try {
    const cinemas = await Cinema.find();
    res.json(cinemas);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// @desc    Create a new cinema
// @route   POST /api/cinemas
router.post('/', async (req, res) => {
  const cinema = new Cinema(req.body);
  try {
    const savedCinema = await cinema.save();
    res.status(201).json(savedCinema);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
});

module.exports = router;
