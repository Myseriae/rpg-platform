/**
 * EventBus: lightweight publish/subscribe hub.
 * - .on(event, cb)     -> subscribe
 * - .emit(event, data) -> broadcast
 * - .off(event, cb?)   -> unsubscribe one or all
 *
 * Why: Decouples modules. Tabs, systems, and UI can talk via events
 * without holding references to each other.
 */
class EventBus {
  constructor() {
    this.listeners = new Map(); // event -> [callbacks]
  }

  on(event, cb) {
    if (!this.listeners.has(event)) this.listeners.set(event, []);
    this.listeners.get(event).push(cb);
  }

  off(event, cb) {
    if (!this.listeners.has(event)) return;
    if (!cb) { this.listeners.delete(event); return; }
    const arr = this.listeners.get(event).filter(fn => fn !== cb);
    if (arr.length) this.listeners.set(event, arr);
    else this.listeners.delete(event);
  }

  emit(event, data = {}) {
    if (!this.listeners.has(event)) return;
    for (const cb of this.listeners.get(event)) {
      try { cb(data); } catch (e) { console.error('EventBus listener error:', e); }
    }
  }
}

// Single shared instance for the whole app
const eventBus = new EventBus();
export default eventBus;

// OPTIONAL: centralized event names to avoid typos
export const EVENTS = {
  TAB_CHANGED: 'tab:changed',
  INVENTORY_UPDATED: 'inventory:updated',
  SPELL_CAST: 'spell:cast',
  COMBAT_ACTION: 'combat:action',
  SKILL_UNLOCKED: 'skill:unlocked',
};
