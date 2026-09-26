interface CharacterProps {
  gender: 'female' | 'male';
  walking?: boolean;
  facing?: 'left' | 'right' | 'forward';
  size?: number;
  outfit?: {
    topColor?: string;
    bottomColor?: string;
    shoeColor?: string;
  };
}

export default function Character({
  gender,
  walking = false,
  facing = 'forward',
  size = 110,
  outfit,
}: CharacterProps) {
  const state = walking ? 'char-walking' : 'char-idle';
  const flip = facing === 'left' ? 'scale(-1,1)' : undefined;

  return (
    <div
      className={state}
      style={{
        width: size,
        height: size * 1.8,
        display: 'flex',
        alignItems: 'flex-end',
        justifyContent: 'center',
        transform: flip,
        transformOrigin: 'center bottom',
        willChange: 'transform',
      }}
    >
      {gender === 'female' ? (
        <FemaleSVG size={size} outfit={outfit} />
      ) : (
        <MaleSVG size={size} outfit={outfit} />
      )}
    </div>
  );
}

function FemaleSVG({ size, outfit }: { size: number; outfit?: CharacterProps['outfit'] }) {
  const topColor = outfit?.topColor ?? '#c084fc';
  const bottomColor = outfit?.bottomColor ?? '#9333ea';
  const shoeColor = outfit?.shoeColor ?? '#1c1917';
  const s = size / 80;

  return (
    <svg
      viewBox="0 0 80 180"
      width={size}
      height={size * 2.25}
      style={{ overflow: 'visible' }}
    >
      {/* ── Shadow ── */}
      <ellipse cx="40" cy="178" rx="18" ry="4" fill="rgba(0,0,0,0.3)" />

      {/* ── Hair back ── */}
      <path d="M 22 32 Q 14 70 18 110" stroke="#3d1900" strokeWidth={8} fill="none" strokeLinecap="round" />
      <path d="M 58 32 Q 66 70 62 110" stroke="#3d1900" strokeWidth={8} fill="none" strokeLinecap="round" />

      {/* ── Head ── */}
      <ellipse cx="40" cy="26" rx="18" ry="20" fill="#ffdab9" />

      {/* ── Hair top ── */}
      <path d="M 22 20 Q 40 4 58 20 Q 60 34 55 26 Q 40 14 25 26 Z" fill="#3d1900" />
      <path d="M 54 22 Q 58 16 60 20" fill="#3d1900" />

      {/* ── Ears ── */}
      <ellipse cx="22" cy="27" rx="3.5" ry="4" fill="#ffc9a0" />
      <ellipse cx="58" cy="27" rx="3.5" ry="4" fill="#ffc9a0" />

      {/* ── Face ── */}
      {/* Eyes white */}
      <ellipse cx="33" cy="24" rx="5" ry="5.5" fill="white" />
      <ellipse cx="47" cy="24" rx="5" ry="5.5" fill="white" />
      {/* Iris */}
      <ellipse cx="33" cy="25" rx="3" ry="3.5" fill="#3d1900" />
      <ellipse cx="47" cy="25" rx="3" ry="3.5" fill="#3d1900" />
      {/* Highlight */}
      <circle cx="34.5" cy="23.5" r="1.2" fill="white" />
      <circle cx="48.5" cy="23.5" r="1.2" fill="white" />
      {/* Lashes */}
      <line x1="28" y1="19.5" x2="26" y2="17" stroke="#1a1200" strokeWidth="1.2" strokeLinecap="round" />
      <line x1="32" y1="18.5" x2="31" y2="16" stroke="#1a1200" strokeWidth="1.2" strokeLinecap="round" />
      <line x1="36" y1="19" x2="36" y2="16.5" stroke="#1a1200" strokeWidth="1.2" strokeLinecap="round" />
      <line x1="44" y1="19" x2="44" y2="16.5" stroke="#1a1200" strokeWidth="1.2" strokeLinecap="round" />
      <line x1="48" y1="18.5" x2="49" y2="16" stroke="#1a1200" strokeWidth="1.2" strokeLinecap="round" />
      <line x1="52" y1="19.5" x2="54" y2="17" stroke="#1a1200" strokeWidth="1.2" strokeLinecap="round" />
      {/* Brows */}
      <path d="M 27 18 Q 33 15 38 17" stroke="#3d1900" strokeWidth="1.5" fill="none" strokeLinecap="round" />
      <path d="M 42 17 Q 47 15 53 18" stroke="#3d1900" strokeWidth="1.5" fill="none" strokeLinecap="round" />
      {/* Nose */}
      <path d="M 40 30 Q 38 36 40 37 Q 42 36 40 30" fill="none" stroke="#e8a080" strokeWidth="1" />
      {/* Lips */}
      <path d="M 34 41 Q 40 38 46 41" stroke="#e8749a" strokeWidth="1.5" fill="none" strokeLinecap="round" />
      <path d="M 34 41 Q 37 45 40 44 Q 43 45 46 41" fill="#f06090" fillOpacity="0.5" stroke="#f06090" strokeWidth="0.8" />
      {/* Blush */}
      <ellipse cx="27" cy="34" rx="5" ry="3" fill="#f097b0" fillOpacity="0.35" />
      <ellipse cx="53" cy="34" rx="5" ry="3" fill="#f097b0" fillOpacity="0.35" />

      {/* ── Neck ── */}
      <rect x="35" y="45" width="10" height="10" rx="3" fill="#ffc9a0" />

      {/* ── Body / dress ── */}
      <g className="char-body">
        {/* Dress top */}
        <path d="M 22 55 L 58 55 L 63 105 L 17 105 Z" fill={topColor} />
        {/* Collar V-line */}
        <path d="M 30 55 L 40 68 L 50 55" fill="none" stroke={bottomColor} strokeWidth="1.5" opacity="0.6" />
        {/* Waist seam */}
        <line x1="18" y1="80" x2="62" y2="80" stroke={bottomColor} strokeWidth="1" opacity="0.5" />
        {/* Skirt flare */}
        <path d="M 17 105 L 12 148 L 40 142 L 68 148 L 63 105 Z" fill={bottomColor} />
        {/* Skirt fold lines */}
        <path d="M 22 110 L 18 145" stroke={topColor} strokeWidth="0.8" opacity="0.4" />
        <path d="M 40 108 L 40 143" stroke={topColor} strokeWidth="0.8" opacity="0.4" />
        <path d="M 58 110 L 62 145" stroke={topColor} strokeWidth="0.8" opacity="0.4" />
      </g>

      {/* ── Left arm ── */}
      <g className="char-arm-l" style={{ transformOrigin: '20px 57px' }}>
        <path d="M 22 57 L 9 88" stroke={topColor} strokeWidth="12" strokeLinecap="round" />
        <ellipse cx="8" cy="91" rx="6" ry="4.5" fill="#ffc9a0" />
      </g>

      {/* ── Right arm ── */}
      <g className="char-arm-r" style={{ transformOrigin: '58px 57px' }}>
        <path d="M 58 57 L 71 88" stroke={topColor} strokeWidth="12" strokeLinecap="round" />
        <ellipse cx="72" cy="91" rx="6" ry="4.5" fill="#ffc9a0" />
      </g>

      {/* ── Left leg ── */}
      <g className="char-leg-l" style={{ transformOrigin: '28px 148px' }}>
        <rect x="22" y="148" width="12" height="18" fill="#ffc9a0" rx="4" />
        {/* Left shoe (heel) */}
        <path d="M 19 163 L 19 170 L 36 170 L 34 163 Z" fill={shoeColor} />
        <rect x="19" y="168" width="4" height="5" fill={shoeColor} />
      </g>

      {/* ── Right leg ── */}
      <g className="char-leg-r" style={{ transformOrigin: '52px 148px' }}>
        <rect x="46" y="148" width="12" height="18" fill="#ffc9a0" rx="4" />
        {/* Right shoe */}
        <path d="M 44 163 L 44 170 L 61 170 L 59 163 Z" fill={shoeColor} />
        <rect x="44" y="168" width="4" height="5" fill={shoeColor} />
      </g>
    </svg>
  );
}

