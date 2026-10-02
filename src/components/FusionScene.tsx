import { useState, useRef, useCallback } from 'react';
import { ClothingItem, RARITY_CONFIG, type Rarity } from '../gameData';

interface FusionSceneProps {
  inventory: ClothingItem[];
  coins: number;
  onSpend: (amount: number) => void;
  onBack: () => void;
  onResult: (newItem: ClothingItem, consumed: ClothingItem[]) => void;
}

type Phase = 'select' | 'charging' | 'orbit' | 'peak' | 'success' | 'failure';
type Mode = 'merge' | 'upgrade';
type Multiplier = 2 | 4 | 8;

const RARITY_ORDER: Rarity[] = ['common', 'rare', 'mythic', 'legendary', 'star'];

const MULTIPLIER_CONFIG: Record<Multiplier, { cost: number; successBoost: number; label: string }> = {
  2: { cost: 200, successBoost: 0.25, label: 'x2' },
  4: { cost: 600, successBoost: 0.5, label: 'x4' },
  8: { cost: 1500, successBoost: 0.75, label: 'x8' },
};

export default function FusionScene({ inventory, coins, onSpend, onBack, onResult }: FusionSceneProps) {
  const [mode, setMode] = useState<Mode>('upgrade');
  const [slotA, setSlotA] = useState<ClothingItem | null>(null);
  const [slotB, setSlotB] = useState<ClothingItem | null>(null);
  const [upgradeTarget, setUpgradeTarget] = useState<ClothingItem | null>(null);
  const [multiplier, setMultiplier] = useState<Multiplier>(2);
  const [phase, setPhase] = useState<Phase>('select');
  const [resultItem, setResultItem] = useState<ClothingItem | null>(null);
  const [consumed, setConsumed] = useState<ClothingItem[]>([]);
  const [flash, setFlash] = useState(false);
  const timerRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  const baseSuccessRate = 0.45;
  const successRate = Math.min(0.95, baseSuccessRate + MULTIPLIER_CONFIG[multiplier].successBoost);

  const canStartMerge = slotA && slotB && slotA.id !== slotB.id && phase === 'select';
  const canStartUpgrade = upgradeTarget && phase === 'select';
  const available = inventory.filter(item => !consumed.includes(item));

  const buildUpgradedItem = (item: ClothingItem): ClothingItem => {
    const idx = RARITY_ORDER.indexOf(item.rarity);
    const newRarity = idx < RARITY_ORDER.length - 1 ? RARITY_ORDER[idx + 1] : item.rarity;
    return {
      ...item,
      id: 'upgraded-' + Date.now(),
      name: item.name + ' +',
      rarity: newRarity,
      value: Math.round(item.value * 2.5),
      description: `Upgraded ${item.name}`,
    };
  };

  const startFusion = useCallback(() => {
    if (mode === 'merge') {
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
            const newItem: ClothingItem = { id: 'fused-' + Date.now(), name: 'Fusion: ' + slotA.name, type: slotA.type, rarity: newRarity, emoji: slotA.emoji, value: (slotA.value + slotB.value) * 2, color: slotA.color, description: `Fusion of ${slotA.name} and ${slotB.name}` };
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
    } else {
      if (!upgradeTarget) return;
      const upgradeCost = MULTIPLIER_CONFIG[multiplier].cost;
      if (coins < upgradeCost) return;
      onSpend(upgradeCost);
      setPhase('charging');
      setConsumed([upgradeTarget]);
      timerRef.current = setTimeout(() => {
        setPhase('orbit');
        timerRef.current = setTimeout(() => {
          setPhase('peak');
          setFlash(true);
          setTimeout(() => setFlash(false), 300);
          const success = Math.random() < successRate;
          if (success) {
            const newItem = buildUpgradedItem(upgradeTarget);
            setResultItem(newItem);
            setPhase('success');
            onResult(newItem, [upgradeTarget]);
          } else {
            setResultItem(upgradeTarget);
            setPhase('failure');
            onResult(upgradeTarget, []);
          }
        }, 800);
      }, 1000);
    }
  }, [mode, slotA, slotB, upgradeTarget, multiplier, onResult, successRate, coins, onSpend]);

  const reset = () => {
    setSlotA(null);
    setSlotB(null);
    setUpgradeTarget(null);
    setResultItem(null);
    setConsumed([]);
    setPhase('select');
  };

  const rarityGlowClass = (r: Rarity) => {
    if (r === 'star') return 'glow-star';
    if (r === 'legendary') return 'glow-legendary';
    if (r === 'mythic') return 'glow-mythic';
    if (r === 'rare') return 'glow-rare';
    return '';
  };

  return (
    <div className="scene-enter" style={{ width: '100%', height: '100%', position: 'relative', overflow: 'hidden', fontFamily: 'Poppins, sans-serif', background: 'linear-gradient(180deg, #0a0618 0%, #1a0a2e 50%, #0a0618 100%)' }}>
      {flash && <div style={{ position: 'absolute', inset: 0, background: 'white', opacity: 0.8, zIndex: 50, pointerEvents: 'none' }} />}

      <div style={{ position: 'absolute', inset: 0, pointerEvents: 'none' }}>
        <div style={{ position: 'absolute', top: '18%', left: '50%', transform: 'translateX(-50%)', width: '60%', height: '40%', background: 'radial-gradient(ellipse, rgba(168,85,247,0.15) 0%, transparent 70%)', borderRadius: '50%' }} />
      </div>

      <div style={{ position: 'absolute', top: 0, left: 0, right: 0, padding: '12px 16px', display: 'flex', alignItems: 'center', justifyContent: 'space-between', zIndex: 10 }}>
        <div>
          <div style={{ fontFamily: 'Playfair Display, serif', fontSize: '1.1rem', color: '#f0abfc' }}>Fusion Lab</div>
          <div style={{ color: '#9d7fc0', fontSize: '0.6rem' }}>{mode === 'merge' ? 'Merge two items to raise rarity' : 'Upgrade an item with a chance multiplier'}</div>
        </div>
        <button onClick={onBack} style={{ background: 'rgba(255,255,255,0.05)', border: '1px solid rgba(192,132,252,0.2)', borderRadius: 20, padding: '5px 12px', color: '#c4b5fd', fontSize: '0.72rem', cursor: 'pointer' }}>← Street</button>
      </div>

      {(phase === 'select' || phase === 'charging' || phase === 'orbit' || phase === 'peak') && (
        <div style={{ position: 'absolute', top: '15%', left: '0', right: '0', display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', gap: 16, zIndex: 3 }}>
          {mode === 'upgrade' && phase === 'select' && (
            <div style={{ display: 'flex', gap: 6 }}>
              {([2, 4, 8] as Multiplier[]).map(m => (
                <button key={m} onClick={() => setMultiplier(m)} style={{
                  padding: '8px 16px', borderRadius: 12, border: `1.5px solid ${multiplier === m ? '#f0abfc' : 'rgba(255,255,255,0.1)'}`,
                  background: multiplier === m ? 'rgba(240,171,252,0.15)' : 'rgba(255,255,255,0.03)',
                  color: multiplier === m ? '#f0abfc' : '#9d7fc0', fontWeight: 700, fontSize: '0.8rem', cursor: 'pointer',
                }}>
                  {MULTIPLIER_CONFIG[m].label} · {MULTIPLIER_CONFIG[m].cost} 🪙
                </button>
              ))}
            </div>
          )}
          {mode === 'upgrade' && phase === 'select' && (
            <div style={{ color: '#c4b5fd', fontSize: '0.66rem', textAlign: 'center' }}>
              Success chance: <span style={{ color: successRate > 0.7 ? '#22c55e' : successRate > 0.5 ? '#fbbf24' : '#f87171', fontWeight: 700 }}>{Math.round(successRate * 100)}%</span>
            </div>
          )}

          {mode === 'merge' ? (
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 20 }}>
              <div style={{ width: 80, height: 80, borderRadius: 14, border: `2px ${slotA ? RARITY_CONFIG[slotA.rarity].color : 'rgba(255,255,255,0.1)'} solid`, background: slotA ? RARITY_CONFIG[slotA.rarity].bgColor : 'rgba(255,255,255,0.03)', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '2rem', boxShadow: slotA ? RARITY_CONFIG[slotA.rarity].glow : 'none', animation: phase === 'orbit' ? 'rarity-float 0.6s ease-in-out infinite' : 'none', transform: phase === 'orbit' || phase === 'peak' ? 'translateX(20px)' : 'translateX(0)', transition: 'transform 0.8s ease' }}>
                {slotA ? (slotA.image ? <img src={slotA.image} alt="" draggable={false} style={{ maxWidth: '70%', maxHeight: '70%', objectFit: 'contain' }} /> : slotA.emoji) : '?'}
              </div>
              <div style={{ width: 40, height: 40, borderRadius: '50%', background: phase === 'charging' ? 'radial-gradient(circle, rgba(168,85,247,0.6), transparent)' : phase === 'orbit' || phase === 'peak' ? 'radial-gradient(circle, rgba(240,171,252,0.8), rgba(168,85,247,0.4))' : 'rgba(255,255,255,0.05)', animation: phase === 'orbit' || phase === 'peak' ? 'star-cycle 0.5s linear infinite' : 'none', border: phase === 'select' ? '2px dashed rgba(192,132,252,0.2)' : 'none' }} />
              <div style={{ width: 80, height: 80, borderRadius: 14, border: `2px ${slotB ? RARITY_CONFIG[slotB.rarity].color : 'rgba(255,255,255,0.1)'} solid`, background: slotB ? RARITY_CONFIG[slotB.rarity].bgColor : 'rgba(255,255,255,0.03)', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '2rem', boxShadow: slotB ? RARITY_CONFIG[slotB.rarity].glow : 'none', animation: phase === 'orbit' ? 'rarity-float 0.6s ease-in-out infinite' : 'none', transform: phase === 'orbit' || phase === 'peak' ? 'translateX(-20px)' : 'translateX(0)', transition: 'transform 0.8s ease' }}>
                {slotB ? (slotB.image ? <img src={slotB.image} alt="" draggable={false} style={{ maxWidth: '70%', maxHeight: '70%', objectFit: 'contain' }} /> : slotB.emoji) : '?'}
              </div>
            </div>
          ) : (
            <div style={{ width: 100, height: 100, borderRadius: 16, border: `2px ${upgradeTarget ? RARITY_CONFIG[upgradeTarget.rarity].color : 'rgba(255,255,255,0.1)'} solid`, background: upgradeTarget ? RARITY_CONFIG[upgradeTarget.rarity].bgColor : 'rgba(255,255,255,0.03)', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '2.5rem', boxShadow: upgradeTarget ? RARITY_CONFIG[upgradeTarget.rarity].glow : 'none', animation: phase === 'orbit' ? 'rarity-float 0.6s ease-in-out infinite' : 'none' }}>
              {upgradeTarget ? (upgradeTarget.image ? <img src={upgradeTarget.image} alt="" draggable={false} style={{ maxWidth: '70%', maxHeight: '70%', objectFit: 'contain' }} /> : upgradeTarget.emoji) : '?'}
            </div>
          )}
        </div>
      )}

      {(phase === 'success' || phase === 'failure') && resultItem && (
        <div style={{ position: 'absolute', top: '22%', left: '50%', transform: 'translateX(-50%)', textAlign: 'center', zIndex: 5 }}>
          <div style={{ fontSize: '4rem', animation: 'star-burst 0.6s cubic-bezier(0.34,1.56,0.64,1) forwards' }} className={phase === 'success' ? rarityGlowClass(resultItem.rarity) : ''}>
            {resultItem.image ? <img src={resultItem.image} alt="" draggable={false} style={{ maxWidth: '80px', maxHeight: '80px', objectFit: 'contain' }} /> : resultItem.emoji}
          </div>
          <div style={{ fontFamily: 'Playfair Display, serif', fontSize: '1.05rem', color: phase === 'success' ? '#f0e6ff' : '#9d7fc0', marginTop: 8 }}>
            {phase === 'success' ? resultItem.name : 'Upgrade failed'}
          </div>
          {phase === 'success' && <div style={{ fontSize: '0.62rem', color: RARITY_CONFIG[resultItem.rarity].color, fontWeight: 700, marginTop: 2 }}>{RARITY_CONFIG[resultItem.rarity].label}</div>}
          {phase === 'failure' && <div style={{ color: '#9d7fc0', fontSize: '0.68rem', marginTop: 4 }}>Better luck next time. Your item was returned.</div>}
        </div>
      )}

      {phase === 'select' && (
        <div style={{ position: 'absolute', bottom: 0, left: 0, right: 0, padding: '12px', zIndex: 5 }}>
          <div style={{ display: 'flex', gap: 6, marginBottom: 10, justifyContent: 'center' }}>
            <button onClick={() => setMode('upgrade')} style={{ padding: '5px 14px', borderRadius: 16, border: `1px solid ${mode === 'upgrade' ? '#f0abfc' : 'rgba(255,255,255,0.1)'}`, background: mode === 'upgrade' ? 'rgba(240,171,252,0.12)' : 'transparent', color: mode === 'upgrade' ? '#f0abfc' : '#5b4b7a', fontSize: '0.65rem', fontWeight: 700, cursor: 'pointer' }}>Upgrade</button>
            <button onClick={() => setMode('merge')} style={{ padding: '5px 14px', borderRadius: 16, border: `1px solid ${mode === 'merge' ? '#a855f7' : 'rgba(255,255,255,0.1)'}`, background: mode === 'merge' ? 'rgba(168,85,247,0.12)' : 'transparent', color: mode === 'merge' ? '#c4b5fd' : '#5b4b7a', fontSize: '0.65rem', fontWeight: 700, cursor: 'pointer' }}>Merge</button>
          </div>

          {available.length < (mode === 'merge' ? 2 : 1) ? (
            <div style={{ textAlign: 'center', color: '#5b4b7a', fontSize: '0.78rem', padding: 20 }}>
              {mode === 'merge' ? 'Need at least 2 items. Open cases or visit the market.' : 'Need at least 1 item. Open a case to start collecting.'}
            </div>
          ) : (
            <>
              <div style={{ color: '#9d7fc0', fontSize: '0.62rem', marginBottom: 8, textAlign: 'center' }}>
                {mode === 'merge'
                  ? (slotA ? (slotB ? 'Ready to merge!' : 'Select the second item') : 'Select the first item')
                  : (upgradeTarget ? 'Item selected — choose multiplier above' : 'Select an item to upgrade')}
              </div>
              <div style={{ display: 'flex', gap: 6, overflowX: 'auto', paddingBottom: 8, maxHeight: 90 }}>
                {available.map((item, idx) => {
                  const cfg = RARITY_CONFIG[item.rarity];
                  const isA = slotA?.id === item.id;
                  const isB = slotB?.id === item.id;
                  const isUpgrade = upgradeTarget?.id === item.id;
                  const used = isA || isB || isUpgrade;
                  return (
                    <button key={item.id + idx} onClick={() => {
                      if (mode === 'merge') {
                        if (isA || isB) return;
                        if (!slotA || (slotA && slotB)) { setSlotA(item); if (slotB) setSlotB(null); }
                        else { setSlotB(item); }
                      } else {
                        setUpgradeTarget(isUpgrade ? null : item);
                      }
                    }} disabled={used} style={{ flexShrink: 0, width: 60, height: 70, borderRadius: 10, border: `1.5px solid ${used ? cfg.color : 'rgba(255,255,255,0.08)'}`, background: used ? cfg.bgColor : 'rgba(255,255,255,0.03)', display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', gap: 2, cursor: used ? 'default' : 'pointer', opacity: used ? 0.5 : 1, transition: 'all 0.2s' }}>
                      <span style={{ fontSize: '1.4rem' }} className={used ? rarityGlowClass(item.rarity) : ''}>{item.image ? <img src={item.image} alt="" draggable={false} style={{ maxWidth: 36, maxHeight: 36, objectFit: 'contain' }} /> : item.emoji}</span>
                      <span style={{ fontSize: '0.5rem', color: cfg.color, fontWeight: 600 }}>{cfg.label}</span>
                    </button>
                  );
                })}
              </div>
              <button onClick={startFusion} disabled={mode === 'merge' ? !canStartMerge : !canStartUpgrade} style={{ width: '100%', marginTop: 10, padding: '12px 0', borderRadius: 14, border: 'none', background: (mode === 'merge' ? canStartMerge : canStartUpgrade) ? 'linear-gradient(135deg, #a855f7, #c026d3)' : 'rgba(255,255,255,0.06)', color: (mode === 'merge' ? canStartMerge : canStartUpgrade) ? 'white' : '#5b4b7a', fontWeight: 700, fontSize: '0.85rem', cursor: (mode === 'merge' ? canStartMerge : canStartUpgrade) ? 'pointer' : 'not-allowed', boxShadow: (mode === 'merge' ? canStartMerge : canStartUpgrade) ? '0 4px 20px rgba(168,85,247,0.4)' : 'none' }}>
                {mode === 'merge'
                  ? (canStartMerge ? 'Start merge' : 'Select 2 items')
                  : (canStartUpgrade ? `Upgrade ${MULTIPLIER_CONFIG[multiplier].label} — ${MULTIPLIER_CONFIG[multiplier].cost} 🪙` : 'Select an item')}
              </button>
            </>
          )}
        </div>
      )}

      {(phase === 'success' || phase === 'failure') && (
        <div style={{ position: 'absolute', bottom: 16, left: 12, right: 12, display: 'flex', gap: 10, zIndex: 6 }}>
          <button onClick={reset} style={{ flex: 1, padding: '12px 0', borderRadius: 14, border: '1.5px solid rgba(192,132,252,0.3)', background: 'transparent', color: '#c4b5fd', fontWeight: 600, fontSize: '0.85rem', cursor: 'pointer' }}>Try again</button>
          <button onClick={onBack} style={{ flex: 1, padding: '12px 0', borderRadius: 14, border: 'none', background: 'linear-gradient(135deg, #7c3aed, #4f46e5)', color: 'white', fontWeight: 600, fontSize: '0.85rem', cursor: 'pointer' }}>← Street</button>
        </div>
      )}
    </div>
  );
}
