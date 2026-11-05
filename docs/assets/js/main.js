/* Khaydarin Studio — landing page script
 * - 외부 입력(GitHub API 응답)은 textContent로만 출력하고, 링크는 허용된 호스트만 사용한다.
 * - 애니메이션은 화면에 보일 때만 돌리고, 감시자/타이머는 쓰임이 끝나면 정리한다.
 */
(() => {
  'use strict';

  const REPO = 'saebyeok0306/Khaydarin-Studio';
  const RELEASES_URL = `https://github.com/${REPO}/releases`;
  const reduceMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

  document.documentElement.classList.add('js');

  /* ───────── 언어 (한국어 / 영어) ─────────
   * 한국어 원문은 HTML에 있고, 처음 한 번 읽어 둔 뒤 언어를 바꿀 때 사전 값과 맞바꾼다.
   * innerHTML에 넣는 값은 i18n.js의 고정 문자열 또는 이 페이지의 원문뿐이다.
   */
  const I18N = window.KS_I18N || null;
  const SUPPORTED = I18N ? I18N.supported : ['ko'];
  let lang = I18N ? I18N.initial : 'ko';
  const langListeners = [];

  const t = (key, vars) => {
    const dict = I18N ? I18N.dict : { ko: {}, en: {} };
    let str = (dict[lang] && dict[lang][key]) ?? dict.ko[key] ?? key;
    if (vars) str = str.replace(/\{(\w+)\}/g, (_, k) => (vars[k] ?? ''));
    return str;
  };

  const textEls = Array.from(document.querySelectorAll('[data-i18n]'))
    .map((el) => ({ el, key: el.getAttribute('data-i18n'), ko: el.innerHTML }));
  const ariaEls = Array.from(document.querySelectorAll('[data-i18n-aria]'))
    .map((el) => ({ el, key: el.getAttribute('data-i18n-aria'), ko: el.getAttribute('aria-label') || '' }));
  const altEls = Array.from(document.querySelectorAll('[data-i18n-alt]'))
    .map((el) => ({ el, key: el.getAttribute('data-i18n-alt'), ko: el.getAttribute('alt') || '' }));
  const metaDesc = document.querySelector('meta[name="description"]');
  const koTitle = document.title;
  const koDesc = metaDesc ? metaDesc.getAttribute('content') : '';
  const langBtns = document.querySelectorAll('[data-lang]');

  const pick = (key, koValue) => {
    if (lang === 'ko' || !I18N) return koValue;
    const v = I18N.dict[lang] && I18N.dict[lang][key];
    return typeof v === 'string' ? v : koValue;
  };

  const applyLang = () => {
    document.documentElement.lang = lang;
    for (const { el, key, ko } of textEls) {
      const html = pick(key, ko);
      if (el.innerHTML !== html) el.innerHTML = html;
    }
    for (const { el, key, ko } of ariaEls) el.setAttribute('aria-label', pick(key, ko));
    for (const { el, key, ko } of altEls) el.setAttribute('alt', pick(key, ko));
    document.title = pick('meta.title', koTitle);
    if (metaDesc) metaDesc.setAttribute('content', pick('meta.desc', koDesc));
    langBtns.forEach((b) => b.setAttribute('aria-pressed', String(b.getAttribute('data-lang') === lang)));
    langListeners.forEach((fn) => fn());
    document.documentElement.classList.remove('i18n-pending');
  };

  const setLang = (next) => {
    if (!SUPPORTED.includes(next) || next === lang) return;
    lang = next;
    if (I18N) {
      try { localStorage.setItem(I18N.storageKey, next); } catch { /* 저장 불가 환경 무시 */ }
    }
    applyLang();
  };

  langBtns.forEach((b) => b.addEventListener('click', () => setLang(b.getAttribute('data-lang'))));

  /* ───────── Nav: 스크롤 시 배경 ───────── */
  const nav = document.querySelector('.nav');
  if (nav) {
    let ticking = false;
    const update = () => {
      nav.classList.toggle('is-scrolled', window.scrollY > 12);
      ticking = false;
    };
    window.addEventListener('scroll', () => {
      if (!ticking) { ticking = true; requestAnimationFrame(update); }
    }, { passive: true });
    update();
  }

  /* ───────── 페이지 안 링크 (#id) ─────────
   * 큰 화면에서는 본문에 zoom을 걸어 확대하는데(style.css '큰 화면'), 이때 브라우저가 #id로
   * 부드럽게 스크롤하면서 맨 위까지 올라갔다가 내려오는 경우가 있다. 그래서 목적지를 직접 계산해 스크롤한다.
   * 부드럽게 갈지 여부는 CSS scroll-behavior를 따르므로 '동작 줄이기' 설정도 그대로 지켜진다.
   */
  const scrollToId = (id) => {
    const target = id ? document.getElementById(id) : null;
    if (!target) return false;
    let top = 0; // 고정된 상단 메뉴(#top)는 맨 위로
    if (getComputedStyle(target).position !== 'fixed') {
      const pad = parseFloat(getComputedStyle(document.documentElement).scrollPaddingTop) || 0;
      top = Math.max(0, target.getBoundingClientRect().top + window.scrollY - pad);
    }
    window.scrollTo({ top });
    // 키보드 사용자가 이어서 Tab을 누르면 목적지부터 이동하도록 초점을 옮긴다
    if (target.tabIndex < 0 && !target.hasAttribute('tabindex')) target.setAttribute('tabindex', '-1');
    target.focus({ preventScroll: true });
    return true;
  };

  document.addEventListener('click', (e) => {
    if (e.defaultPrevented || e.button !== 0 || e.metaKey || e.ctrlKey || e.shiftKey || e.altKey) return;
    const link = e.target instanceof Element ? e.target.closest('a[href^="#"]') : null;
    if (!link) return;
    const hash = link.getAttribute('href');
    let id = '';
    try { id = decodeURIComponent(hash.slice(1)); } catch { return; }
    if (!scrollToId(id)) return;
    e.preventDefault();
    if (location.hash !== hash) history.pushState(null, '', hash);
  });

  /* ───────── Reveal on scroll ───────── */
  const reveals = document.querySelectorAll('.reveal');
  if (reduceMotion || !('IntersectionObserver' in window)) {
    reveals.forEach((el) => el.classList.add('is-in'));
  } else {
    // 같은 부모 안의 형제끼리 순서대로 살짝 지연
    reveals.forEach((el) => {
      const siblings = el.parentElement ? el.parentElement.querySelectorAll(':scope > .reveal') : [];
      const idx = Array.prototype.indexOf.call(siblings, el);
      if (idx > 0) el.style.setProperty('--d', `${Math.min(idx, 6) * 0.07}s`);
    });
    const io = new IntersectionObserver((entries) => {
      for (const entry of entries) {
        if (entry.isIntersecting) {
          entry.target.classList.add('is-in');
          io.unobserve(entry.target);
        }
      }
    }, { rootMargin: '0px 0px -8% 0px', threshold: 0.08 });
    reveals.forEach((el) => io.observe(el));
  }

  /* ───────── Copy button ───────── */
  document.querySelectorAll('[data-copy]').forEach((btn) => {
    const target = document.getElementById(btn.getAttribute('data-copy'));
    const label = btn.querySelector('[data-copy-label]');
    if (!target || !label) return;
    let timer = 0;
    const reset = () => {
      label.textContent = t('js.copy');
      btn.classList.remove('is-done');
    };
    langListeners.push(() => { clearTimeout(timer); reset(); });
    btn.addEventListener('click', async () => {
      const text = target.textContent.trim();
      let ok = false;
      try {
        await navigator.clipboard.writeText(text);
        ok = true;
      } catch {
        // clipboard API를 못 쓰는 환경: 선택만 해 둔다
        const range = document.createRange();
        range.selectNodeContents(target);
        const sel = window.getSelection();
        if (sel) { sel.removeAllRanges(); sel.addRange(range); }
      }
      label.textContent = t(ok ? 'js.copied' : 'js.selected');
      btn.classList.toggle('is-done', ok);
      clearTimeout(timer);
      timer = setTimeout(reset, 1800);
    });
  });

  /* ───────── Starfield ─────────
   * 페이지 전체 뒤에 고정된 캔버스. 별이 잔잔하게 반짝이며 아주 천천히 흐르고,
   * 스크롤하면 별마다 다른 속도로 살짝 따라 움직여(시차) 깊이감을 준다.
   * 색온도만 살짝 섞고, 몇 개의 별에만 옅은 빛 번짐을 준다(미리 그린 스프라이트 재사용).
   */
  const canvas = document.querySelector('.starfield');
  const ctx = canvas && canvas.getContext('2d');
  if (canvas && ctx) {
    const COLORS = ['#ffffff', '#ffffff', '#ffffff', '#e2e6ff', '#c7cdff', '#ffeedd'];
    let stars = [];
    let w = 0;
    let h = 0;
    let raf = 0;
    let last = 0;
    let resizeTimer = 0;

    const halo = document.createElement('canvas');
    halo.width = halo.height = 32;
    {
      const g = halo.getContext('2d');
      const grad = g.createRadialGradient(16, 16, 0, 16, 16, 16);
      grad.addColorStop(0, 'rgba(220,224,255,.55)');
      grad.addColorStop(0.4, 'rgba(160,165,255,.12)');
      grad.addColorStop(1, 'rgba(140,140,255,0)');
      g.fillStyle = grad;
      g.fillRect(0, 0, 32, 32);
    }

    const build = () => {
      const dpr = Math.min(window.devicePixelRatio || 1, 2);
      w = canvas.clientWidth;
      h = canvas.clientHeight;
      canvas.width = Math.round(w * dpr);
      canvas.height = Math.round(h * dpr);
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
      const count = Math.min(420, Math.round((w * h) / 5200));
      stars = new Array(count);
      for (let i = 0; i < count; i++) {
        const big = Math.random() < 0.08;
        const depth = Math.random();                  // 0: 멀리, 1: 가까이
        stars[i] = {
          x: Math.random() * w,
          y: Math.random() * h,
          r: big ? 1.2 + Math.random() * 0.6 : 0.4 + depth * 0.7,
          a: 0.25 + Math.random() * 0.6,
          s: 0.4 + Math.random() * 1.4,              // 반짝임 속도
          p: Math.random() * Math.PI * 2,           // 위상
          v: 0.02 + depth * 0.06,                   // 흐르는 속도(px/frame@60fps)
          par: 0.02 + (big ? 0.1 : depth * 0.08),   // 스크롤 시차 비율
          c: COLORS[(Math.random() * COLORS.length) | 0],
          halo: big && Math.random() < 0.35,
        };
      }
    };

    const draw = (t, dt) => {
      ctx.clearRect(0, 0, w, h);
      const time = t / 1000;
      const sy = reduceMotion ? 0 : window.scrollY;
      for (let i = 0; i < stars.length; i++) {
        const st = stars[i];
        if (!reduceMotion) {
          st.x -= st.v * dt;
          if (st.x < -8) st.x = w + 8;
        }
        let y = (st.y - sy * st.par) % h;
        if (y < 0) y += h;
        const alpha = reduceMotion ? st.a : st.a * (0.55 + 0.45 * Math.sin(time * st.s + st.p));
        if (st.halo) {
          ctx.globalAlpha = alpha * 0.8;
          ctx.drawImage(halo, st.x - 8, y - 8, 16, 16);
        }
        ctx.globalAlpha = alpha;
        ctx.fillStyle = st.c;
        ctx.beginPath();
        ctx.arc(st.x, y, st.r, 0, Math.PI * 2);
        ctx.fill();
      }
      ctx.globalAlpha = 1;
    };

    const loop = (t) => {
      const dt = last ? Math.min(3, (t - last) / 16.667) : 1; // 주사율과 무관하게 같은 속도
      last = t;
      draw(t, dt);
      raf = requestAnimationFrame(loop);
    };

    const start = () => {
      if (reduceMotion) { draw(0, 0); return; }
      if (!raf) { last = 0; raf = requestAnimationFrame(loop); }
    };
    const stop = () => {
      if (raf) cancelAnimationFrame(raf);
      raf = 0;
    };

    build();
    start();

    window.addEventListener('resize', () => {
      clearTimeout(resizeTimer);
      resizeTimer = setTimeout(() => {
        if (canvas.clientWidth === w && canvas.clientHeight === h) return;
        build();
        if (reduceMotion) draw(0, 0);
      }, 150);
    }, { passive: true });

    // 탭이 숨겨지면 멈추고, 돌아오면 이어서 그린다
    document.addEventListener('visibilitychange', () => {
      if (document.hidden) stop();
      else start();
    });
  }

  /* ───────── Latest release (GitHub API) ───────── */
  const versionEls = document.querySelectorAll('[data-release-version]');
  const metaEl = document.querySelector('[data-release-meta]');
  const linkEl = document.querySelector('[data-release-link]');
  const labelEl = document.querySelector('[data-release-label]');
  const CACHE_KEY = 'ks:latest-release';
  const CACHE_TTL = 10 * 60 * 1000;

  const isSafeDownloadUrl = (url) => {
    try {
      const u = new URL(url);
      return u.protocol === 'https:' && (u.hostname === 'github.com' || u.hostname.endsWith('.githubusercontent.com'));
    } catch { return false; }
  };

  const formatSize = (bytes) => {
    if (!Number.isFinite(bytes) || bytes <= 0) return '';
    const mb = bytes / (1024 * 1024);
    return mb >= 1 ? `${mb.toFixed(1)} MB` : `${Math.max(1, Math.round(bytes / 1024))} KB`;
  };

  const formatDate = (iso) => {
    const d = new Date(iso);
    if (Number.isNaN(d.getTime())) return '';
    return new Intl.DateTimeFormat(lang === 'ko' ? 'ko-KR' : 'en-US', { year: 'numeric', month: 'long', day: 'numeric' }).format(d);
  };

  const pickAsset = (assets) => {
    if (!Array.isArray(assets)) return null;
    const score = (name) => {
      const n = String(name).toLowerCase();
      if (/(setup|installer).*\.(exe|msi)$/.test(n)) return 4;
      if (/win.*\.zip$/.test(n) || /x64.*\.zip$/.test(n)) return 3;
      if (n.endsWith('.zip')) return 2;
      if (n.endsWith('.exe') || n.endsWith('.msi')) return 1;
      return 0;
    };
    return assets
      .filter((a) => a && typeof a.name === 'string' && score(a.name) > 0)
      .sort((a, b) => score(b.name) - score(a.name))[0] || null;
  };

  // 상태만 기억해 두고, 언어가 바뀌면 같은 상태를 다시 그린다
  let relState = { kind: 'loading' };

  const renderRelease = () => {
    if (relState.kind === 'ok') {
      const rel = relState.rel;
      const tag = typeof rel.tag_name === 'string' ? rel.tag_name.slice(0, 32) : '';
      if (tag) versionEls.forEach((el) => { el.textContent = tag; });

      const asset = pickAsset(rel.assets);
      const usable = asset && isSafeDownloadUrl(asset.browser_download_url);
      if (usable && linkEl) {
        linkEl.href = asset.browser_download_url;
        linkEl.removeAttribute('target');
      }
      if (labelEl) {
        labelEl.textContent = usable
          ? (tag ? t('js.rel.download', { tag }) : t('js.rel.downloadPlain'))
          : t('js.rel.getLatest');
      }
      if (metaEl) {
        const parts = [];
        if (tag) parts.push(t('js.rel.latest', { tag }));
        const date = formatDate(rel.published_at);
        if (date) parts.push(date);
        if (asset) {
          const name = String(asset.name).slice(0, 80);
          const size = formatSize(asset.size);
          parts.push(size ? `${name} · ${size}` : name);
        }
        metaEl.textContent = parts.join(' · ') || t('js.rel.fallbackMeta');
      }
      return;
    }
    if (relState.kind === 'none') {
      if (metaEl) metaEl.textContent = t('js.rel.none');
      if (labelEl) labelEl.textContent = t('js.rel.page');
      if (linkEl) linkEl.href = RELEASES_URL;
      return;
    }
    if (labelEl) labelEl.textContent = t('js.rel.getLatest');
    if (metaEl) metaEl.textContent = t(relState.kind === 'error' ? 'js.rel.error' : 'js.rel.loading');
  };
  const setRelease = (state) => { relState = state; renderRelease(); };
  langListeners.push(renderRelease);

  const readCache = () => {
    try {
      const raw = sessionStorage.getItem(CACHE_KEY);
      if (!raw) return undefined;
      const { at, data } = JSON.parse(raw);
      return Date.now() - at < CACHE_TTL ? data : undefined;
    } catch { return undefined; }
  };
  const writeCache = (data) => {
    try { sessionStorage.setItem(CACHE_KEY, JSON.stringify({ at: Date.now(), data })); } catch { /* 저장 불가 환경 무시 */ }
  };

  const loadRelease = async () => {
    const cached = readCache();
    if (cached !== undefined) {
      setRelease(cached ? { kind: 'ok', rel: cached } : { kind: 'none' });
      return;
    }
    const ctrl = new AbortController();
    const timeout = setTimeout(() => ctrl.abort(), 8000);
    try {
      const res = await fetch(`https://api.github.com/repos/${REPO}/releases/latest`, {
        headers: { Accept: 'application/vnd.github+json' },
        signal: ctrl.signal,
        credentials: 'omit',
        referrerPolicy: 'no-referrer',
      });
      if (res.status === 404) { writeCache(null); setRelease({ kind: 'none' }); return; }
      if (!res.ok) throw new Error(String(res.status));
      const json = await res.json();
      // 필요한 필드만 남겨 캐시
      const slim = {
        tag_name: json.tag_name,
        published_at: json.published_at,
        assets: Array.isArray(json.assets)
          ? json.assets.map((a) => ({ name: a.name, size: a.size, browser_download_url: a.browser_download_url }))
          : [],
      };
      writeCache(slim);
      setRelease({ kind: 'ok', rel: slim });
    } catch {
      setRelease({ kind: 'error' });
    } finally {
      clearTimeout(timeout);
    }
  };

  applyLang();
  if (metaEl || versionEls.length) loadRelease();
})();
