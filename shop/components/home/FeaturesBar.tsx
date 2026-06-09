import { Truck, ShieldCheck, HeartHandshake, Globe } from 'lucide-react'
import styles from './FeaturesBar.module.css'

const features = [
  {
    icon: <Globe size={24} />,
    title: 'Livraison Internationale',
    desc: 'Où que vous soyez dans le monde',
  },
  {
    icon: <HeartHandshake size={24} />,
    title: 'Artisanat Authentique',
    desc: 'Fait main avec amour et tradition',
  },
  {
    icon: <ShieldCheck size={24} />,
    title: 'Paiement Sécurisé',
    desc: 'Transactions 100% protégées',
  },
  {
    icon: <Truck size={24} />,
    title: 'Expédition Rapide',
    desc: 'Préparation soignée sous 48h',
  },
]

export default function FeaturesBar() {
  return (
    <section className={styles.featuresSection}>
      <div className={styles.container}>
        <div className={styles.grid}>
          {features.map((feat, i) => (
            <div key={i} className={styles.featureItem}>
              <div className={styles.iconWrapper}>{feat.icon}</div>
              <h3 className={styles.featureTitle}>{feat.title}</h3>
              <p className={styles.featureDesc}>{feat.desc}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}
