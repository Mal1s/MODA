import { useState, type FormEvent } from 'react';
import { supabase } from '../supabaseClient';
import { useI18n } from '../i18n';

interface AuthScreenProps {
  onClose?: () => void;
  onAuthenticated: () => void;
}

type AuthMode = 'sign-in' | 'sign-up';

export default function AuthScreen({ onClose, onAuthenticated }: AuthScreenProps) {
  const { t } = useI18n();
  const [mode, setMode] = useState<AuthMode>('sign-up');
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [busy, setBusy] = useState(false);
  const [message, setMessage] = useState('');

  const submit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setMessage('');
    setBusy(true);
    try {
      if (mode === 'sign-up') {
        const cleanName = name.trim();
        if (cleanName.length < 2 || cleanName.length > 24) { setMessage(t('auth.nameError')); return; }
        const { data, error } = await supabase.auth.signUp({ email: email.trim(), password, options: { data: { display_name: cleanName } } });
        if (error) throw error;
        if (!data.user) throw new Error(t('auth.error'));
        if (data.session) {
          await supabase.from('player_profiles').upsert({ user_id: data.user.id, display_name: cleanName, updated_at: new Date().toISOString() });
          onAuthenticated();
        } else { setMessage(t('auth.checkEmail')); }
      } else {
        const { error } = await supabase.auth.signInWithPassword({ email: email.trim(), password });
        if (error) throw error;
        onAuthenticated();
      }
    } catch (error) {
      setMessage(error instanceof Error ? error.message : t('auth.error'));
    } finally {
      setBusy(false);
    }
  };

  return (
    <div className="auth-screen">
      <div className="auth-card">
        {onClose && <button className="auth-close" type="button" onClick={onClose} aria-label="Close">×</button>}
        <div className="auth-eyebrow">{t('auth.eyebrow')}</div>
        <h1>{mode === 'sign-up' ? t('auth.signup.title') : t('auth.signin.title')}</h1>
        <p className="auth-subtitle">{mode === 'sign-up' ? t('auth.signup.subtitle') : t('auth.signin.subtitle')}</p>
        <form onSubmit={submit} className="auth-form">
          {mode === 'sign-up' && (
            <label>{t('auth.name')}<input value={name} onChange={event => setName(event.target.value)} placeholder={t('auth.namePlaceholder')} autoComplete="name" required /></label>
          )}
          <label>{t('auth.email')}<input value={email} onChange={event => setEmail(event.target.value)} type="email" placeholder="you@example.com" autoComplete="email" required /></label>
          <label>{t('auth.password')}<input value={password} onChange={event => setPassword(event.target.value)} type="password" minLength={6} placeholder={t('auth.passwordPlaceholder')} autoComplete={mode === 'sign-up' ? 'new-password' : 'current-password'} required /></label>
          {message && <div className="auth-message" role="alert">{message}</div>}
          <button className="auth-submit" type="submit" disabled={busy}>{busy ? '…' : mode === 'sign-up' ? t('auth.signupButton') : t('auth.signinButton')}</button>
        </form>
        <button className="auth-switch" type="button" onClick={() => { setMode(mode === 'sign-up' ? 'sign-in' : 'sign-up'); setMessage(''); }}>{mode === 'sign-up' ? t('auth.switchToSignin') : t('auth.switchToSignup')}</button>
      </div>
    </div>
  );
}
