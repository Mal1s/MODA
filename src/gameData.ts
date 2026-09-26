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
}

import hoodieImg from './assets/items/common/Обычная_—_Худи_оверсаиз.png';
import skirtImg from './assets/items/common/Обычная_—_Юбка-карандаш_из_твида.png';
import bootsImg from './assets/items/rare/Редкая_—_Ботильоны_на_массивном_каблуке.png';
import clutchImg from './assets/items/rare/Редкая_—_Клатч_с_цепочкои.png';
import caseBasicImg from './assets/items/common/1._Базовыи_(200🪙).png';
import caseStandardImg from './assets/items/rare/2._Стандарт_(450🪙).png';
import casePremiumImg from './assets/items/rare/3._Премиум_(750🪙).png';
import caseEliteImg from './assets/items/rare/4._Элит_(1200🪙).png';

export const RARITY_CONFIG: Record<Rarity, {
  label: string;
  color: string;
  bgColor: string;
  glow: string;
  chance: number;
  textColor: string;
}> = {
  common: {
    label: 'Обычная',
    color: '#9ca3af',
    bgColor: 'rgba(156,163,175,0.15)',
    glow: 'none',
    chance: 0.50,
    textColor: '#d1d5db',
  },
  rare: {
    label: 'Редкая',
    color: '#60a5fa',
    bgColor: 'rgba(96,165,250,0.15)',
    glow: '0 0 15px #60a5fa, 0 0 30px rgba(59,130,246,0.5)',
    chance: 0.30,
    textColor: '#93c5fd',
  },
  mythic: {
    label: 'Мифическая',
    color: '#a855f7',
    bgColor: 'rgba(168,85,247,0.15)',
    glow: '0 0 20px #a855f7, 0 0 40px rgba(124,58,237,0.5)',
    chance: 0.15,
    textColor: '#c4b5fd',
  },
  legendary: {
    label: 'Легендарная',
    color: '#f97316',
    bgColor: 'rgba(249,115,22,0.15)',
    glow: '0 0 20px #f97316, 0 0 45px rgba(234,88,12,0.6)',
    chance: 0.04,
    textColor: '#fed7aa',
  },
  star: {
    label: '✦ ЗВЁЗДНАЯ ✦',
    color: '#f0abfc',
    bgColor: 'rgba(240,171,252,0.15)',
    glow: '0 0 30px #f0abfc, 0 0 60px #e879f9, 0 0 90px rgba(192,38,211,0.4)',
    chance: 0.01,
    textColor: '#f5d0fe',
  },
};

