// ============================================================
// lib/cart-store.ts — Gestion du panier avec Zustand
// Zustand = une bibliothèque légère pour gérer l'état global
// Le panier persiste dans le localStorage (survit aux rechargements)
// ============================================================

import { create } from 'zustand'
import { persist } from 'zustand/middleware'

// ── Type d'un article dans le panier ──
export interface CartItem {
  id: string            // ID du produit
  name: string          // Nom du produit
  price: number         // Prix unitaire en FCFA
  image?: string        // URL de l'image principale
  quantity: number      // Quantité
  variant?: string      // Variante choisie (taille, couleur...)
  customizationText?: string // Texte de personnalisation (ex: pour Tote bags)
  slug: string          // Pour le lien vers la page produit
  weight?: number       // Poids du produit en kg
}

// ── État du panier ──
interface CartState {
  items: CartItem[]
  isOpen: boolean       // Le drawer panier est-il ouvert ?

  // ── Actions ──
  addItem: (item: Omit<CartItem, 'quantity'>) => void
  removeItem: (id: string, variant?: string) => void
  updateQuantity: (id: string, quantity: number, variant?: string) => void
  clearCart: () => void
  toggleCart: () => void
  openCart: () => void
  closeCart: () => void

  // ── Calculs ──
  getTotalItems: () => number
  getTotalPrice: () => number
}

export const useCartStore = create<CartState>()(
  // persist = sauvegarder dans le localStorage du navigateur
  persist(
    (set, get) => ({
      items: [],
      isOpen: false,

      // ── Ajouter un article ──
      addItem: (newItem) => {
        set((state) => {
          // Chercher si l'article existe déjà (même produit ET même variante ET même personnalisation)
          const existingIndex = state.items.findIndex(
            (item) => item.id === newItem.id && item.variant === newItem.variant && item.customizationText === newItem.customizationText
          )

          if (existingIndex >= 0) {
            // L'article existe : incrémenter la quantité
            const updatedItems = [...state.items]
            updatedItems[existingIndex].quantity += 1
            return { items: updatedItems, isOpen: true }
          }

          // Nouvel article : l'ajouter avec quantité 1
          return {
            items: [...state.items, { ...newItem, quantity: 1 }],
            isOpen: true, // Ouvrir le drawer automatiquement
          }
        })
      },

      // ── Supprimer un article ──
      removeItem: (id, variant) => {
        set((state) => ({
          items: state.items.filter(
            (item) => !(item.id === id && item.variant === variant)
          ),
        }))
      },

      // ── Modifier la quantité ──
      updateQuantity: (id, quantity, variant) => {
        if (quantity <= 0) {
          get().removeItem(id, variant)
          return
        }
        set((state) => ({
          items: state.items.map((item) =>
            item.id === id && item.variant === variant
              ? { ...item, quantity }
              : item
          ),
        }))
      },

      // ── Vider le panier (après commande validée) ──
      clearCart: () => set({ items: [] }),

      // ── Contrôle du drawer ──
      toggleCart: () => set((state) => ({ isOpen: !state.isOpen })),
      openCart: () => set({ isOpen: true }),
      closeCart: () => set({ isOpen: false }),

      // ── Calculer le total d'articles ──
      getTotalItems: () => {
        return get().items.reduce((sum, item) => sum + item.quantity, 0)
      },

      // ── Calculer le total en FCFA ──
      getTotalPrice: () => {
        return get().items.reduce(
          (sum, item) => sum + item.price * item.quantity,
          0
        )
      },
    }),
    {
      name: 'mawena-cart', // Nom de la clé dans le localStorage
    }
  )
)

// ── Utilitaire : formater un prix en FCFA ──
export const formatPrice = (price: number): string => {
  return new Intl.NumberFormat('fr-FR', {
    style: 'decimal',
    maximumFractionDigits: 0,
  }).format(price) + ' FCFA'
}
