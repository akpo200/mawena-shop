'use client'
// ============================================================
// app/(shop)/shop/ShopClient.tsx — Catalogue côté client
// Gère les filtres, la recherche et l'affichage des produits
// ============================================================

import { useState, useMemo } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import Image from 'next/image'
import Link from 'next/link'
import { Search, SlidersHorizontal, ShoppingBag, X } from 'lucide-react'
import toast from 'react-hot-toast'
import { useCartStore, formatPrice } from '../../../lib/cart-store'
import styles from './ShopClient.module.css'

// Types simplifiés
interface Product {
  id: string
  name: string
  slug: string
  price: number
  compareAtPrice?: number
  inStock: boolean
  shortDescription?: string
  category?: { id: string; name: string; gender: string; slug: string }
  images?: Array<{ image?: { url?: string }; alt?: string }>
  weight?: number
}

interface Category {
  id: string
  name: string
  gender: string
  slug: string
}

interface Props {
  products: Product[]
  categories: Category[]
  initialGenre?: string
  initialCategory?: string
  initialSearch?: string
}

// Données démo enrichies avec les vraies catégories Mawena
const demoProducts: Product[] = [
  { id: '1', name: 'Bonnet tricoté noir', slug: 'bonnet-tric-noir', price: 3500, inStock: true, shortDescription: 'Bonnet artisanal élégant', category: { id: 'c1', name: 'Bonnets', gender: 'femme', slug: 'bonnets' }, images: [{ image: { url: '/media/B1.jpeg' } }] },
  { id: '2', name: 'Bonnet tressé caramel', slug: 'bonnet-tress-caramel', price: 3500, inStock: true, shortDescription: 'Bonnet tricoté à la main', category: { id: 'c1', name: 'Bonnets', gender: 'femme', slug: 'bonnets' }, images: [{ image: { url: '/media/B2.jpeg' } }] },
  { id: '3', name: 'Bracelet en perles multicolores', slug: 'bracelet-perles', price: 4500, inStock: true, shortDescription: 'Bijou artisanal africain', category: { id: 'c2', name: 'Bijoux', gender: 'femme', slug: 'bijoux' }, images: [{ image: { url: '/media/B12.jpeg' } }] },
  { id: '4', name: 'Bague en résine dorée', slug: 'bague-resine', price: 3000, inStock: true, shortDescription: 'Bague artisanale unique', category: { id: 'c2', name: 'Bijoux', gender: 'femme', slug: 'bijoux' }, images: [{ image: { url: '/media/3.jpeg' } }] },
  { id: '5', name: 'Boucles d\'oreilles raphia', slug: 'boucles-raphia', price: 4000, inStock: true, shortDescription: 'Boucles en fibres naturelles', category: { id: 'c2', name: 'Bijoux', gender: 'femme', slug: 'bijoux' }, images: [{ image: { url: '/media/BOUCLE RAFIA.jpeg' } }] },
  { id: '6', name: 'Tote bag Mawena naturel', slug: 'tote-bag-naturel', price: 6000, inStock: true, shortDescription: 'Sac en coton unisexe', category: { id: 'c3', name: 'Tote Bags', gender: 'unisexe', slug: 'tote-bags' }, images: [{ image: { url: '/media/2.jpeg' } }] },
  { id: '7', name: 'Tote bag imprimé wax', slug: 'tote-bag-wax', price: 6000, inStock: true, shortDescription: 'Sac avec motif wax africain', category: { id: 'c3', name: 'Tote Bags', gender: 'unisexe', slug: 'tote-bags' }, images: [{ image: { url: '/media/WhatsApp Image 2026-03-19 at 09.19.04.jpeg' } }] },
  { id: '8', name: 'Montre homme bronze', slug: 'montre-homme-bronze', price: 18000, inStock: true, shortDescription: 'Montre au cadran bronze doré', category: { id: 'c4', name: 'Montres', gender: 'homme', slug: 'montres' }, images: [{ image: { url: '/media/MONTRES.jpeg' } }] },
  { id: '9', name: 'Scrunchie soie', slug: 'scrunchie-soie', price: 2000, inStock: true, shortDescription: 'Élastique cheveux en soie', category: { id: 'c1', name: 'Bonnets', gender: 'femme', slug: 'bonnets' }, images: [{ image: { url: '/media/B3.jpeg' } }] },
  { id: '10', name: 'Haut batik femme', slug: 'haut-batik', price: 12000, inStock: false, shortDescription: 'Haut en tissu batik fait main', category: { id: 'c5', name: 'Vêtements Batik', gender: 'femme', slug: 'vetements-batik' }, images: [{ image: { url: '/media/B4.jpeg' } }] },
  { id: '11', name: 'Short batik coloré', slug: 'short-batik', price: 10000, inStock: false, shortDescription: 'Short en batik africain', category: { id: 'c5', name: 'Vêtements Batik', gender: 'femme', slug: 'vetements-batik' }, images: [{ image: { url: '/media/B5.jpeg' } }] },
  { id: '12', name: 'Bracelet cuivre artisanal', slug: 'bracelet-cuivre', price: 5500, inStock: true, shortDescription: 'Bracelet en cuivre travaillé', category: { id: 'c2', name: 'Bijoux', gender: 'femme', slug: 'bijoux' }, images: [{ image: { url: '/media/B8.jpeg' } }] },
]

