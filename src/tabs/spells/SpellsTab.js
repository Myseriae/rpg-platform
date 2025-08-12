/**
 * SpellsTab - lists known spells and a stub for loadout.
 * Later: drag/drop into loadout slots, validation, cooldowns, etc.
 */
import state from "../../core/StateManager.js";

export default class SpellsTab {
  constructor() {
    this.root = document.createElement("div");
    this.root.className = "tab tab--spells";
    this.root.innerHTML = `
      <h2>Spells</h2>
      <h3>Known Spells</h3>
      <ul id="known" style="padding-left: 18px;"></ul>

      <h3 style="margin-top:12px;">Loadout (4 slots)</h3>
      <div id="loadout" style="display:flex; gap:8px;">
        <div class="slot">—</div>
        <div class="slot">—</div>
        <div class="slot">—</div>
        <div class="slot">—</div>
      </div>
    `;

    // Simple render of spells list
    this.root.querySelector("#known").innerHTML =
      state.spells.map(s => `<li>${s}</li>`).join("");

    // TODO: Manage loadout array in state, click a spell to assign to first empty slot, etc.
  }

  mount() {
    return this.root;
  }
}
