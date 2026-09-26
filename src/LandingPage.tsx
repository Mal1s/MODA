import { useEffect, useRef, useState } from 'react';

interface LandingPageProps {
  onPlayDemo: () => void;
}

/* ─── Rarity data ─── */
const RARITIES = [
  { label: 'Common', emoji: '👕', color: '#9ca3af', glow: 'rgba(156,163,175,0)', bg: 'rgba(156,163,175,0.06)', desc: 'Everyday basics. A clean slate to build from.' },
  { label: 'Rare', emoji: '💎', color: '#60a5fa', glow: 'rgba(96,165,250,0.5)', bg: 'rgba(96,165,250,0.08)', desc: 'Quality pieces with a subtle, unmistakable glow.' },
  { label: 'Mythic', emoji: '🔮', color: '#a855f7', glow: 'rgba(168,85,247,0.6)', bg: 'rgba(168,85,247,0.1)', desc: 'Rare and covetable. The wardrobe takes notice.' },
  { label: 'Legendary', emoji: '✨', color: '#f97316', glow: 'rgba(249,115,22,0.7)', bg: 'rgba(249,115,22,0.1)', desc: 'Iconic fashion. Rooms fall silent when you enter.' },
  { label: '✦ STAR', emoji: '🌟', color: '#f0abfc', glow: 'rgba(240,171,252,0.8)', bg: 'rgba(240,171,252,0.1)', desc: 'The pinnacle. A piece that rewrites the rules of fashion.' },
];

/* ─── Feature data ─── */
const FEATURES = [
  {
    icon: '👆',
    title: 'Tap & Earn',
    desc: 'Every tap on your character earns coins. Feel the satisfying rhythm of building your fortune — one click at a time.',
    color: '#fbbf24',
  },
  {
    icon: '🎰',
    title: 'Open Wardrobes',
    desc: 'Choose from Basic, Premium, Luxury or Rainbow wardrobes. Watch the roulette spin and hold your breath for that rare drop.',
    color: '#c084fc',
  },
  {
    icon: '🛍️',
    title: 'Fashion Market',
    desc: 'Browse stalls of vintage finds and buy directly. No luck needed — just coins and style knowledge.',
    color: '#60a5fa',
  },
  {
    icon: '🔨',
    title: 'Auction House',
    desc: 'Bid on Mythic and Legendary pieces in a cinematic live auction. Outbid rivals before the gavel falls.',
    color: '#22c55e',
  },
  {
    icon: '⚗️',
    title: 'Item Fusion',
    desc: 'Combine two items in a charged ritual. Watch energy arc between them — will they fuse into something legendary?',
    color: '#f97316',
  },
  {
    icon: '👗',
    title: 'Living Collection',
    desc: 'Your closet is a gallery. Rare items radiate glow and light. Star items transform the entire room.',
    color: '#f0abfc',
  },
];

/* ─── Steps data ─── */
const STEPS = [
  { n: '01', title: 'Choose Your Character', desc: 'Pick your style icon — her or him. Your character lives in a cozy room and walks to every destination.' },
  { n: '02', title: 'Earn Coins by Tapping', desc: 'Tap your character to earn coins. Energy limits grinding — spend it wisely before it replenishes.' },
  { n: '03', title: 'Open a Wardrobe', desc: 'Spend coins to open a wardrobe case. Walk to it. Watch the roulette spin. Discover your rarity.' },
  { n: '04', title: 'Explore the Street', desc: 'Step outside to the Fashion Street hub. Visit the Market, Boutique, or Auction House — your character walks there.' },
];

/* ─── Scroll reveal hook ─── */
function useReveal() {
  useEffect(() => {
    const observer = new IntersectionObserver(
      entries => entries.forEach(e => {
        if (e.isIntersecting) e.target.classList.add('visible');
      }),
      { threshold: 0.12 }
    );
    document.querySelectorAll('.reveal').forEach(el => observer.observe(el));
    return () => observer.disconnect();
  }, []);
}

