// main.js placeholder
/**
 * main.js - entry point script that initializes the app, sets up tab navigation, and ties everything together.
 */
import eventBus from "./core/EventBus.js";
// Import tab modules
import MapTab from "./tabs/map/MapTab.js";
import CharacterTab from "./tabs/character/CharacterTab.js";
import SpellsTab from "./tabs/spells/SpellsTab.js";
import FighterTab from "./tabs/fighter/FighterTab.js";
import SkillTreeTab from "./tabs/skilltree/SkillTreeTab.js";

// Keep references to tab instances to avoid re-initializing them repeatedly
const tabs = {
  map: null,
  character: null,
  spells: null,
  fighter: null,
  skilltree: null
};

// Subscribe to tab change events via EventBus
eventBus.on('tab:changed', (payload) => {
  const tabName = payload.tabId;
  console.log(`Switching to tab: ${tabName}`);
  // Initialize the tab module on first activation
  if (!tabs[tabName]) {
    switch (tabName) {
      case 'map':
        tabs.map = new MapTab();
        break;
      case 'character':
        tabs.character = new CharacterTab();
        break;
      case 'spells':
        tabs.spells = new SpellsTab();
        break;
      case 'fighter':
        tabs.fighter = new FighterTab();
        break;
      case 'skilltree':
        tabs.skilltree = new SkillTreeTab();
        break;
    }
  }
  // Update the main content area (display a simple placeholder text for now)
  const contentEl = document.getElementById('content');
  contentEl.textContent = `${tabName.charAt(0).toUpperCase() + tabName.slice(1)} content goes here...`;
  // Highlight the active tab button
  document.querySelectorAll('.sidebar button').forEach(btn => btn.classList.remove('active'));
  const activeBtn = document.getElementById('tab-' + tabName);
  if (activeBtn) {
    activeBtn.classList.add('active');
  }
});

// Set up click handlers for each tab button to emit a tab change event
document.getElementById('tab-map').addEventListener('click', () => {
  eventBus.emit('tab:changed', { tabId: 'map' });
});
document.getElementById('tab-character').addEventListener('click', () => {
  eventBus.emit('tab:changed', { tabId: 'character' });
});
document.getElementById('tab-spells').addEventListener('click', () => {
  eventBus.emit('tab:changed', { tabId: 'spells' });
});
document.getElementById('tab-fighter').addEventListener('click', () => {
  eventBus.emit('tab:changed', { tabId: 'fighter' });
});
document.getElementById('tab-skilltree').addEventListener('click', () => {
  eventBus.emit('tab:changed', { tabId: 'skilltree' });
});

// Initialize the default tab (Map) on page load
eventBus.emit('tab:changed', { tabId: 'map' });
