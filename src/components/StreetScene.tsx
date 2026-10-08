import { useCallback, useEffect, useMemo, useState, type CSSProperties } from 'react';
import Character from './Character';
import { useI18n } from '../i18n';

type StreetTarget = 'home' | 'market' | 'auction' | 'fusion' | 'boutique' | 'park';
type StreetPhase = 'idle' | 'walking' | 'entering';

interface StreetSceneProps {
  gender: 'female' | 'male';
  coins: number;
  isNight: boolean;
  onBack: () => void;
  onMarketReached: () => void;
  onAuctionReached: () => void;
  onFusionReached: () => void;
}

interface Location {
  id: StreetTarget;
  label: string;
  description: string;
  emoji: string;
  color: string;
  glow: string;
  x: number;
  y: number;
  width: number;
  height: number;
  roof: string;
}

const LOCATIONS: Location[] = [
  { id: 'home', label: 'street.home', description: 'street.home.desc', emoji: '⌂', color: '#5b3c93', glow: '#c084fc', x: 12, y: 54, width: 18, height: 25, roof: '#34205f' },
  { id: 'market', label: 'street.market', description: 'street.market.desc', emoji: '✦', color: '#24547d', glow: '#60a5fa', x: 35, y: 35, width: 22, height: 33, roof: '#173b62' },
  { id: 'fusion', label: 'street.fusion', description: 'street.fusion.desc', emoji: '◇', color: '#7a3c66', glow: '#e879f9', x: 61, y: 47, width: 18, height: 29, roof: '#4f244f' },
  { id: 'auction', label: 'street.auction', description: 'street.auction.desc', emoji: '◆', color: '#326044', glow: '#86efac', x: 84, y: 31, width: 21, height: 36, roof: '#214b37' },
  { id: 'boutique', label: 'street.boutique', description: 'street.boutique.desc', emoji: '◇', color: '#9a5d39', glow: '#fbbf24', x: 79, y: 72, width: 16, height: 22, roof: '#65351f' },
  { id: 'park', label: 'street.park', description: 'street.park.desc', emoji: '✿', color: '#27665a', glow: '#5eead4', x: 21, y: 22, width: 17, height: 16, roof: '#184d46' },
];

