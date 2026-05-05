import type { Event, EventsBlockType } from '@/payload-types'

import configPromise from '@payload-config'
import { getPayload } from 'payload'
import React from 'react'
import RichText from '@/components/RichText'
import { EventsGrid } from './EventsGrid'
import { unstable_cache } from 'next/cache'

async function fetchEvents(limit: number, showPast: boolean): Promise<Event[]> {
  const payload = await getPayload({ config: configPromise })

  const now = new Date().toISOString()

  const result = await payload.find({
    collection: 'events',
    depth: 1,
    limit,
    sort: 'eventDate',
    where: {
      ...(showPast
        ? {}
        : {
            eventDate: {
              greater_than_equal: now,
            },
          }),
    },
  })

  return result.docs
}

const getCachedEvents = unstable_cache(fetchEvents, ['events-block'], {
  tags: ['events'],
})

export const EventsBlockComponent: React.FC<
  EventsBlockType & { id?: string }
> = async (props) => {
  const { id, introContent, limit: limitFromProps, showPastEvents } = props

  const limit = limitFromProps || 12
  const events = await getCachedEvents(limit, showPastEvents ?? false)

  return (
    <div className="my-16" id={`block-${id}`}>
      {introContent && (
        <div className="container mb-8">
          <RichText className="ms-0 max-w-[48rem]" data={introContent} enableGutter={false} />
        </div>
      )}
      <div className="container">
        <EventsGrid events={events} />
      </div>
    </div>
  )
}
