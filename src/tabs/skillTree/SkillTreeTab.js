import state from "../../core/state/StateManager.js";
import eventBus, { EVENTS } from "../../core/events/EventBus.js";

export default class SkillTreeTab {
  constructor(){
    this.root=document.createElement('div'); this.root.className='tab tab--skilltree';
    this.root.innerHTML=`
      <div class="section">
        <h2>Skill Tree</h2>
        <p>Skill Points: <strong id="sp"></strong></p>
        <div id="tree" class="tree"></div>
      </div>
    `;
    this.elSp=this.root.querySelector('#sp'); this.elTree=this.root.querySelector('#tree');
    this.render();
  }
  isAvailable(sk){ if(sk.unlocked) return false; return sk.requires.every(id=>state.skills.find(s=>s.id===id)?.unlocked); }
  render(){
    this.elSp.textContent=state.player.skillPoints; this.elTree.innerHTML='';
    state.skills.forEach(sk=>{
      const div=document.createElement('div'); div.className='skill'; div.textContent=sk.name;
      if(sk.unlocked) div.classList.add('unlocked');
      else if(this.isAvailable(sk)) div.classList.add('available');
      else div.classList.add('locked');
      if(div.classList.contains('available')){
        div.addEventListener('click', ()=>{
          if(state.unlock(sk.id)){ eventBus.emit(EVENTS.SKILL_UNLOCKED, { skillId: sk.id }); this.render(); }
        });
      }
      this.elTree.appendChild(div);
    });
  }
  mount(){ return this.root; }
}
