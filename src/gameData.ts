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
  image?: string;
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
  image?: string;
  dropChances: Partial<Record<Rarity, number>>;
}

import hoodieImg from './assets/items/common/Обычная_—_Худи_оверсаиз.png';
import skirtImg from './assets/items/common/Обычная_—_Юбка-карандаш_из_твида.png';
import bootsImg from './assets/items/rare/Редкая_—_Ботильоны_на_массивном_каблуке.png';
import clutchImg from './assets/items/rare/Редкая_—_Клатч_с_цепочкои.png';
import caseBasicImg from './assets/items/common/1._Базовыи_(200🪙).png';
import caseStandardImg from './assets/items/rare/2._Стандарт_(450🪙).png';
import casePremiumImg from './assets/items/rare/3._Премиум_(750🪙).png';
import caseEliteImg from './assets/items/rare/4._Элит_(1200🪙).png';
import crownImg from './assets/items/common/crown-cutout.png';
import suitImg from './assets/items/common/suit-cutout.png';
import rainbowChestImg from './assets/items/common/rainbow-chest-cutout.png';

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
    label: 'Star',
    color: '#f0abfc',
    bgColor: 'rgba(240,171,252,0.15)',
    glow: '0 0 30px #f0abfc, 0 0 60px #e879f9, 0 0 90px rgba(192,38,211,0.4)',
    chance: 0.01,
    textColor: '#f5d0fe',
  },
};

export const ITEMS: ClothingItem[] = [
  { id: 'c1', name: 'Oversized Hoodie', type: 'top', rarity: 'common', emoji: '🧥', value: 10, color: '#d8d2c8', image: hoodieImg, description: 'Soft oversized hoodie for everyday wear' },
  { id: 'c2', name: 'Tweed Pencil Skirt', type: 'bottom', rarity: 'common', emoji: '👗', value: 12, color: '#9a6848', image: skirtImg, description: 'Classic pencil skirt with tweed texture' },
  { id: 'c3', name: 'White Sneakers', type: 'shoes', rarity: 'common', emoji: '👟', value: 15, color: '#f3f4f6', description: 'Fresh white sneakers for any outfit' },
  { id: 'c4', name: 'Canvas Tote', type: 'bag', rarity: 'common', emoji: '🛍️', value: 8, color: '#d4a574', description: 'Simple cotton tote bag' },
  { id: 'c5', name: 'Floral Blouse', type: 'top', rarity: 'common', emoji: '👚', value: 18, color: '#fb7185', description: 'Light summer blouse with floral pattern' },

  { id: 'r1', name: 'Silk Top', type: 'top', rarity: 'rare', emoji: '👗', value: 80, color: '#7dd3fc', description: 'Delicate sky-blue silk top' },
  { id: 'r2', name: 'Noir Ankle Boots', type: 'shoes', rarity: 'rare', emoji: '👢', value: 120, color: '#1c1b1a', image: bootsImg, description: 'Black ankle boots on a chunky heel' },
  { id: 'r3', name: 'Chain Clutch', type: 'bag', rarity: 'rare', emoji: '👜', value: 150, color: '#b9c8d8', image: clutchImg, description: 'Silver clutch with chain detail' },
  { id: 'r4', name: 'Leather Mini', type: 'bottom', rarity: 'rare', emoji: '👗', value: 200, color: '#292524', description: 'Black leather mini skirt' },
  { id: 'r5', name: 'Satin Blazer', type: 'top', rarity: 'rare', emoji: '🥼', value: 250, color: '#f9a8d4', description: 'Pink satin oversized blazer' },

  { id: 'm1', name: 'Velvet Blazer', type: 'top', rarity: 'mythic', emoji: '🥼', value: 500, color: '#6d28d9', description: 'Deep purple crushed-velvet blazer' },
  { id: 'm2', name: 'Designer Bag', type: 'bag', rarity: 'mythic', emoji: '👜', value: 800, color: '#b45309', description: 'Quilted bag with gold chain strap' },
  { id: 'm3', name: 'Sequin Gown', type: 'dress', rarity: 'mythic', emoji: '👗', value: 1200, color: '#db2777', description: 'Long sequin gown in rose gold' },
  { id: 'm4', name: 'Over-the-Knee Boots', type: 'shoes', rarity: 'mythic', emoji: '👢', value: 900, color: '#1c1917', description: 'Black suede boots above the knee' },

  { id: 'l1', name: 'Diamond Earrings', type: 'accessory', rarity: 'legendary', emoji: '💎', value: 3000, color: '#7dd3fc', description: 'Flawless diamond drop earrings' },
  { id: 'l2', name: 'Couture Gown', type: 'dress', rarity: 'legendary', emoji: '👗', value: 5000, color: '#f59e0b', description: 'Hand-crafted golden couture gown' },
  { id: 'l3', name: 'Python Clutch', type: 'bag', rarity: 'legendary', emoji: '👛', value: 4000, color: '#15803d', description: 'Emerald python-skin clutch' },

  { id: 's1', name: 'Aurora Dress', type: 'dress', rarity: 'star', emoji: '✨', value: 25000, color: '#f0abfc', description: 'A dress that shimmers like the northern lights' },
  { id: 's2', name: 'Galaxy Heels', type: 'shoes', rarity: 'star', emoji: '💫', value: 15000, color: '#c084fc', description: 'Platforms with an embedded star crystal' },
  { id: 's3', name: 'Celestial Tiara', type: 'accessory', rarity: 'star', emoji: '👑', value: 20000, color: '#fbbf24', description: 'A precious crown for the fashion queen' },
  { id: 's4', name: 'Constellation Crown', type: 'accessory', rarity: 'star', emoji: '👑', value: 28000, color: '#f0abfc', image: crownImg, description: 'A crown surrounded by the glow of colorful stars' },
  { id: 's5', name: 'Cosmic Suit', type: 'dress', rarity: 'star', emoji: '🕴️', value: 32000, color: '#93c5fd', image: suitImg, description: 'A flawless suit with rainbow shimmer' },
  { id: 's6', name: 'Rainbow Chest', type: 'accessory', rarity: 'legendary', emoji: '🧰', value: 18000, color: '#fbbf24', image: rainbowChestImg, description: 'A chest filled with shimmering treasures' },
];

