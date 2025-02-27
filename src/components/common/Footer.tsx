'use client'

import { useState, useEffect, useRef } from 'react'
import { Github, Linkedin, Coffee, Star, Heart, Clock, Zap, ChevronUp, X } from 'lucide-react'

const Footer = () => {
  const currentYear = new Date().getFullYear()
  const [coffeeCount, setCoffeeCount] = useState(0)
  const [showEmoji, setShowEmoji] = useState(false)
  const [emojiPosition, setEmojiPosition] = useState({ top: 0, left: 0 })
  const [emojiCount, setEmojiCount] = useState(1)
  const [kudosLevel, setKudosLevel] = useState(0)
  const [showUpgrades, setShowUpgrades] = useState(false)
  
  // Idle game stats
  const [autoClicksPerSecond, setAutoClicksPerSecond] = useState(0)
  const [clickPower, setClickPower] = useState(1)
  
  // Oppgraderinger - endret for å bygge på hverandre
  const [upgrades, setUpgrades] = useState([
    { id: 'autoclick1', name: 'Automatisk klikker', description: 'Klikker automatisk én gang hvert 10. sekund', cost: 10, purchased: false, cps: 0.1, tier: 1, type: 'autoclick' },
    { id: 'autoclick2', name: 'Kaffemaskin', description: 'Legger til én klikk hvert 5. sekund', cost: 25, purchased: false, cps: 0.2, tier: 2, type: 'autoclick', requires: 'autoclick1' },
    { id: 'autoclick3', name: 'Kaffebar', description: 'Legger til én klikk hvert 2. sekund', cost: 50, purchased: false, cps: 0.5, tier: 3, type: 'autoclick', requires: 'autoclick2' },
    { id: 'autoclick4', name: 'Kaffeplantasje', description: 'Legger til én klikk per sekund', cost: 100, purchased: false, cps: 1, tier: 4, type: 'autoclick', requires: 'autoclick3' },
    { id: 'clickpower1', name: 'Dobbel espresso', description: 'Dobler verdien av hvert klikk', cost: 15, purchased: false, power: 2, tier: 1, type: 'clickpower' },
    { id: 'clickpower2', name: 'Trippel espresso', description: 'Øker verdien til 3 per klikk', cost: 40, purchased: false, power: 3, tier: 2, type: 'clickpower', requires: 'clickpower1' },
    { id: 'clickpower3', name: 'Kaffe-ekspert', description: 'Øker verdien til 5 per klikk', cost: 75, purchased: false, power: 5, tier: 3, type: 'clickpower', requires: 'clickpower2' },
    { id: 'clickpower4', name: 'Kaffe-mester', description: 'Øker verdien til 10 per klikk', cost: 150, purchased: false, power: 10, tier: 4, type: 'clickpower', requires: 'clickpower3' },
    { id: 'multiplier1', name: 'Kaffebønner', description: 'Øker alle klikk med 50%', cost: 200, purchased: false, multiplier: 1.5, tier: 1, type: 'multiplier' },
    { id: 'multiplier2', name: 'Premium kaffe', description: 'Dobler effekten av alle klikk', cost: 500, purchased: false, multiplier: 2, tier: 2, type: 'multiplier', requires: 'multiplier1' },
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
    if (coffeeCount >= 100) setKudosLevel(4);
    else if (coffeeCount >= 50) setKudosLevel(3);
    else if (coffeeCount >= 25) setKudosLevel(2);
    else if (coffeeCount >= 10) setKudosLevel(1);
    else setKudosLevel(0);
    
    // Lagre fremgangen i localStorage
    if (typeof window !== 'undefined') {
      localStorage.setItem('coffeeCount', coffeeCount.toString());
      localStorage.setItem('clickPower', clickPower.toString());
      localStorage.setItem('autoClicksPerSecond', autoClicksPerSecond.toString());
      localStorage.setItem('globalMultiplier', globalMultiplier.toString());
      localStorage.setItem('upgrades', JSON.stringify(upgrades));
    }
  }, [coffeeCount, clickPower, autoClicksPerSecond, globalMultiplier, upgrades]);
  
  // Last inn lagret fremgang
  useEffect(() => {
    if (typeof window !== 'undefined') {
      const savedCoffeeCount = localStorage.getItem('coffeeCount');
      const savedClickPower = localStorage.getItem('clickPower');
      const savedAutoClicksPerSecond = localStorage.getItem('autoClicksPerSecond');
      const savedGlobalMultiplier = localStorage.getItem('globalMultiplier');
      const savedUpgrades = localStorage.getItem('upgrades');
      
      if (savedCoffeeCount) setCoffeeCount(parseInt(savedCoffeeCount));
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

  const handleCoffeeClick = () => {
    // Legg til klikk med clickPower og globalMultiplier
    const clickValue = Math.floor(clickPower * globalMultiplier);
    setCoffeeCount(prev => prev + clickValue);
    
    // Øk antall emojis basert på kudos-nivå
    const newEmojiCount = Math.min(kudosLevel + 1, 5);
    setEmojiCount(newEmojiCount);
    
    // Vis emojis med animasjon
    setShowEmoji(true);
    
    // Generer tilfeldig posisjon rundt kaffekoppen
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
    setCoffeeCount(prev => prev + autoClickValue);
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
      if (upgrade.id === upgradeId && !upgrade.purchased && coffeeCount >= upgrade.cost && isUpgradeAvailable(upgrade)) {
        // Trekk fra kostnaden
        setCoffeeCount(prev => prev - upgrade.cost);
        
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

  const getCoffeeMessage = () => {
    if (coffeeCount === 0) return "Trykk på kaffekoppen!";
    if (coffeeCount === 1) return "Takk for kaffen!";
    if (coffeeCount < 10) return `${coffeeCount} kopper kaffe? Nå blir jeg våken!`;
    if (coffeeCount < 25) return `${coffeeCount} kopper?! Jeg kommer til å kode hele natten!`;
    if (coffeeCount < 50) return `${coffeeCount} kopper?! 🤪 Nå koder jeg i hyperdrive!`;
    if (coffeeCount < 100) return `${coffeeCount} kopper?! 🚀 Jeg har transcendert tid og rom!`;
    return `${coffeeCount} kopper?! 🌟 Jeg har blitt ett med koden!`;
  }

  const getRandomEmoji = () => {
    const emojis = ['✨', '🔥', '⚡', '💫', '🚀', '☕', '❤️', '👍', '🎉', '💯', '🌟', '💪', '🏆']
    return emojis[Math.floor(Math.random() * emojis.length)]
  }
  
  const getKudosLevelIcon = () => {
    switch(kudosLevel) {
      case 0: return null;
      case 1: return <Coffee className="h-4 w-4 text-amber-400" />;
      case 2: return <Star className="h-4 w-4 text-amber-400" />;
      case 3: return <Heart className="h-4 w-4 text-red-400" />;
      case 4: return (
        <div className="flex">
          <Star className="h-4 w-4 text-amber-400" />
          <Star className="h-4 w-4 text-amber-400" />
          <Star className="h-4 w-4 text-amber-400" />
        </div>
      );
      default: return null;
    }
  }
  
  const resetGame = () => {
    if (confirm('Er du sikker på at du vil nullstille spillet? All fremgang vil gå tapt.')) {
      setCoffeeCount(0);
      setClickPower(1);
      setAutoClicksPerSecond(0);
      setKudosLevel(0);
      setGlobalMultiplier(1);
      setUpgrades(upgrades.map(upgrade => ({ ...upgrade, purchased: false })));
      
      // Fjern fra localStorage
      if (typeof window !== 'undefined') {
        localStorage.removeItem('coffeeCount');
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

  return (
    <footer className="bg-black text-white">
      {/* Hovedinnhold - redusert padding */}
      <div className="container-wrapper py-6">
        <div className="flex flex-col items-center justify-center gap-4">
          {/* Kaffe-klikker seksjon - mer kompakt */}
          <div className="w-full max-w-md">
            {/* Kompakt layout med vertikal stabling */}
            <div className="flex flex-col items-center gap-2">
              {/* Kaffekopp */}
              <div className="relative h-20 flex items-center justify-center">
                <button 
                  onClick={handleCoffeeClick}
                  className={`transform transition-all duration-300 hover:scale-110 active:scale-125 focus:outline-none ${kudosLevel >= 3 ? 'animate-pulse' : ''}`}
                  aria-label="Klikk på kaffekoppen"
                  style={{
                    filter: kudosLevel >= 2 ? 'drop-shadow(0 0 8px rgba(251, 191, 36, 0.7))' : 'none'
                  }}
                >
                  <Coffee className={`h-12 w-12 ${
                    kudosLevel === 0 ? 'text-amber-500' : 
                    kudosLevel === 1 ? 'text-amber-400' : 
                    kudosLevel === 2 ? 'text-amber-300' : 
                    kudosLevel === 3 ? 'text-yellow-300' : 
                    'text-yellow-200'
                  } transition-colors duration-300`} />
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
                <p className="text-amber-300 text-xl font-bold mb-1">
                  {coffeeCount} ☕
                </p>
                <p className="text-gray-300 text-sm">
                  {getCoffeeMessage()}
                </p>
              </div>
              
              {/* Oppgraderingsknapp */}
              <button
                onClick={() => setShowUpgrades(!showUpgrades)}
                className="px-3 py-1 bg-amber-700 hover:bg-amber-600 text-white rounded-full text-xs font-medium transition-colors flex items-center gap-1 mt-1"
              >
                {showUpgrades ? 'Skjul' : 'Oppgraderinger'}
                <ChevronUp className={`h-3 w-3 transition-transform ${showUpgrades ? 'rotate-180' : ''}`} />
              </button>
              
              {/* Kompakt statistikk */}
              <div className="flex flex-wrap justify-center gap-2 text-xs text-gray-400 mt-1">
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
            
            <h4 className="text-base font-medium mb-2 text-amber-300">Oppgraderinger</h4>
            
            <div className="space-y-2 max-h-60 overflow-y-auto pr-2">
              {/* Gruppere oppgraderinger etter type */}
              {['clickpower', 'autoclick', 'multiplier'].map(type => (
                <div key={type} className="mb-3">
                  <h5 className="text-xs font-medium text-gray-300 mb-1 border-b border-gray-700 pb-1">
                    {type === 'clickpower' ? 'Klikk-kraft' : 
                     type === 'autoclick' ? 'Auto-klikkere' : 
                     'Multiplikatorer'}
                  </h5>
                  
                  {upgrades
                    .filter(u => u.type === type)
                    .sort((a, b) => a.tier - b.tier)
                    .map(upgrade => {
                      const isAvailable = isUpgradeAvailable(upgrade);
                      const canAfford = coffeeCount >= upgrade.cost;
                      
                      return (
                        <div 
                          key={upgrade.id} 
                          className={`p-2 rounded-md mb-1 ${
                            upgrade.purchased 
                              ? 'bg-green-900/30 border border-green-700/50' 
                              : isAvailable && canAfford
                                ? 'bg-amber-900/30 border border-amber-700/50 hover:bg-amber-800/30 cursor-pointer'
                                : isAvailable
                                  ? 'bg-gray-800/50 border border-gray-700/50 opacity-75'
                                  : 'bg-gray-900/30 border border-gray-800/50 opacity-50'
                          }`}
                          onClick={() => !upgrade.purchased && isAvailable && canAfford && purchaseUpgrade(upgrade.id)}
                        >
                          <div className="flex justify-between items-center">
                            <h5 className="font-medium text-white text-sm">{upgrade.name}</h5>
                            {!upgrade.purchased && (
                              <span className="text-xs font-medium text-amber-300">{upgrade.cost} ☕</span>
                            )}
                            {upgrade.purchased && (
                              <span className="text-xs font-medium text-green-400 px-1.5 py-0.5 bg-green-900/50 rounded-full">Kjøpt</span>
                            )}
                          </div>
                          <p className="text-xs text-gray-400 mt-0.5">{upgrade.description}</p>
                          {!isAvailable && !upgrade.purchased && (
                            <p className="text-xs text-amber-500 mt-0.5">Krever: {upgrades.find(u => u.id === upgrade.requires)?.name}</p>
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