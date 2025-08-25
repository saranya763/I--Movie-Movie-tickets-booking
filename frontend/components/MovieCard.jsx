"use client"

import Link from "next/link"
import { Card, CardContent, CardHeader } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Star, Calendar, Clock, Play } from "lucide-react"

export default function MovieCard({ movie, showBookButton = true }) {
  return (
    <Card className="group cursor-pointer hover:shadow-lg transition-all duration-300 hover:scale-105">
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
        {showBookButton && (
          <div className="flex space-x-2">
            <Button asChild className="flex-1 bg-sky-500 hover:bg-sky-600">
              <Link href={`/movies/${movie.id}`}>View Details</Link>
            </Button>
            <Button asChild variant="outline" className="flex-1 bg-transparent">
              <Link href={`/movies/${movie.id}/book`}>Book Now</Link>
            </Button>
          </div>
        )}
      </CardContent>
    </Card>
  )
}
