"use client"

import { useState } from "react"
import { useParams, useRouter } from "next/navigation"
import Link from "next/link"
import { movies, cinemas, showtimes, reviews } from "@/lib/mockData"
import { useAuth } from "@/contexts/AuthContext"
import Navbar from "@/components/Navbar"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Avatar, AvatarFallback } from "@/components/ui/avatar"
import { Textarea } from "@/components/ui/textarea"
import { Label } from "@/components/ui/label"
import { Star, Calendar, Clock, User, MapPin, Play, Heart, Share2, ChevronLeft } from "lucide-react"

export default function MovieDetailPage() {
  const params = useParams()
  const router = useRouter()
  const { user } = useAuth()
  const [newReview, setNewReview] = useState({ rating: 5, comment: "" })
  const [isSubmittingReview, setIsSubmittingReview] = useState(false)

  const movieId = Number.parseInt(params.id)
  const movie = movies.find((m) => m.id === movieId)
  const movieReviews = reviews.filter((r) => r.movieId === movieId)
  const movieShowtimes = showtimes.filter((s) => s.movieId === movieId)

  if (!movie) {
    return (
      <div className="min-h-screen bg-background">
        <Navbar />
        <div className="container mx-auto px-4 py-8">
          <div className="text-center py-12">
            <h1 className="text-2xl font-bold mb-4">Movie not found</h1>
            <Button asChild>
              <Link href="/movies">Back to Movies</Link>
            </Button>
          </div>
        </div>
      </div>
    )
  }

  const handleSubmitReview = async (e) => {
    e.preventDefault()
    if (!user) {
      router.push("/login")
      return
    }

    setIsSubmittingReview(true)
    // Simulate API call
    await new Promise((resolve) => setTimeout(resolve, 1000))

    // Add review to mock data (in real app, this would be an API call)
    const review = {
      id: reviews.length + 1,
      userId: user.id,
      movieId: movie.id,
      rating: newReview.rating,
      comment: newReview.comment,
      date: new Date().toISOString().split("T")[0],
      userName: user.name,
    }
    reviews.push(review)

    setNewReview({ rating: 5, comment: "" })
    setIsSubmittingReview(false)
  }

  const averageRating =
    movieReviews.length > 0
      ? (movieReviews.reduce((sum, review) => sum + review.rating, 0) / movieReviews.length).toFixed(1)
      : movie.rating

  return (
    <div className="min-h-screen bg-background">
      <Navbar />

      <div className="container mx-auto px-4 py-8">
        {/* Back Button */}
        <Button variant="ghost" onClick={() => router.back()} className="mb-6">
          <ChevronLeft className="h-4 w-4 mr-2" />
          Back
        </Button>

        {/* Movie Header */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 mb-8">
          {/* Movie Poster */}
          <div className="lg:col-span-1">
            <div className="relative">
              <img src={movie.poster || "/placeholder.svg"} alt={movie.title} className="w-full rounded-lg shadow-lg" />
              <Button
                size="lg"
                className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 bg-sky-500 hover:bg-sky-600 rounded-full w-16 h-16"
              >
                <Play className="h-6 w-6" />
              </Button>
            </div>
          </div>

          {/* Movie Info */}
          <div className="lg:col-span-2">
            <div className="flex items-start justify-between mb-4">
              <div>
                <h1 className="text-4xl font-bold mb-2">{movie.title}</h1>
                <div className="flex items-center space-x-4 mb-4">
                  <div className="flex items-center">
                    <Star className="h-5 w-5 text-yellow-500 mr-1" />
                    <span className="font-semibold">{averageRating}</span>
                    <span className="text-muted-foreground ml-1">({movieReviews.length} reviews)</span>
                  </div>
                  <Badge variant="outline">{movie.language}</Badge>
                </div>
              </div>
              <div className="flex space-x-2">
                <Button variant="outline" size="sm">
                  <Heart className="h-4 w-4" />
                </Button>
                <Button variant="outline" size="sm">
                  <Share2 className="h-4 w-4" />
                </Button>
              </div>
            </div>

            <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-6">
              <div>
                <p className="text-sm text-muted-foreground">Duration</p>
                <p className="font-semibold flex items-center">
                  <Clock className="h-4 w-4 mr-1" />
                  {movie.duration} min
                </p>
              </div>
              <div>
                <p className="text-sm text-muted-foreground">Release Date</p>
                <p className="font-semibold flex items-center">
                  <Calendar className="h-4 w-4 mr-1" />
                  {new Date(movie.releaseDate).toLocaleDateString()}
                </p>
              </div>
              <div>
                <p className="text-sm text-muted-foreground">Director</p>
                <p className="font-semibold flex items-center">
                  <User className="h-4 w-4 mr-1" />
                  {movie.director}
                </p>
              </div>
              <div>
                <p className="text-sm text-muted-foreground">Genre</p>
                <div className="flex flex-wrap gap-1">
                  {movie.genre.slice(0, 2).map((g, index) => (
                    <Badge key={index} variant="secondary" className="text-xs">
                      {g}
                    </Badge>
                  ))}
                </div>
              </div>
            </div>

            <div className="mb-6">
              <h3 className="text-lg font-semibold mb-2">Synopsis</h3>
              <p className="text-muted-foreground leading-relaxed">{movie.description}</p>
            </div>

            <div className="mb-6">
              <h3 className="text-lg font-semibold mb-2">Cast</h3>
              <div className="flex flex-wrap gap-2">
                {movie.cast.map((actor, index) => (
                  <Badge key={index} variant="outline">
                    {actor}
                  </Badge>
                ))}
              </div>
            </div>

            <div className="flex space-x-4">
              <Button asChild size="lg" className="bg-sky-500 hover:bg-sky-600">
                <Link href={`/movies/${movie.id}/book`}>Book Tickets</Link>
              </Button>
              <Button variant="outline" size="lg">
                Watch Trailer
              </Button>
            </div>
          </div>
        </div>

        {/* Showtimes */}
        {movieShowtimes.length > 0 && (
          <Card className="mb-8">
            <CardHeader>
              <CardTitle className="flex items-center">
                <MapPin className="h-5 w-5 mr-2" />
                Showtimes & Cinemas
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {cinemas.map((cinema) => {
                  const cinemaShowtimes = movieShowtimes.filter((s) => s.cinemaId === cinema.id)
                  if (cinemaShowtimes.length === 0) return null

                  return (
                    <div key={cinema.id} className="border rounded-lg p-4">
                      <div className="flex items-start justify-between mb-3">
                        <div>
                          <h4 className="font-semibold">{cinema.name}</h4>
                          <p className="text-sm text-muted-foreground">{cinema.location}</p>
                          <p className="text-sm text-muted-foreground">{cinema.distance}</p>
                        </div>
                        <div className="flex flex-wrap gap-1">
                          {cinema.facilities.slice(0, 3).map((facility, index) => (
                            <Badge key={index} variant="secondary" className="text-xs">
                              {facility}
                            </Badge>
                          ))}
                        </div>
                      </div>
                      <div className="flex flex-wrap gap-2">
                        {cinemaShowtimes.map((showtime) => (
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
                  )
                })}
              </div>
            </CardContent>
          </Card>
        )}

        {/* Reviews Section */}
        <Card>
          <CardHeader>
            <CardTitle>Reviews & Ratings</CardTitle>
          </CardHeader>
          <CardContent>
            {/* Add Review Form */}
            {user && (
              <form onSubmit={handleSubmitReview} className="mb-6 p-4 border rounded-lg">
                <h4 className="font-semibold mb-4">Write a Review</h4>
                <div className="space-y-4">
                  <div>
                    <Label htmlFor="rating">Rating</Label>
                    <div className="flex items-center space-x-1 mt-1">
                      {[1, 2, 3, 4, 5].map((star) => (
                        <button
                          key={star}
                          type="button"
                          onClick={() => setNewReview({ ...newReview, rating: star })}
                          className={`p-1 ${star <= newReview.rating ? "text-yellow-500" : "text-gray-300"}`}
                        >
                          <Star className="h-5 w-5 fill-current" />
                        </button>
                      ))}
                      <span className="ml-2 text-sm text-muted-foreground">
                        {newReview.rating} star{newReview.rating !== 1 ? "s" : ""}
                      </span>
                    </div>
                  </div>
                  <div>
                    <Label htmlFor="comment">Comment</Label>
                    <Textarea
                      id="comment"
                      placeholder="Share your thoughts about this movie..."
                      value={newReview.comment}
                      onChange={(e) => setNewReview({ ...newReview, comment: e.target.value })}
                      className="mt-1"
                      rows={3}
                    />
                  </div>
                  <Button
                    type="submit"
                    disabled={isSubmittingReview || !newReview.comment.trim()}
                    className="bg-sky-500 hover:bg-sky-600"
                  >
                    {isSubmittingReview ? "Submitting..." : "Submit Review"}
                  </Button>
                </div>
              </form>
            )}

            {/* Reviews List */}
            <div className="space-y-4">
              {movieReviews.length > 0 ? (
                movieReviews.map((review) => (
                  <div key={review.id} className="border-b pb-4 last:border-b-0">
                    <div className="flex items-start space-x-3">
                      <Avatar>
                        <AvatarFallback className="bg-sky-500 text-white">
                          {review.userName?.charAt(0) || "U"}
                        </AvatarFallback>
                      </Avatar>
                      <div className="flex-1">
                        <div className="flex items-center space-x-2 mb-1">
                          <span className="font-semibold">{review.userName || "Anonymous"}</span>
                          <div className="flex items-center">
                            {[...Array(5)].map((_, i) => (
                              <Star
                                key={i}
                                className={`h-4 w-4 ${
                                  i < review.rating ? "text-yellow-500 fill-current" : "text-gray-300"
                                }`}
                              />
                            ))}
                          </div>
                          <span className="text-sm text-muted-foreground">{review.date}</span>
                        </div>
                        <p className="text-muted-foreground">{review.comment}</p>
                      </div>
                    </div>
                  </div>
                ))
              ) : (
                <p className="text-center text-muted-foreground py-8">
                  No reviews yet. Be the first to review this movie!
                </p>
              )}
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
