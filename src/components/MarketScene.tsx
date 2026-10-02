import { useMemo, useState, useEffect } from 'react';
import { ClothingItem, ITEMS, RARITY_CONFIG, type Rarity } from '../gameData';

interface MarketSceneProps {
  coins: number;
  onBack: () => void;
  onBuy: (item: ClothingItem) => void;
}

interface StallItem extends ClothingItem {
  basePrice: number;
  currentPrice: number;
  trend: 'up' | 'down' | 'stable';
  sold: boolean;
}

type StallCategory = 'clothing' | 'shoes' | 'accessories';

const STALL_CATEGORIES: { id: StallCategory; label: string; emoji: string }[] = [
  { id: 'clothing', label: 'CLOTHING', emoji: '👗' },
  { id: 'shoes', label: 'SHOES', emoji: '👠' },
  { id: 'accessories', label: 'ACCESSORIES', emoji: '👜' },
];

const ALL_MARKET_ITEMS = ITEMS.filter(item => ['c1', 'c2', 'c3', 'c4', 'c5', 'r1', 'r2', 'r3', 'r4', 'r5', 'm1', 'm2', 'm3', 'm4'].includes(item.id));

function categorize(item: ClothingItem): StallCategory {
  if (item.type === 'shoes') return 'shoes';
  if (item.type === 'bag' || item.type === 'accessory') return 'accessories';
  return 'clothing';
}

function getDaySeed(): number {
  return Math.floor(Date.now() / (1000 * 60 * 60 * 24));
}

function generateStalls(daySeed: number): Record<StallCategory, StallItem[]> {
  const stalls: Record<StallCategory, StallItem[]> = { clothing: [], shoes: [], accessories: [] };
  for (const item of ALL_MARKET_ITEMS) {
    const cat = categorize(item);
    const seed = daySeed + item.id.charCodeAt(0) * 7;
    const trendRoll = (seed * 13) % 100;
    const trend: 'up' | 'down' | 'stable' = trendRoll < 35 ? 'up' : trendRoll < 70 ? 'down' : 'stable';
    const priceMod = trend === 'up' ? 1.15 + ((seed % 20) / 100) : trend === 'down' ? 0.75 + ((seed % 25) / 100) : 1;
    const currentPrice = Math.max(1, Math.round(item.value * priceMod));
    stalls[cat].push({ ...item, basePrice: item.value, currentPrice, trend, sold: false });
  }
  return stalls;
}

