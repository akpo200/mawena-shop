// ============================================================
// lib/payload.ts — Client Payload pour les Server Components
// Singleton pour ne pas recréer la connexion à chaque requête
// ============================================================

import { getPayload } from 'payload'
import configPromise from '@payload-config'

// Cache le client Payload initialisé
let cachedPayload: Awaited<ReturnType<typeof getPayload>> | null = null

export async function getPayloadClient() {
  if (cachedPayload) return cachedPayload
  // getPayload reçoit la config brute (avant sanitisation)
  cachedPayload = await getPayload({ config: configPromise })
  return cachedPayload
}
