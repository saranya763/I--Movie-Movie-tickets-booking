const express = require('express');
const router = express.Router();
const Booking = require('../models/Booking');

// @desc    Get all bookings
// @route   GET /api/bookings
router.get('/', async (req, res) => {
  try {
    const bookings = await Booking.find()
      .populate('userId', 'name email')
      .populate('movieId', 'title poster')
      .populate('cinemaId', 'name location')
      .populate('showtimeId', 'time date price');
    res.json(bookings);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// @desc    Create a new booking
// @route   POST /api/bookings
router.post('/', async (req, res) => {
  const booking = new Booking(req.body);
  try {
    const savedBooking = await booking.save();
    res.status(201).json(savedBooking);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
});

module.exports = router;
