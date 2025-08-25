"use client"

import { useState, useMemo } from "react"
import Link from "next/link"
import { useRouter } from "next/navigation"
import { bookings, movies, cinemas, showtimes } from "@/lib/mockData"
import { useAuth } from "@/contexts/AuthContext"
import PrivateRoute from "@/components/PrivateRoute"
import Navbar from "@/components/Navbar"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Input } from "@/components/ui/input"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Alert, AlertDescription } from "@/components/ui/alert"
import { Calendar, Clock, MapPin, Ticket, Search, Filter, Download, X, CheckCircle, AlertCircle } from "lucide-react"

export default function BookingsPage() {
  const { user } = useAuth()
  const router = useRouter()
  const [searchQuery, setSearchQuery] = useState("")
  const [statusFilter, setStatusFilter] = useState("all")
  const [sortBy, setSortBy] = useState("date")

  // Get user bookings with movie and cinema details
  const userBookings = useMemo(() => {
    if (!user) return []

    return bookings
      .filter((booking) => booking.userId === user.id)
      .map((booking) => {
        const movie = movies.find((m) => m.id === booking.movieId)
        const cinema = cinemas.find((c) => c.id === booking.cinemaId)
        const showtime = showtimes.find((s) => s.id === booking.showtimeId)

        return {
          ...booking,
          movie,
          cinema,
          showtime,
        }
      })
      .filter((booking) => booking.movie && booking.cinema && booking.showtime)
  }, [user])

  // Filter and sort bookings
  const filteredBookings = useMemo(() => {
    const filtered = userBookings.filter((booking) => {
      const matchesSearch =
        booking.movie.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
        booking.cinema.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        booking.bookingReference?.toLowerCase().includes(searchQuery.toLowerCase())

      const matchesStatus = statusFilter === "all" || booking.status === statusFilter

      return matchesSearch && matchesStatus
    })

    // Sort bookings
    filtered.sort((a, b) => {
      switch (sortBy) {
        case "date":
          return new Date(b.bookingDate) - new Date(a.bookingDate)
        case "showtime":
          return new Date(b.showtime.date) - new Date(a.showtime.date)
        case "movie":
          return a.movie.title.localeCompare(b.movie.title)
        case "amount":
          return b.totalAmount - a.totalAmount
        default:
          return 0
      }
    })

    return filtered
  }, [userBookings, searchQuery, statusFilter, sortBy])

  const handleCancelBooking = async (bookingId) => {
    // Find booking and update status
    const bookingIndex = bookings.findIndex((b) => b.id === bookingId)
    if (bookingIndex > -1) {
      bookings[bookingIndex].status = "cancelled"
      // Force re-render by updating state
      setSearchQuery(searchQuery + " ")
      setSearchQuery(searchQuery.trim())
    }
  }

  const getStatusColor = (status) => {
    switch (status) {
      case "confirmed":
        return "bg-green-500"
      case "cancelled":
        return "bg-red-500"
      case "completed":
        return "bg-blue-500"
      default:
        return "bg-gray-500"
    }
  }

  const getStatusIcon = (status) => {
    switch (status) {
      case "confirmed":
        return <CheckCircle className="h-4 w-4" />
      case "cancelled":
        return <X className="h-4 w-4" />
      case "completed":
        return <CheckCircle className="h-4 w-4" />
      default:
        return <AlertCircle className="h-4 w-4" />
    }
  }

  const canCancelBooking = (booking) => {
    const showDateTime = new Date(`${booking.showtime.date} ${booking.showtime.time}`)
    const now = new Date()
    const hoursUntilShow = (showDateTime - now) / (1000 * 60 * 60)
    return booking.status === "confirmed" && hoursUntilShow > 2
  }

  return (
    <PrivateRoute>
      <div className="min-h-screen bg-background">
        <Navbar />

        <div className="container mx-auto px-4 py-8">
          {/* Header */}
          <div className="flex items-center justify-between mb-8">
            <div>
              <h1 className="text-4xl font-bold mb-2">My Bookings</h1>
              <p className="text-muted-foreground">Manage your movie ticket bookings</p>
            </div>
            <Button asChild className="bg-sky-500 hover:bg-sky-600">
              <Link href="/movies">Book New Tickets</Link>
            </Button>
          </div>

          {/* Search and Filters */}
          <div className="bg-card rounded-lg p-6 mb-8 border">
            <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
              {/* Search */}
              <div className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground h-4 w-4" />
                <Input
                  placeholder="Search bookings..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="pl-10"
                />
              </div>

              {/* Status Filter */}
              <Select value={statusFilter} onValueChange={setStatusFilter}>
                <SelectTrigger>
                  <SelectValue placeholder="Status" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Status</SelectItem>
                  <SelectItem value="confirmed">Confirmed</SelectItem>
                  <SelectItem value="cancelled">Cancelled</SelectItem>
                  <SelectItem value="completed">Completed</SelectItem>
                </SelectContent>
              </Select>

              {/* Sort By */}
              <Select value={sortBy} onValueChange={setSortBy}>
                <SelectTrigger>
                  <SelectValue placeholder="Sort by" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="date">Booking Date</SelectItem>
                  <SelectItem value="showtime">Show Date</SelectItem>
                  <SelectItem value="movie">Movie Title</SelectItem>
                  <SelectItem value="amount">Amount</SelectItem>
                </SelectContent>
              </Select>

              {/* Clear Filters */}
              <Button
                variant="outline"
                onClick={() => {
                  setSearchQuery("")
                  setStatusFilter("all")
                }}
                className="bg-transparent"
              >
                <Filter className="h-4 w-4 mr-2" />
                Clear Filters
              </Button>
            </div>
          </div>

          {/* Results Count */}
          <div className="flex items-center justify-between mb-6">
            <p className="text-muted-foreground">
              Showing {filteredBookings.length} of {userBookings.length} bookings
            </p>
          </div>

          {/* Bookings List */}
          {filteredBookings.length > 0 ? (
            <div className="space-y-6">
              {filteredBookings.map((booking) => (
                <Card key={booking.id} className="hover:shadow-lg transition-shadow duration-300">
                  <CardContent className="p-6">
                    <div className="flex items-start space-x-4">
                      {/* Movie Poster */}
                      <img
                        src={booking.movie.poster || "/placeholder.svg"}
                        alt={booking.movie.title}
                        className="w-20 h-28 object-cover rounded"
                      />

                      {/* Booking Details */}
                      <div className="flex-1">
                        <div className="flex items-start justify-between mb-4">
                          <div>
                            <h3 className="text-xl font-bold mb-1">{booking.movie.title}</h3>
                            <div className="flex items-center space-x-4 text-sm text-muted-foreground mb-2">
                              <span className="flex items-center">
                                <Calendar className="h-4 w-4 mr-1" />
                                {new Date(booking.showtime.date).toLocaleDateString()}
                              </span>
                              <span className="flex items-center">
                                <Clock className="h-4 w-4 mr-1" />
                                {booking.showtime.time}
                              </span>
                              <span className="flex items-center">
                                <MapPin className="h-4 w-4 mr-1" />
                                {booking.cinema.name}
                              </span>
                            </div>
                            <div className="flex items-center space-x-2 mb-2">
                              <Badge variant="secondary" className={`${getStatusColor(booking.status)} text-white`}>
                                {getStatusIcon(booking.status)}
                                <span className="ml-1 capitalize">{booking.status}</span>
                              </Badge>
                              {booking.bookingReference && (
                                <Badge variant="outline">Ref: {booking.bookingReference}</Badge>
                              )}
                            </div>
                          </div>
                          <div className="text-right">
                            <p className="text-2xl font-bold">${booking.totalAmount.toFixed(2)}</p>
                            <p className="text-sm text-muted-foreground">
                              Booked on {new Date(booking.bookingDate).toLocaleDateString()}
                            </p>
                          </div>
                        </div>

                        {/* Seats */}
                        <div className="mb-4">
                          <p className="text-sm text-muted-foreground mb-1">Seats ({booking.seats.length}):</p>
                          <div className="flex flex-wrap gap-1">
                            {booking.seats.map((seat, index) => (
                              <Badge key={index} variant="outline" className="text-xs">
                                {seat}
                              </Badge>
                            ))}
                          </div>
                        </div>

                        {/* Actions */}
                        <div className="flex items-center space-x-3">
                          <Button asChild variant="outline" size="sm" className="bg-transparent">
                            <Link href={`/bookings/${booking.id}`}>View Details</Link>
                          </Button>

                          {booking.status === "confirmed" && (
                            <Button variant="outline" size="sm" className="bg-transparent">
                              <Download className="h-4 w-4 mr-2" />
                              Download Ticket
                            </Button>
                          )}

                          {canCancelBooking(booking) && (
                            <Button variant="destructive" size="sm" onClick={() => handleCancelBooking(booking.id)}>
                              Cancel Booking
                            </Button>
                          )}

                          {booking.status === "completed" && (
                            <Button asChild variant="outline" size="sm" className="bg-transparent">
                              <Link href={`/movies/${booking.movie.id}#reviews`}>Rate Movie</Link>
                            </Button>
                          )}
                        </div>

                        {/* Cancellation Policy */}
                        {booking.status === "confirmed" && (
                          <Alert className="mt-4">
                            <AlertCircle className="h-4 w-4" />
                            <AlertDescription>
                              {canCancelBooking(booking)
                                ? "Free cancellation available up to 2 hours before showtime."
                                : "Cancellation not available - less than 2 hours to showtime."}
                            </AlertDescription>
                          </Alert>
                        )}
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          ) : (
            <div className="text-center py-12">
              <div className="w-24 h-24 bg-muted rounded-full flex items-center justify-center mx-auto mb-4">
                <Ticket className="h-12 w-12 text-muted-foreground" />
              </div>
              <h3 className="text-xl font-semibold mb-2">
                {userBookings.length === 0 ? "No bookings yet" : "No bookings found"}
              </h3>
              <p className="text-muted-foreground mb-4">
                {userBookings.length === 0
                  ? "Start by booking your first movie ticket!"
                  : "Try adjusting your search criteria or filters"}
              </p>
              <Button asChild className="bg-sky-500 hover:bg-sky-600">
                <Link href="/movies">Browse Movies</Link>
              </Button>
            </div>
          )}
        </div>
      </div>
    </PrivateRoute>
  )
}
