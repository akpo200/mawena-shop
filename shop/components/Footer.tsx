// ============================================================
// components/Footer.tsx — Pied de page du site
// Liens utiles, réseaux sociaux, copyright
// ============================================================

import Link from 'next/link'
import Image from 'next/image'
import { FaTiktok } from 'react-icons/fa'
import styles from './Footer.module.css'

export default function Footer() {
  return (
    <footer className={styles.footer} id="footer">
      <div className="container">
        <div className={styles.grid}>
          {/* ── Colonne marque ── */}
          <div className={styles.brandColumn}>
            <div className={styles.logoWrapper}>
              <Image
                src="/images/logo.jpeg"
                alt="Mawena"
                width={100}
                height={40}
                style={{ objectFit: 'contain' }}
              />
            </div>
            <p className={styles.tagline}>
              Là où la beauté devient héritage.
            </p>
            <p className={styles.brandDesc}>
              Boutique artisanale africaine. Bijoux, bonnets, vêtements batik 
              et accessoires faits avec amour.
            </p>
          </div>

          {/* ── Navigation boutique ── */}
          <div className={styles.linksColumn}>
            <h4 className={styles.colTitle}>Boutique</h4>
            <ul className={styles.links}>
              <li><Link href="/shop?genre=femme">Femme</Link></li>
              <li><Link href="/shop?genre=homme">Homme</Link></li>
              <li><Link href="/shop?genre=unisexe">Unisexe</Link></li>
              <li><Link href="/shop">Tout voir</Link></li>
            </ul>
          </div>

          {/* ── Infos utiles ── */}
          <div className={styles.linksColumn}>
            <h4 className={styles.colTitle}>Informations</h4>
            <ul className={styles.links}>
              <li><Link href="/about">Notre histoire</Link></li>
              <li><Link href="/livraison">Livraison</Link></li>
              <li><Link href="/retours">Retours</Link></li>
              <li><Link href="/contact">Contact</Link></li>
            </ul>
          </div>

          {/* ── Contact ── */}
          <div className={styles.linksColumn}>
            <h4 className={styles.colTitle}>Nous contacter</h4>
            <p className={styles.contactText}>
              Des questions sur une commande ?
            </p>
            <a
              href="https://wa.me/221701159791"
              className={styles.whatsappLink}
              target="_blank"
              rel="noopener noreferrer"
            >
              💬 WhatsApp : +221 70 115 97 91
            </a>
            {/* ── TikTok ── */}
            <a
              href="https://www.tiktok.com/@mawena_accesories"
              className={styles.tiktokLink}
              target="_blank"
              rel="noopener noreferrer"
              aria-label="Mawena sur TikTok"
            >
              <FaTiktok size={15} />
              TikTok — @mawena_accesories
            </a>
          </div>
        </div>

        {/* ── Ligne de séparation et copyright ── */}
        <div className={styles.bottom}>
          <div className={styles.goldLine} />
          <div className={styles.bottomRow}>
            <p className={styles.copyright}>
              © {new Date().getFullYear()} Mawena — Tous droits réservés
            </p>
            <div className={styles.legalLinks}>
              <Link href="/confidentialite">Politique de confidentialité</Link>
              <Link href="/cgv">CGV</Link>
            </div>
          </div>
        </div>
      </div>
    </footer>
  )
}
