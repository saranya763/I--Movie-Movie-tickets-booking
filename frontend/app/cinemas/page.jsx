"use client"

import { useState, useMemo } from "react"
import Link from "next/link"
import { cinemas } from "@/lib/mockData"
import Navbar from "@/components/Navbar"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Search, MapPin, Star, Navigation, Phone } from "lucide-react"

export default function CinemasPage() {
  const [searchQuery, setSearchQuery] = useState("")
  const [selectedFacility, setSelectedFacility] = useState("all")
  const [sortBy, setSortBy] = useState("distance")

  // Get unique facilities
  const facilities = useMemo(() => {
    const allFacilities = cinemas.flatMap((cinema) => cinema.facilities)
    return [...new Set(allFacilities)]
  }, [])

  // Filter and sort cinemas
  const filteredCinemas = useMemo(() => {
    const filtered = cinemas.filter((cinema) => {
      const matchesSearch =
        cinema.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        cinema.location.toLowerCase().includes(searchQuery.toLowerCase())

      const matchesFacility = selectedFacility === "all" || cinema.facilities.includes(selectedFacility)

      return matchesSearch && matchesFacility
    })

    // Sort cinemas
    filtered.sort((a, b) => {
      switch (sortBy) {
        case "distance":
          return Number.parseFloat(a.distance) - Number.parseFloat(b.distance)
        case "name":
          return a.name.localeCompare(b.name)
        case "screens":
          return b.screens.length - a.screens.length
        default:
          return 0
      }
    })

    return filtered
  }, [searchQuery, selectedFacility, sortBy])

  return (
    <div className="min-h-screen bg-background">
      <Navbar />

      <div className="container mx-auto px-4 py-8">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-4xl font-bold mb-4">Cinemas</h1>
          <p className="text-muted-foreground text-lg">Find the perfect cinema near you</p>
        </div>

        {/* Search and Filters */}
        <div className="bg-card rounded-lg p-6 mb-8 border">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
            {/* Search */}
            <div className="lg:col-span-1">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground h-4 w-4" />
                <Input
                  placeholder="Search cinemas..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="pl-10"
                />
              </div>
            </div>

            {/* Facility Filter */}
            <Select value={selectedFacility} onValueChange={setSelectedFacility}>
              <SelectTrigger>
                <SelectValue placeholder="Facilities" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Facilities</SelectItem>
                {facilities.map((facility) => (
                  <SelectItem key={facility} value={facility}>
                    {facility}
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
                <SelectItem value="distance">Distance</SelectItem>
                <SelectItem value="name">Name</SelectItem>
                <SelectItem value="screens">Number of Screens</SelectItem>
              </SelectContent>
            </Select>

            {/* Location Button */}
            <Button variant="outline" className="bg-transparent">
              <Navigation className="h-4 w-4 mr-2" />
              Use My Location
            </Button>
          </div>
        </div>

        {/* Results Count */}
        <div className="flex items-center justify-between mb-6">
          <p className="text-muted-foreground">
            Showing {filteredCinemas.length} of {cinemas.length} cinemas
          </p>
        </div>

        {/* Cinemas Grid */}
        {filteredCinemas.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredCinemas.map((cinema) => (
              <Card key={cinema.id} className="hover:shadow-lg transition-shadow duration-300">
                <CardHeader>
                  <div className="flex items-start justify-between">
                    <div className="flex-1">
                      <CardTitle className="text-xl mb-2">{cinema.name}</CardTitle>
                      <div className="flex items-center text-muted-foreground mb-2">
                        <MapPin className="h-4 w-4 mr-1" />
                        <span className="text-sm">{cinema.location}</span>
                      </div>
                      <div className="flex items-center text-muted-foreground">
                        <Navigation className="h-4 w-4 mr-1" />
                        <span className="text-sm font-medium text-sky-500">{cinema.distance}</span>
                      </div>
                    </div>
                    <div className="text-right">
                      <div className="flex items-center mb-1">
                        <Star className="h-4 w-4 text-yellow-500 mr-1" />
                        <span className="text-sm font-medium">4.5</span>
                      </div>
                      <p className="text-xs text-muted-foreground">{cinema.screens.length} screens</p>
                    </div>
                  </div>
                </CardHeader>
                <CardContent>
                  {/* Facilities */}
                  <div className="mb-4">
                    <p className="text-sm font-medium mb-2">Facilities</p>
                    <div className="flex flex-wrap gap-1">
                      {cinema.facilities.map((facility, index) => (
                        <Badge key={index} variant="secondary" className="text-xs">
                          {facility}
                        </Badge>
                      ))}
                    </div>
                  </div>

                  {/* Screens */}
                  <div className="mb-4">
                    <p className="text-sm font-medium mb-2">Screen Types</p>
                    <div className="flex flex-wrap gap-1">
                      {[...new Set(cinema.screens.map((s) => s.type))].map((type, index) => (
                        <Badge key={index} variant="outline" className="text-xs">
                          {type}
                        </Badge>
                      ))}
                    </div>
                  </div>

                  {/* Actions */}
                  <div className="flex space-x-2">
                    <Button asChild className="flex-1 bg-sky-500 hover:bg-sky-600">
                      <Link href={`/cinemas/${cinema.id}`}>View Details</Link>
                    </Button>
                    <Button variant="outline" size="sm">
                      <Phone className="h-4 w-4" />
                    </Button>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        ) : (
          <div className="text-center py-12">
            <div className="w-24 h-24 bg-muted rounded-full flex items-center justify-center mx-auto mb-4">
              <MapPin className="h-12 w-12 text-muted-foreground" />
            </div>
            <h3 className="text-xl font-semibold mb-2">No cinemas found</h3>
            <p className="text-muted-foreground mb-4">Try adjusting your search criteria or filters</p>
            <Button
              onClick={() => {
                setSearchQuery("")
                setSelectedFacility("all")
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
