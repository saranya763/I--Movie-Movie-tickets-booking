const express = require('express');
const router = express.Router();
const Showtime = require('../models/Showtime');

// @desc    Get all showtimes
// @route   GET /api/showtimes
router.get('/', async (req, res) => {
  try {
    const showtimes = await Showtime.find()
      .populate('movieId', 'title poster')
      .populate('cinemaId', 'name location');
    res.json(showtimes);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// @desc    Create a new showtime
// @route   POST /api/showtimes
router.post('/', async (req, res) => {
  const showtime = new Showtime(req.body);
  try {
    const savedShowtime = await showtime.save();
    res.status(201).json(savedShowtime);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
});

module.exports = router;
