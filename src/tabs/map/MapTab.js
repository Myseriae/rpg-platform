/**
 * MapTab – no imports needed here.
 * If you ever need EventBus/State, import them from absolute core paths:
 *   import eventBus from "/src/core/EventBus.js";
 *   import state from "/src/core/StateManager.js";
 */
export default class MapTab {
  constructor() {
    this.root = document.createElement('div');
    this.root.className = 'tab tab--map';
    this.root.innerHTML = `
      <div class="section">
        <h2>World Map</h2>
        <p>Scroll to zoom. Drag to pan.</p>
        <div class="map-container" id="mapContainer">
          <img class="map-img" id="mapImg"
               src="https://upload.wikimedia.org/wikipedia/commons/3/3a/BlankMap-World.svg"
               alt="Map" />
        </div>
      </div>
    `;
    this.scale=1; this.offsetX=0; this.offsetY=0; this.isPanning=false; this.startX=0; this.startY=0;
    this.container=this.root.querySelector('#mapContainer');
    this.img=this.root.querySelector('#mapImg');

    this.onWheel=this.onWheel.bind(this);
    this.onPointerDown=this.onPointerDown.bind(this);
    this.onPointerMove=this.onPointerMove.bind(this);
    this.onPointerUp=this.onPointerUp.bind(this);

    this.container.addEventListener('wheel', this.onWheel, { passive:false });
    this.container.addEventListener('pointerdown', this.onPointerDown);
    window.addEventListener('pointermove', this.onPointerMove);
    window.addEventListener('pointerup', this.onPointerUp);

    this.applyTransform();
  }
  applyTransform(){ this.img.style.transform=`translate(${this.offsetX}px,${this.offsetY}px) scale(${this.scale})`; }
  onWheel(e){
    e.preventDefault();
    const r=this.container.getBoundingClientRect();
    const mx=e.clientX-r.left, my=e.clientY-r.top;
    const delta=-e.deltaY*0.0015; const old=this.scale;
    this.scale=Math.min(4, Math.max(0.5, this.scale+delta));
    const ratio=this.scale/old;
    this.offsetX = mx - ratio*(mx - this.offsetX);
    this.offsetY = my - ratio*(my - this.offsetY);
    this.applyTransform();
  }
  onPointerDown(e){ this.isPanning=true; this.startX=e.clientX-this.offsetX; this.startY=e.clientY-this.offsetY; this.container.setPointerCapture(e.pointerId); }
  onPointerMove(e){ if(!this.isPanning) return; this.offsetX=e.clientX-this.startX; this.offsetY=e.clientY-this.startY; this.applyTransform(); }
  onPointerUp(){ this.isPanning=false; }
  mount(){ return this.root; }
}
