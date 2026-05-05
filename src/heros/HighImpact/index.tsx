'use client'
import { useHeaderTheme } from '@/providers/HeaderTheme'
import React, { useEffect } from 'react'

import type { Page } from '@/payload-types'

import { CMSLink } from '@/components/Link'
import { Media } from '@/components/Media'
import RichText from '@/components/RichText'

const backdropClasses: Record<NonNullable<Page['hero']['textBackdrop']>, string> = {
  none: '',
  frosted: 'bg-white/20 backdrop-blur-md ring-1 ring-white/25 shadow-xl',
  dark: 'bg-black/40 backdrop-blur-md ring-1 ring-white/10 shadow-xl',
}

export const HighImpactHero: React.FC<Page['hero']> = ({
  links,
  media,
  richText,
  textBackdrop,
}) => {
  const { setHeaderTheme } = useHeaderTheme()

  useEffect(() => {
    setHeaderTheme('dark')
  })

  const backdrop = textBackdrop ?? 'none'
  const showBackdrop = backdrop !== 'none'

  return (
    <div
      className="relative -mt-[10.4rem] flex items-center justify-center text-white"
      data-theme="dark"
    >
      <div className="container mb-8 z-10 relative flex items-center justify-center">
        <div className="relative max-w-[36.5rem] md:text-center">
          {showBackdrop && (
            <div
              aria-hidden
              className={`pointer-events-none absolute -inset-x-6 -inset-y-6 -z-10 rounded-2xl md:-inset-x-10 md:-inset-y-8 ${backdropClasses[backdrop]}`}
            />
          )}
          {richText && <RichText className="mb-6" data={richText} enableGutter={false} />}
          {Array.isArray(links) && links.length > 0 && (
            <ul className="flex md:justify-center gap-4">
              {links.map(({ link }, i) => {
                return (
                  <li key={i}>
                    <CMSLink {...link} />
                  </li>
                )
              })}
            </ul>
          )}
        </div>
      </div>
      <div className="min-h-[80vh] select-none">
        {media && typeof media === 'object' && (
          <Media fill imgClassName="-z-10 object-cover" priority resource={media} />
        )}
      </div>
    </div>
  )
}
