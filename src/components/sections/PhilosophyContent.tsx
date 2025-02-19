const PhilosophyContent = () => {
  return (
    <div className="prose prose-lg max-w-none">
      <div className="mb-12">
        <h2>Min Filosofi</h2>
        <p>
          Jeg tror på at god teknologi handler om mer enn bare kode. Det handler 
          om å skape løsninger som beriker menneskers liv og gjør en positiv 
          forskjell i verden.
        </p>
      </div>

      <div className="grid md:grid-cols-2 gap-8 mb-12">
        <div className="bg-white p-6 rounded-lg shadow-sm">
          <h3 className="text-xl font-bold mb-4">Kontinuerlig Læring</h3>
          <p className="text-gray-600">
            Teknologiverden er i konstant endring, og jeg ser på hver utfordring 
            som en mulighet til å lære og vokse. Jeg holder meg oppdatert på nye 
            teknologier og beste praksis.
          </p>
        </div>
        
        <div className="bg-white p-6 rounded-lg shadow-sm">
          <h3 className="text-xl font-bold mb-4">Brukersentrert Design</h3>
          <p className="text-gray-600">
            Jeg tror på å sette brukeren i sentrum av utviklingsprosessen. 
            Tekniske løsninger må være både elegante og brukervennlige.
          </p>
        </div>
      </div>

      <div>
        <h3>Verdier</h3>
        <ul>
          <li>Kvalitet i hver linje kode</li>
          <li>Åpen kommunikasjon og samarbeid</li>
          <li>Bærekraftig og vedlikeholdbar utvikling</li>
          <li>Innovasjon med formål</li>
        </ul>
      </div>
    </div>
  )
}

export default PhilosophyContent 