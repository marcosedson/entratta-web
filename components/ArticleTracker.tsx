'use client'

import { useEffect } from 'react'
import { trackArticleRead } from '@/lib/analytics'

interface ArticleTrackerProps {
  slug: string
  title: string
}

export function ArticleTracker({ slug, title }: ArticleTrackerProps) {
  useEffect(() => {
    trackArticleRead(slug, title)
  }, [slug, title])

  return null
}
