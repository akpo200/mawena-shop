// ============================================================
// collections/Products.ts — Collection principale des produits
// C'est ici que la cliente gère tout son catalogue :
// prix, photos, descriptions, disponibilité
// ============================================================

import type { CollectionConfig } from 'payload'

export const Products: CollectionConfig = {
  slug: 'products',
  admin: {
    useAsTitle: 'name',
    group: 'Boutique',
    // Colonnes visibles dans la liste des produits
    defaultColumns: ['name', 'category', 'price', 'inStock', 'featured'],
    // Prévisualisation de l'image dans la liste
    listSearchableFields: ['name', 'description'],
  },
  // ── Accès : tout le monde peut lire les produits ──
  access: {
    read: () => true,
  },
  fields: [
    // ──────────────────────────────────────────
    // Informations de base du produit
    // ──────────────────────────────────────────
    {
      name: 'name',
      type: 'text',
      label: 'Nom du produit',
      required: true,
    },
    {
      name: 'slug',
      type: 'text',
      label: 'URL (slug)',
      unique: true,
      admin: {
        description: 'Généré automatiquement depuis le nom',
      },
      hooks: {
        beforeValidate: [
          ({ value, data }) => {
            if (!value && data?.name) {
              return data.name
                .toLowerCase()
                .normalize('NFD')
                .replace(/[\u0300-\u036f]/g, '')
                .replace(/\s+/g, '-')
                .replace(/[^a-z0-9-]/g, '')
            }
            return value
          },
        ],
      },
    },

    // ──────────────────────────────────────────
    // Prix et catégorie — Les 2 champs les plus importants pour la cliente
    // ──────────────────────────────────────────
    {
      type: 'row',
      fields: [
        {
          name: 'price',
          type: 'number',
          label: 'Prix (FCFA)',
          required: true,
          admin: {
            description: 'Ex: 3500 pour 3 500 FCFA',
          },
        },
        {
          name: 'compareAtPrice',
          type: 'number',
          label: 'Prix barré (FCFA) — optionnel',
          admin: {
            description: 'Pour afficher une réduction. Laisser vide si pas de promo.',
          },
        },
      ],
    },
    {
      name: 'category',
      type: 'relationship',
      label: 'Catégorie',
      relationTo: 'categories',
      required: true,
    },

    // ──────────────────────────────────────────
    // Images du produit (plusieurs photos possibles)
    // ──────────────────────────────────────────
    {
      name: 'images',
      type: 'array',
      label: 'Photos du produit',
      minRows: 1,
      admin: {
        description: 'Ajoute jusqu\'à 6 photos. La première sera l\'image principale.',
      },
      fields: [
        {
          name: 'image',
          type: 'upload',
          relationTo: 'media',
          required: true,
          label: 'Photo',
        },
        {
          name: 'alt',
          type: 'text',
          label: 'Description de la photo',
        },
      ],
    },

    // ──────────────────────────────────────────
    // Description
    // ──────────────────────────────────────────
    {
      name: 'description',
      type: 'richText',
      label: 'Description du produit',
      admin: {
        description: 'Décris le produit : matières, tailles disponibles, conseils d\'entretien...',
      },
    },
    {
      name: 'shortDescription',
      type: 'textarea',
      label: 'Description courte (pour la carte produit)',
      maxLength: 120,
    },

    // ──────────────────────────────────────────
    // Personnalisation
    // ──────────────────────────────────────────
    {
      name: 'isCustomizable',
      type: 'checkbox',
      label: 'Ce produit est-il personnalisable ? (ex: Tote bags)',
      defaultValue: false,
    },

    // ──────────────────────────────────────────
    // Variantes (tailles, couleurs)
    // ──────────────────────────────────────────
    {
      name: 'hasVariants',
      type: 'checkbox',
      label: 'Ce produit a des variantes (tailles, couleurs...)',
      defaultValue: false,
    },
    {
      name: 'variants',
      type: 'array',
      label: 'Variantes disponibles',
      admin: {
        condition: (data) => data?.hasVariants === true,
        description: 'Ex: S, M, L, XL ou Rouge, Bleu, Vert',
      },
      fields: [
        {
          name: 'label',
          type: 'text',
          label: 'Nom de la variante',
          required: true,
        },
        {
          name: 'available',
          type: 'checkbox',
          label: 'Disponible',
          defaultValue: true,
        },
      ],
    },

    // ──────────────────────────────────────────
    // Stock et disponibilité
    // ──────────────────────────────────────────
    {
      type: 'row',
      fields: [
        {
          name: 'inStock',
          type: 'checkbox',
          label: 'En stock',
          defaultValue: true,
        },
        {
          name: 'featured',
          type: 'checkbox',
          label: '⭐ Produit vedette (affiché en page d\'accueil)',
          defaultValue: false,
        },
        {
          name: 'weight',
          type: 'number',
          label: 'Poids du produit (kg)',
          defaultValue: 0.2,
          admin: {
            description: 'Utilisé pour calculer les frais de livraison (ex: 0.1 pour 100g, 1.5 pour 1.5kg).',
          },
        },
      ],
    },

    // ──────────────────────────────────────────
    // SEO
    // ──────────────────────────────────────────
    {
      name: 'seo',
      type: 'group',
      label: 'SEO (référencement Google)',
      admin: {
        description: 'Optionnel — pour mieux apparaître dans les recherches Google',
      },
      fields: [
        {
          name: 'metaTitle',
          type: 'text',
          label: 'Titre SEO',
        },
        {
          name: 'metaDescription',
          type: 'textarea',
          label: 'Description SEO',
          maxLength: 160,
        },
      ],
    },
  ],
}