export default function StreetScene({ gender, coins, isNight, onBack, onMarketReached, onAuctionReached, onFusionReached }: StreetSceneProps) {
  const { t } = useI18n();
  const [target, setTarget] = useState<StreetTarget | null>(null);
  const [phase, setPhase] = useState<StreetPhase>('idle');
  const [charPosition, setCharPosition] = useState({ x: 50, y: 78 });
  const [hovered, setHovered] = useState<StreetTarget | null>(null);

  const palette = useMemo(() => isNight ? {
    sky: 'linear-gradient(145deg, #08051a 0%, #181241 50%, #281450 100%)',
    ground: 'linear-gradient(145deg, #15112c, #0a1324)',
    road: 'rgba(192,132,252,.18)',
    grid: 'rgba(192,132,252,.08)',
    text: '#f0e6ff',
    muted: '#9584b5',
    overlay: 'rgba(5,3,15,.76)',
    sun: 'radial-gradient(circle at 35% 35%, #fff7d6, #fbbf24)',
  } : {
    sky: 'linear-gradient(145deg, #a9d7f6 0%, #dceeff 55%, #f7d9bf 100%)',
    ground: 'linear-gradient(145deg, #d8c6ba, #b4c8cd)',
    road: 'rgba(64,98,120,.2)',
    grid: 'rgba(47,75,95,.12)',
    text: '#172239',
    muted: '#52657b',
    overlay: 'rgba(240,248,255,.72)',
    sun: 'radial-gradient(circle at 35% 35%, #fffbea, #f59e0b)',
  }, [isNight]);

  useEffect(() => {
    if (!target) return;
    const location = LOCATIONS.find(item => item.id === target);
    if (!location) return;
    setPhase('walking');
    setCharPosition({ x: location.x, y: Math.min(78, location.y + 14) });
    const enterTimer = window.setTimeout(() => setPhase('entering'), 850);
    const finishTimer = window.setTimeout(() => {
      if (target === 'home') onBack();
      if (target === 'market') onMarketReached();
      if (target === 'auction') onAuctionReached();
      if (target === 'fusion') onFusionReached();
      if (target === 'boutique' || target === 'park') setTarget(null);
      setPhase('idle');
    }, 1550);
    return () => { window.clearTimeout(enterTimer); window.clearTimeout(finishTimer); };
  }, [target, onBack, onMarketReached, onAuctionReached, onFusionReached]);

  const selectLocation = useCallback((location: Location) => {
    if (phase !== 'idle') return;
    setTarget(location.id);
  }, [phase]);

  return (
    <div className={`street-scene scene-enter ${isNight ? 'street-night' : 'street-day'}`} style={{ '--street-sky': palette.sky, '--street-ground': palette.ground, '--street-road': palette.road, '--street-grid': palette.grid, '--street-text': palette.text, '--street-muted': palette.muted, '--street-overlay': palette.overlay } as CSSProperties}>
      <div className="street-sky-layer">
        <div className="street-sun" style={{ background: palette.sun }} />
        {isNight && [...Array(28)].map((_, index) => <i key={index} className="street-star" style={{ left: `${(index * 37) % 100}%`, top: `${(index * 23) % 57}%`, animationDelay: `${index * 0.1}s` }} />)}
        {!isNight && <div className="street-cloud cloud-one" />}
        {!isNight && <div className="street-cloud cloud-two" />}
      </div>

      <div className="street-map">
        <div className="street-road street-road-main" />
        <div className="street-road street-road-cross" />
        <div className="street-road street-road-ring" />
        <div className="street-plaza"><span>✦</span></div>
        <div className="street-trees">
          {[...Array(9)].map((_, index) => <div key={index} className="street-tree" style={{ left: `${8 + ((index * 31) % 86)}%`, top: `${18 + ((index * 47) % 66)}%` }}><span /><b /></div>)}
        </div>

        {LOCATIONS.map(location => {
          const active = target === location.id;
          const highlighted = hovered === location.id || active;
          return (
            <button key={location.id} type="button" className={`street-building ${active ? 'building-active' : ''}`} style={{ left: `${location.x}%`, top: `${location.y}%`, width: `${location.width}%`, height: `${location.height}%`, '--building-color': location.color, '--building-roof': location.roof, '--building-glow': location.glow } as CSSProperties} onMouseEnter={() => setHovered(location.id)} onMouseLeave={() => setHovered(null)} onClick={() => selectLocation(location)}>
              <span className="building-roof" />
              <span className="building-sign" style={{ color: highlighted ? location.glow : palette.text }}>{location.emoji}</span>
              <span className="building-windows">{[0, 1, 2, 3].map(index => <i key={index} className={highlighted ? 'window-lit' : ''} />)}</span>
              <strong style={{ color: highlighted ? location.glow : palette.text }}>{t(location.label)}</strong>
              {hovered === location.id && phase === 'idle' && <small style={{ color: palette.text }}>{t(location.description)}</small>}
            </button>
          );
        })}

        <div className="street-character" style={{ left: `${charPosition.x}%`, top: `${charPosition.y}%` }}>
          <div className={phase === 'entering' ? 'character-entering' : ''}><Character gender={gender} walking={phase === 'walking'} size={62} /></div>
          {phase === 'entering' && <div className="entry-doors"><span /><span /></div>}
        </div>
      </div>

      {phase === 'entering' && <div className="street-camera-transition"><span>{target ? t(LOCATIONS.find(location => location.id === target)?.label ?? '') : ''}</span></div>}

      <div className="street-hud street-hud-top">
        <div><strong>{t('street.title')}</strong><span className="hud-dot" /><small>{isNight ? t('street.nightMode') : t('street.dayMode')}</small></div>
        <div className="coin-pill"><span>🪙</span>{coins.toLocaleString()}</div>
      </div>
      <div className="street-hud street-hud-bottom">
        <button type="button" className="street-back" onClick={onBack}>← {t('street.home')}</button>
        <span>{phase === 'idle' ? t('street.tapHint') : t('street.walking')}</span>
        <div className="compass">N</div>
      </div>
    </div>
  );
}
