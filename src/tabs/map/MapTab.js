/**
 * MapTab - builds a simple DOM and returns it via mount().
 * Later: attach a <canvas>, implement zoom/pan, fog of war, etc.
 */
export default class MapTab {
  constructor() {
    // Create a root element for this tab
    this.root = document.createElement("div");
    this.root.className = "tab tab--map";

    // Minimal placeholder UI
    this.root.innerHTML = `
      <h2>World Map</h2>
      <p>This is a placeholder. Later: canvas-rendered world, zoom/pan, locations.</p>
      <div class="map-placeholder" style="height:240px;border:1px dashed #999;display:flex;align-items:center;justify-content:center;">
        <span>🗺️ Map canvas goes here</span>
      </div>
    `;

    // TODO: create and append a <canvas>, set up render loop and interaction handlers here
    // this.canvas = document.createElement('canvas'); this.root.appendChild(this.canvas);
    // this.ctx = this.canvas.getContext('2d');
  }

  /**
   * Return the DOM node representing this tab’s UI.
   * main.js will insert this into #content when the tab is active.
   */
  mount() {
    return this.root;
  }
}
