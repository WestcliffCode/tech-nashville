import React from 'react'

import type { Event, Media as MediaType } from '@/payload-types'

import { Card, CardContent } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Media } from '@/components/Media'
import { CalendarDays, MapPin, Clock, ExternalLink } from 'lucide-react'

function formatDate(dateString: string): string {
  return new Date(dateString).toLocaleDateString(undefined, {
    weekday: 'short',
    month: 'short',
    day: 'numeric',
    year: 'numeric',
  })
}

function formatTime(dateString: string): string {
  return new Date(dateString).toLocaleTimeString(undefined, {
    hour: 'numeric',
    minute: '2-digit',
  })
}

function isPast(startDate: string, endDate?: string | null): boolean {
  const effective = endDate ? new Date(endDate) : new Date(startDate)
  return effective < new Date()
}

export const EventCard: React.FC<{ event: Event }> = ({ event }) => {
  const {
    title,
    featuredImage,
    eventDate,
    endDate,
    venueName,
    venueAddress,
    description,
    externalUrl,
  } = event

  const past = isPast(eventDate, endDate)

  return (
    <Card className={`overflow-hidden group transition-shadow hover:shadow-lg ${past ? 'opacity-70' : ''}`}>
      <div className="relative aspect-[16/10] overflow-hidden">
        {featuredImage && typeof featuredImage === 'object' && (
          <Media
            fill
            imgClassName="object-cover transition-transform duration-300 group-hover:scale-105"
            resource={featuredImage as MediaType}
          />
        )}
        {past && (
          <Badge variant="secondary" className="absolute top-3 right-3 z-10">
            Past Event
          </Badge>
        )}
      </div>

      <CardContent className="p-5 space-y-3">
        <h3 className="text-lg font-semibold leading-tight line-clamp-2">
          {externalUrl ? (
            <a
              href={externalUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="hover:underline inline-flex items-center gap-1.5"
            >
              {title}
              <ExternalLink className="h-3.5 w-3.5 shrink-0 text-muted-foreground" />
            </a>
          ) : (
            title
          )}
        </h3>

        <div className="space-y-1.5 text-sm text-muted-foreground">
          <div className="flex items-center gap-2">
            <CalendarDays className="h-4 w-4 shrink-0" />
            <span>{formatDate(eventDate)}</span>
          </div>

          <div className="flex items-center gap-2">
            <Clock className="h-4 w-4 shrink-0" />
            <span>{formatTime(eventDate)}</span>
          </div>

          <div className="flex items-start gap-2">
            <MapPin className="h-4 w-4 shrink-0 mt-0.5" />
            <div>
              <p className="font-medium text-foreground">{venueName}</p>
              <p>{venueAddress}</p>
            </div>
          </div>
        </div>

        {description && (
          <p className="text-sm text-muted-foreground line-clamp-2 pt-1">{description}</p>
        )}
      </CardContent>
    </Card>
  )
}
