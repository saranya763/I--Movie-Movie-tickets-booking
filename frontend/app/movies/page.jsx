"use client"

import { useState, useMemo } from "react"
import Link from "next/link"
import { movies } from "@/lib/mockData"
import Navbar from "@/components/Navbar"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Card, CardContent, CardHeader } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Search, Star, Calendar, Clock, Filter } from "lucide-react"

export default function MoviesPage() {
  const [searchQuery, setSearchQuery] = useState("")
  const [selectedGenre, setSelectedGenre] = useState("all")
  const [selectedLanguage, setSelectedLanguage] = useState("all")
  const [sortBy, setSortBy] = useState("rating")

  // Get unique genres and languages
  const genres = useMemo(() => {
    const allGenres = movies.flatMap((movie) => movie.genre)
    return [...new Set(allGenres)]
  }, [])

  const languages = useMemo(() => {
    const allLanguages = movies.map((movie) => movie.language)
    return [...new Set(allLanguages)]
  }, [])

  // Filter and sort movies
  const filteredMovies = useMemo(() => {
    const filtered = movies.filter((movie) => {
      const matchesSearch =
        movie.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
        movie.description.toLowerCase().includes(searchQuery.toLowerCase()) ||
        movie.genre.some((g) => g.toLowerCase().includes(searchQuery.toLowerCase()))

      const matchesGenre = selectedGenre === "all" || movie.genre.includes(selectedGenre)
      const matchesLanguage = selectedLanguage === "all" || movie.language === selectedLanguage

      return matchesSearch && matchesGenre && matchesLanguage
    })

    // Sort movies
    filtered.sort((a, b) => {
      switch (sortBy) {
        case "rating":
          return b.rating - a.rating
        case "title":
          return a.title.localeCompare(b.title)
        case "duration":
          return b.duration - a.duration
        case "releaseDate":
          return new Date(b.releaseDate) - new Date(a.releaseDate)
        default:
          return 0
      }
    })

    return filtered
  }, [searchQuery, selectedGenre, selectedLanguage, sortBy])

  return (
    <div className="min-h-screen bg-background">
      <Navbar />

      <div className="container mx-auto px-4 py-8">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-4xl font-bold mb-4">Movies</h1>
          <p className="text-muted-foreground text-lg">Discover and book tickets for the latest movies</p>
        </div>

        {/* Search and Filters */}
        <div className="bg-card rounded-lg p-6 mb-8 border">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-4">
            {/* Search */}
            <div className="lg:col-span-2">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground h-4 w-4" />
                <Input
                  placeholder="Search movies..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="pl-10"
                />
              </div>
            </div>

            {/* Genre Filter */}
            <Select value={selectedGenre} onValueChange={setSelectedGenre}>
              <SelectTrigger>
                <SelectValue placeholder="Genre" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Genres</SelectItem>
                {genres.map((genre) => (
                  <SelectItem key={genre} value={genre}>
                    {genre}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>

            {/* Language Filter */}
            <Select value={selectedLanguage} onValueChange={setSelectedLanguage}>
              <SelectTrigger>
                <SelectValue placeholder="Language" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Languages</SelectItem>
                {languages.map((language) => (
                  <SelectItem key={language} value={language}>
                    {language}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>

            {/* Sort By */}
            <Select value={sortBy} onValueChange={setSortBy}>
              <SelectTrigger>
                <SelectValue placeholder="Sort by" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="rating">Rating</SelectItem>
                <SelectItem value="title">Title</SelectItem>
                <SelectItem value="duration">Duration</SelectItem>
                <SelectItem value="releaseDate">Release Date</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </div>

        {/* Results Count */}
        <div className="flex items-center justify-between mb-6">
          <p className="text-muted-foreground">
            Showing {filteredMovies.length} of {movies.length} movies
          </p>
          <div className="flex items-center space-x-2">
            <Filter className="h-4 w-4 text-muted-foreground" />
            <span className="text-sm text-muted-foreground">
              {searchQuery && `"${searchQuery}"`}
              {selectedGenre !== "all" && ` • ${selectedGenre}`}
              {selectedLanguage !== "all" && ` • ${selectedLanguage}`}
            </span>
          </div>
        </div>

        {/* Movies Grid */}
        {filteredMovies.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
            {filteredMovies.map((movie) => (
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
                    <div className="absolute inset-0 bg-black/0 group-hover:bg-black/20 transition-colors duration-300" />
                    <Badge className="absolute top-3 right-3 bg-sky-500">
                      <Star className="h-3 w-3 mr-1" />
                      {movie.rating}
                    </Badge>
                    <div className="absolute bottom-3 left-3">
                      <Badge variant="secondary" className="bg-black/70 text-white">
                        {movie.language}
                      </Badge>
                    </div>
                  </div>
                </CardHeader>
                <CardContent className="p-4">
                  <h4 className="font-bold text-lg mb-2 line-clamp-1">{movie.title}</h4>
                  <div className="flex flex-wrap gap-1 mb-2">
                    {movie.genre.slice(0, 2).map((g, index) => (
                      <Badge key={index} variant="outline" className="text-xs">
                        {g}
                      </Badge>
                    ))}
                    {movie.genre.length > 2 && (
                      <Badge variant="outline" className="text-xs">
                        +{movie.genre.length - 2}
                      </Badge>
                    )}
                  </div>
                  <div className="flex items-center justify-between text-sm text-muted-foreground mb-3">
                    <span className="flex items-center">
                      <Clock className="h-4 w-4 mr-1" />
                      {movie.duration} min
                    </span>
                    <span className="flex items-center">
                      <Calendar className="h-4 w-4 mr-1" />
                      {new Date(movie.releaseDate).getFullYear()}
                    </span>
                  </div>
                  <p className="text-sm text-muted-foreground mb-4 line-clamp-2">{movie.description}</p>
                  <div className="flex space-x-2">
                    <Button asChild className="flex-1 bg-sky-500 hover:bg-sky-600">
                      <Link href={`/movies/${movie.id}`}>View Details</Link>
                    </Button>
                    <Button asChild variant="outline" className="flex-1 bg-transparent">
                      <Link href={`/movies/${movie.id}/book`}>Book Now</Link>
                    </Button>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        ) : (
          <div className="text-center py-12">
            <div className="w-24 h-24 bg-muted rounded-full flex items-center justify-center mx-auto mb-4">
              <Search className="h-12 w-12 text-muted-foreground" />
            </div>
            <h3 className="text-xl font-semibold mb-2">No movies found</h3>
            <p className="text-muted-foreground mb-4">Try adjusting your search criteria or filters</p>
            <Button
              onClick={() => {
                setSearchQuery("")
                setSelectedGenre("all")
                setSelectedLanguage("all")
              }}
              variant="outline"
            >
              Clear Filters
            </Button>
          </div>
        )}
      </div>
    </div>
  )
}
