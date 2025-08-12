"use client"

import { useState } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { CheckCircle, XCircle, Eye, Clock } from "lucide-react"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog"
import { Textarea } from "@/components/ui/textarea"

// Mock data - in real app, this would come from Supabase
const pendingVerifications = [
  {
    id: "1",
    user: {
      full_name: "Kwame Asante",
      email: "kwame@example.com",
      avatar_url: "/placeholder.svg",
    },
    bio: "Award-winning filmmaker from Ghana with 10+ years of experience in African cinema.",
    portfolio_url: "https://kwameasante.com",
    social_links: {
      instagram: "@kwameasante",
      twitter: "@kwameasante",
    },
    created_at: "2024-01-15T10:00:00Z",
  },
  {
    id: "2",
    user: {
      full_name: "Amina Hassan",
      email: "amina@example.com",
      avatar_url: "/placeholder.svg",
    },
    bio: "Documentary filmmaker focusing on social issues in East Africa.",
    portfolio_url: "https://aminahassan.com",
    social_links: {
      instagram: "@aminahassan",
      linkedin: "amina-hassan",
    },
    created_at: "2024-01-14T15:30:00Z",
  },
]

export default function VerificationPage() {
  const [selectedVerification, setSelectedVerification] = useState<any>(null)
  const [reviewNote, setReviewNote] = useState("")

  const handleApprove = (id: string) => {
    // In real app, this would call Supabase to update verification status
    console.log("Approving verification:", id)
  }

  const handleReject = (id: string) => {
    // In real app, this would call Supabase to update verification status
    console.log("Rejecting verification:", id, "Note:", reviewNote)
    setReviewNote("")
  }

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold text-white">Filmmaker Verification</h1>
        <p className="text-gray-400">Review and approve filmmaker verification requests</p>
      </div>

      {/* Stats */}
      <div className="grid gap-4 md:grid-cols-3">
        <Card className="bg-gray-900 border-gray-800">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium text-gray-300">Pending</CardTitle>
            <Clock className="h-4 w-4 text-yellow-400" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-white">{pendingVerifications.length}</div>
          </CardContent>
        </Card>

        <Card className="bg-gray-900 border-gray-800">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium text-gray-300">Approved This Month</CardTitle>
            <CheckCircle className="h-4 w-4 text-green-400" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-white">12</div>
          </CardContent>
        </Card>

        <Card className="bg-gray-900 border-gray-800">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium text-gray-300">Rejected This Month</CardTitle>
            <XCircle className="h-4 w-4 text-red-400" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-white">3</div>
          </CardContent>
        </Card>
      </div>

      {/* Verification Requests */}
      <Card className="bg-gray-900 border-gray-800">
        <CardHeader>
          <CardTitle className="text-white">Pending Verification Requests</CardTitle>
          <CardDescription className="text-gray-400">Review filmmaker applications for verification</CardDescription>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow className="border-gray-700">
                <TableHead className="text-gray-300">Filmmaker</TableHead>
                <TableHead className="text-gray-300">Bio</TableHead>
                <TableHead className="text-gray-300">Portfolio</TableHead>
                <TableHead className="text-gray-300">Submitted</TableHead>
                <TableHead className="text-gray-300">Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {pendingVerifications.map((verification) => (
                <TableRow key={verification.id} className="border-gray-700">
                  <TableCell>
                    <div className="flex items-center space-x-3">
                      <Avatar className="h-10 w-10">
                        <AvatarImage src={verification.user.avatar_url || "/placeholder.svg"} />
                        <AvatarFallback className="bg-gray-700 text-white">
                          {verification.user.full_name.charAt(0)}
                        </AvatarFallback>
                      </Avatar>
                      <div>
                        <p className="font-medium text-white">{verification.user.full_name}</p>
                        <p className="text-sm text-gray-400">{verification.user.email}</p>
                      </div>
                    </div>
                  </TableCell>
                  <TableCell>
                    <p className="text-white max-w-xs truncate">{verification.bio}</p>
                  </TableCell>
                  <TableCell>
                    <a
                      href={verification.portfolio_url}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-blue-400 hover:text-blue-300 underline"
                    >
                      View Portfolio
                    </a>
                  </TableCell>
                  <TableCell className="text-gray-300">
                    {new Date(verification.created_at).toLocaleDateString()}
                  </TableCell>
                  <TableCell>
                    <div className="flex items-center space-x-2">
                      <Dialog>
                        <DialogTrigger asChild>
                          <Button
                            variant="outline"
                            size="sm"
                            className="border-gray-600 text-white hover:bg-gray-800 bg-transparent"
                            onClick={() => setSelectedVerification(verification)}
                          >
                            <Eye className="mr-2 h-4 w-4" />
                            Review
                          </Button>
                        </DialogTrigger>
                        <DialogContent className="bg-gray-900 border-gray-700 text-white">
                          <DialogHeader>
                            <DialogTitle>Review Filmmaker Application</DialogTitle>
                            <DialogDescription className="text-gray-400">
                              Review the filmmaker's profile and decide on verification status.
                            </DialogDescription>
                          </DialogHeader>
                          {selectedVerification && (
                            <div className="space-y-4">
                              <div className="flex items-center space-x-4">
                                <Avatar className="h-16 w-16">
                                  <AvatarImage src={selectedVerification.user.avatar_url || "/placeholder.svg"} />
                                  <AvatarFallback className="bg-gray-700 text-white text-xl">
                                    {selectedVerification.user.full_name.charAt(0)}
                                  </AvatarFallback>
                                </Avatar>
                                <div>
                                  <h3 className="text-xl font-semibold">{selectedVerification.user.full_name}</h3>
                                  <p className="text-gray-400">{selectedVerification.user.email}</p>
                                </div>
                              </div>

                              <div>
                                <h4 className="font-semibold mb-2">Bio</h4>
                                <p className="text-gray-300">{selectedVerification.bio}</p>
                              </div>

                              <div>
                                <h4 className="font-semibold mb-2">Portfolio</h4>
                                <a
                                  href={selectedVerification.portfolio_url}
                                  target="_blank"
                                  rel="noopener noreferrer"
                                  className="text-blue-400 hover:text-blue-300 underline"
                                >
                                  {selectedVerification.portfolio_url}
                                </a>
                              </div>

                              <div>
                                <h4 className="font-semibold mb-2">Social Links</h4>
                                <div className="space-y-1">
                                  {Object.entries(selectedVerification.social_links).map(([platform, handle]) => (
                                    <p key={platform} className="text-gray-300">
                                      <span className="capitalize">{platform}:</span> {handle as string}
                                    </p>
                                  ))}
                                </div>
                              </div>

                              <div>
                                <h4 className="font-semibold mb-2">Review Note (for rejection)</h4>
                                <Textarea
                                  placeholder="Add a note explaining the rejection reason..."
                                  value={reviewNote}
                                  onChange={(e) => setReviewNote(e.target.value)}
                                  className="bg-gray-800 border-gray-700 text-white"
                                />
                              </div>

                              <div className="flex space-x-2 pt-4">
                                <Button
                                  onClick={() => handleApprove(selectedVerification.id)}
                                  className="bg-green-600 hover:bg-green-700"
                                >
                                  <CheckCircle className="mr-2 h-4 w-4" />
                                  Approve
                                </Button>
                                <Button
                                  onClick={() => handleReject(selectedVerification.id)}
                                  variant="destructive"
                                  className="bg-red-600 hover:bg-red-700"
                                >
                                  <XCircle className="mr-2 h-4 w-4" />
                                  Reject
                                </Button>
                              </div>
                            </div>
                          )}
                        </DialogContent>
                      </Dialog>
                    </div>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </CardContent>
      </Card>
    </div>
  )
}
