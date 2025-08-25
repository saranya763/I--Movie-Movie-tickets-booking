"use client"

import { useState } from "react"
import { Search, Play, Star, Calendar, MapPin } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Card, CardContent, CardHeader } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import Navbar from "@/components/Navbar"

// Mock data for movies
const featuredMovies = [
  {
    id: 1,
    title: "Avengers: Endgame",
    genre: "Action, Adventure",
    rating: 8.4,
    duration: "181 min",
    language: "English",
    poster: "/generic-superhero-team-poster.png",
    releaseDate: "2024-01-15",
    description: "The epic conclusion to the Infinity Saga",
  },
  {
    id: 2,
    title: "Spider-Man: No Way Home",
    genre: "Action, Adventure",
    rating: 8.2,
    duration: "148 min",
    language: "English",
    poster: "/generic-superhero-movie-poster.png",
    releaseDate: "2024-01-20",
    description: "Peter Parker's identity is revealed",
  },
  {
    id: 3,
    title: "The Batman",
    genre: "Action, Crime",
    rating: 7.8,
    duration: "176 min",
    language: "English",
    poster: "/dark-knight-poster.png",
    releaseDate: "2024-01-25",
    description: "A new take on the Dark Knight",
  },
  {
    id: 4,
    title: "Dune: Part Two",
    genre: "Sci-Fi, Adventure",
    rating: 8.6,
    duration: "166 min",
    language: "English",
    poster: "/dune-part-two-poster.png",
    releaseDate: "2024-02-01",
    description: "Paul Atreides unites with Chani",
  },
]

