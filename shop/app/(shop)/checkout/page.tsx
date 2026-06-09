'use client'
// ============================================================
// app/(shop)/checkout/page.tsx — Page de commande et paiement
// Formulaire client + double saisie téléphone + sélecteur de pays/ville
// ============================================================

import { useState, useEffect } from 'react'
import { motion } from 'framer-motion'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { z } from 'zod'
import { useRouter } from 'next/navigation'
import toast from 'react-hot-toast'
import { useCartStore, formatPrice } from '../../../lib/cart-store'
import styles from './CheckoutPage.module.css'

// ── Validation du formulaire de livraison avec double saisie téléphone ──
const checkoutSchema = z.object({
  firstName: z.string().min(2, 'Prénom requis'),
  lastName: z.string().min(2, 'Nom requis'),
  email: z.string().email('Email invalide'),
  phoneCode: z.string().min(1, 'Indicatif requis'),
  phone: z.string().min(6, 'Numéro de téléphone requis'),
  phoneConfirm: z.string().min(6, 'Confirmation du numéro requise'),
  country: z.string().min(2, 'Pays requis'),
  city: z.string().min(2, 'Ville requise'),
  address: z.string().min(5, 'Adresse requise'),
  notes: z.string().optional(),
  paymentMethod: z.enum(['delivery', 'wave'], {
    required_error: 'Veuillez choisir un moyen de paiement',
  }),
}).refine((data) => data.phone === data.phoneConfirm, {
  message: 'Les numéros de téléphone ne correspondent pas',
  path: ['phoneConfirm'],
})

type CheckoutForm = z.infer<typeof checkoutSchema>

// ── Indicatifs pays supportés ──
const phoneCodes = [
  { code: '+221', country: 'SN', label: '🇸🇳 Sénégal (+221)' },
  { code: '+225', country: 'CI', label: '🇨🇮 Côte d\'Ivoire (+225)' },
  { code: '+223', country: 'ML', label: '🇲🇱 Mali (+223)' },
  { code: '+224', country: 'GN', label: '🇬🇳 Guinée (+224)' },
  { code: '+226', country: 'BF', label: '🇧🇫 Burkina Faso (+226)' },
  { code: '+237', country: 'CM', label: '🇨🇲 Cameroun (+237)' },
  { code: '+33', country: 'FR', label: '🇫🇷 France (+33)' },
  { code: '+32', country: 'BE', label: '🇧🇪 Belgique (+32)' },
  { code: '+41', country: 'CH', label: '🇨🇭 Suisse (+41)' },
  { code: '+1', country: 'CA/US', label: '🇨🇦/🇺🇸 Canada / USA (+1)' },
]

// ── Villes par pays présélectionnés ──
const citiesData: Record<string, string[]> = {
  SN: ['Dakar', 'Thiès', 'Mbour', 'Saint-Louis', 'Ziguinchor', 'Touba', 'Kaolack'],
  CI: ['Abidjan', 'Bouaké', 'Yamoussoukro', 'San-Pédro', 'Korhogo', 'Daloa'],
  ML: ['Bamako', 'Sikasso', 'Mopti', 'Kayes', 'Segou'],
  GN: ['Conakry', 'Nzérékoré', 'Kankan', 'Kindia', 'Labé'],
  BF: ['Ouagadougou', 'Bobo-Dioulasso', 'Koudougou', 'Ouahigouya'],
  CM: ['Douala', 'Yaoundé', 'Garoua', 'Bamenda', 'Maroua', 'Bafoussam'],
  FR: ['Paris', 'Lyon', 'Marseille', 'Lille', 'Bordeaux', 'Toulouse', 'Nantes'],
  BE: ['Bruxelles', 'Anvers', 'Gand', 'Charleroi', 'Liège'],
  CH: ['Genève', 'Zurich', 'Bâle', 'Lausanne', 'Berne'],
}

// ── Liste des pays configurés ──
const countries = [
  { value: 'SN', label: '🇸🇳 Sénégal' },
  { value: 'CI', label: '🇨🇮 Côte d\'Ivoire' },
  { value: 'ML', label: '🇲🇱 Mali' },
  { value: 'GN', label: '🇬🇳 Guinée' },
  { value: 'BF', label: '🇧🇫 Burkina Faso' },
  { value: 'CM', label: '🇨🇲 Cameroun' },
  { value: 'FR', label: '🇫🇷 France' },
  { value: 'BE', label: '🇧🇪 Belgique' },
  { value: 'CH', label: '🇨🇭 Suisse' },
  { value: 'OTHER', label: '🌍 Autre pays' },
]

