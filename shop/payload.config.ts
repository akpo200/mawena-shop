// ============================================================
// payload.config.ts — Configuration principale de Payload CMS
// ============================================================

import { buildConfig } from 'payload'
import { lexicalEditor } from '@payloadcms/richtext-lexical'
import { sqliteAdapter } from '@payloadcms/db-sqlite'
import path from 'path'
import { fileURLToPath } from 'url'

// Collections Mawena
import { Products } from './collections/Products'
import { Categories } from './collections/Categories'
import { Orders } from './collections/Orders'
import { Media } from './collections/Media'
import { Users } from './collections/Users'
import { Settings } from './collections/Settings'

const filename = fileURLToPath(import.meta.url)
const dirname = path.dirname(filename)

export default buildConfig({
  // ── Interface admin ──
  admin: {
    user: Users.slug,
    meta: {
      titleSuffix: '— Mawena Admin',
      description: 'Interface de gestion de la boutique Mawena',
    },
    // Langue française dans l'admin
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

  // ── Base de données SQLite (simple, local, pas de configuration serveur) ──
  db: sqliteAdapter({
    client: {
      url: process.env.DATABASE_URI || `file:${path.resolve(dirname, './mawena.db')}`,
    },
  }),

  // ── Dossier de stockage des images uploadées ──
  upload: {
    limits: {
      fileSize: 10 * 1024 * 1024, // 10 MB max
    },
  },

  // ── Routes ──
  routes: {
    admin: '/admin',     // Back-office accessible sur /admin
    api: '/api', // API interne Payload
  },
})
