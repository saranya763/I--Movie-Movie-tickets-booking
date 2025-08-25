const mongoose = require('mongoose');
const dotenv = require('dotenv');
const Movie = require('../models/Movie');
const Cinema = require('../models/Cinema');
const Showtime = require('../models/Showtime');
const User = require('../models/User');
const bcrypt = require('bcryptjs');

dotenv.config();

const connectDB = async () => {
  try {
    const conn = await mongoose.connect(process.env.MONGODB_URI);
    console.log(`MongoDB Connected: ${conn.connection.host}`);
  } catch (error) {
    console.error('Error connecting to MongoDB:', error.message);
    process.exit(1);
  }
};

const seedData = async () => {
  try {
    await connectDB();

    // Clear existing data
    await Movie.deleteMany({});
    await Cinema.deleteMany({});
    await Showtime.deleteMany({});
    await User.deleteMany({});

    console.log('Data cleared successfully');

    // Insert movies
    const movies = [
      {
        title: "Avengers: Endgame",
        genre: ["Action", "Adventure", "Drama"],
        rating: 8.4,
        duration: 181,
        language: "English",
        poster: "/generic-superhero-team-poster.png",
        backdrop: "/avengers-endgame-backdrop.png",
        releaseDate: new Date("2024-01-15"),
        description: "After the devastating events of Avengers: Infinity War, the universe is in ruins due to the efforts of the Mad Titan, Thanos. With the help of remaining allies, the Avengers must assemble once more in order to undo Thanos's actions and restore order to the universe once and for all.",
        director: "Anthony Russo, Joe Russo",
        cast: ["Robert Downey Jr.", "Chris Evans", "Mark Ruffalo", "Chris Hemsworth"],
        trailer: "https://www.youtube.com/watch?v=TcMBFSGVi1c",
        isNowShowing: true,
      },
      {
        title: "Spider-Man: No Way Home",
        genre: ["Action", "Adventure", "Sci-Fi"],
        rating: 8.2,
        duration: 148,
        language: "English",
        poster: "/generic-superhero-movie-poster.png",
        backdrop: "/spiderman-multiverse-backdrop.png",
        releaseDate: new Date("2024-01-20"),
        description: "Peter Parker's secret identity is revealed to the entire world. Desperate for help, Peter turns to Doctor Strange to make the world forget that he is Spider-Man. The spell goes horribly wrong and shatters the multiverse, bringing in foes from other Spider-Man movies.",
        director: "Jon Watts",
        cast: ["Tom Holland", "Zendaya", "Benedict Cumberbatch", "Jacob Batalon"],
        trailer: "https://www.youtube.com/watch?v=JfVOs4VSpmA",
        isNowShowing: true,
      },
      {
        title: "The Batman",
        genre: ["Action", "Crime", "Drama"],
        rating: 7.8,
        duration: 176,
        language: "English",
        poster: "/dark-knight-poster.png",
        backdrop: "/gotham-cityscape.png",
        releaseDate: new Date("2024-01-25"),
        description: "In his second year of fighting crime, Batman uncovers corruption in Gotham City that connects to his own family while facing a serial killer known as the Riddler.",
        director: "Matt Reeves",
        cast: ["Robert Pattinson", "Zoë Kravitz", "Paul Dano", "Jeffrey Wright"],
        trailer: "https://www.youtube.com/watch?v=mqqft2x_Aa4",
        isNowShowing: true,
      },
      {
        title: "Dune: Part Two",
        genre: ["Sci-Fi", "Adventure", "Drama"],
        rating: 8.6,
        duration: 166,
        language: "English",
        poster: "/dune-part-two-poster.png",
        backdrop: "/dune-part-two-desert.png",
        releaseDate: new Date("2024-02-01"),
        description: "Paul Atreides unites with Chani and the Fremen while on a warpath of revenge against the conspirators who destroyed his family. Facing a choice between the love of his life and the fate of the known universe, he endeavors to prevent a terrible future only he can foresee.",
        director: "Denis Villeneuve",
        cast: ["Timothée Chalamet", "Zendaya", "Rebecca Ferguson", "Josh Brolin"],
        trailer: "https://www.youtube.com/watch?v=Way9Dexny3w",
        isNowShowing: true,
      }
    ];

    const insertedMovies = await Movie.insertMany(movies);
    console.log('Movies seeded successfully');

    // Insert cinemas
    const cinemas = [
      {
        name: "iMovies Multiplex Downtown",
        location: "Downtown Plaza, 123 Main Street",
        distance: "2.5 km",
        facilities: ["IMAX", "Dolby Atmos", "Recliner Seats", "Food Court"],
        screens: [
          { name: "Screen 1", type: "IMAX", capacity: 300 },
          { name: "Screen 2", type: "Standard", capacity: 200 },
          { name: "Screen 3", type: "Premium", capacity: 150 },
        ],
      },
      {
        name: "iMovies Mall Central",
        location: "Central Mall, 456 Oak Avenue",
        distance: "4.2 km",
        facilities: ["4DX", "Premium Seats", "Parking", "Restaurant"],
        screens: [
          { name: "Screen 1", type: "4DX", capacity: 120 },
          { name: "Screen 2", type: "Standard", capacity: 180 },
          { name: "Screen 3", type: "Premium", capacity: 160 },
        ],
      },
      {
        name: "iMovies Westside",
        location: "Westside Complex, 789 Pine Road",
        distance: "6.8 km",
        facilities: ["Dolby Vision", "Luxury Recliners", "VIP Lounge"],
        screens: [
          { name: "Screen 1", type: "Premium", capacity: 140 },
          { name: "Screen 2", type: "Standard", capacity: 220 },
        ],
      }
    ];

    const insertedCinemas = await Cinema.insertMany(cinemas);
    console.log('Cinemas seeded successfully');

    // Insert showtimes
    const showtimes = [
      // Avengers: Endgame
      {
        movieId: insertedMovies[0]._id,
        cinemaId: insertedCinemas[0]._id,
        screenId: insertedCinemas[0].screens[0]._id,
        time: "10:00 AM",
        date: new Date("2024-01-15"),
        price: 15.99,
        availableSeats: 250,
      },
      {
        movieId: insertedMovies[0]._id,
        cinemaId: insertedCinemas[0]._id,
        screenId: insertedCinemas[0].screens[0]._id,
        time: "2:30 PM",
        date: new Date("2024-01-15"),
        price: 18.99,
        availableSeats: 180,
      },
      {
        movieId: insertedMovies[0]._id,
        cinemaId: insertedCinemas[1]._id,
        screenId: insertedCinemas[1].screens[1]._id,
        time: "11:30 AM",
        date: new Date("2024-01-15"),
        price: 14.99,
        availableSeats: 160,
      },

      // Spider-Man: No Way Home
      {
        movieId: insertedMovies[1]._id,
        cinemaId: insertedCinemas[0]._id,
        screenId: insertedCinemas[0].screens[1]._id,
        time: "12:00 PM",
        date: new Date("2024-01-20"),
        price: 16.99,
        availableSeats: 170,
      },
      {
        movieId: insertedMovies[1]._id,
        cinemaId: insertedCinemas[0]._id,
        screenId: insertedCinemas[0].screens[1]._id,
        time: "4:45 PM",
        date: new Date("2024-01-20"),
        price: 19.99,
        availableSeats: 140,
      },

      // The Batman
      {
        movieId: insertedMovies[2]._id,
        cinemaId: insertedCinemas[1]._id,
        screenId: insertedCinemas[1].screens[2]._id,
        time: "3:00 PM",
        date: new Date("2024-01-25"),
        price: 18.99,
        availableSeats: 130,
      },
      {
        movieId: insertedMovies[2]._id,
        cinemaId: insertedCinemas[1]._id,
        screenId: insertedCinemas[1].screens[2]._id,
        time: "7:45 PM",
        date: new Date("2024-01-25"),
        price: 21.99,
        availableSeats: 95,
      },

      // Dune: Part Two
      {
        movieId: insertedMovies[3]._id,
        cinemaId: insertedCinemas[0]._id,
        screenId: insertedCinemas[0].screens[0]._id,
        time: "1:00 PM",
        date: new Date("2024-02-01"),
        price: 20.99,
        availableSeats: 200,
      },
      {
        movieId: insertedMovies[3]._id,
        cinemaId: insertedCinemas[0]._id,
        screenId: insertedCinemas[0].screens[0]._id,
        time: "6:15 PM",
        date: new Date("2024-02-01"),
        price: 23.99,
        availableSeats: 150,
      }
    ];

    await Showtime.insertMany(showtimes);
    console.log('Showtimes seeded successfully');

    // Insert users
    const salt = await bcrypt.genSalt(10);
    const users = [
      {
        name: "John Doe",
        email: "john.doe@example.com",
        phone: "+1234567890",
        isAdmin: false,
        password: await bcrypt.hash("password123", salt),
      },
      {
        name: "Admin User",
        email: "admin@imovies.com",
        phone: "+1234567891",
        isAdmin: true,
        password: await bcrypt.hash("admin123", salt),
      }
    ];

    await User.insertMany(users);
    console.log('Users seeded successfully');

    console.log('All data seeded successfully!');
    process.exit(0);
  } catch (error) {
    console.error('Error seeding data:', error);
    process.exit(1);
  }
};

seedData();
