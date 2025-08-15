/**
 * main.js – glue: buttons -> EventBus -> mount tabs
 */
// Add this very first to confirm main.js actually loads
console.log('[main] loaded from', import.meta.url);

// ✅ RELATIVE imports (from /src/main.js to other files)
import eventBus, { EVENTS } from "./core/events/EventBus.js";

import MapTab        from "./tabs/map/MapTab.js";
import CharacterTab  from "./tabs/character/CharacterTab.js";
import SpellsTab     from "./tabs/spells/SpellsTab.js";
import FighterTab    from "./tabs/fighter/FighterTab.js";
import SkillTreeTab  from "./tabs/skillTree/SkillTreeTab.js";


const factories = {
  map:        () => new MapTab(),
  character:  () => new CharacterTab(),
  spells:     () => new SpellsTab(),
  fighter:    () => new FighterTab(),
  skilltree:  () => new SkillTreeTab(),
};

const instances = {};

function mountTab(tabId) {
  if (!instances[tabId]) instances[tabId] = factories[tabId]();

  const node = (typeof instances[tabId].mount === "function")
    ? instances[tabId].mount()
    : document.createTextNode(`${tabId} has no mount()`);

  const content = document.getElementById("content");
  content.innerHTML = "";
  content.appendChild(node);

  document.querySelectorAll(".sidebar button").forEach(b => b.classList.remove("active"));
  const btn = document.getElementById(`tab-${tabId}`);
  if (btn) btn.classList.add("active");
}

eventBus.on(EVENTS.TAB_CHANGED, ({ tabId }) => mountTab(tabId));

["map","character","spells","fighter","skilltree"].forEach(id => {
  const btn = document.getElementById(`tab-${id}`);
  if (btn) btn.addEventListener("click", () =>
    eventBus.emit(EVENTS.TAB_CHANGED, { tabId: id })
  );
});

// default tab
eventBus.emit(EVENTS.TAB_CHANGED, { tabId: "map" });
