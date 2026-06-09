// ============================================================
// collections/Media.ts — Collection pour les images
// Toutes les photos de produits sont stockées ici
// La cliente peut uploader en glisser-déposer depuis l'admin
// ============================================================

import type { CollectionConfig } from 'payload'
import path from 'path'
import { fileURLToPath } from 'url'

const filename = fileURLToPath(import.meta.url)
const dirname = path.dirname(filename)

export const Media: CollectionConfig = {
  slug: 'media',
  admin: {
    group: 'Contenu',
  },
  // ── Accès : tout le monde peut lire les images (nécessaire pour les afficher sur le site) ──
  access: {
    read: () => true,
  },
  // Activer l'upload de fichiers
  upload: {
    // Répertoire physique de stockage : public/media (servi statiquement par Next.js)
    staticDir: path.resolve(dirname, '../public/media'),
    // URL publique correspondante
    staticURL: '/media',
    // Types de fichiers autorisés (images seulement)
    mimeTypes: ['image/jpeg', 'image/png', 'image/webp', 'image/gif'],
    // Générer des versions redimensionnées automatiquement
    imageSizes: [
      {
        name: 'thumbnail',  // Miniature pour les listes
        width: 300,
        height: 300,
        crop: 'centre',
      },
      {
        name: 'card',       // Carte produit
        width: 600,
        height: 800,
        crop: 'centre',
      },
      {
        name: 'fullscreen', // Page produit
        width: 1200,
        height: 1600,
        crop: 'centre',
      },
    ],
  },
  fields: [
    {
      name: 'alt',
      type: 'text',
      label: 'Description de l\'image (accessibilité)',
    },
  ],
}

