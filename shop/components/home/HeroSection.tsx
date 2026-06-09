'use client'
// ============================================================
// components/home/HeroSection.tsx — Section héro de la page d'accueil
// Texte animé lettre par lettre + CTA + fond avec texture africaine
// ============================================================

import { motion } from 'framer-motion'
import Link from 'next/link'
import styles from './HeroSection.module.css'

// Animation des mots du titre — apparition en cascade
const titleVariants = {
  hidden: {},
  visible: {
    transition: { staggerChildren: 0.12, delayChildren: 0.3 },
  },
}

const wordVariants = {
  hidden: { opacity: 0, y: 40, rotateX: -40 },
  visible: {
    opacity: 1,
    y: 0,
    rotateX: 0,
    transition: { duration: 0.7, ease: [0.215, 0.61, 0.355, 1] as any },
  },
}

// Animation du slogan
const sloganVariants = {
  hidden: { opacity: 0, y: 20 },
  visible: {
    opacity: 1,
    y: 0,
    transition: { duration: 0.6, delay: 1.2 },
  },
}

// Animation des CTA
const ctaVariants = {
  hidden: { opacity: 0, y: 20 },
  visible: {
    opacity: 1,
    y: 0,
    transition: { duration: 0.5, delay: 1.6 },
  },
}

// Mots du titre principal — chacun s'anime séparément
const titleWords = ['Là', 'où', 'la', 'beauté', 'devient', 'héritage']

export default function HeroSection() {
  return (
    <section className={styles.hero} aria-label="Section héro — Mawena">
      {/* Fond avec motif africain subtil */}
      <div className={styles.heroBackground} aria-hidden="true">
        <div className={styles.heroPattern} />
        <div className={styles.heroOverlay} />
      </div>

      {/* Contenu centré */}
      <div className={styles.heroContent}>
        {/* Label de marque */}
        <motion.p
          className={styles.brandLabel}
          initial={{ opacity: 0, letterSpacing: '0.3em' }}
          animate={{ opacity: 1, letterSpacing: '0.2em' }}
          transition={{ duration: 1, delay: 0.1 }}
        >
          Mawena
        </motion.p>

        {/* Titre animé mot par mot */}
        <motion.h1
          className={styles.heroTitle}
          variants={titleVariants}
          initial="hidden"
          animate="visible"
          aria-label="Là où la beauté devient héritage"
        >
          {titleWords.map((word) => (
            <motion.span
              key={word}
              className={styles.titleWord}
              variants={wordVariants}
            >
              {word}
            </motion.span>
          ))}
        </motion.h1>

        {/* Ligne dorée séparatrice */}
        <motion.div
          className={styles.goldLine}
          initial={{ scaleX: 0 }}
          animate={{ scaleX: 1 }}
          transition={{ duration: 0.8, delay: 1.0, ease: 'easeOut' }}
        />

        {/* Slogan secondaire */}
        <motion.p
          className={styles.slogan}
          variants={sloganVariants}
          initial="hidden"
          animate="visible"
        >
          Bijoux artisanaux · Vêtements batik · Mode africaine
        </motion.p>

        {/* Boutons d'action */}
        <motion.div
          className={styles.ctaGroup}
          variants={ctaVariants}
          initial="hidden"
          animate="visible"
        >
          <Link href="/shop" className="btn-primary">
            Explorer la boutique
          </Link>
          <Link href="/shop?genre=femme" className="btn-secondary">
            Collection femme
          </Link>
        </motion.div>
      </div>

      {/* Indicateur de scroll */}
      <motion.div
        className={styles.scrollIndicator}
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 2.2 }}
      >
        <motion.div
          className={styles.scrollLine}
          animate={{ y: [0, 8, 0] }}
          transition={{ repeat: Infinity, duration: 1.5, ease: 'easeInOut' }}
        />
        <span>Défiler</span>
      </motion.div>
    </section>
  )
}
