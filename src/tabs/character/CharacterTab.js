/**
 * CharacterTab - shows player stats and inventory placeholder.
 * Later: split into StatsPanel, InventoryGrid, EquipmentSlots components.
 */
import state from "../../core/StateManager.js";

export default class CharacterTab {
  constructor() {
    this.root = document.createElement("div");
    this.root.className = "tab tab--character";
    this.root.innerHTML = `
      <h2>Character</h2>
      <div id="stats"></div>

      <h3>Inventory</h3>
      <div style="margin: 8px 0;">
        <input id="newItem" placeholder="Add item..." />
        <button id="addItemBtn">Add</button>
      </div>
      <ul id="inv" style="padding-left: 18px;"></ul>
    `;

    // Initial render
    this.render();

    // Wire up a tiny interaction to demo state usage
    this.root.querySelector("#addItemBtn").addEventListener("click", () => {
      const input = this.root.querySelector("#newItem");
      const val = input.value.trim();
      if (val) {
        state.addItemToInventory(val);
        input.value = "";
        this.render(); // simple, direct re-render for now
      }
    });
  }

  render() {
    // Stats
    this.root.querySelector("#stats").textContent =
      `${state.player.name} (Lv ${state.player.level})  HP: ${state.player.hp}  MP: ${state.player.mp}`;

    // Inventory
    this.root.querySelector("#inv").innerHTML =
      state.inventory.map(i => `<li>${i}</li>`).join("");
  }

  mount() {
    // In a more complex setup, you might (re)attach listeners or timers here
    return this.root;
  }
}
