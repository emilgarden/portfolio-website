'use client'

import { useState, useEffect, useRef } from 'react'
import { Github, Linkedin, Star, Heart, Clock, Zap, ChevronUp, X, Brain, Cpu, Code, Database } from 'lucide-react'

const Footer = () => {
  const currentYear = new Date().getFullYear()
  const [bitCount, setBitCount] = useState(0)
  const [totalBitsGenerated, setTotalBitsGenerated] = useState(0)
  const [showEmoji, setShowEmoji] = useState(false)
  const [emojiPosition, setEmojiPosition] = useState({ top: 0, left: 0 })
  const [emojiCount, setEmojiCount] = useState(1)
  const [kudosLevel, setKudosLevel] = useState(0)
  const [showUpgrades, setShowUpgrades] = useState(false)
  
  // Idle game stats
  const [autoClicksPerSecond, setAutoClicksPerSecond] = useState(0)
  const [clickPower, setClickPower] = useState(1)
  
  // Oppgraderinger - endret til informatikk-tema
  const [upgrades, setUpgrades] = useState([
    // Automatisering (bit-generatorer)
    { id: 'autoclick1', name: 'Bit Flipper', description: 'Genererer én bit hvert 10. sekund', cost: 10, purchased: false, cps: 0.1, tier: 1, type: 'autoclick' },
    { id: 'autoclick2', name: 'Logisk Port', description: 'Genererer én bit hvert 5. sekund', cost: 25, purchased: false, cps: 0.2, tier: 2, type: 'autoclick', requires: 'autoclick1' },
    { id: 'autoclick3', name: 'Halvleder-array', description: 'Genererer én bit hvert 2. sekund', cost: 50, purchased: false, cps: 0.5, tier: 3, type: 'autoclick', requires: 'autoclick2' },
    { id: 'autoclick4', name: 'Kvantbit-generator', description: 'Genererer én bit per sekund', cost: 100, purchased: false, cps: 1, tier: 4, type: 'autoclick', requires: 'autoclick3' },
    { id: 'autoclick5', name: 'Supraledende Qubits', description: 'Genererer 2 bits per sekund', cost: 250, purchased: false, cps: 2, tier: 5, type: 'autoclick', requires: 'autoclick4' },
    
    // Prosessorkraft (klikk-effektivitet)
    { id: 'clickpower1', name: '2-bit Prosessor', description: 'Genererer 2 bits per klikk', cost: 15, purchased: false, power: 2, tier: 1, type: 'clickpower' },
    { id: 'clickpower2', name: '4-bit Mikrokontroller', description: 'Genererer 4 bits per klikk', cost: 40, purchased: false, power: 4, tier: 2, type: 'clickpower', requires: 'clickpower1' },
    { id: 'clickpower3', name: '8-bit CPU', description: 'Genererer 8 bits (1 byte) per klikk', cost: 80, purchased: false, power: 8, tier: 3, type: 'clickpower', requires: 'clickpower2' },
    { id: 'clickpower4', name: '16-bit Prosessor', description: 'Genererer 16 bits (2 bytes) per klikk', cost: 160, purchased: false, power: 16, tier: 4, type: 'clickpower', requires: 'clickpower3' },
    { id: 'clickpower5', name: '32-bit Arkitektur', description: 'Genererer 32 bits (4 bytes) per klikk', cost: 320, purchased: false, power: 32, tier: 5, type: 'clickpower', requires: 'clickpower4' },
    { id: 'clickpower6', name: '64-bit System', description: 'Genererer 64 bits (8 bytes) per klikk', cost: 640, purchased: false, power: 64, tier: 6, type: 'clickpower', requires: 'clickpower5' },
    
    // Datakompresjon (multiplikatorer)
    { id: 'multiplier1', name: 'Huffman-koding', description: 'Komprimerer data med 25% (1.25× effektivitet)', cost: 200, purchased: false, multiplier: 1.25, tier: 1, type: 'multiplier' },
    { id: 'multiplier2', name: 'Run-length Encoding', description: 'Komprimerer data med 50% (1.5× effektivitet)', cost: 400, purchased: false, multiplier: 1.5, tier: 2, type: 'multiplier', requires: 'multiplier1' },
    { id: 'multiplier3', name: 'Lempel-Ziv Algoritme', description: 'Dobler dataeffektiviteten (2× effektivitet)', cost: 800, purchased: false, multiplier: 2, tier: 3, type: 'multiplier', requires: 'multiplier2' },
    { id: 'multiplier4', name: 'Kvantekompresjon', description: 'Tredobler dataeffektiviteten (3× effektivitet)', cost: 1600, purchased: false, multiplier: 3, tier: 4, type: 'multiplier', requires: 'multiplier3' },
  ])
  
  // Legg til en multiplier for å øke effekten av alle klikk
  const [globalMultiplier, setGlobalMultiplier] = useState(1)
  
  const autoClickIntervalRef = useRef<NodeJS.Timeout | null>(null)
  const upgradeModalRef = useRef<HTMLDivElement>(null)
  
  const socialLinks = [
    { name: 'GitHub', url: 'https://github.com/emilgarden', icon: <Github className="h-5 w-5" /> },
    { name: 'LinkedIn', url: 'https://linkedin.com/in/oleemil', icon: <Linkedin className="h-5 w-5" /> },
    { 
      name: 'Bluesky', 
      url: 'https://bsky.app/profile/emilgarden.bsky.social', 
      icon: (
        <svg 
          viewBox="0 0 24 24" 
          fill="none" 
          stroke="currentColor" 
          strokeWidth="2" 
          strokeLinecap="round" 
          strokeLinejoin="round" 
          className="h-5 w-5"
        >
          <path d="M6.5 19a4.5 4.5 0 1 1 0-9h11a4.5 4.5 0 1 1 0 9h-11z" />
          <path d="M6.5 10a4.5 4.5 0 1 1 0-9h11a4.5 4.5 0 1 1 0 9h-11z" />
        </svg>
      )
    },
  ]

  // Oppdater kudos-nivå basert på antall klikk
  useEffect(() => {
    if (bitCount >= 100) setKudosLevel(4);
    else if (bitCount >= 50) setKudosLevel(3);
    else if (bitCount >= 25) setKudosLevel(2);
    else if (bitCount >= 10) setKudosLevel(1);
    else setKudosLevel(0);
    
    // Lagre fremgangen i localStorage
    if (typeof window !== 'undefined') {
      localStorage.setItem('bitCount', bitCount.toString());
      localStorage.setItem('totalBitsGenerated', totalBitsGenerated.toString());
      localStorage.setItem('clickPower', clickPower.toString());
      localStorage.setItem('autoClicksPerSecond', autoClicksPerSecond.toString());
      localStorage.setItem('globalMultiplier', globalMultiplier.toString());
      localStorage.setItem('upgrades', JSON.stringify(upgrades));
    }
  }, [bitCount, totalBitsGenerated, clickPower, autoClicksPerSecond, globalMultiplier, upgrades]);
  
  // Last inn lagret fremgang
  useEffect(() => {
    if (typeof window !== 'undefined') {
      const savedBitCount = localStorage.getItem('bitCount');
      const savedTotalBitsGenerated = localStorage.getItem('totalBitsGenerated');
      const savedClickPower = localStorage.getItem('clickPower');
      const savedAutoClicksPerSecond = localStorage.getItem('autoClicksPerSecond');
      const savedGlobalMultiplier = localStorage.getItem('globalMultiplier');
      const savedUpgrades = localStorage.getItem('upgrades');
      
      if (savedBitCount) setBitCount(parseInt(savedBitCount));
      if (savedTotalBitsGenerated) setTotalBitsGenerated(parseInt(savedTotalBitsGenerated));
      if (savedClickPower) setClickPower(parseInt(savedClickPower));
      if (savedAutoClicksPerSecond) setAutoClicksPerSecond(parseFloat(savedAutoClicksPerSecond));
      if (savedGlobalMultiplier) setGlobalMultiplier(parseFloat(savedGlobalMultiplier));
      if (savedUpgrades) setUpgrades(JSON.parse(savedUpgrades));
    }
  }, []);
  
  // Sett opp auto-klikk intervall
  useEffect(() => {
    if (autoClicksPerSecond > 0) {
      // Rydd opp tidligere intervall
      if (autoClickIntervalRef.current) {
        clearInterval(autoClickIntervalRef.current);
      }
      
      // Beregn intervall i millisekunder
      const intervalMs = 1000 / autoClicksPerSecond;
      
      // Sett opp nytt intervall
      autoClickIntervalRef.current = setInterval(() => {
        handleAutoClick();
      }, intervalMs);
    }
    
    // Rydd opp ved unmount
    return () => {
      if (autoClickIntervalRef.current) {
        clearInterval(autoClickIntervalRef.current);
      }
    };
  }, [autoClicksPerSecond]);
  
  // Legg til event listener for å lukke oppgraderingsvinduet ved klikk utenfor
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (
        showUpgrades && 
        upgradeModalRef.current && 
        !upgradeModalRef.current.contains(event.target as Node)
      ) {
        setShowUpgrades(false);
      }
    };
    
    document.addEventListener('mousedown', handleClickOutside);
    
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, [showUpgrades]);

  const handleBitClick = () => {
    // Legg til klikk med clickPower og globalMultiplier
    const clickValue = Math.floor(clickPower * globalMultiplier);
    setBitCount(prev => prev + clickValue);
    setTotalBitsGenerated(prev => prev + clickValue);
    
    // Øk antall emojis basert på kudos-nivå
    const newEmojiCount = Math.min(kudosLevel + 1, 5);
    setEmojiCount(newEmojiCount);
    
    // Vis emojis med animasjon
    setShowEmoji(true);
    
    // Generer tilfeldig posisjon rundt bit-ikonet
    const randomOffset = () => Math.random() * 100 - 50;
    setEmojiPosition({
      top: randomOffset(),
      left: randomOffset()
    });
    
    // Skjul emoji etter animasjonen er ferdig
    setTimeout(() => {
      setShowEmoji(false);
    }, 1000);
    
    // Legg til en liten vibrasjonseffekt hvis enheten støtter det
    if (window.navigator && window.navigator.vibrate) {
      window.navigator.vibrate(50);
    }
  }
  
  const handleAutoClick = () => {
    // Auto-klikk med globalMultiplier
    const autoClickValue = Math.floor(1 * globalMultiplier);
    setBitCount(prev => prev + autoClickValue);
    setTotalBitsGenerated(prev => prev + autoClickValue);
  }
  
  // Sjekk om en oppgradering er tilgjengelig basert på krav
  const isUpgradeAvailable = (upgrade: {
    id: string;
    requires?: string;
    purchased: boolean;
  }) => {
    if (!upgrade.requires) return true;
    
    const requiredUpgrade = upgrades.find(u => u.id === upgrade.requires);
    return requiredUpgrade && requiredUpgrade.purchased;
  };
  
  const purchaseUpgrade = (upgradeId: string) => {
    const updatedUpgrades = upgrades.map(upgrade => {
      if (upgrade.id === upgradeId && !upgrade.purchased && bitCount >= upgrade.cost && isUpgradeAvailable(upgrade)) {
        // Trekk fra kostnaden
        setBitCount(prev => prev - upgrade.cost);
        
        // Oppdater stats basert på oppgraderingstype
        if (upgrade.type === 'autoclick') {
          setAutoClicksPerSecond(prev => prev + (upgrade.cps || 0));
        } else if (upgrade.type === 'clickpower') {
          setClickPower(upgrade.power || 1);
        } else if (upgrade.type === 'multiplier') {
          setGlobalMultiplier(prev => prev * (upgrade.multiplier || 1));
        }
        
        // Merk som kjøpt
        return { ...upgrade, purchased: true };
      }
      return upgrade;
    });
    
    setUpgrades(updatedUpgrades);
  }

  const getBitMessage = () => {
    // Bits
    if (totalBitsGenerated === 0) return "Klikk på bitene for å starte datainnsamlingen!";
    if (totalBitsGenerated === 1) return "Du har generert din første bit! Grunnlaget for all digital informasjon.";
    if (totalBitsGenerated < 8) return `${totalBitsGenerated} bits - fortsett å samle for å danne en byte (8 bits)!`;
    
    // Bytes
    if (totalBitsGenerated === 8) return "Gratulerer! Du har samlet 1 byte (8 bits)!";
    if (totalBitsGenerated < 64) return `${totalBitsGenerated} bits (${Math.floor(totalBitsGenerated/8)} bytes) - en ASCII-karakter krever 1 byte.`;
    if (totalBitsGenerated < 128) return `${totalBitsGenerated} bits (${Math.floor(totalBitsGenerated/8)} bytes) - nok til å lagre noen få bokstaver!`;
    if (totalBitsGenerated < 256) return `${totalBitsGenerated} bits (${Math.floor(totalBitsGenerated/8)} bytes) - nærmer deg 1 kilobit (Kb)!`;
    
    // Kilobits
    if (totalBitsGenerated === 256) return "256 bits! Du har nå 32 bytes - nok til å lagre en kort melding!";
    if (totalBitsGenerated < 512) return `${totalBitsGenerated} bits (${(totalBitsGenerated/8).toFixed(0)} bytes) - fortsett mot en halv kilobit!`;
    if (totalBitsGenerated < 1024) return `${totalBitsGenerated} bits (${(totalBitsGenerated/8).toFixed(0)} bytes) - nærmer deg 1 kilobit (1024 bits)!`;
    
    // Kilobytes
    if (totalBitsGenerated === 1024) return "1 kilobit (1024 bits)! Tilsvarer 128 bytes - nok til en tweet fra gammeldagene!";
    if (totalBitsGenerated < 2048) return `${(totalBitsGenerated/1024).toFixed(2)} kilobits - på vei mot din første kilobyte!`;
    if (totalBitsGenerated < 8192) return `${(totalBitsGenerated/1024).toFixed(2)} kilobits - bygger opp datamengden!`;
    if (totalBitsGenerated < 10240) return `${(totalBitsGenerated/1024).toFixed(2)} kilobits (${(totalBitsGenerated/8/1024).toFixed(2)} KB) - snart 10 kilobits!`;
    
    // Megabits
    if (totalBitsGenerated < 102400) return `${(totalBitsGenerated/1024).toFixed(2)} kilobits (${(totalBitsGenerated/8/1024).toFixed(2)} KB) - på vei mot en megabit!`;
    if (totalBitsGenerated < 1048576) return `${(totalBitsGenerated/1024).toFixed(2)} kilobits (${(totalBitsGenerated/8/1024).toFixed(2)} KB) - imponerende datamengde!`;
    
    // Megabytes og videre
    if (totalBitsGenerated < 8388608) return `${(totalBitsGenerated/1048576).toFixed(2)} megabits (${(totalBitsGenerated/8/1048576).toFixed(2)} MB) - nå snakker vi seriøs databehandling!`;
    
    return `${(totalBitsGenerated/1048576).toFixed(2)} megabits! Du har skapt et digitalt imperium av data! 🧠`;
  }

  const getRandomEmoji = () => {
    const emojis = ['0️⃣', '1️⃣', '🔟', '💾', '💿', '🖥️', '📊', '📈', '🔢', '⚙️', '🧮', '🔌', '📡']
    return emojis[Math.floor(Math.random() * emojis.length)]
  }
  
  const getKudosLevelIcon = () => {
    switch(kudosLevel) {
      case 0: return null;
      case 1: return <span className="text-blue-400">0️⃣1️⃣</span>;
      case 2: return <Code className="h-4 w-4 text-blue-400" />;
      case 3: return <Cpu className="h-4 w-4 text-purple-400" />;
      case 4: return (
        <div className="flex">
          <Brain className="h-4 w-4 text-purple-400" />
          <Database className="h-4 w-4 text-blue-400" />
          <Code className="h-4 w-4 text-green-400" />
        </div>
      );
      default: return null;
    }
  }
  
  const resetGame = () => {
    if (confirm('Er du sikker på at du vil nullstille spillet? All fremgang vil gå tapt.')) {
      setBitCount(0);
      setTotalBitsGenerated(0);
      setClickPower(1);
      setAutoClicksPerSecond(0);
      setKudosLevel(0);
      setGlobalMultiplier(1);
      setUpgrades(upgrades.map(upgrade => ({ ...upgrade, purchased: false })));
      
      // Fjern fra localStorage
      if (typeof window !== 'undefined') {
        localStorage.removeItem('bitCount');
        localStorage.removeItem('totalBitsGenerated');
        localStorage.removeItem('clickPower');
        localStorage.removeItem('autoClicksPerSecond');
        localStorage.removeItem('globalMultiplier');
        localStorage.removeItem('upgrades');
      }
      
      // Stopp auto-klikk
      if (autoClickIntervalRef.current) {
        clearInterval(autoClickIntervalRef.current);
        autoClickIntervalRef.current = null;
      }
    }
  }

  // Beregn effektiv klikk-kraft (clickPower * globalMultiplier)
  const effectiveClickPower = Math.floor(clickPower * globalMultiplier);
  
  // Beregn effektiv auto-klikk-kraft
  const effectiveAutoClickPower = Math.floor(autoClicksPerSecond * globalMultiplier);

  // Generer en tilfeldig "fun fact" om informatikere og spilldesignere
  const getRandomFunFact = () => {
    const funFacts = [
      // Informatikere
      "Ada Lovelace (1815-1852) regnes som verdens første programmerer. Hun skrev algoritmer for Charles Babbages analytiske maskin.",
      "Alan Turing (1912-1954) knekket den tyske Enigma-koden under 2. verdenskrig og la grunnlaget for moderne datamaskiner.",
      "Grace Hopper (1906-1992) oppfant den første kompilatoren og var sentral i utviklingen av programmeringsspråket COBOL.",
      "John von Neumann (1903-1957) utviklet arkitekturen som de fleste moderne datamaskiner fortsatt er basert på.",
      "Tim Berners-Lee (f. 1955) oppfant World Wide Web i 1989 mens han jobbet ved CERN i Sveits.",
      "Linus Torvalds (f. 1969) skapte Linux-kjernen i 1991 som en 21 år gammel student i Finland.",
      "Margaret Hamilton (f. 1936) ledet utviklingen av programvaren for Apollo-romfartsprogrammet til NASA.",
      "Donald Knuth (f. 1938) er kjent for sitt monumentale verk 'The Art of Computer Programming' og TeX-typesettingssystemet.",
      "Dennis Ritchie (1941-2011) skapte programmeringsspråket C og var med på å utvikle Unix-operativsystemet.",
      "Bjarne Stroustrup (f. 1950) utviklet programmeringsspråket C++ som en utvidelse av C.",
      "Edsger Dijkstra (1930-2002) utviklet flere grunnleggende algoritmer, inkludert den berømte korteste-vei-algoritmen.",
      "John McCarthy (1927-2011) oppfant programmeringsspråket Lisp og var en pioner innen kunstig intelligens.",
      "Vint Cerf (f. 1943) og Bob Kahn (f. 1938) utviklet TCP/IP-protokollen som er grunnlaget for internett.",
      "Barbara Liskov (f. 1939) utviklet Liskov-substitusjonsprinsippet, et fundamentalt konsept i objektorientert programmering.",
      "Claude Shannon (1916-2001) regnes som informasjonsteoriens far og la grunnlaget for digital kommunikasjon.",
      "Kristen Nygaard (1926-2002) og Ole-Johan Dahl (1931-2002) utviklet Simula, det første objektorienterte programmeringsspråket.",
      "Frances Allen (1932-2020) var den første kvinnen som vant Turing-prisen for sitt banebrytende arbeid med kompilatoroptimalisering.",
      "Shafi Goldwasser (f. 1958) har revolusjonert kryptografi og er en av få som har vunnet Turing-prisen to ganger.",
      "Katherine Johnson (1918-2020) var en matematiker hos NASA som beregnet baner for romferder, inkludert Apollo 11.",
      "Guido van Rossum (f. 1956) skapte programmeringsspråket Python i 1991, oppkalt etter komediegruppen Monty Python.",
      
      // Spilldesignere
      "Shigeru Miyamoto (f. 1952) er skaperen av Super Mario, The Legend of Zelda og mange andre Nintendo-klassikere.",
      "Hideo Kojima (f. 1963) er kjent for Metal Gear-serien og regnes som en av de mest innflytelsesrike spilldesignerne.",
      "Sid Meier (f. 1954) er skaperen av Civilization-serien og har definert strategispill-sjangeren.",
      "Will Wright (f. 1960) skapte SimCity, The Sims og Spore, og er kjent for sine innovative simuleringsspill.",
      "Roberta Williams (f. 1953) var pioner innen eventyrspill og skapte King's Quest-serien på 1980-tallet.",
      "Gabe Newell (f. 1962) grunnla Valve Corporation og har vært sentral i utviklingen av Half-Life, Portal og Steam-plattformen.",
      "Markus 'Notch' Persson (f. 1979) skapte Minecraft, et av verdens mest solgte spill noensinne.",
      "Hironobu Sakaguchi (f. 1962) er skaperen av Final Fantasy-serien og har revolusjonert rollespill-sjangeren.",
      "John Carmack (f. 1970) var med på å skape Doom og Quake, og har vært en pioner innen 3D-grafikk og spillmotorer.",
      "Gunpei Yokoi (1941-1997) oppfant Game Boy og var en av Nintendos mest innovative designere.",
      
      // Mer spilldesignere
      "Toru Iwatani (f. 1955) designet Pac-Man i 1980, et av de mest ikoniske arkadespillene noensinne.",
      "Yuji Naka (f. 1965) var hovedutvikleren bak Sonic the Hedgehog, Segas maskot og svar på Mario.",
      "Amy Hennig (f. 1964) er kjent for sitt arbeid med Uncharted-serien og er anerkjent for sin historiefortelling i spill.",
      "Todd Howard (f. 1971) er kjent for The Elder Scrolls og Fallout-seriene hos Bethesda Game Studios.",
      "Jane Jensen (f. 1963) skapte Gabriel Knight-serien og er kjent for sine dype, historiedrevne eventyrspill.",
      "Richard Garriott (f. 1961), også kjent som 'Lord British', skapte Ultima-serien og var en pioner innen online rollespill."
    ];
    return funFacts[Math.floor(Math.random() * funFacts.length)];
  }
  
  // Håndtering av funfakts med cooldown og rate-limiting
  const [funFact, setFunFact] = useState<string | null>(null);
  const [lastFunFactTime, setLastFunFactTime] = useState(0);
  const funFactCooldownMs = 10000; // 10 sekunder cooldown mellom funfakts
  const funFactDisplayTimeMs = 8000; // 8 sekunder visningstid
  
  // Lagre forrige bitCount for å oppdage når vi passerer et multiplum av 10
  const [prevBitCount, setPrevBitCount] = useState(0);
  const hasPassedMultipleOfTen = bitCount > 0 && 
                                Math.floor(bitCount / 10) > Math.floor(prevBitCount / 10);
  
  // Oppdater prevBitCount etter sjekken
  useEffect(() => {
    setPrevBitCount(bitCount);
  }, [bitCount]);
  
  useEffect(() => {
    // Vis funfakts når:
    // 1. Vi har passert et multiplum av 10
    // 2. Det er ingen funfakt som vises nå
    // 3. Det har gått minst 'cooldown' tid siden siste funfakt
    const now = Date.now();
    const timeSinceLastFact = now - lastFunFactTime;
    
    if (hasPassedMultipleOfTen && !funFact && timeSinceLastFact > funFactCooldownMs) {
      // Vis en ny funfakt
      const newFunFact = getRandomFunFact();
      setFunFact(newFunFact);
      setLastFunFactTime(now);
      
      // Fjern funfakten etter visningstiden
      setTimeout(() => {
        setFunFact(null);
      }, funFactDisplayTimeMs);
    }
  }, [bitCount, funFact, lastFunFactTime]);

  return (
    <footer className="bg-black text-white">
      {/* Hovedinnhold - redusert padding */}
      <div className="container-wrapper py-6">
        <div className="flex flex-col items-center justify-center gap-4">
          {/* Bit-klikker seksjon - mer kompakt */}
          <div className="w-full max-w-md">
            {/* Kompakt layout med vertikal stabling */}
            <div className="flex flex-col items-center gap-2">
              {/* Bit */}
              <div className="relative h-20 flex items-center justify-center">
                <button 
                  onClick={handleBitClick}
                  className={`transform transition-all duration-300 hover:scale-110 active:scale-125 focus:outline-none ${kudosLevel >= 3 ? 'animate-pulse' : ''}`}
                  aria-label="Klikk for å generere bits"
                  style={{
                    filter: kudosLevel >= 2 ? 'drop-shadow(0 0 8px rgba(59, 130, 246, 0.7))' : 'none'
                  }}
                >
                  <span className={`text-3xl ${
                    kudosLevel === 0 ? 'opacity-90' : 
                    kudosLevel === 1 ? 'opacity-95' : 
                    kudosLevel === 2 ? 'opacity-100' : 
                    kudosLevel === 3 ? 'opacity-100' : 
                    'opacity-100'
                  } transition-opacity duration-300`}>0️⃣1️⃣</span>
                </button>
                
                {/* Animerte emojis - absolutt posisjonert */}
                {showEmoji && Array.from({ length: emojiCount }).map((_, i) => (
                  <div 
                    key={i}
                    className="absolute opacity-0 pointer-events-none animate-emoji-float"
                    style={{ 
                      top: `${emojiPosition.top + (Math.random() * 40 - 20)}px`, 
                      left: `${emojiPosition.left + (Math.random() * 40 - 20)}px`,
                      animationDuration: `${0.8 + Math.random() * 0.4}s`,
                      animationDelay: `${i * 0.1}s`,
                      zIndex: 10
                    }}
                  >
                    <span className="text-2xl">{getRandomEmoji()}</span>
                  </div>
                ))}
              </div>
              
              {/* Teller og melding */}
              <div className="text-center">
                <p className="text-blue-300 text-xl font-bold mb-1">
                  {`${bitCount} bits`}
                </p>
                
                {/* Kompakt statistikk */}
                <div className="flex flex-wrap justify-center gap-2 text-xs text-gray-400 mb-2">
                  {autoClicksPerSecond > 0 && (
                    <div className="flex items-center gap-1">
                      <Clock className="h-3 w-3" />
                      <span>{autoClicksPerSecond.toFixed(1)}/s</span>
                    </div>
                  )}
                  
                  {clickPower > 1 && (
                    <div className="flex items-center gap-1">
                      <Zap className="h-3 w-3" />
                      <span>+{effectiveClickPower}</span>
                    </div>
                  )}
                  
                  {globalMultiplier > 1 && (
                    <div className="flex items-center gap-1">
                      <Star className="h-3 w-3" />
                      <span>x{globalMultiplier.toFixed(1)}</span>
                    </div>
                  )}
                </div>
                
                <p className="text-gray-300 text-sm">
                  {getBitMessage()}
                </p>
              </div>
              
              {/* Oppgraderingsknapp */}
              <button
                onClick={() => setShowUpgrades(!showUpgrades)}
                className="px-3 py-1 bg-blue-700 hover:bg-blue-600 text-white rounded-full text-xs font-medium transition-colors flex items-center gap-1 mt-1"
              >
                {showUpgrades ? 'Skjul' : 'Oppgraderinger'}
                <ChevronUp className={`h-3 w-3 transition-transform ${showUpgrades ? 'rotate-180' : ''}`} />
              </button>
              
              {/* Fun fact - med fast høyde for å unngå "hopping" */}
              <div className="h-16 flex items-center justify-center mt-2">
                {funFact && (
                  <div className="p-2 bg-blue-900/30 border border-blue-700/30 rounded-md text-xs text-blue-200 max-w-xs mx-auto animate-fade-in">
                    <p><strong>Fun Fact:</strong> {funFact}</p>
                  </div>
                )}
              </div>
            </div>
          </div>
          
          {/* Sosiale medier og copyright i samme rad */}
          <div className="flex flex-col items-center justify-center w-full border-t border-gray-800 pt-3 mt-2 text-xs gap-2">
            <div className="flex justify-center space-x-4">
              {socialLinks.map((link) => (
                <a
                  key={link.name}
                  href={link.url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-gray-400 hover:text-white transition-colors"
                  aria-label={link.name}
                >
                {link.icon}
                </a>
              ))}
            </div>
            
            <p className="text-gray-400">
              © {currentYear} Alle rettigheter reservert.
            </p>
          </div>
        </div>
          </div>

      {/* Oppgraderinger - absolutt posisjonert med klikk utenfor for å lukke */}
      {showUpgrades && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/70">
          <div 
            ref={upgradeModalRef}
            className="bg-gray-900 rounded-lg p-3 w-full max-w-md relative"
          >
            <button 
              onClick={() => setShowUpgrades(false)}
              className="absolute top-2 right-2 text-gray-400 hover:text-white"
            >
              <X className="h-4 w-4" />
            </button>
            
            <h4 className="text-base font-medium mb-2 text-blue-300">Oppgraderinger</h4>
            
            <div className="space-y-2 max-h-60 overflow-y-auto pr-2">
              {/* Gruppere oppgraderinger etter type */}
              {['clickpower', 'autoclick', 'multiplier'].map(type => (
                <div key={type} className="mb-3">
                  <h5 className="text-xs font-medium text-gray-300 mb-1 border-b border-gray-700 pb-1">
                    {type === 'clickpower' ? 'Prosessorkraft' : 
                     type === 'autoclick' ? 'Bit-generatorer' : 
                     'Datakompresjon'}
                  </h5>
                  
                  {upgrades
                    .filter(u => u.type === type)
                    .sort((a, b) => a.tier - b.tier)
                    .map(upgrade => {
                      const isAvailable = isUpgradeAvailable(upgrade);
                      const canAfford = bitCount >= upgrade.cost;
                      
                      return (
                        <div 
                          key={upgrade.id} 
                          className={`p-2 rounded-md mb-1 ${
                            upgrade.purchased 
                              ? 'bg-green-900/30 border border-green-700/50' 
                              : isAvailable && canAfford
                                ? 'bg-blue-900/30 border border-blue-700/50 hover:bg-blue-800/30 cursor-pointer'
                                : isAvailable
                                  ? 'bg-gray-800/50 border border-gray-700/50 opacity-75'
                                  : 'bg-gray-900/30 border border-gray-800/50 opacity-50'
                          }`}
                          onClick={() => !upgrade.purchased && isAvailable && canAfford && purchaseUpgrade(upgrade.id)}
                        >
                          <div className="flex justify-between items-center">
                            <h5 className="font-medium text-white text-sm">{upgrade.name}</h5>
                            {!upgrade.purchased && (
                              <span className="text-xs font-medium text-blue-300">{upgrade.cost} bits</span>
                            )}
                            {upgrade.purchased && (
                              <span className="text-xs font-medium text-green-400 px-1.5 py-0.5 bg-green-900/50 rounded-full">Aktivert</span>
                            )}
                          </div>
                          <p className="text-xs text-gray-400 mt-0.5">{upgrade.description}</p>
                          {!isAvailable && !upgrade.purchased && (
                            <p className="text-xs text-blue-500 mt-0.5">Krever: {upgrades.find(u => u.id === upgrade.requires)?.name}</p>
                          )}
                        </div>
                      );
                    })
                  }
                </div>
              ))}
          </div>

            <div className="mt-2 pt-2 border-t border-gray-700">
              <button 
                onClick={resetGame}
                className="text-xs text-red-400 hover:text-red-300"
              >
                Nullstill spill
              </button>
            </div>
          </div>
        </div>
      )}
    </footer>
  )
}

export default Footer 