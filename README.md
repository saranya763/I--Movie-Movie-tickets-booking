# iMovies Backend API

A Node.js/Express.js backend for the iMovies booking system with MongoDB integration.

## Features

- RESTful API for movie booking system
- MongoDB database with Mongoose ODM
- JWT authentication
- CRUD operations for movies, cinemas, showtimes, bookings, and users
- CORS enabled for frontend integration

## API Endpoints

### Authentication
- `POST /api/auth/register` - Register a new user
- `POST /api/auth/login` - Login user

### Movies
- `GET /api/movies` - Get all movies
- `POST /api/movies` - Create a new movie

### Cinemas
- `GET /api/cinemas` - Get all cinemas
- `POST /api/cinemas` - Create a new cinema

### Showtimes
- `GET /api/showtimes` - Get all showtimes
- `POST /api/showtimes` - Create a new showtime

### Bookings
- `GET /api/bookings` - Get all bookings
- `POST /api/bookings` - Create a new booking

## Setup Instructions

1. Install dependencies:
```bash
cd backend
npm install
```

2. Set up environment variables in `.env`:
```
PORT=5000
MONGODB_URI=mongodb://localhost:27017/imovies
JWT_SECRET=your_jwt_secret_key_here_change_in_production
NODE_ENV=development
```

3. Make sure MongoDB is running on your system

4. Seed the database with sample data:
```bash
node scripts/seedData.js
```

5. Start the server:
```bash
npm run dev
```

The API will be available at `http://localhost:5000`

## Database Models

- **Movie**: Movie information including title, genre, rating, duration, etc.
- **Cinema**: Cinema locations with screens and facilities
- **Showtime**: Movie showtimes with pricing and availability
- **User**: User accounts with authentication
- **Booking**: Movie ticket bookings

## Authentication

The API uses JWT tokens for authentication. Include the token in the Authorization header:
```
Authorization: Bearer <your_token>
```

## Sample Data

The seed script includes:
- 4 popular movies
- 3 cinema locations
- Multiple showtimes
- 2 sample users (regular user and admin)
