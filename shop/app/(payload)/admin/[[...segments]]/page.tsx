// ============================================================
// app/(payload)/admin/[[...segments]]/page.tsx
// Back-office Payload — accessible sur /admin
// Pattern officiel Payload v3 : config est importée via @payload-config
// ============================================================

import { RootPage, generatePageMetadata } from '@payloadcms/next/views'
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

export const generateMetadata = ({ params, searchParams }: Args) =>
  generatePageMetadata({ params, searchParams, importMap, config: configPromise } as any) as Promise<any>

export default function Page({ params, searchParams }: Args) {
  return <RootPage params={params} searchParams={searchParams} importMap={importMap} config={configPromise} />
}
