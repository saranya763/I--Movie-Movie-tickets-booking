"use client"

import { useParams, useRouter } from "next/navigation"
import Link from "next/link"
import { bookings, movies, cinemas, showtimes } from "@/lib/mockData"
import { useAuth } from "@/contexts/AuthContext"
import PrivateRoute from "@/components/PrivateRoute"
import Navbar from "@/components/Navbar"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Separator } from "@/components/ui/separator"
import { Alert, AlertDescription } from "@/components/ui/alert"
import {
  Calendar,
  Clock,
  MapPin,
  Star,
  ChevronLeft,
  Download,
  Share2,
  Mail,
  Phone,
  CreditCard,
  CheckCircle,
  X,
  AlertCircle,
  Ticket,
} from "lucide-react"

export default function BookingDetailPage() {
  const params = useParams()
  const router = useRouter()
  const { user } = useAuth()

  const bookingId = Number.parseInt(params.id)
  const booking = bookings.find((b) => b.id === bookingId && b.userId === user?.id)

  if (!booking) {
    return (
      <PrivateRoute>
        <div className="min-h-screen bg-background">
          <Navbar />
          <div className="container mx-auto px-4 py-8">
            <div className="text-center py-12">
              <h1 className="text-2xl font-bold mb-4">Booking not found</h1>
              <Button asChild>
                <Link href="/bookings">Back to Bookings</Link>
              </Button>
            </div>
          </div>
        </div>
      </PrivateRoute>
    )
  }

  const movie = movies.find((m) => m.id === booking.movieId)
  const cinema = cinemas.find((c) => c.id === booking.cinemaId)
  const showtime = showtimes.find((s) => s.id === booking.showtimeId)
  const screen = cinema?.screens.find((s) => s.id === showtime?.screenId)

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
        return <CheckCircle className="h-5 w-5" />
      case "cancelled":
        return <X className="h-5 w-5" />
      case "completed":
        return <CheckCircle className="h-5 w-5" />
      default:
        return <AlertCircle className="h-5 w-5" />
    }
  }

  const canCancelBooking = () => {
    if (!showtime || booking.status !== "confirmed") return false
    const showDateTime = new Date(`${showtime.date} ${showtime.time}`)
    const now = new Date()
    const hoursUntilShow = (showDateTime - now) / (1000 * 60 * 60)
    return hoursUntilShow > 2
  }

  const handleCancelBooking = () => {
    const bookingIndex = bookings.findIndex((b) => b.id === bookingId)
    if (bookingIndex > -1) {
      bookings[bookingIndex].status = "cancelled"
      router.refresh()
    }
  }

  return (
    <PrivateRoute>
      <div className="min-h-screen bg-background">
        <Navbar />

        <div className="container mx-auto px-4 py-8">
          {/* Back Button */}
          <Button variant="ghost" onClick={() => router.back()} className="mb-6">
            <ChevronLeft className="h-4 w-4 mr-2" />
            Back to Bookings
          </Button>

          <div className="max-w-4xl mx-auto">
            {/* Header */}
            <div className="flex items-center justify-between mb-8">
              <div>
                <h1 className="text-3xl font-bold mb-2">Booking Details</h1>
                <div className="flex items-center space-x-2">
                  <Badge variant="outline">Ref: {booking.bookingReference || `BK${booking.id}`}</Badge>
                  <Badge variant="secondary" className={`${getStatusColor(booking.status)} text-white`}>
                    {getStatusIcon(booking.status)}
                    <span className="ml-1 capitalize">{booking.status}</span>
                  </Badge>
                </div>
              </div>
              <div className="text-right">
                <p className="text-3xl font-bold">${booking.totalAmount.toFixed(2)}</p>
                <p className="text-sm text-muted-foreground">
                  Booked on {new Date(booking.bookingDate).toLocaleDateString()}
                </p>
              </div>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
              {/* Main Content */}
              <div className="lg:col-span-2 space-y-6">
                {/* Movie & Show Details */}
                <Card>
                  <CardHeader>
                    <CardTitle className="flex items-center">
                      <Ticket className="h-5 w-5 mr-2" />
                      Movie & Show Details
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="flex items-start space-x-4">
                      <img
                        src={movie?.poster || "/placeholder.svg"}
                        alt={movie?.title}
                        className="w-24 h-36 object-cover rounded"
                      />
                      <div className="flex-1">
                        <h3 className="text-xl font-bold mb-2">{movie?.title}</h3>
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm">
                          <div>
                            <p className="text-muted-foreground">Date & Time</p>
                            <p className="font-semibold flex items-center">
                              <Calendar className="h-4 w-4 mr-1" />
                              {showtime && new Date(showtime.date).toLocaleDateString()}
                            </p>
                            <p className="font-semibold flex items-center mt-1">
                              <Clock className="h-4 w-4 mr-1" />
                              {showtime?.time}
                            </p>
                          </div>
                          <div>
                            <p className="text-muted-foreground">Cinema & Screen</p>
                            <p className="font-semibold flex items-center">
                              <MapPin className="h-4 w-4 mr-1" />
                              {cinema?.name}
                            </p>
                            <p className="text-sm text-muted-foreground">{cinema?.location}</p>
                            <p className="text-sm font-medium">
                              {screen?.name} - {screen?.type}
                            </p>
                          </div>
                          <div>
                            <p className="text-muted-foreground">Duration & Rating</p>
                            <p className="font-semibold">{movie?.duration} minutes</p>
                            <p className="flex items-center">
                              <Star className="h-4 w-4 mr-1 text-yellow-500" />
                              {movie?.rating}
                            </p>
                          </div>
                          <div>
                            <p className="text-muted-foreground">Language & Genre</p>
                            <p className="font-semibold">{movie?.language}</p>
                            <p className="text-sm text-muted-foreground">{movie?.genre.slice(0, 2).join(", ")}</p>
                          </div>
                        </div>
                      </div>
                    </div>
                  </CardContent>
                </Card>

                {/* Seat Details */}
                <Card>
                  <CardHeader>
                    <CardTitle>Seat Information</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                      <div>
                        <p className="text-sm text-muted-foreground mb-2">Selected Seats ({booking.seats.length})</p>
                        <div className="flex flex-wrap gap-2">
                          {booking.seats.map((seat, index) => (
                            <Badge key={index} variant="outline" className="text-sm px-3 py-1">
                              {seat}
                            </Badge>
                          ))}
                        </div>
                      </div>
                      <div>
                        <p className="text-sm text-muted-foreground mb-2">Seat Types</p>
                        <div className="space-y-1">
                          {booking.seats.map((seat) => {
                            const isPremium = ["A", "B"].includes(seat.charAt(0))
                            return (
                              <div key={seat} className="flex items-center justify-between text-sm">
                                <span className="flex items-center">
                                  <Badge variant="outline" className="mr-2 text-xs">
                                    {seat}
                                  </Badge>
                                  {isPremium && <Star className="h-3 w-3 text-amber-500 mr-1" />}
                                  {isPremium ? "Premium" : "Standard"}
                                </span>
                                <span className="font-medium">
                                  $
                                  {screen?.type === "IMAX"
                                    ? isPremium
                                      ? "29.99"
                                      : "24.99"
                                    : isPremium
                                      ? "19.99"
                                      : "15.99"}
                                </span>
                              </div>
                            )
                          })}
                        </div>
                      </div>
                    </div>
                  </CardContent>
                </Card>

                {/* Payment Details */}
                <Card>
                  <CardHeader>
                    <CardTitle className="flex items-center">
                      <CreditCard className="h-5 w-5 mr-2" />
                      Payment Information
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                      <div>
                        <p className="text-sm text-muted-foreground mb-2">Payment Method</p>
                        <p className="font-semibold capitalize">{booking.paymentMethod || "Credit Card"}</p>
                        <p className="text-sm text-muted-foreground">**** **** **** 1234</p>
                      </div>
                      <div>
                        <p className="text-sm text-muted-foreground mb-2">Transaction Details</p>
                        <div className="space-y-1 text-sm">
                          <div className="flex justify-between">
                            <span>Subtotal</span>
                            <span>${(booking.totalAmount * 0.9).toFixed(2)}</span>
                          </div>
                          <div className="flex justify-between">
                            <span>Taxes & Fees</span>
                            <span>${(booking.totalAmount * 0.1).toFixed(2)}</span>
                          </div>
                          <Separator />
                          <div className="flex justify-between font-bold">
                            <span>Total Paid</span>
                            <span>${booking.totalAmount.toFixed(2)}</span>
                          </div>
                        </div>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </div>

              {/* Sidebar */}
              <div className="lg:col-span-1">
                <Card className="sticky top-8">
                  <CardHeader>
                    <CardTitle>Quick Actions</CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-3">
                    {booking.status === "confirmed" && (
                      <>
                        <Button className="w-full bg-sky-500 hover:bg-sky-600">
                          <Download className="h-4 w-4 mr-2" />
                          Download Ticket
                        </Button>
                        <Button variant="outline" className="w-full bg-transparent">
                          <Mail className="h-4 w-4 mr-2" />
                          Email Ticket
                        </Button>
                        <Button variant="outline" className="w-full bg-transparent">
                          <Share2 className="h-4 w-4 mr-2" />
                          Share Booking
                        </Button>
                      </>
                    )}

                    <Separator />

                    <div className="space-y-2">
                      <p className="text-sm font-medium">Need Help?</p>
                      <Button variant="outline" size="sm" className="w-full justify-start bg-transparent">
                        <Phone className="h-4 w-4 mr-2" />
                        Call Support
                      </Button>
                      <Button variant="outline" size="sm" className="w-full justify-start bg-transparent">
                        <Mail className="h-4 w-4 mr-2" />
                        Email Support
                      </Button>
                    </div>

                    {canCancelBooking() && (
                      <>
                        <Separator />
                        <Button variant="destructive" className="w-full" onClick={handleCancelBooking}>
                          Cancel Booking
                        </Button>
                      </>
                    )}

                    {booking.status === "completed" && (
                      <>
                        <Separator />
                        <Button asChild variant="outline" className="w-full bg-transparent">
                          <Link href={`/movies/${movie?.id}#reviews`}>Rate This Movie</Link>
                        </Button>
                      </>
                    )}
                  </CardContent>
                </Card>

                {/* Booking Status Info */}
                <Card className="mt-6">
                  <CardContent className="p-4">
                    <Alert>
                      <AlertCircle className="h-4 w-4" />
                      <AlertDescription>
                        {booking.status === "confirmed" &&
                          canCancelBooking() &&
                          "Free cancellation available up to 2 hours before showtime."}
                        {booking.status === "confirmed" &&
                          !canCancelBooking() &&
                          "Cancellation not available - less than 2 hours to showtime."}
                        {booking.status === "cancelled" && "This booking has been cancelled."}
                        {booking.status === "completed" && "Thank you for choosing iMovies!"}
                      </AlertDescription>
                    </Alert>
                  </CardContent>
                </Card>
              </div>
            </div>
          </div>
        </div>
      </div>
    </PrivateRoute>
  )
}
