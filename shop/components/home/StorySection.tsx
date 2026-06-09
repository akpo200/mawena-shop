'use client'
// ============================================================
// components/home/StorySection.tsx — Section "Notre Histoire"
// Raconte l'histoire de Mawena avec une mise en page éditoriale
// ============================================================

import { motion } from 'framer-motion'
import Image from 'next/image'
import Link from 'next/link'
import styles from './StorySection.module.css'

export default function StorySection() {
  return (
    <section className={styles.section} id="histoire">
      <div className="container">
        <div className={styles.grid}>
          {/* ── Image côté gauche ── */}
          <motion.div
            className={styles.imageColumn}
            initial={{ opacity: 0, x: -40 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true, margin: '-100px' }}
            transition={{ duration: 0.7, ease: [0.215, 0.61, 0.355, 1] }}
          >
            <div className={styles.imageWrapper}>
              {/* Logo Mawena dans la section histoire */}
              <Image
                src="/images/logo.jpeg"
                alt="Mawena — Artisanat africain"
                fill
                style={{ objectFit: 'contain' }}
              />
            </div>
            {/* Carré décoratif doré */}
            <div className={styles.decorSquare} aria-hidden="true" />
          </motion.div>

          {/* ── Texte côté droit ── */}
          <motion.div
            className={styles.textColumn}
            initial={{ opacity: 0, x: 40 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true, margin: '-100px' }}
            transition={{ duration: 0.7, ease: [0.215, 0.61, 0.355, 1], delay: 0.1 }}
          >
            <p className={styles.eyebrow}>Notre histoire</p>
            <h2 className={styles.title}>
              La beauté comme
              <em> acte de transmission</em>
            </h2>
            <div className="divider-gold" style={{ margin: '1.5rem 0' }} />

            <p className={styles.body}>
              Mawena est née d&apos;une conviction simple : que chaque pièce portée peut raconter une histoire, 
              perpétuer un savoir-faire, et célébrer l&apos;identité africaine dans sa pluralité.
            </p>
            <p className={styles.body}>
              Chaque bonnet, chaque bijou, chaque vêtement batik est pensé comme une transmission — 
              de la créatrice à celle qui le porte, de l&apos;héritage à l&apos;avenir.
            </p>

            <blockquote className={styles.quote}>
              &ldquo;Là où la beauté devient héritage.&rdquo;
            </blockquote>

            <Link href="/about" className="btn-secondary">
              En savoir plus
            </Link>
          </motion.div>
        </div>
      </div>
    </section>
  )
}
