"use client"

import { useState } from "react"
import { useRouter } from "next/navigation"
import { useAuth } from "@/contexts/AuthContext"
import PrivateRoute from "@/components/PrivateRoute"
import Navbar from "@/components/Navbar"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Avatar, AvatarFallback } from "@/components/ui/avatar"
import { Alert, AlertDescription } from "@/components/ui/alert"
import { Separator } from "@/components/ui/separator"
import { User, Mail, Calendar, Settings, Shield, CheckCircle } from "lucide-react"

export default function ProfilePage() {
  const { user, logout } = useAuth()
  const router = useRouter()
  const [isEditing, setIsEditing] = useState(false)
  const [isSaving, setIsSaving] = useState(false)
  const [formData, setFormData] = useState({
    name: user?.name || "",
    email: user?.email || "",
    phone: user?.phone || "",
  })
  const [message, setMessage] = useState("")

  const handleSave = async (e) => {
    e.preventDefault()
    setIsSaving(true)

    // Simulate API call
    await new Promise((resolve) => setTimeout(resolve, 1000))

    // Update user data (in real app, this would be an API call)
    if (user) {
      user.name = formData.name
      user.email = formData.email
      user.phone = formData.phone
    }

    setMessage("Profile updated successfully!")
    setIsEditing(false)
    setIsSaving(false)

    // Clear message after 3 seconds
    setTimeout(() => setMessage(""), 3000)
  }

  const handleCancel = () => {
    setFormData({
      name: user?.name || "",
      email: user?.email || "",
      phone: user?.phone || "",
    })
    setIsEditing(false)
  }

  const getInitials = (name) => {
    return name
      ?.split(" ")
      .map((n) => n[0])
      .join("")
      .toUpperCase()
  }

  return (
    <PrivateRoute>
      <div className="min-h-screen bg-background">
        <Navbar />

        <div className="container mx-auto px-4 py-8">
          <div className="max-w-4xl mx-auto">
            {/* Header */}
            <div className="mb-8">
              <h1 className="text-4xl font-bold mb-2">My Profile</h1>
              <p className="text-muted-foreground">Manage your account settings and preferences</p>
            </div>

            {message && (
              <Alert className="mb-6">
                <CheckCircle className="h-4 w-4" />
                <AlertDescription>{message}</AlertDescription>
              </Alert>
            )}

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
              {/* Profile Info */}
              <div className="lg:col-span-2">
                <Card>
                  <CardHeader>
                    <CardTitle className="flex items-center">
                      <User className="h-5 w-5 mr-2" />
                      Personal Information
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <form onSubmit={handleSave}>
                      <div className="space-y-4">
                        <div>
                          <Label htmlFor="name">Full Name</Label>
                          <Input
                            id="name"
                            value={formData.name}
                            onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                            disabled={!isEditing}
                            className={!isEditing ? "bg-muted" : ""}
                          />
                        </div>

                        <div>
                          <Label htmlFor="email">Email Address</Label>
                          <Input
                            id="email"
                            type="email"
                            value={formData.email}
                            onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                            disabled={!isEditing}
                            className={!isEditing ? "bg-muted" : ""}
                          />
                        </div>

                        <div>
                          <Label htmlFor="phone">Phone Number</Label>
                          <Input
                            id="phone"
                            type="tel"
                            value={formData.phone}
                            onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                            disabled={!isEditing}
                            className={!isEditing ? "bg-muted" : ""}
                          />
                        </div>

                        <div className="flex items-center space-x-3 pt-4">
                          {!isEditing ? (
                            <Button onClick={() => setIsEditing(true)} className="bg-sky-500 hover:bg-sky-600">
                              Edit Profile
                            </Button>
                          ) : (
                            <>
                              <Button type="submit" disabled={isSaving} className="bg-sky-500 hover:bg-sky-600">
                                {isSaving ? "Saving..." : "Save Changes"}
                              </Button>
                              <Button type="button" variant="outline" onClick={handleCancel} className="bg-transparent">
                                Cancel
                              </Button>
                            </>
                          )}
                        </div>
                      </div>
                    </form>
                  </CardContent>
                </Card>

                {/* Account Settings */}
                <Card className="mt-6">
                  <CardHeader>
                    <CardTitle className="flex items-center">
                      <Settings className="h-5 w-5 mr-2" />
                      Account Settings
                    </CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <div className="flex items-center justify-between">
                      <div>
                        <p className="font-medium">Email Notifications</p>
                        <p className="text-sm text-muted-foreground">Receive booking confirmations and updates</p>
                      </div>
                      <Button variant="outline" size="sm" className="bg-transparent">
                        Manage
                      </Button>
                    </div>

                    <Separator />

                    <div className="flex items-center justify-between">
                      <div>
                        <p className="font-medium">Privacy Settings</p>
                        <p className="text-sm text-muted-foreground">Control your data and privacy preferences</p>
                      </div>
                      <Button variant="outline" size="sm" className="bg-transparent">
                        Manage
                      </Button>
                    </div>

                    <Separator />

                    <div className="flex items-center justify-between">
                      <div>
                        <p className="font-medium">Change Password</p>
                        <p className="text-sm text-muted-foreground">Update your account password</p>
                      </div>
                      <Button variant="outline" size="sm" className="bg-transparent">
                        Change
                      </Button>
                    </div>

                    <Separator />

                    <div className="flex items-center justify-between">
                      <div>
                        <p className="font-medium text-red-600">Delete Account</p>
                        <p className="text-sm text-muted-foreground">Permanently delete your account and data</p>
                      </div>
                      <Button variant="destructive" size="sm">
                        Delete
                      </Button>
                    </div>
                  </CardContent>
                </Card>
              </div>

              {/* Sidebar */}
              <div className="lg:col-span-1">
                {/* Profile Summary */}
                <Card>
                  <CardContent className="p-6 text-center">
                    <Avatar className="w-20 h-20 mx-auto mb-4">
                      <AvatarFallback className="bg-sky-500 text-white text-xl">
                        {getInitials(user?.name)}
                      </AvatarFallback>
                    </Avatar>
                    <h3 className="text-xl font-bold mb-1">{user?.name}</h3>
                    <p className="text-muted-foreground mb-4">{user?.email}</p>
                    <div className="flex items-center justify-center space-x-2 mb-4">
                      {user?.isAdmin && (
                        <div className="flex items-center text-amber-600">
                          <Shield className="h-4 w-4 mr-1" />
                          <span className="text-sm font-medium">Admin</span>
                        </div>
                      )}
                    </div>
                    <Button variant="outline" className="w-full bg-transparent">
                      Upload Photo
                    </Button>
                  </CardContent>
                </Card>

                {/* Account Stats */}
                <Card className="mt-6">
                  <CardHeader>
                    <CardTitle>Account Statistics</CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <div className="flex items-center justify-between">
                      <span className="text-sm text-muted-foreground">Member Since</span>
                      <span className="text-sm font-medium">Jan 2024</span>
                    </div>
                    <div className="flex items-center justify-between">
                      <span className="text-sm text-muted-foreground">Total Bookings</span>
                      <span className="text-sm font-medium">12</span>
                    </div>
                    <div className="flex items-center justify-between">
                      <span className="text-sm text-muted-foreground">Movies Watched</span>
                      <span className="text-sm font-medium">8</span>
                    </div>
                    <div className="flex items-center justify-between">
                      <span className="text-sm text-muted-foreground">Reviews Written</span>
                      <span className="text-sm font-medium">3</span>
                    </div>
                  </CardContent>
                </Card>

                {/* Quick Actions */}
                <Card className="mt-6">
                  <CardHeader>
                    <CardTitle>Quick Actions</CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-3">
                    <Button variant="outline" className="w-full justify-start bg-transparent" asChild>
                      <a href="/bookings">
                        <Calendar className="h-4 w-4 mr-2" />
                        View Bookings
                      </a>
                    </Button>
                    <Button variant="outline" className="w-full justify-start bg-transparent" asChild>
                      <a href="/movies">
                        <Mail className="h-4 w-4 mr-2" />
                        Browse Movies
                      </a>
                    </Button>
                    <Button
                      variant="outline"
                      className="w-full justify-start bg-transparent text-red-600 hover:text-red-700"
                      onClick={logout}
                    >
                      <User className="h-4 w-4 mr-2" />
                      Sign Out
                    </Button>
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
