// ============================================================
// collections/Orders.ts — Collection des commandes
// Chaque commande passée sur le site apparaît ici
// La cliente peut voir qui a commandé quoi, et le statut du paiement
// ============================================================

import type { CollectionConfig } from 'payload'

export const Orders: CollectionConfig = {
  slug: 'orders',
  admin: {
    useAsTitle: 'orderNumber',
    group: 'Commandes',
    // Afficher les colonnes les plus importantes
    defaultColumns: ['orderNumber', 'customerName', 'total', 'status', 'paymentMethod', 'createdAt'],
    // Les commandes ne peuvent pas être créées depuis l'admin (elles viennent du site)
    // Mais on peut les consulter et modifier leur statut
  },
  // Lecture seule pour les commandes (créées automatiquement par le site)
  access: {
    create: () => true, // Créées par l'API du site
    read: () => true,
    update: () => true, // Pour changer le statut
    delete: () => false, // Ne jamais supprimer une commande
  },
  fields: [
    // ── Numéro de commande unique ──
    {
      name: 'orderNumber',
      type: 'text',
      label: 'N° de commande',
      required: true,
      unique: true,
    },

    // ── Informations client ──
    {
      name: 'customerInfo',
      type: 'group',
      label: '👤 Informations du client',
      fields: [
        {
          type: 'row',
          fields: [
            {
              name: 'customerName',
              type: 'text',
              label: 'Nom complet',
              required: true,
            },
            {
              name: 'customerEmail',
              type: 'email',
              label: 'Email',
              required: true,
            },
          ],
        },
        {
          type: 'row',
          fields: [
            {
              name: 'customerPhone',
              type: 'text',
              label: 'Téléphone',
            },
            {
              name: 'customerCountry',
              type: 'text',
              label: 'Pays',
            },
          ],
        },
        {
          name: 'shippingAddress',
          type: 'textarea',
          label: 'Adresse de livraison',
        },
      ],
    },

    // ── Produits commandés ──
    {
      name: 'items',
      type: 'array',
      label: '🛍️ Produits commandés',
      fields: [
        {
          name: 'product',
          type: 'relationship',
          relationTo: 'products',
          label: 'Produit',
        },
        {
          name: 'productName',
          type: 'text',
          label: 'Nom du produit (copie)',
          admin: {
            description: 'Sauvegardé pour conserver l\'historique même si le produit change',
          },
        },
        {
          name: 'variant',
          type: 'text',
          label: 'Variante choisie (taille, couleur...)',
        },
        {
          name: 'customizationText',
          type: 'text',
          label: 'Texte de personnalisation (ex: Tote bags)',
        },
        {
          type: 'row',
          fields: [
            {
              name: 'quantity',
              type: 'number',
              label: 'Quantité',
              defaultValue: 1,
            },
            {
              name: 'unitPrice',
              type: 'number',
              label: 'Prix unitaire (FCFA)',
            },
          ],
        },
      ],
    },

    // ── Paiement ──
    {
      name: 'payment',
      type: 'group',
      label: '💳 Paiement',
      fields: [
        {
          type: 'row',
          fields: [
            {
              name: 'total',
              type: 'number',
              label: 'Total (FCFA)',
              required: true,
            },
            {
              name: 'paymentMethod',
              type: 'select',
              label: 'Méthode de paiement',
              options: [
                { label: 'Carte bancaire', value: 'card' },
                { label: 'Wave', value: 'wave' },
                { label: 'Paiement à la livraison', value: 'delivery' },
              ],
            },
          ],
        },
        {
          type: 'row',
          fields: [
            {
              name: 'transactionId',
              type: 'text',
              label: 'ID transaction Flutterwave',
            },
            {
              name: 'paymentStatus',
              type: 'select',
              label: 'Statut du paiement',
              options: [
                { label: '⏳ En attente', value: 'pending' },
                { label: '✅ Payé', value: 'paid' },
                { label: '❌ Échoué', value: 'failed' },
                { label: '🔄 Remboursé', value: 'refunded' },
              ],
              defaultValue: 'pending',
            },
          ],
        },
      ],
    },

    // ── Statut de la commande ──
    {
      name: 'status',
      type: 'select',
      label: '📦 Statut de la commande',
      options: [
        { label: '🆕 Nouvelle commande', value: 'new' },
        { label: '✅ Confirmée', value: 'confirmed' },
        { label: '🔧 En préparation', value: 'processing' },
        { label: '🚚 Expédiée', value: 'shipped' },
        { label: '🎉 Livrée', value: 'delivered' },
        { label: '❌ Annulée', value: 'cancelled' },
      ],
      defaultValue: 'new',
    },

    // ── Notes internes ──
    {
      name: 'notes',
      type: 'textarea',
      label: '📝 Notes internes (visibles seulement par toi)',
    },
  ],
}