export default function LandingPage({ onPlayDemo }: LandingPageProps) {
  useReveal();
  const [email, setEmail] = useState('');
  const [emailSent, setEmailSent] = useState(false);
  const [menuOpen, setMenuOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    document.documentElement.classList.add('landing');
    document.body.classList.add('landing');
    const onScroll = () => setScrolled(window.scrollY > 60);
    window.addEventListener('scroll', onScroll);
    return () => {
      document.documentElement.classList.remove('landing');
      document.body.classList.remove('landing');
      window.removeEventListener('scroll', onScroll);
    };
  }, []);

  const handleEmail = (e: React.FormEvent) => {
    e.preventDefault();
    if (email) { setEmailSent(true); }
  };

  return (
    <div className="landing-root">
      {/* ─── NAV ─── */}
      <nav style={{
        position: 'fixed',
        top: 0,
        left: 0,
        right: 0,
        zIndex: 100,
        padding: '0 24px',
        height: 64,
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between',
        background: scrolled ? 'rgba(5,3,15,0.92)' : 'transparent',
        backdropFilter: scrolled ? 'blur(16px)' : 'none',
        borderBottom: scrolled ? '1px solid rgba(192,132,252,0.12)' : '1px solid transparent',
        transition: 'all 0.3s ease',
      }}>
        {/* Logo */}
        <div style={{ display: 'flex', alignItems: 'center', gap: 10, cursor: 'pointer' }}>
          <div style={{
            width: 36,
            height: 36,
            background: 'linear-gradient(135deg, #7c3aed, #c026d3)',
            borderRadius: 10,
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            fontSize: '1rem',
            boxShadow: '0 0 14px rgba(192,38,211,0.4)',
          }}>
            ✦
          </div>
          <span style={{
            fontFamily: 'Playfair Display, serif',
            fontSize: '1.1rem',
            fontWeight: 700,
            color: '#f0e6ff',
            animation: 'nav-logo-glow 3s ease-in-out infinite',
            letterSpacing: '0.05em',
          }}>
            Fashion Cases
          </span>
        </div>

        {/* Desktop links */}
        <div style={{ display: 'flex', gap: 32, alignItems: 'center' }}>
          <div style={{ display: 'flex', gap: 28 }}>
            {['Features', 'Rarities', 'How it Works', 'Play'].map(label => (
              <a
                key={label}
                href={`#${label.toLowerCase().replace(/ /g, '-')}`}
                onClick={label === 'Play' ? (e) => { e.preventDefault(); onPlayDemo(); } : undefined}
                style={{
                  color: label === 'Play' ? '#f0abfc' : 'rgba(240,230,255,0.6)',
                  textDecoration: 'none',
                  fontSize: '0.82rem',
                  letterSpacing: '0.04em',
                  fontWeight: label === 'Play' ? 600 : 400,
                  transition: 'color 0.2s',
                }}
              >
                {label}
              </a>
            ))}
          </div>
          <button
            onClick={onPlayDemo}
            style={{
              background: 'linear-gradient(135deg, #7c3aed, #c026d3)',
              border: 'none',
              borderRadius: 22,
              padding: '8px 20px',
              color: 'white',
              fontSize: '0.82rem',
              fontWeight: 600,
              cursor: 'pointer',
              letterSpacing: '0.04em',
              boxShadow: '0 0 16px rgba(192,38,211,0.35)',
              transition: 'transform 0.2s, box-shadow 0.2s',
            }}
            onMouseEnter={e => {
              (e.currentTarget as HTMLButtonElement).style.transform = 'scale(1.05)';
              (e.currentTarget as HTMLButtonElement).style.boxShadow = '0 0 24px rgba(192,38,211,0.55)';
            }}
            onMouseLeave={e => {
              (e.currentTarget as HTMLButtonElement).style.transform = 'scale(1)';
              (e.currentTarget as HTMLButtonElement).style.boxShadow = '0 0 16px rgba(192,38,211,0.35)';
            }}
          >
            Play Demo
          </button>
        </div>
      </nav>

      {/* ─── HERO ─── */}
      <section id="hero" style={{
        position: 'relative',
        minHeight: '100vh',
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'center',
        overflow: 'hidden',
        padding: '80px 24px 60px',
        textAlign: 'center',
      }}>
        {/* Orb backgrounds */}
        <div style={{
          position: 'absolute', top: '20%', left: '50%',
          width: '70vw', height: '70vw', maxWidth: 700,
          background: 'radial-gradient(circle, rgba(124,58,237,0.35) 0%, rgba(192,38,211,0.15) 40%, transparent 70%)',
          borderRadius: '50%',
          animation: 'orb-pulse 6s ease-in-out infinite',
          pointerEvents: 'none',
        }} />
        <div style={{
          position: 'absolute', bottom: '10%', right: '-10%',
          width: '40vw', height: '40vw', maxWidth: 400,
          background: 'radial-gradient(circle, rgba(251,191,36,0.12) 0%, transparent 65%)',
          borderRadius: '50%',
          pointerEvents: 'none',
        }} />
        <div style={{
          position: 'absolute', top: '5%', left: '-5%',
          width: '30vw', height: '30vw', maxWidth: 300,
          background: 'radial-gradient(circle, rgba(96,165,250,0.1) 0%, transparent 65%)',
          borderRadius: '50%',
          pointerEvents: 'none',
        }} />

        {/* Star particles */}
        {[...Array(20)].map((_, i) => (
          <div key={i} style={{
            position: 'absolute',
            width: Math.random() * 3 + 1,
            height: Math.random() * 3 + 1,
            background: ['#f0abfc', '#fbbf24', '#93c5fd', 'white'][i % 4],
            borderRadius: '50%',
            left: `${Math.random() * 100}%`,
            top: `${Math.random() * 100}%`,
            opacity: Math.random() * 0.5 + 0.2,
            animation: `float-up ${4 + Math.random() * 6}s ease-in-out infinite`,
            animationDelay: `${Math.random() * 5}s`,
            pointerEvents: 'none',
          }} />
        ))}

        {/* Badge */}
        <div style={{
          display: 'inline-flex',
          alignItems: 'center',
          gap: 8,
          background: 'rgba(192,132,252,0.1)',
          border: '1px solid rgba(192,132,252,0.25)',
          borderRadius: 30,
          padding: '6px 16px',
          fontSize: '0.72rem',
          letterSpacing: '0.15em',
          color: '#c4b5fd',
          textTransform: 'uppercase',
          marginBottom: 28,
          animation: 'fade-in 1s ease forwards',
        }}>
          <span style={{ color: '#f0abfc' }}>✦</span>
          Fashion · Gacha · Collect
          <span style={{ color: '#f0abfc' }}>✦</span>
        </div>

        {/* Title */}
        <h1 style={{
          fontFamily: 'Playfair Display, serif',
          fontSize: 'clamp(3rem, 10vw, 7.5rem)',
          fontWeight: 900,
          margin: '0 0 0',
          lineHeight: 0.95,
          letterSpacing: '-0.02em',
          animation: 'slide-up 0.9s ease forwards',
        }}>
          <span style={{ display: 'block', color: '#f0e6ff' }}>FASHION</span>
          <span className="gradient-text" style={{ display: 'block' }}>CASES</span>
        </h1>

        {/* Tagline */}
        <p style={{
          fontFamily: 'Playfair Display, serif',
          fontSize: 'clamp(1rem, 2.5vw, 1.4rem)',
          color: 'rgba(240,230,255,0.55)',
          fontStyle: 'italic',
          margin: '20px 0 36px',
          letterSpacing: '0.08em',
          animation: 'slide-up 0.9s ease 0.15s both forwards',
        }}>
          Collect. Dress. Dazzle.
        </p>

        {/* Description */}
        <p style={{
          fontSize: 'clamp(0.9rem, 2vw, 1.05rem)',
          color: 'rgba(240,230,255,0.5)',
          maxWidth: 520,
          lineHeight: 1.7,
          margin: '0 0 44px',
          animation: 'slide-up 0.9s ease 0.25s both forwards',
        }}>
          A mobile fashion game where you open mystery wardrobe cases, collect rare couture,
          and build the most coveted closet in the city.
        </p>

        {/* CTAs */}
        <div style={{
          display: 'flex',
          gap: 14,
          flexWrap: 'wrap',
          justifyContent: 'center',
          animation: 'slide-up 0.9s ease 0.35s both forwards',
        }}>
          <button
            onClick={onPlayDemo}
            style={{
              background: 'linear-gradient(135deg, #7c3aed, #c026d3)',
              border: 'none',
              borderRadius: 50,
              padding: '16px 36px',
              color: 'white',
              fontSize: '1rem',
              fontWeight: 700,
              fontFamily: 'Poppins, sans-serif',
              cursor: 'pointer',
              letterSpacing: '0.04em',
              boxShadow: '0 0 40px rgba(192,38,211,0.45), 0 8px 30px rgba(0,0,0,0.4)',
              transition: 'transform 0.2s, box-shadow 0.2s',
            }}
            onMouseEnter={e => {
              (e.currentTarget as HTMLButtonElement).style.transform = 'translateY(-3px) scale(1.03)';
              (e.currentTarget as HTMLButtonElement).style.boxShadow = '0 0 60px rgba(192,38,211,0.6), 0 12px 40px rgba(0,0,0,0.4)';
            }}
            onMouseLeave={e => {
              (e.currentTarget as HTMLButtonElement).style.transform = 'translateY(0) scale(1)';
              (e.currentTarget as HTMLButtonElement).style.boxShadow = '0 0 40px rgba(192,38,211,0.45), 0 8px 30px rgba(0,0,0,0.4)';
            }}
          >
            ✦ Play Demo
          </button>
          <a
            href="#features"
            style={{
              display: 'inline-flex',
              alignItems: 'center',
              gap: 8,
              background: 'rgba(255,255,255,0.04)',
              border: '1.5px solid rgba(192,132,252,0.25)',
              borderRadius: 50,
              padding: '15px 32px',
              color: '#c4b5fd',
              fontSize: '1rem',
              fontWeight: 500,
              textDecoration: 'none',
              fontFamily: 'Poppins, sans-serif',
              letterSpacing: '0.04em',
              transition: 'background 0.2s, border-color 0.2s',
            }}
            onMouseEnter={e => {
              (e.currentTarget as HTMLAnchorElement).style.background = 'rgba(192,132,252,0.1)';
              (e.currentTarget as HTMLAnchorElement).style.borderColor = 'rgba(192,132,252,0.5)';
            }}
            onMouseLeave={e => {
              (e.currentTarget as HTMLAnchorElement).style.background = 'rgba(255,255,255,0.04)';
              (e.currentTarget as HTMLAnchorElement).style.borderColor = 'rgba(192,132,252,0.25)';
            }}
          >
            Explore ↓
          </a>
        </div>

        {/* Scroll indicator */}
        <div style={{
          position: 'absolute',
          bottom: 28,
          left: '50%',
          transform: 'translateX(-50%)',
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          gap: 6,
          animation: 'fade-in 1.5s ease 1s both',
        }}>
          <div style={{ color: 'rgba(240,230,255,0.3)', fontSize: '0.62rem', letterSpacing: '0.12em', textTransform: 'uppercase' }}>Scroll</div>
          <div style={{ width: 1, height: 30, background: 'linear-gradient(180deg, rgba(192,132,252,0.5), transparent)' }} />
        </div>
      </section>

      {/* ─── TICKER ─── */}
      <div style={{
        overflow: 'hidden',
        background: 'linear-gradient(90deg, rgba(124,58,237,0.2), rgba(192,38,211,0.2))',
        borderTop: '1px solid rgba(192,132,252,0.15)',
        borderBottom: '1px solid rgba(192,132,252,0.15)',
        padding: '12px 0',
      }}>
        <div style={{ display: 'flex', animation: 'ticker-scroll 20s linear infinite', width: 'max-content' }}>
          {[...Array(2)].map((_, rep) => (
            <div key={rep} style={{ display: 'flex', gap: 48, paddingRight: 48 }}>
              {['✦ Common', '★ Rare', '◆ Mythic', '✦ Legendary', '🌟 STAR', '✦ Open the Wardrobe', '★ Collect Fashion', '◆ Build Your Empire'].map((t, i) => (
                <span key={i} style={{
                  color: i % 4 === 3 ? '#f0abfc' : i % 4 === 2 ? '#f97316' : i % 4 === 1 ? '#a855f7' : 'rgba(240,230,255,0.4)',
                  fontSize: '0.72rem',
                  letterSpacing: '0.12em',
                  fontWeight: 500,
                  whiteSpace: 'nowrap',
                  textTransform: 'uppercase',
                }}>
                  {t}
                </span>
              ))}
            </div>
          ))}
        </div>
      </div>

      {/* ─── FEATURES ─── */}
      <section id="features" style={{ padding: 'clamp(60px, 8vw, 120px) clamp(20px, 5vw, 80px)' }}>
        <div style={{ maxWidth: 1100, margin: '0 auto' }}>
          <div className="reveal" style={{ textAlign: 'center', marginBottom: 60 }}>
            <p style={{ color: '#c084fc', fontSize: '0.72rem', letterSpacing: '0.2em', textTransform: 'uppercase', marginBottom: 12 }}>The Game</p>
            <h2 style={{
              fontFamily: 'Playfair Display, serif',
              fontSize: 'clamp(2rem, 5vw, 3.5rem)',
              fontWeight: 900,
              margin: 0,
              color: '#f0e6ff',
            }}>
              Six Ways to <span className="gradient-text">Collect</span>
            </h2>
          </div>

          <div style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))',
            gap: 16,
          }}>
            {FEATURES.map((f, i) => (
              <div
                key={f.title}
                className={`reveal reveal-delay-${(i % 3) + 1} card-hover`}
                style={{
                  background: 'rgba(255,255,255,0.025)',
                  border: '1px solid rgba(255,255,255,0.06)',
                  borderRadius: 20,
                  padding: '28px 24px',
                  position: 'relative',
                  overflow: 'hidden',
                }}
              >
                {/* Subtle top glow */}
                <div style={{
                  position: 'absolute',
                  top: 0, left: 0, right: 0,
                  height: 1,
                  background: `linear-gradient(90deg, transparent, ${f.color}40, transparent)`,
                }} />
                <div style={{
                  fontSize: '2rem',
                  marginBottom: 16,
                  filter: `drop-shadow(0 0 8px ${f.color}60)`,
                }}>
                  {f.icon}
                </div>
                <h3 style={{
                  fontFamily: 'Playfair Display, serif',
                  fontSize: '1.1rem',
                  fontWeight: 700,
                  color: '#f0e6ff',
                  margin: '0 0 10px',
                }}>
                  {f.title}
                </h3>
                <p style={{
                  color: 'rgba(240,230,255,0.5)',
                  fontSize: '0.85rem',
                  lineHeight: 1.7,
                  margin: 0,
                }}>
                  {f.desc}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ─── RARITY SHOWCASE ─── */}
      <section id="rarities" style={{
        padding: 'clamp(60px, 8vw, 120px) clamp(20px, 5vw, 80px)',
        background: 'radial-gradient(ellipse at 50% 0%, rgba(124,58,237,0.12) 0%, transparent 60%)',
      }}>
        <div style={{ maxWidth: 1100, margin: '0 auto' }}>
          <div className="reveal" style={{ textAlign: 'center', marginBottom: 60 }}>
            <p style={{ color: '#f97316', fontSize: '0.72rem', letterSpacing: '0.2em', textTransform: 'uppercase', marginBottom: 12 }}>Rarity System</p>
            <h2 style={{
              fontFamily: 'Playfair Display, serif',
              fontSize: 'clamp(2rem, 5vw, 3.5rem)',
              fontWeight: 900,
              margin: '0 0 16px',
              color: '#f0e6ff',
            }}>
              Five Tiers of <span className="gradient-text">Glory</span>
            </h2>
            <p style={{ color: 'rgba(240,230,255,0.45)', fontSize: '0.95rem', maxWidth: 500, margin: '0 auto' }}>
              From everyday basics to otherworldly masterpieces — every item has its place in the hierarchy.
            </p>
          </div>

          {/* Rarity cards */}
          <div style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fit, minmax(180px, 1fr))',
            gap: 14,
          }}>
            {RARITIES.map((r, i) => (
              <div
                key={r.label}
                className={`reveal reveal-delay-${i + 1} card-hover`}
                style={{
                  background: r.bg,
                  border: `1.5px solid ${r.color}40`,
                  borderRadius: 20,
                  padding: '28px 16px',
                  textAlign: 'center',
                  position: 'relative',
                  overflow: 'hidden',
                  boxShadow: i >= 3 ? `0 0 30px ${r.glow}` : 'none',
                }}
              >
                {/* Top bar */}
                <div style={{
                  position: 'absolute',
                  top: 0, left: 0, right: 0,
                  height: 3,
                  background: i === 4
                    ? 'linear-gradient(90deg, #f0abfc, #60a5fa, #fbbf24, #f0abfc)'
                    : r.color,
                  backgroundSize: '300%',
                  animation: i === 4 ? 'gradient-shift 3s ease infinite' : 'none',
                }} />

                {/* Emoji */}
                <div style={{
                  fontSize: '2.5rem',
                  marginBottom: 14,
                  animation: i >= 3 ? `rarity-float ${2.5 + i * 0.3}s ease-in-out infinite` : 'none',
                  filter: i === 4
                    ? 'drop-shadow(0 0 12px #f0abfc) drop-shadow(0 0 24px #e879f9)'
                    : i === 3
                    ? 'drop-shadow(0 0 10px #f97316)'
                    : i === 2
                    ? 'drop-shadow(0 0 8px #a855f7)'
                    : i === 1
                    ? 'drop-shadow(0 0 6px #60a5fa)'
                    : 'none',
                }}>
                  {r.emoji}
                </div>

                {/* Label */}
                <div style={{
                  fontFamily: 'Playfair Display, serif',
                  fontSize: '0.95rem',
                  fontWeight: 700,
                  color: r.color,
                  marginBottom: 8,
                  letterSpacing: i === 4 ? '0.08em' : '0.02em',
                }}>
                  {r.label}
                </div>

                {/* Desc */}
                <p style={{
                  fontSize: '0.72rem',
                  color: 'rgba(240,230,255,0.45)',
                  lineHeight: 1.6,
                  margin: 0,
                }}>
                  {r.desc}
                </p>

                {/* Rarity bar */}
                <div style={{
                  marginTop: 14,
                  height: 3,
                  background: 'rgba(255,255,255,0.06)',
                  borderRadius: 2,
                  overflow: 'hidden',
                }}>
                  <div style={{
                    height: '100%',
                    width: `${[50, 30, 15, 4, 1][i] * 2}%`,
                    background: r.color,
                    borderRadius: 2,
                    opacity: 0.7,
                  }} />
                </div>
                <div style={{ fontSize: '0.6rem', color: 'rgba(240,230,255,0.3)', marginTop: 4 }}>
                  {[50, 30, 15, 4, 1][i]}% chance
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ─── HOW IT WORKS ─── */}
      <section id="how-it-works" style={{ padding: 'clamp(60px, 8vw, 120px) clamp(20px, 5vw, 80px)' }}>
        <div style={{ maxWidth: 900, margin: '0 auto' }}>
          <div className="reveal" style={{ textAlign: 'center', marginBottom: 64 }}>
            <p style={{ color: '#60a5fa', fontSize: '0.72rem', letterSpacing: '0.2em', textTransform: 'uppercase', marginBottom: 12 }}>Your Journey</p>
            <h2 style={{
              fontFamily: 'Playfair Display, serif',
              fontSize: 'clamp(2rem, 5vw, 3.5rem)',
              fontWeight: 900,
              margin: 0,
              color: '#f0e6ff',
            }}>
              How to <span className="gradient-text">Play</span>
            </h2>
          </div>

          <div style={{ display: 'flex', flexDirection: 'column', gap: 0 }}>
            {STEPS.map((step, i) => (
              <div
                key={step.n}
                className={`reveal reveal-delay-${i + 1}`}
                style={{
                  display: 'grid',
                  gridTemplateColumns: '80px 1fr',
                  gap: 24,
                  paddingBottom: i < STEPS.length - 1 ? 40 : 0,
                  position: 'relative',
                }}
              >
                {/* Left: number + line */}
                <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
                  <div style={{
                    width: 52,
                    height: 52,
                    borderRadius: '50%',
                    background: 'linear-gradient(135deg, rgba(124,58,237,0.3), rgba(192,38,211,0.2))',
                    border: '1.5px solid rgba(192,132,252,0.35)',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    fontFamily: 'Playfair Display, serif',
                    fontSize: '1.1rem',
                    fontWeight: 700,
                    color: '#c084fc',
                    flexShrink: 0,
                  }}>
                    {step.n}
                  </div>
                  {i < STEPS.length - 1 && (
                    <div style={{
                      width: 1,
                      flex: 1,
                      marginTop: 8,
                      background: 'linear-gradient(180deg, rgba(192,132,252,0.3), transparent)',
                    }} />
                  )}
                </div>

                {/* Right: content */}
                <div style={{ paddingTop: 12 }}>
                  <h3 style={{
                    fontFamily: 'Playfair Display, serif',
                    fontSize: '1.2rem',
                    fontWeight: 700,
                    color: '#f0e6ff',
                    margin: '0 0 10px',
                  }}>
                    {step.title}
                  </h3>
                  <p style={{
                    color: 'rgba(240,230,255,0.5)',
                    fontSize: '0.9rem',
                    lineHeight: 1.7,
                    margin: 0,
                  }}>
                    {step.desc}
                  </p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ─── WORLD PREVIEW ─── */}
      <section style={{ padding: 'clamp(40px, 6vw, 80px) clamp(20px, 5vw, 80px)' }}>
        <div style={{ maxWidth: 1100, margin: '0 auto' }}>
          <div className="reveal" style={{ textAlign: 'center', marginBottom: 48 }}>
            <p style={{ color: '#22c55e', fontSize: '0.72rem', letterSpacing: '0.2em', textTransform: 'uppercase', marginBottom: 12 }}>Your World</p>
            <h2 style={{
              fontFamily: 'Playfair Display, serif',
              fontSize: 'clamp(1.8rem, 4vw, 3rem)',
              fontWeight: 900,
              margin: 0,
              color: '#f0e6ff',
            }}>
              A Living <span className="gradient-text">Fashion City</span>
            </h2>
          </div>

          {/* World locations grid */}
          <div style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))',
            gap: 14,
          }}>
            {[
              { icon: '🏠', title: 'Your Room', desc: 'Home base. Your character lives here. Click to earn coins. The wardrobe glows with your collection.', color: '#7c3aed' },
              { icon: '🛍️', title: 'Fashion Market', desc: 'A cozy row of stalls. Buy specific items without luck. Sell duplicates for coins.', color: '#3b82f6' },
              { icon: '🔨', title: 'Auction House', desc: 'A cinematic bidding arena. Compete for Mythic and Legendary pieces before time runs out.', color: '#22c55e' },
              { icon: '✂️', title: 'Boutique & More', desc: 'The fashion street grows. Tailor, Exhibition, Secret Shops — coming soon.', color: '#f0abfc', comingSoon: true },
            ].map((loc, i) => (
              <div
                key={loc.title}
                className={`reveal reveal-delay-${i + 1} card-hover`}
                style={{
                  background: 'rgba(255,255,255,0.025)',
                  border: `1px solid ${loc.color}25`,
                  borderRadius: 20,
                  padding: '24px 20px',
                  position: 'relative',
                  overflow: 'hidden',
                }}
              >
                <div style={{
                  position: 'absolute', top: 0, left: 0, right: 0, height: 2,
                  background: `linear-gradient(90deg, transparent, ${loc.color}60, transparent)`,
                }} />
                <div style={{ fontSize: '1.8rem', marginBottom: 12, filter: `drop-shadow(0 0 6px ${loc.color}50)` }}>
                  {loc.icon}
                </div>
                <h3 style={{ fontFamily: 'Playfair Display, serif', fontSize: '1rem', fontWeight: 700, color: '#f0e6ff', margin: '0 0 8px', display: 'flex', alignItems: 'center', gap: 8 }}>
                  {loc.title}
                  {loc.comingSoon && (
                    <span style={{ fontSize: '0.55rem', color: '#6b5a8a', border: '1px solid #6b5a8a', padding: '1px 5px', borderRadius: 8, letterSpacing: '0.08em' }}>SOON</span>
                  )}
                </h3>
                <p style={{ color: 'rgba(240,230,255,0.45)', fontSize: '0.8rem', lineHeight: 1.65, margin: 0 }}>{loc.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ─── CHARACTERS ─── */}
      <section style={{
        padding: 'clamp(60px, 8vw, 120px) clamp(20px, 5vw, 80px)',
        background: 'radial-gradient(ellipse at 50% 100%, rgba(192,38,211,0.1) 0%, transparent 60%)',
      }}>
        <div style={{ maxWidth: 900, margin: '0 auto', textAlign: 'center' }}>
          <div className="reveal" style={{ marginBottom: 52 }}>
            <p style={{ color: '#f0abfc', fontSize: '0.72rem', letterSpacing: '0.2em', textTransform: 'uppercase', marginBottom: 12 }}>Choose Your Icon</p>
            <h2 style={{
              fontFamily: 'Playfair Display, serif',
              fontSize: 'clamp(2rem, 5vw, 3rem)',
              fontWeight: 900,
              margin: '0 0 16px',
              color: '#f0e6ff',
            }}>
              Your Character, <span className="gradient-text">Your Story</span>
            </h2>
            <p style={{ color: 'rgba(240,230,255,0.45)', fontSize: '0.9rem', maxWidth: 480, margin: '0 auto', lineHeight: 1.7 }}>
              Both characters walk, react, and evolve as you build their wardrobe.
              They're not just avatars — they're the heart of your fashion empire.
            </p>
          </div>

          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(260px, 1fr))', gap: 20 }}>
            {[
              { label: 'Her', emoji: '👩‍🦰', desc: 'Graceful, bold, and ahead of every trend. She walks the room like it\'s a runway.', color: '#f0abfc', gradient: 'linear-gradient(160deg, rgba(240,171,252,0.1), rgba(168,85,247,0.05))' },
              { label: 'Him', emoji: '👨‍🦱', desc: 'Sharp, effortless, understated luxury. Every outfit he wears becomes the standard.', color: '#93c5fd', gradient: 'linear-gradient(160deg, rgba(147,197,253,0.1), rgba(59,130,246,0.05))' },
            ].map((char, i) => (
              <div
                key={char.label}
                className={`reveal reveal-delay-${i + 1} card-hover`}
                style={{
                  background: char.gradient,
                  border: `1.5px solid ${char.color}30`,
                  borderRadius: 24,
                  padding: '36px 24px',
                  cursor: 'pointer',
                  transition: 'all 0.3s',
                }}
                onClick={onPlayDemo}
              >
                <div style={{ fontSize: '4rem', marginBottom: 16, animation: `rarity-float ${2.5 + i}s ease-in-out infinite` }}>
                  {char.emoji}
                </div>
                <h3 style={{
                  fontFamily: 'Playfair Display, serif',
                  fontSize: '1.3rem',
                  fontWeight: 700,
                  color: char.color,
                  margin: '0 0 10px',
                }}>
                  {char.label}
                </h3>
                <p style={{ color: 'rgba(240,230,255,0.45)', fontSize: '0.82rem', lineHeight: 1.7, margin: '0 0 20px' }}>
                  {char.desc}
                </p>
                <div style={{
                  display: 'inline-block',
                  padding: '8px 20px',
                  borderRadius: 20,
                  border: `1px solid ${char.color}40`,
                  color: char.color,
                  fontSize: '0.75rem',
                  letterSpacing: '0.05em',
                }}>
                  Play as {char.label} →
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ─── CTA / LAUNCH ─── */}
      <section id="play" style={{ padding: 'clamp(80px, 10vw, 140px) clamp(20px, 5vw, 80px)' }}>
        <div style={{ maxWidth: 700, margin: '0 auto', textAlign: 'center' }}>
          <div className="reveal" style={{ marginBottom: 48 }}>
            <div style={{
              display: 'inline-block',
              padding: '6px 18px',
              background: 'rgba(240,171,252,0.1)',
              border: '1px solid rgba(240,171,252,0.25)',
              borderRadius: 30,
              color: '#f0abfc',
              fontSize: '0.72rem',
              letterSpacing: '0.15em',
              textTransform: 'uppercase',
              marginBottom: 24,
            }}>
              ✦ Now Available as Demo
            </div>
            <h2 style={{
              fontFamily: 'Playfair Display, serif',
              fontSize: 'clamp(2.2rem, 6vw, 4rem)',
              fontWeight: 900,
              margin: '0 0 20px',
              color: '#f0e6ff',
              lineHeight: 1.1,
            }}>
              Step into the<br />
              <span className="gradient-text">Fashion World</span>
            </h2>
            <p style={{ color: 'rgba(240,230,255,0.5)', fontSize: '1rem', lineHeight: 1.7, marginBottom: 40 }}>
              Play the interactive demo right now — open wardrobes, collect rare fashion,
              walk the streets, and build the closet of your dreams.
            </p>

            <button
              onClick={onPlayDemo}
              style={{
                background: 'linear-gradient(135deg, #7c3aed, #c026d3, #7c3aed)',
                backgroundSize: '200%',
                border: 'none',
                borderRadius: 50,
                padding: '18px 48px',
                color: 'white',
                fontSize: '1.05rem',
                fontWeight: 700,
                fontFamily: 'Poppins, sans-serif',
                cursor: 'pointer',
                letterSpacing: '0.05em',
                boxShadow: '0 0 60px rgba(192,38,211,0.5), 0 8px 40px rgba(0,0,0,0.5)',
                animation: 'gradient-shift 3s ease infinite',
                transition: 'transform 0.2s',
                display: 'block',
                margin: '0 auto 24px',
              }}
              onMouseEnter={e => (e.currentTarget as HTMLButtonElement).style.transform = 'scale(1.05)'}
              onMouseLeave={e => (e.currentTarget as HTMLButtonElement).style.transform = 'scale(1)'}
            >
              ✦ Play Fashion Cases Demo
            </button>

            <p style={{ color: 'rgba(240,230,255,0.25)', fontSize: '0.75rem' }}>Free to play · No download required · Mobile coming soon</p>
          </div>

          {/* Wishlist form */}
          <div className="reveal reveal-delay-2">
            <div style={{
              background: 'rgba(255,255,255,0.03)',
              border: '1px solid rgba(255,255,255,0.07)',
              borderRadius: 20,
              padding: '28px 24px',
            }}>
              <p style={{ color: '#c4b5fd', fontSize: '0.85rem', marginBottom: 16, fontWeight: 500 }}>
                Get notified when the mobile app launches
              </p>
              {!emailSent ? (
                <form onSubmit={handleEmail} style={{ display: 'flex', gap: 10, maxWidth: 400, margin: '0 auto', flexWrap: 'wrap' }}>
                  <input
                    type="email"
                    value={email}
                    onChange={e => setEmail(e.target.value)}
                    placeholder="your@email.com"
                    required
                    style={{
                      flex: 1,
                      minWidth: 180,
                      padding: '12px 16px',
                      borderRadius: 12,
                      border: '1px solid rgba(192,132,252,0.25)',
                      background: 'rgba(255,255,255,0.05)',
                      color: '#f0e6ff',
                      fontSize: '0.875rem',
                      outline: 'none',
                      fontFamily: 'Poppins, sans-serif',
                    }}
                  />
                  <button type="submit" style={{
                    padding: '12px 22px',
                    borderRadius: 12,
                    border: 'none',
                    background: 'linear-gradient(135deg, #7c3aed, #c026d3)',
                    color: 'white',
                    fontSize: '0.85rem',
                    fontWeight: 600,
                    cursor: 'pointer',
                    fontFamily: 'Poppins, sans-serif',
                    whiteSpace: 'nowrap',
                  }}>
                    Notify Me
                  </button>
                </form>
              ) : (
                <div style={{ color: '#22c55e', fontSize: '0.9rem' }}>✓ You're on the list! We'll reach out when it launches.</div>
              )}
            </div>
          </div>
        </div>
      </section>

      {/* ─── FOOTER ─── */}
      <footer style={{
        borderTop: '1px solid rgba(192,132,252,0.1)',
        padding: '40px clamp(20px, 5vw, 80px)',
      }}>
        <div style={{
          maxWidth: 1100,
          margin: '0 auto',
          display: 'grid',
          gridTemplateColumns: 'auto 1fr auto',
          alignItems: 'center',
          gap: 20,
          flexWrap: 'wrap',
        }}>
          {/* Logo */}
          <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
            <div style={{
              width: 32,
              height: 32,
              background: 'linear-gradient(135deg, #7c3aed, #c026d3)',
              borderRadius: 8,
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              fontSize: '0.9rem',
            }}>
              ✦
            </div>
            <span style={{
              fontFamily: 'Playfair Display, serif',
              fontSize: '0.95rem',
              fontWeight: 700,
              color: 'rgba(240,230,255,0.6)',
            }}>
              Fashion Cases
            </span>
          </div>

          {/* Center links */}
          <div style={{ display: 'flex', gap: 24, justifyContent: 'center', flexWrap: 'wrap' }}>
            {['Features', 'Rarities', 'How it Works', 'Play Demo'].map(link => (
              <a key={link} href="#" style={{ color: 'rgba(240,230,255,0.3)', fontSize: '0.75rem', textDecoration: 'none', transition: 'color 0.2s', letterSpacing: '0.04em' }}
                onMouseEnter={e => (e.currentTarget as HTMLAnchorElement).style.color = '#c4b5fd'}
                onMouseLeave={e => (e.currentTarget as HTMLAnchorElement).style.color = 'rgba(240,230,255,0.3)'}
              >
                {link}
              </a>
            ))}
          </div>

          {/* Copyright */}
          <div style={{ color: 'rgba(240,230,255,0.2)', fontSize: '0.7rem', textAlign: 'right' }}>
            © 2026 Fashion Cases
          </div>
        </div>
      </footer>
    </div>
  );
}