export default function CheckoutPage() {
  const { items, getTotalPrice, clearCart } = useCartStore()
  const router = useRouter()
  const [isProcessing, setIsProcessing] = useState(false)
  const [shippingRules, setShippingRules] = useState<any[]>([])
  const [shippingCost, setShippingCost] = useState<number | null>(null)

  const total = getTotalPrice()
  const totalWeight = items.reduce((sum, item) => sum + (item.weight || 0.2) * item.quantity, 0)

  const {
    register,
    handleSubmit,
    watch,
    setValue,
    formState: { errors },
  } = useForm<CheckoutForm>({
    resolver: zodResolver(checkoutSchema),
    defaultValues: {
      phoneCode: '+221',
      country: 'SN',
      paymentMethod: 'delivery',
    },
  })

  const selectedCountry = watch('country')
  const selectedCity = watch('city')
  const selectedPaymentMethod = watch('paymentMethod')

  // Charger les règles de livraison depuis le CRM
  useEffect(() => {
    fetch('/api/globals/settings')
      .then(res => res.ok ? res.json() : null)
      .then(data => {
        if (data && data.shippingRules) {
          setShippingRules(data.shippingRules)
        }
      })
      .catch(err => console.error('Erreur chargement tarifs livraison:', err))
  }, [])

  // Calculer dynamiquement le tarif de livraison en fonction du pays, de la ville et du poids total
  useEffect(() => {
    if (shippingRules.length === 0) {
      setShippingCost(null)
      return
    }

    // Filtrer les règles correspondant au pays sélectionné
    const countryRules = shippingRules.filter(
      (rule) => rule.countryCode === selectedCountry
    )

    // Si aucune règle spécifique pour ce pays, chercher la règle fallback "OTHER"
    const rulesToSearch = countryRules.length > 0 
      ? countryRules 
      : shippingRules.filter((rule) => rule.countryCode === 'OTHER')

    let matchedRule = null

    // Si une ville est sélectionnée, essayer de trouver une règle avec cette ville spécifique
    if (selectedCity && selectedCity !== 'Autre') {
      const cityNormalized = selectedCity.trim().toLowerCase()
      matchedRule = rulesToSearch.find(
        (rule) =>
          rule.city &&
          rule.city.trim().toLowerCase() === cityNormalized &&
          totalWeight >= (rule.minWeight ?? 0) &&
          totalWeight <= (rule.maxWeight ?? 999999)
      )
    }

    // Si aucune règle spécifique de ville ne correspond, chercher une règle sans ville spécifique (vide)
    if (!matchedRule) {
      matchedRule = rulesToSearch.find(
        (rule) =>
          (!rule.city || rule.city.trim() === '') &&
          totalWeight >= (rule.minWeight ?? 0) &&
          totalWeight <= (rule.maxWeight ?? 999999)
      )
    }

    if (matchedRule) {
      setShippingCost(matchedRule.cost)
    } else {
      setShippingCost(null)
    }
  }, [selectedCountry, selectedCity, totalWeight, shippingRules])

  // Mettre à jour l'indicatif téléphonique si le pays change
  useEffect(() => {
    const matchedCode = phoneCodes.find(c => c.country === selectedCountry)
    if (matchedCode) {
      setValue('phoneCode', matchedCode.code)
    }
  }, [selectedCountry, setValue])

  // Si panier vide, rediriger
  if (items.length === 0) {
    return (
      <div className={styles.emptyCart}>
        <div style={{ height: 'var(--nav-height)' }} />
        <div className="container">
          <h1 className={styles.pageTitle}>Ton panier est vide</h1>
          <button className="btn-primary" onClick={() => router.push('/shop')}>
            Retourner à la boutique
          </button>
        </div>
      </div>
    )
  }

  // ── Soumettre la commande ──
  const handlePayment = async (data: CheckoutForm) => {
    setIsProcessing(true)
    try {
      const fullPhoneNumber = `${data.phoneCode} ${data.phone.trim()}`
      const countryLabel = countries.find(c => c.value === data.country)?.label || data.country

      // 1. Créer la commande dans Payload via l'API interne (inclut livraison calculée)
      const orderRes = await fetch('/api/orders', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          customerInfo: {
            firstName: data.firstName,
            lastName: data.lastName,
            email: data.email,
            phone: fullPhoneNumber,
            country: countryLabel,
            city: data.city,
            address: data.address,
          },
          items: items.map((i) => ({
            name: i.name,
            price: i.price,
            quantity: i.quantity,
            variant: i.variant,
            customizationText: i.customizationText,
          })),
          total: total + (shippingCost || 0),
          notes: data.notes,
          paymentMethod: data.paymentMethod,
        }),
      })

      const orderData = await orderRes.json()
      if (!orderRes.ok || !orderData.success) {
        throw new Error(orderData.message || 'Erreur lors de la création de la commande')
      }

      const orderId = orderData.orderNumber

      toast.success('Commande enregistrée !')
      clearCart()
      router.push(`/confirmation?order=${orderId}&method=${data.paymentMethod}`)
    } catch (error) {
      console.error(error)
      toast.error('Une erreur s\'est produite. Réessayez.')
    } finally {
      setIsProcessing(false)
    }
  }

  return (
    <div className={styles.page}>
      <div style={{ height: 'var(--nav-height)' }} />

      <div className="container">
        <motion.h1
          className={styles.pageTitle}
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
        >
          Finaliser ma commande
        </motion.h1>

        <div className={styles.layout}>
          {/* ── Formulaire de livraison ── */}
          <form
            className={styles.form}
            onSubmit={handleSubmit(handlePayment)}
            id="checkout-form"
            noValidate
          >
            {/* Section infos client */}
            <div className={styles.formSection}>
              <h2 className={styles.sectionTitle}>Informations personnelles</h2>

              <div className={styles.fieldRow}>
                <div className={styles.field}>
                  <label htmlFor="firstName" className={styles.label}>Prénom *</label>
                  <input
                    id="firstName"
                    type="text"
                    className={`${styles.input} ${errors.firstName ? styles.inputError : ''}`}
                    placeholder="Aminata"
                    {...register('firstName')}
                  />
                  {errors.firstName && <p className={styles.error}>{errors.firstName.message}</p>}
                </div>

                <div className={styles.field}>
                  <label htmlFor="lastName" className={styles.label}>Nom *</label>
                  <input
                    id="lastName"
                    type="text"
                    className={`${styles.input} ${errors.lastName ? styles.inputError : ''}`}
                    placeholder="Diallo"
                    {...register('lastName')}
                  />
                  {errors.lastName && <p className={styles.error}>{errors.lastName.message}</p>}
                </div>
              </div>

              <div className={styles.field}>
                <label htmlFor="email" className={styles.label}>Email *</label>
                <input
                  id="email"
                  type="email"
                  className={`${styles.input} ${errors.email ? styles.inputError : ''}`}
                  placeholder="aminata@email.com"
                  {...register('email')}
                />
                {errors.email && <p className={styles.error}>{errors.email.message}</p>}
              </div>

              {/* Saisie double du téléphone */}
              <div className={styles.fieldRow}>
                <div className={styles.field}>
                  <label htmlFor="phone" className={styles.label}>Numéro de Téléphone *</label>
                  <div className={styles.phoneInputWrapper}>
                    <select
                      id="phoneCode"
                      className={`${styles.input} ${styles.select}`}
                      {...register('phoneCode')}
                    >
                      {phoneCodes.map((p) => (
                        <option key={p.code} value={p.code}>
                          {p.label}
                        </option>
                      ))}
                    </select>
                    <input
                      id="phone"
                      type="tel"
                      className={`${styles.input} ${errors.phone ? styles.inputError : ''}`}
                      placeholder="77 000 00 00"
                      {...register('phone')}
                    />
                  </div>
                  {errors.phone && <p className={styles.error}>{errors.phone.message}</p>}
                </div>

                <div className={styles.field}>
                  <label htmlFor="phoneConfirm" className={styles.label}>Confirmer le Numéro *</label>
                  <input
                    id="phoneConfirm"
                    type="tel"
                    className={`${styles.input} ${errors.phoneConfirm ? styles.inputError : ''}`}
                    placeholder="77 000 00 00"
                    {...register('phoneConfirm')}
                  />
                  {errors.phoneConfirm && <p className={styles.error}>{errors.phoneConfirm.message}</p>}
                </div>
              </div>
            </div>

            {/* Section adresse de livraison */}
            <div className={styles.formSection}>
              <h2 className={styles.sectionTitle}>Adresse de livraison</h2>

              <div className={styles.fieldRow}>
                <div className={styles.field}>
                  <label htmlFor="country" className={styles.label}>Pays *</label>
                  <select
                    id="country"
                    className={`${styles.input} ${styles.select} ${errors.country ? styles.inputError : ''}`}
                    {...register('country')}
                  >
                    {countries.map((c) => (
                      <option key={c.value} value={c.value}>{c.label}</option>
                    ))}
                  </select>
                  {errors.country && <p className={styles.error}>{errors.country.message}</p>}
                </div>

                <div className={styles.field}>
                  <label htmlFor="city" className={styles.label}>Ville *</label>
                  {citiesData[selectedCountry] ? (
                    <select
                      id="city"
                      className={`${styles.input} ${styles.select} ${errors.city ? styles.inputError : ''}`}
                      {...register('city')}
                    >
                      <option value="">Choisir une ville...</option>
                      {citiesData[selectedCountry].map((c) => (
                        <option key={c} value={c}>{c}</option>
                      ))}
                      <option value="Autre">Autre...</option>
                    </select>
                  ) : (
                    <input
                      id="city"
                      type="text"
                      className={`${styles.input} ${errors.city ? styles.inputError : ''}`}
                      placeholder="Entrez votre ville"
                      {...register('city')}
                    />
                  )}
                  {errors.city && <p className={styles.error}>{errors.city.message}</p>}
                </div>
              </div>

              <div className={styles.field}>
                <label htmlFor="address" className={styles.label}>Adresse complète *</label>
                <input
                  id="address"
                  type="text"
                  className={`${styles.input} ${errors.address ? styles.inputError : ''}`}
                  placeholder="Rue, quartier, détails..."
                  {...register('address')}
                />
                {errors.address && <p className={styles.error}>{errors.address.message}</p>}
              </div>

              <div className={styles.field}>
                <label htmlFor="notes" className={styles.label}>Instructions ou notes de livraison (optionnel)</label>
                <textarea
                  id="notes"
                  className={`${styles.input} ${styles.textarea}`}
                  placeholder="Ex : Code barrière, instructions pour le livreur..."
                  rows={3}
                  {...register('notes')}
                />
              </div>
            </div>

            {/* Section Mode de paiement */}
            <div className={styles.formSection}>
              <h2 className={styles.sectionTitle}>Mode de paiement</h2>

              <div className={styles.paymentSelector}>
                <div
                  className={`${styles.paymentOption} ${selectedPaymentMethod === 'delivery' ? styles.paymentOptionActive : ''}`}
                  onClick={() => setValue('paymentMethod', 'delivery')}
                >
                  <div className={styles.paymentRadio}>
                    <div className={styles.paymentRadioInner} />
                  </div>
                  <div className={styles.paymentLabel}>
                    <span className={styles.paymentLabelTitle}>💵 Paiement à la livraison</span>
                    <span className={styles.paymentLabelDesc}>Payez en espèces dès que vous recevez votre commande.</span>
                  </div>
                </div>

                <div
                  className={`${styles.paymentOption} ${selectedPaymentMethod === 'wave' ? styles.paymentOptionActive : ''}`}
                  onClick={() => setValue('paymentMethod', 'wave')}
                >
                  <div className={styles.paymentRadio}>
                    <div className={styles.paymentRadioInner} />
                  </div>
                  <div className={styles.paymentLabel}>
                    <span className={styles.paymentLabelTitle}>📱 Transfert Wave</span>
                    <span className={styles.paymentLabelDesc}>Payez instantanément via l'application Wave (Lien fourni après validation).</span>
                  </div>
                </div>
              </div>
              {errors.paymentMethod && <p className={styles.error}>{errors.paymentMethod.message}</p>}
            </div>

            {/* Bouton de validation de commande */}
            <motion.button
              type="submit"
              className={styles.payBtn}
              disabled={isProcessing}
              whileTap={{ scale: 0.98 }}
            >
              {isProcessing ? (
                'Enregistrement de la commande...'
              ) : (
                `Valider ma commande — ${formatPrice(total + (shippingCost || 0))}`
              )}
            </motion.button>
          </form>

          {/* ── Récapitulatif de commande ── */}
          <div className={styles.summary}>
            <h2 className={styles.sectionTitle}>Ma commande</h2>

            <ul className={styles.summaryItems}>
              {items.map((item) => (
                <li key={`${item.id}-${item.variant}`} className={styles.summaryItem}>
                  <div className={styles.summaryItemInfo}>
                    <span className={styles.summaryItemName}>
                      {item.name}
                      {item.variant && <em> — {item.variant}</em>}
                      {item.customizationText && (
                        <div style={{ fontSize: '0.8rem', opacity: 0.8, marginTop: '2px' }}>
                          " {item.customizationText} "
                        </div>
                      )}
                    </span>
                    <span className={styles.summaryItemQty}>× {item.quantity}</span>
                  </div>
                  <span className={styles.summaryItemPrice}>
                    {formatPrice(item.price * item.quantity)}
                  </span>
                </li>
              ))}
            </ul>

            <div className={styles.summaryDivider} />

            <div className={styles.summaryRow}>
              <span>Sous-total</span>
              <span>{formatPrice(total)}</span>
            </div>
            <div className={styles.summaryRow}>
              <span>Livraison</span>
              <span>{shippingCost !== null ? formatPrice(shippingCost) : 'À calculer'}</span>
            </div>

            <div className={styles.summaryTotal}>
              <span>Total</span>
              <span className={styles.totalAmount}>{formatPrice(total + (shippingCost || 0))}</span>
            </div>

            <div className={styles.paymentMethods}>
              <p className={styles.paymentMethodsTitle}>Modes acceptés</p>
              <div className={styles.paymentIcons}>
                <span>💵 Cash on Delivery</span>
                <span>📱 Wave</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
