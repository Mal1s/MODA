import { useState, useCallback, useEffect, useRef, type MouseEvent } from 'react';
import type { Session } from '@supabase/supabase-js';
import { useI18n } from './i18n';
import LandingPage from './LandingPage';
import AuthScreen from './components/AuthScreen';
import SettingsPanel from './components/SettingsPanel';
import CharacterSelect from './components/CharacterSelect';
import RoomScene from './components/RoomScene';
import StreetScene from './components/StreetScene';
import CaseOpening from './components/CaseOpening';
import ClosetView from './components/ClosetView';
import MarketScene from './components/MarketScene';
import AuctionScene from './components/AuctionScene';
import FusionScene from './components/FusionScene';
import { ITEMS, ClothingItem, type ItemType } from './gameData';
import { supabase } from './supabaseClient';

type View = 'landing' | 'game';
type Scene = 'select' | 'room' | 'street' | 'market' | 'auction' | 'fusion' | 'wardrobe' | 'closet';
type EquippedItems = Partial<Record<ItemType, string>>;

interface FloatingCoin { id: number; x: number; y: number; }

const ENERGY_MAX = 1000;
const DEFAULT_COINS = 250;

function hydrateInventory(value: unknown): ClothingItem[] {
  if (!Array.isArray(value)) return [];
  const ids = value.map(item => typeof item === 'string' ? item : typeof item === 'object' && item !== null && 'id' in item ? String(item.id) : '');
  return ids.map(id => ITEMS.find(item => item.id === id)).filter((item): item is ClothingItem => Boolean(item));
}