function MaleSVG({ size, outfit }: { size: number; outfit?: CharacterProps['outfit'] }) {
  const topColor = outfit?.topColor ?? '#3b82f6';
  const bottomColor = outfit?.bottomColor ?? '#1e3a5f';
  const shoeColor = outfit?.shoeColor ?? '#1c1917';

  return (
    <svg viewBox="0 0 80 180" width={size} height={size * 2.25} style={{ overflow: 'visible' }}>
      {/* Shadow */}
      <ellipse cx="40" cy="178" rx="18" ry="4" fill="rgba(0,0,0,0.3)" />

      {/* Head */}
      <ellipse cx="40" cy="26" rx="17" ry="19" fill="#ffd4a8" />

      {/* Hair */}
      <path d="M 24 18 Q 40 5 56 18 Q 57 26 53 22 Q 40 12 27 22 Z" fill="#2c1500" />

      {/* Face */}
      <ellipse cx="33" cy="24" rx="4.5" ry="5" fill="white" />
      <ellipse cx="47" cy="24" rx="4.5" ry="5" fill="white" />
      <ellipse cx="33" cy="25" rx="2.8" ry="3.2" fill="#1a1200" />
      <ellipse cx="47" cy="25" rx="2.8" ry="3.2" fill="#1a1200" />
      <circle cx="34.2" cy="23.5" r="1.1" fill="white" />
      <circle cx="48.2" cy="23.5" r="1.1" fill="white" />
      <path d="M 28 18 Q 33 16 38 17.5" stroke="#2c1500" strokeWidth="1.5" fill="none" strokeLinecap="round" />
      <path d="M 42 17.5 Q 47 16 52 18" stroke="#2c1500" strokeWidth="1.5" fill="none" strokeLinecap="round" />
      <path d="M 40 30 Q 38 35 40 36 Q 42 35 40 30" fill="none" stroke="#d4956a" strokeWidth="1" />
      <path d="M 35 41 Q 40 45 45 41" stroke="#c97a7a" strokeWidth="1.5" fill="none" strokeLinecap="round" />

      {/* Neck */}
      <rect x="35" y="44" width="10" height="10" rx="2" fill="#f0b070" />

      {/* Body */}
      <g className="char-body">
        {/* Shirt */}
        <rect x="22" y="54" width="36" height="38" fill={topColor} rx="2" />
        {/* Collar */}
        <path d="M 30 54 L 40 64 L 50 54" fill="#fff" fillOpacity="0.1" />
        {/* Buttons */}
        <line x1="40" y1="66" x2="40" y2="90" stroke="white" strokeWidth="0.8" opacity="0.3" />
        {/* Pants */}
        <rect x="22" y="92" width="36" height="54" fill={bottomColor} rx="2" />
        {/* Belt */}
        <rect x="22" y="92" width="36" height="5" fill="#1a0a00" />
        <rect x="37" y="92" width="6" height="5" fill="#c4a030" />
        {/* Pants crease */}
        <line x1="36" y1="97" x2="34" y2="145" stroke="white" strokeWidth="0.6" opacity="0.15" />
        <line x1="44" y1="97" x2="46" y2="145" stroke="white" strokeWidth="0.6" opacity="0.15" />
        {/* Leg separation */}
        <line x1="40" y1="100" x2="40" y2="146" stroke={topColor} strokeWidth="0.8" opacity="0.2" />
      </g>

      {/* Left arm */}
      <g className="char-arm-l" style={{ transformOrigin: '22px 57px' }}>
        <path d="M 22 57 L 10 88" stroke={topColor} strokeWidth="13" strokeLinecap="round" />
        <ellipse cx="9.5" cy="91" rx="6" ry="4.5" fill="#f0b070" />
      </g>

      {/* Right arm */}
      <g className="char-arm-r" style={{ transformOrigin: '58px 57px' }}>
        <path d="M 58 57 L 70 88" stroke={topColor} strokeWidth="13" strokeLinecap="round" />
        <ellipse cx="70.5" cy="91" rx="6" ry="4.5" fill="#f0b070" />
      </g>

      {/* Left leg */}
      <g className="char-leg-l" style={{ transformOrigin: '30px 146px' }}>
        <rect x="22" y="146" width="16" height="18" fill={bottomColor} rx="3" />
        <path d="M 20 162 L 20 170 L 40 170 L 38 162 Z" fill={shoeColor} />
      </g>

      {/* Right leg */}
      <g className="char-leg-r" style={{ transformOrigin: '50px 146px' }}>
        <rect x="42" y="146" width="16" height="18" fill={bottomColor} rx="3" />
        <path d="M 40 162 L 40 170 L 60 170 L 58 162 Z" fill={shoeColor} />
      </g>
    </svg>
  );
}
