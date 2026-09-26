import { useState, useRef, useCallback } from 'react';
import { ClothingItem, RARITY_CONFIG, type Rarity } from '../gameData';

interface FusionSceneProps {
  inventory: ClothingItem[];
  onBack: () => void;
  onResult: (newItem: ClothingItem, consumed: ClothingItem[]) => void;
}

type Phase = 'select' | 'charging' | 'orbit' | 'peak' | 'success' | 'failure';

const RARITY_ORDER: Rarity[] = ['common', 'rare', 'mythic', 'legendary', 'star'];

export default function FusionScene({ inventory, onBack, onResult }: FusionSceneProps) {
  const [slotA, setSlotA] = useState<ClothingItem | null>(null);
  const [slotB, setSlotB] = useState<ClothingItem | null>(null);
  const [phase, setPhase] = useState<Phase>('select');
  const [resultItem, setResultItem] = useState<ClothingItem | null>(null);
  const [consumed, setConsumed] = useState<ClothingItem[]>([]);
  const [flash, setFlash] = useState(false);
  const timerRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  const canFuse = slotA && slotB && slotA.id !== slotB.id && phase === 'select';

  const startFusion = useCallback(() => {
    if (!slotA || !slotB) return;
    setPhase('charging');
    setConsumed([slotA, slotB]);

    timerRef.current = setTimeout(() => {
      setPhase('orbit');
      timerRef.current = setTimeout(() => {
        setPhase('peak');
        setFlash(true);
        setTimeout(() => setFlash(false), 300);

        const aIdx = RARITY_ORDER.indexOf(slotA.rarity);
        const bIdx = RARITY_ORDER.indexOf(slotB.rarity);
        const maxIdx = Math.max(aIdx, bIdx);
        const success = Math.random() > 0.35;

        if (success && maxIdx < RARITY_ORDER.length - 1) {
          const newRarity = RARITY_ORDER[maxIdx + 1];
          const pool = [
            { id: 'fused-' + Date.now(), name: 'Fused ' + slotA.name, type: slotA.type, rarity: newRarity, emoji: slotA.emoji, value: (slotA.value + slotB.value) * 2, color: slotA.color, description: `Fusion of ${slotA.name} and ${slotB.name}` },
          ];
          const newItem = pool[0];
          setResultItem(newItem);
          setPhase('success');
          onResult(newItem, [slotA, slotB]);
        } else if (success && maxIdx === RARITY_ORDER.length - 1) {
          setResultItem(slotA);
          setPhase('success');
          onResult(slotA, [slotB]);
        } else {
          setPhase('failure');
          onResult(slotA, [slotB]);
        }
      }, 800);
    }, 1000);
  }, [slotA, slotB, onResult]);

  const reset = () => {
    setSlotA(null);
    setSlotB(null);
    setResultItem(null);
    setConsumed([]);
    setPhase('select');
  };

  const available = inventory.filter(item => !consumed.includes(item));

  return (
    <div className="scene-enter" style={{ width: '100%', height: '100%', position: 'relative', overflow: 'hidden', fontFamily: 'Poppins, sans-serif', background: 'linear-gradient(180deg, #0a0618 0%, #1a0a2e 50%, #0a0618 100%)' }}>
      {flash && <div style={{ position: 'absolute', inset: 0, background: 'white', opacity: 0.8, zIndex: 50, pointerEvents: 'none' }} />}

      {/* Ambient glow */}
      <div style={{ position: 'absolute', inset: 0, pointerEvents: 'none' }}>
        <div style={{ position: 'absolute', top: '20%', left: '50%', transform: 'translateX(-50%)', width: '60%', height: '40%', background: 'radial-gradient(ellipse, rgba(168,85,247,0.15) 0%, transparent 70%)', borderRadius: '50%' }} />
      </div>

      {/* Header */}
      <div style={{ position: 'absolute', top: 0, left: 0, right: 0, padding: '12px 16px', display: 'flex', alignItems: 'center', justifyContent: 'space-between', zIndex: 10 }}>
        <div>
          <div style={{ fontFamily: 'Playfair Display, serif', fontSize: '1.1rem', color: '#f0abfc' }}>Fusion Lab</div>
          <div style={{ color: '#9d7fc0', fontSize: '0.62rem' }}>Combine items to upgrade rarity</div>
        </div>
        <button onClick={onBack} style={{ background: 'rgba(255,255,255,0.05)', border: '1px solid rgba(192,132,252,0.2)', borderRadius: 20, padding: '5px 12px', color: '#c4b5fd', fontSize: '0.72rem', cursor: 'pointer' }}>← Street</button>
      </div>

      {/* Fusion stage */}
      {(phase === 'select' || phase === 'charging' || phase === 'orbit' || phase === 'peak') && (
        <div style={{ position: 'absolute', top: '18%', left: '0', right: '0', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 20, zIndex: 3 }}>
          {/* Slot A */}
          <div style={{
            width: 80, height: 80, borderRadius: 14, border: `2px ${slotA ? RARITY_CONFIG[slotA.rarity].color : 'rgba(255,255,255,0.1)'} solid`,
            background: slotA ? RARITY_CONFIG[slotA.rarity].bgColor : 'rgba(255,255,255,0.03)',
            display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '2rem',
            boxShadow: slotA ? RARITY_CONFIG[slotA.rarity].glow : 'none',
            animation: phase === 'orbit' ? 'rarity-float 0.6s ease-in-out infinite' : 'none',
            transform: phase === 'orbit' || phase === 'peak' ? 'translateX(20px)' : 'translateX(0)',
            transition: 'transform 0.8s ease',
          }}>
            {slotA ? slotA.emoji : '?'}
          </div>

          {/* Energy field */}
          <div style={{
            width: 40, height: 40, borderRadius: '50%',
            background: phase === 'charging' ? 'radial-gradient(circle, rgba(168,85,247,0.6), transparent)' : phase === 'orbit' || phase === 'peak' ? 'radial-gradient(circle, rgba(240,171,252,0.8), rgba(168,85,247,0.4))' : 'rgba(255,255,255,0.05)',
            animation: phase === 'orbit' || phase === 'peak' ? 'star-cycle 0.5s linear infinite' : 'none',
            border: phase === 'select' ? '2px dashed rgba(192,132,252,0.2)' : 'none',
          }} />

          {/* Slot B */}
          <div style={{
            width: 80, height: 80, borderRadius: 14, border: `2px ${slotB ? RARITY_CONFIG[slotB.rarity].color : 'rgba(255,255,255,0.1)'} solid`,
            background: slotB ? RARITY_CONFIG[slotB.rarity].bgColor : 'rgba(255,255,255,0.03)',
            display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '2rem',
            boxShadow: slotB ? RARITY_CONFIG[slotB.rarity].glow : 'none',
            animation: phase === 'orbit' ? 'rarity-float 0.6s ease-in-out infinite' : 'none',
            transform: phase === 'orbit' || phase === 'peak' ? 'translateX(-20px)' : 'translateX(0)',
            transition: 'transform 0.8s ease',
          }}>
            {slotB ? slotB.emoji : '?'}
          </div>
        </div>
      )}

      {/* Result */}
      {(phase === 'success' || phase === 'failure') && resultItem && (
        <div style={{ position: 'absolute', top: '25%', left: '50%', transform: 'translateX(-50%)', textAlign: 'center', zIndex: 5 }}>
          <div style={{
            fontSize: '4rem',
            animation: 'star-burst 0.6s cubic-bezier(0.34,1.56,0.64,1) forwards',
          }} className={phase === 'success' ? 'glow-' + resultItem.rarity : ''}>
            {resultItem.emoji}
          </div>
          <div style={{ fontFamily: 'Playfair Display, serif', fontSize: '1.1rem', color: phase === 'success' ? '#f0e6ff' : '#9d7fc0', marginTop: 8 }}>
            {phase === 'success' ? resultItem.name : 'Fusion Failed'}
          </div>
          {phase === 'success' && (
            <div style={{ fontSize: '0.65rem', color: RARITY_CONFIG[resultItem.rarity].color, fontWeight: 700, marginTop: 2 }}>
              {RARITY_CONFIG[resultItem.rarity].label}
            </div>
          )}
          {phase === 'failure' && (
            <div style={{ color: '#9d7fc0', fontSize: '0.7rem', marginTop: 4 }}>Не повезло. Попробуй ещё раз.</div>
          )}
        </div>
      )}

      {/* Item picker */}
      {phase === 'select' && (
        <div style={{ position: 'absolute', bottom: 0, left: 0, right: 0, padding: '12px', zIndex: 5 }}>
          {available.length < 2 ? (
            <div style={{ textAlign: 'center', color: '#5b4b7a', fontSize: '0.8rem', padding: 20 }}>
              You need at least 2 items to fuse. Open wardrobes or visit the market to collect items.
            </div>
          ) : (
            <>
              <div style={{ color: '#9d7fc0', fontSize: '0.65rem', marginBottom: 8, textAlign: 'center' }}>
                {slotA ? (slotB ? 'Ready to fuse!' : 'Select second item') : 'Select first item'}
              </div>
              <div style={{ display: 'flex', gap: 6, overflowX: 'auto', paddingBottom: 8, maxHeight: 90 }}>
                {available.map((item, idx) => {
                  const cfg = RARITY_CONFIG[item.rarity];
                  const isA = slotA?.id === item.id;
                  const isB = slotB?.id === item.id;
                  const used = isA || isB;
                  return (
                    <button
                      key={item.id + idx}
                      onClick={() => {
                        if (used) return;
                        if (!slotA || (slotA && slotB)) { setSlotA(item); if (slotB) setSlotB(null); }
                        else { setSlotB(item); }
                      }}
                      disabled={used}
                      style={{
                        flexShrink: 0, width: 60, height: 70, borderRadius: 10,
                        border: `1.5px solid ${used ? cfg.color : 'rgba(255,255,255,0.08)'}`,
                        background: used ? cfg.bgColor : 'rgba(255,255,255,0.03)',
                        display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', gap: 2,
                        cursor: used ? 'default' : 'pointer', opacity: used ? 0.5 : 1,
                        transition: 'all 0.2s',
                      }}
                    >
                      <span style={{ fontSize: '1.4rem' }} className={used ? 'glow-' + item.rarity : ''}>{item.emoji}</span>
                      <span style={{ fontSize: '0.5rem', color: cfg.color, fontWeight: 600 }}>{cfg.label}</span>
                    </button>
                  );
                })}
              </div>
              <button
                onClick={startFusion}
                disabled={!canFuse}
                style={{
                  width: '100%', marginTop: 10, padding: '12px 0', borderRadius: 14, border: 'none',
                  background: canFuse ? 'linear-gradient(135deg, #a855f7, #c026d3)' : 'rgba(255,255,255,0.06)',
                  color: canFuse ? 'white' : '#5b4b7a', fontWeight: 700, fontSize: '0.85rem',
                  cursor: canFuse ? 'pointer' : 'not-allowed',
                  boxShadow: canFuse ? '0 4px 20px rgba(168,85,247,0.4)' : 'none',
                }}
              >
                {canFuse ? '⚡ Start Fusion' : 'Select 2 items'}
              </button>
            </>
          )}
        </div>
      )}

      {/* Result buttons */}
      {(phase === 'success' || phase === 'failure') && (
        <div style={{ position: 'absolute', bottom: 16, left: 12, right: 12, display: 'flex', gap: 10, zIndex: 6 }}>
          <button onClick={reset} style={{ flex: 1, padding: '12px 0', borderRadius: 14, border: '1.5px solid rgba(192,132,252,0.3)', background: 'transparent', color: '#c4b5fd', fontWeight: 600, fontSize: '0.85rem', cursor: 'pointer' }}>
            Fuse Again
          </button>
          <button onClick={onBack} style={{ flex: 1, padding: '12px 0', borderRadius: 14, border: 'none', background: 'linear-gradient(135deg, #7c3aed, #4f46e5)', color: 'white', fontWeight: 600, fontSize: '0.85rem', cursor: 'pointer' }}>
            ← Back to Street
          </button>
        </div>
      )}
    </div>
  );
}
