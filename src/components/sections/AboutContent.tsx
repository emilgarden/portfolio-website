const AboutContent = () => {
  return (
    <div className="prose prose-lg max-w-none">
      {/* Introduksjon */}
      <div className="mb-12">
        <h2>Hei, jeg er Ole Emil 👋</h2>
        <p>
          Jeg er en fullstack utvikler med base i Oslo, som brenner for å skape 
          digitale løsninger som gjør en forskjell. Med en solid teknisk bakgrunn 
          og øye for design, jobber jeg for å bygge brukeropplevelser som 
          kombinerer funksjonalitet med estetikk.
        </p>
      </div>

      {/* Mer om meg */}
      <div>
        <h3>Min Tilnærming</h3>
        <p>
          Jeg tror på å kombinere solid teknisk kompetanse med kreativ 
          problemløsning. Min erfaring spenner fra frontend-utvikling med moderne 
          rammeverk som React og Next.js, til backend-systemer med Node.js og 
          skyteknologier.
        </p>
        <p>
          Utenfor koding er jeg lidenskapelig opptatt av å lære nye ting, enten 
          det er nye teknologier, fotografering, eller å utforske naturen på sykkel. 
          Denne nysgjerrigheten driver meg til å kontinuerlig utvikle meg både 
          profesjonelt og personlig.
        </p>
      </div>
    </div>
  )
}

export default AboutContent 