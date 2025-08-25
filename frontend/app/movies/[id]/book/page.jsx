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
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group"
import { Label } from "@/components/ui/label"
import { Calendar, Clock, MapPin, Star, ChevronLeft, ChevronRight, Users } from "lucide-react"

export default function BookMoviePage() {
  const params = useParams()
  const searchParams = useSearchParams()
  const router = useRouter()
  const { user } = useAuth()

  const movieId = Number.parseInt(params.id)
  const preselectedShowtimeId = searchParams.get("showtime")

  const [selectedDate, setSelectedDate] = useState("")
  const [selectedCinema, setSelectedCinema] = useState("")
  const [selectedShowtime, setSelectedShowtime] = useState(preselectedShowtimeId || "")
  const [step, setStep] = useState(1) // 1: Date, 2: Cinema, 3: Showtime

  const movie = movies.find((m) => m.id === movieId)
  const movieShowtimes = showtimes.filter((s) => s.movieId === movieId)

  // Generate next 7 days
  const dates = Array.from({ length: 7 }, (_, i) => {
    const date = new Date()
    date.setDate(date.getDate() + i)
    return {
      value: date.toISOString().split("T")[0],
      label: date.toLocaleDateString("en-US", {
        weekday: "short",
        month: "short",
        day: "numeric",
      }),
      isToday: i === 0,
    }
  })

  // Set default date to today
  useEffect(() => {
    if (!selectedDate) {
      setSelectedDate(dates[0].value)
    }
  }, [])

  // If preselected showtime, find and set cinema and date
  useEffect(() => {
    if (preselectedShowtimeId) {
      const showtime = showtimes.find((s) => s.id === Number.parseInt(preselectedShowtimeId))
      if (showtime) {
        setSelectedDate(showtime.date)
        setSelectedCinema(showtime.cinemaId.toString())
        setSelectedShowtime(preselectedShowtimeId)
        setStep(3)
      }
    }
  }, [preselectedShowtimeId])

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

  // Filter showtimes based on selected date
  const availableCinemas = selectedDate
    ? cinemas.filter((cinema) =>
        movieShowtimes.some((showtime) => showtime.cinemaId === cinema.id && showtime.date === selectedDate),
      )
    : []

  // Filter showtimes based on selected cinema and date
  const availableShowtimes =
    selectedCinema && selectedDate
      ? movieShowtimes.filter(
          (showtime) => showtime.cinemaId === Number.parseInt(selectedCinema) && showtime.date === selectedDate,
        )
      : []

  const selectedCinemaData = selectedCinema ? cinemas.find((c) => c.id === Number.parseInt(selectedCinema)) : null
  const selectedShowtimeData = selectedShowtime
    ? showtimes.find((s) => s.id === Number.parseInt(selectedShowtime))
    : null

  const handleContinue = () => {
    if (!user) {
      router.push("/login")
      return
    }

    if (step < 3) {
      setStep(step + 1)
    } else if (selectedShowtime) {
      // Navigate to seat selection
      router.push(`/movies/${movieId}/book/seats?showtime=${selectedShowtime}`)
    }
  }

  const canContinue = () => {
    switch (step) {
      case 1:
        return selectedDate
      case 2:
        return selectedCinema
      case 3:
        return selectedShowtime
      default:
        return false
    }
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

        {/* Progress Steps */}
        <div className="flex items-center justify-center mb-8">
          <div className="flex items-center space-x-4">
            {[
              { number: 1, label: "Date", icon: Calendar },
              { number: 2, label: "Cinema", icon: MapPin },
              { number: 3, label: "Showtime", icon: Clock },
            ].map(({ number, label, icon: Icon }, index) => (
              <div key={number} className="flex items-center">
                <div
                  className={`flex items-center justify-center w-10 h-10 rounded-full border-2 ${
                    step >= number
                      ? "bg-sky-500 border-sky-500 text-white"
                      : "border-muted-foreground text-muted-foreground"
                  }`}
                >
                  <Icon className="h-4 w-4" />
                </div>
                <span
                  className={`ml-2 text-sm font-medium ${step >= number ? "text-sky-500" : "text-muted-foreground"}`}
                >
                  {label}
                </span>
                {index < 2 && <ChevronRight className="h-4 w-4 text-muted-foreground mx-4" />}
              </div>
            ))}
          </div>
        </div>

        {/* Movie Header */}
        <Card className="mb-8">
          <CardContent className="p-6">
            <div className="flex items-start space-x-4">
              <img
                src={movie.poster || "/placeholder.svg"}
                alt={movie.title}
                className="w-24 h-36 object-cover rounded"
              />
              <div className="flex-1">
                <h1 className="text-2xl font-bold mb-2">{movie.title}</h1>
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
                <div className="flex flex-wrap gap-1">
                  {movie.genre.slice(0, 3).map((g, index) => (
                    <Badge key={index} variant="outline" className="text-xs">
                      {g}
                    </Badge>
                  ))}
                </div>
              </div>
            </div>
          </CardContent>
        </Card>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Main Content */}
          <div className="lg:col-span-2">
            {/* Step 1: Date Selection */}
            {step === 1 && (
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center">
                    <Calendar className="h-5 w-5 mr-2" />
                    Select Date
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <RadioGroup value={selectedDate} onValueChange={setSelectedDate}>
                    <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                      {dates.map((date) => (
                        <div key={date.value}>
                          <RadioGroupItem value={date.value} id={date.value} className="peer sr-only" />
                          <Label
                            htmlFor={date.value}
                            className="flex flex-col items-center justify-center p-4 border-2 border-muted rounded-lg cursor-pointer hover:bg-muted/50 peer-checked:border-sky-500 peer-checked:bg-sky-50 dark:peer-checked:bg-sky-950 transition-colors"
                          >
                            <span className="font-semibold">{date.label}</span>
                            {date.isToday && (
                              <Badge variant="secondary" className="mt-1 text-xs">
                                Today
                              </Badge>
                            )}
                          </Label>
                        </div>
                      ))}
                    </div>
                  </RadioGroup>
                </CardContent>
              </Card>
            )}

            {/* Step 2: Cinema Selection */}
            {step === 2 && (
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center">
                    <MapPin className="h-5 w-5 mr-2" />
                    Select Cinema
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <RadioGroup value={selectedCinema} onValueChange={setSelectedCinema}>
                    <div className="space-y-4">
                      {availableCinemas.map((cinema) => (
                        <div key={cinema.id}>
                          <RadioGroupItem
                            value={cinema.id.toString()}
                            id={cinema.id.toString()}
                            className="peer sr-only"
                          />
                          <Label
                            htmlFor={cinema.id.toString()}
                            className="flex items-start p-4 border-2 border-muted rounded-lg cursor-pointer hover:bg-muted/50 peer-checked:border-sky-500 peer-checked:bg-sky-50 dark:peer-checked:bg-sky-950 transition-colors"
                          >
                            <div className="flex-1">
                              <h4 className="font-semibold mb-1">{cinema.name}</h4>
                              <p className="text-sm text-muted-foreground mb-2">{cinema.location}</p>
                              <div className="flex items-center space-x-4 text-sm text-muted-foreground mb-2">
                                <span>{cinema.distance}</span>
                                <span>{cinema.screens.length} screens</span>
                              </div>
                              <div className="flex flex-wrap gap-1">
                                {cinema.facilities.slice(0, 4).map((facility, index) => (
                                  <Badge key={index} variant="secondary" className="text-xs">
                                    {facility}
                                  </Badge>
                                ))}
                              </div>
                            </div>
                          </Label>
                        </div>
                      ))}
                    </div>
                  </RadioGroup>
                </CardContent>
              </Card>
            )}

            {/* Step 3: Showtime Selection */}
            {step === 3 && (
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center">
                    <Clock className="h-5 w-5 mr-2" />
                    Select Showtime
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <RadioGroup value={selectedShowtime} onValueChange={setSelectedShowtime}>
                    <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
                      {availableShowtimes.map((showtime) => (
                        <div key={showtime.id}>
                          <RadioGroupItem
                            value={showtime.id.toString()}
                            id={showtime.id.toString()}
                            className="peer sr-only"
                          />
                          <Label
                            htmlFor={showtime.id.toString()}
                            className="flex flex-col items-center justify-center p-4 border-2 border-muted rounded-lg cursor-pointer hover:bg-muted/50 peer-checked:border-sky-500 peer-checked:bg-sky-50 dark:peer-checked:bg-sky-950 transition-colors"
                          >
                            <span className="font-semibold text-lg">{showtime.time}</span>
                            <span className="text-sm text-muted-foreground">${showtime.price}</span>
                            <div className="flex items-center mt-1 text-xs text-muted-foreground">
                              <Users className="h-3 w-3 mr-1" />
                              {showtime.availableSeats} seats
                            </div>
                          </Label>
                        </div>
                      ))}
                    </div>
                  </RadioGroup>
                </CardContent>
              </Card>
            )}
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

                {selectedDate && (
                  <div>
                    <p className="text-sm text-muted-foreground">Date</p>
                    <p className="font-semibold">
                      {new Date(selectedDate).toLocaleDateString("en-US", {
                        weekday: "long",
                        year: "numeric",
                        month: "long",
                        day: "numeric",
                      })}
                    </p>
                  </div>
                )}

                {selectedCinemaData && (
                  <div>
                    <p className="text-sm text-muted-foreground">Cinema</p>
                    <p className="font-semibold">{selectedCinemaData.name}</p>
                    <p className="text-sm text-muted-foreground">{selectedCinemaData.location}</p>
                  </div>
                )}

                {selectedShowtimeData && (
                  <div>
                    <p className="text-sm text-muted-foreground">Showtime</p>
                    <p className="font-semibold">{selectedShowtimeData.time}</p>
                    <p className="text-sm text-muted-foreground">${selectedShowtimeData.price} per ticket</p>
                  </div>
                )}

                <Button
                  onClick={handleContinue}
                  disabled={!canContinue()}
                  className="w-full bg-sky-500 hover:bg-sky-600"
                >
                  {step < 3 ? "Continue" : "Select Seats"}
                  <ChevronRight className="h-4 w-4 ml-2" />
                </Button>

                {step > 1 && (
                  <Button variant="outline" onClick={() => setStep(step - 1)} className="w-full bg-transparent">
                    Back
                  </Button>
                )}
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </div>
  )
}
