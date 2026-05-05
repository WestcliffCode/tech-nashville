import type { CollectionConfig } from 'payload'

import { authenticated } from '../../access/authenticated'
import { authenticatedOrPublished } from '../../access/authenticatedOrPublished'
import { slugField } from 'payload'
import { revalidateEvent, revalidateEventDelete } from './hooks/revalidateEvent'

export const Events: CollectionConfig<'events'> = {
  slug: 'events',
  access: {
    create: authenticated,
    delete: authenticated,
    read: authenticatedOrPublished,
    update: authenticated,
  },
  defaultPopulate: {
    title: true,
    slug: true,
    eventDate: true,
    venueName: true,
  },
  admin: {
    defaultColumns: ['title', 'eventDate', 'venueName', 'updatedAt'],
    useAsTitle: 'title',
  },
  fields: [
    {
      name: 'title',
      type: 'text',
      required: true,
      label: 'Event Name',
    },
    {
      name: 'featuredImage',
      type: 'upload',
      relationTo: 'media',
      required: true,
    },
    {
      type: 'row',
      fields: [
        {
          name: 'eventDate',
          type: 'date',
          required: true,
          index: true,
          label: 'Date & Time',
          admin: {
            date: {
              pickerAppearance: 'dayAndTime',
            },
            width: '50%',
          },
        },
        {
          name: 'endDate',
          type: 'date',
          label: 'End Date & Time (optional)',
          validate: (value, { siblingData }) => {
            const data = siblingData as Record<string, unknown>
            if (value && data?.eventDate && new Date(value) < new Date(data.eventDate as string)) {
              return 'End date must be after the start date'
            }
            return true
          },
          admin: {
            date: {
              pickerAppearance: 'dayAndTime',
            },
            width: '50%',
          },
        },
      ],
    },
    {
      type: 'row',
      fields: [
        {
          name: 'venueName',
          type: 'text',
          required: true,
          label: 'Venue Name',
          admin: { width: '50%' },
        },
        {
          name: 'venueAddress',
          type: 'text',
          required: true,
          label: 'Venue Address',
          admin: { width: '50%' },
        },
      ],
    },
    {
      name: 'description',
      type: 'textarea',
      label: 'Short Description',
    },
    {
      name: 'externalUrl',
      type: 'text',
      label: 'Ticket / RSVP Link',
      validate: (value: string | null | undefined) => {
        if (!value) return true
        try {
          const url = new URL(value)
          if (url.protocol !== 'http:' && url.protocol !== 'https:') {
            return 'Please enter a valid URL (e.g. https://example.com)'
          }
          return true
        } catch {
          return 'Please enter a valid URL (e.g. https://example.com)'
        }
      },
      admin: {
        description: 'External URL for tickets or registration',
      },
    },
    {
      name: 'publishedAt',
      type: 'date',
      admin: {
        position: 'sidebar',
      },
    },
    slugField(),
  ],
  hooks: {
    afterChange: [revalidateEvent],
    afterDelete: [revalidateEventDelete],
  },
  versions: {
    drafts: {
      autosave: {
        interval: 1500,
      },
      schedulePublish: true,
    },
    maxPerDoc: 50,
  },
}
