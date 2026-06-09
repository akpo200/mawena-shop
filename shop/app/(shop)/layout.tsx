// ============================================================
// app/(shop)/layout.tsx — Layout racine pour la boutique
// Contient la structure HTML globale, le Toaster, la Navbar, le CartDrawer et le Footer
// ============================================================

import type { Metadata } from 'next'
import { Toaster } from 'react-hot-toast'
import '../globals.css'
import Navbar from '../../components/Navbar'
import CartDrawer from '../../components/CartDrawer'
import Footer from '../../components/Footer'

// ── Métadonnées SEO globales pour la boutique ──
export const metadata: Metadata = {
  title: {
    template: '%s | Mawena',
    default: 'Mawena — Là où la beauté devient héritage',
  },
  description:
    'Boutique artisanale africaine. Bijoux, bonnets, vêtements batik, tote bags et montres faits à la main. Livraison internationale.',
  keywords: ['mawena', 'boutique africaine', 'bijoux artisanaux', 'batik', 'mode africaine', 'livraison internationale'],
  openGraph: {
    type: 'website',
    locale: 'fr_FR',
    siteName: 'Mawena',
    title: 'Mawena — Là où la beauté devient héritage',
    description: 'Boutique artisanale africaine. Bijoux, bonnets, vêtements batik et plus.',
  },
  robots: {
    index: true,
    follow: true,
  },
}

export default function ShopLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="fr">
      <body>
        {/* Notifications toast */}
        <Toaster
          position="top-right"
          toastOptions={{
            style: {
              fontFamily: 'DM Sans, sans-serif',
              fontSize: '0.875rem',
              background: '#2C1810',
              color: '#F5EFE6',
              borderRadius: '2px',
            },
            success: {
              iconTheme: {
                primary: '#C9A96E',
                secondary: '#F5EFE6',
              },
            },
          }}
        />

        {/* Barre de navigation */}
        <Navbar />

        {/* Panier latéral */}
        <CartDrawer />

        {/* Contenu principal */}
        <main>{children}</main>

        {/* Pied de page */}
        <Footer />
      </body>
    </html>
  )
}
