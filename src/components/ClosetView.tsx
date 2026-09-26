import { useState } from 'react';
import { ClothingItem, RARITY_CONFIG, type Rarity, type ItemType } from '../gameData';

interface ClosetViewProps {
  inventory: ClothingItem[];
  onClose: () => void;
}

const TYPE_LABELS: Record<ItemType, string> = {
  top: 'Tops',
  bottom: 'Bottoms',
  dress: 'Dresses',
  shoes: 'Shoes',
  accessory: 'Accessories',
  bag: 'Bags',
};

const RARITY_ORDER: Rarity[] = ['star', 'legendary', 'mythic', 'rare', 'common'];

export default function ClosetView({ inventory, onClose }: ClosetViewProps) {
  const [filter, setFilter] = useState<Rarity | 'all'>('all');
  const [selected, setSelected] = useState<ClothingItem | null>(null);

  const filtered = inventory
    .filter(item => filter === 'all' || item.rarity === filter)
    .sort((a, b) => RARITY_ORDER.indexOf(a.rarity) - RARITY_ORDER.indexOf(b.rarity));

  const totalValue = inventory.reduce((s, i) => s + i.value, 0);

  return (
    <div
      className="scene-enter"
      style={{
        width: '100%',
        height: '100%',
        background: 'linear-gradient(160deg, #0a0618 0%, #1a0a35 60%, #0a0618 100%)',
        display: 'flex',
        flexDirection: 'column',
        fontFamily: 'Poppins, sans-serif',
        position: 'relative',
        overflow: 'hidden',
      }}
    >
      {/* Header */}
      <div style={{
        padding: '14px 16px 10px',
        flexShrink: 0,
        background: 'linear-gradient(180deg, rgba(10,6,24,0.9) 0%, transparent 100%)',
        display: 'flex',
        alignItems: 'center',
        gap: 12,
        zIndex: 5,
      }}>
        <button onClick={onClose} style={{
          background: 'rgba(255,255,255,0.05)',
          border: '1px solid rgba(192,132,252,0.2)',
          borderRadius: '50%',
          width: 36,
          height: 36,
          color: '#c4b5fd',
          fontSize: '1rem',
          cursor: 'pointer',
          flexShrink: 0,
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
        }}>
          ←
        </button>
        <div style={{ flex: 1 }}>
          <h2 style={{ margin: 0, fontFamily: 'Playfair Display, serif', fontSize: '1.1rem', color: '#f0abfc' }}>
            My Closet
          </h2>
          <div style={{ color: '#6b5a8a', fontSize: '0.65rem', marginTop: 1 }}>
            {inventory.length} items · 🪙 {totalValue.toLocaleString()} total value
          </div>
        </div>
      </div>

      {/* Empty state */}
      {inventory.length === 0 && (
        <div style={{
          flex: 1,
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          justifyContent: 'center',
          gap: 12,
          color: '#4b3a6a',
        }}>
          <div style={{ fontSize: '3rem' }}>👗</div>
          <p style={{ margin: 0, fontSize: '0.85rem', textAlign: 'center' }}>
            Your closet is empty.<br />Open some wardrobes to fill it!
          </p>
          <button onClick={onClose} style={{
            marginTop: 8,
            padding: '10px 20px',
            borderRadius: 12,
            border: '1px solid rgba(192,132,252,0.3)',
            background: 'transparent',
            color: '#c084fc',
            cursor: 'pointer',
            fontSize: '0.85rem',
          }}>
            ← Back to Room
          </button>
        </div>
      )}

      {inventory.length > 0 && (
        <>
          {/* Rarity filter tabs */}
          <div style={{
            padding: '0 12px 8px',
            display: 'flex',
            gap: 6,
            overflowX: 'auto',
            flexShrink: 0,
          }}>
            {(['all', 'star', 'legendary', 'mythic', 'rare', 'common'] as const).map(r => {
              const isActive = filter === r;
              const cfg = r !== 'all' ? RARITY_CONFIG[r] : null;
              const count = r === 'all' ? inventory.length : inventory.filter(i => i.rarity === r).length;
              return (
                <button
                  key={r}
                  onClick={() => setFilter(r)}
                  style={{
                    flexShrink: 0,
                    padding: '5px 12px',
                    borderRadius: 20,
                    border: `1px solid ${isActive ? (cfg?.color ?? 'rgba(192,132,252,0.6)') : 'rgba(255,255,255,0.07)'}`,
                    background: isActive
                      ? (cfg ? `${cfg.bgColor}` : 'rgba(192,132,252,0.1)')
                      : 'transparent',
                    color: isActive ? (cfg?.color ?? '#c084fc') : '#5b4b7a',
                    fontSize: '0.65rem',
                    fontWeight: isActive ? 700 : 400,
                    cursor: 'pointer',
                    transition: 'all 0.2s',
                    display: 'flex',
                    alignItems: 'center',
                    gap: 4,
                  }}
                >
                  <span>{r === 'all' ? 'All' : cfg!.label}</span>
                  <span style={{ opacity: 0.7 }}>({count})</span>
                </button>
              );
            })}
          </div>

          {/* Grid */}
          <div style={{
            flex: 1,
            overflow: 'auto',
            padding: '4px 12px 20px',
            display: 'grid',
            gridTemplateColumns: 'repeat(3, 1fr)',
            gap: 8,
            alignContent: 'start',
          }}>
            {filtered.map((item, idx) => {
              const cfg = RARITY_CONFIG[item.rarity];
              const isSelected = selected?.id === item.id;
              return (
                <div
                  key={item.id + idx}
                  onClick={() => setSelected(isSelected ? null : item)}
                  style={{
                    background: isSelected
                      ? `linear-gradient(160deg, ${cfg.bgColor}, rgba(19,13,42,0.6))`
                      : 'rgba(255,255,255,0.03)',
                    border: `1.5px solid ${isSelected ? cfg.color + '80' : 'rgba(255,255,255,0.06)'}`,
                    borderRadius: 12,
                    padding: '10px 8px',
                    cursor: 'pointer',
                    display: 'flex',
                    flexDirection: 'column',
                    alignItems: 'center',
                    gap: 4,
                    transition: 'all 0.2s',
                    boxShadow: isSelected && item.rarity !== 'common' ? cfg.glow : 'none',
                  }}
                >
                  <div
                    className={
                      item.rarity === 'star' ? 'glow-star'
                      : item.rarity === 'legendary' ? 'glow-legendary'
                      : item.rarity === 'mythic' ? 'glow-mythic'
                      : item.rarity === 'rare' ? 'glow-rare'
                      : ''
                    }
                    style={{ fontSize: '1.8rem' }}
                  >
                    {item.emoji}
                  </div>
                  <div style={{
                    fontSize: '0.6rem',
                    color: '#c4b5fd',
                    textAlign: 'center',
                    lineHeight: 1.2,
                    fontWeight: 500,
                    maxWidth: '100%',
                    overflow: 'hidden',
                    whiteSpace: 'nowrap',
                    textOverflow: 'ellipsis',
                    width: '100%',
                    paddingInline: 2,
                  }}>
                    {item.name}
                  </div>
                  <div style={{
                    fontSize: '0.55rem',
                    color: cfg.color,
                    fontWeight: 700,
                  }}>
                    {cfg.label}
                  </div>
                </div>
              );
            })}
          </div>

          {/* Detail panel */}
          {selected && (
            <div style={{
              flexShrink: 0,
              margin: '0 12px 12px',
              padding: '12px 16px',
              background: `linear-gradient(135deg, ${RARITY_CONFIG[selected.rarity].bgColor}, rgba(19,13,42,0.9))`,
              border: `1.5px solid ${RARITY_CONFIG[selected.rarity].color}50`,
              borderRadius: 16,
              display: 'flex',
              alignItems: 'center',
              gap: 12,
              boxShadow: selected.rarity !== 'common' ? RARITY_CONFIG[selected.rarity].glow : 'none',
              animation: 'scene-in 0.2s ease-out',
            }}>
              <div
                className={
                  selected.rarity === 'star' ? 'glow-star'
                  : selected.rarity === 'legendary' ? 'glow-legendary'
                  : selected.rarity === 'mythic' ? 'glow-mythic'
                  : selected.rarity === 'rare' ? 'glow-rare'
                  : ''
                }
                style={{ fontSize: '2.2rem', flexShrink: 0 }}
              >
                {selected.emoji}
              </div>
              <div style={{ flex: 1, minWidth: 0 }}>
                <div style={{ fontFamily: 'Playfair Display, serif', fontSize: '0.9rem', fontWeight: 700, color: '#f0e6ff' }}>
                  {selected.name}
                </div>
                <div style={{ color: '#9d7fc0', fontSize: '0.65rem', marginTop: 2 }}>{selected.description}</div>
                <div style={{ display: 'flex', gap: 8, marginTop: 5, alignItems: 'center' }}>
                  <span style={{
                    background: RARITY_CONFIG[selected.rarity].bgColor,
                    border: `1px solid ${RARITY_CONFIG[selected.rarity].color}50`,
                    color: RARITY_CONFIG[selected.rarity].color,
                    fontSize: '0.55rem',
                    padding: '2px 7px',
                    borderRadius: 10,
                    fontWeight: 700,
                  }}>
                    {RARITY_CONFIG[selected.rarity].label}
                  </span>
                  <span style={{ color: '#fbbf24', fontSize: '0.7rem' }}>🪙 {selected.value.toLocaleString()}</span>
                  <span style={{ color: '#6b5a8a', fontSize: '0.6rem', textTransform: 'capitalize' }}>{TYPE_LABELS[selected.type]}</span>
                </div>
              </div>
            </div>
          )}
        </>
      )}
    </div>
  );
}
