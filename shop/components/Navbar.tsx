'use client'
// ============================================================
// components/Navbar.tsx — Barre de navigation principale
// Transparent au départ, devient opaque au scroll
// Contient : logo, catégories, icône panier avec compteur
// ============================================================

import { useState, useEffect } from 'react'
import Link from 'next/link'
import Image from 'next/image'
import { motion, AnimatePresence } from 'framer-motion'
import { ShoppingBag, Menu, X } from 'lucide-react'
import { useCartStore } from '../lib/cart-store'
import styles from './Navbar.module.css'

// ── Navigation links ──
const navLinks = [
  { label: 'Boutique', href: '/shop' },
  { label: 'Notre histoire', href: '/#histoire' },
  { label: 'Contact', href: '/#footer' },
]

export default function Navbar() {
  const [scrolled, setScrolled] = useState(false)
  const [mobileOpen, setMobileOpen] = useState(false)

  // Accéder au panier depuis le store global
  const { getTotalItems, toggleCart } = useCartStore()
  const totalItems = getTotalItems()

  // ── Détecter le scroll pour changer l'apparence de la navbar ──
  useEffect(() => {
    const handleScroll = () => setScrolled(window.scrollY > 50)
    window.addEventListener('scroll', handleScroll, { passive: true })
    return () => window.removeEventListener('scroll', handleScroll)
  }, [])

  // ── Bloquer le scroll body quand le menu mobile est ouvert ──
  useEffect(() => {
    if (mobileOpen) {
      document.body.style.overflow = 'hidden'
    } else {
      document.body.style.overflow = ''
    }
    return () => { document.body.style.overflow = '' }
  }, [mobileOpen])

  return (
    <>
      {/* ── Navbar principale ── */}
      <motion.nav
        className={`${styles.navbar} ${scrolled ? styles.scrolled : ''}`}
        initial={{ y: -100, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ duration: 0.6, ease: 'easeOut' }}
      >
        <div className={styles.navInner}>
          {/* Logo Mawena */}
          <Link href="/" className={styles.logo}>
            <Image
              src="/images/logo.png"
              alt="Mawena — Là où la beauté devient héritage"
              width={100}
              height={45}
              style={{ objectFit: 'contain' }}
              priority
            />
          </Link>

          {/* Liens desktop */}
          <ul className={styles.navLinks}>
            {navLinks.map((link) => (
              <li key={link.href}>
                <Link href={link.href} className={styles.navLink}>
                  {link.label}
                </Link>
              </li>
            ))}
          </ul>

          {/* Actions droite : panier + menu mobile */}
          <div className={styles.navActions}>
            {/* Icône panier avec compteur d'articles */}
            <button
              className={styles.cartButton}
              onClick={toggleCart}
              aria-label={`Panier — ${totalItems} article${totalItems !== 1 ? 's' : ''}`}
            >
              <ShoppingBag size={22} />
              {/* Badge compteur animé */}
              <AnimatePresence>
                {totalItems > 0 && (
                  <motion.span
                    className={styles.cartBadge}
                    key="cart-badge"
                    initial={{ scale: 0 }}
                    animate={{ scale: 1 }}
                    exit={{ scale: 0 }}
                    transition={{ type: 'spring', stiffness: 400, damping: 15 }}
                  >
                    {totalItems}
                  </motion.span>
                )}
              </AnimatePresence>
            </button>

            {/* Bouton menu hamburger (mobile seulement) */}
            <button
              className={styles.mobileMenuBtn}
              onClick={() => setMobileOpen(!mobileOpen)}
              aria-label="Ouvrir le menu"
            >
              {mobileOpen ? <X size={24} /> : <Menu size={24} />}
            </button>
          </div>
        </div>
      </motion.nav>

      {/* ── Menu mobile ── */}
      <AnimatePresence>
        {mobileOpen && (
          <motion.div
            className={styles.mobileMenu}
            initial={{ x: '100%' }}
            animate={{ x: 0 }}
            exit={{ x: '100%' }}
            transition={{ type: 'tween', duration: 0.35, ease: 'easeInOut' }}
          >
            {/* Fermer le menu */}
            <button
              className={styles.mobileClose}
              onClick={() => setMobileOpen(false)}
            >
              <X size={28} />
            </button>

            {/* Logo dans le menu mobile */}
            <div className={styles.mobileLogoWrap}>
              <Image
                src="/images/logo.png"
                alt="Mawena"
                width={120}
                height={50}
                style={{ objectFit: 'contain' }}
              />
            </div>

            <ul className={styles.mobileNavLinks}>
              {navLinks.map((link, i) => (
                <motion.li
                  key={link.href}
                  initial={{ opacity: 0, x: 20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: i * 0.07 + 0.1 }}
                >
                  <Link
                    href={link.href}
                    className={styles.mobileNavLink}
                    onClick={() => setMobileOpen(false)}
                  >
                    {link.label}
                  </Link>
                </motion.li>
              ))}
            </ul>

            {/* CTA panier dans le menu mobile */}
            <motion.button
              className={`btn-primary ${styles.mobileCartBtn}`}
              onClick={() => { setMobileOpen(false); toggleCart() }}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.4 }}
            >
              <ShoppingBag size={18} />
              Mon panier {totalItems > 0 && `(${totalItems})`}
            </motion.button>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Overlay sombre derrière le menu mobile */}
      <AnimatePresence>
        {mobileOpen && (
          <motion.div
            className={styles.overlay}
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={() => setMobileOpen(false)}
          />
        )}
      </AnimatePresence>
    </>
  )
}
