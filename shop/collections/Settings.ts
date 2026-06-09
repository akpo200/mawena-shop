// ============================================================
// collections/Settings.ts — Configuration générale du site
// Permet à l'admin de configurer les liens de paiement (Wave, etc.)
// et le numéro de téléphone de contact (WhatsApp).
// ============================================================

import type { GlobalConfig } from 'payload'

export const Settings: GlobalConfig = {
  slug: 'settings',
  admin: {
    group: 'Configuration',
  },
  // Seul un admin connecté peut modifier les réglages
  access: {
    read: () => true, // Tout le monde peut lire (pour le frontend)
    update: ({ req: { user } }) => Boolean(user && user.role === 'admin'),
  },
  fields: [
    {
      name: 'wavePaymentLink',
      type: 'text',
      label: 'Lien de paiement Wave direct',
      defaultValue: 'https://pay.wave.com/c/mawena-artisanat',
      admin: {
        description: 'Le lien généré par Wave pour encaisser directement.',
      },
    },
    {
      name: 'whatsappNumber',
      type: 'text',
      label: 'Numéro WhatsApp de la boutique (avec indicatif pays, sans espaces/signes)',
      defaultValue: '221701159791',
      admin: {
        description: 'Ex: 221701159791 pour le Sénégal. Utilisé pour les redirections automatiques.',
      },
    },
    {
      name: 'deliveryInstructions',
      type: 'textarea',
      label: 'Message / Instructions de livraison',
      defaultValue: 'Le livreur vous contactera par téléphone pour convenir de l\'heure de livraison.',
    },
    {
      name: 'shippingRules',
      type: 'array',
      label: 'Grille des tarifs de livraison',
      admin: {
        description: 'Configurez les frais de livraison par pays et par tranche de poids.',
      },
      fields: [
        {
          type: 'row',
          fields: [
            {
              name: 'countryCode',
              type: 'select',
              label: 'Pays',
              required: true,
              options: [
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
              ],
            },
            {
              name: 'city',
              type: 'text',
              label: 'Ville (Optionnel — ex: "Dakar", laisser vide pour tout le pays)',
            },
          ],
        },
        {
          type: 'row',
          fields: [
            {
              name: 'minWeight',
              type: 'number',
              label: 'Poids min (kg)',
              defaultValue: 0,
              required: true,
            },
            {
              name: 'maxWeight',
              type: 'number',
              label: 'Poids max (kg)',
              defaultValue: 10,
              required: true,
            },
            {
              name: 'cost',
              type: 'number',
              label: 'Frais de livraison (FCFA)',
              required: true,
            },
          ],
        },
      ],
    },
  ],
}
