import { useMemo, useState } from 'react';
import { ClothingItem, ITEMS, RARITY_CONFIG } from '../gameData';

interface MarketSceneProps {
  coins: number;
  onBack: () => void;
  onBuy: (item: ClothingItem) => void;
}

const MARKET_ITEMS = ITEMS.filter(item => ['c1', 'c2', 'r2', 'r3'].includes(item.id));

export default function MarketScene({ coins, onBack, onBuy }: MarketSceneProps) {
  const [selected, setSelected] = useState<ClothingItem | null>(null);
  const [bought, setBought] = useState<string[]>([]);
  const [sellerMood, setSellerMood] = useState(false);
  const available = useMemo(() => MARKET_ITEMS.filter(item => !bought.includes(item.id)), [bought]);

  const buy = () => {
    if (!selected || coins < selected.value || bought.includes(selected.id)) return;
    onBuy(selected);
    setBought(items => [...items, selected.id]);
    setSellerMood(true);
    setTimeout(() => setSellerMood(false), 1800);
    setSelected(null);
  };

  return (
    <div className="scene-enter market-scene" style={{ width: '100%', height: '100%', position: 'relative', overflow: 'hidden', fontFamily: 'Poppins, sans-serif', background: '#141313' }}>
      <div style={{ position: 'absolute', inset: 0, background: 'linear-gradient(180deg, #263342 0%, #65747e 47%, #302a27 47%, #1b1716 100%)' }} />
      <div style={{ position: 'absolute', left: '8%', right: '8%', top: '28%', height: 4, background: '#c6a46b', boxShadow: '0 0 18px rgba(198,164,107,.5)' }} />
      <div style={{ position: 'absolute', top: '8%', left: '8%', color: '#f4ead8', fontSize: '0.62rem', letterSpacing: '.18em', textTransform: 'uppercase' }}>Модная улица / Рынок</div>
      <div style={{ position: 'absolute', top: '12%', left: '8%', fontFamily: 'Playfair Display, serif', fontSize: '1.8rem', color: '#fff9ef' }}>Кураторский рынок</div>
      <button onClick={onBack} style={{ position: 'absolute', top: 12, right: 14, zIndex: 5, border: '1px solid rgba(255,255,255,.22)', background: 'rgba(16,15,15,.65)', color: '#f4ead8', borderRadius: 20, padding: '6px 12px', cursor: 'pointer' }}>← На улицу</button>

      <div style={{ position: 'absolute', top: '22%', left: '8%', right: '8%', display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: 8 }}>
        {['ОДЕЖДА', 'ОБУВЬ', 'АКСЕССУАРЫ'].map((label, index) => (
          <div key={label} style={{ background: index === 1 ? '#7f5e4a' : '#8a6a51', minHeight: 42, padding: '10px 8px', color: '#fff8ec', fontSize: '0.56rem', letterSpacing: '.1em', textAlign: 'center', clipPath: 'polygon(0 0, 100% 0, 92% 100%, 8% 100%)' }}>{label}</div>
        ))}
      </div>

      <div style={{ position: 'absolute', top: '35%', left: '5%', right: '5%', display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: 8 }}>
        {available.map(item => {
          const cfg = RARITY_CONFIG[item.rarity];
          const isSelected = selected?.id === item.id;
          return (
            <button key={item.id} onClick={() => setSelected(item)} style={{ minHeight: 170, borderRadius: 8, border: `1px solid ${isSelected ? cfg.color : 'rgba(255,255,255,.14)'}`, background: isSelected ? 'rgba(255,248,236,.18)' : 'rgba(31,27,25,.75)', color: '#fff8ec', cursor: 'pointer', padding: 8, boxShadow: isSelected ? `0 0 22px ${cfg.color}55` : '0 8px 18px rgba(0,0,0,.24)', transition: 'transform .2s, border-color .2s' }}>
              <div style={{ height: 94, display: 'flex', alignItems: 'center', justifyContent: 'center', background: 'rgba(255,255,255,.92)', borderRadius: 5, marginBottom: 8 }}>
                {item.image ? <img src={item.image} alt={item.name} style={{ maxWidth: '85%', maxHeight: '85%', objectFit: 'contain' }} /> : <span style={{ fontSize: '2.6rem' }}>{item.emoji}</span>}
              </div>
              <div style={{ fontSize: '0.62rem', fontWeight: 600, textAlign: 'left', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>{item.name}</div>
              <div style={{ marginTop: 4, display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}><span style={{ color: cfg.color, fontSize: '0.52rem' }}>{cfg.label}</span><span style={{ color: '#f5c451', fontSize: '0.58rem' }}>{item.value} монет</span></div>
            </button>
          );
        })}
        {available.length === 0 && <div style={{ gridColumn: '1 / -1', textAlign: 'center', color: '#d9c8b4', padding: 30 }}>Эта лавка распродана. Возвращайся завтра.</div>}
      </div>

      <div style={{ position: 'absolute', bottom: '13%', left: '8%', right: '8%', display: 'flex', alignItems: 'end', gap: 12 }}>
        <div className={sellerMood ? 'seller-react' : ''} style={{ width: 60, height: 86, borderRadius: '50% 50% 20% 20%', background: sellerMood ? '#c59870' : '#9a765d', border: '2px solid #e1b77e', position: 'relative', flexShrink: 0 }}>
          <div style={{ position: 'absolute', top: -18, left: 12, width: 36, height: 36, borderRadius: '50%', background: '#e5b991', border: '2px solid #f3d0a5' }} />
          <div style={{ position: 'absolute', top: -21, left: 8, width: 44, height: 18, borderRadius: '50% 50% 20% 20%', background: '#29201e' }} />
        </div>
        <div style={{ color: '#f4ead8', fontSize: '0.68rem', lineHeight: 1.5, maxWidth: 160 }}>{sellerMood ? 'Отличный выбор. Эта вещь уже летит в твою коллекцию.' : 'Подойди ближе. Здесь собраны вещи с характером.'}</div>
      </div>

      {selected && <div style={{ position: 'absolute', bottom: 12, left: 12, right: 12, background: 'rgba(20,18,17,.94)', border: `1px solid ${RARITY_CONFIG[selected.rarity].color}88`, borderRadius: 14, padding: '12px 14px', display: 'flex', alignItems: 'center', gap: 10, zIndex: 4 }}>
        <div style={{ width: 48, height: 48, background: '#fff', borderRadius: 7, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>{selected.image ? <img src={selected.image} alt={selected.name} style={{ maxWidth: '85%', maxHeight: '85%', objectFit: 'contain' }} /> : <span style={{ fontSize: '1.4rem' }}>{selected.emoji}</span>}</div>
        <div style={{ flex: 1, minWidth: 0 }}><div style={{ color: '#fff8ec', fontSize: '0.75rem', fontWeight: 600 }}>{selected.name}</div><div style={{ color: '#cbb8a2', fontSize: '0.6rem' }}>{selected.description}</div></div>
        <button onClick={buy} disabled={coins < selected.value} style={{ border: 0, borderRadius: 10, padding: '9px 12px', background: coins >= selected.value ? '#f5c451' : '#51483f', color: '#171311', fontWeight: 700, fontSize: '0.62rem', cursor: coins >= selected.value ? 'pointer' : 'not-allowed' }}>{coins >= selected.value ? `Купить ${selected.value}` : 'Не хватает'}</button>
      </div>}

      <div style={{ position: 'absolute', top: 12, left: '50%', transform: 'translateX(-50%)', background: 'rgba(20,18,17,.74)', border: '1px solid rgba(245,196,81,.35)', color: '#f5c451', borderRadius: 20, padding: '5px 11px', fontSize: '0.62rem', zIndex: 5 }}>◈ {coins.toLocaleString()}</div>
    </div>
  );
}
