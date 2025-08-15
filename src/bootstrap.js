/**
 * src/bootstrap.js
 * Resilient loader that locates your modules no matter small path differences.
 * If a module can't be found, it prints a clear UI error with paths it tried.
 */

async function pathExists(url) {
  // HEAD to avoid downloading; some dev servers don’t support HEAD → fall back to GET
  try {
    let res = await fetch(url, { method: 'HEAD' });
    if (res.ok) return true;
    // some static servers block HEAD; try GET for small files
    res = await fetch(url, { method: 'GET' });
    return res.ok;
  } catch {
    return false;
  }
}

function join(...parts) {
  return parts.join('/').replace(/\/+/g, '/');
}

function getBaseHref() {
  // Compute the base path of index.html (so ./src works even if opened via subfolder)
  const { origin, pathname } = window.location;
  // If served from VS Code live server, pathname ends with /index.html or /
  const dir = pathname.endsWith('/') ? pathname : pathname.replace(/[^/]+$/, '');
  return origin + dir;
}

async function resolveModule(candidates, label) {
  // Prepend base for relative paths
  const base = getBaseHref();
  const fulls = candidates.map(p => (p.startsWith('http') || p.startsWith('/')) ? (new URL(p, base)).href
                                                                           : (new URL(p, base)).href);
  for (const url of fulls) {
    if (await pathExists(url)) return url;
  }
  throw new Error(`Could not locate ${label}.\nTried:\n` + fulls.map(u => '  - ' + u).join('\n'));
}

(async () => {
  // ─────────────────────────────────────────────────────────────────────────────
  // 1) Add path candidates here. Include variants you might have in your project.
  //    Feel free to add/remove lines to match your actual tree.
  // ─────────────────────────────────────────────────────────────────────────────
  const C = {
    // Event bus (try different folders/casing)
    EventBus: [
      './src/core/EventBus.js',
      './src/core/eventbus.js',
      './src/core/events/EventBus.js',
      './src/core/events/eventbus.js',
      '/src/core/EventBus.js',
      '/src/core/events/EventBus.js',
    ],
    StateManager: [
      './src/core/StateManager.js',
      './src/core/stateManager.js',
      './src/core/state/StateManager.js',
      '/src/core/StateManager.js',
      '/src/core/state/StateManager.js',
    ],
    MapTab: [
      './src/tabs/map/MapTab.js',
      './src/tabs/map/maptab.js',
      '/src/tabs/map/MapTab.js',
    ],
    CharacterTab: [
      './src/tabs/character/CharacterTab.js',
      './src/tabs/character/charactertab.js',
      '/src/tabs/character/CharacterTab.js',
    ],
    SpellsTab: [
      './src/tabs/spells/SpellsTab.js',
      './src/tabs/spells/spellstab.js',
      '/src/tabs/spells/SpellsTab.js',
    ],
    FighterTab: [
      './src/tabs/fighter/FighterTab.js',
      './src/tabs/fighter/fightertab.js',
      '/src/tabs/fighter/FighterTab.js',
    ],
    SkillTreeTab: [
      './src/tabs/skilltree/SkillTreeTab.js',
      './src/tabs/skillTree/SkillTreeTab.js',   // camelCase folder
      './src/tabs/skilltree/skilltreetab.js',
      '/src/tabs/skilltree/SkillTreeTab.js',
      '/src/tabs/skillTree/SkillTreeTab.js',
    ],
  };

  try {
    // ───────────────────────────────────────────────────────────────────────────
    // 2) Resolve actual URLs that exist on your server
    // ───────────────────────────────────────────────────────────────────────────
    const [
      EventBusURL,
      StateManagerURL,
      MapTabURL,
      CharacterTabURL,
      SpellsTabURL,
      FighterTabURL,
      SkillTreeTabURL
    ] = await Promise.all([
      resolveModule(C.EventBus,     'EventBus'),
      resolveModule(C.StateManager, 'StateManager'),
      resolveModule(C.MapTab,       'MapTab'),
      resolveModule(C.CharacterTab, 'CharacterTab'),
      resolveModule(C.SpellsTab,    'SpellsTab'),
      resolveModule(C.FighterTab,   'FighterTab'),
      resolveModule(C.SkillTreeTab, 'SkillTreeTab'),
    ]);

    // ───────────────────────────────────────────────────────────────────────────
    // 3) Import dynamically
    //    NOTE: your EventBus might export either:
    //          export default bus; export const EVENTS = {...}
    //       or export default { on, off, emit, EVENTS }
    //    We'll handle both shapes.
    // ───────────────────────────────────────────────────────────────────────────
    const EB   = await import(EventBusURL);
    const SM   = await import(StateManagerURL);
    const MT   = await import(MapTabURL);
    const CT   = await import(CharacterTabURL);
    const ST   = await import(SpellsTabURL);
    const FT   = await import(FighterTabURL);
    const KTT  = await import(SkillTreeTabURL);

    // normalize exports
    const eventBus = EB.default?.emit ? EB.default : EB.eventBus || EB.default;
    const EVENTS   = EB.EVENTS || EB.default?.EVENTS || {
      TAB_CHANGED: 'tab:changed'
    };

    const state        = SM.default || SM.state || SM;
    const MapTab       = MT.default;
    const CharacterTab = CT.default;
    const SpellsTab    = ST.default;
    const FighterTab   = FT.default;
    const SkillTreeTab = KTT.default;

    // ───────────────────────────────────────────────────────────────────────────
    // 4) Recreate the main.js wiring (lazy instances + mount)
    // ───────────────────────────────────────────────────────────────────────────
    const factories = {
      map:        () => new MapTab(),
      character:  () => new CharacterTab(),
      spells:     () => new SpellsTab(),
      fighter:    () => new FighterTab(),
      skilltree:  () => new SkillTreeTab(),
    };
    const instances = {};

    function mountTab(tabId) {
      if (!instances[tabId]) instances[tabId] = factories[tabId]();

      const node = (typeof instances[tabId].mount === 'function')
        ? instances[tabId].mount()
        : document.createTextNode(`${tabId} has no mount()`);

      const content = document.getElementById('content');
      content.innerHTML = '';
      content.appendChild(node);

      document.querySelectorAll('.sidebar button').forEach(b => b.classList.remove('active'));
      const btn = document.getElementById(`tab-${tabId}`);
      if (btn) btn.classList.add('active');
    }

    eventBus.on(EVENTS.TAB_CHANGED || 'tab:changed', ({ tabId }) => mountTab(tabId));

    ['map','character','spells','fighter','skilltree'].forEach(id => {
      const btn = document.getElementById(`tab-${id}`);
      if (btn) btn.addEventListener('click', () =>
        eventBus.emit(EVENTS.TAB_CHANGED || 'tab:changed', { tabId: id })
      );
    });

    // Default tab
    eventBus.emit(EVENTS.TAB_CHANGED || 'tab:changed', { tabId: 'map' });

    console.log('[bootstrap] OK: app initialized');

  } catch (err) {
    console.error(err);
    const content = document.getElementById('content');
    if (content) {
      content.innerHTML = `
        <div style="padding:12px;border:1px solid #c33;background:#fee;color:#900;border-radius:8px;">
          <h3>Module load error</h3>
          <pre style="white-space:pre-wrap">${(err && err.message) ? err.message : String(err)}</pre>
          <p>
            Open <code>src/bootstrap.js</code> and add your real file path(s) for the missing module
            into the corresponding <code>candidates</code> list, then reload.
          </p>
          <p>
            Tip: open DevTools → Network → check which URLs 404. Copy a working one into the candidates.
          </p>
        </div>`;
    }
  }
})();
