'use client'
// ============================================================
// components/home/EditorialGrid.tsx — Section éditoriale scindée
// Style haut de gamme type magazine de mode / Shopify de luxe
// ============================================================

import { motion } from 'framer-motion'
import Image from 'next/image'
import Link from 'next/link'
import styles from './EditorialGrid.module.css'

export default function EditorialGrid() {
  return (
    <section className={styles.section} id="collection-batik">
      <div className="container">
        <div className={styles.grid}>
          {/* Bloc Image de gauche */}
          <motion.div 
            className={styles.imageBlock}
            initial={{ opacity: 0, x: -50 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true, margin: '-100px' }}
            transition={{ duration: 0.8, ease: [0.16, 1, 0.3, 1] }}
          >
            <div className={styles.imageWrapper}>
              <Image 
                src="/assets/products/3.jpeg" 
                alt="Artisanat et tissu Batik d'exception Mawena" 
                fill
                sizes="(max-width: 768px) 100vw, 50vw"
                className={styles.image}
              />
              <div className={styles.imageBadge}>Savoir-faire</div>
            </div>
          </motion.div>

          {/* Bloc Texte de droite */}
          <motion.div 
            className={styles.textBlock}
            initial={{ opacity: 0, x: 50 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true, margin: '-100px' }}
            transition={{ duration: 0.8, delay: 0.1, ease: [0.16, 1, 0.3, 1] }}
          >
            <span className={styles.tagline}>La Collection Batik</span>
            <h2 className={styles.title}>L'élégance du fait main, le respect du temps</h2>
            <div className={styles.line} />
            <p className={styles.description}>
              Chaque pièce Mawena est une œuvre d'art textile unique, teinte et confectionnée à la main par des artisans passionnés. Nos créations en batik reflètent une alliance intemporelle entre tradition ouest-africaine et coupes contemporaines épurées.
            </p>
            <p className={styles.subtext}>
              Porter du Mawena, c'est célébrer une esthétique solaire, authentique et engagée dans la préservation des gestes ancestraux.
            </p>
            <div className={styles.ctaArea}>
              <Link href="/shop?genre=femme" className="btn-primary">
                Découvrir la Collection
              </Link>
            </div>
          </motion.div>
        </div>
      </div>
    </section>
  )
}
