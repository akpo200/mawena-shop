'use client'
// ============================================================
// app/(shop)/confirmation/page.tsx — Page de confirmation de commande
// Bouton WhatsApp pour redirection automatique et détails Wave (Dynamique)
// ============================================================

import { Suspense, useEffect, useState } from 'react'
import { useSearchParams } from 'next/navigation'
import { motion } from 'framer-motion'
import Link from 'next/link'
import { CheckCircle, PhoneCall, Link2 } from 'lucide-react'
import styles from './ConfirmationPage.module.css'

interface SettingsData {
  wavePaymentLink: string
  whatsappNumber: string
  deliveryInstructions: string
}

function ConfirmationContent() {
  const searchParams = useSearchParams()
  const orderNumber = searchParams.get('order') || 'N/A'
  const method = searchParams.get('method') || 'delivery'

  const [settings, setSettings] = useState<SettingsData>({
    wavePaymentLink: 'https://pay.wave.com/c/mawena-artisanat',
    whatsappNumber: '221701159791',
    deliveryInstructions: 'Le livreur vous contactera par téléphone pour convenir de l\'heure de livraison.'
  })

  // Récupérer les réglages dynamiques modifiés depuis l'admin
  useEffect(() => {
    fetch('/api/globals/settings')
      .then(res => {
        if (res.ok) return res.json()
        return null
      })
      .then(data => {
        if (data) {
          setSettings({
            wavePaymentLink: data.wavePaymentLink || 'https://pay.wave.com/c/mawena-artisanat',
            whatsappNumber: data.whatsappNumber || '221701159791',
            deliveryInstructions: data.deliveryInstructions || 'Le livreur vous contactera par téléphone pour convenir de l\'heure de livraison.'
          })
        }
      })
      .catch(err => console.error('Erreur chargement réglages dynamiques:', err))
  }, [])

  // Texte formaté pour confirmation client sur WhatsApp
  const shareText = `Bonjour Mawena, je viens de passer commande sur votre boutique !\n\nN° Commande : *${orderNumber}*\nMode de paiement choisi : *${
    method === 'wave' ? 'Wave (Transfert)' : 'Paiement à la livraison'
  }*\n\nPourriez-vous confirmer la réception et le délai de livraison ? Merci !`

  const whatsappUrl = `https://wa.me/${settings.whatsappNumber}?text=${encodeURIComponent(shareText)}`

  const [countdown, setCountdown] = useState(3)
  const [isRedirected, setIsRedirected] = useState(false)

  // Redirection automatique vers WhatsApp après 3 secondes
  useEffect(() => {
    if (orderNumber === 'N/A' || isRedirected) return

    const timer = setInterval(() => {
      setCountdown(prev => {
        if (prev <= 1) {
          clearInterval(timer)
          setIsRedirected(true)
          window.location.href = whatsappUrl
          return 0
        }
        return prev - 1
      })
    }, 1000)

    return () => clearInterval(timer)
  }, [whatsappUrl, orderNumber, isRedirected])

  return (
    <div className={styles.page}>
      <div style={{ height: 'var(--nav-height)' }} />
      <div className="container">
        <motion.div
          className={styles.card}
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.5 }}
        >
          {/* Icône succès animée */}
          <motion.div
            className={styles.iconWrapper}
            initial={{ scale: 0, rotate: -180 }}
            animate={{ scale: 1, rotate: 0 }}
            transition={{ type: 'spring', stiffness: 200, damping: 15, delay: 0.2 }}
          >
            <CheckCircle size={56} strokeWidth={1.5} className={styles.icon} />
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.4 }}
          >
            <h1 className={styles.title}>Merci pour ta commande !</h1>
            <div className="divider-gold" />
            
            {method === 'wave' ? (
              <div style={{ margin: '1.5rem 0', padding: '1.5rem', background: 'rgba(26, 172, 235, 0.1)', borderRadius: '8px', border: '1px solid rgba(26, 172, 235, 0.3)' }}>
                <h3 style={{ color: '#1aaceb', display: 'flex', alignItems: 'center', gap: '0.5rem', justifyContent: 'center' }}>
                  <Link2 size={20} /> Règlement par Wave
                </h3>
                <p style={{ fontSize: '0.9rem', margin: '0.5rem 0 1rem' }}>
                  Pour finaliser votre commande, veuillez effectuer le transfert en cliquant sur le bouton ci-dessous :
                </p>
                <a href={settings.wavePaymentLink} target="_blank" rel="noopener noreferrer" className="btn-primary" style={{ display: 'inline-flex', alignItems: 'center', gap: '0.5rem', background: '#1aaceb', borderColor: '#1aaceb' }}>
                  Payer avec Wave
                </a>
              </div>
            ) : (
              <p className={styles.message}>
                Ta commande a bien été reçue et enregistrée ! {settings.deliveryInstructions} Le paiement se fera en espèces à ce moment-là.
              </p>
            )}

            {/* Numéro de commande */}
            <div className={styles.orderBox}>
              <p className={styles.orderLabel}>N° de commande</p>
              <p className={styles.orderNumber}>{orderNumber}</p>
            </div>

            {/* Redirection WhatsApp automatique/manuelle */}
            <div style={{ margin: '2rem 0', textAlign: 'center' }}>
              {countdown > 0 ? (
                <p style={{ fontSize: '0.95rem', marginBottom: '1rem', color: 'var(--brown-light)', animation: 'pulse 1s infinite' }}>
                  📲 Redirection automatique vers WhatsApp pour valider la commande dans <strong>{countdown}</strong>s...
                </p>
              ) : (
                <p style={{ fontSize: '0.95rem', marginBottom: '1rem', color: '#25D366', fontWeight: 'bold' }}>
                  ✅ Redirection en cours... Si rien ne se passe, clique sur le bouton ci-dessous.
                </p>
              )}
              <a
                href={whatsappUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="btn-primary"
                style={{
                  background: '#25D366',
                  borderColor: '#25D366',
                  color: '#fff',
                  display: 'inline-flex',
                  alignItems: 'center',
                  gap: '0.6rem',
                  padding: '1rem 1.8rem',
                  fontSize: '1.05rem',
                  boxShadow: '0 8px 20px rgba(37, 211, 102, 0.3)'
                }}
              >
                <PhoneCall size={18} />
                Confirmer sur WhatsApp
              </a>
            </div>

            <p className={styles.contactInfo}>
              Besoin d&apos;aide ? Contacte-nous directement sur{' '}
              <a href={whatsappUrl} className={styles.waLink}>
                WhatsApp
              </a>
            </p>

            {/* Actions */}
            <div className={styles.actions}>
              <Link href="/shop" className="btn-secondary">
                Continuer mes achats
              </Link>
              <Link href="/" className="btn-secondary">
                Retour à l&apos;accueil
              </Link>
            </div>
          </motion.div>
        </motion.div>
      </div>
    </div>
  )
}

// Suspense requis pour useSearchParams en Next.js 14
export default function ConfirmationPage() {
  return (
    <Suspense fallback={<div style={{ height: '100vh', background: 'var(--cream)' }} />}>
      <ConfirmationContent />
    </Suspense>
  )
}