export const CASES: Case[] = [
  {
    id: 'basic',
    name: 'Basic Case',
    cost: 200,
    emoji: '🪟',
    maxRarity: 'rare',
    description: 'Common and rare items guaranteed',
    glowColor: '#60a5fa',
    image: caseBasicImg,
    dropChances: { common: 0.72, rare: 0.28 },
  },
  {
    id: 'premium',
    name: 'Premium Case',
    cost: 450,
    emoji: '🚪',
    maxRarity: 'mythic',
    description: 'Up to mythic rarity — real fashion starts here',
    glowColor: '#a855f7',
    image: caseStandardImg,
    dropChances: { common: 0.5, rare: 0.32, mythic: 0.18 },
  },
  {
    id: 'luxury',
    name: 'Luxury Vault',
    cost: 750,
    emoji: '🗄️',
    maxRarity: 'legendary',
    description: 'Legendary items await the bold collector',
    glowColor: '#f97316',
    image: casePremiumImg,
    dropChances: { common: 0.42, rare: 0.3, mythic: 0.2, legendary: 0.08 },
  },
  {
    id: 'rainbow',
    name: 'Star Case',
    cost: 1200,
    emoji: '🌈',
    maxRarity: 'star',
    description: 'All rarities — Star items are possible!',
    glowColor: '#f0abfc',
    image: caseEliteImg,
    dropChances: { common: 0.35, rare: 0.25, mythic: 0.2, legendary: 0.15, star: 0.05 },
  },
];

const RARITY_ORDER: Rarity[] = ['common', 'rare', 'mythic', 'legendary', 'star'];

export function rollItem(maxRarity: Rarity, dropChances?: Partial<Record<Rarity, number>>): ClothingItem {
  const maxIdx = RARITY_ORDER.indexOf(maxRarity);
  const allowed = RARITY_ORDER.slice(0, maxIdx + 1);
  const total = allowed.reduce((sum, rarity) => sum + (dropChances?.[rarity] ?? RARITY_CONFIG[rarity].chance), 0);
  const roll = Math.random() * total;

  let cumulative = 0;
  let selectedRarity: Rarity = 'common';
  for (const rarity of allowed) {
    cumulative += dropChances?.[rarity] ?? RARITY_CONFIG[rarity].chance;
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
  strip[32] = winner;
  return strip;
}
