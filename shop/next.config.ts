// ============================================================
// next.config.ts — Configuration Next.js avec Payload CMS
// On intègre Payload directement dans Next.js (même app)
// ============================================================

import type { NextConfig } from 'next'
import { withPayload } from '@payloadcms/next/withPayload'

import path from 'path'

const nextConfig: any = {
  // ── Images externes autorisées ──
  images: {
    remotePatterns: [
      {
        protocol: 'https',
        hostname: 'res.cloudinary.com', // Si on utilise Cloudinary plus tard
      },
    ],
  },
  // Désactiver l'indicateur de compilation dev qui gêne
  devIndicators: {
    appIsrStatus: false,
    buildActivity: false,
  },
}

import { fileURLToPath } from 'url'

const filename = fileURLToPath(import.meta.url)
const dirname = path.dirname(filename)

// withPayload intègre le back-office Payload dans Next.js
export default withPayload(nextConfig, {
  configPath: path.resolve(dirname, './payload.config.ts'),
} as any)
