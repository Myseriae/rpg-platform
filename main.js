import eventBus from "./core/EventBus.js";

// Tab modules
import MapTab from "./tabs/map/MapTab.js";
import CharacterTab from "./tabs/character/CharacterTab.js";
import SpellsTab from "./tabs/spells/SpellsTab.js";
import FighterTab from "./tabs/fighter/FighterTab.js";
import SkillTreeTab from "./tabs/skilltree/SkillTreeTab.js";

/**
 * Factory functions to create tab instances on first use (lazy init).
 * Each tab exposes a mount() method that returns a DOM node to display.
 */
const factories = {
  map: () => new MapTab(),
  character: () => new CharacterTab(),
  spells: () => new SpellsTab(),
  fighter: () => new FighterTab(),
  skilltree: () => new SkillTreeTab(),
};

// Cache instances so we don’t recreate them every time
const instances = {}; // { map: MapTab, character: CharacterTab, ... }

function mountTab(tabId) {
  // 1) Create or reuse the instance
  if (!instances[tabId]) instances[tabId] = factories[tabId]();

  // 2) Ask the tab for its DOM node
  const node = typeof instances[tabId].mount === "function"
    ? instances[tabId].mount()
    : document.createTextNode(`${tabId} (no mount() provided)`);

  // 3) Clear and insert into the content area
  const content = document.getElementById("content");
  content.innerHTML = "";
  content.appendChild(node);

  // 4) Update the active sidebar button styling
  document.querySelectorAll(".sidebar button").forEach(b => b.classList.remove("active"));
  const btn = document.getElementById("tab-" + tabId);
  if (btn) btn.classList.add("active");
}

// React to tab change events
eventBus.on("tab:changed", ({ tabId }) => {
  mountTab(tabId);
});

// Wire up buttons → emit events
["map", "character", "spells", "fighter", "skilltree"].forEach(id => {
  const btn = document.getElementById("tab-" + id);
  if (btn) btn.addEventListener("click", () => {
    eventBus.emit("tab:changed", { tabId: id });
  });
});

// Default tab on load
eventBus.emit("tab:changed", { tabId: "map" });