import { useState, useCallback, useEffect, useRef } from 'react';
import LandingPage from './LandingPage';
import CharacterSelect from './components/CharacterSelect';
import RoomScene from './components/RoomScene';
import StreetScene from './components/StreetScene';
import CaseOpening from './components/CaseOpening';
import ClosetView from './components/ClosetView';
import { ClothingItem } from './gameData';

type View = 'landing' | 'game';
type Scene = 'select' | 'room' | 'street' | 'wardrobe' | 'closet';

interface FloatingCoin {
  id: number;
  x: number;
  y: number;
}

const ENERGY_MAX = 1000;

export default function App() {
  const [view, setView] = useState<View>('landing');
  const [scene, setScene] = useState<Scene>('select');
  const [gender, setGender] = useState<'female' | 'male' | null>(null);
  const [coins, setCoins] = useState(250);
  const [energy, setEnergy] = useState(ENERGY_MAX);
  const [inventory, setInventory] = useState<ClothingItem[]>([]);
  const [floatingCoins, setFloatingCoins] = useState<FloatingCoin[]>([]);
  const coinIdRef = useRef(0);
  const energyRef = useRef(energy);
  energyRef.current = energy;

  // Energy regen
  useEffect(() => {
    if (view !== 'game') return;
    const id = setInterval(() => {
      if (energyRef.current < ENERGY_MAX) {
        setEnergy(e => Math.min(ENERGY_MAX, e + 1));
      }
    }, 3000);
    return () => clearInterval(id);
  }, [view]);

  // Mobile viewport height fix
  useEffect(() => {
    const setVh = () => {
      document.documentElement.style.setProperty('--vh', `${window.innerHeight * 0.01}px`);
    };
    setVh();
    window.addEventListener('resize', setVh);
    return () => window.removeEventListener('resize', setVh);
  }, []);

  const handleCoinClick = useCallback((e: React.MouseEvent) => {
    if (energyRef.current <= 0) return;
    setCoins(c => c + 1);
    setEnergy(e => Math.max(0, e - 1));
    const id = ++coinIdRef.current;
    setFloatingCoins(prev => [...prev, { id, x: e.clientX, y: e.clientY }]);
    setTimeout(() => setFloatingCoins(prev => prev.filter(c => c.id !== id)), 800);
  }, []);

  const handleItemWon = useCallback((item: ClothingItem) => {
    setInventory(prev => [...prev, item]);
  }, []);

  const handlePlayDemo = () => {
    setView('game');
    setScene('select');
  };

  const handleGenderSelect = (g: 'female' | 'male') => {
    setGender(g);
    setScene('room');
  };

  // ── Landing page ──
  if (view === 'landing') {
    return <LandingPage onPlayDemo={handlePlayDemo} />;
  }

  // ── Game shell ──
  return (
    <div style={{
      width: '100vw',
      height: 'calc(var(--vh, 1vh) * 100)',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      background: '#050310',
      overflow: 'hidden',
      position: 'relative',
    }}>
      {/* Floating coin animations */}
      {floatingCoins.map(coin => (
        <div key={coin.id} className="floating-coin" style={{ left: coin.x, top: coin.y }}>
          +1 🪙
        </div>
      ))}

      {/* Game device frame */}
      <div style={{
        width: '100%',
        maxWidth: 430,
        height: '100%',
        maxHeight: 932,
        position: 'relative',
        overflow: 'hidden',
        borderRadius: window.innerWidth > 480 ? 32 : 0,
        boxShadow: window.innerWidth > 480
          ? '0 0 80px rgba(168,85,247,0.3), 0 30px 60px rgba(0,0,0,0.8)'
          : 'none',
      }}>
        {/* Back to site button */}
        <button
          onClick={() => setView('landing')}
          style={{
            position: 'absolute',
            top: 12,
            left: '50%',
            transform: 'translateX(-50%)',
            zIndex: 50,
            background: 'rgba(5,3,15,0.7)',
            border: '1px solid rgba(192,132,252,0.2)',
            borderRadius: 20,
            padding: '3px 14px',
            color: 'rgba(196,181,253,0.6)',
            fontSize: '0.6rem',
            letterSpacing: '0.08em',
            cursor: 'pointer',
            backdropFilter: 'blur(8px)',
            display: scene !== 'select' ? 'block' : 'none',
          }}
        >
          ← Back to site
        </button>

        {scene === 'select' && (
          <CharacterSelect onSelect={handleGenderSelect} />
        )}

        {scene === 'room' && gender && (
          <RoomScene
            key="room"
            gender={gender}
            coins={coins}
            energy={energy}
            maxEnergy={ENERGY_MAX}
            inventory={inventory}
            onCoinClick={handleCoinClick}
            onWardrobeReached={() => setScene('wardrobe')}
            onDoorReached={() => setScene('street')}
            onClosetClick={() => setScene('closet')}
          />
        )}

        {scene === 'street' && gender && (
          <StreetScene
            key="street"
            gender={gender}
            coins={coins}
            onBack={() => setScene('room')}
          />
        )}

        {scene === 'wardrobe' && (
          <CaseOpening
            key="wardrobe"
            coins={coins}
            onSpend={amount => setCoins(c => c - amount)}
            onItemWon={handleItemWon}
            onClose={() => setScene('room')}
          />
        )}

        {scene === 'closet' && (
          <ClosetView
            key="closet"
            inventory={inventory}
            onClose={() => setScene('room')}
          />
        )}
      </div>
    </div>
  );
}
