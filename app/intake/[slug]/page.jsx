'use client'

import { useParams } from 'next/navigation'
import { useQuery } from 'convex/react'
import { api } from '@/convex/_generated/api'

export default function IntakeFormPage() {
  const params = useParams()
  const slug = params.slug

  if (!slug) {
    return <div>Loading...</div>
  }

  console.log('Fetching intake form with slug:', slug)

  const document = useQuery(api.functions.intakeForms.getIntakeFormById, { id: slug })

  if (!document) {
    return <div>Loading...</div>
  }

  console.log('Fetched document:', document)

  return (
    <pre style={{ color: 'white', padding: '1rem' }}>{JSON.stringify(document, null, 2)}</pre>
  )
}
