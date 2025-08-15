import state from "../../core/state/StateManager.js";

export default class CharacterTab {
  constructor() {
    this.root=document.createElement('div');
    this.root.className='tab tab--character';
    this.root.innerHTML=`
      <div class="section">
        <h2>Character</h2>
        <div class="char-top">
          <div class="char-portrait"
               style="background-image:url('https://images.unsplash.com/photo-1549880338-65ddcdfd017b?w=600');"></div>
          <div>
            <p><strong>${state.player.name}</strong> (Lv ${state.player.level})</p>
            <p>HP: ${state.player.hp} &nbsp; MP: ${state.player.mp}</p>
            <div>
              <input id="newItem" placeholder="Add inventory item..." />
              <button id="addItemBtn">Add</button>
            </div>
            <ul id="invList"></ul>
          </div>
        </div>
      </div>
      <div class="section">
        <h3>Equipment</h3>
        <p>Drag an inventory item into a slot.</p>
        <div class="grid" id="equipGrid"></div>
      </div>
    `;
    this.invList=this.root.querySelector('#invList');
    this.equipGrid=this.root.querySelector('#equipGrid');

    for(let i=0;i<9;i++){
      const slot=document.createElement('div');
      slot.className='slot'; slot.dataset.slotIndex=i;
      slot.addEventListener('dragover', e=>{ e.preventDefault(); slot.classList.add('highlight'); });
      slot.addEventListener('dragleave', ()=>slot.classList.remove('highlight'));
      slot.addEventListener('drop', e=>{
        e.preventDefault(); slot.classList.remove('highlight');
        const name=e.dataTransfer.getData('text/plain'); if(!name) return;
        state.equip(+slot.dataset.slotIndex, name);
        this.render();
      });
      this.equipGrid.appendChild(slot);
    }
    this.root.querySelector('#addItemBtn').addEventListener('click', ()=>{
      const input=this.root.querySelector('#newItem'); const val=input.value.trim();
      if(val){ state.addItem(val); input.value=''; this.render(); }
    });
    this.render();
  }
  makeItem(name){
    const it=document.createElement('div'); it.className='item'; it.textContent=name; it.draggable=true;
    it.addEventListener('dragstart', e=> e.dataTransfer.setData('text/plain', name));
    return it;
  }
  render(){
    this.invList.innerHTML=''; state.inventory.forEach(name=>{ const li=document.createElement('li'); li.appendChild(this.makeItem(name)); this.invList.appendChild(li); });
    [...this.equipGrid.children].forEach((slot,idx)=>{ slot.innerHTML=''; const it=state.equipment[idx]; if(it) slot.appendChild(this.makeItem(it)); });
  }
  mount(){ return this.root; }
}
