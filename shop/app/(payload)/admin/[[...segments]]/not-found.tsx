// ============================================================
// app/(payload)/admin/[[...segments]]/not-found.tsx
// Page 404 pour l'admin Payload
// ============================================================

import { NotFoundPage } from '@payloadcms/next/views'
import { importMap } from '../importMap'
import configPromise from '@payload-config'

type Args = {
  params: Promise<{
    segments: string[]
  }>
  searchParams: Promise<{
    [key: string]: string | string[]
  }>
}

export default function NotFound({ params, searchParams }: Args) {
  return <NotFoundPage params={params} searchParams={searchParams} importMap={importMap} config={configPromise} />
}
