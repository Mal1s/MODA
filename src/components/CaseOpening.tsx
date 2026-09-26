import { useState, useEffect, useRef, useCallback } from 'react';
import {
  CASES,
  ITEMS,
  RARITY_CONFIG,
  rollItem,
  generateRouletteStrip,
  type ClothingItem,
  type Rarity,
} from '../gameData';

interface CaseOpeningProps {
  coins: number;
  onSpend: (amount: number) => void;
  onItemWon: (item: ClothingItem) => void;
  onClose: () => void;
}

type Phase = 'select' | 'spinning' | 'result' | 'star-reveal';

const ITEM_WIDTH = 100; // px per item cell
const WINNER_OFFSET = 32; // index in strip

export default function CaseOpening({ coins, onSpend, onItemWon, onClose }: CaseOpeningProps) {
  const [selectedCaseId, setSelectedCaseId] = useState('basic');
  const [phase, setPhase] = useState<Phase>('select');
  const [strip, setStrip] = useState<ClothingItem[]>([]);
  const [winner, setWinner] = useState<ClothingItem | null>(null);
  const [stripX, setStripX] = useState(0);
  const [confetti, setConfetti] = useState<{ x: number; y: number; color: string; id: number }[]>([]);
  const [flashOpacity, setFlashOpacity] = useState(0);
  const stripRef = useRef<HTMLDivElement>(null);
  const animRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  const selectedCase = CASES.find(c => c.id === selectedCaseId)!;

  const spawnConfetti = useCallback(() => {
    const pieces = [...Array(40)].map((_, i) => ({
      x: Math.random() * 100,
      y: -10,
      color: ['#f0abfc', '#fbbf24', '#93c5fd', '#a855f7', '#f97316'][i % 5],
      id: Date.now() + i,
    }));
    setConfetti(pieces);
    setTimeout(() => setConfetti([]), 3000);
  }, []);

  const openCase = useCallback(() => {
    if (selectedCase.premium) return; // premium handled separately
    if (coins < selectedCase.cost) return;

    onSpend(selectedCase.cost);
    const won = rollItem(selectedCase.maxRarity);
    const newStrip = generateRouletteStrip(won);
    setStrip(newStrip);
    setWinner(won);

    // Reset strip position to start
    setStripX(0);
    setPhase('spinning');

    // Target: winner is at index WINNER_OFFSET, center it
    // Container width ~360px, so center = 180px. winner left = WINNER_OFFSET * ITEM_WIDTH
    // We want winner center at container center
    const containerWidth = Math.min(window.innerWidth, 430);
    const targetX = -(WINNER_OFFSET * ITEM_WIDTH - containerWidth / 2 + ITEM_WIDTH / 2);

    // Animate with a two-phase timing: fast then slow
    const duration = 3500;
    const start = performance.now();
    let rafId: number;

    const animate = (now: number) => {
      const elapsed = now - start;
      const t = Math.min(elapsed / duration, 1);
      // Deceleration curve: fast out slow in
      const eased = 1 - Math.pow(1 - t, 3);
      const jitter = t > 0.85 && t < 0.98 ? Math.sin(elapsed * 0.05) * (1 - t) * 3 : 0;
      setStripX(targetX * eased + jitter);

      if (t < 1) {
        rafId = requestAnimationFrame(animate);
      } else {
        setStripX(targetX);
        if (won.rarity === 'star') {
          setPhase('star-reveal');
          spawnConfetti();
          // Flash effect
          setFlashOpacity(0);
          setTimeout(() => setFlashOpacity(1), 300);
          setTimeout(() => setFlashOpacity(0), 600);
          setTimeout(() => setFlashOpacity(0.7), 800);
          setTimeout(() => setFlashOpacity(0), 1100);
        } else {
          setPhase('result');
          if (won.rarity === 'legendary') spawnConfetti();
        }
        onItemWon(won);
      }
    };

    rafId = requestAnimationFrame(animate);
    return () => cancelAnimationFrame(rafId);
  }, [selectedCase, coins, onSpend, onItemWon, spawnConfetti]);

  const reset = () => {
    setPhase('select');
    setWinner(null);
    setStrip([]);
    setStripX(0);
  };

  const rarityGlowClass = (r: Rarity) => {
    if (r === 'star') return 'glow-star';
    if (r === 'legendary') return 'glow-legendary';
    if (r === 'mythic') return 'glow-mythic';
    if (r === 'rare') return 'glow-rare';
    return '';
  };

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
      {/* Ambient background blobs */}
      <div style={{ position: 'absolute', inset: 0, pointerEvents: 'none', overflow: 'hidden' }}>
        <div style={{
          position: 'absolute', top: '-20%', left: '-10%',
          width: '60%', height: '60%',
          background: 'radial-gradient(circle, rgba(168,85,247,0.12) 0%, transparent 70%)',
          borderRadius: '50%',
        }} />
        <div style={{
          position: 'absolute', bottom: '-20%', right: '-10%',
          width: '70%', height: '60%',
          background: 'radial-gradient(circle, rgba(59,130,246,0.08) 0%, transparent 70%)',
          borderRadius: '50%',
        }} />
      </div>

      {/* Confetti */}
      {confetti.map(c => (
        <div key={c.id} style={{
          position: 'fixed',
          left: `${c.x}%`,
          top: `${c.y}%`,
          width: 8,
          height: 8,
          background: c.color,
          borderRadius: 2,
          animation: 'confetti-fall 2.5s ease-in forwards',
          pointerEvents: 'none',
          zIndex: 999,
        }} />
      ))}

      {/* Star flash */}
      {flashOpacity > 0 && (
        <div style={{
          position: 'fixed',
          inset: 0,
          background: 'white',
          opacity: flashOpacity,
          pointerEvents: 'none',
          zIndex: 998,
          transition: 'opacity 0.3s',
        }} />
      )}

      {/* ── Header ── */}
      <div style={{
        padding: '14px 16px 8px',
        display: 'flex',
        alignItems: 'center',
        gap: 12,
        background: 'linear-gradient(180deg, rgba(10,6,24,0.9) 0%, transparent 100%)',
        zIndex: 10,
        flexShrink: 0,
      }}>
        <button onClick={phase === 'select' ? onClose : reset} style={{
          background: 'rgba(255,255,255,0.05)',
          border: '1px solid rgba(192,132,252,0.2)',
          borderRadius: '50%',
          width: 36,
          height: 36,
          color: '#c4b5fd',
          fontSize: '1rem',
          cursor: 'pointer',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          flexShrink: 0,
        }}>
          ←
        </button>
        <div>
          <h2 style={{ margin: 0, fontFamily: 'Playfair Display, serif', fontSize: '1.1rem', color: '#f0abfc' }}>
            Модный шкаф
          </h2>
          <div style={{ display: 'flex', alignItems: 'center', gap: 5, marginTop: 1 }}>
            <span style={{ color: '#fbbf24', fontSize: '0.75rem' }}>🪙</span>
            <span style={{ color: '#fbbf24', fontSize: '0.75rem', fontWeight: 600 }}>{coins.toLocaleString()}</span>
          </div>
        </div>
      </div>

      {/* ── Phase: SELECT ── */}
      {phase === 'select' && (
        <div style={{ flex: 1, overflow: 'auto', padding: '8px 16px 24px' }}>
          <p style={{ color: '#9d7fc0', fontSize: '0.75rem', textAlign: 'center', marginBottom: 16, letterSpacing: '0.05em' }}>
            Выберите шкаф для открытия
          </p>

          <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
            {CASES.map(c => {
              const isSelected = selectedCaseId === c.id;
              const canAfford = c.premium || coins >= c.cost;
              return (
                <div
                  key={c.id}
                  onClick={() => setSelectedCaseId(c.id)}
                  style={{
                    background: isSelected
                      ? 'linear-gradient(135deg, rgba(168,85,247,0.2), rgba(109,40,217,0.15))'
                      : 'rgba(255,255,255,0.03)',
                    border: `1.5px solid ${isSelected ? c.glowColor : 'rgba(255,255,255,0.07)'}`,
                    borderRadius: 14,
                    padding: '12px 14px',
                    cursor: 'pointer',
                    transition: 'all 0.2s',
                    boxShadow: isSelected ? `0 0 20px ${c.glowColor}40` : 'none',
                    display: 'flex',
                    alignItems: 'center',
                    gap: 12,
                    opacity: canAfford ? 1 : 0.55,
                  }}
                >
                  <div style={{
                    fontSize: '1.8rem',
                    filter: c.premium ? 'drop-shadow(0 0 8px #f0abfc)' : isSelected ? `drop-shadow(0 0 6px ${c.glowColor})` : 'none',
                    flexShrink: 0,
                  }}>
                    {c.emoji}
                  </div>
                  <div style={{ flex: 1, minWidth: 0 }}>
                    <div style={{
                      fontFamily: 'Playfair Display, serif',
                      fontWeight: 700,
                      fontSize: '0.95rem',
                      color: c.premium ? '#f0abfc' : '#e2d9f3',
                      marginBottom: 2,
                    }}>
                      {c.name}
                      {c.premium && <span style={{ marginLeft: 6, fontSize: '0.6rem', color: '#f0abfc', background: 'rgba(240,171,252,0.1)', padding: '1px 6px', borderRadius: 10, border: '1px solid rgba(240,171,252,0.3)' }}>ПРЕМИУМ</span>}
                    </div>
                    <div style={{ color: '#9d7fc0', fontSize: '0.7rem' }}>{c.description}</div>
                  </div>
                  <div style={{ flexShrink: 0, textAlign: 'right' }}>
                    {c.premium ? (
                      <div style={{ color: '#f0abfc', fontSize: '0.8rem', fontWeight: 700 }}>💳</div>
                    ) : (
                      <div style={{
                        color: canAfford ? '#fbbf24' : '#f87171',
                        fontSize: '0.85rem',
                        fontWeight: 700,
                      }}>
                        🪙 {c.cost.toLocaleString()}
                      </div>
                    )}
                  </div>
                </div>
              );
            })}
          </div>

          {/* Open button */}
          <button
            onClick={openCase}
            disabled={selectedCase.premium || coins < selectedCase.cost}
            style={{
              width: '100%',
              marginTop: 20,
              padding: '14px 0',
              borderRadius: 16,
              border: 'none',
              background: selectedCase.premium || coins < selectedCase.cost
                ? 'rgba(255,255,255,0.06)'
                : `linear-gradient(135deg, ${selectedCase.glowColor}, ${selectedCase.glowColor}99)`,
              color: selectedCase.premium || coins < selectedCase.cost ? '#5b4b7a' : 'white',
              fontFamily: 'Playfair Display, serif',
              fontSize: '1.05rem',
              fontWeight: 700,
              cursor: selectedCase.premium || coins < selectedCase.cost ? 'not-allowed' : 'pointer',
              letterSpacing: '0.05em',
              boxShadow: selectedCase.premium || coins < selectedCase.cost
                ? 'none'
                : `0 4px 20px ${selectedCase.glowColor}60`,
              transition: 'all 0.2s',
            }}
          >
            {selectedCase.premium ? '💳 Купить премиум' : coins < selectedCase.cost ? `Нужно ещё ${(selectedCase.cost - coins).toLocaleString()} 🪙` : '✨ Открыть шкаф'}
          </button>

          {/* Rarity legend */}
          <div style={{ marginTop: 16, padding: '10px 12px', background: 'rgba(255,255,255,0.03)', borderRadius: 10, border: '1px solid rgba(255,255,255,0.05)' }}>
            <div style={{ color: '#5b4b7a', fontSize: '0.62rem', textTransform: 'uppercase', letterSpacing: '0.1em', marginBottom: 8 }}>Шансы редкости</div>
            <div style={{ display: 'flex', justifyContent: 'space-between' }}>
              {(['common', 'rare', 'mythic', 'legendary', 'star'] as Rarity[]).map(r => {
                const cfg = RARITY_CONFIG[r];
                const chance = Math.round(cfg.chance * 100);
                return (
                  <div key={r} style={{ textAlign: 'center' }}>
                    <div style={{ color: cfg.color, fontSize: '0.65rem', fontWeight: 600 }}>{cfg.label}</div>
                    <div style={{ color: '#5b4b7a', fontSize: '0.6rem' }}>{chance}%</div>
                  </div>
                );
              })}
            </div>
          </div>
        </div>
      )}

      {/* ── Phase: SPINNING ── */}
      {(phase === 'spinning' || phase === 'result') && (
        <div style={{ flex: 1, display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', padding: 16 }}>
          <div style={{ color: '#9d7fc0', fontSize: '0.75rem', letterSpacing: '0.1em', marginBottom: 16, textTransform: 'uppercase' }}>
            {phase === 'spinning' ? '✦ Открываем шкаф...' : '✦ Вы получили'}
          </div>

          {/* Roulette container */}
          <div style={{
            width: '100%',
            maxWidth: 400,
            position: 'relative',
            overflow: 'hidden',
            borderRadius: 12,
            border: '1.5px solid rgba(192,132,252,0.3)',
            background: 'rgba(19,13,42,0.7)',
            height: 130,
            flexShrink: 0,
          }}>
            {/* Center indicator */}
            <div style={{
              position: 'absolute',
              top: 0,
              bottom: 0,
              left: '50%',
              transform: 'translateX(-50%)',
              width: ITEM_WIDTH,
              border: '2px solid rgba(192,132,252,0.6)',
              borderRadius: 8,
              background: 'rgba(192,132,252,0.05)',
              zIndex: 3,
              pointerEvents: 'none',
            }}>
              {/* Top / bottom arrows */}
              <div style={{ position: 'absolute', top: -8, left: '50%', transform: 'translateX(-50%)', color: '#c084fc', fontSize: 12 }}>▼</div>
              <div style={{ position: 'absolute', bottom: -8, left: '50%', transform: 'translateX(-50%)', color: '#c084fc', fontSize: 12 }}>▲</div>
            </div>

            {/* Fade edges */}
            <div style={{ position: 'absolute', top: 0, left: 0, bottom: 0, width: 60, background: 'linear-gradient(90deg, rgba(10,6,24,1) 0%, transparent 100%)', zIndex: 2, pointerEvents: 'none' }} />
            <div style={{ position: 'absolute', top: 0, right: 0, bottom: 0, width: 60, background: 'linear-gradient(-90deg, rgba(10,6,24,1) 0%, transparent 100%)', zIndex: 2, pointerEvents: 'none' }} />

            {/* Scrolling strip */}
            <div
              ref={stripRef}
              style={{
                display: 'flex',
                alignItems: 'center',
                height: '100%',
                transform: `translateX(${stripX}px)`,
                willChange: 'transform',
              }}
            >
              {strip.map((item, i) => {
                const cfg = RARITY_CONFIG[item.rarity];
                const isWinner = i === WINNER_OFFSET && phase === 'result';
                return (
                  <div
                    key={i}
                    style={{
                      width: ITEM_WIDTH,
                      height: 110,
                      flexShrink: 0,
                      display: 'flex',
                      flexDirection: 'column',
                      alignItems: 'center',
                      justifyContent: 'center',
                      background: isWinner ? cfg.bgColor : 'rgba(255,255,255,0.02)',
                      borderRight: '1px solid rgba(255,255,255,0.04)',
                      gap: 4,
                      transition: isWinner ? 'background 0.5s' : 'none',
                    }}
                  >
                    <div
                      className={isWinner ? rarityGlowClass(item.rarity) : ''}
                      style={{ fontSize: '1.8rem', display: 'flex', alignItems: 'center', justifyContent: 'center' }}
                    >
                      {item.image
                        ? <img src={item.image} alt={item.name} style={{ maxWidth: '70%', maxHeight: '70%', objectFit: 'contain' }} />
                        : item.emoji}
                    </div>
                    <div style={{
                      fontSize: '0.6rem',
                      color: cfg.color,
                      fontWeight: 600,
                      textAlign: 'center',
                      lineHeight: 1.2,
                      maxWidth: 85,
                      overflow: 'hidden',
                      whiteSpace: 'nowrap',
                      textOverflow: 'ellipsis',
                    }}>
                      {item.name}
                    </div>
                    <div style={{
                      fontSize: '0.55rem',
                      color: cfg.color,
                      opacity: 0.7,
                    }}>
                      {cfg.label}
                    </div>
                  </div>
                );
              })}
            </div>
          </div>

          {/* Result card */}
          {phase === 'result' && winner && (
            <div style={{
              marginTop: 20,
              width: '100%',
              maxWidth: 400,
              background: `linear-gradient(160deg, ${RARITY_CONFIG[winner.rarity].bgColor}, rgba(19,13,42,0.8))`,
              border: `1.5px solid ${RARITY_CONFIG[winner.rarity].color}60`,
              borderRadius: 16,
              padding: '16px 20px',
              display: 'flex',
              alignItems: 'center',
              gap: 14,
              boxShadow: winner.rarity !== 'common' ? RARITY_CONFIG[winner.rarity].glow : 'none',
              animation: 'scene-in 0.4s ease-out',
            }}>
              <div
                className={rarityGlowClass(winner.rarity)}
                style={{ fontSize: '2.5rem', flexShrink: 0, display: 'flex', alignItems: 'center', justifyContent: 'center' }}
              >
                {winner.image
                  ? <img src={winner.image} alt={winner.name} style={{ maxWidth: '70%', maxHeight: '70%', objectFit: 'contain' }} />
                  : winner.emoji}
              </div>
              <div style={{ flex: 1, minWidth: 0 }}>
                <div style={{
                  fontFamily: 'Playfair Display, serif',
                  fontSize: '1rem',
                  fontWeight: 700,
                  color: '#f0e6ff',
                  marginBottom: 3,
                }}>
                  {winner.name}
                </div>
                <div style={{ display: 'flex', alignItems: 'center', flexWrap: 'wrap', gap: 6 }}>
                  <span style={{
                    background: RARITY_CONFIG[winner.rarity].bgColor,
                    border: `1px solid ${RARITY_CONFIG[winner.rarity].color}60`,
                    color: RARITY_CONFIG[winner.rarity].color,
                    fontSize: '0.6rem',
                    fontWeight: 700,
                    padding: '2px 8px',
                    borderRadius: 10,
                    letterSpacing: '0.05em',
                  }}>
                    {RARITY_CONFIG[winner.rarity].label}
                  </span>
                  <span style={{ color: '#fbbf24', fontSize: '0.7rem' }}>🪙 {winner.value.toLocaleString()}</span>
                </div>
                <div style={{ color: '#9d7fc0', fontSize: '0.65rem', marginTop: 3 }}>{winner.description}</div>
              </div>
            </div>
          )}

          {/* Buttons */}
          {phase === 'result' && winner && (
            <div style={{ display: 'flex', gap: 10, marginTop: 14, width: '100%', maxWidth: 400 }}>
              <button
                onClick={reset}
                style={{
                  flex: 1,
                  padding: '12px 0',
                  borderRadius: 14,
                  border: '1.5px solid rgba(192,132,252,0.3)',
                  background: 'transparent',
                  color: '#c4b5fd',
                  fontFamily: 'Poppins, sans-serif',
                  fontSize: '0.85rem',
                  fontWeight: 600,
                  cursor: 'pointer',
                }}
              >
                Открыть ещё
              </button>
              <button
                onClick={onClose}
                style={{
                  flex: 1,
                  padding: '12px 0',
                  borderRadius: 14,
                  border: 'none',
                  background: 'linear-gradient(135deg, #7c3aed, #4f46e5)',
                  color: 'white',
                  fontFamily: 'Poppins, sans-serif',
                  fontSize: '0.85rem',
                  fontWeight: 600,
                  cursor: 'pointer',
                  boxShadow: '0 4px 16px rgba(124,58,237,0.4)',
                }}
              >
                ← В комнату
              </button>
            </div>
          )}
        </div>
      )}

      {/* ── Phase: STAR REVEAL ── */}
      {phase === 'star-reveal' && winner && (
        <div style={{
          flex: 1,
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          justifyContent: 'center',
          animation: 'star-reveal-bg 0.5s ease-out',
          position: 'relative',
          overflow: 'hidden',
        }}>
          {/* Radial glow bg */}
          <div style={{
            position: 'absolute',
            inset: 0,
            background: 'radial-gradient(circle at 50% 45%, rgba(240,171,252,0.3) 0%, rgba(168,85,247,0.15) 40%, transparent 70%)',
            pointerEvents: 'none',
          }} />

          {/* Star rays */}
          {[...Array(8)].map((_, i) => (
            <div key={i} style={{
              position: 'absolute',
              top: '42%',
              left: '50%',
              width: 3,
              height: '35%',
              background: 'linear-gradient(0deg, transparent, rgba(240,171,252,0.6))',
              transformOrigin: '50% 100%',
              transform: `translateX(-50%) rotate(${i * 45}deg)`,
              pointerEvents: 'none',
            }} />
          ))}

          <div style={{
            textAlign: 'center',
            color: '#f5d0fe',
            fontSize: '0.75rem',
            letterSpacing: '0.25em',
            textTransform: 'uppercase',
            marginBottom: 12,
            zIndex: 1,
          }}>
            ✦ ✦ ✦  НЕВЕРОЯТНО!  ✦ ✦ ✦
          </div>

          <div
            className="glow-star"
            style={{
              fontSize: '5rem',
              animation: 'star-burst 0.6s cubic-bezier(0.34,1.56,0.64,1) forwards, star-cycle 2s linear infinite 0.6s',
              zIndex: 1,
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
            }}
          >
            {winner.image
              ? <img src={winner.image} alt={winner.name} style={{ maxWidth: '70%', maxHeight: '70%', objectFit: 'contain' }} />
              : winner.emoji}
          </div>

          <div style={{
            fontFamily: 'Playfair Display, serif',
            fontSize: '1.4rem',
            fontWeight: 900,
            marginTop: 14,
            background: 'linear-gradient(135deg, #f0abfc, #fbbf24, #93c5fd, #f0abfc)',
            backgroundSize: '300%',
            WebkitBackgroundClip: 'text',
            backgroundClip: 'text',
            WebkitTextFillColor: 'transparent',
            zIndex: 1,
            textAlign: 'center',
            animation: 'roulette-run 3s linear infinite',
          }}>
            {winner.name}
          </div>

          <div style={{
            display: 'inline-flex',
            alignItems: 'center',
            gap: 6,
            marginTop: 8,
            padding: '4px 14px',
            background: 'rgba(240,171,252,0.1)',
            border: '1px solid rgba(240,171,252,0.4)',
            borderRadius: 20,
            zIndex: 1,
          }}>
            <span style={{ color: '#f5d0fe', fontSize: '0.7rem', fontWeight: 700, letterSpacing: '0.1em' }}>✦ STAR</span>
            <span style={{ color: '#fbbf24', fontSize: '0.7rem' }}>🪙 {winner.value.toLocaleString()}</span>
          </div>

          <div style={{ display: 'flex', gap: 10, marginTop: 24, zIndex: 1 }}>
            <button onClick={reset} style={{
              padding: '12px 20px',
              borderRadius: 14,
              border: '1.5px solid rgba(240,171,252,0.4)',
              background: 'transparent',
              color: '#f5d0fe',
              fontSize: '0.85rem',
              fontWeight: 600,
              cursor: 'pointer',
              fontFamily: 'Poppins, sans-serif',
            }}>Открыть ещё</button>
            <button onClick={onClose} style={{
              padding: '12px 20px',
              borderRadius: 14,
              border: 'none',
              background: 'linear-gradient(135deg, #c026d3, #7c3aed)',
              color: 'white',
              fontSize: '0.85rem',
              fontWeight: 600,
              cursor: 'pointer',
              fontFamily: 'Poppins, sans-serif',
              boxShadow: '0 4px 20px rgba(192,38,211,0.5)',
            }}>← В комнату</button>
          </div>
        </div>
      )}
    </div>
  );
}

