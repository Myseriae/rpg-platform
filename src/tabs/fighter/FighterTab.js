import state from "../../core/state/StateManager.js";
import eventBus, { EVENTS } from "../../core/events/EventBus.js";

export default class FighterTab {
  constructor(){
    this.root=document.createElement('div'); this.root.className='tab tab--fighter';
    this.root.innerHTML=`
      <div class="section">
        <h2>Battle</h2>
        <p>Drag tokens to reposition. Click a cell to move selected.</p>
        <div id="grid" class="battle-grid"></div>
        <div id="battleLog" class="section" style="margin-top:12px; height:130px; overflow:auto;"></div>
      </div>
    `;
    this.grid=this.root.querySelector('#grid'); this.logEl=this.root.querySelector('#battleLog');
    this.cells=[];
    for(let i=0;i<state.gridSize*state.gridSize;i++){
      const cell=document.createElement('div'); cell.className='cell'; cell.dataset.cell=i;
      cell.addEventListener('click', ()=>this.onCellClick(i));
      cell.addEventListener('dragover', e=>e.preventDefault());
      cell.addEventListener('drop', e=>{
        e.preventDefault();
        const unitId=e.dataTransfer.getData('text/plain'); if(!unitId) return;
        state.moveUnit(unitId, i); this.renderTokens();
      });
      this.grid.appendChild(cell); this.cells.push(cell);
    }
    this.selectedUnitId='u_hero';
    eventBus.on(EVENTS.SPELL_CAST, ({ spellId })=>{ this.log(`Spell cast (${spellId}) in Fighter view`); });
    this.renderTokens();
  }
  makeToken(u){
    const el=document.createElement('div');
    el.className=`token ${u.type==='hero' ? 'hero' : 'mob'}`; el.textContent=u.name;
    el.draggable=true; el.dataset.unitId=u.id;
    el.addEventListener('dragstart', e=> e.dataTransfer.setData('text/plain', u.id));
    el.addEventListener('click', e=>{ e.stopPropagation(); this.selectedUnitId=u.id; this.log(`Selected ${u.id}`); });
    return el;
  }
  renderTokens(){
    this.cells.forEach(c=>{ c.innerHTML=''; c.classList.remove('highlight'); });
    state.units.forEach(u=>{
      const c=this.cells[u.cell]; c.appendChild(this.makeToken(u));
      if(u.id===this.selectedUnitId) c.classList.add('highlight');
    });
  }
  onCellClick(idx){ if(!this.selectedUnitId) return; state.moveUnit(this.selectedUnitId, idx); this.renderTokens(); }
  log(t){ const p=document.createElement('div'); p.textContent=t; this.logEl.appendChild(p); this.logEl.scrollTop=this.logEl.scrollHeight; }
  mount(){ return this.root; }
}
