"use client"

import { useState } from "react"
import Image from "next/image"
import { Card, CardContent } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Play, Clock, Star, DollarSign } from "lucide-react"
import { CheckoutModal } from "@/components/payment/checkout-modal"

interface FilmCardProps {
  film: {
    id: string
    title: string
    description?: string
    poster_url?: string
    duration?: number
    rating?: number
    rental_price?: number
    purchase_price?: number
    genre?: string[]
  }
  hasAccess?: boolean
  onWatch?: () => void
}

export function FilmCard({ film, hasAccess = false, onWatch }: FilmCardProps) {
  const [showCheckout, setShowCheckout] = useState(false)

  const handlePaymentSuccess = () => {
    // Refresh the page or update the access state
    window.location.reload()
  }

  return (
    <>
      <Card className="bg-gray-900 border-gray-800 overflow-hidden hover:border-gray-700 transition-colors group">
        <div className="relative aspect-[2/3] overflow-hidden">
          <Image
            src={film.poster_url || "/placeholder.svg?height=400&width=300&query=movie+poster"}
            alt={film.title}
            fill
            className="object-cover group-hover:scale-105 transition-transform duration-300"
          />
          <div className="absolute inset-0 bg-black/60 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
            {hasAccess ? (
              <Button onClick={onWatch} size="lg" className="bg-red-600 hover:bg-red-700">
                <Play className="mr-2 h-5 w-5" />
                Watch Now
              </Button>
            ) : (
              <Button onClick={() => setShowCheckout(true)} size="lg" className="bg-red-600 hover:bg-red-700">
                <DollarSign className="mr-2 h-5 w-5" />
                Get Access
              </Button>
            )}
          </div>
          {film.duration && (
            <div className="absolute top-2 right-2 bg-black/80 text-white text-xs px-2 py-1 rounded">
              <Clock className="inline h-3 w-3 mr-1" />
              {Math.floor(film.duration / 60)}h {film.duration % 60}m
            </div>
          )}
        </div>
        <CardContent className="p-4">
          <h3 className="font-semibold text-white mb-2 line-clamp-1">{film.title}</h3>
          {film.description && <p className="text-gray-400 text-sm mb-3 line-clamp-2">{film.description}</p>}

          <div className="flex items-center justify-between mb-3">
            {film.rating && (
              <div className="flex items-center">
                <Star className="h-4 w-4 text-yellow-500 mr-1" />
                <span className="text-white text-sm">{film.rating.toFixed(1)}</span>
              </div>
            )}
            {film.genre && film.genre.length > 0 && (
              <Badge variant="outline" className="bg-gray-800 text-gray-300 border-gray-600">
                {film.genre[0]}
              </Badge>
            )}
          </div>

          {!hasAccess && (
            <div className="flex items-center justify-between text-sm">
              <div className="text-gray-400">
                Rent: <span className="text-white font-medium">${film.rental_price?.toFixed(2)}</span>
              </div>
              <div className="text-gray-400">
                Buy: <span className="text-white font-medium">${film.purchase_price?.toFixed(2)}</span>
              </div>
            </div>
          )}

          {hasAccess && (
            <Badge className="w-full justify-center bg-green-600 text-white">
              <Play className="mr-1 h-3 w-3" />
              Available to Watch
            </Badge>
          )}
        </CardContent>
      </Card>

      <CheckoutModal
        isOpen={showCheckout}
        onClose={() => setShowCheckout(false)}
        film={film}
        onPaymentSuccess={handlePaymentSuccess}
      />
    </>
  )
}
