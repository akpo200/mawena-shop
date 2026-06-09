'use client'
// ============================================================
// components/home/SocialGrid.tsx — Galerie réseaux sociaux d'ambiance
// Style e-commerce de mode haut de gamme
// Intègre Instagram + TikTok (@mawena_accesories)
// ============================================================

import { motion } from 'framer-motion'
import Image from 'next/image'
import { FaInstagram, FaTiktok } from 'react-icons/fa'
import styles from './SocialGrid.module.css'

const TIKTOK_URL = 'https://www.tiktok.com/@mawena_accesories'

// 3 premiers posts = TikTok, 3 derniers = Instagram
const socialPosts = [
  { id: 1, image: '/assets/products/B2.jpeg', tag: '@mawena_accesories', platform: 'tiktok', link: TIKTOK_URL },
  { id: 2, image: '/assets/products/BOUCLE RAFIA.jpeg', tag: '#MawenaTikTok', platform: 'tiktok', link: TIKTOK_URL },
  { id: 3, image: '/assets/products/2.jpeg', tag: '#SlowFashion', platform: 'tiktok', link: TIKTOK_URL },
  { id: 4, image: '/assets/products/MONTRE 2.jpeg', tag: '#HeritageAfricain', platform: 'instagram', link: '#' },
  { id: 5, image: '/assets/products/B12.jpeg', tag: '@mawena.officiel', platform: 'instagram', link: '#' },
  { id: 6, image: '/assets/products/WhatsApp Image 2026-03-19 at 09.19.04.jpeg', tag: '#BatikMawena', platform: 'instagram', link: '#' },
]

export default function SocialGrid() {
  return (
    <section className={styles.section}>
      <div className="container">
        {/* En-tête */}
        <motion.div 
          className={styles.header}
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
        >
          <span className={styles.tagline}>Sur les réseaux</span>
          <h2 className={styles.title}>Rejoignez notre univers</h2>
          <div className="divider-gold" />
          <p className={styles.subtitle}>
            Inspirations, coulisses d&apos;ateliers et vos plus beaux looks Mawena
          </p>
        </motion.div>

        {/* Grille d'images */}
        <div className={styles.grid}>
          {socialPosts.map((post, i) => (
            <motion.a
              key={post.id}
              href={post.link}
              target="_blank"
              rel="noopener noreferrer"
              className={styles.postCard}
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: '-50px' }}
              transition={{ duration: 0.5, delay: i * 0.1 }}
            >
              <div className={styles.imageWrapper}>
                <Image 
                  src={post.image} 
                  alt="Mawena inspiration post" 
                  fill
                  sizes="(max-width: 640px) 50vw, (max-width: 1024px) 33vw, 16vw"
                  className={styles.image}
                />
                {/* Overlay hover */}
                <div className={styles.overlay}>
                  {/* Icône TikTok ou Instagram selon la plateforme */}
                  {post.platform === 'tiktok' ? (
                    <FaTiktok size={24} className={styles.icon} />
                  ) : (
                    <FaInstagram size={24} className={styles.icon} />
                  )}
                  <span className={styles.tag}>{post.tag}</span>
                </div>
              </div>
            </motion.a>
          ))}
        </div>

        {/* Bouton "Suivre sur TikTok" */}
        <motion.div
          className={styles.tiktokCta}
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5, delay: 0.3 }}
        >
          <a
            href={TIKTOK_URL}
            target="_blank"
            rel="noopener noreferrer"
            className={styles.tiktokBtn}
          >
            <FaTiktok size={18} />
            Nous suivre sur TikTok
          </a>
        </motion.div>
      </div>
    </section>
  )
}
