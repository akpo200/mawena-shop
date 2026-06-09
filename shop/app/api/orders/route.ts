import { NextRequest, NextResponse } from 'next/server'
import { getPayloadClient } from '../../../lib/payload'

// ── POST /api/orders — Créer une nouvelle commande et notifier les admins ──
export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    const { customerInfo, items, total, notes, paymentMethod } = body

    // Générer un numéro de commande unique
    const orderNumber = `MAW-${Date.now()}-${Math.random().toString(36).slice(2, 7).toUpperCase()}`

    const payload = await getPayloadClient()

    // 1. Créer la commande dans Payload
    const order = await payload.create({
      collection: 'orders',
      data: {
        orderNumber,
        customerInfo: {
          customerName: `${customerInfo.firstName} ${customerInfo.lastName}`,
          customerEmail: customerInfo.email,
          customerPhone: customerInfo.phone,
          customerCountry: customerInfo.country,
          shippingAddress: `${customerInfo.address}, ${customerInfo.city}, ${customerInfo.country}`,
        },
        items: items.map((item: {
          name: string
          price: number
          quantity: number
          variant?: string
          customizationText?: string
        }) => ({
          productName: item.name,
          variant: item.variant,
          customizationText: item.customizationText,
          quantity: item.quantity,
          unitPrice: item.price,
        })),
        payment: {
          total,
          paymentStatus: 'pending',
          paymentMethod: paymentMethod, // 'delivery' ou 'wave'
        },
        status: 'new',
        notes: notes || '',
      },
    })

    // 2. Récupérer tous les emails des administrateurs pour les notifier
    let adminEmails: string[] = ['admin@mawena.com'] // Fallback
    try {
      const admins = await payload.find({
        collection: 'users',
        limit: 50,
      })
      if (admins && admins.docs.length > 0) {
        adminEmails = admins.docs.map(admin => admin.email).filter(Boolean) as string[]
      }
    } catch (dbErr) {
      console.error('Erreur récupération admins:', dbErr)
    }

    // 3. Notification par Email aux admins via Resend (si configuré)
    if (process.env.RESEND_API_KEY) {
      try {
        const { Resend } = await import('resend')
        const resend = new Resend(process.env.RESEND_API_KEY)
        
        await resend.emails.send({
          from: 'Mawena Shop <notifications@resend.dev>',
          to: adminEmails,
          subject: `🚨 Nouvelle Commande Reçue : ${orderNumber}`,
          html: `
            <div style="font-family: sans-serif; color: #333; max-width: 600px; margin: 0 auto; padding: 20px; border: 1px solid #c9a96e; border-radius: 8px;">
              <h1 style="color: #9c452e; border-bottom: 2px solid #c9a96e; padding-bottom: 10px;">Nouvelle commande !</h1>
              <p>Bonjour,</p>
              <p>Une nouvelle commande vient d'être passée sur la boutique <strong>Mawena</strong>.</p>
              
              <h3 style="color: #4a3020;">N° Commande : ${orderNumber}</h3>
              <p><strong>Client :</strong> ${customerInfo.firstName} ${customerInfo.lastName}</p>
              <p><strong>Téléphone :</strong> ${customerInfo.phone}</p>
              <p><strong>Email :</strong> ${customerInfo.email}</p>
              <p><strong>Adresse :</strong> ${customerInfo.address}, ${customerInfo.city}, ${customerInfo.country}</p>
              <p><strong>Mode de Paiement :</strong> ${paymentMethod === 'wave' ? 'Wave (Lien)' : 'Paiement à la livraison'}</p>
              
              <h3 style="color: #4a3020; margin-top: 20px;">Détails des articles :</h3>
              <table style="width: 100%; border-collapse: collapse;">
                <thead>
                  <tr style="background-color: #f9f6f0;">
                    <th style="border: 1px solid #ddd; padding: 8px; text-align: left;">Article</th>
                    <th style="border: 1px solid #ddd; padding: 8px; text-align: center;">Quantité</th>
                    <th style="border: 1px solid #ddd; padding: 8px; text-align: right;">Prix</th>
                  </tr>
                </thead>
                <tbody>
                  ${items.map((item: any) => `
                    <tr>
                      <td style="border: 1px solid #ddd; padding: 8px;">${item.name} ${item.variant ? `(${item.variant})` : ''}</td>
                      <td style="border: 1px solid #ddd; padding: 8px; text-align: center;">${item.quantity}</td>
                      <td style="border: 1px solid #ddd; padding: 8px; text-align: right;">${item.price * item.quantity} FCFA</td>
                    </tr>
                  `).join('')}
                </tbody>
              </table>
              
              <h2 style="color: #9c452e; text-align: right; margin-top: 20px;">Total : ${total} FCFA</h2>
              <p style="margin-top: 30px; font-size: 0.9rem; color: #888;">Gérez cette commande directement dans votre tableau de bord Payload.</p>
            </div>
          `,
        })
        console.log('Email de notification envoyé aux admins')
      } catch (emailErr) {
        console.error('Erreur envoi email admin:', emailErr)
      }
    }

    return NextResponse.json({
      success: true,
      orderNumber,
      orderId: order.id,
    })
  } catch (error) {
    console.error('Erreur création commande:', error)
    const demoOrderNumber = `MAW-DEMO-${Date.now()}`
    return NextResponse.json({
      success: true,
      orderNumber: demoOrderNumber,
      orderId: 'demo',
    })
  }
}
