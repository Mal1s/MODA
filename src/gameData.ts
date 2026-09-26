export type Rarity = 'common' | 'rare' | 'mythic' | 'legendary' | 'star';
export type ItemType = 'top' | 'bottom' | 'dress' | 'shoes' | 'accessory' | 'bag';

export interface ClothingItem {
  id: string;
  name: string;
  type: ItemType;
  rarity: Rarity;
  emoji: string;
  value: number;
  color: string;
  description: string;
}

export interface Case {
  id: string;
  name: string;
  cost: number;
  emoji: string;
  maxRarity: Rarity;
  description: string;
  premium?: boolean;
  glowColor: string;
}

export const RARITY_CONFIG: Record<Rarity, {
  label: string;
  color: string;
  bgColor: string;
  glow: string;
  chance: number;
  textColor: string;
}> = {
  common: {
    label: 'Common',
    color: '#9ca3af',
    bgColor: 'rgba(156,163,175,0.15)',
    glow: 'none',
    chance: 0.50,
    textColor: '#d1d5db',
  },
  rare: {
    label: 'Rare',
    color: '#60a5fa',
    bgColor: 'rgba(96,165,250,0.15)',
    glow: '0 0 15px #60a5fa, 0 0 30px rgba(59,130,246,0.5)',
    chance: 0.30,
    textColor: '#93c5fd',
  },
  mythic: {
    label: 'Mythic',
    color: '#a855f7',
    bgColor: 'rgba(168,85,247,0.15)',
    glow: '0 0 20px #a855f7, 0 0 40px rgba(124,58,237,0.5)',
    chance: 0.15,
    textColor: '#c4b5fd',
  },
  legendary: {
    label: 'Legendary',
    color: '#f97316',
    bgColor: 'rgba(249,115,22,0.15)',
    glow: '0 0 20px #f97316, 0 0 45px rgba(234,88,12,0.6)',
    chance: 0.04,
    textColor: '#fed7aa',
  },
  star: {
    label: '✦ STAR ✦',
    color: '#f0abfc',
    bgColor: 'rgba(240,171,252,0.15)',
    glow: '0 0 30px #f0abfc, 0 0 60px #e879f9, 0 0 90px rgba(192,38,211,0.4)',
    chance: 0.01,
    textColor: '#f5d0fe',
  },
};

export const ITEMS: ClothingItem[] = [
  { id: 'c1', name: 'Striped Tee', type: 'top', rarity: 'common', emoji: '👕', value: 10, color: '#6b7280', description: 'A simple striped t-shirt' },
  { id: 'c2', name: 'Basic Jeans', type: 'bottom', rarity: 'common', emoji: '👖', value: 12, color: '#1d4ed8', description: 'Everyday blue denim' },
  { id: 'c3', name: 'White Sneakers', type: 'shoes', rarity: 'common', emoji: '👟', value: 15, color: '#f3f4f6', description: 'Fresh white canvas sneakers' },
  { id: 'c4', name: 'Canvas Tote', type: 'bag', rarity: 'common', emoji: '🛍️', value: 8, color: '#d4a574', description: 'Simple cotton tote bag' },
  { id: 'c5', name: 'Floral Blouse', type: 'top', rarity: 'common', emoji: '👚', value: 18, color: '#fb7185', description: 'Light summer blouse with flowers' },

  { id: 'r1', name: 'Silk Cami', type: 'top', rarity: 'rare', emoji: '👗', value: 80, color: '#7dd3fc', description: 'Delicate silk camisole, sky blue' },
  { id: 'r2', name: 'High-Heel Mules', type: 'shoes', rarity: 'rare', emoji: '👡', value: 120, color: '#c4a882', description: 'Italian leather block-heel mules' },
  { id: 'r3', name: 'Pearl Chain', type: 'accessory', rarity: 'rare', emoji: '📿', value: 150, color: '#f3f4f6', description: 'Double-strand pearl choker' },
  { id: 'r4', name: 'Leather Mini', type: 'bottom', rarity: 'rare', emoji: '👗', value: 200, color: '#292524', description: 'Sleek black leather mini-skirt' },
  { id: 'r5', name: 'Satin Blazer', type: 'top', rarity: 'rare', emoji: '🥼', value: 250, color: '#f9a8d4', description: 'Blush pink satin oversized blazer' },

  { id: 'm1', name: 'Velvet Blazer', type: 'top', rarity: 'mythic', emoji: '🥼', value: 500, color: '#6d28d9', description: 'Midnight purple crushed velvet blazer' },
  { id: 'm2', name: 'Designer Handbag', type: 'bag', rarity: 'mythic', emoji: '👜', value: 800, color: '#b45309', description: 'Quilted gold-chain designer bag' },
  { id: 'm3', name: 'Sequin Gown', type: 'dress', rarity: 'mythic', emoji: '👗', value: 1200, color: '#db2777', description: 'Full-length rose gold sequin gown' },
  { id: 'm4', name: 'Thigh-High Boots', type: 'shoes', rarity: 'mythic', emoji: '👢', value: 900, color: '#1c1917', description: 'Sleek black suede thigh-highs' },

  { id: 'l1', name: 'Diamond Drops', type: 'accessory', rarity: 'legendary', emoji: '💎', value: 3000, color: '#7dd3fc', description: 'Flawless diamond drop earrings' },
  { id: 'l2', name: 'Couture Dress', type: 'dress', rarity: 'legendary', emoji: '👗', value: 5000, color: '#f59e0b', description: 'Hand-stitched gold couture creation' },
  { id: 'l3', name: 'Python Clutch', type: 'bag', rarity: 'legendary', emoji: '👛', value: 4000, color: '#15803d', description: 'Exotic emerald python clutch bag' },

  { id: 's1', name: 'Aurora Gown', type: 'dress', rarity: 'star', emoji: '✨', value: 25000, color: '#f0abfc', description: 'A dress that shimmers like the northern lights' },
  { id: 's2', name: 'Galaxy Heels', type: 'shoes', rarity: 'star', emoji: '💫', value: 15000, color: '#c084fc', description: 'Platform heels with embedded star crystal' },
  { id: 's3', name: 'Celestial Crown', type: 'accessory', rarity: 'star', emoji: '👑', value: 20000, color: '#fbbf24', description: 'Jewelled crown worn by fashion royalty' },
];

