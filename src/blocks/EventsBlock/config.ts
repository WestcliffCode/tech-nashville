import type { Block } from 'payload'

import {
  FixedToolbarFeature,
  HeadingFeature,
  InlineToolbarFeature,
  lexicalEditor,
} from '@payloadcms/richtext-lexical'

export const EventsBlock: Block = {
  slug: 'eventsBlock',
  interfaceName: 'EventsBlockType',
  fields: [
    {
      name: 'introContent',
      type: 'richText',
      editor: lexicalEditor({
        features: ({ rootFeatures }) => {
          return [
            ...rootFeatures,
            HeadingFeature({ enabledHeadingSizes: ['h1', 'h2', 'h3', 'h4'] }),
            FixedToolbarFeature(),
            InlineToolbarFeature(),
          ]
        },
      }),
      label: 'Intro Content',
    },
    {
      name: 'limit',
      type: 'number',
      defaultValue: 12,
      min: 1,
      max: 100,
      label: 'Max Events to Display',
      admin: {
        step: 1,
        description: 'Maximum number of upcoming events to show.',
      },
    },
    {
      name: 'showPastEvents',
      type: 'checkbox',
      defaultValue: false,
      label: 'Include Past Events',
      admin: {
        description: 'When unchecked, only future events are displayed.',
      },
    },
  ],
  labels: {
    plural: 'Events Blocks',
    singular: 'Events Block',
  },
}
