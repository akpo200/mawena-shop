'use client'
// ============================================================
// components/home/FeaturedProducts.tsx — Produits vedettes
// Grille de produits avec scroll reveal et carte animée
// ============================================================

import { motion } from 'framer-motion'
import Link from 'next/link'
import Image from 'next/image'
import { ShoppingBag } from 'lucide-react'
import toast from 'react-hot-toast'
import { useCartStore, formatPrice } from '../../lib/cart-store'
import styles from './FeaturedProducts.module.css'

// Type simplifié pour un produit (vient de Payload)
interface Product {
  id: string
  name: string
  slug: string
  price: number
  compareAtPrice?: number
  inStock: boolean
  shortDescription?: string
  images?: Array<{
    image?: { url?: string; alt?: string }
    alt?: string
  }>
}

interface Props {
  products: Product[]
}

// Animation scroll reveal pour la grille
const containerVariants = {
  hidden: {},
  visible: {
    transition: { staggerChildren: 0.1 },
  },
}

const cardVariants = {
  hidden: { opacity: 0, y: 40 },
  visible: {
    opacity: 1,
    y: 0,
    transition: { duration: 0.55, ease: [0.215, 0.61, 0.355, 1] as any },
  },
}

// Données de démonstration si Payload est vide
const demoProducts: Product[] = [
  { 
    id: '1', 
    name: 'Bonnet artisanal', 
    slug: 'bonnet-artisanal', 
    price: 3500, 
    inStock: true, 
    shortDescription: 'Bonnet tricoté à la main',
    images: [{ image: { url: '/assets/products/B1.jpeg' } }]
  },
  { 
    id: '2', 
    name: 'Bracelet perle & cuir', 
    slug: 'bracelet-perle-cuir', 
    price: 4500, 
    inStock: true, 
    shortDescription: 'Bijou artisanal africain',
    images: [{ image: { url: '/assets/products/B12.jpeg' } }]
  },
  { 
    id: '3', 
    name: 'Tote bag Mawena', 
    slug: 'tote-bag-mawena', 
    price: 6000, 
    inStock: true, 
    shortDescription: 'Sac unisexe en coton',
    images: [{ image: { url: '/assets/products/2.jpeg' } }]
  },
  { 
    id: '4', 
    name: 'Boucles Rafia', 
    slug: 'boucles-rafia', 
    price: 3000, 
    inStock: true, 
    shortDescription: 'Boucles faites à la main',
    images: [{ image: { url: '/assets/products/BOUCLE RAFIA.jpeg' } }]
  },
]

export default function FeaturedProducts({ products }: Props) {
  const { addItem, openCart } = useCartStore()

  // Utiliser les produits Payload ou les démos si vide
  const displayProducts = products.length > 0 ? products : demoProducts

  // ── Ajouter au panier depuis la page d'accueil ──
  const handleAddToCart = (product: Product, e: React.MouseEvent) => {
    e.preventDefault() // Ne pas naviguer vers la page produit

    if (!product.inStock) return

    const imageUrl =
      product.images?.[0]?.image?.url || undefined

    addItem({
      id: product.id,
      name: product.name,
      price: product.price,
      image: imageUrl,
      slug: product.slug,
    })

    toast.success(`${product.name} ajouté au panier !`)
    openCart()
  }

  return (
    <section className={styles.section}>
      <div className="container">
        {/* En-tête */}
        <motion.div
          className={styles.header}
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: '-100px' }}
          transition={{ duration: 0.6 }}
        >
          <h2 className={styles.title}>Coups de cœur</h2>
          <div className="divider-gold" />
          <p className={styles.subtitle}>
            Nos pièces les plus appréciées, sélectionnées pour vous
          </p>
        </motion.div>

        {/* Grille de produits */}
        <motion.div
          className="products-grid"
          variants={containerVariants}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, margin: '-80px' }}
        >
          {displayProducts.map((product) => (
            <motion.article
              key={product.id}
              className="product-card"
              variants={cardVariants}
            >
              <Link href={`/product/${product.slug}`}>
                {/* Image du produit */}
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
                    /* Placeholder doré quand pas d'image */
                    <div className={styles.imagePlaceholder}>
                      <div className={styles.placeholderInner}>
                        <span>Mawena</span>
                      </div>
                    </div>
                  )}

                  {/* Badge rupture de stock */}
                  {!product.inStock && (
                    <span className="badge-out-of-stock">Épuisé</span>
                  )}

                  {/* Bouton "Ajouter au panier" qui apparaît au hover */}
                  {product.inStock && (
                    <motion.button
                      className={styles.quickAddBtn}
                      onClick={(e) => handleAddToCart(product, e)}
                      whileHover={{ y: 0, opacity: 1 }}
                      aria-label={`Ajouter ${product.name} au panier`}
                    >
                      <ShoppingBag size={16} />
                      Ajouter au panier
                    </motion.button>
                  )}
                </div>

                {/* Infos produit */}
                <div className="product-card-info">
                  <h3 className="product-card-name">{product.name}</h3>
                  {product.shortDescription && (
                    <p className={styles.cardDesc}>{product.shortDescription}</p>
                  )}
                  <div className={styles.priceRow}>
                    <span className="product-card-price">
                      {formatPrice(product.price)}
                    </span>
                    {product.compareAtPrice && product.compareAtPrice > product.price && (
                      <span className={styles.comparePrice}>
                        {formatPrice(product.compareAtPrice)}
                      </span>
                    )}
                  </div>
                </div>
              </Link>
            </motion.article>
          ))}
        </motion.div>

        {/* Lien "Voir tout" */}
        <motion.div
          className={styles.viewAll}
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5, delay: 0.3 }}
        >
          <Link href="/shop" className="btn-secondary">
            Voir toute la boutique
          </Link>
        </motion.div>
      </div>
    </section>
  )
}
