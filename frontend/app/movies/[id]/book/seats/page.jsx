"use client"

import { useState, useEffect } from "react"
import { useParams, useSearchParams, useRouter } from "next/navigation"
import Link from "next/link"
import { movies, cinemas, showtimes } from "@/lib/mockData"
import { useAuth } from "@/contexts/AuthContext"
import Navbar from "@/components/Navbar"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Alert, AlertDescription } from "@/components/ui/alert"
import { Calendar, Clock, MapPin, Star, ChevronLeft, CreditCard, Info } from "lucide-react"

// Generate seat layout for a screen
const generateSeatLayout = (capacity, screenType) => {
  const rows = Math.ceil(capacity / 20) // Roughly 20 seats per row
  const seatsPerRow = Math.ceil(capacity / rows)
  const layout = []

  // Some seats are pre-occupied for demo
  const occupiedSeats = new Set(["A3", "A4", "B7", "B8", "C1", "C15", "D10", "D11", "E5", "E6", "F12", "F13"])

  for (let i = 0; i < rows; i++) {
    const rowLetter = String.fromCharCode(65 + i) // A, B, C, etc.
    const row = []

    for (let j = 1; j <= seatsPerRow; j++) {
      const seatId = `${rowLetter}${j}`
      const isOccupied = occupiedSeats.has(seatId)

      // Add some gaps for aisles
      const isAisle = j === Math.floor(seatsPerRow / 3) || j === Math.floor((seatsPerRow * 2) / 3)

      row.push({
        id: seatId,
        row: rowLetter,
        number: j,
        type: i < 2 ? "premium" : "standard",
        status: isOccupied ? "occupied" : "available",
        price: screenType === "IMAX" ? (i < 2 ? 29.99 : 24.99) : i < 2 ? 19.99 : 15.99,
        isAisle: isAisle,
      })
    }
    layout.push(row)
  }

  return layout
}

