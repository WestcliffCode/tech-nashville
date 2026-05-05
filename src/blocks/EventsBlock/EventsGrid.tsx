'use client'

import React, { useMemo, useState } from 'react'

import type { Event } from '@/payload-types'

import { EventCard } from './EventCard'
import { Input } from '@/components/ui/input'
import { Search } from 'lucide-react'

type SortOption = 'date-asc' | 'date-desc' | 'venue'

export const EventsGrid: React.FC<{ events: Event[] }> = ({ events }) => {
  const [query, setQuery] = useState('')
  const [sort, setSort] = useState<SortOption>('date-asc')

  const filtered = useMemo(() => {
    const q = query.toLowerCase().trim()

    let results = events
    if (q) {
      results = events.filter((e) => {
        return (
          e.title.toLowerCase().includes(q) ||
          e.venueName.toLowerCase().includes(q) ||
          (e.venueAddress && e.venueAddress.toLowerCase().includes(q)) ||
          (e.description && e.description.toLowerCase().includes(q))
        )
      })
    }

    return [...results].sort((a, b) => {
      switch (sort) {
        case 'date-asc':
          return new Date(a.eventDate).getTime() - new Date(b.eventDate).getTime()
        case 'date-desc':
          return new Date(b.eventDate).getTime() - new Date(a.eventDate).getTime()
        case 'venue':
          return a.venueName.localeCompare(b.venueName)
        default:
          return 0
      }
    })
  }, [events, query, sort])

  return (
    <div>
      <div className="flex flex-col sm:flex-row gap-3 mb-8">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
          <Input
            placeholder="Search events, venues..."
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            className="pl-9"
          />
        </div>
        <select
          value={sort}
          onChange={(e) => setSort(e.target.value as SortOption)}
          className="h-10 rounded-md border border-input bg-background px-3 text-sm ring-offset-background focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
        >
          <option value="date-asc">Date (soonest first)</option>
          <option value="date-desc">Date (latest first)</option>
          <option value="venue">Venue name</option>
        </select>
      </div>

      {filtered.length > 0 ? (
        <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {filtered.map((event) => (
            <EventCard key={event.id} event={event} />
          ))}
        </div>
      ) : (
        <p className="text-center text-muted-foreground py-12">
          {query ? 'No events match your search.' : 'No upcoming events.'}
        </p>
      )}
    </div>
  )
}
