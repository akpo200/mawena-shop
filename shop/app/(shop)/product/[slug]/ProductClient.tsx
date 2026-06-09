'use client'
// ============================================================
// app/(shop)/product/[slug]/ProductClient.tsx
// Page détail produit — galerie photos, sélecteur variantes, add to cart
// ============================================================

import { useState } from 'react'
import Image from 'next/image'
import { motion, AnimatePresence } from 'framer-motion'
import { ShoppingBag, ChevronLeft, ChevronRight, Check } from 'lucide-react'
import toast from 'react-hot-toast'
import { useCartStore, formatPrice } from '../../../../lib/cart-store'
import styles from './ProductClient.module.css'

interface ProductImage {
  image?: { url?: string }
  alt?: string
}

interface Variant {
  label: string
  available: boolean
}

interface Product {
  id: string
  name: string
  slug: string
  price: number
  compareAtPrice?: number
  inStock: boolean
  shortDescription?: string
  description?: unknown
  hasVariants?: boolean
  variants?: Variant[]
  isCustomizable?: boolean
  images?: ProductImage[]
  category?: { name: string; gender: string }
  weight?: number
}

interface Props {
  product: Product
}

export default function ProductClient({ product }: Props) {
  // ── État galerie ──
  const [activeImage, setActiveImage] = useState(0)
  const [selectedVariant, setSelectedVariant] = useState<string | null>(null)
  const [customizationText, setCustomizationText] = useState('')
  const [addedToCart, setAddedToCart] = useState(false)

  const { addItem, openCart } = useCartStore()

  const images = product.images || []
  const hasImages = images.length > 0

  // ── Navigation galerie ──
  const prevImage = () => setActiveImage((i) => (i === 0 ? images.length - 1 : i - 1))
  const nextImage = () => setActiveImage((i) => (i === images.length - 1 ? 0 : i + 1))

  // ── Ajouter au panier ──
  const handleAddToCart = () => {
    if (!product.inStock) return
    if (product.hasVariants && product.variants?.length && !selectedVariant) {
      toast.error('Choisis une option avant d\'ajouter au panier')
      return
    }
    if (product.isCustomizable && !customizationText.trim()) {
      toast.error('Veuillez entrer le texte de personnalisation pour ce produit')
      return
    }

    addItem({
      id: product.id,
      name: product.name,
      price: product.price,
      image: images[0]?.image?.url,
      slug: product.slug,
      variant: selectedVariant || undefined,
      customizationText: product.isCustomizable ? customizationText.trim() : undefined,
      weight: product.weight || 0.2,
    })

    // Animation de confirmation
    setAddedToCart(true)
    setTimeout(() => setAddedToCart(false), 2000)

    toast.success(`${product.name} ajouté au panier !`)
    openCart()
    setCustomizationText('') // Reset after adding to cart
  }

  return (
    <div className={styles.page}>
      <div style={{ height: 'var(--nav-height)' }} />

      <div className="container">
        <div className={styles.grid}>

          {/* ── Colonne galerie ── */}
          <div className={styles.galleryColumn}>
            {/* Image principale */}
            <div className={styles.mainImage}>
              <AnimatePresence mode="wait">
                <motion.div
                  key={activeImage}
                  className={styles.mainImageInner}
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  exit={{ opacity: 0 }}
                  transition={{ duration: 0.3 }}
                >
                  {hasImages && images[activeImage]?.image?.url ? (
                    <Image
                      src={images[activeImage].image!.url!}
                      alt={images[activeImage].alt || product.name}
                      fill
                      sizes="(max-width: 768px) 100vw, 50vw"
                      style={{ objectFit: 'cover' }}
                      priority
                    />
                  ) : (
                    <div className={styles.imagePlaceholder}>
                      <span>Mawena</span>
                    </div>
                  )}
                </motion.div>
              </AnimatePresence>

              {/* Flèches navigation si plusieurs images */}
              {images.length > 1 && (
                <>
                  <button className={`${styles.navBtn} ${styles.navBtnPrev}`} onClick={prevImage} aria-label="Image précédente">
                    <ChevronLeft size={22} />
                  </button>
                  <button className={`${styles.navBtn} ${styles.navBtnNext}`} onClick={nextImage} aria-label="Image suivante">
                    <ChevronRight size={22} />
                  </button>
                </>
              )}
            </div>

            {/* Miniatures */}
            {images.length > 1 && (
              <div className={styles.thumbnails}>
                {images.map((img, i) => (
                  <button
                    key={i}
                    className={`${styles.thumb} ${i === activeImage ? styles.thumbActive : ''}`}
                    onClick={() => setActiveImage(i)}
                    aria-label={`Voir photo ${i + 1}`}
                  >
                    {img.image?.url && (
                      <Image
                        src={img.image.url}
                        alt={img.alt || product.name}
                        fill
                        sizes="80px"
                        style={{ objectFit: 'cover' }}
                      />
                    )}
                  </button>
                ))}
              </div>
            )}
          </div>

          {/* ── Colonne infos produit ── */}
          <div className={styles.infoColumn}>
            {/* Catégorie */}
            {product.category && (
              <p className={styles.categoryLabel}>{product.category.name}</p>
            )}

            {/* Nom du produit */}
            <h1 className={styles.productName}>{product.name}</h1>

            {/* Prix */}
            <div className={styles.priceSection}>
              <span className={styles.price}>{formatPrice(product.price)}</span>
              {product.compareAtPrice && product.compareAtPrice > product.price && (
                <span className={styles.comparePrice}>{formatPrice(product.compareAtPrice)}</span>
              )}
            </div>

            {/* Description courte */}
            {product.shortDescription && (
              <p className={styles.shortDesc}>{product.shortDescription}</p>
            )}

            <div className={styles.divider} />

            {/* Sélecteur de variantes */}
            {product.hasVariants && product.variants && product.variants.length > 0 && (
              <div className={styles.variantSection}>
                <p className={styles.variantLabel}>
                  Choisir une option
                  {selectedVariant && <strong> — {selectedVariant}</strong>}
                </p>
                <div className={styles.variants}>
                  {product.variants.map((v) => (
                    <button
                      key={v.label}
                      className={`${styles.variantBtn} ${selectedVariant === v.label ? styles.variantSelected : ''} ${!v.available ? styles.variantUnavailable : ''}`}
                      onClick={() => v.available && setSelectedVariant(v.label)}
                      disabled={!v.available}
                      aria-pressed={selectedVariant === v.label}
                    >
                      {v.label}
                    </button>
                  ))}
                </div>
              </div>
            )}

            {/* Personnalisation */}
            {product.isCustomizable && (
              <div className={styles.customizationSection}>
                <label htmlFor="customization" className={styles.customizationLabel}>
                  Texte de personnalisation *
                </label>
                <input
                  id="customization"
                  type="text"
                  placeholder="Ex: Maman chérie"
                  value={customizationText}
                  onChange={(e) => setCustomizationText(e.target.value)}
                  className={styles.customizationInput}
                  maxLength={30}
                />
                <p className={styles.customizationHint}>Maximum 30 caractères.</p>
              </div>
            )}

            {/* Statut stock */}
            <div className={styles.stockStatus}>
              {product.inStock ? (
                <span className={styles.inStock}>
                  <span className={styles.dot} /> En stock — livraison rapide
                </span>
              ) : (
                <span className={styles.outOfStock}>Épuisé momentanément</span>
              )}
            </div>

            {/* Bouton Ajouter au panier */}
            <motion.button
              className={`${styles.addToCartBtn} ${addedToCart ? styles.added : ''}`}
              onClick={handleAddToCart}
              disabled={!product.inStock}
              whileTap={{ scale: 0.98 }}
              aria-label={`Ajouter ${product.name} au panier`}
            >
              {addedToCart ? (
                <>
                  <Check size={18} /> Ajouté !
                </>
              ) : (
                <>
                  <ShoppingBag size={18} />
                  {product.inStock ? 'Ajouter au panier' : 'Épuisé'}
                </>
              )}
            </motion.button>

            {/* Informations de livraison */}
            <div className={styles.shipping}>
              <div className={styles.shippingItem}>
                <span>🌍</span>
                <span>Livraison internationale disponible</span>
              </div>
              <div className={styles.shippingItem}>
                <span>💳</span>
                <span>Carte bancaire, Wave, Orange Money</span>
              </div>
              <div className={styles.shippingItem}>
                <span>🤝</span>
                <span>Pièce unique faite à la main</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
