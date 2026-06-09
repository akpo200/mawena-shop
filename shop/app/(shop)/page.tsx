// ============================================================
// app/(shop)/page.tsx — Page d'accueil Mawena
// Server Component : récupère les données, compose les sections
// ============================================================

import type { Metadata } from 'next'
import { getPayloadClient } from '../../lib/payload'
import HeroScroll from '../../components/home/HeroScroll'
import FeaturesBar from '../../components/home/FeaturesBar'
import CategoriesSection from '../../components/home/CategoriesSection'
import FeaturedProducts from '../../components/home/FeaturedProducts'
import StorySection from '../../components/home/StorySection'
import EditorialGrid from '../../components/home/EditorialGrid'
import SocialGrid from '../../components/home/SocialGrid'

// ── SEO Metadata ──
export const metadata: Metadata = {
  title: 'Mawena — Là où la beauté devient héritage',
  description:
    'Boutique artisanale africaine : bijoux faits main, bonnets, vêtements batik et accessoires. Livraison internationale.',
  openGraph: {
    title: 'Mawena — Là où la beauté devient héritage',
    description: 'Boutique artisanale africaine. Bijoux, bonnets, batik, livraison internationale.',
    type: 'website',
  },
}

// ── Récupérer les produits vedettes depuis Payload ──
async function getFeaturedProducts() {
  try {
    const payload = await getPayloadClient()
    const { docs } = await payload.find({
      collection: 'products',
      where: { inStock: { equals: true } },
      limit: 8,
      depth: 2,
      sort: '-createdAt',
    })
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    return docs as any[]
  } catch {
    // Payload pas encore prêt — les démos s'afficheront
    return []
  }
}

export default async function HomePage() {
  const featuredProducts = await getFeaturedProducts()

  return (
    <>
      {/* Hero animé avec séquence d'images au scroll */}
      <HeroScroll />

      {/* Barre de réassurance (USP) */}
      <FeaturesBar />

      {/* Notre histoire — section éditoriale */}
      <StorySection />

      {/* Grille des catégories : Femme / Homme / Enfant / Unisexe */}
      <CategoriesSection />

      {/* Coups de cœur : les produits vedettes */}
      <FeaturedProducts products={featuredProducts} />

      {/* Section split Editorial haut de gamme */}
      <EditorialGrid />

      {/* Galerie d'ambiance et d'inspirations sociales */}
      <SocialGrid />
    </>
  )
}