export default function MarketScene({ coins, onBack, onBuy }: MarketSceneProps) {
  const [daySeed, setDaySeed] = useState(getDaySeed());
  const [stalls, setStalls] = useState<Record<StallCategory, StallItem[]>>(() => generateStalls(getDaySeed()));
  const [selected, setSelected] = useState<StallItem | null>(null);
  const [category, setCategory] = useState<StallCategory>('clothing');
  const [sellerMood, setSellerMood] = useState(false);
  const [toast, setToast] = useState<string | null>(null);

  const dayNumber = useMemo(() => daySeed % 1000, [daySeed]);

  useEffect(() => {
    if (!toast) return;
    const id = setTimeout(() => setToast(null), 2000);
    return () => clearTimeout(id);
  }, [toast]);

  const refreshStalls = () => {
    const newSeed = getDaySeed() + 1;
    setDaySeed(newSeed);
    setStalls(generateStalls(newSeed));
    setSelected(null);
    setToast('Stalls refreshed — new items and prices!');
  };

  const available = stalls[category].filter(item => !item.sold);

  const buy = () => {
    if (!selected || coins < selected.currentPrice) return;
    onBuy(selected);
    setStalls(prev => ({
      ...prev,
      [category]: prev[category].map(item => item.id === selected.id ? { ...item, sold: true } : item),
    }));
    setSellerMood(true);
    setTimeout(() => setSellerMood(false), 1800);
    setToast(`Purchased ${selected.name}!`);
    setSelected(null);
  };

  return (
    <div className="scene-enter" style={{ width: '100%', height: '100%', position: 'relative', overflow: 'hidden', fontFamily: 'Poppins, sans-serif', background: '#141313' }}>
      <div style={{ position: 'absolute', inset: 0, background: 'linear-gradient(180deg, #1a2638 0%, #4a5a68 47%, #2a2520 47%, #1a1614 100%)' }} />
      <div style={{ position: 'absolute', left: '8%', right: '8%', top: '26%', height: 4, background: '#c6a46b', boxShadow: '0 0 18px rgba(198,164,107,.5)' }} />
      <div style={{ position: 'absolute', top: '7%', left: '8%', color: '#f4ead8', fontSize: '0.6rem', letterSpacing: '.18em', textTransform: 'uppercase' }}>Fashion Street / Market</div>
      <div style={{ position: 'absolute', top: '11%', left: '8%', fontFamily: 'Playfair Display, serif', fontSize: '1.6rem', color: '#fff9ef' }}>Curated Market</div>
      <div style={{ position: 'absolute', top: '11%', right: '8%', display: 'flex', gap: 8, alignItems: 'center' }}>
        <span style={{ color: '#9ca3af', fontSize: '0.55rem' }}>Day {dayNumber}</span>
        <button onClick={refreshStalls} style={{ border: '1px solid rgba(255,255,255,.22)', background: 'rgba(16,15,15,.65)', color: '#f4ead8', borderRadius: 16, padding: '5px 10px', cursor: 'pointer', fontSize: '0.58rem' }}>Refresh stalls</button>
      </div>
      <button onClick={onBack} style={{ position: 'absolute', top: 12, right: 14, zIndex: 5, border: '1px solid rgba(255,255,255,.22)', background: 'rgba(16,15,15,.65)', color: '#f4ead8', borderRadius: 20, padding: '6px 12px', cursor: 'pointer', fontSize: '0.72rem' }}>← Street</button>

      <div style={{ position: 'absolute', top: '20%', left: '8%', right: '8%', display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: 8 }}>
        {STALL_CATEGORIES.map(stall => {
          const isActive = category === stall.id;
          return (
            <button key={stall.id} onClick={() => setCategory(stall.id)} style={{ background: isActive ? '#7f5e4a' : '#8a6a51', minHeight: 38, padding: '8px', color: '#fff8ec', fontSize: '0.54rem', letterSpacing: '.1em', textAlign: 'center', clipPath: 'polygon(0 0, 100% 0, 92% 100%, 8% 100%)', border: 'none', cursor: 'pointer', fontWeight: isActive ? 800 : 500 }}>{stall.emoji} {stall.label}</button>
          );
        })}
      </div>

      <div style={{ position: 'absolute', top: '32%', left: '5%', right: '5%', display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: 8 }}>
        {available.map(item => {
          const cfg = RARITY_CONFIG[item.rarity];
          const isSelected = selected?.id === item.id;
          const trendIcon = item.trend === 'up' ? '↑' : item.trend === 'down' ? '↓' : '—';
          const trendColor = item.trend === 'up' ? '#22c55e' : item.trend === 'down' ? '#f87171' : '#9ca3af';
          return (
            <button key={item.id} onClick={() => setSelected(item)} style={{ minHeight: 160, borderRadius: 8, border: `1px solid ${isSelected ? cfg.color : 'rgba(255,255,255,.14)'}`, background: isSelected ? 'rgba(255,248,236,.18)' : 'rgba(31,27,25,.75)', color: '#fff8ec', cursor: 'pointer', padding: 8, boxShadow: isSelected ? `0 0 22px ${cfg.color}55` : '0 8px 18px rgba(0,0,0,.24)', transition: 'transform .2s, border-color .2s' }}>
              <div style={{ height: 84, display: 'flex', alignItems: 'center', justifyContent: 'center', background: 'rgba(255,255,255,.92)', borderRadius: 5, marginBottom: 6 }}>
                {item.image ? <img src={item.image} alt={item.name} draggable={false} style={{ maxWidth: '85%', maxHeight: '85%', objectFit: 'contain' }} /> : <span style={{ fontSize: '2.4rem' }}>{item.emoji}</span>}
              </div>
              <div style={{ fontSize: '0.58rem', fontWeight: 600, textAlign: 'left', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>{item.name}</div>
              <div style={{ marginTop: 3, display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <span style={{ color: cfg.color, fontSize: '0.5rem' }}>{cfg.label}</span>
                <span style={{ color: '#f5c451', fontSize: '0.55rem' }}>{item.currentPrice} {trendIcon}</span>
              </div>
              <div style={{ fontSize: '0.48rem', color: trendColor, textAlign: 'left', marginTop: 2 }}>
                {item.trend === 'up' ? 'Price rising' : item.trend === 'down' ? 'Price dropping' : 'Stable price'}
              </div>
            </button>
          );
        })}
        {available.length === 0 && <div style={{ gridColumn: '1 / -1', textAlign: 'center', color: '#d9c8b4', padding: 30, fontSize: '0.72rem' }}>This stall is sold out. Refresh or come back tomorrow.</div>}
      </div>

      <div style={{ position: 'absolute', bottom: '12%', left: '8%', right: '8%', display: 'flex', alignItems: 'end', gap: 12 }}>
        <div className={sellerMood ? 'seller-react' : ''} style={{ width: 56, height: 80, borderRadius: '50% 50% 20% 20%', background: sellerMood ? '#c59870' : '#9a765d', border: '2px solid #e1b77e', position: 'relative', flexShrink: 0 }}>
          <div style={{ position: 'absolute', top: -16, left: 10, width: 32, height: 32, borderRadius: '50%', background: '#e5b991', border: '2px solid #f3d0a5' }} />
          <div style={{ position: 'absolute', top: -19, left: 8, width: 40, height: 16, borderRadius: '50% 50% 20% 20%', background: '#29201e' }} />
        </div>
        <div style={{ color: '#f4ead8', fontSize: '0.66rem', lineHeight: 1.5, maxWidth: 180 }}>{sellerMood ? 'Excellent choice. That piece is flying to your collection.' : 'Come closer. These are items with character.'}</div>
      </div>

      {selected && !selected.sold && (
        <div style={{ position: 'absolute', bottom: 12, left: 12, right: 12, background: 'rgba(20,18,17,.94)', border: `1px solid ${RARITY_CONFIG[selected.rarity].color}88`, borderRadius: 14, padding: '12px 14px', display: 'flex', alignItems: 'center', gap: 10, zIndex: 4 }}>
          <div style={{ width: 44, height: 44, background: '#fff', borderRadius: 7, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>{selected.image ? <img src={selected.image} alt={selected.name} draggable={false} style={{ maxWidth: '85%', maxHeight: '85%', objectFit: 'contain' }} /> : <span style={{ fontSize: '1.3rem' }}>{selected.emoji}</span>}</div>
          <div style={{ flex: 1, minWidth: 0 }}>
            <div style={{ color: '#fff8ec', fontSize: '0.72rem', fontWeight: 600 }}>{selected.name}</div>
            <div style={{ color: '#cbb8a2', fontSize: '0.58rem' }}>{selected.description}</div>
            <div style={{ fontSize: '0.52rem', marginTop: 2 }}>
              <span style={{ color: '#9ca3af' }}>Base: {selected.basePrice}</span>
              <span style={{ color: selected.trend === 'up' ? '#22c55e' : selected.trend === 'down' ? '#f87171' : '#9ca3af', marginLeft: 6 }}>
                {selected.trend === 'up' ? '↑ Rising' : selected.trend === 'down' ? '↓ Dropping' : '— Stable'}
              </span>
            </div>
          </div>
          <button onClick={buy} disabled={coins < selected.currentPrice} style={{ border: 0, borderRadius: 10, padding: '9px 12px', background: coins >= selected.currentPrice ? '#f5c451' : '#51483f', color: '#171311', fontWeight: 700, fontSize: '0.6rem', cursor: coins >= selected.currentPrice ? 'pointer' : 'not-allowed' }}>{coins >= selected.currentPrice ? `Buy ${selected.currentPrice}` : 'Not enough'}</button>
        </div>
      )}

      {toast && <div style={{ position: 'absolute', top: '16%', left: '50%', transform: 'translateX(-50%)', background: 'rgba(20,18,17,.92)', border: '1px solid rgba(245,196,81,.4)', color: '#f5c451', borderRadius: 14, padding: '8px 16px', fontSize: '0.66rem', zIndex: 10, animation: 'scene-in 0.3s ease-out' }}>{toast}</div>}

      <div style={{ position: 'absolute', top: 12, left: '50%', transform: 'translateX(-50%)', background: 'rgba(20,18,17,.74)', border: '1px solid rgba(245,196,81,.35)', color: '#f5c451', borderRadius: 20, padding: '5px 11px', fontSize: '0.62rem', zIndex: 5 }}>🪙 {coins.toLocaleString()}</div>
    </div>
  );
}
