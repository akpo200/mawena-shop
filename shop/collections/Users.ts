// ============================================================
// collections/Users.ts — Collection des administrateurs
// Seuls les utilisateurs avec un compte peuvent accéder à l'admin
// ============================================================

import type { CollectionConfig } from 'payload'

export const Users: CollectionConfig = {
  slug: 'users',
  admin: {
    useAsTitle: 'email',
    // Traduit en français dans l'admin
    group: 'Administration',
  },
  // Activer l'authentification (login/password)
  auth: true,
  access: {
    // Seuls les admins ou les gestionnaires existants peuvent créer/modifier des admins
    create: ({ req: { user } }) => Boolean(user && user.role === 'admin'),
    read: ({ req: { user } }) => Boolean(user),
    update: ({ req: { user } }) => Boolean(user && user.role === 'admin'),
    delete: ({ req: { user } }) => Boolean(user && user.role === 'admin'),
  },
  fields: [
    {
      name: 'name',
      type: 'text',
      label: 'Prénom et Nom',
      required: true,
    },
    {
      name: 'role',
      type: 'select',
      label: 'Rôle',
      options: [
        { label: 'Admin', value: 'admin' },
        { label: 'Gestionnaire', value: 'manager' },
      ],
      defaultValue: 'admin',
    },
  ],
}
