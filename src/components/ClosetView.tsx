import { useState } from 'react';
import Character from './Character';
import { ClothingItem, RARITY_CONFIG, type Rarity, type ItemType } from '../gameData';

interface ClosetViewProps {
  inventory: ClothingItem[];
  equipped: Partial<Record<ItemType, string>>;
  gender: 'female' | 'male';
  onEquip: (item: ClothingItem) => void;
  onClose: () => void;
}

const TYPE_LABELS: Record<ItemType, string> = {
  top: 'Top', bottom: 'Bottom', dress: 'Dress', shoes: 'Shoes', accessory: 'Accessory', bag: 'Bag',
};
const RARITY_ORDER: Rarity[] = ['star', 'legendary', 'mythic', 'rare', 'common'];

export default function ClosetView({ inventory, equipped, gender, onEquip, onClose }: ClosetViewProps) {
  const [filter, setFilter] = useState<Rarity | 'all'>('all');
  const [selected, setSelected] = useState<ClothingItem | null>(null);
  const filtered = inventory.filter(item => filter === 'all' || item.rarity === filter).sort((a, b) => RARITY_ORDER.indexOf(a.rarity) - RARITY_ORDER.indexOf(b.rarity));
  const totalValue = inventory.reduce((sum, item) => sum + item.value, 0);
  const wornItems = Object.values(equipped).map(id => inventory.find(item => item.id === id)).filter((item): item is ClothingItem => Boolean(item));
  const outfit = {
    topColor: wornItems.find(item => item.type === 'top' || item.type === 'dress')?.color,
    bottomColor: wornItems.find(item => item.type === 'bottom' || item.type === 'dress')?.color,
    shoeColor: wornItems.find(item => item.type === 'shoes')?.color,
  };

  return (
    <div className="scene-enter closet-view">
      <div className="closet-header">
        <button className="round-button" type="button" onClick={onClose}>←</button>
        <div>
          <h2>My wardrobe</h2>
          <div className="muted-caption">{inventory.length} items · {totalValue.toLocaleString()} total value</div>
        </div>
      </div>

      {inventory.length === 0 ? (
        <div className="closet-empty"><div className="empty-icon">◇</div><p>Your wardrobe is empty.<br />Open a case to start collecting.</p><button type="button" onClick={onClose}>Back to room</button></div>
      ) : (
        <>
          <div className="closet-preview">
            <div className="closet-character-card">
              <div className="preview-rays" />
              <Character gender={gender} outfit={outfit} size={76} />
              <span>YOUR LOOK</span>
            </div>
            <div className="worn-list">
              <div className="section-label">Currently equipped</div>
              {wornItems.length === 0 ? <div className="muted-caption">Choose an item to style your character.</div> : wornItems.map(item => <div key={item.id} className="worn-row"><span>{item.image ? <img src={item.image} alt="" /> : item.emoji}</span><strong>{item.name}</strong><small>{TYPE_LABELS[item.type]}</small></div>)}
            </div>
          </div>

          <div className="closet-filters">
            {(['all', 'star', 'legendary', 'mythic', 'rare', 'common'] as const).map(rarity => {
              const active = filter === rarity;
              const config = rarity === 'all' ? null : RARITY_CONFIG[rarity];
              const count = rarity === 'all' ? inventory.length : inventory.filter(item => item.rarity === rarity).length;
              return <button key={rarity} type="button" onClick={() => setFilter(rarity)} className={active ? 'filter-chip active' : 'filter-chip'} style={active && config ? { color: config.color, borderColor: config.color, background: config.bgColor } : undefined}>{rarity === 'all' ? 'All' : config?.label} <span>{count}</span></button>;
            })}
          </div>

          <div className="closet-grid">
            {filtered.map(item => {
              const config = RARITY_CONFIG[item.rarity];
              const isWorn = equipped[item.type] === item.id;
              const isSelected = selected?.id === item.id;
              return (
                <div key={item.id} className="closet-item-card" onClick={() => setSelected(isSelected ? null : item)} style={{ borderColor: isSelected ? config.color : undefined, boxShadow: isSelected ? config.glow : undefined }}>
                  {isWorn && <span className="worn-badge">WORN</span>}
                  <div className={`closet-item-image rarity-glow rarity-${item.rarity}`} data-rarity={item.rarity} style={{ background: config.bgColor }}>
                    {item.image ? <img className="asset-cutout" src={item.image} alt={item.name} /> : <span>{item.emoji}</span>}
                  </div>
                  <strong>{item.name}</strong>
                  <small style={{ color: config.color }}>{config.label}</small>
                  <button type="button" onClick={event => { event.stopPropagation(); onEquip(item); }} className={isWorn ? 'equip-button equipped' : 'equip-button'}>{isWorn ? 'Equipped' : 'Equip'}</button>
                </div>
              );
            })}
          </div>

          {selected && <div className="closet-detail" style={{ borderColor: `${RARITY_CONFIG[selected.rarity].color}80` }}><div><strong>{selected.name}</strong><p>{selected.description}</p></div><span style={{ color: RARITY_CONFIG[selected.rarity].color }}>{RARITY_CONFIG[selected.rarity].label}</span></div>}
        </>
      )}
    </div>
  );
}
