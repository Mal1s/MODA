import { useEffect, useState } from 'react';
import { useI18n } from './i18n';
import caseBasicImg from './assets/items/common/1._Базовыи_(200🪙).png';
import bootsImg from './assets/items/rare/Редкая_—_Ботильоны_на_массивном_каблуке.png';

interface LandingPageProps {
  onPlayDemo: () => void;
}

/* ─── Scroll reveal hook ─── */
function useReveal() {
  useEffect(() => {
    const observer = new IntersectionObserver(
      entries => entries.forEach(e => { if (e.isIntersecting) e.target.classList.add('visible'); }),
      { threshold: 0.12 }
    );
    document.querySelectorAll('.reveal').forEach(el => observer.observe(el));
    return () => observer.disconnect();
  }, []);
}

export default function LandingPage({ onPlayDemo }: LandingPageProps) {
  const { t, lang, setLang } = useI18n();
  useReveal();
  const [email, setEmail] = useState('');
  const [emailSent, setEmailSent] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const [landingTheme, setLandingTheme] = useState<'dark' | 'light'>(() => localStorage.getItem('fc-landing-theme') === 'light' ? 'light' : 'dark');

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

  useEffect(() => {
    localStorage.setItem('fc-landing-theme', landingTheme);
  }, [landingTheme]);

  const handleEmail = (e: React.FormEvent) => { e.preventDefault(); if (email) setEmailSent(true); };

  const rarities = [
    { label: t('rarity.common'), emoji: '👕', color: '#9ca3af', glow: 'rgba(156,163,175,0)', bg: 'rgba(156,163,175,0.06)', desc: t('rarity.common.desc') },
    { label: t('rarity.rare'), emoji: '💎', color: '#60a5fa', glow: 'rgba(96,165,250,0.5)', bg: 'rgba(96,165,250,0.08)', desc: t('rarity.rare.desc') },
    { label: t('rarity.mythic'), emoji: '🔮', color: '#a855f7', glow: 'rgba(168,85,247,0.6)', bg: 'rgba(168,85,247,0.1)', desc: t('rarity.mythic.desc') },
    { label: t('rarity.legendary'), emoji: '✨', color: '#f97316', glow: 'rgba(249,115,22,0.7)', bg: 'rgba(249,115,22,0.1)', desc: t('rarity.legendary.desc') },
    { label: t('rarity.star'), emoji: '🌟', color: '#f0abfc', glow: 'rgba(240,171,252,0.8)', bg: 'rgba(240,171,252,0.1)', desc: t('rarity.star.desc') },
  ];

  const features = [
    { icon: '👆', title: t('feature.tap.title'), desc: t('feature.tap.desc'), color: '#fbbf24' },
    { icon: '🎰', title: t('feature.wardrobe.title'), desc: t('feature.wardrobe.desc'), color: '#c084fc' },
    { icon: '🛍️', title: t('feature.market.title'), desc: t('feature.market.desc'), color: '#60a5fa' },
    { icon: '🔨', title: t('feature.auction.title'), desc: t('feature.auction.desc'), color: '#22c55e' },
    { icon: '⚗️', title: t('feature.fusion.title'), desc: t('feature.fusion.desc'), color: '#f97316' },
    { icon: '👗', title: t('feature.collection.title'), desc: t('feature.collection.desc'), color: '#f0abfc' },
  ];

  const steps = [
    { n: '01', title: t('step.01.title'), desc: t('step.01.desc') },
    { n: '02', title: t('step.02.title'), desc: t('step.02.desc') },
    { n: '03', title: t('step.03.title'), desc: t('step.03.desc') },
    { n: '04', title: t('step.04.title'), desc: t('step.04.desc') },
  ];

  const navLinks = [t('nav.features'), t('nav.rarities'), t('nav.howItWorks'), t('nav.play')];

  return (
    <div className={`landing-root ${landingTheme === 'light' ? 'landing-light' : ''}`}>
      {/* ─── NAV ─── */}
      <nav style={{ position: 'fixed', top: 0, left: 0, right: 0, zIndex: 100, padding: '0 24px', height: 64, display: 'flex', alignItems: 'center', justifyContent: 'space-between', background: scrolled ? 'rgba(5,3,15,0.92)' : 'transparent', backdropFilter: scrolled ? 'blur(16px)' : 'none', borderBottom: scrolled ? '1px solid rgba(192,132,252,0.12)' : '1px solid transparent', transition: 'all 0.3s ease' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 10, cursor: 'pointer' }}>
          <span className="landing-logo-star">✦</span>
          <span style={{ fontFamily: 'Playfair Display, serif', fontSize: '1.1rem', fontWeight: 700, color: '#f0e6ff', animation: 'nav-logo-glow 3s ease-in-out infinite', letterSpacing: '0.05em' }}>Fashion Cases</span>
        </div>

        <div style={{ display: 'flex', gap: 32, alignItems: 'center' }}>
          <div style={{ display: 'flex', gap: 28 }}>
            {navLinks.map(label => (
              <a key={label} href={`#${label.toLowerCase().replace(/ /g, '-')}`} onClick={label === t('nav.play') ? (e) => { e.preventDefault(); onPlayDemo(); } : undefined} style={{ color: label === t('nav.play') ? '#f0abfc' : 'rgba(240,230,255,0.6)', textDecoration: 'none', fontSize: '0.82rem', letterSpacing: '0.04em', fontWeight: label === t('nav.play') ? 600 : 400, transition: 'color 0.2s' }}>{label}</a>
            ))}
          </div>
          <button className="landing-theme-toggle" type="button" onClick={() => setLandingTheme(value => value === 'dark' ? 'light' : 'dark')} aria-label={landingTheme === 'dark' ? t('theme.light') : t('theme.dark')}>
            <span>{landingTheme === 'dark' ? '☼' : '◐'}</span>{landingTheme === 'dark' ? t('theme.light') : t('theme.dark')}
          </button>
          {/* Language toggle */}
          <button onClick={() => setLang(lang === 'ru' ? 'en' : 'ru')} style={{ display: 'flex', alignItems: 'center', gap: 5, background: 'rgba(255,255,255,0.06)', border: '1px solid rgba(192,132,252,0.2)', borderRadius: 16, padding: '6px 12px', color: '#c4b5fd', fontSize: '0.72rem', cursor: 'pointer', fontWeight: 600 }}>
            <span style={{ fontSize: '0.9rem' }}>{lang === 'ru' ? '🇷🇺' : '🇬🇧'}</span>
            <span>{lang === 'ru' ? 'RU' : 'EN'}</span>
            <span style={{ opacity: 0.4, fontSize: '0.65rem' }}>↔</span>
          </button>
          <button className="landing-header-button" onClick={onPlayDemo} style={{ background: 'linear-gradient(135deg, #7c3aed, #c026d3)', border: 'none', borderRadius: 22, padding: '8px 20px', color: 'white', fontSize: '0.82rem', fontWeight: 600, cursor: 'pointer', letterSpacing: '0.04em', boxShadow: '0 0 16px rgba(192,38,211,0.35)', transition: 'transform 0.2s, box-shadow 0.2s' }} onMouseEnter={e => { (e.currentTarget as HTMLButtonElement).style.transform = 'scale(1.05)'; (e.currentTarget as HTMLButtonElement).style.boxShadow = '0 0 24px rgba(192,38,211,0.55)'; }} onMouseLeave={e => { (e.currentTarget as HTMLButtonElement).style.transform = 'scale(1)'; (e.currentTarget as HTMLButtonElement).style.boxShadow = '0 0 16px rgba(192,38,211,0.35)'; }}>{t('nav.playDemo')}</button>
        </div>
      </nav>

      {/* ─── HERO ─── */}
      <section id="hero" style={{ position: 'relative', minHeight: '100vh', display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', overflow: 'hidden', padding: '80px 24px 60px', textAlign: 'center' }}>
        <div style={{ position: 'absolute', top: '20%', left: '50%', width: '70vw', height: '70vw', maxWidth: 700, background: 'radial-gradient(circle, rgba(124,58,237,0.35) 0%, rgba(192,38,211,0.15) 40%, transparent 70%)', borderRadius: '50%', animation: 'orb-pulse 6s ease-in-out infinite', pointerEvents: 'none' }} />
        <div style={{ position: 'absolute', bottom: '10%', right: '-10%', width: '40vw', height: '40vw', maxWidth: 400, background: 'radial-gradient(circle, rgba(251,191,36,0.12) 0%, transparent 65%)', borderRadius: '50%', pointerEvents: 'none' }} />
        <div style={{ position: 'absolute', top: '5%', left: '-5%', width: '30vw', height: '30vw', maxWidth: 300, background: 'radial-gradient(circle, rgba(96,165,250,0.1) 0%, transparent 65%)', borderRadius: '50%', pointerEvents: 'none' }} />

        <div className="hero-showcase hero-showcase-left">
          <div className="hero-showcase-art rarity-glow rarity-legendary"><img className="asset-cutout" src={caseBasicImg} alt="Fashion case" /></div>
          <span className="hero-showcase-rarity">✦ {t('rarity.legendary')}</span>
          <strong>{t('hero.caseCaption')}</strong>
        </div>
        <div className="hero-showcase hero-showcase-right">
          <div className="hero-showcase-art rarity-glow rarity-rare"><img className="asset-cutout" src={bootsImg} alt="Fashion boots" /></div>
          <span className="hero-showcase-rarity hero-showcase-blue">◆ {t('rarity.rare')}</span>
          <strong>{t('hero.itemCaption')}</strong>
        </div>

        {[...Array(20)].map((_, i) => (
          <div key={i} style={{ position: 'absolute', width: Math.random() * 3 + 1, height: Math.random() * 3 + 1, background: ['#f0abfc', '#fbbf24', '#93c5fd', 'white'][i % 4], borderRadius: '50%', left: `${Math.random() * 100}%`, top: `${Math.random() * 100}%`, opacity: Math.random() * 0.5 + 0.2, animation: `float-up ${4 + Math.random() * 6}s ease-in-out infinite`, animationDelay: `${Math.random() * 5}s`, pointerEvents: 'none' }} />
        ))}

        <div className="hero-center-card">
        <div style={{ display: 'inline-flex', alignItems: 'center', gap: 8, background: 'rgba(192,132,252,0.1)', border: '1px solid rgba(192,132,252,0.25)', borderRadius: 30, padding: '6px 16px', fontSize: '0.72rem', letterSpacing: '0.15em', color: '#c4b5fd', textTransform: 'uppercase', marginBottom: 28, animation: 'fade-in 1s ease forwards' }}>
          <span style={{ color: '#f0abfc' }}>✦</span>{t('hero.badge')}<span style={{ color: '#f0abfc' }}>✦</span>
        </div>

        <h1 style={{ fontFamily: 'Playfair Display, serif', fontSize: 'clamp(3rem, 10vw, 7.5rem)', fontWeight: 900, margin: '0 0 0', lineHeight: 0.95, letterSpacing: '-0.02em', animation: 'slide-up 0.9s ease forwards' }}>
          <span className="hero-title-primary" style={{ display: 'block', color: '#f0e6ff' }}>{t('hero.title1')}</span>
          <span className="gradient-text hero-title-accent" style={{ display: 'block' }}>{t('hero.title2')}</span>
        </h1>

        <p style={{ fontFamily: 'Playfair Display, serif', fontSize: 'clamp(1rem, 2.5vw, 1.4rem)', color: 'rgba(240,230,255,0.55)', fontStyle: 'italic', margin: '20px 0 36px', letterSpacing: '0.08em', animation: 'slide-up 0.9s ease 0.15s both forwards' }}>{t('hero.tagline')}</p>

        <p style={{ fontSize: 'clamp(0.9rem, 2vw, 1.05rem)', color: 'rgba(240,230,255,0.5)', maxWidth: 520, lineHeight: 1.7, margin: '0 0 44px', animation: 'slide-up 0.9s ease 0.25s both forwards' }}>{t('hero.desc')}</p>

        <div style={{ display: 'flex', gap: 14, flexWrap: 'wrap', justifyContent: 'center', animation: 'slide-up 0.9s ease 0.35s both forwards' }}>
          <button className="landing-primary-button" onClick={onPlayDemo} style={{ background: 'linear-gradient(135deg, #7c3aed, #c026d3)', border: 'none', borderRadius: 50, padding: '16px 36px', color: 'white', fontSize: '1rem', fontWeight: 700, fontFamily: 'Poppins, sans-serif', cursor: 'pointer', letterSpacing: '0.04em', boxShadow: '0 0 40px rgba(192,38,211,0.45), 0 8px 30px rgba(0,0,0,0.4)', transition: 'transform 0.2s, box-shadow 0.2s' }} onMouseEnter={e => { (e.currentTarget as HTMLButtonElement).style.transform = 'translateY(-3px) scale(1.03)'; (e.currentTarget as HTMLButtonElement).style.boxShadow = '0 0 60px rgba(192,38,211,0.6), 0 12px 40px rgba(0,0,0,0.4)'; }} onMouseLeave={e => { (e.currentTarget as HTMLButtonElement).style.transform = 'translateY(0) scale(1)'; (e.currentTarget as HTMLButtonElement).style.boxShadow = '0 0 40px rgba(192,38,211,0.45), 0 8px 30px rgba(0,0,0,0.4)'; }}>✦ {t('hero.cta')}</button>
        </div>
        <p style={{ color: 'rgba(240,230,255,0.25)', fontSize: '0.72rem', marginTop: 14, animation: 'fade-in 1.5s ease 0.5s both' }}>{t('hero.ctaSub')}</p>
        </div>

        <div className="hero-scroll-hint" style={{ position: 'absolute', bottom: 28, left: '50%', transform: 'translateX(-50%)', display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 6, animation: 'fade-in 1.5s ease 1s both' }}>
          <div style={{ color: 'rgba(240,230,255,0.3)', fontSize: '0.62rem', letterSpacing: '0.12em', textTransform: 'uppercase' }}>{t('hero.scroll')}</div>
          <div style={{ width: 1, height: 30, background: 'linear-gradient(180deg, rgba(192,132,252,0.5), transparent)' }} />
        </div>
      </section>

      {/* ─── TICKER ─── */}
      <div style={{ overflow: 'hidden', background: 'linear-gradient(90deg, rgba(124,58,237,0.2), rgba(192,38,211,0.2))', borderTop: '1px solid rgba(192,132,252,0.15)', borderBottom: '1px solid rgba(192,132,252,0.15)', padding: '12px 0' }}>
        <div style={{ display: 'flex', animation: 'ticker-scroll 20s linear infinite', width: 'max-content' }}>
          {[...Array(2)].map((_, rep) => (
            <div key={rep} style={{ display: 'flex', gap: 48, paddingRight: 48 }}>
              {[`✦ ${t('rarity.common')}`, `★ ${t('rarity.rare')}`, `◆ ${t('rarity.mythic')}`, `✦ ${t('rarity.legendary')}`, `🌟 ${t('rarity.star')}`].map((txt, i) => (
                <span key={i} style={{ color: i % 5 === 4 ? '#f0abfc' : i % 5 === 3 ? '#f97316' : i % 5 === 2 ? '#a855f7' : i % 5 === 1 ? '#60a5fa' : 'rgba(240,230,255,0.4)', fontSize: '0.72rem', letterSpacing: '0.12em', fontWeight: 500, whiteSpace: 'nowrap', textTransform: 'uppercase' }}>{txt}</span>
              ))}
            </div>
          ))}
        </div>
      </div>

      {/* ─── FEATURES ─── */}
      <section id={t('nav.features').toLowerCase().replace(/ /g, '-')} style={{ padding: 'clamp(60px, 8vw, 120px) clamp(20px, 5vw, 80px)' }}>
        <div style={{ maxWidth: 1100, margin: '0 auto' }}>
          <div className="reveal" style={{ textAlign: 'center', marginBottom: 60 }}>
            <p style={{ color: '#c084fc', fontSize: '0.72rem', letterSpacing: '0.2em', textTransform: 'uppercase', marginBottom: 12 }}>{t('features.subtitle')}</p>
            <h2 className="feature-section-title" style={{ fontFamily: 'Playfair Display, serif', fontSize: 'clamp(2rem, 5vw, 3.5rem)', fontWeight: 900, margin: 0, color: '#f0e6ff' }}>{t('features.title')}</h2>
          </div>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))', gap: 16 }}>
            {features.map((f, i) => (
              <div key={f.title} className={`reveal reveal-delay-${(i % 3) + 1} card-hover feature-card`} style={{ background: 'rgba(255,255,255,0.025)', border: '1px solid rgba(255,255,255,0.06)', borderRadius: 20, padding: '28px 24px', position: 'relative', overflow: 'hidden' }}>
                <div style={{ position: 'absolute', top: 0, left: 0, right: 0, height: 1, background: `linear-gradient(90deg, transparent, ${f.color}40, transparent)` }} />
                <div className="feature-icon" style={{ color: f.color, fontSize: '2rem', marginBottom: 16, filter: `drop-shadow(0 0 8px ${f.color}60)` }}>{f.icon}</div>
                <h3 className="feature-title" style={{ fontFamily: 'Playfair Display, serif', fontSize: '1.1rem', fontWeight: 700, color: '#f0e6ff', margin: '0 0 10px' }}>{f.title}</h3>
                <p style={{ color: 'rgba(240,230,255,0.5)', fontSize: '0.85rem', lineHeight: 1.7, margin: 0 }}>{f.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ─── RARITY SHOWCASE ─── */}
      <section id={t('nav.rarities').toLowerCase().replace(/ /g, '-')} style={{ padding: 'clamp(60px, 8vw, 120px) clamp(20px, 5vw, 80px)', background: 'radial-gradient(ellipse at 50% 0%, rgba(124,58,237,0.12) 0%, transparent 60%)' }}>
        <div style={{ maxWidth: 1100, margin: '0 auto' }}>
          <div className="reveal" style={{ textAlign: 'center', marginBottom: 60 }}>
            <h2 style={{ fontFamily: 'Playfair Display, serif', fontSize: 'clamp(2rem, 5vw, 3.5rem)', fontWeight: 900, margin: '0 0 16px', color: '#f0e6ff' }}>{t('rarities.title')}</h2>
            <p style={{ color: 'rgba(240,230,255,0.45)', fontSize: '0.95rem', maxWidth: 500, margin: '0 auto' }}>{t('rarities.subtitle')}</p>
          </div>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(180px, 1fr))', gap: 14 }}>
            {rarities.map((r, i) => (
              <div key={r.label} className={`reveal reveal-delay-${i + 1} card-hover`} style={{ background: r.bg, border: `1.5px solid ${r.color}40`, borderRadius: 20, padding: '28px 16px', textAlign: 'center', position: 'relative', overflow: 'hidden', boxShadow: i >= 3 ? `0 0 30px ${r.glow}` : 'none' }}>
                <div style={{ position: 'absolute', top: 0, left: 0, right: 0, height: 3, background: i === 4 ? 'linear-gradient(90deg, #f0abfc, #60a5fa, #fbbf24, #f0abfc)' : r.color, backgroundSize: '300%', animation: i === 4 ? 'gradient-shift 3s ease infinite' : 'none' }} />
                <div style={{ fontSize: '2.5rem', marginBottom: 14, animation: i >= 3 ? `rarity-float ${2.5 + i * 0.3}s ease-in-out infinite` : 'none', filter: i === 4 ? 'drop-shadow(0 0 12px #f0abfc) drop-shadow(0 0 24px #e879f9)' : i === 3 ? 'drop-shadow(0 0 10px #f97316)' : i === 2 ? 'drop-shadow(0 0 8px #a855f7)' : i === 1 ? 'drop-shadow(0 0 6px #60a5fa)' : 'none' }}>{r.emoji}</div>
                <div style={{ fontFamily: 'Playfair Display, serif', fontSize: '0.95rem', fontWeight: 700, color: r.color, marginBottom: 8, letterSpacing: i === 4 ? '0.08em' : '0.02em' }}>{r.label}</div>
                <p style={{ fontSize: '0.72rem', color: 'rgba(240,230,255,0.45)', lineHeight: 1.6, margin: 0 }}>{r.desc}</p>
                <div style={{ marginTop: 14, height: 3, background: 'rgba(255,255,255,0.06)', borderRadius: 2, overflow: 'hidden' }}>
                  <div style={{ height: '100%', width: `${[50, 30, 15, 4, 1][i] * 2}%`, background: r.color, borderRadius: 2, opacity: 0.7 }} />
                </div>
                <div style={{ fontSize: '0.6rem', color: 'rgba(240,230,255,0.3)', marginTop: 4 }}>{[50, 30, 15, 4, 1][i]}%</div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ─── HOW IT WORKS ─── */}
      <section id={t('nav.howItWorks').toLowerCase().replace(/ /g, '-')} style={{ padding: 'clamp(60px, 8vw, 120px) clamp(20px, 5vw, 80px)' }}>
        <div style={{ maxWidth: 900, margin: '0 auto' }}>
          <div className="reveal" style={{ textAlign: 'center', marginBottom: 64 }}>
            <h2 style={{ fontFamily: 'Playfair Display, serif', fontSize: 'clamp(2rem, 5vw, 3.5rem)', fontWeight: 900, margin: 0, color: '#f0e6ff' }}>{t('steps.title')}</h2>
            <p style={{ color: 'rgba(240,230,255,0.45)', fontSize: '0.95rem', maxWidth: 500, margin: '16px auto 0' }}>{t('steps.subtitle')}</p>
          </div>
          <div style={{ display: 'flex', flexDirection: 'column', gap: 0 }}>
            {steps.map((step, i) => (
              <div key={step.n} className={`reveal reveal-delay-${i + 1}`} style={{ display: 'grid', gridTemplateColumns: '80px 1fr', gap: 24, paddingBottom: i < steps.length - 1 ? 40 : 0, position: 'relative' }}>
                <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
                  <div style={{ width: 52, height: 52, borderRadius: '50%', background: 'linear-gradient(135deg, rgba(124,58,237,0.3), rgba(192,38,211,0.2))', border: '1.5px solid rgba(192,132,252,0.35)', display: 'flex', alignItems: 'center', justifyContent: 'center', fontFamily: 'Playfair Display, serif', fontSize: '1.1rem', fontWeight: 700, color: '#c084fc', flexShrink: 0 }}>{step.n}</div>
                  {i < steps.length - 1 && <div style={{ width: 1, flex: 1, marginTop: 8, background: 'linear-gradient(180deg, rgba(192,132,252,0.3), transparent)' }} />}
                </div>
                <div style={{ paddingTop: 12 }}>
                  <h3 style={{ fontFamily: 'Playfair Display, serif', fontSize: '1.2rem', fontWeight: 700, color: '#f0e6ff', margin: '0 0 10px' }}>{step.title}</h3>
                  <p style={{ color: 'rgba(240,230,255,0.5)', fontSize: '0.9rem', lineHeight: 1.7, margin: 0 }}>{step.desc}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ─── CTA ─── */}
      <section id={t('nav.play').toLowerCase().replace(/ /g, '-')} style={{ padding: 'clamp(80px, 10vw, 140px) clamp(20px, 5vw, 80px)' }}>
        <div style={{ maxWidth: 700, margin: '0 auto', textAlign: 'center' }}>
          <div className="reveal" style={{ marginBottom: 48 }}>
            <h2 style={{ fontFamily: 'Playfair Display, serif', fontSize: 'clamp(2.2rem, 6vw, 4rem)', fontWeight: 900, margin: '0 0 20px', color: '#f0e6ff', lineHeight: 1.1 }}>{t('cta.title')}</h2>
            <p style={{ color: 'rgba(240,230,255,0.5)', fontSize: '1rem', lineHeight: 1.7, marginBottom: 40 }}>{t('cta.subtitle')}</p>
            <button onClick={onPlayDemo} style={{ background: 'linear-gradient(135deg, #7c3aed, #c026d3, #7c3aed)', backgroundSize: '200%', border: 'none', borderRadius: 50, padding: '18px 48px', color: 'white', fontSize: '1.05rem', fontWeight: 700, fontFamily: 'Poppins, sans-serif', cursor: 'pointer', letterSpacing: '0.05em', boxShadow: '0 0 60px rgba(192,38,211,0.5), 0 8px 40px rgba(0,0,0,0.5)', animation: 'gradient-shift 3s ease infinite', transition: 'transform 0.2s', display: 'block', margin: '0 auto 24px' }} onMouseEnter={e => (e.currentTarget as HTMLButtonElement).style.transform = 'scale(1.05)'} onMouseLeave={e => (e.currentTarget as HTMLButtonElement).style.transform = 'scale(1)'}>✦ {t('cta.button')}</button>
          </div>

          <div className="reveal reveal-delay-2">
            <div style={{ background: 'rgba(255,255,255,0.03)', border: '1px solid rgba(255,255,255,0.07)', borderRadius: 20, padding: '28px 24px' }}>
              <p style={{ color: '#c4b5fd', fontSize: '0.85rem', marginBottom: 16, fontWeight: 500 }}>{t('footer.email')}</p>
              {!emailSent ? (
                <form onSubmit={handleEmail} style={{ display: 'flex', gap: 10, maxWidth: 400, margin: '0 auto', flexWrap: 'wrap' }}>
                  <input type="email" value={email} onChange={e => setEmail(e.target.value)} placeholder={t('footer.emailPlaceholder')} required style={{ flex: 1, minWidth: 180, padding: '12px 16px', borderRadius: 12, border: '1px solid rgba(192,132,252,0.25)', background: 'rgba(255,255,255,0.05)', color: '#f0e6ff', fontSize: '0.875rem', outline: 'none', fontFamily: 'Poppins, sans-serif' }} />
                  <button type="submit" style={{ padding: '12px 22px', borderRadius: 12, border: 'none', background: 'linear-gradient(135deg, #7c3aed, #c026d3)', color: 'white', fontSize: '0.85rem', fontWeight: 600, cursor: 'pointer', fontFamily: 'Poppins, sans-serif', whiteSpace: 'nowrap' }}>{t('footer.emailButton')}</button>
                </form>
              ) : (
                <div className="email-success"><span>✓</span><div><strong>{t('footer.emailSentTitle')}</strong><p>{t('footer.emailSent')}</p></div></div>
              )}
            </div>
          </div>
        </div>
      </section>

      {/* ─── FOOTER ─── */}
      <footer style={{ borderTop: '1px solid rgba(192,132,252,0.1)', padding: '40px clamp(20px, 5vw, 80px)' }}>
        <div style={{ maxWidth: 1100, margin: '0 auto', display: 'grid', gridTemplateColumns: 'auto 1fr auto', alignItems: 'center', gap: 20, flexWrap: 'wrap' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
            <div style={{ width: 32, height: 32, background: 'linear-gradient(135deg, #7c3aed, #c026d3)', borderRadius: 8, display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '0.9rem' }}>✦</div>
            <span style={{ fontFamily: 'Playfair Display, serif', fontSize: '0.95rem', fontWeight: 700, color: 'rgba(240,230,255,0.6)' }}>Fashion Cases</span>
          </div>
          <div style={{ display: 'flex', gap: 24, justifyContent: 'center', flexWrap: 'wrap' }}>
            {navLinks.slice(0, 3).map(link => <a key={link} href={`#${link.toLowerCase().replace(/ /g, '-')}`} style={{ color: 'rgba(240,230,255,0.3)', fontSize: '0.75rem', textDecoration: 'none', transition: 'color 0.2s', letterSpacing: '0.04em' }} onMouseEnter={e => (e.currentTarget as HTMLAnchorElement).style.color = '#c4b5fd'} onMouseLeave={e => (e.currentTarget as HTMLAnchorElement).style.color = 'rgba(240,230,255,0.3)'}>{link}</a>)}
          </div>
          <div style={{ color: 'rgba(240,230,255,0.2)', fontSize: '0.7rem', textAlign: 'right' }}>© 2026 Fashion Cases</div>
        </div>
      </footer>
    </div>
  );
}