export const CASES: Case[] = [
  {
    id: 'basic',
    name: 'Basic Wardrobe',
    cost: 100,
    emoji: '🪟',
    maxRarity: 'rare',
    description: 'Common & Rare items guaranteed',
    glowColor: '#60a5fa',
  },
  {
    id: 'premium',
    name: 'Premium Closet',
    cost: 500,
    emoji: '🚪',
    maxRarity: 'mythic',
    description: 'Up to Mythic rarity — real fashion starts here',
    glowColor: '#a855f7',
  },
  {
    id: 'luxury',
    name: 'Luxury Vault',
    cost: 2000,
    emoji: '🗄️',
    maxRarity: 'legendary',
    description: 'Legendary pieces await the bold collector',
    glowColor: '#f97316',
  },
  {
    id: 'rainbow',
    name: 'Rainbow Wardrobe',
    cost: 0,
    emoji: '🌈',
    maxRarity: 'star',
    description: 'All rarities — STAR items possible!',
    premium: true,
    glowColor: '#f0abfc',
  },
];

const RARITY_ORDER: Rarity[] = ['common', 'rare', 'mythic', 'legendary', 'star'];

export function rollItem(maxRarity: Rarity): ClothingItem {
  const maxIdx = RARITY_ORDER.indexOf(maxRarity);
  const allowed = RARITY_ORDER.slice(0, maxIdx + 1);

  const total = allowed.reduce((s, r) => s + RARITY_CONFIG[r].chance, 0);
  const roll = Math.random() * total;

  let cumulative = 0;
  let selectedRarity: Rarity = 'common';
  for (const rarity of allowed) {
    cumulative += RARITY_CONFIG[rarity].chance;
    if (roll <= cumulative) {
      selectedRarity = rarity;
      break;
    }
  }

  const pool = ITEMS.filter(i => i.rarity === selectedRarity);
  const fallback = ITEMS.filter(i => i.rarity === 'common');
  const source = pool.length > 0 ? pool : fallback;
  return source[Math.floor(Math.random() * source.length)];
}

export function generateRouletteStrip(winner: ClothingItem): ClothingItem[] {
  const strip: ClothingItem[] = [];
  for (let i = 0; i < 40; i++) {
    const r = Math.random();
    let rarity: Rarity = 'common';
    if (r < 0.01) rarity = 'star';
    else if (r < 0.05) rarity = 'legendary';
    else if (r < 0.20) rarity = 'mythic';
    else if (r < 0.50) rarity = 'rare';
    const pool = ITEMS.filter(i => i.rarity === rarity);
    strip.push(pool[Math.floor(Math.random() * pool.length)] ?? ITEMS[0]);
  }
  // Place winner at position 32 (winner slot)
  strip[32] = winner;
  return strip;
}