// Genres disponibles
const genres = [
  { value: '', label: 'Tout' },
  { value: 'femme', label: 'Femme' },
  { value: 'homme', label: 'Homme' },
  { value: 'enfant', label: 'Enfant' },
  { value: 'unisexe', label: 'Unisexe' },
]

export default function ShopClient({
  products,
  categories: _categories,
  initialGenre = '',
  initialSearch = '',
}: Props) {
  const displayProducts = products.length > 0 ? products : demoProducts

  // ── États des filtres ──
  const [activeGenre, setActiveGenre] = useState(initialGenre)
  const [searchQuery, setSearchQuery] = useState(initialSearch || '')
  const [showFilters, setShowFilters] = useState(false)
  const [sortBy, setSortBy] = useState<'default' | 'price-asc' | 'price-desc'>('default')

  const { addItem, openCart } = useCartStore()

  // ── Filtrage et tri des produits ──
  const filteredProducts = useMemo(() => {
    let result = [...displayProducts]

    // Filtre par genre
    if (activeGenre) {
      result = result.filter((p) => p.category?.gender === activeGenre)
    }

    // Filtre par recherche texte
    if (searchQuery.trim()) {
      const q = searchQuery.toLowerCase()
      result = result.filter(
        (p) =>
          p.name.toLowerCase().includes(q) ||
          p.shortDescription?.toLowerCase().includes(q) ||
          p.category?.name.toLowerCase().includes(q)
      )
    }

    // Tri
    if (sortBy === 'price-asc') result.sort((a, b) => a.price - b.price)
    if (sortBy === 'price-desc') result.sort((a, b) => b.price - a.price)

    return result
  }, [displayProducts, activeGenre, searchQuery, sortBy])

  // ── Ajouter au panier ──
  const handleAddToCart = (product: Product, e: React.MouseEvent) => {
    e.preventDefault()
    if (!product.inStock) return

    addItem({
      id: product.id,
      name: product.name,
      price: product.price,
      image: product.images?.[0]?.image?.url,
      slug: product.slug,
      weight: product.weight || 0.2,
    })
    toast.success(`${product.name} ajouté !`)
    openCart()
  }

  return (
    <div className={styles.page}>
      {/* ── Spacer pour la navbar fixe ── */}
      <div style={{ height: 'var(--nav-height)' }} />

      {/* ── En-tête de page ── */}
      <div className={styles.pageHeader}>
        <div className="container">
          <motion.h1
            className={styles.pageTitle}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
          >
            Toute la boutique
          </motion.h1>
          <p className={styles.productCount}>
            {filteredProducts.length} produit{filteredProducts.length !== 1 ? 's' : ''}
          </p>
        </div>
      </div>

      <div className="container">
        {/* ── Barre de filtres ── */}
        <div className={styles.filterBar}>
          {/* Filtres genre (tabs) */}
          <div className={styles.genreTabs} role="tablist" aria-label="Filtrer par genre">
            {genres.map((g) => (
              <button
                key={g.value}
                role="tab"
                aria-selected={activeGenre === g.value}
                className={`${styles.genreTab} ${activeGenre === g.value ? styles.active : ''}`}
                onClick={() => setActiveGenre(g.value)}
              >
                {g.label}
              </button>
            ))}
          </div>

          {/* Recherche + tri */}
          <div className={styles.filterRight}>
            {/* Champ de recherche */}
            <div className={styles.searchWrapper}>
              <Search size={16} className={styles.searchIcon} />
              <input
                type="search"
                placeholder="Rechercher..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className={styles.searchInput}
                aria-label="Rechercher un produit"
              />
              {searchQuery && (
                <button
                  className={styles.clearSearch}
                  onClick={() => setSearchQuery('')}
                  aria-label="Effacer la recherche"
                >
                  <X size={14} />
                </button>
              )}
            </div>

            {/* Bouton filtres avancés */}
            <button
              className={`${styles.filterBtn} ${showFilters ? styles.filterBtnActive : ''}`}
              onClick={() => setShowFilters(!showFilters)}
              aria-expanded={showFilters}
            >
              <SlidersHorizontal size={16} />
              Filtres
            </button>
          </div>
        </div>

        {/* ── Panneau filtres avancés ── */}
        <AnimatePresence>
          {showFilters && (
            <motion.div
              className={styles.advancedFilters}
              initial={{ height: 0, opacity: 0 }}
              animate={{ height: 'auto', opacity: 1 }}
              exit={{ height: 0, opacity: 0 }}
              transition={{ duration: 0.3 }}
            >
              <div className={styles.filterGroup}>
                <label className={styles.filterLabel}>Trier par</label>
                <div className={styles.sortButtons}>
                  {[
                    { value: 'default', label: 'Par défaut' },
                    { value: 'price-asc', label: 'Prix croissant' },
                    { value: 'price-desc', label: 'Prix décroissant' },
                  ].map((opt) => (
                    <button
                      key={opt.value}
                      className={`${styles.sortBtn} ${sortBy === opt.value ? styles.sortBtnActive : ''}`}
                      onClick={() => setSortBy(opt.value as typeof sortBy)}
                    >
                      {opt.label}
                    </button>
                  ))}
                </div>
              </div>
            </motion.div>
          )}
        </AnimatePresence>

        {/* ── Grille de produits ── */}
        {filteredProducts.length === 0 ? (
          <div className={styles.noResults}>
            <p>Aucun produit trouvé.</p>
            <button
              className="btn-secondary"
              onClick={() => { setSearchQuery(''); setActiveGenre('') }}
            >
              Réinitialiser les filtres
            </button>
          </div>
        ) : (
          <motion.div
            className="products-grid"
            layout
          >
            <AnimatePresence mode="popLayout">
              {filteredProducts.map((product) => (
                <motion.article
                  key={product.id}
                  className="product-card"
                  layout
                  initial={{ opacity: 0, scale: 0.95 }}
                  animate={{ opacity: 1, scale: 1 }}
                  exit={{ opacity: 0, scale: 0.95 }}
                  transition={{ duration: 0.3 }}
                >
                  <Link href={`/product/${product.slug}`}>
                    <div className="product-card-image">
                      {product.images?.[0]?.image?.url ? (
                        <Image
                          src={product.images[0].image.url}
                          alt={product.images[0].alt || product.name}
                          fill
                          sizes="(max-width: 640px) 50vw, (max-width: 1024px) 33vw, 25vw"
                          style={{ objectFit: 'cover' }}
                        />
                      ) : (
                        <div className={styles.imgPlaceholder}>
                          <span>{product.category?.name || 'Mawena'}</span>
                        </div>
                      )}

                      {!product.inStock && (
                        <span className="badge-out-of-stock">Épuisé</span>
                      )}

                      {product.inStock && (
                        <button
                          className={styles.quickAdd}
                          onClick={(e) => handleAddToCart(product, e)}
                          aria-label={`Ajouter ${product.name} au panier`}
                        >
                          <ShoppingBag size={15} />
                          Ajouter
                        </button>
                      )}
                    </div>

                    <div className="product-card-info">
                      {product.category && (
                        <span className={styles.categoryBadge}>
                          {product.category.name}
                        </span>
                      )}
                      <h3 className="product-card-name">{product.name}</h3>
                      <div className={styles.priceRow}>
                        <span className="product-card-price">{formatPrice(product.price)}</span>
                        {product.compareAtPrice && product.compareAtPrice > product.price && (
                          <span className={styles.comparePrice}>{formatPrice(product.compareAtPrice)}</span>
                        )}
                      </div>
                    </div>
                  </Link>
                </motion.article>
              ))}
            </AnimatePresence>
          </motion.div>
        )}
      </div>
    </div>
  )
}
