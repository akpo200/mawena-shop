'use client'
// ============================================================
// components/CartDrawer.tsx — Drawer panier latéral
// S'ouvre depuis la droite avec une animation fluide
// Affiche les articles, quantités, total et bouton checkout
// ============================================================

import { motion, AnimatePresence } from 'framer-motion'
import Image from 'next/image'
import Link from 'next/link'
import { X, Minus, Plus, ShoppingBag, Trash2 } from 'lucide-react'
import { useCartStore, formatPrice } from '../lib/cart-store'
import styles from './CartDrawer.module.css'

export default function CartDrawer() {
  const {
    items,
    isOpen,
    closeCart,
    removeItem,
    updateQuantity,
    getTotalPrice,
    getTotalItems,
  } = useCartStore()

  const total = getTotalPrice()
  const count = getTotalItems()

  return (
    <>
      {/* ── Overlay sombre derrière le drawer ── */}
      <AnimatePresence>
        {isOpen && (
          <motion.div
            className={styles.overlay}
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={closeCart}
            aria-hidden="true"
          />
        )}
      </AnimatePresence>

      {/* ── Drawer lui-même ── */}
      <AnimatePresence>
        {isOpen && (
          <motion.div
            className={styles.drawer}
            initial={{ x: '100%' }}
            animate={{ x: 0 }}
            exit={{ x: '100%' }}
            transition={{ type: 'tween', duration: 0.35, ease: 'easeInOut' }}
            role="dialog"
            aria-label="Panier d'achat"
          >
            {/* Header du drawer */}
            <div className={styles.header}>
              <div className={styles.headerTitle}>
                <ShoppingBag size={18} />
                <span>Mon panier</span>
                {count > 0 && (
                  <span className={styles.count}>{count}</span>
                )}
              </div>
              <button className={styles.closeBtn} onClick={closeCart} aria-label="Fermer le panier">
                <X size={22} />
              </button>
            </div>

            {/* ── Corps : liste des articles ── */}
            <div className={styles.body}>
              {items.length === 0 ? (
                /* Panier vide */
                <div className={styles.empty}>
                  <ShoppingBag size={48} strokeWidth={1} />
                  <p>Ton panier est vide</p>
                  <Link href="/shop" className="btn-secondary" onClick={closeCart}>
                    Découvrir la boutique
                  </Link>
                </div>
              ) : (
                /* Liste des articles */
                <ul className={styles.items}>
                  {items.map((item) => (
                    <motion.li
                      key={`${item.id}-${item.variant}`}
                      className={styles.item}
                      layout
                      initial={{ opacity: 0, y: 10 }}
                      animate={{ opacity: 1, y: 0 }}
                      exit={{ opacity: 0, x: 30 }}
                    >
                      {/* Image du produit */}
                      <div className={styles.itemImage}>
                        {item.image ? (
                          <Image
                            src={item.image}
                            alt={item.name}
                            fill
                            style={{ objectFit: 'cover' }}
                            sizes="80px"
                          />
                        ) : (
                          <div className={styles.imagePlaceholder} />
                        )}
                      </div>

                      {/* Info produit */}
                      <div className={styles.itemInfo}>
                        <Link
                          href={`/product/${item.slug}`}
                          className={styles.itemName}
                          onClick={closeCart}
                        >
                          {item.name}
                        </Link>
                        {item.variant && (
                          <span className={styles.itemVariant}>{item.variant}</span>
                        )}
                        <span className={styles.itemPrice}>
                          {formatPrice(item.price)}
                        </span>

                        {/* Contrôles quantité */}
                        <div className={styles.quantityControl}>
                          <button
                            className={styles.qtyBtn}
                            onClick={() => updateQuantity(item.id, item.quantity - 1, item.variant)}
                            aria-label="Diminuer la quantité"
                          >
                            <Minus size={14} />
                          </button>
                          <span className={styles.qtyValue}>{item.quantity}</span>
                          <button
                            className={styles.qtyBtn}
                            onClick={() => updateQuantity(item.id, item.quantity + 1, item.variant)}
                            aria-label="Augmenter la quantité"
                          >
                            <Plus size={14} />
                          </button>
                          <button
                            className={styles.removeBtn}
                            onClick={() => removeItem(item.id, item.variant)}
                            aria-label="Supprimer l'article"
                          >
                            <Trash2 size={14} />
                          </button>
                        </div>
                      </div>
                    </motion.li>
                  ))}
                </ul>
              )}
            </div>

            {/* ── Footer : total et bouton checkout ── */}
            {items.length > 0 && (
              <div className={styles.footer}>
                {/* Ligne de séparation dorée */}
                <div className={styles.divider} />

                {/* Sous-total */}
                <div className={styles.subtotal}>
                  <span>Sous-total</span>
                  <span className={styles.totalAmount}>{formatPrice(total)}</span>
                </div>
                <p className={styles.shippingNote}>
                  Frais de livraison calculés à l&apos;étape suivante
                </p>

                {/* Bouton commander */}
                <Link
                  href="/checkout"
                  className={`btn-primary ${styles.checkoutBtn}`}
                  onClick={closeCart}
                >
                  Commander — {formatPrice(total)}
                </Link>

                {/* Continuer les achats */}
                <button
                  className={styles.continueBtn}
                  onClick={closeCart}
                >
                  Continuer mes achats
                </button>
              </div>
            )}
          </motion.div>
        )}
      </AnimatePresence>
    </>
  )
}
