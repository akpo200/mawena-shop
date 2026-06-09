// ============================================================
// collections/Categories.ts — Catégories de produits
// Structure : Femme > Bonnets, Bijoux, Batik
//             Homme > Montres
//             Unisexe > Tote Bags
// ============================================================

import type { CollectionConfig } from 'payload'

export const Categories: CollectionConfig = {
  slug: 'categories',
  admin: {
    useAsTitle: 'name',
    group: 'Boutique',
    defaultColumns: ['name', 'gender', 'slug'],
  },
  // ── Accès : tout le monde peut lire les catégories ──
  access: {
    read: () => true,
  },
  fields: [
    // ── Nom de la catégorie ──
    {
      name: 'name',
      type: 'text',
      label: 'Nom de la catégorie',
      required: true,
    },
    // ── Slug URL (généré automatiquement depuis le nom) ──
    {
      name: 'slug',
      type: 'text',
      label: 'URL (slug)',
      admin: {
        description: 'Généré automatiquement — ex: bonnets, bijoux, montres',
      },
      hooks: {
        beforeValidate: [
          ({ value, data }) => {
            // Auto-génération du slug depuis le nom si vide
            if (!value && data?.name) {
              return data.name
                .toLowerCase()
                .normalize('NFD')
                .replace(/[\u0300-\u036f]/g, '') // Supprimer les accents
                .replace(/\s+/g, '-')
                .replace(/[^a-z0-9-]/g, '')
            }
            return value
          },
        ],
      },
    },
    // ── Genre / Section ──
    {
      name: 'gender',
      type: 'select',
      label: 'Section',
      required: true,
      options: [
        { label: '👩 Femme', value: 'femme' },
        { label: '👨 Homme', value: 'homme' },
        { label: '🧸 Enfant', value: 'enfant' },
        { label: '🛍️ Unisexe', value: 'unisexe' },
      ],
    },
    // ── Catégorie parente (pour les sous-catégories) ──
    {
      name: 'parent',
      type: 'relationship',
      label: 'Catégorie parente',
      relationTo: 'categories',
      admin: {
        description: 'Laissez vide si c\'est une catégorie principale (ex: Femme, Homme)',
      },
    },
    // ── Image de couverture de la catégorie ──
    {
      name: 'image',
      type: 'upload',
      label: 'Image de la catégorie',
      relationTo: 'media',
    },
    // ── Description courte ──
    {
      name: 'description',
      type: 'textarea',
      label: 'Description',
    },
    // ── Ordre d'affichage ──
    {
      name: 'order',
      type: 'number',
      label: 'Ordre d\'affichage',
      defaultValue: 0,
      admin: {
        description: 'Plus le nombre est bas, plus la catégorie apparaît en premier',
      },
    },
  ],
}