export default function SeatSelectionPage() {
  const params = useParams()
  const searchParams = useSearchParams()
  const router = useRouter()
  const { user } = useAuth()

  const movieId = Number.parseInt(params.id)
  const showtimeId = searchParams.get("showtime")

  const [selectedSeats, setSelectedSeats] = useState([])
  const [seatLayout, setSeatLayout] = useState([])
  const [isLoading, setIsLoading] = useState(false)

  const movie = movies.find((m) => m.id === movieId)
  const showtime = showtimes.find((s) => s.id === Number.parseInt(showtimeId))
  const cinema = showtime ? cinemas.find((c) => c.id === showtime.cinemaId) : null
  const screen = cinema && showtime ? cinema.screens.find((s) => s.id === showtime.screenId) : null

  useEffect(() => {
    if (!user) {
      router.push("/login")
      return
    }

    if (screen) {
      const layout = generateSeatLayout(screen.capacity, screen.type)
      setSeatLayout(layout)
    }
  }, [user, screen, router])

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

  const handleSeatClick = (seat) => {
    if (seat.status === "occupied") return

    const seatIndex = selectedSeats.findIndex((s) => s.id === seat.id)
    if (seatIndex > -1) {
      // Remove seat
      setSelectedSeats(selectedSeats.filter((s) => s.id !== seat.id))
    } else {
      // Add seat (max 8 seats)
      if (selectedSeats.length < 8) {
        setSelectedSeats([...selectedSeats, seat])
      }
    }
  }

  const getSeatClassName = (seat) => {
    const baseClasses =
      "w-8 h-8 rounded-t-lg border-2 cursor-pointer transition-all duration-200 flex items-center justify-center text-xs font-medium"

    if (seat.status === "occupied") {
      return `${baseClasses} bg-red-500 border-red-600 text-white cursor-not-allowed`
    }

    const isSelected = selectedSeats.some((s) => s.id === seat.id)
    if (isSelected) {
      return `${baseClasses} bg-sky-500 border-sky-600 text-white scale-110 shadow-lg`
    }

    if (seat.type === "premium") {
      return `${baseClasses} bg-amber-100 border-amber-300 text-amber-800 hover:bg-amber-200 hover:scale-105 dark:bg-amber-900 dark:border-amber-700 dark:text-amber-200`
    }

    return `${baseClasses} bg-green-100 border-green-300 text-green-800 hover:bg-green-200 hover:scale-105 dark:bg-green-900 dark:border-green-700 dark:text-green-200`
  }

  const totalAmount = selectedSeats.reduce((sum, seat) => sum + seat.price, 0)

  const handleProceedToPayment = () => {
    if (selectedSeats.length === 0) return

    setIsLoading(true)
    // Simulate booking process
    setTimeout(() => {
      router.push(
        `/movies/${movieId}/book/confirm?showtime=${showtimeId}&seats=${selectedSeats.map((s) => s.id).join(",")}`,
      )
    }, 1500)
  }

  return (
    <div className="min-h-screen bg-background">
      <Navbar />

      <div className="container mx-auto px-4 py-8">
        {/* Back Button */}
        <Button variant="ghost" onClick={() => router.back()} className="mb-6">
          <ChevronLeft className="h-4 w-4 mr-2" />
          Back
        </Button>

        {/* Movie & Showtime Info */}
        <Card className="mb-8">
          <CardContent className="p-6">
            <div className="flex items-start space-x-4">
              <img
                src={movie.poster || "/placeholder.svg"}
                alt={movie.title}
                className="w-20 h-28 object-cover rounded"
              />
              <div className="flex-1">
                <h1 className="text-2xl font-bold mb-2">{movie.title}</h1>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-sm">
                  <div className="flex items-center text-muted-foreground">
                    <Calendar className="h-4 w-4 mr-2" />
                    {new Date(showtime.date).toLocaleDateString("en-US", {
                      weekday: "short",
                      month: "short",
                      day: "numeric",
                    })}
                  </div>
                  <div className="flex items-center text-muted-foreground">
                    <Clock className="h-4 w-4 mr-2" />
                    {showtime.time}
                  </div>
                  <div className="flex items-center text-muted-foreground">
                    <MapPin className="h-4 w-4 mr-2" />
                    {cinema.name}
                  </div>
                </div>
                <div className="flex items-center space-x-4 mt-2">
                  <Badge variant="outline">{screen.name}</Badge>
                  <Badge
                    variant={screen.type === "IMAX" ? "default" : "secondary"}
                    className={screen.type === "IMAX" ? "bg-sky-500" : ""}
                  >
                    {screen.type}
                  </Badge>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>

        <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
          {/* Seat Map */}
          <div className="lg:col-span-3">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center justify-between">
                  <span>Select Your Seats</span>
                  <div className="flex items-center space-x-4 text-sm">
                    <div className="flex items-center space-x-2">
                      <div className="w-4 h-4 bg-green-100 border-2 border-green-300 rounded-t-lg dark:bg-green-900 dark:border-green-700"></div>
                      <span>Available</span>
                    </div>
                    <div className="flex items-center space-x-2">
                      <div className="w-4 h-4 bg-amber-100 border-2 border-amber-300 rounded-t-lg dark:bg-amber-900 dark:border-amber-700"></div>
                      <span>Premium</span>
                    </div>
                    <div className="flex items-center space-x-2">
                      <div className="w-4 h-4 bg-sky-500 border-2 border-sky-600 rounded-t-lg"></div>
                      <span>Selected</span>
                    </div>
                    <div className="flex items-center space-x-2">
                      <div className="w-4 h-4 bg-red-500 border-2 border-red-600 rounded-t-lg"></div>
                      <span>Occupied</span>
                    </div>
                  </div>
                </CardTitle>
              </CardHeader>
              <CardContent>
                {/* Screen */}
                <div className="mb-8">
                  <div className="w-full h-4 bg-gradient-to-r from-transparent via-gray-300 to-transparent rounded-full mb-2 dark:via-gray-600"></div>
                  <p className="text-center text-sm text-muted-foreground">SCREEN</p>
                </div>

                {/* Seat Layout */}
                <div className="space-y-2 max-w-4xl mx-auto">
                  {seatLayout.map((row, rowIndex) => (
                    <div key={rowIndex} className="flex items-center justify-center space-x-1">
                      {/* Row Label */}
                      <div className="w-8 text-center text-sm font-medium text-muted-foreground">{row[0]?.row}</div>

                      {/* Seats */}
                      <div className="flex space-x-1">
                        {row.map((seat, seatIndex) => (
                          <div key={seat.id} className="flex items-center">
                            <button
                              onClick={() => handleSeatClick(seat)}
                              className={getSeatClassName(seat)}
                              disabled={seat.status === "occupied"}
                              title={`${seat.id} - ${seat.type === "premium" ? "Premium" : "Standard"} - $${seat.price}`}
                            >
                              {seat.number}
                            </button>
                            {/* Aisle gap */}
                            {seat.isAisle && <div className="w-4"></div>}
                          </div>
                        ))}
                      </div>
                    </div>
                  ))}
                </div>

                {/* Instructions */}
                <Alert className="mt-6">
                  <Info className="h-4 w-4" />
                  <AlertDescription>
                    Click on available seats to select them. You can select up to 8 seats. Premium seats (front rows)
                    have better view and comfort.
                  </AlertDescription>
                </Alert>
              </CardContent>
            </Card>
          </div>

          {/* Booking Summary */}
          <div className="lg:col-span-1">
            <Card className="sticky top-8">
              <CardHeader>
                <CardTitle>Booking Summary</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div>
                  <p className="text-sm text-muted-foreground">Movie</p>
                  <p className="font-semibold">{movie.title}</p>
                </div>

                <div>
                  <p className="text-sm text-muted-foreground">Cinema</p>
                  <p className="font-semibold">{cinema.name}</p>
                  <p className="text-xs text-muted-foreground">
                    {screen.name} - {screen.type}
                  </p>
                </div>

                <div>
                  <p className="text-sm text-muted-foreground">Date & Time</p>
                  <p className="font-semibold">
                    {new Date(showtime.date).toLocaleDateString("en-US", {
                      month: "short",
                      day: "numeric",
                    })}{" "}
                    at {showtime.time}
                  </p>
                </div>

                {selectedSeats.length > 0 && (
                  <div>
                    <p className="text-sm text-muted-foreground mb-2">Selected Seats ({selectedSeats.length})</p>
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
                          <span className="font-medium">${seat.price}</span>
                        </div>
                      ))}
                    </div>
                  </div>
                )}

                {selectedSeats.length > 0 && (
                  <div className="border-t pt-4">
                    <div className="flex items-center justify-between text-lg font-bold">
                      <span>Total</span>
                      <span>${totalAmount.toFixed(2)}</span>
                    </div>
                  </div>
                )}

                <Button
                  onClick={handleProceedToPayment}
                  disabled={selectedSeats.length === 0 || isLoading}
                  className="w-full bg-sky-500 hover:bg-sky-600"
                >
                  {isLoading ? (
                    "Processing..."
                  ) : (
                    <>
                      <CreditCard className="h-4 w-4 mr-2" />
                      Proceed to Payment
                    </>
                  )}
                </Button>

                {selectedSeats.length === 0 && (
                  <p className="text-center text-sm text-muted-foreground">
                    Please select at least one seat to continue
                  </p>
                )}

                <div className="text-xs text-muted-foreground space-y-1">
                  <p>• Seats will be held for 10 minutes</p>
                  <p>• Cancellation allowed up to 2 hours before showtime</p>
                  <p>• Premium seats include extra legroom</p>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </div>
  )
}
