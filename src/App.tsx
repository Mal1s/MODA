import { useState, useCallback, useEffect, useRef } from 'react';
import LandingPage from './LandingPage';
import CharacterSelect from './components/CharacterSelect';
import RoomScene from './components/RoomScene';
import StreetScene from './components/StreetScene';
import CaseOpening from './components/CaseOpening';
import ClosetView from './components/ClosetView';
import MarketScene from './components/MarketScene';
import AuctionScene from './components/AuctionScene';
import FusionScene from './components/FusionScene';
import { ClothingItem } from './gameData';
import { supabase } from './supabaseClient';

type View = 'landing' | 'game';
type Scene = 'select' | 'room' | 'street' | 'market' | 'auction' | 'fusion' | 'wardrobe' | 'closet';

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
  const [loaded, setLoaded] = useState(false);
  const coinIdRef = useRef(0);
  const energyRef = useRef(energy);
  energyRef.current = energy;

  // Load saved state from Supabase
  useEffect(() => {
    (async () => {
      try {
        const { data: stateData } = await supabase
          .from('player_state')
          .select('*')
          .eq('id', 'default')
          .maybeSingle();
        if (stateData) {
          setCoins(stateData.coins);
          setEnergy(stateData.energy);
          if (stateData.gender === 'male' || stateData.gender === 'female') {
            setGender(stateData.gender);
          }
        }
        const { data: invData } = await supabase
          .from('inventory')
          .select('*')
          .order('created_at', { ascending: true });
        if (invData && invData.length > 0) {
          setInventory(invData.map((row: { item_id: string; name: string; type: string; rarity: string; emoji: string; value: number; color: string; description: string }) => ({
            id: row.item_id,
            name: row.name,
            type: row.type as ClothingItem['type'],
            rarity: row.rarity as ClothingItem['rarity'],
            emoji: row.emoji,
            value: row.value,
            color: row.color,
            description: row.description,
          })));
        }
      } catch {
        // Offline or DB not ready — continue with defaults
      }
      setLoaded(true);
    })();
  }, []);

  // Persist coins/energy/gender
  useEffect(() => {
    if (!loaded) return;
    supabase
      .from('player_state')
      .upsert({ id: 'default', coins, energy, gender: gender ?? 'female', updated_at: new Date().toISOString() })
      .then();
  }, [coins, energy, gender, loaded]);

  // Persist inventory
  useEffect(() => {
    if (!loaded) return;
    (async () => {
      await supabase.from('inventory').delete().neq('id', '00000000-0000-0000-0000-000000000000');
      if (inventory.length > 0) {
        await supabase.from('inventory').insert(
          inventory.map(item => ({
            item_id: item.id,
            name: item.name,
            type: item.type,
            rarity: item.rarity,
            emoji: item.emoji,
            value: item.value,
            color: item.color,
            description: item.description,
          }))
        );
      }
    })();
  }, [inventory, loaded]);

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

  const handleMarketBuy = useCallback((item: ClothingItem) => {
    setCoins(current => Math.max(0, current - item.value));
    setInventory(prev => [...prev, item]);
  }, []);

  const handleAuctionWin = useCallback((item: ClothingItem, cost: number) => {
    setCoins(current => Math.max(0, current - cost));
    setInventory(prev => [...prev, item]);
  }, []);

  const handleFusionResult = useCallback((newItem: ClothingItem, consumed: ClothingItem[]) => {
    const consumedIds = new Set(consumed.map(c => c.id));
    setInventory(prev => {
      const filtered = prev.filter(item => !consumedIds.has(item.id));
      return [...filtered, newItem];
    });
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
            onMarketReached={() => setScene('market')}
            onAuctionReached={() => setScene('auction')}
            onFusionReached={() => setScene('fusion')}
          />
        )}

        {scene === 'market' && (
          <MarketScene
            key="market"
            coins={coins}
            onBack={() => setScene('street')}
            onBuy={handleMarketBuy}
          />
        )}

        {scene === 'auction' && (
          <AuctionScene
            key="auction"
            coins={coins}
            onBack={() => setScene('street')}
            onWin={handleAuctionWin}
          />
        )}

        {scene === 'fusion' && (
          <FusionScene
            key="fusion"
            inventory={inventory}
            onBack={() => setScene('street')}
            onResult={handleFusionResult}
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
