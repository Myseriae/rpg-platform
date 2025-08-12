/**
 * SkillTreeTab - placeholder for a skill graph with unlocks.
 * Later: render nodes/edges (SVG or canvas), handle prerequisites and unlock.
 */
import state from "../../core/StateManager.js";

export default class SkillTreeTab {
  constructor() {
    this.root = document.createElement("div");
    this.root.className = "tab tab--skilltree";
    this.root.innerHTML = `
      <h2>Skill Tree</h2>
      <p>Available Skill Points: <strong>${state.player.skillPoints}</strong></p>
      <div class="skilltree" style="height:240px;border:1px dashed #999;display:flex;align-items:center;justify-content:center;">
        <span>🌳 Skill nodes go here</span>
      </div>
    `;
    // TODO: Build TreeRenderer + SkillManager; click nodes -> unlock if prerequisites satisfied.
  }

  mount() {
    return this.root;
  }
}
