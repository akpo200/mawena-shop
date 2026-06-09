// ============================================================
// app/(shop)/shop/page.tsx — Page catalogue / boutique
// Affiche tous les produits avec filtre par genre et catégorie
// ============================================================

import type { Metadata } from 'next'
import { getPayloadClient } from '../../../lib/payload'
import ShopClient from './ShopClient'

export const metadata: Metadata = {
  title: 'Boutique — Tous nos produits',
  description: 'Explorez la collection complète Mawena : bijoux artisanaux, bonnets, vêtements batik, tote bags et montres.',
}

// ── Récupérer produits et catégories depuis Payload ──
async function getData() {
  try {
    const payload = await getPayloadClient()
    const [productsRes, categoriesRes] = await Promise.all([
      payload.find({
        collection: 'products',
        limit: 100,
        depth: 2,
        sort: '-createdAt',
      }),
      payload.find({
        collection: 'categories',
        limit: 20,
        sort: 'order',
        depth: 0,
      }),
    ])
    return {
      products: productsRes.docs,
      categories: categoriesRes.docs,
    }
  } catch {
    return { products: [], categories: [] }
  }
}

// Page Server Component — fetch les données puis délègue au client
export default async function ShopPage({
  searchParams,
}: {
  searchParams: Promise<{ genre?: string; categorie?: string; q?: string }>
}) {
  const params = await searchParams
  const { products, categories } = await getData()

  return (
    <ShopClient
      products={products as any}
      categories={categories as any}
      initialGenre={params.genre}
      initialCategory={params.categorie}
      initialSearch={params.q}
    />
  )
}
