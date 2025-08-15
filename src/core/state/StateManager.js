/**
 * StateManager: central game state.
 * Keep it simple but structured; expose methods to mutate + (optional) notify.
 * You can replace this later with something more reactive if you want.
 */
class StateManager {
  constructor() {
    // Player & meta
    this.player = { name: 'Hero', level: 1, hp: 100, mp: 50, skillPoints: 2 };
    // Inventory & equipment (3x3 grid for demo)
    this.inventory = ['Health Potion', 'Iron Sword', 'Leather Cap'];
    this.equipment = Array.from({ length: 9 }, () => null); // 9 slots

    // Spells & loadout (4 slots)
    this.spells = [
      { id: 's_1', tier: 1, ap: 1, name: 'Kockavetés (B)', desc: 'd6 random effect.' },
      { id: 's_2', tier: 1, ap: 1, name: 'Kártyarántás (S)', desc: 'Draw a spell.' },
      { id: 's_3', tier: 2, ap: 2, name: 'Villám kard (G)', desc: 'Three attacks.' },
      { id: 's_4', tier: 2, ap: 2, name: 'Lidércnyomás (M)', desc: 'Projected curses.' },
    ];
    this.loadout = [null, null, null, null];

    // Fighter: 10x10 grid; positions by cell index (0..99)
    this.gridSize = 10;
    this.units = [
      { id: 'u_hero', name: 'H', type: 'hero', cell: 0 },   // top-left
      { id: 'u_mob1', name: 'M', type: 'mob',  cell: 22 },
    ];

    // Skill tree minimal demo
    this.skills = [
      { id: 'sk1', name: 'Root', requires: [], unlocked: true },
      { id: 'sk2', name: 'Strike+', requires: ['sk1'], unlocked: false },
      { id: 'sk3', name: 'Ward+', requires: ['sk1'], unlocked: false },
      { id: 'sk4', name: 'Mastery', requires: ['sk2','sk3'], unlocked: false },
    ];
  }

  /* Inventory / Equipment */
  addItem(item) { this.inventory.push(item); }
  equip(slotIndex, itemName) {
    this.equipment[slotIndex] = itemName;
    this.inventory = this.inventory.filter(i => i !== itemName);
  }
  unequip(slotIndex) {
    const it = this.equipment[slotIndex];
    if (it) this.inventory.push(it);
    this.equipment[slotIndex] = null;
  }

  /* Spells */
  setLoadoutSlot(slotIndex, spellId) { this.loadout[slotIndex] = spellId; }

  /* Fighter helpers */
  moveUnit(unitId, toCell) {
    const u = this.units.find(x => x.id === unitId);
    if (u) u.cell = toCell;
  }

  /* Skills */
  canUnlock(skillId) {
    const sk = this.skills.find(s => s.id === skillId);
    if (!sk || sk.unlocked) return false;
    return sk.requires.every(req => this.skills.find(s => s.id === req)?.unlocked);
  }
  unlock(skillId) {
    const sk = this.skills.find(s => s.id === skillId);
    if (sk && !sk.unlocked && this.canUnlock(skillId) && this.player.skillPoints > 0) {
      sk.unlocked = true;
      this.player.skillPoints -= 1;
      return true;
    }
    return false;
  }
}

const state = new StateManager();
export default state;
