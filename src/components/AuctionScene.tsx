import { useState, useEffect, useRef, useCallback } from 'react';
import { ITEMS, RARITY_CONFIG, type ClothingItem, type Rarity } from '../gameData';

interface AuctionSceneProps {
  coins: number;
  onBack: () => void;
  onWin: (item: ClothingItem, cost: number) => void;
}

const AUCTION_ITEMS = ITEMS.filter(item => ['r1', 'r5', 'm1', 'm3', 'l2', 'l3'].includes(item.id));
const STARTING_BIDS: Record<string, number> = { r1: 50, r5: 120, m1: 300, m3: 600, l2: 2000, l3: 1500 };

type Phase = 'idle' | 'bidding' | 'hammer' | 'result';

interface NpcBidder {
  name: string;
  color: string;
  active: boolean;
  bidAmount: number;
}

const NPC_NAMES = ['Vivienne', 'Marcus', 'Coco', 'Ralph', 'Stella'];
const NPC_COLORS = ['#f0abfc', '#93c5fd', '#fbbf24', '#a855f7', '#22c55e'];

export default function AuctionScene({ coins, onBack, onWin }: AuctionSceneProps) {
  const [lotIndex, setLotIndex] = useState(0);
  const [phase, setPhase] = useState<Phase>('idle');
  const [currentBid, setCurrentBid] = useState(0);
  const [highestBidder, setHighestBidder] = useState<string>('Auctioneer');
  const [timer, setTimer] = useState(15);
  const [npcs, setNpcs] = useState<NpcBidder[]>([]);
  const [hammerFlash, setHammerFlash] = useState(false);
  const [won, setWon] = useState<ClothingItem | null>(null);
  const [wonCost, setWonCost] = useState(0);
  const [auctioneerText, setAuctioneerText] = useState('Welcome. Our first lot is ready.');
  const timerRef = useRef<ReturnType<typeof setInterval> | null>(null);
  const bidStepRef = useRef(0);

  const currentLot = AUCTION_ITEMS[lotIndex];
  const cfg = RARITY_CONFIG[currentLot.rarity];

  const initNpcs = useCallback(() => {
    setNpcs(NPC_NAMES.map((name, i) => ({
      name,
      color: NPC_COLORS[i],
      active: false,
      bidAmount: 0,
    })));
  }, []);

  useEffect(() => { initNpcs(); }, [initNpcs]);

  const startBidding = () => {
    const startBid = STARTING_BIDS[currentLot.id] ?? 50;
    setCurrentBid(startBid);
    setHighestBidder('Auctioneer');
    setTimer(15);
    setPhase('bidding');
    setAuctioneerText(`Starting at ${startBid} coins. Do I hear more?`);
    bidStepRef.current = 0;
  };

  useEffect(() => {
    if (phase !== 'bidding') return;

    timerRef.current = setInterval(() => {
      setTimer(prev => {
        const next = prev - 1;
        if (next <= 0) {
          if (timerRef.current) clearInterval(timerRef.current);
          setPhase('hammer');
          setAuctioneerText('Going once... going twice...');
          setTimeout(() => {
            setHammerFlash(true);
            setTimeout(() => setHammerFlash(false), 400);
            setPhase('result');
            if (highestBidder === 'You') {
              setWon(currentLot);
              setWonCost(currentBid);
              onWin(currentLot, currentBid);
              setAuctioneerText(`Sold to You for ${currentBid} coins!`);
            } else {
              setWon(null);
              setAuctioneerText(`Sold to ${highestBidder} for ${currentBid} coins.`);
            }
          }, 1500);
          return 0;
        }

        bidStepRef.current += 1;
        if (bidStepRef.current % 2 === 0 && next > 3) {
          const npcIdx = Math.floor(Math.random() * NPC_NAMES.length);
          const increment = Math.ceil(currentBid * 0.15 / 10) * 10 + 10;
          const newBid = currentBid + increment;
          setNpcs(prev => prev.map((n, i) => ({
            ...n,
            active: i === npcIdx,
            bidAmount: i === npcIdx ? newBid : n.bidAmount,
          })));
          setTimeout(() => setNpcs(prev => prev.map(n => ({ ...n, active: false }))), 600);
          setCurrentBid(newBid);
          setHighestBidder(NPC_NAMES[npcIdx]);
          setAuctioneerText(`${NPC_NAMES[npcIdx]} bids ${newBid}. Do I hear more?`);
        }
        return next;
      });
    }, 1000);

    return () => { if (timerRef.current) clearInterval(timerRef.current); };
  }, [phase, currentBid, highestBidder, currentLot, onWin]);

  const placeBid = () => {
    if (phase !== 'bidding') return;
    if (coins < currentBid + 20) return;
    const newBid = currentBid + 20;
    setCurrentBid(newBid);
    setHighestBidder('You');
    setAuctioneerText(`You bid ${newBid}. Any more?`);
  };

  const nextLot = () => {
    const next = (lotIndex + 1) % AUCTION_ITEMS.length;
    setLotIndex(next);
    setPhase('idle');
    setWon(null);
    setWonCost(0);
    setAuctioneerText('Next lot is ready.');
  };

  const canBid = phase === 'bidding' && coins >= currentBid + 20 && highestBidder !== 'You';

  return (
    <div className="scene-enter" style={{ width: '100%', height: '100%', position: 'relative', overflow: 'hidden', fontFamily: 'Poppins, sans-serif', background: 'linear-gradient(180deg, #1a0a1e 0%, #2a1030 40%, #1a0a1e 100%)' }}>
      {hammerFlash && <div style={{ position: 'absolute', inset: 0, background: 'white', opacity: 0.7, zIndex: 50, pointerEvents: 'none' }} />}

      {/* Stage backdrop */}
      <div style={{ position: 'absolute', top: 0, left: 0, right: 0, height: '45%', background: 'linear-gradient(180deg, #3d1a50 0%, #2a1030 100%)' }}>
        <div style={{ position: 'absolute', bottom: 0, left: '10%', right: '10%', height: 30, background: 'linear-gradient(180deg, #5a2070 0%, #3d1a50 100%)', borderTop: '2px solid rgba(240,171,252,0.3)', borderRadius: '50% 50% 0 0 / 100% 100% 0 0' }} />
      </div>
      <div style={{ position: 'absolute', bottom: 0, left: 0, right: 0, height: '55%', background: 'linear-gradient(180deg, #1a0a1e 0%, #0d0512 100%)' }} />

      {/* Header */}
      <div style={{ position: 'absolute', top: 0, left: 0, right: 0, padding: '12px 16px', display: 'flex', alignItems: 'center', justifyContent: 'space-between', zIndex: 10 }}>
        <div>
          <div style={{ fontFamily: 'Playfair Display, serif', fontSize: '1.1rem', color: '#f0abfc' }}>Auction House</div>
          <div style={{ color: '#9d7fc0', fontSize: '0.62rem' }}>Lot {lotIndex + 1} of {AUCTION_ITEMS.length}</div>
        </div>
        <div style={{ display: 'flex', gap: 8, alignItems: 'center' }}>
          <div style={{ background: 'rgba(19,13,42,0.8)', border: '1px solid rgba(251,191,36,0.3)', borderRadius: 20, padding: '4px 10px', color: '#fbbf24', fontSize: '0.72rem', fontWeight: 700 }}>🪙 {coins.toLocaleString()}</div>
          <button onClick={onBack} style={{ background: 'rgba(255,255,255,0.05)', border: '1px solid rgba(192,132,252,0.2)', borderRadius: 20, padding: '5px 12px', color: '#c4b5fd', fontSize: '0.72rem', cursor: 'pointer' }}>← Street</button>
        </div>
      </div>

      {/* Podium with item */}
      <div style={{ position: 'absolute', top: '16%', left: '50%', transform: 'translateX(-50%)', display: 'flex', flexDirection: 'column', alignItems: 'center', zIndex: 3 }}>
        <div style={{
          fontSize: '4rem',
          className: phase === 'idle' ? '' : 'glow-' + currentLot.rarity,
          filter: phase === 'result' && won ? RARITY_CONFIG[currentLot.rarity].glow : 'none',
          animation: phase === 'bidding' ? 'rarity-float 2s ease-in-out infinite' : 'none',
        }}>
          {currentLot.emoji}
        </div>
        <div style={{ width: 120, height: 8, background: 'linear-gradient(90deg, transparent, rgba(240,171,252,0.4), transparent)', borderRadius: '50%' }} />
        <div style={{ width: 80, height: 50, background: 'linear-gradient(180deg, #4a1a60 0%, #2a1030 100%)', borderRadius: '4px 4px 0 0', border: '1px solid rgba(240,171,252,0.2)' }} />
        <div style={{ fontFamily: 'Playfair Display, serif', fontSize: '0.9rem', color: '#f0e6ff', marginTop: 8, textAlign: 'center' }}>{currentLot.name}</div>
        <div style={{ fontSize: '0.6rem', color: cfg.color, fontWeight: 700, marginTop: 2 }}>{cfg.label}</div>
      </div>

      {/* Auctioneer */}
      <div style={{ position: 'absolute', top: '20%', left: '12%', zIndex: 4 }}>
        <div style={{ width: 36, height: 36, borderRadius: '50%', background: '#e5b991', border: '2px solid #c4a030', position: 'relative' }}>
          <div style={{ position: 'absolute', top: -8, left: 4, width: 28, height: 14, borderRadius: '50% 50% 20% 20%', background: '#2a1a10' }} />
        </div>
        <div style={{ width: 50, height: 70, background: 'linear-gradient(180deg, #1a1a2e 0%, #0d0d1a 100%)', borderRadius: '8px 8px 0 0', marginTop: -2, border: '1px solid rgba(196,160,48,0.3)' }} />
        <div style={{ width: 16, height: 20, background: '#8b4513', borderRadius: '2px', marginTop: -60, marginLeft: 40, transform: 'rotate(15deg)', boxShadow: '0 2px 8px rgba(0,0,0,0.4)' }} />
      </div>

      {/* NPC audience */}
      <div style={{ position: 'absolute', bottom: '28%', left: '5%', right: '5%', display: 'flex', justifyContent: 'space-around', zIndex: 2 }}>
        {npcs.map((npc, i) => (
          <div key={i} style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', transition: 'transform 0.3s', transform: npc.active ? 'translateY(-12px)' : 'translateY(0)' }}>
            <div style={{ width: 24, height: 24, borderRadius: '50%', background: npc.color, opacity: 0.8, boxShadow: npc.active ? `0 0 12px ${npc.color}` : 'none', border: '1px solid rgba(255,255,255,0.2)' }} />
            <div style={{ width: 32, height: 40, background: npc.color, opacity: 0.5, borderRadius: '6px 6px 0 0' }} />
            {npc.active && <div style={{ fontSize: '0.5rem', color: npc.color, fontWeight: 700, marginTop: 2 }}>{npc.name} bids {npc.bidAmount}</div>}
          </div>
        ))}
      </div>

      {/* Auctioneer speech bubble */}
      <div style={{ position: 'absolute', top: '38%', left: '50%', transform: 'translateX(-50%)', background: 'rgba(19,13,42,0.92)', border: '1px solid rgba(240,171,252,0.3)', borderRadius: 12, padding: '8px 16px', color: '#f0e6ff', fontSize: '0.72rem', maxWidth: 280, textAlign: 'center', zIndex: 5, backdropFilter: 'blur(8px)' }}>
        {auctioneerText}
      </div>

      {/* Timer */}
      {phase === 'bidding' && (
        <div style={{ position: 'absolute', top: '50%', left: '50%', transform: 'translateX(-50%)', zIndex: 5 }}>
          <div style={{
            width: 56, height: 56, borderRadius: '50%',
            border: `2px solid ${timer <= 5 ? '#f87171' : cfg.color}`,
            display: 'flex', alignItems: 'center', justifyContent: 'center',
            fontSize: '1.4rem', fontWeight: 900, color: timer <= 5 ? '#f87171' : '#f0e6ff',
            background: 'rgba(19,13,42,0.8)',
            boxShadow: timer <= 5 ? '0 0 20px rgba(248,113,113,0.5)' : `0 0 16px ${cfg.color}40`,
          }}>
            {timer}
          </div>
        </div>
      )}

      {/* Current bid display */}
      {(phase === 'bidding' || phase === 'hammer') && (
        <div style={{ position: 'absolute', bottom: '20%', left: '50%', transform: 'translateX(-50%)', textAlign: 'center', zIndex: 5 }}>
          <div style={{ color: '#9d7fc0', fontSize: '0.6rem', textTransform: 'uppercase', letterSpacing: '0.1em' }}>Current bid</div>
          <div style={{ fontSize: '1.6rem', fontWeight: 900, color: highestBidder === 'You' ? '#fbbf24' : '#f0e6ff' }}>🪙 {currentBid.toLocaleString()}</div>
          <div style={{ fontSize: '0.65rem', color: highestBidder === 'You' ? '#fbbf24' : '#9d7fc0' }}>Highest: {highestBidder}</div>
        </div>
      )}

      {/* Result */}
      {phase === 'result' && (
        <div style={{ position: 'absolute', bottom: '14%', left: '12px', right: '12px', textAlign: 'center', zIndex: 6 }}>
          {won ? (
            <div style={{
              background: `linear-gradient(135deg, ${cfg.bgColor}, rgba(19,13,42,0.9))`,
              border: `1.5px solid ${cfg.color}60`,
              borderRadius: 16, padding: '14px 18px',
              boxShadow: cfg.glow !== 'none' ? cfg.glow : 'none',
            }}>
              <div style={{ fontSize: '1.8rem' }}>{won.emoji}</div>
              <div style={{ fontFamily: 'Playfair Display, serif', fontSize: '1rem', color: '#f0e6ff', fontWeight: 700 }}>{won.name}</div>
              <div style={{ color: cfg.color, fontSize: '0.65rem', fontWeight: 700 }}>{cfg.label}</div>
              <div style={{ color: '#fbbf24', fontSize: '0.8rem', marginTop: 4 }}>Won for 🪙 {wonCost.toLocaleString()}</div>
            </div>
          ) : (
            <div style={{ color: '#9d7fc0', fontSize: '0.8rem', padding: 14 }}>
              You didn't win this lot. Try the next one!
            </div>
          )}
          <button onClick={nextLot} style={{ marginTop: 10, padding: '10px 24px', borderRadius: 14, border: 'none', background: 'linear-gradient(135deg, #7c3aed, #c026d3)', color: 'white', fontWeight: 600, fontSize: '0.85rem', cursor: 'pointer', boxShadow: '0 4px 16px rgba(124,58,237,0.4)' }}>
            Next Lot →
          </button>
        </div>
      )}

      {/* Idle / start */}
      {phase === 'idle' && (
        <div style={{ position: 'absolute', bottom: '14%', left: '12px', right: '12px', textAlign: 'center', zIndex: 6 }}>
          <div style={{ color: '#9d7fc0', fontSize: '0.75rem', marginBottom: 10 }}>
            Starting bid: 🪙 {STARTING_BIDS[currentLot.id] ?? 50}
          </div>
          <button onClick={startBidding} style={{ padding: '12px 28px', borderRadius: 14, border: 'none', background: `linear-gradient(135deg, ${cfg.color}, ${cfg.color}cc)`, color: 'white', fontWeight: 700, fontSize: '0.9rem', cursor: 'pointer', boxShadow: `0 4px 20px ${cfg.color}50` }}>
            Start Bidding
          </button>
        </div>
      )}

      {/* Bid button */}
      {phase === 'bidding' && (
        <div style={{ position: 'absolute', bottom: 12, left: 12, right: 12, zIndex: 6 }}>
          <button
            onClick={placeBid}
            disabled={!canBid}
            style={{
              width: '100%', padding: '14px 0', borderRadius: 14, border: 'none',
              background: canBid ? 'linear-gradient(135deg, #fbbf24, #f59e0b)' : 'rgba(255,255,255,0.06)',
              color: canBid ? '#1a0a0a' : '#5b4b7a',
              fontWeight: 700, fontSize: '0.9rem', cursor: canBid ? 'pointer' : 'not-allowed',
              boxShadow: canBid ? '0 4px 20px rgba(251,191,36,0.4)' : 'none',
            }}
          >
            {highestBidder === 'You' ? `You're winning — 🪙 ${currentBid}` : canBid ? `Bid +20 🪙 (to ${currentBid + 20})` : 'Not enough coins'}
          </button>
        </div>
      )}
    </div>
  );
}
