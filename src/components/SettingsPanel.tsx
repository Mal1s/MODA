import { useI18n, type Language } from '../i18n';

interface SettingsPanelProps {
  open: boolean;
  onClose: () => void;
  onSignOut: () => void;
  autoStreetTheme: boolean;
  manualNight: boolean;
  onAutoStreetThemeChange: (value: boolean) => void;
  onManualNightChange: (value: boolean) => void;
}

export default function SettingsPanel({ open, onClose, onSignOut, autoStreetTheme, manualNight, onAutoStreetThemeChange, onManualNightChange }: SettingsPanelProps) {
  const { lang, setLang, t } = useI18n();
  if (!open) return null;

  const languages: { id: Language; label: string; flag: string }[] = [
    { id: 'ru', label: 'Русский', flag: '🇷🇺' },
    { id: 'en', label: 'English', flag: '🇬🇧' },
  ];

  return (
    <div onClick={onClose} style={{ position: 'absolute', inset: 0, background: 'rgba(0,0,0,.6)', zIndex: 100, display: 'flex', alignItems: 'center', justifyContent: 'center', backdropFilter: 'blur(4px)' }}>
      <div onClick={e => e.stopPropagation()} style={{ width: 'min(90%, 340px)', background: 'linear-gradient(160deg, #0f0a24, #1a1035)', border: '1px solid rgba(147,197,253,.2)', borderRadius: 20, padding: 24, boxShadow: '0 20px 60px rgba(0,0,0,.5)' }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 20 }}>
          <h3 style={{ margin: 0, fontFamily: 'Playfair Display, serif', fontSize: '1.2rem', color: '#f0e6ff' }}>{t('settings.title')}</h3>
          <button type="button" onClick={onClose} style={{ border: 'none', background: 'rgba(255,255,255,.06)', color: '#9ca3af', fontSize: '1.2rem', cursor: 'pointer', borderRadius: 8, width: 32, height: 32 }}>×</button>
        </div>

        <div style={{ marginBottom: 20 }}>
          <div style={{ color: '#9ca3af', fontSize: '0.62rem', textTransform: 'uppercase', letterSpacing: '0.1em', marginBottom: 10 }}>{t('settings.language')}</div>
          <div style={{ display: 'flex', gap: 8 }}>
            {languages.map(l => (
              <button key={l.id} type="button" onClick={() => setLang(l.id)} style={{
                flex: 1, padding: '12px 8px', borderRadius: 12, border: `1.5px solid ${lang === l.id ? '#93c5fd' : 'rgba(255,255,255,.1)'}`,
                background: lang === l.id ? 'rgba(96,165,250,.12)' : 'rgba(255,255,255,.03)',
                color: lang === l.id ? '#bfdbfe' : '#9ca3af', fontSize: '0.75rem', fontWeight: 600, cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 6,
              }}>
                <span style={{ fontSize: '1.1rem' }}>{l.flag}</span>
                {l.label}
              </button>
            ))}
          </div>
        </div>

        <div style={{ marginBottom: 20 }}>
          <div style={{ color: '#9ca3af', fontSize: '0.62rem', textTransform: 'uppercase', letterSpacing: '0.1em', marginBottom: 10 }}>{t('settings.streetTheme')}</div>
          <button type="button" onClick={() => onAutoStreetThemeChange(!autoStreetTheme)} style={{ width: '100%', display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '11px 12px', border: '1px solid rgba(255,255,255,.1)', borderRadius: 12, background: 'rgba(255,255,255,.03)', color: '#dbeafe', cursor: 'pointer', fontSize: '0.72rem' }}>
            {t('settings.autoTheme')}<span style={{ width: 34, height: 20, padding: 2, borderRadius: 99, background: autoStreetTheme ? '#60a5fa' : '#374151', transition: 'background .2s' }}><span style={{ display: 'block', width: 16, height: 16, borderRadius: '50%', background: '#fff', transform: autoStreetTheme ? 'translateX(14px)' : 'translateX(0)', transition: 'transform .2s' }} /></span>
          </button>
          {!autoStreetTheme && <div style={{ display: 'flex', gap: 8, marginTop: 8 }}>
            {(['light', 'dark'] as const).map(mode => <button key={mode} type="button" onClick={() => onManualNightChange(mode === 'dark')} style={{ flex: 1, padding: '9px 6px', borderRadius: 10, border: `1px solid ${manualNight === (mode === 'dark') ? '#93c5fd' : 'rgba(255,255,255,.1)'}`, background: manualNight === (mode === 'dark') ? 'rgba(96,165,250,.12)' : 'rgba(255,255,255,.03)', color: '#bfdbfe', cursor: 'pointer', fontSize: '0.68rem' }}>{mode === 'dark' ? `◐ ${t('settings.dark')}` : `☼ ${t('settings.light')}`}</button>)}
          </div>}
        </div>
        <button type="button" onClick={onSignOut} style={{ width: '100%', padding: '12px', borderRadius: 12, border: '1px solid rgba(248,113,113,.3)', background: 'rgba(248,113,113,.08)', color: '#fca5a5', fontSize: '0.78rem', fontWeight: 600, cursor: 'pointer' }}>{t('settings.signOut')}</button>
      </div>
    </div>
  );
}
