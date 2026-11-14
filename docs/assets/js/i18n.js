/* Khaydarin Studio — 언어 감지와 번역 사전
 * <head>에서 동기 로드한다. 첫 화면을 그리기 전에 언어를 정해, 영어 사용자에게 한국어가 잠깐 보이지 않게 한다.
 * - 페이지의 한국어 원문은 HTML에 그대로 있고, 여기에는 영어 번역과 스크립트가 쓰는 문구만 둔다.
 * - 사전 값은 이 파일의 고정 문자열뿐이다(외부 입력 없음). 일부 값은 <em>, <br> 같은 마크업을 담는다.
 */
(() => {
  'use strict';

  const SUPPORTED = ['ko', 'en'];
  const STORAGE_KEY = 'ks:lang';

  // 1) 사용자가 고른 언어 → 2) 브라우저 선호 언어 목록 순서대로 → 3) 그 밖에는 영어
  const detect = () => {
    const list = (navigator.languages && navigator.languages.length) ? navigator.languages : [navigator.language || ''];
    for (const tag of list) {
      const base = String(tag).toLowerCase().split('-')[0];
      if (SUPPORTED.includes(base)) return base;
    }
    return 'en';
  };

  let saved = null;
  try { saved = localStorage.getItem(STORAGE_KEY); } catch { /* 저장소를 쓸 수 없는 환경 */ }
  const initial = SUPPORTED.includes(saved) ? saved : detect();

  const root = document.documentElement;
  root.lang = initial;
  if (initial !== 'ko') root.classList.add('i18n-pending');

  const en = {
    'meta.title': 'Khaydarin Studio — StarCraft map-making editor',
    'meta.desc': 'A StarCraft: Remastered map-making tool that combines a map editor and a data/EUD editor. Terrain, DAT editing, epScript coding, EUD builds and AI (MCP) integration — in a single window.',

    'skip': 'Skip to content',
    'nav.home': 'Khaydarin Studio home',
    'nav.menu': 'Main menu',
    'nav.features': 'Features',
    'nav.data': 'Data editing',
    'nav.code': 'Code editor',
    'nav.ai': 'AI integration',
    'nav.lang': 'Language',
    'nav.github': 'GitHub repository',
    'nav.download': 'Download',

    'hero.title': 'An editor for StarCraft map making',
    'hero.sub': 'From terrain and units to DAT editing and EUD builds.<br>One window, no more switching between programs.',
    'hero.download': 'Download for Windows',
    'hero.explore': 'Explore features',
    'hero.scroll': 'Scroll down',

    'intro.h': 'A complete workspace <em>for map makers</em>',
    'intro.p': 'Khaydarin Studio brings together the map editor <strong>ScmDraft 2</strong> and the data/EUD editor <strong>EUD Editor</strong>.<br>Map, data, code and AI work flow naturally within a single project.',
    'pillar.map.h': 'Map editing',
    'pillar.map.p': 'Edit ISOM terrain, units, doodads, locations, symmetric placement and text triggers — while seeing the Remastered graphics exactly as in game.',
    'pillar.map.link': 'See map editing features',
    'pillar.data.h': 'Data editing',
    'pillar.data.p': 'Modify DATs such as units · weapons · upgrades, requirements, game strings and button sets, then build straight into an EUD map.',
    'pillar.data.link': 'See data editing features',
    'pillar.code.h': 'Code editor (epScript)',
    'pillar.code.p': 'A built-in epScript editor for developers. Write scripts with language-server features like autocomplete and hover, then build them together with the map.',
    'pillar.code.link': 'Learn about the code editor',
    'pillar.ai.h': 'AI integration (MCP)',
    'pillar.ai.p': 'In the built-in AI chat, Claude Code, Codex or Antigravity edit your map directly. Review the results before applying them, and roll back any time with the timeline.',
    'pillar.ai.link': 'Learn about AI integration',

    'map.eyebrow': 'Like ScmDraft 2',
    'map.h': 'Map editing <em>that looks like the game</em>',
    'map.p': 'Reads Remastered data (CASC) directly to draw terrain, units, buildings and sprites just like the game.<br>Switch between SD · HD · Cartoon styles with one click, with idle animations and shadows playing too.',
    'shot.hero.alt': 'Khaydarin Studio map editor',
    'shot.map.alt': 'Map editor: symmetry tools, graphics style switch, minimap and unit placement panel',
    'f1.h': 'Three graphic styles',
    'f1.p': 'Switch between Original (SD), Remastered (HD) and Cartoon, with iscript-driven animations and shadows played just like in game.',
    'f2.h': 'ISOM terrain brush',
    'f2.p': 'The same isometric algorithm as StarEdit and ScmDraft joins edges, cliffs and shorelines automatically. Rectangle and tile-index modes are supported too.',
    'f3.h': 'Symmetric editing',
    'f3.p': 'Place terrain and units in one go with horizontal, vertical, 4-way or point symmetry — and put the center of symmetry wherever you like.',
    'f4.h': 'Smart placement',
    'f4.p': 'Previews unit overlap, buildable and walkable terrain, and skips blocked spots. Drag to place units continuously.',
    'f5.h': 'Area copy',
    'f5.p': 'Copy units, doodads, sprites and locations together with terrain and fog of war, and paste them into other maps. The paste preview shows the actual tiles.',
    'f6.h': 'Minimap images',
    'f6.p': 'Pick an image and terrain is generated so the picture shows up on the in-game minimap (SD 128px / HD 256·512px).',
    'f7.h': 'Location colors · groups',
    'f7.p': 'Give each location a color and group them to hide or lock, keeping even complex maps tidy.',
    'f8.h': 'Text triggers',
    'f8.p': 'Write triggers in a syntax compatible with ScmDraft Text Trigedit, in an editor with syntax highlighting that flags error lines instantly.',
    'f9.h': 'Sound management',
    'f9.p': 'Add, remove and play WAV and OGG files in your map. Browse StarCraft’s built-in sounds by folder, listen to them and copy the path for Play WAV.',
    'f10.h': 'Map size · tileset change',
    'f10.p': 'Change the map size (16–256) and tileset. Choose where the existing map sits from 9 anchors, and pick the terrain for the newly added area.',
    'f11.h': 'Map revealers · view options',
    'f11.p': 'Hide locations, creep, start locations and map revealers separately, and place or clear map revealers across the whole map in one go.',
    'f12.h': 'Shortcut hints',
    'f12.p': 'Edit quickly with shortcuts, such as 1–8 to change the owner of selected units, and see the keys you pressed and the command that ran briefly on screen.',

    'data.eyebrow': 'Like EUD Editor',
    'data.h': 'Data editing <em>without leaving the map</em>',
    'data.p': 'From unit data to requirements, game strings and button sets.<br>The same tab-and-box layout as EUD Editor makes it feel familiar from the start.',
    'shot.data.alt': 'DatEdit button set editor: command card and button list',
    'd1.p': 'Edit units / weapons / flingy / sprites / images / upgrades / techdata / orders. Changed values stand out, and you can revert or copy them per field, tab or entry. Every edit can be undone with Ctrl+Z.',
    'd2.h': 'Requirements',
    'd2.p': 'Edit production, research, use and order conditions as lists, with the remaining capacity shown in real time.',
    'd3.h': 'Game strings (stat_txt)',
    'd3.p': 'Fix unit names, tooltips and error messages while viewing the English, Korean transliterated and Korean translated originals side by side.',
    'd4.h': 'Button sets',
    'd4.p': 'Edit position, icon, conditions, actions and tooltips while viewing all 250 command cards in the in-game 3×3 layout.',
    'd5.h': 'Preview',
    'd5.p': 'See unit appearance and collision size, iscript playback, and weapon projectiles, range and splash radius at a glance. When iscript plays a sound effect, you hear the game sound too.',
    'd6.h': 'Import EUD Editor 3 projects',
    'd6.p': 'Open a project you were working on in EUD Editor 3 and pick up editing its data right where you left off in Khaydarin Studio.',
    'code.eyebrow': 'For developers',
    'code.h': 'Scripts in the same window: <em>the code editor</em>',
    'code.p': 'Open and edit the epScript files in your map project folder right inside the editor.<br>A language server suggests completions and type info, and building puts your scripts into the map.',
    'shot.code.alt': 'Code editor: project file tree and epScript autocomplete list',
    'c1.h': 'Project explorer',
    'c1.p': 'Browse the map project folder as a tree and edit several files in tabs. The entry file the build starts from is marked with a star.',
    'c2.h': 'Syntax highlighting · code folding',
    'c2.p': 'epScript syntax is color-coded, and you can fold and unfold function and object blocks to keep long scripts readable.',
    'c3.h': 'Autocomplete · hover',
    'c3.p': 'epscript-lsp provides autocomplete that shows object members and function signatures, plus hover descriptions. It also understands scdata such as TrgUnit and CUnit, down to members and offsets. It turns on when Node.js is installed.',
    'c4.h': 'Builds with the map',
    'c4.p': 'Press Build and euddraft bundles your scripts, starting from the entry file, into the map. No separate script build needed.',

    'save.h': 'Saved <em>in the right place</em>, automatically',
    'save.lead': 'No need to think about where or how each change should be stored.',
    'save.p': 'Changed values go into <mark>map settings</mark> that apply without EUD whenever possible, and into <mark>EUD</mark> otherwise.<br>EUD values are generated by a euddraft plugin at build time, so they take effect in game without writing a single script.',
    'save.flow': 'Data save flow',
    'save.src': 'Changed value',
    'save.t1.h': 'Map settings',
    'save.t1.p': '<code>UNIx</code> · <code>UPGx</code> · <code>TECx</code><br>Applied without EUD, undoable',
    'save.t2.p': 'Generated by a euddraft plugin at build time<br>No scripting needed',
    'save.t3.h': 'Project file',
    'save.t3.p': 'Editor-only data is kept in a JSON file<br><code>.khproj</code> next to the map',

    'ai.eyebrow': 'Built-in AI chat · MCP server',
    'ai.h': 'Build maps by talking,<br><em>AI integration</em>',
    'ai.p': 'Tell the AI chat inside the editor what you want, and the AI edits your map directly with the editor’s tools. When it’s done, review what changed and choose whether to apply it.',
    'ai.t1': 'A chat panel opened with Ctrl+Shift+A runs your installed <strong>Claude Code · Codex · Antigravity</strong> — no separate API key',
    'ai.t2': '<strong>More than 110 tools</strong> covering maps, units, locations, terrain, triggers, DAT and builds',
    'ai.t3': 'External MCP clients such as Claude, Codex and local Ollama models connect over <strong>HTTP</strong> or <strong>CLI (stdio)</strong>',
    'ai.t4': 'Expose only the tool groups small models need (<code>?tools=units,triggers</code>)',
    'ai.code': 'Connect while the editor is running (127.0.0.1 only)',
    'copy.aria': 'Copy command',
    'chat.aria': 'AI integration example',
    'chat.head': 'AI chat',
    'chat.user': 'Build a Zerg base in the middle of the map and set up triggers',
    'chat.tool1': 'Prepare terrain',
    'chat.tool2': 'Hatchery · Drones · Overlord',
    'chat.tool4': 'Start trigger',
    'chat.ai': 'I placed a Zerg base in the center of the map and added a start trigger. You can check it in the editor right away.',
    'chat.foot': 'Review the change summary and apply it, or undo it in one step',
    'a1.h': 'AI work review',
    'a1.p': 'Editing is locked while the AI works, with its progress shown. Stop at any time to return to where you started; when it finishes, review the change summary and choose whether to apply it.',
    'a2.h': 'Timeline',
    'a2.p': 'Saves snapshots of the map, EUD data, scripts and sounds before and after AI work, or whenever you like. Compare snapshots and go back to any of them.',
    'a3.h': 'Per-map chat history',
    'a3.p': 'Chats are saved with the map and pick up where you left off when you reopen it. Attach images and files, or pop the chat out into its own window docked beside the main one.',
    'a4.h': 'Usage display',
    'a4.p': 'Shows how much of the agent account’s usage is left, and how full the current chat’s context is, right above the input box.',
    'a5.h': 'Map-making knowledge search',
    'a5.p': 'Looks up EUD, epScript and trigger techniques and troubleshooting material to answer. If nothing fits, it says so instead of making things up.',
    'a6.h': 'Clean build errors',
    'a6.p': 'Turns build logs into errors and warnings by file and line, and checks scripts in under a second without building the map, so the AI can fix them on its own.',

    'dl.h': 'Get <em>started</em> now',
    'dl.p': 'Download the latest installer and run it. Later updates install right inside the editor.<br>Game data is found automatically from your StarCraft: Remastered installation.',
    'dl.os': 'Windows 10 / 11 (64-bit)',
    'dl.all': 'Previous versions and changelog',
    'tag.req': 'Required',
    'tag.opt': 'Optional',
    'req1.p': 'Game data is read directly from the install folder, which is located automatically via the registry.',
    'req2.p': 'Only needed to build EUD maps. Set its path in the Settings screen.',
    'req3.p': 'Powers language-server features such as autocompletion and hover in the script editor. Editing works without it.',

    'cta.issues': 'Feature requests · Bug reports',
    'cta.discord': 'Join our Discord',

    'footer.nav': 'Shortcuts',
    'footer.releases': 'Releases',
    'footer.issues': 'Issues',
    'footer.top': 'Back to top',
    'footer.oss': 'Open source used: StormLib · CascLib · WPF-UI · AvalonEdit · zuhanit/epscript-lsp · euddraft (run externally at build time)',
    'footer.tm': 'StarCraft and StarCraft: Brood War are trademarks of Blizzard Entertainment. This project is not affiliated with Blizzard.',

    // 스크립트에서 쓰는 문구
    'js.copy': 'Copy',
    'js.copied': 'Copied',
    'js.selected': 'Selected',
    'js.rel.loading': 'Loading release info…',
    'js.rel.latest': 'Latest {tag}',
    'js.rel.download': 'Download {tag}',
    'js.rel.downloadPlain': 'Download',
    'js.rel.fallbackMeta': 'Latest release',
    'js.rel.getLatest': 'Get the latest version',
    'js.rel.none': 'The first release is on its way. Check the releases page for updates.',
    'js.rel.page': 'Releases page',
    'js.rel.error': 'Check the releases page for the latest version.',
  };

  // 한국어 원문은 HTML에서 읽고, 스크립트 문구만 여기 둔다
  const ko = {
    'js.copy': '복사',
    'js.copied': '복사됨',
    'js.selected': '선택됨',
    'js.rel.loading': '릴리즈 정보를 불러오는 중…',
    'js.rel.latest': '최신 {tag}',
    'js.rel.download': '{tag} 다운로드',
    'js.rel.downloadPlain': '다운로드',
    'js.rel.fallbackMeta': '최신 릴리즈',
    'js.rel.getLatest': '최신 버전 받기',
    'js.rel.none': '첫 릴리즈를 준비하고 있어요. 릴리즈 페이지에서 소식을 확인하세요.',
    'js.rel.page': '릴리즈 페이지',
    'js.rel.error': '릴리즈 페이지에서 최신 버전을 확인하세요.',
  };

  window.KS_I18N = Object.freeze({
    initial,
    supported: Object.freeze(SUPPORTED.slice()),
    storageKey: STORAGE_KEY,
    dict: Object.freeze({ ko: Object.freeze(ko), en: Object.freeze(en) }),
  });
})();
