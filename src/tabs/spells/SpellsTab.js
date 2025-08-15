import state from "../../core/state/StateManager.js";
import eventBus, { EVENTS } from "../../core/events/EventBus.js";

export default class SpellsTab {
  constructor(){
    this.root=document.createElement('div'); this.root.className='tab tab--spells';
    this.root.innerHTML=`
      <div class="section">
        <h2>Spells</h2>
        <div class="spell-lists">
          <div>
            <h3>Known Spells</h3>
            <div id="known"></div>
          </div>
          <div>
            <h3>Loadout (4)</h3>
            <div class="loadout" id="loadout"></div>
            <h3 style="margin-top:12px;">Log</h3>
            <div class="section" id="log" style="height:160px; overflow:auto;"></div>
          </div>
        </div>
      </div>
    `;
    this.elKnown=this.root.querySelector('#known');
    this.elLoadout=this.root.querySelector('#loadout');
    this.elLog=this.root.querySelector('#log');
    this.render();
  }
  render(){
    this.elKnown.innerHTML='';
    state.spells.forEach(sp=>{
      const card=document.createElement('div'); card.className='spell-card';
      card.innerHTML=`<strong>[${sp.tier}]</strong> ${sp.name} <em>(AP:${sp.ap})</em><br/><small>${sp.desc}</small>`;
      card.addEventListener('click', ()=>{
        const slotIdx=state.loadout.findIndex(x=>x===null);
        if(slotIdx!==-1){ state.setLoadoutSlot(slotIdx, sp.id); this.render(); }
      });
      this.elKnown.appendChild(card);
    });
    this.elLoadout.innerHTML='';
    for(let i=0;i<4;i++){
      const slot=document.createElement('div'); slot.className='slot';
      const spellId=state.loadout[i];
      if(spellId){
        const sp=state.spells.find(s=>s.id===spellId);
        slot.textContent=`[${sp.tier}] ${sp.name} (AP:${sp.ap})`;
        slot.style.cursor='pointer';
        slot.addEventListener('click', ()=>{
          this.log(`Cast: ${sp.name} (AP:${sp.ap})`);
          eventBus.emit(EVENTS.SPELL_CAST, { spellId: sp.id });
        });
      } else {
        slot.textContent='— empty —';
      }
      this.elLoadout.appendChild(slot);
    }
  }
  log(t){ const p=document.createElement('div'); p.textContent=t; this.elLog.appendChild(p); this.elLog.scrollTop=this.elLog.scrollHeight; }
  mount(){ return this.root; }
}
