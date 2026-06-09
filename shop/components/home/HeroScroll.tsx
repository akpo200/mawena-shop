'use client'

import { useEffect, useRef, useState } from 'react'
import { motion } from 'framer-motion'
import Link from 'next/link'
import styles from './HeroScroll.module.css'

const FRAME_COUNT = 80
const FRAME_PREFIX = '/assets/hero-sequence/ezgif-frame-'
const FRAME_EXTENSION = '.png'

export default function HeroScroll() {
  const canvasRef = useRef<HTMLCanvasElement>(null)
  const requestRef = useRef<number | undefined>(undefined)
  const frameIndex = useRef(0)
  
  // State pour les images
  const [images, setImages] = useState<HTMLImageElement[]>([])
  const [imagesLoaded, setImagesLoaded] = useState(false)

  // Pre-load images
  useEffect(() => {
    const loadedImages: HTMLImageElement[] = []
    let loadedCount = 0

    for (let i = 1; i <= FRAME_COUNT; i++) {
      const img = new Image()
      const paddedIndex = i.toString().padStart(3, '0')
      img.src = `${FRAME_PREFIX}${paddedIndex}${FRAME_EXTENSION}`
      img.onload = () => {
        loadedCount++
        if (loadedCount === FRAME_COUNT) {
          setImagesLoaded(true)
        }
      }
      loadedImages.push(img)
    }

    setImages(loadedImages)
  }, [])

  // Animation Loop
  const playAnimation = () => {
    if (!canvasRef.current || images.length === 0) return

    const canvas = canvasRef.current
    const ctx = canvas.getContext('2d')
    if (!ctx) return

    const img = images[frameIndex.current]
    if (img) {
      if (canvas.width !== img.width || canvas.height !== img.height) {
        canvas.width = img.width
        canvas.height = img.height
      }
      ctx.clearRect(0, 0, canvas.width, canvas.height)
      ctx.drawImage(img, 0, 0)
    }

    // Incrémente la frame ou reboucle
    frameIndex.current = (frameIndex.current + 1) % FRAME_COUNT

    // On ralentit légèrement l'animation si besoin (par ex. pour 24fps) en utilisant setTimeout 
    // ou on laisse requestAnimationFrame tourner à pleine vitesse (60fps). 
    // Pour une séquence vidéo, on va utiliser une simple requestAnimationFrame pour l'instant.
    setTimeout(() => {
      requestRef.current = requestAnimationFrame(playAnimation)
    }, 1000 / 30) // ~30 fps
  }

  useEffect(() => {
    if (imagesLoaded) {
      requestRef.current = requestAnimationFrame(playAnimation)
    }
    return () => {
      if (requestRef.current) cancelAnimationFrame(requestRef.current)
    }
  }, [imagesLoaded, images])

  return (
    <section className={styles.heroSection}>
      {/* Canvas Background */}
      <canvas ref={canvasRef} className={styles.canvas} />

      {/* Overlay avec Boutons E-commerce de luxe */}
      {imagesLoaded && (
        <div className={styles.overlay}>
          <motion.div
            className={styles.overlayContent}
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 1.2, delay: 0.3, ease: [0.16, 1, 0.3, 1] }}
          >
            <div className={styles.ctaWrapper}>
              <Link href="/shop" className="btn-primary" style={{ pointerEvents: 'auto' }}>
                Découvrir la collection
              </Link>
              <a href="#histoire" className="btn-secondary" style={{ pointerEvents: 'auto', backgroundColor: 'rgba(245, 239, 230, 0.25)', backdropFilter: 'blur(8px)', borderColor: 'var(--brown)' }}>
                Notre histoire
              </a>
            </div>
          </motion.div>
        </div>
      )}
      
      {/* Loader visuel si les images ne sont pas encore prêtes */}
      {!imagesLoaded && (
        <div className={styles.loader}>Chargement de l'expérience...</div>
      )}
    </section>
  )
}