export default function HomePage() {
  const [searchQuery, setSearchQuery] = useState("");

  const handleSearch = (query) => {
    console.log("Search query:", query);
  };

  const handleBooking = () => {
    console.log("Booking button clicked");
  };

  return (
    <div className="min-h-screen bg-background">
      <Navbar />

      {/* Hero Section */}
      <section className="relative bg-gradient-to-r from-sky-500/10 to-blue-600/10 py-20">
        <div className="container mx-auto px-4 text-center">
          <h2 className="text-4xl md:text-6xl font-bold mb-6">
            Book Your Perfect
            <span className="text-sky-500"> Movie Experience</span>
          </h2>
          <p className="text-xl text-muted-foreground mb-8 max-w-2xl mx-auto">
            Discover the latest movies, find the best seats, and enjoy seamless booking with iMovies
          </p>

          {/* Search Bar */}
          <div className="max-w-2xl mx-auto relative">
            <Search className="absolute left-4 top-1/2 transform -translate-y-1/2 text-muted-foreground h-5 w-5" />
            <Input
              placeholder="Search for movies, cinemas, or events..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="pl-12 pr-4 py-6 text-lg rounded-full border-2 border-sky-200 focus:border-sky-500"
            />
            <Button 
              className="absolute right-2 top-1/2 transform -translate-y-1/2 rounded-full bg-sky-500 hover:bg-sky-600"
              onClick={() => handleSearch(searchQuery)}
            >
              Search
            </Button>
          </div>
        </div>
      </section>

      {/* Featured Movies */}
      <section className="py-16">
        <div className="container mx-auto px-4">
          <div className="flex items-center justify-between mb-8">
            <h3 className="text-3xl font-bold">Now Showing</h3>
            <Button variant="outline" className="border-sky-500 text-sky-500 hover:bg-sky-50 bg-transparent">
              View All Movies
            </Button>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {featuredMovies.map((movie) => (
              <Card
                key={movie.id}
                className="group cursor-pointer hover:shadow-lg transition-all duration-300 hover:scale-105"
              >
                <CardHeader className="p-0">
                  <div className="relative overflow-hidden rounded-t-lg">
                    <img
                      src={movie.poster || "/placeholder.svg"}
                      alt={movie.title}
                      className="w-full h-80 object-cover group-hover:scale-110 transition-transform duration-300"
                    />
                    <div className="absolute inset-0 bg-black/0 group-hover:bg-black/20 transition-colors duration-300 flex items-center justify-center">
                      <Play className="h-12 w-12 text-white opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
                    </div>
                    <Badge className="absolute top-3 right-3 bg-sky-500">
                      <Star className="h-3 w-3 mr-1" />
                      {movie.rating}
                    </Badge>
                  </div>
                </CardHeader>
                <CardContent className="p-4">
                  <h4 className="font-bold text-lg mb-2 line-clamp-1">{movie.title}</h4>
                  <p className="text-sm text-muted-foreground mb-2">{movie.genre}</p>
                  <div className="flex items-center justify-between text-sm text-muted-foreground">
                    <span className="flex items-center">
                      <Calendar className="h-4 w-4 mr-1" />
                      {movie.duration}
                    </span>
                    <span>{movie.language}</span>
                  </div>
                  <Button className="w-full mt-4 bg-sky-500 hover:bg-sky-600">Book Now</Button>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* Quick Actions */}
      <section className="py-16 bg-muted/30">
        <div className="container mx-auto px-4">
          <h3 className="text-3xl font-bold text-center mb-12">Why Choose iMovies?</h3>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div className="text-center">
              <div className="w-16 h-16 bg-sky-500 rounded-full flex items-center justify-center mx-auto mb-4">
                <MapPin className="h-8 w-8 text-white" />
              </div>
              <h4 className="text-xl font-semibold mb-2">Multiple Locations</h4>
              <p className="text-muted-foreground">Find cinemas near you with our extensive network of theaters</p>
            </div>
            <div className="text-center">
              <div className="w-16 h-16 bg-sky-500 rounded-full flex items-center justify-center mx-auto mb-4">
                <Calendar className="h-8 w-8 text-white" />
              </div>
              <h4 className="text-xl font-semibold mb-2">Easy Booking</h4>
              <p className="text-muted-foreground">
                Book your tickets in just a few clicks with our intuitive interface
              </p>
            </div>
            <div className="text-center">
              <div className="w-16 h-16 bg-sky-500 rounded-full flex items-center justify-center mx-auto mb-4">
                <Star className="h-8 w-8 text-white" />
              </div>
              <h4 className="text-xl font-semibold mb-2">Best Experience</h4>
              <p className="text-muted-foreground">Premium seats, latest technology, and exceptional service</p>
            </div>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-background border-t py-12">
        <div className="container mx-auto px-4">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
            <div>
              <h5 className="text-lg font-semibold mb-4 text-sky-500">iMovies</h5>
              <p className="text-muted-foreground">Your ultimate destination for movie ticket booking</p>
            </div>
            <div>
              <h6 className="font-semibold mb-4">Movies</h6>
              <ul className="space-y-2 text-muted-foreground">
                <li>
                  <a href="#" className="hover:text-sky-500">
                    Now Showing
                  </a>
                </li>
                <li>
                  <a href="#" className="hover:text-sky-500">
                    Coming Soon
                  </a>
                </li>
                <li>
                  <a href="#" className="hover:text-sky-500">
                    Top Rated
                  </a>
                </li>
              </ul>
            </div>
            <div>
              <h6 className="font-semibold mb-4">Support</h6>
              <ul className="space-y-2 text-muted-foreground">
                <li>
                  <a href="#" className="hover:text-sky-500">
                    Help Center
                  </a>
                </li>
                <li>
                  <a href="#" className="hover:text-sky-500">
                    Contact Us
                  </a>
                </li>
                <li>
                  <a href="#" className="hover:text-sky-500">
                    Terms of Service
                  </a>
                </li>
              </ul>
            </div>
            <div>
              <h6 className="font-semibold mb-4">Account</h6>
              <ul className="space-y-2 text-muted-foreground">
                <li>
                  <a href="#" className="hover:text-sky-500">
                    My Bookings
                  </a>
                </li>
                <li>
                  <a href="#" className="hover:text-sky-500">
                    Profile
                  </a>
                </li>
                <li>
                  <a href="#" className="hover:text-sky-500">
                    Rewards
                  </a>
                </li>
              </ul>
            </div>
          </div>
          <div className="border-t mt-8 pt-8 text-center text-muted-foreground">
            <p>&copy; 2024 iMovies. All rights reserved.</p>
          </div>
        </div>
      </footer>
    </div>
  )
}
