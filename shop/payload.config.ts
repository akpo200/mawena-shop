// ============================================================
// payload.config.ts — Configuration principale de Payload CMS
// Détecte automatiquement l'environnement :
//   - Développement local → SQLite
//   - Production (Vercel) → PostgreSQL (Neon) + Cloudinary
// ============================================================

import { buildConfig } from 'payload'
import { lexicalEditor } from '@payloadcms/richtext-lexical'
import path from 'path'
import { fileURLToPath } from 'url'

// Adaptateurs de base de données
import { sqliteAdapter } from '@payloadcms/db-sqlite'
import { postgresAdapter } from '@payloadcms/db-postgres'

// Plugin de stockage cloud (Cloudinary en prod, local en dev)
import { cloudStoragePlugin } from '@payloadcms/plugin-cloud-storage'
import { v2 as cloudinary } from 'cloudinary'

// Collections Mawena
import { Products } from './collections/Products'
import { Categories } from './collections/Categories'
import { Orders } from './collections/Orders'
import { Media } from './collections/Media'
import { Users } from './collections/Users'
import { Settings } from './collections/Settings'

const filename = fileURLToPath(import.meta.url)
const dirname = path.dirname(filename)

// ── Détecter si on est en production (Vercel) ──
const isProduction = process.env.NODE_ENV === 'production' || !!process.env.CLOUDINARY_CLOUD_NAME

// ── Configurer Cloudinary si les variables sont disponibles ──
if (isProduction && process.env.CLOUDINARY_CLOUD_NAME) {
  cloudinary.config({
    cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
    api_key: process.env.CLOUDINARY_API_KEY,
    api_secret: process.env.CLOUDINARY_API_SECRET,
  })
}

// ── Adaptateur Cloudinary pour le plugin cloud-storage ──
const cloudinaryAdapter = isProduction && process.env.CLOUDINARY_CLOUD_NAME
  ? {
      handleUpload: async ({ data, file }: { data: any; file: any }) => {
        // Uploader le fichier sur Cloudinary
        const result = await new Promise<any>((resolve, reject) => {
          const uploadStream = cloudinary.uploader.upload_stream(
            {
              folder: 'mawena',
              public_id: file.filename?.replace(/\.[^/.]+$/, ''), // nom sans extension
              resource_type: 'image',
            },
            (error: any, result: any) => {
              if (error) reject(error)
              else resolve(result)
            }
          )
          uploadStream.end(file.buffer)
        })
        // Retourner l'URL Cloudinary publique
        return {
          url: result.secure_url,
          filename: file.filename,
        }
      },
      handleDelete: async ({ filename }: { filename: string }) => {
        // Supprimer l'image de Cloudinary
        const publicId = `mawena/${filename.replace(/\.[^/.]+$/, '')}`
        await cloudinary.uploader.destroy(publicId)
      },
      generateURL: ({ filename }: { filename: string }) => {
        // URL directe Cloudinary pour chaque image
        return cloudinary.url(`mawena/${filename.replace(/\.[^/.]+$/, '')}`, {
          secure: true,
          fetch_format: 'auto',
          quality: 'auto',
        })
      },
    }
  : null

// ── Plugin cloud-storage (actif uniquement en production) ──
const storagePlugins = cloudinaryAdapter
  ? [
      cloudStoragePlugin({
        collections: {
          media: {
            adapter: cloudinaryAdapter as any,
            disablePayloadAccessControl: true, // Accès public aux images
            prefix: 'media',
          },
        },
      }),
    ]
  : []

export default buildConfig({
  // ── Interface admin ──
  admin: {
    user: Users.slug,
    meta: {
      titleSuffix: '— Mawena Admin',
      description: 'Interface de gestion de la boutique Mawena',
    },
  },

  // ── Collections de données ──
  collections: [
    Products,
    Categories,
    Orders,
    Media,
    Users,
  ],

  // ── Globals (Settings) ──
  globals: [
    Settings,
  ],

  // ── Éditeur de texte riche ──
  editor: lexicalEditor(),

  // ── Clé secrète ──
  secret: process.env.PAYLOAD_SECRET || 'mawena-secret-change-en-production',

  // ── TypeScript : génération des types ──
  typescript: {
    outputFile: path.resolve(dirname, 'payload-types.ts'),
  },

  // ── Base de données : SQLite en local, PostgreSQL en production ──
  db: isProduction && process.env.DATABASE_URI?.startsWith('postgresql')
    ? postgresAdapter({
        pool: {
          connectionString: process.env.DATABASE_URI,
        },
      })
    : sqliteAdapter({
        client: {
          url: process.env.DATABASE_URI || `file:${path.resolve(dirname, './mawena.db')}`,
        },
      }),

  // ── Plugins : Cloudinary en production ──
  plugins: storagePlugins,

  // ── Upload local (dev seulement) ──
  upload: {
    limits: {
      fileSize: 10 * 1024 * 1024, // 10 MB max
    },
  },

  // ── Routes ──
  routes: {
    admin: '/admin',
    api: '/api',
  },
})
