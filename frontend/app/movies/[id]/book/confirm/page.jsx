"use client"

import { useState, useEffect } from "react"
import { useParams, useSearchParams, useRouter } from "next/navigation"
import Link from "next/link"
import { movies, cinemas, showtimes, bookings } from "@/lib/mockData"
import { useAuth } from "@/contexts/AuthContext"
import Navbar from "@/components/Navbar"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group"
import { Separator } from "@/components/ui/separator"
import { Alert, AlertDescription } from "@/components/ui/alert"
import { Calendar, Clock, MapPin, Star, CreditCard, CheckCircle, Ticket, Download, Share2, Mail } from "lucide-react"

export default function BookingConfirmPage() {
  const params = useParams()
  const searchParams = useSearchParams()
  const router = useRouter()
  const { user } = useAuth()

  const movieId = Number.parseInt(params.id)
  const showtimeId = searchParams.get("showtime")
  const seatIds = searchParams.get("seats")?.split(",") || []

  const [paymentMethod, setPaymentMethod] = useState("card")
  const [cardDetails, setCardDetails] = useState({
    number: "",
    expiry: "",
    cvv: "",
    name: "",
  })
  const [isProcessing, setIsProcessing] = useState(false)
  const [isConfirmed, setIsConfirmed] = useState(false)
  const [bookingId, setBookingId] = useState(null)

  const movie = movies.find((m) => m.id === movieId)
  const showtime = showtimes.find((s) => s.id === Number.parseInt(showtimeId))
  const cinema = showtime ? cinemas.find((c) => c.id === showtime.cinemaId) : null
  const screen = cinema && showtime ? cinema.screens.find((s) => s.id === showtime.screenId) : null

  // Calculate seat details and total
  const selectedSeats = seatIds.map((seatId) => {
    const row = seatId.charAt(0)
    const number = Number.parseInt(seatId.slice(1))
    const isPremium = ["A", "B"].includes(row)
    const price = screen?.type === "IMAX" ? (isPremium ? 29.99 : 24.99) : isPremium ? 19.99 : 15.99

    return {
      id: seatId,
      row,
      number,
      type: isPremium ? "premium" : "standard",
      price,
    }
  })

  const subtotal = selectedSeats.reduce((sum, seat) => sum + seat.price, 0)
  const taxes = subtotal * 0.1 // 10% tax
  const fees = 2.99 // Booking fee
  const total = subtotal + taxes + fees

  useEffect(() => {
    if (!user) {
      router.push("/login")
      return
    }

    if (!movie || !showtime || !cinema || seatIds.length === 0) {
      router.push("/movies")
      return
    }
  }, [user, movie, showtime, cinema, seatIds, router])

  const handlePayment = async (e) => {
    e.preventDefault()
    setIsProcessing(true)

    // Simulate payment processing
    await new Promise((resolve) => setTimeout(resolve, 3000))

    // Create booking
    const newBooking = {
      id: bookings.length + 1,
      userId: user.id,
      movieId: movie.id,
      cinemaId: cinema.id,
      showtimeId: showtime.id,
      seats: seatIds,
      totalAmount: total,
      bookingDate: new Date().toISOString().split("T")[0],
      status: "confirmed",
      paymentMethod,
      bookingReference: `BK${Date.now().toString().slice(-6)}`,
    }

    bookings.push(newBooking)
    setBookingId(newBooking.id)
    setIsConfirmed(true)
    setIsProcessing(false)
  }

  if (!movie || !showtime || !cinema || !screen) {
    return (
      <div className="min-h-screen bg-background">
        <Navbar />
        <div className="container mx-auto px-4 py-8">
          <div className="text-center py-12">
            <h1 className="text-2xl font-bold mb-4">Booking information not found</h1>
            <Button asChild>
              <Link href="/movies">Back to Movies</Link>
            </Button>
          </div>
        </div>
      </div>
    )
  }

  if (isConfirmed) {
    const booking = bookings.find((b) => b.id === bookingId)

    return (
      <div className="min-h-screen bg-background">
        <Navbar />
        <div className="container mx-auto px-4 py-8">
          <div className="max-w-2xl mx-auto">
            <Card className="text-center">
              <CardContent className="p-8">
                <div className="w-16 h-16 bg-green-500 rounded-full flex items-center justify-center mx-auto mb-4">
                  <CheckCircle className="h-8 w-8 text-white" />
                </div>
                <h1 className="text-3xl font-bold mb-2">Booking Confirmed!</h1>
                <p className="text-muted-foreground mb-6">
                  Your tickets have been booked successfully. You will receive a confirmation email shortly.
                </p>

                <div className="bg-muted/50 rounded-lg p-6 mb-6">
                  <div className="flex items-center justify-center mb-4">
                    <Ticket className="h-6 w-6 text-sky-500 mr-2" />
                    <span className="text-lg font-semibold">Booking Reference</span>
                  </div>
                  <p className="text-2xl font-bold text-sky-500">{booking?.bookingReference}</p>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-left mb-6">
                  <div>
                    <p className="text-sm text-muted-foreground">Movie</p>
                    <p className="font-semibold">{movie.title}</p>
                  </div>
                  <div>
                    <p className="text-sm text-muted-foreground">Cinema</p>
                    <p className="font-semibold">{cinema.name}</p>
                  </div>
                  <div>
                    <p className="text-sm text-muted-foreground">Date & Time</p>
                    <p className="font-semibold">
                      {new Date(showtime.date).toLocaleDateString()} at {showtime.time}
                    </p>
                  </div>
                  <div>
                    <p className="text-sm text-muted-foreground">Seats</p>
                    <p className="font-semibold">{seatIds.join(", ")}</p>
                  </div>
                  <div>
                    <p className="text-sm text-muted-foreground">Total Paid</p>
                    <p className="font-semibold">${total.toFixed(2)}</p>
                  </div>
                  <div>
                    <p className="text-sm text-muted-foreground">Screen</p>
                    <p className="font-semibold">
                      {screen.name} - {screen.type}
                    </p>
                  </div>
                </div>

                <div className="flex flex-col sm:flex-row gap-3">
                  <Button className="flex-1 bg-sky-500 hover:bg-sky-600">
                    <Download className="h-4 w-4 mr-2" />
                    Download Ticket
                  </Button>
                  <Button variant="outline" className="flex-1 bg-transparent">
                    <Mail className="h-4 w-4 mr-2" />
                    Email Ticket
                  </Button>
                  <Button variant="outline" className="flex-1 bg-transparent">
                    <Share2 className="h-4 w-4 mr-2" />
                    Share
                  </Button>
                </div>

                <div className="mt-6 pt-6 border-t">
                  <div className="flex flex-col sm:flex-row gap-3">
                    <Button asChild variant="outline" className="flex-1 bg-transparent">
                      <Link href="/bookings">View All Bookings</Link>
                    </Button>
                    <Button asChild className="flex-1 bg-sky-500 hover:bg-sky-600">
                      <Link href="/movies">Book Another Movie</Link>
                    </Button>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-background">
      <Navbar />

      <div className="container mx-auto px-4 py-8">
        <div className="max-w-4xl mx-auto">
          <h1 className="text-3xl font-bold mb-8">Complete Your Booking</h1>

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            {/* Payment Form */}
            <div className="lg:col-span-2">
              <form onSubmit={handlePayment}>
                <Card className="mb-6">
                  <CardHeader>
                    <CardTitle>Payment Method</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <RadioGroup value={paymentMethod} onValueChange={setPaymentMethod}>
                      <div className="flex items-center space-x-2">
                        <RadioGroupItem value="card" id="card" />
                        <Label htmlFor="card" className="flex items-center cursor-pointer">
                          <CreditCard className="h-4 w-4 mr-2" />
                          Credit/Debit Card
                        </Label>
                      </div>
                    </RadioGroup>
                  </CardContent>
                </Card>

                {paymentMethod === "card" && (
                  <Card className="mb-6">
                    <CardHeader>
                      <CardTitle>Card Details</CardTitle>
                    </CardHeader>
                    <CardContent className="space-y-4">
                      <div>
                        <Label htmlFor="cardName">Cardholder Name</Label>
                        <Input
                          id="cardName"
                          placeholder="John Doe"
                          value={cardDetails.name}
                          onChange={(e) => setCardDetails({ ...cardDetails, name: e.target.value })}
                          required
                        />
                      </div>
                      <div>
                        <Label htmlFor="cardNumber">Card Number</Label>
                        <Input
                          id="cardNumber"
                          placeholder="1234 5678 9012 3456"
                          value={cardDetails.number}
                          onChange={(e) => setCardDetails({ ...cardDetails, number: e.target.value })}
                          required
                        />
                      </div>
                      <div className="grid grid-cols-2 gap-4">
                        <div>
                          <Label htmlFor="expiry">Expiry Date</Label>
                          <Input
                            id="expiry"
                            placeholder="MM/YY"
                            value={cardDetails.expiry}
                            onChange={(e) => setCardDetails({ ...cardDetails, expiry: e.target.value })}
                            required
                          />
                        </div>
                        <div>
                          <Label htmlFor="cvv">CVV</Label>
                          <Input
                            id="cvv"
                            placeholder="123"
                            value={cardDetails.cvv}
                            onChange={(e) => setCardDetails({ ...cardDetails, cvv: e.target.value })}
                            required
                          />
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                )}

                <Alert className="mb-6">
                  <CheckCircle className="h-4 w-4" />
                  <AlertDescription>
                    Your payment is secured with 256-bit SSL encryption. We do not store your card details.
                  </AlertDescription>
                </Alert>

                <Button type="submit" disabled={isProcessing} className="w-full bg-sky-500 hover:bg-sky-600" size="lg">
                  {isProcessing ? "Processing Payment..." : `Pay $${total.toFixed(2)}`}
                </Button>
              </form>
            </div>

            {/* Booking Summary */}
            <div className="lg:col-span-1">
              <Card className="sticky top-8">
                <CardHeader>
                  <CardTitle>Booking Summary</CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  {/* Movie Info */}
                  <div className="flex items-start space-x-3">
                    <img
                      src={movie.poster || "/placeholder.svg"}
                      alt={movie.title}
                      className="w-16 h-20 object-cover rounded"
                    />
                    <div className="flex-1">
                      <h4 className="font-semibold">{movie.title}</h4>
                      <div className="text-sm text-muted-foreground space-y-1">
                        <div className="flex items-center">
                          <Calendar className="h-3 w-3 mr-1" />
                          {new Date(showtime.date).toLocaleDateString()}
                        </div>
                        <div className="flex items-center">
                          <Clock className="h-3 w-3 mr-1" />
                          {showtime.time}
                        </div>
                        <div className="flex items-center">
                          <MapPin className="h-3 w-3 mr-1" />
                          {cinema.name}
                        </div>
                      </div>
                    </div>
                  </div>

                  <Separator />

                  {/* Seats */}
                  <div>
                    <p className="font-semibold mb-2">Seats ({selectedSeats.length})</p>
                    <div className="space-y-2">
                      {selectedSeats.map((seat) => (
                        <div key={seat.id} className="flex items-center justify-between text-sm">
                          <span className="flex items-center">
                            <Badge variant="outline" className="mr-2 text-xs">
                              {seat.id}
                            </Badge>
                            {seat.type === "premium" && <Star className="h-3 w-3 text-amber-500 mr-1" />}
                            {seat.type === "premium" ? "Premium" : "Standard"}
                          </span>
                          <span>${seat.price.toFixed(2)}</span>
                        </div>
                      ))}
                    </div>
                  </div>

                  <Separator />

                  {/* Price Breakdown */}
                  <div className="space-y-2 text-sm">
                    <div className="flex justify-between">
                      <span>Subtotal</span>
                      <span>${subtotal.toFixed(2)}</span>
                    </div>
                    <div className="flex justify-between">
                      <span>Taxes & Fees</span>
                      <span>${(taxes + fees).toFixed(2)}</span>
                    </div>
                    <Separator />
                    <div className="flex justify-between font-bold text-lg">
                      <span>Total</span>
                      <span>${total.toFixed(2)}</span>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