export const ITEMS: ClothingItem[] = [
  { id: 'c1', name: 'Худи оверсайз', type: 'top', rarity: 'common', emoji: '🧥', value: 10, color: '#d8d2c8', image: hoodieImg, description: 'Мягкое худи свободного кроя' },
  { id: 'c2', name: 'Твидовая юбка', type: 'bottom', rarity: 'common', emoji: '👗', value: 12, color: '#9a6848', image: skirtImg, description: 'Юбка-карандаш с фактурой твида' },
  { id: 'c3', name: 'Белые кеды', type: 'shoes', rarity: 'common', emoji: '👟', value: 15, color: '#f3f4f6', description: 'Свежие белые кроссовки' },
  { id: 'c4', name: 'Холщовая сумка', type: 'bag', rarity: 'common', emoji: '🛍️', value: 8, color: '#d4a574', description: 'Простая хлопковая сумка-шоппер' },
  { id: 'c5', name: 'Цветочная блуза', type: 'top', rarity: 'common', emoji: '👚', value: 18, color: '#fb7185', description: 'Лёгкая летняя блуза с цветами' },

  { id: 'r1', name: 'Шёлковый топ', type: 'top', rarity: 'rare', emoji: '👗', value: 80, color: '#7dd3fc', description: 'Деликатный шёлковый топ небесного цвета' },
  { id: 'r2', name: 'Ботильоны Нуар', type: 'shoes', rarity: 'rare', emoji: '👢', value: 120, color: '#1c1b1a', image: bootsImg, description: 'Чёрные ботильоны на массивном каблуке' },
  { id: 'r3', name: 'Клатч с цепочкой', type: 'bag', rarity: 'rare', emoji: '👜', value: 150, color: '#b9c8d8', image: clutchImg, description: 'Серебристый клатч с чешуйчатой фактурой' },
  { id: 'r4', name: 'Кожаная мини', type: 'bottom', rarity: 'rare', emoji: '👗', value: 200, color: '#292524', description: 'Чёрная кожаная мини-юбка' },
  { id: 'r5', name: 'Сатиновый блейзер', type: 'top', rarity: 'rare', emoji: '🥼', value: 250, color: '#f9a8d4', description: 'Розовый сатиновый оверсайз-блейзер' },

  { id: 'm1', name: 'Бархатный блейзер', type: 'top', rarity: 'mythic', emoji: '🥼', value: 500, color: '#6d28d9', description: 'Тёмно-фиолетовый блейзер из мятого бархата' },
  { id: 'm2', name: 'Дизайнерская сумка', type: 'bag', rarity: 'mythic', emoji: '👜', value: 800, color: '#b45309', description: 'Стёганая сумка с золотой цепочкой' },
  { id: 'm3', name: 'Платье из пайеток', type: 'dress', rarity: 'mythic', emoji: '👗', value: 1200, color: '#db2777', description: 'Длинное платье цвета розового золота' },
  { id: 'm4', name: 'Ботфорты', type: 'shoes', rarity: 'mythic', emoji: '👢', value: 900, color: '#1c1917', description: 'Чёрные замшевые сапоги выше колена' },

  { id: 'l1', name: 'Бриллиантовые серьги', type: 'accessory', rarity: 'legendary', emoji: '💎', value: 3000, color: '#7dd3fc', description: 'Безупречные бриллиантовые серьги-капли' },
  { id: 'l2', name: 'Кутюрное платье', type: 'dress', rarity: 'legendary', emoji: '👗', value: 5000, color: '#f59e0b', description: 'Золотое платье ручной работы' },
  { id: 'l3', name: 'Питон-клатч', type: 'bag', rarity: 'legendary', emoji: '👛', value: 4000, color: '#15803d', description: 'Изумрудный клатч из кожи питона' },

  { id: 's1', name: 'Платье Аврора', type: 'dress', rarity: 'star', emoji: '✨', value: 25000, color: '#f0abfc', description: 'Платье, мерцающее как северное сияние' },
  { id: 's2', name: 'Каблуки Галактика', type: 'shoes', rarity: 'star', emoji: '💫', value: 15000, color: '#c084fc', description: 'Платформы со встроенным звёздным кристаллом' },
  { id: 's3', name: 'Небесная диадема', type: 'accessory', rarity: 'star', emoji: '👑', value: 20000, color: '#fbbf24', description: 'Драгоценная корона модной королевы' },
];

export const CASES: Case[] = [
  {
    id: 'basic',
    name: 'Базовый шкаф',
    cost: 200,
    emoji: '🪟',
    maxRarity: 'rare',
    description: 'Обычные и редкие предметы гарантированы',
    glowColor: '#60a5fa',
    image: caseBasicImg,
  },
  {
    id: 'premium',
    name: 'Премиум шкаф',
    cost: 450,
    emoji: '🚪',
    maxRarity: 'mythic',
    description: 'Вплоть до мифической редкости — настоящая мода начинается здесь',
    glowColor: '#a855f7',
    image: caseStandardImg,
  },
  {
    id: 'luxury',
    name: 'Элитный сейф',
    cost: 750,
    emoji: '🗄️',
    maxRarity: 'legendary',
    description: 'Легендарные предметы ждут смелого коллекционера',
    glowColor: '#f97316',
    image: casePremiumImg,
  },
  {
    id: 'rainbow',
    name: 'Звёздный шкаф',
    cost: 1200,
    emoji: '🌈',
    maxRarity: 'star',
    description: 'Все редкости — возможны ЗВЁЗДНЫЕ предметы!',
    glowColor: '#f0abfc',
    image: caseEliteImg,
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
  strip[32] = winner;
  return strip;
}