export default function App() {
  const { t } = useI18n();
  const [session, setSession] = useState<Session | null>(null);
  const [authReady, setAuthReady] = useState(false);
  const [authOpen, setAuthOpen] = useState(false);
  const [settingsOpen, setSettingsOpen] = useState(false);
  const [displayName, setDisplayName] = useState('Player');
  const [view, setView] = useState<View>('landing');
  const [scene, setScene] = useState<Scene>('select');
  const [gender, setGender] = useState<'female' | 'male' | null>(null);
  const [coins, setCoins] = useState(DEFAULT_COINS);
  const [energy, setEnergy] = useState(ENERGY_MAX);
  const [inventory, setInventory] = useState<ClothingItem[]>([]);
  const [equipped, setEquipped] = useState<EquippedItems>({});
  const [floatingCoins, setFloatingCoins] = useState<FloatingCoin[]>([]);
  const [loaded, setLoaded] = useState(false);
  const coinIdRef = useRef(0);
  const energyRef = useRef(energy);
  energyRef.current = energy;

  useEffect(() => {
    let active = true;
    supabase.auth.getSession().then(({ data }) => {
      if (active) { setSession(data.session); setAuthReady(true); }
    });
    const { data: listener } = supabase.auth.onAuthStateChange((_event, nextSession) => {
      setSession(nextSession);
      setAuthReady(true);
      (async () => {
        if (nextSession) {
          const { data } = await supabase.from('player_profiles').select('display_name').eq('user_id', nextSession.user.id).maybeSingle();
          if (data?.display_name) setDisplayName(data.display_name);
        }
      })();
    });
    return () => { active = false; listener.subscription.unsubscribe(); };
  }, []);

  useEffect(() => {
    if (!session) { setLoaded(false); return; }
    let active = true;
    setLoaded(false);
    (async () => {
      const [profileResult, saveResult] = await Promise.all([
        supabase.from('player_profiles').select('display_name').eq('user_id', session.user.id).maybeSingle(),
        supabase.from('player_saves').select('coins, energy, gender, inventory, equipped').eq('user_id', session.user.id).maybeSingle(),
      ]);
      if (!active) return;
      if (profileResult.data?.display_name) setDisplayName(profileResult.data.display_name);
      if (saveResult.data) {
        setCoins(saveResult.data.coins);
        setEnergy(saveResult.data.energy);
        if (saveResult.data.gender === 'male' || saveResult.data.gender === 'female') setGender(saveResult.data.gender);
        setInventory(hydrateInventory(saveResult.data.inventory));
        setEquipped(saveResult.data.equipped && typeof saveResult.data.equipped === 'object' ? saveResult.data.equipped as EquippedItems : {});
      }
      setLoaded(true);
    })();
    return () => { active = false; };
  }, [session]);

  useEffect(() => {
    if (!session || !loaded) return;
    supabase.from('player_saves').upsert({
      user_id: session.user.id, coins, energy, gender: gender ?? 'female',
      inventory: inventory.map(item => item.id), equipped, updated_at: new Date().toISOString(),
    }).then();
  }, [coins, energy, gender, inventory, equipped, loaded, session]);

  useEffect(() => {
    if (view !== 'game') return;
    const id = window.setInterval(() => {
      if (energyRef.current < ENERGY_MAX) setEnergy(value => Math.min(ENERGY_MAX, value + 1));
    }, 3000);
    return () => window.clearInterval(id);
  }, [view]);

  useEffect(() => {
    const setVh = () => document.documentElement.style.setProperty('--vh', `${window.innerHeight * 0.01}px`);
    setVh();
    window.addEventListener('resize', setVh);
    return () => window.removeEventListener('resize', setVh);
  }, []);

  const handleCoinClick = useCallback((event: MouseEvent) => {
    if (energyRef.current <= 0) return;
    setCoins(value => value + 1);
    setEnergy(value => Math.max(0, value - 1));
    const id = ++coinIdRef.current;
    setFloatingCoins(previous => [...previous, { id, x: event.clientX, y: event.clientY }]);
    window.setTimeout(() => setFloatingCoins(previous => previous.filter(coin => coin.id !== id)), 800);
  }, []);

  const handleItemWon = useCallback((item: ClothingItem) => setInventory(previous => [...previous, item]), []);
  const handleMarketBuy = useCallback((item: ClothingItem) => {
    setCoins(value => value >= item.value ? value - item.value : value);
    setInventory(previous => [...previous, item]);
  }, []);
  const handleAuctionWin = useCallback((item: ClothingItem, cost: number) => {
    setCoins(value => Math.max(0, value - cost));
    setInventory(previous => [...previous, item]);
  }, []);
  const handleFusionResult = useCallback((newItem: ClothingItem, consumed: ClothingItem[]) => {
    const consumedIds = new Set(consumed.map(item => item.id));
    setInventory(previous => [...previous.filter(item => !consumedIds.has(item.id)), newItem]);
  }, []);
  const handleEquip = useCallback((item: ClothingItem) => setEquipped(previous => ({ ...previous, [item.type]: item.id })), []);
  const handlePlayDemo = () => setAuthOpen(true);
  const handleGenderSelect = (value: 'female' | 'male') => { setGender(value); setScene('room'); };
  const handleSignOut = async () => { await supabase.auth.signOut(); setView('landing'); setScene('select'); setSettingsOpen(false); };

  if (!authReady) return <div className="app-loading">{t('loading') || 'Loading…'}</div>;
  if (!session) {
    return authOpen ? <AuthScreen onClose={() => setAuthOpen(false)} onAuthenticated={() => setAuthOpen(false)} /> : <LandingPage onPlayDemo={handlePlayDemo} />;
  }
  if (view === 'landing') setView('game');

  return (
    <div className="game-root">
      {floatingCoins.map(coin => <div key={coin.id} className="floating-coin" style={{ left: coin.x, top: coin.y }}>+1</div>)}
      <div className="game-device-frame">
        <div className="game-account-bar">
          <span>{displayName}</span>
          <div style={{ display: 'flex', gap: 8, alignItems: 'center' }}>
            <button type="button" onClick={() => setSettingsOpen(true)} style={{ border: 'none', background: 'transparent', color: '#c4b5fd', fontSize: '0.95rem', cursor: 'pointer' }}>⚙</button>
            <button type="button" onClick={handleSignOut} style={{ border: 'none', background: 'transparent', color: '#c4b5fd', font: 'inherit', cursor: 'pointer' }}>{t('account.signOut')}</button>
          </div>
        </div>
        {scene === 'select' && <CharacterSelect onSelect={handleGenderSelect} />}
        {scene === 'room' && gender && <RoomScene gender={gender} coins={coins} energy={energy} maxEnergy={ENERGY_MAX} inventory={inventory} onCoinClick={handleCoinClick} onWardrobeReached={() => setScene('wardrobe')} onDoorReached={() => setScene('street')} onClosetClick={() => setScene('closet')} />}
        {scene === 'street' && gender && <StreetScene gender={gender} coins={coins} onBack={() => setScene('room')} onMarketReached={() => setScene('market')} onAuctionReached={() => setScene('auction')} onFusionReached={() => setScene('fusion')} />}
        {scene === 'market' && <MarketScene coins={coins} onBack={() => setScene('street')} onBuy={handleMarketBuy} />}
        {scene === 'auction' && <AuctionScene coins={coins} onBack={() => setScene('street')} onWin={handleAuctionWin} />}
        {scene === 'fusion' && <FusionScene inventory={inventory} coins={coins} onSpend={amount => setCoins(value => Math.max(0, value - amount))} onBack={() => setScene('street')} onResult={handleFusionResult} />}
        {scene === 'wardrobe' && <CaseOpening coins={coins} onSpend={amount => setCoins(value => Math.max(0, value - amount))} onItemWon={handleItemWon} onClose={() => setScene('room')} />}
        {scene === 'closet' && <ClosetView inventory={inventory} equipped={equipped} gender={gender ?? 'female'} onEquip={handleEquip} onClose={() => setScene('room')} />}
        <SettingsPanel open={settingsOpen} onClose={() => setSettingsOpen(false)} onSignOut={handleSignOut} />
      </div>
    </div>
  );
}
