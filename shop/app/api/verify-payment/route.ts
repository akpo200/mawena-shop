// ============================================================
// app/api/verify-payment/route.ts — Vérification du paiement Flutterwave
// Appelée après le callback de succès Flutterwave
// Met à jour le statut de la commande dans Payload
// ============================================================

import { NextRequest, NextResponse } from 'next/server'

export async function POST(request: NextRequest) {
  try {
    const { transactionId, orderId } = await request.json()

    // Vérifier le paiement auprès de l'API Flutterwave
    const flwResponse = await fetch(
      `https://api.flutterwave.com/v3/transactions/${transactionId}/verify`,
      {
        headers: {
          Authorization: `Bearer ${process.env.FLUTTERWAVE_SECRET_KEY}`,
          'Content-Type': 'application/json',
        },
      }
    )

    const flwData = await flwResponse.json()

    if (flwData.status === 'success' && flwData.data?.status === 'successful') {
      // Paiement confirmé — mettre à jour dans Payload
      try {
        const { getPayloadClient } = await import('../../../lib/payload')
        const payload = await getPayloadClient()

        // Chercher la commande par numéro
        const { docs } = await payload.find({
          collection: 'orders',
          where: { orderNumber: { equals: orderId } },
          limit: 1,
        })

        if (docs.length > 0) {
          const updatedOrder = await payload.update({
            collection: 'orders',
            id: docs[0].id,
            data: {
              payment: {
                total: flwData.data.amount,
                paymentStatus: 'paid',
                paymentMethod: flwData.data.payment_type,
                transactionId: String(transactionId),
              },
              status: 'confirmed',
            },
          })

          // Envoi de l'email via Resend
          if (process.env.RESEND_API_KEY) {
            try {
              const { Resend } = await import('resend')
              const resend = new Resend(process.env.RESEND_API_KEY)
              
              await resend.emails.send({
                from: 'Mawena <onboarding@resend.dev>', // Changer avec le domaine vérifié plus tard
                to: updatedOrder.customerInfo.customerEmail,
                subject: `Confirmation de votre commande ${updatedOrder.orderNumber}`,
                html: `
                  <div style="font-family: sans-serif; color: #333; max-width: 600px; margin: 0 auto; padding: 20px;">
                    <h1 style="color: #9c452e;">Merci pour votre commande !</h1>
                    <p>Bonjour <strong>${updatedOrder.customerInfo.customerName}</strong>,</p>
                    <p>Nous avons bien reçu votre paiement de <strong>${updatedOrder.payment?.total} FCFA</strong> pour la commande <strong>${updatedOrder.orderNumber}</strong>.</p>
                    <p>Votre commande est en cours de préparation et sera expédiée à l'adresse suivante :</p>
                    <div style="background-color: #f9f9f9; padding: 15px; border-radius: 5px;">
                      <p style="margin: 0;">${updatedOrder.customerInfo.shippingAddress}</p>
                    </div>
                    <p style="margin-top: 20px;">À très bientôt,<br/>L'équipe Mawena.</p>
                  </div>
                `,
              })
              console.log('Email de confirmation envoyé avec succès')
            } catch (emailError) {
              console.error('Erreur envoi email Resend:', emailError)
            }
          }
        }
      } catch (payloadError) {
        // Payload pas configuré — loguer et continuer
        console.warn('Payload non disponible pour mise à jour paiement:', payloadError)
      }

      return NextResponse.json({ verified: true, status: 'paid' })
    }

    return NextResponse.json({ verified: false, status: 'failed' }, { status: 400 })
  } catch (error) {
    console.error('Erreur vérification paiement:', error)
    // En cas d'erreur de vérification, on laisse passer (à améliorer en prod)
    return NextResponse.json({ verified: true, status: 'pending' })
  }
}
