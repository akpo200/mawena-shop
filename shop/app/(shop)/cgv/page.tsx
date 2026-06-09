// ============================================================
// app/(shop)/cgv/page.tsx — Page des Conditions Générales de Vente (CGV)
// Conforme aux standards e-commerce habituels avec la charte graphique Mawena
// ============================================================

import type { Metadata } from 'next'

export const metadata: Metadata = {
  title: 'Conditions Générales de Vente (CGV)',
  description: 'Consultez les conditions générales de vente de la boutique artisanale Mawena.',
}

export default function CGVPage() {
  return (
    <div style={{ backgroundColor: 'var(--cream)', minHeight: '100vh', paddingBottom: '6rem' }}>
      {/* Spacer pour compenser la navbar fixe */}
      <div style={{ height: 'var(--nav-height)' }} />

      <div className="container" style={{ maxWidth: '900px', marginTop: '4rem' }}>
        <h1 style={{ 
          fontFamily: 'var(--font-serif)', 
          fontSize: 'clamp(2rem, 5vw, 3.5rem)', 
          color: 'var(--brown)', 
          marginBottom: '1rem',
          textAlign: 'center'
        }}>
          Conditions Générales de Vente
        </h1>
        <p style={{ 
          fontFamily: 'var(--font-sans)', 
          fontSize: '0.9rem', 
          color: 'var(--gold-dark)', 
          textAlign: 'center', 
          letterSpacing: '0.05em',
          textTransform: 'uppercase',
          marginBottom: '3rem'
        }}>
          En vigueur au 9 juin 2026
        </p>

        <div className="divider-gold" style={{ marginBottom: '3rem' }} />

        <div style={{ 
          fontFamily: 'var(--font-sans)', 
          lineHeight: '1.8', 
          color: 'var(--brown-light)', 
          fontSize: '1rem' 
        }}>
          
          {/* Section 1 : Préambule */}
          <section style={{ marginBottom: '2.5rem' }}>
            <h2 style={{ fontFamily: 'var(--font-serif)', fontSize: '1.8rem', color: 'var(--brown)', marginBottom: '1rem' }}>
              1. Préambule et Mentions Légales
            </h2>
            <p style={{ marginBottom: '1rem' }}>
              Les présentes Conditions Générales de Vente (ci-après "CGV") régissent de manière exclusive les relations contractuelles entre :
            </p>
            <p style={{ paddingLeft: '1rem', borderLeft: '2px solid var(--gold)', marginBottom: '1rem', fontStyle: 'italic' }}>
              <strong>Mawena</strong> — Boutique en ligne d'artisanat d'art africain, spécialisée dans la création de bijoux faits main, de bonnets tricotés, de vêtements en tissu batik et d'accessoires personnalisés.<br />
              Contact service client : par email ou directement via l'assistant de messagerie WhatsApp mis à disposition sur le site.
            </p>
            <p>
              Toute commande validée sur le site implique l’adhésion pleine, entière et sans réserve du Client aux présentes CGV.
            </p>
          </section>

          {/* Section 2 : Produits et Disponibilité */}
          <section style={{ marginBottom: '2.5rem' }}>
            <h2 style={{ fontFamily: 'var(--font-serif)', fontSize: '1.8rem', color: 'var(--brown)', marginBottom: '1rem' }}>
              2. Produits et Personnalisation
            </h2>
            <p style={{ marginBottom: '1rem' }}>
              Les articles proposés à la vente sont décrits et présentés avec la plus grande exactitude possible. S'agissant de créations entièrement artisanales et faites à la main (bijoux perlés, vêtements teints au batik, bonnets tricotés), chaque pièce est unique et peut présenter de légères variations de motifs ou de teintes par rapport aux visuels du site, ce qui en garantit l'authenticité.
            </p>
            <p>
              <strong>Produits personnalisables :</strong> Pour certains articles (tels que les tote bags), le Client peut renseigner un texte personnalisé lors de l'ajout au panier. Le Client est responsable de l'orthographe et du contenu du texte fourni. Aucun retour ne sera accepté sur les articles personnalisés conformément à la réglementation en vigueur.
            </p>
          </section>

          {/* Section 3 : Prix et Devises */}
          <section style={{ marginBottom: '2.5rem' }}>
            <h2 style={{ fontFamily: 'var(--font-serif)', fontSize: '1.8rem', color: 'var(--brown)', marginBottom: '1rem' }}>
              3. Tarifs et Paiement
            </h2>
            <p style={{ marginBottom: '1rem' }}>
              Les prix de nos produits sont indiqués sur le site en <strong>Francs CFA (FCFA / XOF)</strong>. Mawena se réserve le droit de modifier ses prix à tout moment, mais les produits seront facturés sur la base des tarifs en vigueur au moment de la validation de la commande.
            </p>
            <p style={{ marginBottom: '1rem' }}>
              <strong>Moyens de paiement acceptés :</strong><br />
              Le paiement est exigible immédiatement lors de la commande. Mawena s’appuie sur la passerelle de paiement sécurisée **Flutterwave** pour traiter l'intégralité des transactions. Le Client peut régler par :
            </p>
            <ul style={{ paddingLeft: '1.5rem', marginBottom: '1rem' }}>
              <li><strong>Cartes Bancaires</strong> (Visa, Mastercard)</li>
              <li><strong>Mobile Money</strong> (Wave, Orange Money, MTN MoMo, Free Money selon les pays éligibles)</li>
            </ul>
            <p>
              La transaction est cryptée et sécurisée directement par les protocoles de sécurité de Flutterwave, aucune coordonnée bancaire du Client n’est conservée par Mawena.
            </p>
          </section>

          {/* Section 4 : Processus de Commande */}
          <section style={{ marginBottom: '2.5rem' }}>
            <h2 style={{ fontFamily: 'var(--font-serif)', fontSize: '1.8rem', color: 'var(--brown)', marginBottom: '1rem' }}>
              4. Validation de la Commande
            </h2>
            <p style={{ marginBottom: '1rem' }}>
              Le Client valide sa commande en suivant le parcours d'achat suivant :
            </p>
            <ol style={{ paddingLeft: '1.5rem', marginBottom: '1rem' }}>
              <li>Sélection des articles et variantes (taille, couleur) et ajout au panier.</li>
              <li>Renseignement du formulaire de livraison (nom, prénom, email, téléphone, adresse précise de destination).</li>
              <li>Validation du résumé de commande et choix du mode de paiement via le guichet sécurisé Flutterwave.</li>
              <li>Paiement effectif de la commande.</li>
            </ol>
            <p>
              Dès la confirmation du paiement par Flutterwave, le Client reçoit un email de confirmation récapitulant sa commande à l'adresse fournie.
            </p>
          </section>

          {/* Section 5 : Livraison */}
          <section style={{ marginBottom: '2.5rem' }}>
            <h2 style={{ fontFamily: 'var(--font-serif)', fontSize: '1.8rem', color: 'var(--brown)', marginBottom: '1rem' }}>
              5. Livraison et Expédition
            </h2>
            <p style={{ marginBottom: '1rem' }}>
              Mawena propose une livraison à l'adresse indiquée par le client, couvrant le Sénégal, l'Afrique de l'Ouest (Côte d'Ivoire, Mali, Guinée, Burkina Faso, etc.), ainsi que l'international (France, Belgique, Canada, États-Unis, etc.).
            </p>
            <p style={{ marginBottom: '1rem' }}>
              Les délais indicatifs d'expédition varient selon le type de produit :
            </p>
            <ul style={{ paddingLeft: '1.5rem', marginBottom: '1rem' }}>
              <li><strong>Produits en stock :</strong> expédiés sous 48 à 72 heures ouvrées.</li>
              <li><strong>Produits personnalisés ou sur commande :</strong> expédiés sous 7 à 10 jours ouvrés (temps de fabrication artisanale).</li>
            </ul>
            <p>
              Les retards éventuels de transport ne donnent pas droit au Client de réclamer des dommages et intérêts.
            </p>
          </section>

          {/* Section 6 : Retours et Rétractation */}
          <section style={{ marginBottom: '2.5rem' }}>
            <h2 style={{ fontFamily: 'var(--font-serif)', fontSize: '1.8rem', color: 'var(--brown)', marginBottom: '1rem' }}>
              6. Droit de Rétractation et Retours
            </h2>
            <p style={{ marginBottom: '1rem' }}>
              Conformément aux règles internationales du commerce en ligne, le Client dispose d'un délai de <strong>14 jours</strong> à compter de la réception de son colis pour exercer son droit de rétractation, sans avoir à justifier de motifs ni à payer de pénalités.
            </p>
            <p style={{ marginBottom: '1rem' }}>
              <strong>Exceptions :</strong> Ce droit de rétractation ne s'applique pas aux articles personnalisés ou confectionnés sur-mesure (ex. gravure ou texte sur les sacs).
            </p>
            <p>
              Les frais de retour sont à la charge exclusive du Client. Les articles doivent être retournés dans leur état d’origine, non portés et dans leur emballage d’origine pour faire l'objet d'un remboursement sous 14 jours après réception et inspection par notre équipe.
            </p>
          </section>

          {/* Section 7 : Service Client et Litiges */}
          <section style={{ marginBottom: '1rem' }}>
            <h2 style={{ fontFamily: 'var(--font-serif)', fontSize: '1.8rem', color: 'var(--brown)', marginBottom: '1rem' }}>
              7. Service Client et Droit Applicable
            </h2>
            <p style={{ marginBottom: '1rem' }}>
              Pour toute question concernant votre commande ou pour toute réclamation, notre service client est à votre écoute par email ou via la bulle de discussion WhatsApp intégrée au site pour un traitement rapide.
            </p>
            <p>
              Les présentes CGV sont soumises à la législation en vigueur. En cas de litige, une solution amiable sera prioritairement recherchée avant toute action judiciaire.
            </p>
          </section>

        </div>
      </div>
    </div>
  )
}
