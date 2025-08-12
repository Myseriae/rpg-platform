// CharacterTab.js placeholder
/**
 * CharacterTab module - handles the character tab content (character sheet, stats, etc).
 * Currently a stub that logs its initialization and shows how to access state.
 */
import stateManager from "../../core/StateManager.js";

export default class CharacterTab {
  constructor() {
    // Log initialization and some state data
    console.log(`CharacterTab initialized (Player: ${stateManager.player.name}, Level: ${stateManager.player.level})`);
    // TODO: Implement character stats display, equipment, and inventory UI logic here
  }
}
