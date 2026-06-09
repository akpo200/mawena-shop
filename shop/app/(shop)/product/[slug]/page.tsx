// ============================================================
// app/(shop)/product/[slug]/page.tsx — Page produit (Server Component)
// Récupère le produit depuis Payload et passe au client
// ============================================================

import type { Metadata } from 'next'
import { notFound } from 'next/navigation'
import { getPayloadClient } from '../../../../lib/payload'
import ProductClient from './ProductClient'

interface Props {
  params: Promise<{ slug: string }>
}

// ── Générer les métadonnées SEO dynamiquement ──
export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { slug } = await params
  try {
    const payload = await getPayloadClient()
    const { docs } = await payload.find({
      collection: 'products',
      where: { slug: { equals: slug } },
      limit: 1,
      depth: 0,
    })
    const product = docs[0] as any as { name: string; shortDescription?: string } | undefined
    if (!product) return {}
    return {
      title: product.name,
      description: product.shortDescription || `Découvrez ${product.name} sur la boutique Mawena.`,
    }
  } catch {
    return {}
  }
}

// ── Page principale ──
export default async function ProductPage({ params }: Props) {
  const { slug } = await params

  // Produit démo si Payload pas encore chargé
  const demoProduct = {
    id: slug,
    name: 'Bonnet artisanal',
    slug,
    price: 3500,
    inStock: true,
    shortDescription: 'Bonnet tricoté à la main avec amour',
    hasVariants: true,
    variants: [
      { label: 'Taille unique', available: true },
    ],
    images: [],
    category: { name: 'Bonnets', gender: 'femme' },
  }

  let product = demoProduct as typeof demoProduct & { id: string }

  try {
    const payload = await getPayloadClient()
    const { docs } = await payload.find({
      collection: 'products',
      where: { slug: { equals: slug } },
      limit: 1,
      depth: 2,
    })

    if (docs.length > 0) {
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      product = docs[0] as any
    } else if (slug !== 'demo') {
      notFound()
    }
  } catch {
    // Payload pas encore configuré — utiliser le démo
  }

  return <ProductClient product={product} />
}
