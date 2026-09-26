import { useState, useEffect, useRef, useCallback } from 'react';
import Character from './Character';
import { ClothingItem, RARITY_CONFIG } from '../gameData';

type CharTarget = 'idle' | 'wardrobe' | 'door' | 'closet';

interface RoomSceneProps {
  gender: 'female' | 'male';
  coins: number;
  energy: number;
  maxEnergy: number;
  inventory: ClothingItem[];
  onCoinClick: (e: React.MouseEvent) => void;
  onWardrobeReached: () => void;
  onDoorReached: () => void;
  onClosetClick: () => void;
}

export default function RoomScene({
  gender,
  coins,
  energy,
  maxEnergy,
  inventory,
  onCoinClick,
  onWardrobeReached,
  onDoorReached,
  onClosetClick,
}: RoomSceneProps) {
  const [charTarget, setCharTarget] = useState<CharTarget>('idle');
  const [charX, setCharX] = useState(42); // % from left
  const [walking, setWalking] = useState(false);
  const [facing, setFacing] = useState<'left' | 'right' | 'forward'>('forward');
  const [clickBounce, setClickBounce] = useState(false);
  const [tooltip, setTooltip] = useState<string | null>(null);
  const [wardrobePulse, setWardrobePulse] = useState(false);
  const timerRef = useRef<ReturnType<typeof setTimeout> | null>(null);
  const energyPct = Math.round((energy / maxEnergy) * 100);

  useEffect(() => {
    const id = setInterval(() => setWardrobePulse(p => !p), 2000);
    return () => clearInterval(id);
  }, []);

  const walkTo = useCallback((target: CharTarget, destX: number, dir: 'left' | 'right', delay: number, cb: () => void) => {
    if (charTarget !== 'idle') return;
    setFacing(dir);
    setWalking(true);
    setCharTarget(target);
    setCharX(destX);
    if (timerRef.current) clearTimeout(timerRef.current);
    timerRef.current = setTimeout(() => {
      setWalking(false);
      setFacing('forward');
      setCharTarget('idle');
      cb();
      // Walk back to center
      setTimeout(() => {
        setFacing('left');
        setWalking(true);
        setCharX(42);
        setTimeout(() => {
          setWalking(false);
          setFacing('forward');
        }, 700);
      }, 200);
    }, delay);
  }, [charTarget]);

  const handleWardrobeClick = () => {
    if (charTarget !== 'idle') return;
    setTooltip(null);
    walkTo('wardrobe', 76, 'right', 900, onWardrobeReached);
  };

  const handleDoorClick = () => {
    if (charTarget !== 'idle') return;
    setTooltip(null);
    walkTo('door', 10, 'left', 800, onDoorReached);
  };

  const handleClickCoin = (e: React.MouseEvent) => {
    if (energy <= 0) return;
    setClickBounce(true);
    setTimeout(() => setClickBounce(false), 300);
    onCoinClick(e);
  };

  const equippedItems = inventory.slice(-3);

  return (
    <div
      className="scene-enter"
      style={{
        width: '100%',
        height: '100%',
        position: 'relative',
        overflow: 'hidden',
        background: '#0a0618',
        fontFamily: 'Poppins, sans-serif',
      }}
    >
      {/* ── Room back wall ── */}
      <div style={{
        position: 'absolute',
        top: 0,
        left: 0,
        right: 0,
        height: '62%',
        background: 'linear-gradient(180deg, #1a0f3a 0%, #231447 70%, #2a1955 100%)',
      }}>
        {/* Wallpaper subtle pattern */}
        <div style={{
          position: 'absolute',
          inset: 0,
          backgroundImage: 'repeating-linear-gradient(0deg, transparent, transparent 40px, rgba(192,132,252,0.04) 40px, rgba(192,132,252,0.04) 41px), repeating-linear-gradient(90deg, transparent, transparent 40px, rgba(192,132,252,0.04) 40px, rgba(192,132,252,0.04) 41px)',
        }} />
      </div>

      {/* ── Floor ── */}
      <div style={{
        position: 'absolute',
        bottom: 0,
        left: 0,
        right: 0,
        height: '41%',
        background: 'linear-gradient(180deg, #3d2410 0%, #2a1908 100%)',
        borderTop: '2px solid rgba(192,132,252,0.2)',
      }}>
        {/* Floor planks */}
        {[...Array(8)].map((_, i) => (
          <div key={i} style={{
            position: 'absolute',
            left: `${(i * 12.5)}%`,
            top: 0,
            bottom: 0,
            width: '11.5%',
            borderRight: '1px solid rgba(0,0,0,0.3)',
            background: i % 2 === 0
              ? 'linear-gradient(90deg, rgba(255,220,160,0.04) 0%, transparent 100%)'
              : 'transparent',
          }} />
        ))}
        {/* Floor shine */}
        <div style={{
          position: 'absolute',
          top: 0,
          left: 0,
          right: 0,
          height: 3,
          background: 'linear-gradient(90deg, transparent, rgba(192,132,252,0.15), rgba(255,220,160,0.1), transparent)',
        }} />
      </div>

      {/* ── Window (left side) ── */}
      <div style={{ position: 'absolute', top: '8%', left: '4%', width: '14%', maxWidth: 90 }}>
        <div style={{
          background: 'linear-gradient(160deg, #93c5fd 0%, #dbeafe 40%, #bfdbfe 100%)',
          borderRadius: 4,
          border: '3px solid #4b3080',
          boxShadow: '0 0 25px rgba(147,197,253,0.4), inset 0 0 10px rgba(255,255,255,0.1)',
          position: 'relative',
          aspectRatio: '1 / 1.3',
          overflow: 'hidden',
        }}>
          {/* Window pane cross */}
          <div style={{ position: 'absolute', inset: 0, display: 'grid', gridTemplateColumns: '1fr 1fr', gridTemplateRows: '1fr 1fr', gap: 2 }}>
            {[...Array(4)].map((_, i) => (
              <div key={i} style={{ background: 'rgba(147,197,253,0.2)', border: '1px solid rgba(255,255,255,0.3)' }} />
            ))}
          </div>
          {/* Light beam from window */}
          <div style={{
            position: 'absolute',
            top: '100%',
            left: '20%',
            width: '60%',
            height: 200,
            background: 'linear-gradient(180deg, rgba(147,197,253,0.15) 0%, transparent 100%)',
            pointerEvents: 'none',
          }} />
        </div>
        <div style={{ height: 8, background: '#2a1955', marginTop: 2 }} />
      </div>

      {/* ── Wardrobe (right side) ── */}
      <div
        onClick={handleWardrobeClick}
        onMouseEnter={() => setTooltip('Open Wardrobe')}
        onMouseLeave={() => setTooltip(null)}
        style={{
          position: 'absolute',
          top: '5%',
          right: '3%',
          width: '22%',
          maxWidth: 140,
          cursor: charTarget === 'idle' ? 'pointer' : 'default',
          transition: 'transform 0.2s',
          transform: tooltip === 'Open Wardrobe' ? 'scale(1.03)' : 'scale(1)',
          zIndex: 2,
        }}
      >
        {/* Wardrobe body */}
        <div style={{
          background: 'linear-gradient(160deg, #2d1a5e 0%, #1e1040 100%)',
          borderRadius: '8px 8px 4px 4px',
          border: '2px solid rgba(192,132,252,0.5)',
          boxShadow: wardrobePulse
            ? '0 0 30px rgba(168,85,247,0.6), inset 0 0 20px rgba(168,85,247,0.15)'
            : '0 0 15px rgba(168,85,247,0.3), inset 0 0 10px rgba(168,85,247,0.05)',
          transition: 'box-shadow 1s ease',
          position: 'relative',
          padding: '8px 6px',
          aspectRatio: '0.65 / 1',
          display: 'flex',
          flexDirection: 'column',
          gap: 4,
        }}>
          {/* Wardrobe top ornament */}
          <div style={{
            position: 'absolute',
            top: -8,
            left: '50%',
            transform: 'translateX(-50%)',
            width: '80%',
            height: 8,
            background: 'linear-gradient(90deg, #4b3080, #7c3aed, #4b3080)',
            borderRadius: 2,
          }} />

          {/* Left door */}
          <div style={{
            background: 'linear-gradient(160deg, rgba(147,51,234,0.2) 0%, rgba(109,40,217,0.1) 100%)',
            border: '1px solid rgba(192,132,252,0.4)',
            borderRadius: 4,
            flex: 1,
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            fontSize: '1.2rem',
            flexDirection: 'column',
            gap: 4,
          }}>
            <div style={{ fontSize: '0.7rem', opacity: 0.6 }}>{'👗'}</div>
            <div style={{ fontSize: '0.6rem', opacity: 0.5 }}>{'✨'}</div>
          </div>

          {/* Divider + handle */}
          <div style={{
            height: 2,
            background: 'rgba(192,132,252,0.3)',
            position: 'relative',
          }}>
            <div style={{
              position: 'absolute',
              left: '50%',
              top: '50%',
              transform: 'translate(-50%, -50%)',
              width: 8,
              height: 8,
              background: '#fbbf24',
              borderRadius: '50%',
              boxShadow: '0 0 6px #fbbf24',
            }} />
          </div>

          {/* Right door */}
          <div style={{
            background: 'linear-gradient(160deg, rgba(147,51,234,0.2) 0%, rgba(109,40,217,0.1) 100%)',
            border: '1px solid rgba(192,132,252,0.4)',
            borderRadius: 4,
            flex: 1,
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            fontSize: '1.2rem',
            flexDirection: 'column',
            gap: 4,
          }}>
            <div style={{ fontSize: '0.7rem', opacity: 0.6 }}>{'👠'}</div>
            <div style={{ fontSize: '0.6rem', opacity: 0.5 }}>{'💎'}</div>
          </div>

          {/* Glow rays from wardrobe */}
          <div style={{
            position: 'absolute',
            bottom: '100%',
            left: '50%',
            transform: 'translateX(-50%)',
            width: 4,
            height: 30,
            background: 'linear-gradient(0deg, rgba(168,85,247,0.6), transparent)',
            pointerEvents: 'none',
          }} />
        </div>

        {/* Wardrobe feet */}
        <div style={{ display: 'flex', justifyContent: 'space-around', padding: '0 8px' }}>
          {[0, 1].map(i => (
            <div key={i} style={{ width: 8, height: 6, background: '#4b3080', borderRadius: '0 0 3px 3px' }} />
          ))}
        </div>

        {/* Label */}
        <div style={{
          textAlign: 'center',
          color: '#c4b5fd',
          fontSize: '0.6rem',
          letterSpacing: '0.1em',
          marginTop: 2,
          textTransform: 'uppercase',
          opacity: 0.8,
        }}>
          Wardrobe
        </div>
      </div>

      {/* ── Mirror (center-left wall) ── */}
      <div style={{
        position: 'absolute',
        top: '10%',
        left: '21%',
        width: '12%',
        maxWidth: 75,
      }}>
        <div style={{
          background: 'linear-gradient(160deg, rgba(147,197,253,0.15) 0%, rgba(196,181,253,0.1) 100%)',
          border: '3px solid #6d4fc0',
          borderRadius: '50% 50% 30% 30% / 40% 40% 20% 20%',
          aspectRatio: '0.6 / 1',
          boxShadow: '0 0 15px rgba(147,197,253,0.2)',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          fontSize: '1.5rem',
        }}>
          ✨
        </div>
        <div style={{ width: 8, height: 16, background: '#4b3080', margin: '0 auto', borderRadius: '0 0 4px 4px' }} />
        <div style={{ width: 22, height: 5, background: '#4b3080', margin: '0 auto', borderRadius: 2 }} />
      </div>

      {/* ── Bed (far left corner) ── */}
      <div style={{
        position: 'absolute',
        bottom: '38%',
        left: '-2%',
        width: '22%',
        maxWidth: 130,
      }}>
        {/* Headboard */}
        <div style={{
          background: 'linear-gradient(180deg, #3d2a70 0%, #2d1a55 100%)',
          height: 40,
          borderRadius: '8px 8px 0 0',
          border: '2px solid rgba(192,132,252,0.3)',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          gap: 6,
        }}>
          {[...Array(3)].map((_, i) => (
            <div key={i} style={{ width: 8, height: 20, background: 'rgba(192,132,252,0.3)', borderRadius: 4 }} />
          ))}
        </div>
        {/* Mattress */}
        <div style={{
          background: 'linear-gradient(180deg, #c084fc 0%, #9333ea 100%)',
          height: 20,
          borderRadius: '0 0 4px 4px',
          border: '1px solid rgba(192,132,252,0.4)',
        }}>
          <div style={{ height: 8, background: 'rgba(255,255,255,0.1)', margin: '4px 6px', borderRadius: 2 }} />
        </div>
      </div>

      {/* ── Small table (right corner) ── */}
      <div style={{
        position: 'absolute',
        bottom: '38%',
        right: '26%',
        width: '10%',
        maxWidth: 60,
      }}>
        <div style={{
          background: '#2d1a55',
          height: 22,
          borderRadius: 4,
          border: '1px solid rgba(192,132,252,0.3)',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          fontSize: '0.7rem',
        }}>
          🕯️
        </div>
        <div style={{ display: 'flex', justifyContent: 'space-around' }}>
          {[0, 1].map(i => <div key={i} style={{ width: 4, height: 14, background: '#1e1040' }} />)}
        </div>
      </div>

      {/* ── Door (left side, bottom) ── */}
      <div
        onClick={handleDoorClick}
        onMouseEnter={() => setTooltip('Go Outside')}
        onMouseLeave={() => setTooltip(null)}
        style={{
          position: 'absolute',
          bottom: '37%',
          left: '2%',
          width: '14%',
          maxWidth: 88,
          cursor: charTarget === 'idle' ? 'pointer' : 'default',
          transition: 'transform 0.2s',
          transform: tooltip === 'Go Outside' ? 'scale(1.03)' : 'scale(1)',
          zIndex: 2,
        }}
      >
        <div style={{
          background: 'linear-gradient(160deg, #2d1a55 0%, #1e1040 100%)',
          borderRadius: '6px 6px 0 0',
          border: '2px solid rgba(192,132,252,0.35)',
          boxShadow: tooltip === 'Go Outside' ? '0 0 20px rgba(147,197,253,0.3)' : '0 0 8px rgba(0,0,0,0.3)',
          transition: 'box-shadow 0.3s',
          padding: 4,
          display: 'flex',
          flexDirection: 'column',
          gap: 3,
          aspectRatio: '0.55 / 1',
        }}>
          {/* Window panels */}
          {[0, 1].map(i => (
            <div key={i} style={{
              flex: 1,
              background: tooltip === 'Go Outside'
                ? 'linear-gradient(160deg, rgba(147,197,253,0.25), rgba(147,197,253,0.1))'
                : 'rgba(255,255,255,0.04)',
              borderRadius: 2,
              border: '1px solid rgba(192,132,252,0.2)',
              transition: 'background 0.3s',
            }} />
          ))}
          {/* Knob */}
          <div style={{
            position: 'absolute',
            right: 6,
            top: '50%',
            width: 6,
            height: 6,
            background: '#fbbf24',
            borderRadius: '50%',
            boxShadow: '0 0 4px #f59e0b',
          }} />
        </div>
        <div style={{ textAlign: 'center', color: '#93c5fd', fontSize: '0.55rem', marginTop: 2, letterSpacing: '0.1em', textTransform: 'uppercase' }}>
          Outside
        </div>
      </div>

      {/* ── Rug ── */}
      <div style={{
        position: 'absolute',
        bottom: '39%',
        left: '25%',
        right: '26%',
        height: 12,
        background: 'radial-gradient(ellipse at center, rgba(168,85,247,0.3) 0%, rgba(109,40,217,0.1) 60%, transparent 100%)',
        borderRadius: '50%',
      }} />

      {/* ── Character ── */}
      <div style={{
        position: 'absolute',
        bottom: '38%',
        left: `${charX}%`,
        transform: 'translateX(-50%)',
        transition: 'left 0.8s cubic-bezier(0.25, 0.46, 0.45, 0.94)',
        zIndex: 3,
        cursor: energy > 0 && charTarget === 'idle' ? 'pointer' : 'default',
      }}
        onClick={charTarget === 'idle' ? handleClickCoin : undefined}
      >
        <div className={clickBounce ? 'click-bounce' : ''}>
          <Character
            gender={gender}
            walking={walking}
            facing={facing}
            size={90}
          />
        </div>
        {/* Click hint */}
        {!walking && energy > 0 && (
          <div style={{
            position: 'absolute',
            top: -22,
            left: '50%',
            transform: 'translateX(-50%)',
            color: '#fbbf24',
            fontSize: '0.6rem',
            letterSpacing: '0.08em',
            textTransform: 'uppercase',
            opacity: 0.7,
            whiteSpace: 'nowrap',
            pointerEvents: 'none',
          }}>
            tap to earn
          </div>
        )}
        {energy <= 0 && (
          <div style={{
            position: 'absolute',
            top: -22,
            left: '50%',
            transform: 'translateX(-50%)',
            color: '#f87171',
            fontSize: '0.6rem',
            whiteSpace: 'nowrap',
          }}>
            ⚡ resting…
          </div>
        )}
      </div>

      {/* ── Tooltip ── */}
      {tooltip && (
        <div style={{
          position: 'absolute',
          top: '48%',
          left: '50%',
          transform: 'translateX(-50%)',
          background: 'rgba(19,13,42,0.9)',
          border: '1px solid rgba(192,132,252,0.4)',
          color: '#c4b5fd',
          fontSize: '0.75rem',
          padding: '4px 12px',
          borderRadius: 20,
          pointerEvents: 'none',
          whiteSpace: 'nowrap',
          backdropFilter: 'blur(4px)',
        }}>
          {tooltip}
        </div>
      )}

      {/* ── HUD top ── */}
      <div style={{
        position: 'absolute',
        top: 0,
        left: 0,
        right: 0,
        padding: '12px 16px 8px',
        display: 'flex',
        alignItems: 'flex-start',
        justifyContent: 'space-between',
        background: 'linear-gradient(180deg, rgba(10,6,24,0.85) 0%, transparent 100%)',
        zIndex: 10,
      }}>
        {/* Coins */}
        <div style={{
          display: 'flex',
          alignItems: 'center',
          gap: 6,
          background: 'rgba(19,13,42,0.8)',
          border: '1px solid rgba(251,191,36,0.3)',
          borderRadius: 20,
          padding: '5px 12px',
          backdropFilter: 'blur(4px)',
        }}>
          <span style={{ fontSize: '1rem' }}>🪙</span>
          <span style={{
            fontFamily: 'Poppins, sans-serif',
            fontWeight: 700,
            color: '#fbbf24',
            fontSize: '0.9rem',
            minWidth: 50,
          }}>
            {coins.toLocaleString()}
          </span>
        </div>

        {/* Right side: closet btn */}
        <button
          onClick={onClosetClick}
          style={{
            background: 'rgba(19,13,42,0.8)',
            border: '1px solid rgba(192,132,252,0.3)',
            borderRadius: 20,
            padding: '5px 12px',
            color: '#c4b5fd',
            fontSize: '0.75rem',
            cursor: 'pointer',
            display: 'flex',
            alignItems: 'center',
            gap: 5,
            backdropFilter: 'blur(4px)',
          }}
        >
          <span>👗</span>
          <span>{inventory.length}</span>
        </button>
      </div>

      {/* ── Energy bar (bottom HUD) ── */}
      <div style={{
        position: 'absolute',
        bottom: 0,
        left: 0,
        right: 0,
        padding: '8px 16px 12px',
        background: 'linear-gradient(0deg, rgba(10,6,24,0.9) 0%, transparent 100%)',
        zIndex: 10,
      }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
          <span style={{ color: '#fbbf24', fontSize: '0.75rem' }}>⚡</span>
          <div style={{ flex: 1, height: 8, background: 'rgba(255,255,255,0.08)', borderRadius: 4, overflow: 'hidden' }}>
            <div style={{
              height: '100%',
              width: `${energyPct}%`,
              background: energyPct > 30
                ? 'linear-gradient(90deg, #fbbf24, #f59e0b)'
                : 'linear-gradient(90deg, #f87171, #ef4444)',
              borderRadius: 4,
              transition: 'width 0.3s ease',
            }} />
          </div>
          <span style={{ color: '#9d7fc0', fontSize: '0.65rem', minWidth: 48, textAlign: 'right' }}>
            {energy}/{maxEnergy}
          </span>
        </div>

        {/* Scene hint */}
        <div style={{
          display: 'flex',
          justifyContent: 'center',
          gap: 16,
          marginTop: 6,
        }}>
          <button
            onClick={handleWardrobeClick}
            disabled={charTarget !== 'idle'}
            style={{
              background: 'none',
              border: 'none',
              color: charTarget === 'idle' ? '#c084fc' : '#5b4b7a',
              fontSize: '0.65rem',
              cursor: charTarget === 'idle' ? 'pointer' : 'default',
              letterSpacing: '0.08em',
              display: 'flex',
              alignItems: 'center',
              gap: 3,
              padding: '2px 8px',
            }}
          >
            ✨ Wardrobe
          </button>
          <button
            onClick={handleDoorClick}
            disabled={charTarget !== 'idle'}
            style={{
              background: 'none',
              border: 'none',
              color: charTarget === 'idle' ? '#93c5fd' : '#5b4b7a',
              fontSize: '0.65rem',
              cursor: charTarget === 'idle' ? 'pointer' : 'default',
              letterSpacing: '0.08em',
              display: 'flex',
              alignItems: 'center',
              gap: 3,
              padding: '2px 8px',
            }}
          >
            🚪 Street
          </button>
        </div>
      </div>

      {/* ── Recent item glow in wardrobe area ── */}
      {equippedItems.length > 0 && (
        <div style={{
          position: 'absolute',
          top: '15%',
          right: '3%',
          display: 'flex',
          flexDirection: 'column',
          gap: 2,
          zIndex: 5,
          pointerEvents: 'none',
        }}>
          {equippedItems.map((item, i) => (
            <div
              key={item.id + i}
              style={{
                fontSize: '0.8rem',
                filter: item.rarity === 'star'
                  ? 'drop-shadow(0 0 4px #f0abfc)'
                  : item.rarity === 'legendary'
                  ? 'drop-shadow(0 0 4px #f97316)'
                  : 'none',
              }}
            >
              {item.emoji}
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
