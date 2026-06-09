'use client'
// ============================================================
// components/home/CategoriesSection.tsx — Grille de catégories
// Affiche les grandes sections : Femme / Homme / Unisexe
// Avec animation scroll-reveal au défilement
// ============================================================

import { motion } from 'framer-motion'
import Link from 'next/link'
import styles from './CategoriesSection.module.css'

import Image from 'next/image'

// Données statiques des catégories principales avec emojis et images
const mainCategories = [
  {
    id: 'femme',
    label: 'Femme',
    description: 'Bonnets · Bijoux · Batik',
    href: '/shop?genre=femme',
    image: '/assets/products/B4.jpeg',
  },
  {
    id: 'homme',
    label: 'Homme',
    description: 'Montres · Accessoires',
    href: '/shop?genre=homme',
    image: '/assets/products/MONTRES.jpeg',
  },
  {
    id: 'unisexe',
    label: 'Unisexe',
    description: 'Tote Bags · Accessoires',
    href: '/shop?genre=unisexe',
    image: '/assets/products/3.jpeg',
  },
  {
    id: 'enfant',
    label: 'Enfant',
    description: 'Vêtements · Accessoires mignons',
    href: '/shop?genre=enfant',
    image: '/assets/products/B5.jpeg',
  },
]

// Animation qui se déclenche quand l'élément entre dans le viewport
const cardVariants = {
  hidden: { opacity: 0, y: 50 },
  visible: (i: number) => ({
    opacity: 1,
    y: 0,
    transition: {
      duration: 0.6,
      delay: i * 0.15,
      ease: [0.215, 0.61, 0.355, 1] as any,
    },
  }),
}

// Props : reçoit les catégories depuis Payload (ou utilise les statiques)
interface Props {
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  categories?: any[]
}

export default function CategoriesSection({ categories: _categories }: Props) {
  return (
    <section className={styles.section}>
      <div className="container">
        {/* En-tête de section */}
        <motion.div
          className={styles.sectionHeader}
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: '-100px' }}
          transition={{ duration: 0.6 }}
        >
          <h2 className={styles.sectionTitle}>Explorer par univers</h2>
          <div className="divider-gold" />
        </motion.div>

        {/* Grille des 3 grandes catégories */}
        <div className={styles.categoriesGrid}>
          {mainCategories.map((cat, i) => (
            <motion.div
              key={cat.id}
              custom={i}
              variants={cardVariants}
              initial="hidden"
              whileInView="visible"
              viewport={{ once: true, margin: '-80px' }}
            >
              <Link href={cat.href} className={styles.categoryCard}>
                {/* Image de fond */}
                <div className={styles.cardImageWrap}>
                  <Image
                    src={cat.image}
                    alt={`Collection ${cat.label}`}
                    fill
                    sizes="(max-width: 768px) 100vw, 33vw"
                    className={styles.cardImage}
                  />
                  <div className={styles.cardImageOverlay} />
                </div>

                {/* Motif de fond subtil */}
                <div className={styles.cardPattern} aria-hidden="true" />

                {/* Contenu de la carte */}
                <div className={styles.cardContent}>
                  <h3 className={styles.cardTitle}>{cat.label}</h3>
                  <p className={styles.cardDesc}>{cat.description}</p>

                  {/* Bouton "Découvrir" qui apparaît au hover */}
                  <span className={styles.cardCta}>
                    Découvrir →
                  </span>
                </div>
              </Link>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  )
}
