import type { TextFieldSingleValidation } from 'payload'
import {
  AlignFeature,
  BoldFeature,
  defaultColors,
  IndentFeature,
  ItalicFeature,
  LinkFeature,
  ParagraphFeature,
  StrikethroughFeature,
  SubscriptFeature,
  SuperscriptFeature,
  TextStateFeature,
  UnderlineFeature,
  lexicalEditor,
  type LinkFields,
} from '@payloadcms/richtext-lexical'

export const defaultLexical = lexicalEditor({
  features: [
    ParagraphFeature(),
    UnderlineFeature(),
    BoldFeature(),
    ItalicFeature(),
    StrikethroughFeature(),
    SubscriptFeature(),
    SuperscriptFeature(),
    AlignFeature(),
    IndentFeature(),
    TextStateFeature({
      state: {
        color: {
          ...defaultColors.text,
          'text-white': {
            label: 'White',
            css: { color: '#ffffff' },
          },
          'text-muted': {
            label: 'Muted',
            css: { color: 'var(--muted-foreground)' },
          },
        },
        size: {
          sm: { label: 'Small', css: { 'font-size': '0.875rem', 'line-height': '1.5' } },
          lg: { label: 'Large', css: { 'font-size': '1.25rem', 'line-height': '1.5' } },
          xl: { label: 'Extra Large', css: { 'font-size': '1.5rem', 'line-height': '1.4' } },
          '2xl': { label: '2XL', css: { 'font-size': '2rem', 'line-height': '1.25' } },
        },
        weight: {
          light: { label: 'Light', css: { 'font-weight': '300' } },
          semibold: { label: 'Semibold', css: { 'font-weight': '600' } },
          black: { label: 'Black', css: { 'font-weight': '900' } },
        },
      },
    }),
    LinkFeature({
      enabledCollections: ['pages', 'posts'],
      fields: ({ defaultFields }) => {
        const defaultFieldsWithoutUrl = defaultFields.filter((field) => {
          if ('name' in field && field.name === 'url') return false
          return true
        })

        return [
          ...defaultFieldsWithoutUrl,
          {
            name: 'url',
            type: 'text',
            admin: {
              condition: (_data, siblingData) => siblingData?.linkType !== 'internal',
            },
            label: ({ t }) => t('fields:enterURL'),
            required: true,
            validate: ((value, options) => {
              if ((options?.siblingData as LinkFields)?.linkType === 'internal') {
                return true // no validation needed, as no url should exist for internal links
              }
              return value ? true : 'URL is required'
            }) as TextFieldSingleValidation,
          },
        ]
      },
    }),
  ],
})
