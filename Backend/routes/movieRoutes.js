const express = require('express');
const router = express.Router();
const Movie = require('../models/Movie');

// @desc    Get all movies
// @route   GET /api/movies
router.get('/', async (req, res) => {
  try {
    const movies = await Movie.find();
    res.json(movies);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// @desc    Create a new movie
// @route   POST /api/movies
router.post('/', async (req, res) => {
  const movie = new Movie(req.body);
  try {
    const savedMovie = await movie.save();
    res.status(201).json(savedMovie);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
});

module.exports = router;
