import { useState, useCallback } from 'react';
import Character from './Character';

type StreetTarget = 'idle' | 'shop' | 'market' | 'auction' | 'home';

interface StreetSceneProps {
  gender: 'female' | 'male';
  coins: number;
  onBack: () => void;
}

interface Location {
  id: StreetTarget;
  label: string;
  emoji: string;
  description: string;
  color: string;
  glowColor: string;
  x: number; // % left
  comingSoon?: boolean;
}

const LOCATIONS: Location[] = [
  { id: 'home', label: 'Home', emoji: '🏠', description: 'Your cozy room', color: '#4b3080', glowColor: '#7c3aed', x: 8 },
  { id: 'market', label: 'Market', emoji: '🛍️', description: 'Buy directly', color: '#1e4d80', glowColor: '#3b82f6', x: 32 },
  { id: 'shop', label: 'Boutique', emoji: '👗', description: 'Luxury fashion', color: '#3d1a60', glowColor: '#c084fc', x: 56 },
  { id: 'auction', label: 'Auction', emoji: '🔨', description: 'Bid & win rare items', color: '#1a3d1a', glowColor: '#22c55e', x: 80, comingSoon: true },
];

export default function StreetScene({ gender, coins, onBack }: StreetSceneProps) {
  const [charTarget, setCharTarget] = useState<StreetTarget>('idle');
  const [charX, setCharX] = useState(20);
  const [walking, setWalking] = useState(false);
  const [facing, setFacing] = useState<'left' | 'right' | 'forward'>('forward');
  const [hovered, setHovered] = useState<StreetTarget | null>(null);
  const [notification, setNotification] = useState<string | null>(null);

  const walkTo = useCallback((target: StreetTarget, destX: number, dir: 'left' | 'right') => {
    if (charTarget !== 'idle') return;
    setCharTarget(target);
    setFacing(dir);
    setWalking(true);
    setCharX(destX);

    setTimeout(() => {
      setWalking(false);
      setFacing('forward');
      setCharTarget('idle');

      if (target === 'home') {
        onBack();
      } else if (target === 'market' || target === 'shop') {
        setNotification(`${target === 'market' ? '🛍️ Market' : '👗 Boutique'} — Coming soon! More fashion drops await.`);
        setTimeout(() => setNotification(null), 3000);
        // Walk back to center
        setTimeout(() => {
          setFacing('left');
          setWalking(true);
          setCharX(20);
          setTimeout(() => { setWalking(false); setFacing('forward'); }, 700);
        }, 400);
      } else if (target === 'auction') {
        setNotification('🔨 Auction House — Opening soon! Bid on legendary items.');
        setTimeout(() => setNotification(null), 3000);
        setTimeout(() => {
          setFacing('left');
          setWalking(true);
          setCharX(20);
          setTimeout(() => { setWalking(false); setFacing('forward'); }, 700);
        }, 400);
      }
    }, 900);
  }, [charTarget, onBack]);

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
      {/* ── Sky ── */}
      <div style={{
        position: 'absolute',
        top: 0,
        left: 0,
        right: 0,
        height: '55%',
        background: 'linear-gradient(180deg, #0f0828 0%, #1a1045 50%, #231455 100%)',
      }}>
        {/* Stars */}
        {[...Array(25)].map((_, i) => (
          <div key={i} style={{
            position: 'absolute',
            width: Math.random() * 2 + 1,
            height: Math.random() * 2 + 1,
            background: 'white',
            borderRadius: '50%',
            left: `${Math.random() * 100}%`,
            top: `${Math.random() * 70}%`,
            opacity: Math.random() * 0.7 + 0.2,
          }} />
        ))}
        {/* Moon */}
        <div style={{
          position: 'absolute',
          top: '10%',
          right: '8%',
          width: 36,
          height: 36,
          background: 'radial-gradient(circle at 35% 35%, #fef3c7, #fbbf24)',
          borderRadius: '50%',
          boxShadow: '0 0 20px rgba(251,191,36,0.4)',
        }}>
          <div style={{
            position: 'absolute',
            top: 5,
            right: 4,
            width: 16,
            height: 16,
            background: '#1a1045',
            borderRadius: '50%',
          }} />
        </div>
      </div>

      {/* ── Ground / street ── */}
      <div style={{
        position: 'absolute',
        bottom: 0,
        left: 0,
        right: 0,
        height: '48%',
        background: 'linear-gradient(180deg, #1a1230 0%, #110d22 100%)',
        borderTop: '2px solid rgba(192,132,252,0.25)',
      }}>
        {/* Street tiles */}
        {[...Array(6)].map((_, i) => (
          <div key={i} style={{
            position: 'absolute',
            left: `${(i * 16.6)}%`,
            top: 0,
            bottom: 0,
            width: '15.5%',
            borderRight: '1px solid rgba(192,132,252,0.05)',
          }} />
        ))}
        {/* Neon street reflection */}
        <div style={{
          position: 'absolute',
          top: 0,
          left: 0,
          right: 0,
          height: 4,
          background: 'linear-gradient(90deg, rgba(124,58,237,0.4), rgba(59,130,246,0.3), rgba(192,132,252,0.4), rgba(59,130,246,0.3), rgba(124,58,237,0.4))',
        }} />
      </div>

      {/* ── Buildings / Locations ── */}
      {LOCATIONS.map(loc => {
        const isHovered = hovered === loc.id;
        const isWalkingTo = charTarget === loc.id;
        return (
          <div
            key={loc.id}
            onMouseEnter={() => setHovered(loc.id)}
            onMouseLeave={() => setHovered(null)}
            onClick={() => {
              if (charTarget !== 'idle') return;
              const dir = loc.x > charX ? 'right' : 'left';
              walkTo(loc.id, loc.x - 6, dir);
            }}
            style={{
              position: 'absolute',
              bottom: '46%',
              left: `${loc.x}%`,
              transform: 'translateX(-50%)',
              cursor: charTarget === 'idle' ? 'pointer' : 'default',
              transition: 'transform 0.2s',
              display: 'flex',
              flexDirection: 'column',
              alignItems: 'center',
            }}
          >
            {/* Building */}
            <div style={{
              background: `linear-gradient(160deg, ${loc.color} 0%, rgba(0,0,0,0.5) 100%)`,
              border: `1.5px solid ${isHovered || isWalkingTo ? loc.glowColor : 'rgba(255,255,255,0.08)'}`,
              borderRadius: '8px 8px 0 0',
              padding: '10px 8px 8px',
              width: 70,
              display: 'flex',
              flexDirection: 'column',
              alignItems: 'center',
              gap: 5,
              boxShadow: isHovered
                ? `0 0 20px ${loc.glowColor}50`
                : '0 4px 16px rgba(0,0,0,0.4)',
              transition: 'all 0.2s',
              position: 'relative',
              transform: isHovered ? 'translateY(-4px)' : 'translateY(0)',
            }}>
              {/* Sign / neon glow */}
              <div style={{
                position: 'absolute',
                top: -10,
                left: '50%',
                transform: 'translateX(-50%)',
                width: '90%',
                height: 6,
                background: loc.glowColor,
                borderRadius: 3,
                boxShadow: `0 0 10px ${loc.glowColor}`,
                opacity: isHovered ? 1 : 0.5,
                transition: 'opacity 0.2s',
              }} />

              {/* Windows */}
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 3, width: '100%' }}>
                {[...Array(4)].map((_, i) => (
                  <div key={i} style={{
                    height: 12,
                    background: isHovered
                      ? `linear-gradient(135deg, ${loc.glowColor}60, ${loc.glowColor}20)`
                      : 'rgba(255,255,255,0.05)',
                    borderRadius: 2,
                    border: '1px solid rgba(255,255,255,0.06)',
                    transition: 'background 0.2s',
                  }} />
                ))}
              </div>

              {/* Emoji sign */}
              <div style={{ fontSize: '1.3rem' }}>{loc.emoji}</div>
            </div>

            {/* Building base */}
            <div style={{
              width: 70,
              height: 6,
              background: 'rgba(255,255,255,0.05)',
              borderTop: '1px solid rgba(255,255,255,0.1)',
            }} />

            {/* Label */}
            <div style={{
              marginTop: 3,
              color: isHovered ? loc.glowColor : '#6b5a8a',
              fontSize: '0.6rem',
              fontWeight: 600,
              letterSpacing: '0.08em',
              textTransform: 'uppercase',
              transition: 'color 0.2s',
            }}>
              {loc.label}
              {loc.comingSoon && (
                <span style={{ marginLeft: 4, fontSize: '0.5rem', color: '#5b4b7a', border: '1px solid #5b4b7a', padding: '0 3px', borderRadius: 4 }}>
                  soon
                </span>
              )}
            </div>

            {/* Hover hint */}
            {isHovered && charTarget === 'idle' && (
              <div style={{
                position: 'absolute',
                bottom: '100%',
                marginBottom: 6,
                background: 'rgba(19,13,42,0.9)',
                border: `1px solid ${loc.glowColor}50`,
                borderRadius: 8,
                padding: '4px 10px',
                color: '#c4b5fd',
                fontSize: '0.62rem',
                whiteSpace: 'nowrap',
                backdropFilter: 'blur(4px)',
              }}>
                {loc.description}
              </div>
            )}
          </div>
        );
      })}

      {/* ── Street lamps ── */}
      {[15, 45, 70].map((x, i) => (
        <div key={i} style={{
          position: 'absolute',
          bottom: '45%',
          left: `${x}%`,
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
        }}>
          <div style={{
            width: 4,
            height: 50,
            background: 'linear-gradient(180deg, #4b3080, #2d1a55)',
            borderRadius: 2,
          }} />
          <div style={{
            marginTop: -4,
            width: 14,
            height: 14,
            background: '#fbbf24',
            borderRadius: '50%',
            boxShadow: '0 0 15px rgba(251,191,36,0.6)',
          }} />
        </div>
      ))}

      {/* ── Character ── */}
      <div style={{
        position: 'absolute',
        bottom: '45.5%',
        left: `${charX}%`,
        transform: 'translateX(-50%)',
        transition: 'left 0.9s cubic-bezier(0.25, 0.46, 0.45, 0.94)',
        zIndex: 5,
      }}>
        <Character gender={gender} walking={walking} facing={facing} size={75} />
      </div>

      {/* ── Notification toast ── */}
      {notification && (
        <div style={{
          position: 'fixed',
          bottom: 80,
          left: '50%',
          transform: 'translateX(-50%)',
          background: 'rgba(19,13,42,0.95)',
          border: '1px solid rgba(192,132,252,0.35)',
          borderRadius: 14,
          padding: '10px 18px',
          color: '#c4b5fd',
          fontSize: '0.78rem',
          zIndex: 20,
          maxWidth: 320,
          textAlign: 'center',
          backdropFilter: 'blur(8px)',
          animation: 'scene-in 0.3s ease-out',
        }}>
          {notification}
        </div>
      )}

      {/* ── Top HUD ── */}
      <div style={{
        position: 'absolute',
        top: 0,
        left: 0,
        right: 0,
        padding: '12px 16px',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between',
        background: 'linear-gradient(180deg, rgba(10,6,24,0.85) 0%, transparent 100%)',
        zIndex: 10,
      }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
          <div style={{ fontFamily: 'Playfair Display, serif', color: '#f0abfc', fontSize: '0.9rem', fontWeight: 700 }}>
            Fashion Street
          </div>
          <div style={{ width: 4, height: 4, background: '#c084fc', borderRadius: '50%', opacity: 0.6 }} />
          <div style={{ color: '#6b5a8a', fontSize: '0.65rem' }}>night mode</div>
        </div>
        <div style={{
          display: 'flex',
          alignItems: 'center',
          gap: 5,
          background: 'rgba(19,13,42,0.8)',
          border: '1px solid rgba(251,191,36,0.25)',
          borderRadius: 20,
          padding: '4px 10px',
        }}>
          <span style={{ fontSize: '0.85rem' }}>🪙</span>
          <span style={{ color: '#fbbf24', fontSize: '0.8rem', fontWeight: 700 }}>{coins.toLocaleString()}</span>
        </div>
      </div>

      {/* ── Bottom hint ── */}
      <div style={{
        position: 'absolute',
        bottom: 0,
        left: 0,
        right: 0,
        padding: '8px 16px 14px',
        background: 'linear-gradient(0deg, rgba(10,6,24,0.9) 0%, transparent 100%)',
        textAlign: 'center',
        color: '#3d2d5a',
        fontSize: '0.62rem',
        letterSpacing: '0.08em',
        zIndex: 10,
      }}>
        {charTarget === 'idle'
          ? 'Tap a location to visit it'
          : '...'
        }
      </div>
    </div>
  );
}
