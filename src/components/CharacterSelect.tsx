import { useState } from 'react';
import Character from './Character';

interface CharacterSelectProps {
  onSelect: (gender: 'female' | 'male') => void;
}

export default function CharacterSelect({ onSelect }: CharacterSelectProps) {
  const [hovered, setHovered] = useState<'female' | 'male' | null>(null);

  return (
    <div
      className="scene-enter"
      style={{
        width: '100%',
        height: '100%',
        background: 'linear-gradient(160deg, #0a0618 0%, #1a0a35 50%, #0f1535 100%)',
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'center',
        fontFamily: 'Poppins, sans-serif',
        position: 'relative',
        overflow: 'hidden',
      }}
    >
      {/* Ambient sparkles */}
      {[...Array(12)].map((_, i) => (
        <div
          key={i}
          className="particle"
          style={{
            width: Math.random() * 4 + 2,
            height: Math.random() * 4 + 2,
            background: ['#c084fc', '#f0abfc', '#fbbf24', '#93c5fd'][i % 4],
            left: `${Math.random() * 100}%`,
            top: `${Math.random() * 100}%`,
            animationDuration: `${3 + Math.random() * 4}s`,
            animationDelay: `${Math.random() * 3}s`,
          }}
        />
      ))}

      {/* Star field */}
      <div style={{ position: 'absolute', inset: 0, overflow: 'hidden', pointerEvents: 'none' }}>
        {[...Array(30)].map((_, i) => (
          <div
            key={i}
            style={{
              position: 'absolute',
              width: Math.random() * 2 + 1,
              height: Math.random() * 2 + 1,
              background: 'white',
              borderRadius: '50%',
              left: `${Math.random() * 100}%`,
              top: `${Math.random() * 60}%`,
              opacity: Math.random() * 0.6 + 0.2,
            }}
          />
        ))}
      </div>

      {/* Title */}
      <div style={{ textAlign: 'center', marginBottom: 8, zIndex: 1 }}>
        <h1
          style={{
            fontFamily: 'Playfair Display, serif',
            fontSize: 'clamp(2rem, 8vw, 3.5rem)',
            fontWeight: 900,
            margin: 0,
            lineHeight: 1.1,
            background: 'linear-gradient(135deg, #f0abfc 0%, #fbbf24 50%, #f0abfc 100%)',
            backgroundSize: '200%',
            WebkitBackgroundClip: 'text',
            backgroundClip: 'text',
            WebkitTextFillColor: 'transparent',
          }}
        >
          FASHION CASES
        </h1>
        <p style={{ color: '#9d7fc0', fontSize: '0.85rem', letterSpacing: '0.2em', margin: '8px 0 0', textTransform: 'uppercase' }}>
          Collect · Dress · Dazzle
        </p>
      </div>

      {/* Divider */}
      <div style={{ width: 60, height: 1, background: 'linear-gradient(to right, transparent, #c084fc, transparent)', margin: '16px 0 24px' }} />

      <p style={{ color: '#c4b5fd', fontSize: '0.95rem', marginBottom: 32, zIndex: 1 }}>
        Choose your character
      </p>

      {/* Character cards */}
      <div style={{ display: 'flex', gap: 24, zIndex: 1 }}>
        {(['female', 'male'] as const).map((g) => (
          <button
            key={g}
            onMouseEnter={() => setHovered(g)}
            onMouseLeave={() => setHovered(null)}
            onClick={() => onSelect(g)}
            style={{
              background: hovered === g
                ? 'linear-gradient(160deg, rgba(192,132,252,0.25), rgba(168,85,247,0.15))'
                : 'linear-gradient(160deg, rgba(255,255,255,0.05), rgba(255,255,255,0.02))',
              border: `1.5px solid ${hovered === g ? 'rgba(192,132,252,0.6)' : 'rgba(192,132,252,0.2)'}`,
              borderRadius: 20,
              padding: '20px 24px',
              cursor: 'pointer',
              transition: 'all 0.25s ease',
              transform: hovered === g ? 'translateY(-6px) scale(1.03)' : 'translateY(0) scale(1)',
              boxShadow: hovered === g ? '0 12px 40px rgba(168,85,247,0.35)' : '0 4px 20px rgba(0,0,0,0.3)',
              display: 'flex',
              flexDirection: 'column',
              alignItems: 'center',
              gap: 12,
              minWidth: 140,
            }}
          >
            <div style={{ transform: hovered === g ? 'scale(1.05)' : 'scale(1)', transition: 'transform 0.25s' }}>
              <Character gender={g} walking={hovered === g} size={80} />
            </div>
            <span style={{
              fontFamily: 'Playfair Display, serif',
              fontSize: '1.1rem',
              fontWeight: 700,
              color: hovered === g ? '#f0abfc' : '#c4b5fd',
              letterSpacing: '0.05em',
            }}>
              {g === 'female' ? 'Her Style' : 'His Style'}
            </span>
            {hovered === g && (
              <span style={{ fontSize: '0.72rem', color: '#a78bfa', letterSpacing: '0.1em', textTransform: 'uppercase' }}>
                Choose →
              </span>
            )}
          </button>
        ))}
      </div>

      {/* Bottom text */}
      <p style={{ color: '#5b4b7a', fontSize: '0.72rem', marginTop: 40, textAlign: 'center', zIndex: 1 }}>
        Open wardrobes · Collect rare fashion · Build your empire
      </p>
    </div>
  );
}
