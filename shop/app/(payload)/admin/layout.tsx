// ============================================================
// app/(payload)/admin/layout.tsx
// Layout requis pour le back-office Payload v3
// Fournit le contexte de configuration à toutes les pages d'admin
// ============================================================

import React from 'react'
import { RootLayout, handleServerFunctions } from '@payloadcms/next/layouts'
import { importMap } from './importMap'
import configPromise from '@payload-config'
import '@payloadcms/next/css'

type Args = {
  children: React.ReactNode
}

export default function Layout({ children }: Args) {
  return (
    <RootLayout
      config={configPromise}
      importMap={importMap}
      serverFunction={async function (args) {
        'use server'
        return handleServerFunctions({ ...args, config: configPromise, importMap })
      }}
    >
      {children}
    </RootLayout>
  )
}
