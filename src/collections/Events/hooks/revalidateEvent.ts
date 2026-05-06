import type { CollectionAfterChangeHook, CollectionAfterDeleteHook } from 'payload'

import { revalidateTag } from 'next/cache'

import type { Event } from '../../../payload-types'

export const revalidateEvent: CollectionAfterChangeHook<Event> = ({
  doc,
  previousDoc,
  req: { payload, context },
}) => {
  if (!context.disableRevalidate) {
    if (doc._status === 'published') {
      payload.logger.info('Revalidating events')
      revalidateTag('events', 'max')
    }

    if (previousDoc?._status === 'published' && doc._status !== 'published') {
      payload.logger.info('Revalidating events (unpublished)')
      revalidateTag('events', 'max')
    }
  }
  return doc
}

export const revalidateEventDelete: CollectionAfterDeleteHook<Event> = ({
  req: { payload, context },
}) => {
  if (!context.disableRevalidate) {
    payload.logger.info('Revalidating events (deleted)')
    revalidateTag('events', 'max')
  }
}
