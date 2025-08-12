/**
 * FighterTab - placeholder for a tactical battle view.
 * Later: grid, units, turn order, AP, targeting, combat log.
 */
import state from "../../core/StateManager.js";

export default class FighterTab {
  constructor() {
    this.root = document.createElement("div");
    this.root.className = "tab tab--fighter";
    this.root.innerHTML = `
      <h2>Battle</h2>
      <p>Player HP: <strong>${state.player.hp}</strong></p>
      <div class="battlefield" style="height:240px;border:1px dashed #999;display:flex;align-items:center;justify-content:center;">
        <span>🧭 Battle grid goes here</span>
      </div>
      <div style="margin-top:8px;">
        <button disabled>Move</button>
        <button disabled>Attack</button>
        <button disabled>End Turn</button>
      </div>
    `;
    // TODO: Implement CombatEngine, MovementSystem, TargetingSystem; wire controls to systems.
  }

  mount() {
    return this.root;
  }
}
