"use client"

import { useState } from "react"
import { useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Alert } from "@/components/ui/alert"
import { users } from "@/lib/mockData"

export default function AdminPanel() {
  const [formData, setFormData] = useState({
    title: "",
    genre: "",
    rating: "",
    duration: "",
    description: "",
  })
  const [error, setError] = useState("")
  const [success, setSuccess] = useState(false)
  const router = useRouter()

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    })
    setError("")
  }

  const handleSubmit = (e) => {
    e.preventDefault()
    setError("")

    if (!formData.title || !formData.genre || !formData.rating || !formData.duration || !formData.description) {
      setError("Please fill in all fields")
      return
    }

    // Add movie to mock data (this should be replaced with a real API call in a production app)
    const newMovie = {
      id: Date.now(), // Unique ID
      title: formData.title,
      genre: formData.genre.split(","),
      rating: parseFloat(formData.rating),
      duration: parseInt(formData.duration),
      description: formData.description,
      // Add other necessary fields
    }

    // Simulate adding to mock data
    // In a real application, you would send this data to your backend
    console.log("New movie added:", newMovie)

    setSuccess(true)
    setFormData({
      title: "",
      genre: "",
      rating: "",
      duration: "",
      description: "",
    })
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-sky-50 to-blue-100 dark:from-gray-900 dark:to-gray-800 px-4">
      <Card className="w-full max-w-md">
        <CardHeader>
          <CardTitle className="text-2xl text-center">Add New Movie</CardTitle>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit} className="space-y-4">
            {error && <Alert variant="destructive">{error}</Alert>}
            {success && <Alert variant="success">Movie added successfully!</Alert>}

            <div>
              <Label htmlFor="title">Title</Label>
              <Input
                id="title"
                name="title"
                value={formData.title}
                onChange={handleChange}
                required
              />
            </div>

            <div>
              <Label htmlFor="genre">Genre (comma separated)</Label>
              <Input
                id="genre"
                name="genre"
                value={formData.genre}
                onChange={handleChange}
                required
              />
            </div>

            <div>
              <Label htmlFor="rating">Rating</Label>
              <Input
                id="rating"
                name="rating"
                type="number"
                value={formData.rating}
                onChange={handleChange}
                required
              />
            </div>

            <div>
              <Label htmlFor="duration">Duration (in minutes)</Label>
              <Input
                id="duration"
                name="duration"
                type="number"
                value={formData.duration}
                onChange={handleChange}
                required
              />
            </div>

            <div>
              <Label htmlFor="description">Description</Label>
              <Input
                id="description"
                name="description"
                value={formData.description}
                onChange={handleChange}
                required
              />
            </div>

            <Button type="submit" className="w-full bg-sky-500 hover:bg-sky-600">
              Add Movie
            </Button>
          </form>
        </CardContent>
      </Card>
    </div>
  )
}
