/* Grammar Tales — app */
(() => {
  const $ = (s, el = document) => el.querySelector(s);
  const $$ = (s, el = document) => [...el.querySelectorAll(s)];
  const app = $('#app');
  const esc = s => String(s).replace(/[&<>"']/g, c => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' }[c]));

  /* ---------- storage ---------- */
  const store = {
    get(k, d) { try { const v = localStorage.getItem(k); return v ? JSON.parse(v) : d; } catch { return d; } },
    set(k, v) { try { localStorage.setItem(k, JSON.stringify(v)); } catch { /* ignore */ } }
  };
  let chars = store.get('gt_chars', null);
  if (!Array.isArray(chars) || !chars.length) chars = CH.PRESETS.map(c => ({ ...c }));
  const saveChars = () => store.set('gt_chars', chars);
  const settings = Object.assign({ notes: true, voice: true, auto: false }, store.get('gt_settings', {}));
  const saveSettings = () => store.set('gt_settings', settings);
  const progress = store.get('gt_progress', {});
  const castMemory = store.get('gt_cast', {});

  function toast(msg) {
    const t = $('#toast'); t.textContent = msg; t.classList.add('show');
    clearTimeout(toast._t); toast._t = setTimeout(() => t.classList.remove('show'), 2200);
  }

  /* ---------- text helpers ---------- */
  const PRON = { he: { he: 'he', his: 'his', him: 'him' }, she: { he: 'she', his: 'her', him: 'her' } };
  const cap = s => s.charAt(0).toUpperCase() + s.slice(1);
  function fill(text, cast) {
    return text.replace(/\{([ABC])(?:\.(he|He|his|His|him))?\}/g, (m, k, p) => {
      const c = cast[k]; if (!c) return m;
      if (!p) return c.name;
      const v = PRON[c.pronoun === 'she' ? 'she' : 'he'][p.toLowerCase()];
      return p[0] === p[0].toUpperCase() ? cap(v) : v;
    });
  }
  // returns { html, notes:[{w,n}], plain, words }
  function rich(text, cast, animate = true) {
    const filled = fill(text, cast);
    let html = '', notes = [], plain = '', i = 0;
    const words = s => s.split(/(\s+)/).map(w => {
      if (!w) return '';
      if (/^\s+$/.test(w)) return w;
      return animate ? `<span class="w" style="--i:${i++}">${esc(w)}</span>` : esc(w);
    }).join('');
    const re = /\[\[(.+?)\]\]/g; let last = 0, m;
    while ((m = re.exec(filled))) {
      const before = filled.slice(last, m.index);
      html += words(before); plain += before;
      const [w, n] = m[1].split('::');
      html += `<span class="hl${n ? ' has-note' : ''}"${n ? ` data-note="${esc(n)}"` : ''}>${words(w)}</span>`;
      plain += w;
      if (n) notes.push({ w, n });
      last = re.lastIndex;
    }
    html += words(filled.slice(last)); plain += filled.slice(last);
    return { html, notes, plain, words: i };
  }

  /* ---------- actor ---------- */
  function actorHTML(c, mood = 'neutral', extra = '') {
    return `<div class="actor ${extra}" data-id="${esc(c.id)}">
      <div class="actor-motion"><div class="actor-scale" style="--blink:${(Math.random() * 3).toFixed(2)}s">${CH.svg(c, mood)}</div></div>
    </div>`;
  }
  function setMood(actorEl, c, mood) {
    const sc = $('.actor-scale', actorEl); sc.innerHTML = CH.svg(c, mood);
  }
  function playAct(actorEl, act) {
    if (!act) return;
    const m = $('.actor-motion', actorEl);
    m.classList.remove('a-jump', 'a-shake', 'a-wave', 'a-nod');
    void m.offsetWidth;
    m.classList.add('a-' + act);
  }

  /* ---------- speech ---------- */
  let voices = [];
  const loadVoices = () => { try { voices = speechSynthesis.getVoices().filter(v => /^en(-|_)/i.test(v.lang)); } catch { voices = []; } };
  if ('speechSynthesis' in window) { loadVoices(); speechSynthesis.onvoiceschanged = loadVoices; }
  function speak(text, opts, onend) {
    if (!('speechSynthesis' in window)) { onend && onend(); return false; }
    speechSynthesis.cancel();
    const u = new SpeechSynthesisUtterance(text.replace(/[“”"]/g, ''));
    u.lang = 'en-US'; u.rate = opts.rate || .92; u.pitch = opts.pitch || 1;
    const pref = voices.filter(v => /en-US|en_US/i.test(v.lang));
    const pool = pref.length ? pref : voices;
    if (pool.length) u.voice = pool[(opts.voiceIdx || 0) % pool.length];
    u.onend = () => onend && onend();
    u.onerror = () => onend && onend();
    speechSynthesis.speak(u);
    return true;
  }
  const stopSpeech = () => { try { speechSynthesis.cancel(); } catch { } };

  /* ---------- router ---------- */
  let cleanup = null;
  function route() {
    if (cleanup) { cleanup(); cleanup = null; }
    stopSpeech();
    const h = location.hash.replace(/^#\/?/, '').split('/');
    $$('[data-nav]').forEach(a => a.classList.toggle('active', (h[0] || 'home') === a.dataset.nav || (h[0] === '' && a.dataset.nav === 'home')));
    window.scrollTo(0, 0);
    if (h[0] === 'studio') return viewStudio(h[1]);
    if (h[0] === 'cast') return viewCast(h[1]);
    if (h[0] === 'play') return viewPlay(h[1]);
    return viewHome();
  }
  window.addEventListener('hashchange', route);

  /* ---------- HOME ---------- */
  let levelFilter = 'all';
  function viewHome() {
    const heroCast = chars.slice(0, 3);
    const levels = ['all', 'A1', 'A2', 'B1', 'B2'];
    app.innerHTML = `
      <section class="hero">
        <div class="hero-text">
          <p class="eyebrow">Học ngữ pháp qua truyện</p>
          <h1>Nhân vật của bạn,<br><span class="scribble">câu chuyện</span> của bạn.</h1>
          <p class="lead">Tạo nhân vật, giao vai, rồi xem các bạn ấy diễn những câu chuyện nhỏ. Mỗi truyện ẩn một điểm ngữ pháp, có giải thích tiếng Việt, giọng đọc và quiz cuối truyện.</p>
          <div class="hero-cta">
            <a class="btn btn-primary" href="#stories">Chọn truyện ↓</a>
            <a class="btn btn-ghost" href="#/studio/new">+ Tạo nhân vật</a>
          </div>
        </div>
        <div class="hero-stage">
          <div class="hero-blob"></div>
          ${heroCast.map((c, i) => actorHTML(c, ['happy', 'excited', 'neutral'][i], 'hero-actor h' + i)).join('')}
        </div>
      </section>

      <section class="stories" id="stories">
        <div class="section-head">
          <h2>Thư viện truyện</h2>
          <div class="chips" role="tablist">${levels.map(l => `<button class="chip ${l === levelFilter ? 'on' : ''}" data-level="${l}">${l === 'all' ? 'Tất cả' : l}</button>`).join('')}</div>
        </div>
        <div class="story-grid">
          ${STORIES.filter(s => levelFilter === 'all' || s.level === levelFilter).map(s => {
            const p = progress[s.id];
            return `<a class="story-card" href="#/cast/${s.id}" style="--c:${s.color}">
              <div class="story-thumb">${SCENES.get(s.scene)}<span class="story-emoji">${s.emoji}</span></div>
              <div class="story-body">
                <div class="story-meta"><span class="lvl">${s.level}</span><span>${s.roles.length} vai</span>${p ? `<span class="done">★ ${p.best}/${s.quiz.length}</span>` : ''}</div>
                <h3>${esc(s.title)}</h3>
                <p class="g">${esc(s.grammar)} · <span>${esc(s.grammarVi)}</span></p>
              </div>
            </a>`;
          }).join('')}
        </div>
      </section>`;
    $$('.chip', app).forEach(b => b.onclick = () => { levelFilter = b.dataset.level; viewHome(); $('#stories').scrollIntoView(); });
    $('.hero-cta a[href="#stories"]').onclick = e => { e.preventDefault(); $('#stories').scrollIntoView({ behavior: 'smooth' }); };
    // waving loop on hero
    const heroActors = $$('.hero-actor');
    let k = 0;
    const iv = setInterval(() => { const a = heroActors[k++ % heroActors.length]; a && playAct(a, ['wave', 'jump', 'nod'][k % 3]); }, 1800);
    cleanup = () => clearInterval(iv);
  }

  /* ---------- STUDIO ---------- */
  function viewStudio(editId) {
    if (!editId) {
      app.innerHTML = `
        <section class="page">
          <div class="section-head">
            <div><h2>Xưởng nhân vật</h2><p class="sub">Nhân vật lưu trên trình duyệt này. Bấm vào để chỉnh sửa.</p></div>
            <a class="btn btn-primary" href="#/studio/new">+ Tạo nhân vật</a>
          </div>
          <div class="char-grid">
            ${chars.map(c => `<a class="char-card" href="#/studio/${esc(c.id)}">
              ${actorHTML(c, 'happy')}
              <div class="char-name">${esc(c.name)} <small>${c.pronoun === 'she' ? 'she/her' : 'he/him'}</small></div></a>`).join('')}
            <a class="char-card add" href="#/studio/new"><span>+</span><div class="char-name">Nhân vật mới</div></a>
          </div>
          <button class="link-btn" id="resetChars">Khôi phục nhân vật mặc định</button>
        </section>`;
      $('#resetChars').onclick = () => {
        if (!confirm('Xoá hết nhân vật bạn tạo và quay về 4 nhân vật mặc định?')) return;
        chars = CH.PRESETS.map(c => ({ ...c })); saveChars(); viewStudio(); toast('Đã khôi phục');
      };
      return;
    }

    const existing = chars.find(c => c.id === editId);
    const isNew = !existing;
    const c = existing ? { ...existing } : CH.random('');
    let previewMood = 'happy';

    const swatches = (field, list) => `<div class="swatches">${list.map(col =>
      `<button class="sw ${c[field] === col ? 'on' : ''}" data-f="${field}" data-v="${col}" style="--sw:${col}" aria-label="${col}"></button>`).join('')}</div>`;
    const options = (field, list) => `<div class="opts">${list.map(([v, l]) =>
      `<button class="opt ${c[field] === v ? 'on' : ''}" data-f="${field}" data-v="${v}">${l}</button>`).join('')}</div>`;
    const moodsVi = { neutral: 'Bình thường', happy: 'Vui', excited: 'Phấn khích', sad: 'Buồn', surprised: 'Ngạc nhiên', angry: 'Giận', thinking: 'Suy nghĩ' };

    function render() {
      app.innerHTML = `
        <section class="page studio">
          <a class="back" href="#/studio">← Tất cả nhân vật</a>
          <div class="studio-grid">
            <div class="studio-preview">
              <div class="preview-stage">${SCENES.get('park')}<div class="preview-actor">${actorHTML(c, previewMood)}</div></div>
              <div class="preview-name">${esc(c.name || 'Chưa đặt tên')}</div>
              <div class="moods">${CH.MOODS.map(m => `<button class="opt sm ${m === previewMood ? 'on' : ''}" data-mood="${m}">${moodsVi[m]}</button>`).join('')}</div>
              <div class="moods">
                <button class="opt sm" data-act="wave">👋 Vẫy tay</button>
                <button class="opt sm" data-act="jump">⬆ Nhảy</button>
                <button class="opt sm" data-act="talk">💬 Nói</button>
              </div>
            </div>
            <div class="studio-form">
              <label class="field"><span>Tên nhân vật</span>
                <input id="cname" maxlength="14" value="${esc(c.name)}" placeholder="VD: Minh, Lan, Captain Kiwi..." autocomplete="off"></label>
              <div class="field"><span>Đại từ trong truyện</span>
                <div class="opts"><button class="opt ${c.pronoun === 'he' ? 'on' : ''}" data-f="pronoun" data-v="he">he / his</button>
                <button class="opt ${c.pronoun === 'she' ? 'on' : ''}" data-f="pronoun" data-v="she">she / her</button></div></div>
              <div class="field"><span>Màu da</span>${swatches('skin', CH.SKINS)}</div>
              <div class="field"><span>Kiểu tóc</span>${options('hairStyle', CH.HAIR_STYLES)}</div>
              <div class="field"><span>Màu tóc</span>${swatches('hairColor', CH.HAIR_COLORS)}</div>
              <div class="field"><span>Trang phục</span>${options('outfit', CH.OUTFITS)}</div>
              <div class="field"><span>Màu áo</span>${swatches('outfitColor', CH.OUTFIT_COLORS)}</div>
              ${c.outfit === 'dress' ? '' : `<div class="field"><span>Màu quần</span>${swatches('pantsColor', CH.PANTS_COLORS)}</div>`}
              <div class="field"><span>Phụ kiện</span>${options('accessory', CH.ACCESSORIES)}</div>
              <div class="form-actions">
                <button class="btn btn-ghost" id="rand">🎲 Ngẫu nhiên</button>
                ${isNew ? '' : '<button class="btn btn-danger" id="del">Xoá</button>'}
                <button class="btn btn-primary" id="save">${isNew ? 'Tạo nhân vật' : 'Lưu'}</button>
              </div>
            </div>
          </div>
        </section>`;
      bind();
    }
    function refreshPreview() {
      const holder = $('.preview-actor'); holder.innerHTML = actorHTML(c, previewMood);
      $('.preview-name').textContent = c.name || 'Chưa đặt tên';
    }
    function bind() {
      $('#cname').oninput = e => { c.name = e.target.value.replace(/[\[\]{}:<>]/g, ''); $('.preview-name').textContent = c.name || 'Chưa đặt tên'; };
      $$('[data-f]', app).forEach(b => b.onclick = () => {
        const f = b.dataset.f; c[f] = b.dataset.v;
        if (f === 'outfit') { render(); return; }
        $$(`[data-f="${f}"]`).forEach(x => x.classList.toggle('on', x === b));
        refreshPreview();
      });
      $$('[data-mood]', app).forEach(b => b.onclick = () => {
        previewMood = b.dataset.mood; $$('[data-mood]').forEach(x => x.classList.toggle('on', x === b)); refreshPreview();
      });
      $$('[data-act]', app).forEach(b => b.onclick = () => {
        const a = $('.preview-actor .actor');
        if (b.dataset.act === 'talk') {
          a.classList.add('talking'); speak(`Hi! My name is ${c.name || 'nobody yet'}.`, { pitch: c.pronoun === 'she' ? 1.25 : .9 });
          setTimeout(() => a.classList.remove('talking'), 1600);
        } else playAct(a, b.dataset.act);
      });
      $('#rand').onclick = () => { const r = CH.random(c.name); Object.assign(c, { ...r, id: c.id, name: c.name }); render(); };
      if ($('#del')) $('#del').onclick = () => {
        if (chars.length <= 3) { toast('Cần giữ ít nhất 3 nhân vật để diễn truyện'); return; }
        if (!confirm(`Xoá ${c.name}?`)) return;
        chars = chars.filter(x => x.id !== c.id); saveChars(); location.hash = '#/studio';
      };
      $('#save').onclick = () => {
        c.name = c.name.trim();
        if (!c.name) { toast('Đặt tên cho nhân vật nha'); $('#cname').focus(); return; }
        if (isNew) chars.push(c); else chars = chars.map(x => x.id === c.id ? c : x);
        saveChars(); toast(isNew ? `Đã tạo ${c.name}!` : 'Đã lưu');
        location.hash = '#/studio';
      };
    }
    render();
  }

  /* ---------- CASTING ---------- */
  function viewCast(id) {
    const s = STORIES.find(x => x.id === id); if (!s) { location.hash = '#/'; return; }
    const prev = castMemory[id] || {};
    const pick = {};
    const used = new Set();
    s.roles.forEach(r => {
      let cid = prev[r.key];
      if (!chars.find(c => c.id === cid) || used.has(cid)) cid = (chars.find(c => !used.has(c.id)) || chars[0]).id;
      pick[r.key] = cid; used.add(cid);
    });

    function render() {
      app.innerHTML = `
        <section class="page cast" style="--c:${s.color}">
          <a class="back" href="#/">← Thư viện truyện</a>
          <div class="cast-head">
            <span class="story-emoji big">${s.emoji}</span>
            <div><p class="eyebrow">${s.level} · ${esc(s.grammar)} · ${esc(s.grammarVi)}</p><h2>${esc(s.title)}</h2>
            <p class="sub">Chọn ai đóng vai nào. Muốn nhân vật mới? <a href="#/studio/new">Tạo ở đây</a>.</p></div>
          </div>
          ${s.roles.map(r => `
            <div class="role-row">
              <div class="role-label"><b>Vai ${r.key}</b><span>${esc(r.label)}</span></div>
              <div class="role-picks">${chars.map(c => `
                <button class="pick ${pick[r.key] === c.id ? 'on' : ''}" data-role="${r.key}" data-id="${esc(c.id)}">
                  <div class="pick-face">${CH.svg(c, pick[r.key] === c.id ? 'happy' : 'neutral')}</div><span>${esc(c.name)}</span></button>`).join('')}
              </div>
            </div>`).join('')}
          <div class="cast-go"><button class="btn btn-primary btn-lg" id="go">▶ Bắt đầu truyện</button></div>
        </section>`;
      $$('.pick', app).forEach(b => b.onclick = () => {
        const role = b.dataset.role, cid = b.dataset.id;
        const other = Object.keys(pick).find(k => k !== role && pick[k] === cid);
        if (other) pick[other] = pick[role]; // swap
        pick[role] = cid; render();
      });
      $('#go').onclick = () => { castMemory[id] = pick; store.set('gt_cast', castMemory); location.hash = '#/play/' + id; };
    }
    render();
  }

  /* ---------- PLAYER ---------- */
  function viewPlay(id) {
    const s = STORIES.find(x => x.id === id); if (!s) { location.hash = '#/'; return; }
    const pick = castMemory[id] || {};
    const cast = {};
    const used = new Set();
    s.roles.forEach(r => {
      let c = chars.find(x => x.id === pick[r.key] && !used.has(x.id)) || chars.find(x => !used.has(x.id)) || chars[0];
      cast[r.key] = c; used.add(c.id);
    });
    const positions = s.roles.length === 3 ? [16, 50, 84] : [24, 76];
    const moods = {}; s.roles.forEach(r => moods[r.key] = 'neutral');
    let idx = -1, timers = [], speakingToken = 0;
    const clearTimers = () => { timers.forEach(clearTimeout); timers = []; };
    const T = (fn, ms) => timers.push(setTimeout(fn, ms));

    app.innerHTML = `
      <section class="player" style="--c:${s.color}">
        <div class="player-top">
          <a class="back" href="#/cast/${s.id}">← Đổi vai</a>
          <div class="player-title"><span>${s.emoji}</span> ${esc(s.title)} <small>${esc(s.grammar)}</small></div>
          <div class="toggles">
            <button class="tg ${settings.voice ? 'on' : ''}" data-tg="voice" title="Giọng đọc">🔊</button>
            <button class="tg ${settings.notes ? 'on' : ''}" data-tg="notes" title="Giải thích ngữ pháp">💡</button>
            <button class="tg ${settings.auto ? 'on' : ''}" data-tg="auto" title="Tự chạy">⏩</button>
          </div>
        </div>
        <div class="stage" id="stage">
          <div class="scene">${SCENES.get(s.scene)}</div>
          <div class="actors">${s.roles.map((r, i) => `<div class="slot enter-${i < s.roles.length / 2 ? 'l' : 'r'}" data-role="${r.key}" style="left:${positions[i]}%">
            ${actorHTML(cast[r.key], 'neutral')}<div class="nametag" style="--nc:${cast[r.key].outfitColor}">${esc(cast[r.key].name)}</div></div>`).join('')}</div>
          <div class="title-card" id="titleCard"><div><span>${s.emoji}</span><h2>${esc(s.title)}</h2><p>${esc(s.grammar)} · ${esc(s.grammarVi)}</p><button class="btn btn-primary" id="start">Bắt đầu ▶</button></div></div>
        </div>
        <div class="dialogue" id="dialogue">
          <div class="speaker" id="speaker"></div>
          <div class="line" id="line"></div>
          <div class="notes" id="notes"></div>
          <div class="controls">
            <button class="ctl" id="prev" aria-label="Câu trước">◀</button>
            <div class="progress"><div class="bar" id="bar"></div></div>
            <button class="ctl" id="replay" aria-label="Đọc lại">↻</button>
            <button class="ctl primary" id="next" aria-label="Câu tiếp">▶</button>
          </div>
        </div>
        <div id="ending"></div>
      </section>`;

    const slots = {}; $$('.slot').forEach(el => slots[el.dataset.role] = el);
    const lineEl = $('#line'), notesEl = $('#notes'), speakerEl = $('#speaker');
    const actorOf = k => $('.actor', slots[k]);

    $$('.tg').forEach(b => b.onclick = () => {
      const k = b.dataset.tg; settings[k] = !settings[k]; saveSettings(); b.classList.toggle('on', settings[k]);
      if (k === 'notes') notesEl.classList.toggle('hidden', !settings.notes);
      if (k === 'voice' && !settings.voice) { stopSpeech(); $$('.actor').forEach(a => a.classList.remove('talking')); }
      if (k === 'auto' && settings.auto && idx >= 0 && !typingNow) scheduleAuto(1200);
      toast({ voice: settings.voice ? 'Bật giọng đọc' : 'Tắt giọng đọc', notes: settings.notes ? 'Hiện giải thích' : 'Ẩn giải thích', auto: settings.auto ? 'Tự chạy truyện' : 'Bấm ▶ để qua câu' }[k]);
    });
    notesEl.classList.toggle('hidden', !settings.notes);

    let typingNow = false;
    function scheduleAuto(ms) { if (settings.auto) T(() => next(), ms); }

    function show(i) {
      clearTimers(); stopSpeech(); speakingToken++;
      idx = i;
      const L = s.lines[i];
      $('#bar').style.width = ((i + 1) / s.lines.length * 100) + '%';
      $('#prev').disabled = i === 0;
      const r = rich(L.t, cast);
      const isNarr = L.who === 'N';
      // actors
      Object.keys(slots).forEach(k => {
        const el = slots[k];
        el.classList.toggle('speaking', k === L.who);
        el.classList.toggle('dim', !isNarr && k !== L.who);
        $('.actor', el).classList.remove('talking');
      });
      if (!isNarr) {
        const c = cast[L.who];
        if (L.mood && L.mood !== moods[L.who]) { moods[L.who] = L.mood; setMood(actorOf(L.who), c, L.mood); }
        playAct(actorOf(L.who), L.act);
        speakerEl.innerHTML = `<span class="tag" style="--nc:${c.outfitColor}">${esc(c.name)}</span>`;
      } else {
        speakerEl.innerHTML = `<span class="tag narr">Người kể chuyện</span>`;
      }
      $('#dialogue').classList.toggle('narr', isNarr);
      lineEl.innerHTML = r.html;
      lineEl.classList.remove('instant');
      notesEl.innerHTML = r.notes.map(n => `<div class="note"><b>${esc(n.w)}</b><span>${esc(n.n)}</span></div>`).join('');
      notesEl.classList.remove('show');
      typingNow = true;
      const typeMs = r.words * 70 + 200;
      T(() => { typingNow = false; notesEl.classList.add('show'); }, typeMs);

      const a = isNarr ? null : actorOf(L.who);
      if (a) a.classList.add('talking');
      const token = speakingToken;
      const done = () => {
        if (token !== speakingToken) return;
        if (a) a.classList.remove('talking');
        scheduleAuto(r.notes.length && settings.notes ? 2200 : 900);
      };
      if (settings.voice) {
        const c = isNarr ? null : cast[L.who];
        const ok = speak(r.plain, {
          rate: isNarr ? .9 : .95,
          pitch: isNarr ? 1 : (c.pronoun === 'she' ? 1.25 : .85),
          voiceIdx: isNarr ? 0 : (L.who.charCodeAt(0) - 64)
        }, done);
        if (!ok) T(done, typeMs + 400);
        else T(() => { if (a && !speechSynthesis.speaking) a.classList.remove('talking'); }, typeMs + 4000);
      } else {
        T(() => { if (a) a.classList.remove('talking'); }, typeMs);
        T(done, typeMs + 1200);
      }
    }
    function next() {
      if (typingNow) { // finish the line instantly
        lineEl.classList.add('instant'); notesEl.classList.add('show'); typingNow = false; return;
      }
      if (idx < s.lines.length - 1) show(idx + 1); else ending();
    }
    function prev() { if (idx > 0) show(idx - 1); }

    $('#next').onclick = next;
    $('#prev').onclick = prev;
    $('#replay').onclick = () => idx >= 0 && show(idx);
    $('#stage').onclick = e => { if (!e.target.closest('#titleCard')) idx >= 0 && next(); };
    lineEl.onclick = e => {
      const h = e.target.closest('.has-note'); if (!h) return;
      toast(h.dataset.note);
    };
    const key = e => {
      if (e.target.matches('input, textarea')) return;
      if (e.key === 'ArrowRight' || e.key === ' ') { e.preventDefault(); if (idx < 0) begin(); else next(); }
      if (e.key === 'ArrowLeft') prev();
    };
    document.addEventListener('keydown', key);
    cleanup = () => { clearTimers(); document.removeEventListener('keydown', key); };

    function begin() {
      $('#titleCard').classList.add('gone');
      $$('.slot').forEach((el, i) => T(() => el.classList.add('in'), 150 + i * 250));
      T(() => show(0), 400 + s.roles.length * 250);
    }
    $('#start').onclick = e => { e.stopPropagation(); begin(); };

    /* ---------- ending: rule + quiz ---------- */
    function ending() {
      clearTimers(); stopSpeech();
      Object.values(slots).forEach(el => { el.classList.remove('dim'); el.classList.add('speaking'); });
      Object.keys(slots).forEach((k, i) => T(() => { setMood(actorOf(k), cast[k], 'excited'); playAct(actorOf(k), i % 2 ? 'wave' : 'jump'); }, i * 200));
      $('#dialogue').style.display = 'none';
      const host = cast.A;
      let qi = 0, score = 0;
      const R = s.rule;
      const end = $('#ending');
      end.innerHTML = `
        <div class="rule-card">
          <p class="eyebrow">Tổng kết ngữ pháp</p>
          <h2>${esc(s.grammar)} <span>· ${esc(s.grammarVi)}</span></h2>
          <div class="forms">${R.forms.map(f => `<div class="form-row"><span class="fk">${f[0]}</span><code>${esc(f[1])}</code><em>${f[2]}</em></div>`).join('')}</div>
          <div class="rule-cols">
            <div><h4>Dùng khi</h4><ul>${R.use.map(u => `<li>${esc(u)}</li>`).join('')}</ul></div>
            <div class="tip"><h4>Mẹo nhớ</h4><p>${R.tip}</p></div>
          </div>
          <button class="btn btn-primary btn-lg" id="toQuiz">Làm quiz ${s.quiz.length} câu →</button>
        </div>
        <div class="quiz" id="quiz" hidden></div>`;
      end.scrollIntoView({ behavior: 'smooth', block: 'start' });
      $('#toQuiz').onclick = () => { $('#quiz').hidden = false; renderQ(); $('#quiz').scrollIntoView({ behavior: 'smooth', block: 'start' }); };

      function renderQ() {
        const q = s.quiz[qi]; const qz = $('#quiz');
        qz.innerHTML = `
          <div class="quiz-head"><span>Câu ${qi + 1}/${s.quiz.length}</span><span>Điểm: ${score}</span></div>
          <div class="quiz-body">
            <div class="quiz-host">${actorHTML(host, 'thinking')}</div>
            <div class="quiz-main">
              <p class="q">${esc(fill(q.q, cast)).replace('___', '<span class="blank">_____</span>')}</p>
              <div class="answers">${q.o.map((o, i) => `<button class="ans" data-i="${i}">${String.fromCharCode(65 + i)}. ${esc(o)}</button>`).join('')}</div>
              <div class="explain" id="explain"></div>
            </div>
          </div>`;
        $$('.ans', qz).forEach(b => b.onclick = () => {
          const i = +b.dataset.i, ok = i === q.a;
          $$('.ans', qz).forEach((x, j) => { x.disabled = true; if (j === q.a) x.classList.add('right'); else if (j === i) x.classList.add('wrong'); });
          const ha = $('.quiz-host .actor');
          setMood(ha, host, ok ? 'excited' : 'sad'); playAct(ha, ok ? 'jump' : 'shake');
          if (ok) score++;
          $('#explain').innerHTML = `<p class="${ok ? 'ok' : 'no'}">${ok ? ['Chuẩn luôn!', 'Giỏi quá!', 'Đúng rồi!'][qi % 3] : 'Chưa đúng nè.'}</p><p>${esc(fill(q.e, cast))}</p>
            <button class="btn btn-primary" id="nq">${qi < s.quiz.length - 1 ? 'Câu tiếp →' : 'Xem kết quả'}</button>`;
          if (settings.voice) speak(fill(q.q, cast).replace('___', q.o[q.a]), { pitch: host.pronoun === 'she' ? 1.25 : .85 });
          $('#nq').onclick = () => { qi++; if (qi < s.quiz.length) renderQ(); else result(); };
        });
      }
      function result() {
        const prevBest = (progress[s.id] && progress[s.id].best) || 0;
        progress[s.id] = { best: Math.max(prevBest, score), last: score };
        store.set('gt_progress', progress);
        const perfect = score === s.quiz.length;
        const qz = $('#quiz');
        qz.innerHTML = `
          <div class="result">
            <div class="quiz-host big">${actorHTML(host, perfect ? 'excited' : 'happy')}</div>
            <h3>${score}/${s.quiz.length} ${perfect ? '🎉' : ''}</h3>
            <p>${perfect ? `${esc(host.name)} tự hào về bạn lắm!` : score >= s.quiz.length / 2 ? 'Gần hoàn hảo rồi, xem lại truyện một lần nữa nha.' : 'Xem lại truyện và phần giải thích 💡 rồi thử lại nhé.'}</p>
            <div class="form-actions center">
              <button class="btn btn-ghost" id="again">↻ Xem lại truyện</button>
              <a class="btn btn-ghost" href="#/cast/${s.id}">Đổi vai</a>
              <a class="btn btn-primary" href="#/">Truyện khác →</a>
            </div>
          </div>`;
        if (perfect) confetti();
        const ha = $('.result .actor');
        const iv = setInterval(() => ha && playAct(ha, 'jump'), 1500);
        const oc = cleanup; cleanup = () => { clearInterval(iv); oc && oc(); };
        $('#again').onclick = () => route();
      }
    }
  }

  function confetti() {
    const box = document.createElement('div'); box.className = 'confetti';
    const cols = ['#FF7A59', '#FFC94A', '#2EC4B6', '#7B5CF0', '#E0628F', '#4C8DF6'];
    box.innerHTML = Array.from({ length: 70 }, (_, i) =>
      `<i style="left:${Math.random() * 100}%;background:${cols[i % cols.length]};--d:${(Math.random() * 1.5 + 1.8).toFixed(2)}s;--x:${(Math.random() * 200 - 100).toFixed(0)}px;animation-delay:${(Math.random() * .6).toFixed(2)}s"></i>`).join('');
    document.body.appendChild(box); setTimeout(() => box.remove(), 4200);
  }

  route();
})();
