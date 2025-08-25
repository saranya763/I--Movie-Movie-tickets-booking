"use client"

import { useParams, useRouter } from "next/navigation"
import Link from "next/link"
import { cinemas, movies, showtimes } from "@/lib/mockData"
import Navbar from "@/components/Navbar"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { MapPin, Navigation, Phone, Clock, Star, ChevronLeft, Calendar } from "lucide-react"

export default function CinemaDetailPage() {
  const params = useParams()
  const router = useRouter()
  const cinemaId = Number.parseInt(params.id)
  const cinema = cinemas.find((c) => c.id === cinemaId)

  if (!cinema) {
    return (
      <div className="min-h-screen bg-background">
        <Navbar />
        <div className="container mx-auto px-4 py-8">
          <div className="text-center py-12">
            <h1 className="text-2xl font-bold mb-4">Cinema not found</h1>
            <Button asChild>
              <Link href="/cinemas">Back to Cinemas</Link>
            </Button>
          </div>
        </div>
      </div>
    )
  }

  // Get showtimes for this cinema
  const cinemaShowtimes = showtimes.filter((s) => s.cinemaId === cinemaId)

  // Group showtimes by movie
  const movieShowtimes = cinemaShowtimes.reduce((acc, showtime) => {
    const movie = movies.find((m) => m.id === showtime.movieId)
    if (movie) {
      if (!acc[movie.id]) {
        acc[movie.id] = { movie, showtimes: [] }
      }
      acc[movie.id].showtimes.push(showtime)
    }
    return acc
  }, {})

  return (
    <div className="min-h-screen bg-background">
      <Navbar />

      <div className="container mx-auto px-4 py-8">
        {/* Back Button */}
        <Button variant="ghost" onClick={() => router.back()} className="mb-6">
          <ChevronLeft className="h-4 w-4 mr-2" />
          Back
        </Button>

        {/* Cinema Header */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 mb-8">
          {/* Cinema Image Placeholder */}
          <div className="lg:col-span-1">
            <div className="aspect-video bg-gradient-to-br from-sky-100 to-blue-200 dark:from-gray-800 dark:to-gray-700 rounded-lg flex items-center justify-center">
              <div className="text-center">
                <MapPin className="h-16 w-16 text-sky-500 mx-auto mb-2" />
                <p className="text-lg font-semibold text-sky-600 dark:text-sky-400">Cinema Image</p>
              </div>
            </div>
          </div>

          {/* Cinema Info */}
          <div className="lg:col-span-2">
            <div className="flex items-start justify-between mb-4">
              <div>
                <h1 className="text-4xl font-bold mb-2">{cinema.name}</h1>
                <div className="flex items-center text-muted-foreground mb-2">
                  <MapPin className="h-5 w-5 mr-2" />
                  <span>{cinema.location}</span>
                </div>
                <div className="flex items-center text-sky-500 mb-4">
                  <Navigation className="h-5 w-5 mr-2" />
                  <span className="font-medium">{cinema.distance} away</span>
                </div>
              </div>
              <div className="text-right">
                <div className="flex items-center mb-2">
                  <Star className="h-5 w-5 text-yellow-500 mr-1" />
                  <span className="font-semibold">4.5</span>
                  <span className="text-muted-foreground ml-1">(324 reviews)</span>
                </div>
                <p className="text-sm text-muted-foreground">{cinema.screens.length} screens</p>
              </div>
            </div>

            {/* Facilities */}
            <div className="mb-6">
              <h3 className="text-lg font-semibold mb-3">Facilities & Amenities</h3>
              <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
                {cinema.facilities.map((facility, index) => (
                  <div key={index} className="flex items-center p-3 bg-muted/50 rounded-lg">
                    <div className="w-8 h-8 bg-sky-500 rounded-full flex items-center justify-center mr-3">
                      <Star className="h-4 w-4 text-white" />
                    </div>
                    <span className="text-sm font-medium">{facility}</span>
                  </div>
                ))}
              </div>
            </div>

            {/* Screens */}
            <div className="mb-6">
              <h3 className="text-lg font-semibold mb-3">Screens</h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {cinema.screens.map((screen) => (
                  <Card key={screen.id}>
                    <CardContent className="p-4">
                      <div className="flex items-center justify-between">
                        <div>
                          <h4 className="font-semibold">{screen.name}</h4>
                          <p className="text-sm text-muted-foreground">Capacity: {screen.capacity} seats</p>
                        </div>
                        <Badge
                          variant={screen.type === "IMAX" ? "default" : "secondary"}
                          className={screen.type === "IMAX" ? "bg-sky-500" : ""}
                        >
                          {screen.type}
                        </Badge>
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>
            </div>

            {/* Contact & Actions */}
            <div className="flex space-x-4">
              <Button className="bg-sky-500 hover:bg-sky-600">
                <Phone className="h-4 w-4 mr-2" />
                Call Cinema
              </Button>
              <Button variant="outline" className="bg-transparent">
                <MapPin className="h-4 w-4 mr-2" />
                Get Directions
              </Button>
            </div>
          </div>
        </div>

        {/* Current Movies & Showtimes */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center">
              <Calendar className="h-5 w-5 mr-2" />
              Now Showing
            </CardTitle>
          </CardHeader>
          <CardContent>
            {Object.keys(movieShowtimes).length > 0 ? (
              <div className="space-y-6">
                {Object.values(movieShowtimes).map(({ movie, showtimes: movieTimes }) => (
                  <div key={movie.id} className="border rounded-lg p-4">
                    <div className="flex items-start space-x-4 mb-4">
                      <img
                        src={movie.poster || "/placeholder.svg"}
                        alt={movie.title}
                        className="w-20 h-28 object-cover rounded"
                      />
                      <div className="flex-1">
                        <h4 className="font-bold text-lg mb-1">{movie.title}</h4>
                        <div className="flex items-center space-x-4 text-sm text-muted-foreground mb-2">
                          <span className="flex items-center">
                            <Clock className="h-4 w-4 mr-1" />
                            {movie.duration} min
                          </span>
                          <span className="flex items-center">
                            <Star className="h-4 w-4 mr-1" />
                            {movie.rating}
                          </span>
                          <span>{movie.language}</span>
                        </div>
                        <div className="flex flex-wrap gap-1 mb-3">
                          {movie.genre.slice(0, 3).map((g, index) => (
                            <Badge key={index} variant="outline" className="text-xs">
                              {g}
                            </Badge>
                          ))}
                        </div>
                        <p className="text-sm text-muted-foreground line-clamp-2">{movie.description}</p>
                      </div>
                    </div>

                    <div className="flex flex-wrap gap-2">
                      {movieTimes.map((showtime) => (
                        <Button
                          key={showtime.id}
                          variant="outline"
                          size="sm"
                          asChild
                          className="hover:bg-sky-50 hover:border-sky-500 bg-transparent"
                        >
                          <Link href={`/movies/${movie.id}/book?showtime=${showtime.id}`}>
                            {showtime.time}
                            <span className="ml-2 text-xs text-muted-foreground">${showtime.price}</span>
                          </Link>
                        </Button>
                      ))}
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <div className="text-center py-8">
                <Clock className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
                <p className="text-muted-foreground">No showtimes available at this cinema</p>
              </div>
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
