/* Grammar Tales — speaking practice (role-play + recording + scoring) */
const SPEAK = (() => {
  const G = () => window.GT;
  const SR = window.SpeechRecognition || window.webkitSpeechRecognition;
  const CAN_RECORD = !!(navigator.mediaDevices && navigator.mediaDevices.getUserMedia && window.MediaRecorder);

  /* ---------- data layer (local now; Supabase later) ---------- */
  const DB = {
    student: () => G().store.get('gt_student', null),
    setStudent: s => G().store.set('gt_student', s),
    attempts: () => G().store.get('gt_speak', []),
    save(a) { const l = DB.attempts(); l.push(a); G().store.set('gt_speak', l.slice(-500)); },
    best(lid, sid, mode) {
      const l = DB.attempts().filter(a => a.lessonId === lid && a.sitId === sid && (!mode || a.mode === mode));
      return l.length ? Math.max(...l.map(a => a.total)) : null;
    }
  };
  const prefs = () => Object.assign({ role: 'A', me: null, partner: null, mode: 'model', voice: true, slow: false, hideText: false }, G().store.get('gt_talk_prefs', {}));
  const savePrefs = p => G().store.set('gt_talk_prefs', p);

  const fillNames = (t, names) => t.replace(/\{([ABC])\}/g, (m, k) => names[k] || m);
  const starStr = n => '★'.repeat(n) + '☆'.repeat(3 - n);
  const findLesson = id => LESSONS.find(l => l.id === id);

  function studentForm(st) {
    const { esc } = G();
    return `<form class="student-card" id="studentForm">
      <div class="sc-icon">🎓</div>
      <div class="sc-fields">
        <p class="sc-title">${st ? 'Thông tin học viên' : 'Nhập tên để lưu kết quả luyện nói'}</p>
        <div class="sc-row">
          <input name="name" maxlength="40" required placeholder="Họ tên" value="${st ? esc(st.name) : ''}" autocomplete="name">
          <input name="code" maxlength="20" placeholder="Mã lớp (VD: BLOOM-01)" value="${st ? esc(st.code || '') : ''}">
          <button class="btn btn-primary" type="submit">Lưu</button>
        </div>
      </div>
    </form>`;
  }
  function bindStudentForm(after) {
    const f = G().$('#studentForm'); if (!f) return;
    f.onsubmit = e => {
      e.preventDefault();
      const name = f.name.value.trim(), code = f.code.value.trim().toUpperCase();
      if (!name) return;
      DB.setStudent({ name, code }); G().toast(`Chào ${name}!`); after && after();
    };
  }
  function studentBadge(st) {
    const { esc } = G();
    return `<div class="student-card compact"><div class="sc-icon">🎓</div>
      <div><b>${esc(st.name)}</b>${st.code ? ` · Lớp <b>${esc(st.code)}</b>` : ''}</div>
      <button class="link-btn sm" id="editStudent">Đổi</button></div>`;
  }
  const browserNote = () => SR ? '' : `<div class="notice">⚠️ Trình duyệt này chưa hỗ trợ nhận giọng nói, nên bạn vẫn ghi âm được nhưng sẽ tự chấm. Dùng <b>Chrome</b> (Android, máy tính) hoặc <b>Safari</b> (iPhone) để được chấm tự động.</div>`;

  /* ---------- HOME ---------- */
  function home() {
    const { app, esc } = G();
    const st = DB.student();
    app.innerHTML = `
      <section class="page speak-home">
        <div class="section-head">
          <div><p class="eyebrow">Giao tiếp · Bloom</p><h2>Luyện nói theo tình huống</h2>
          <p class="sub">Đóng vai trong tình huống của sách, ghi âm câu nói và nhận điểm ngay. Bí thì bấm 💡 để xem cách nói.</p></div>
          <a class="btn btn-ghost" href="#/results">📊 Kết quả của tôi</a>
        </div>
        <div id="studentBox">${st ? studentBadge(st) : studentForm(null)}</div>
        ${browserNote()}
        <div class="unit-grid">
          ${LESSONS.map(l => {
            const done = l.situations.filter(s => DB.best(l.id, s.id) !== null).length;
            return `<a class="unit-card" href="#/unit/${l.id}" style="--c:${l.color}">
              <div class="unit-top"><span class="unit-num">${esc(l.book)} · Unit ${l.unit}</span><span class="unit-emoji">${l.emoji}</span></div>
              <h3>${esc(l.title)}</h3><p class="g"><span>${esc(l.titleVi)}</span></p>
              <div class="unit-prog"><div class="progress"><div class="bar" style="width:${done / l.situations.length * 100}%"></div></div><small>${done}/${l.situations.length} tình huống</small></div>
            </a>`;
          }).join('')}
        </div>
      </section>`;
    const bindBox = () => {
      bindStudentForm(home);
      const e = G().$('#editStudent'); if (e) e.onclick = () => { G().$('#studentBox').innerHTML = studentForm(DB.student()); bindStudentForm(home); };
    };
    bindBox();
  }

  /* ---------- UNIT ---------- */
  function unit(id) {
    const { app, esc } = G();
    const l = findLesson(id); if (!l) { location.hash = '#/speak'; return; }
    app.innerHTML = `
      <section class="page unit-page" style="--c:${l.color}">
        <a class="back" href="#/speak">← Tất cả unit</a>
        <div class="cast-head"><span class="story-emoji big">${l.emoji}</span>
          <div><p class="eyebrow">${esc(l.book)} · Unit ${l.unit}</p><h2>${esc(l.title)}</h2><p class="sub">${esc(l.titleVi)}</p></div></div>
        <div class="unit-cols">
          <div>
            <div class="goals"><h4>Mục tiêu</h4><ul>${l.goals.map(g => `<li>${esc(g)}</li>`).join('')}</ul></div>
            <h3 class="col-title">Tình huống</h3>
            ${l.situations.map((s, i) => {
              const b1 = DB.best(l.id, s.id, 'model'), b2 = DB.best(l.id, s.id, 'free');
              return `<a class="sit-card" href="#/talk/${l.id}/${s.id}">
                <span class="sit-num">${i + 1}</span>
                <div class="sit-body"><h4>${esc(s.title)}</h4><p>${esc(s.titleVi)} · ${s.turns.length} lượt thoại</p>
                  <div class="sit-scores"><span class="${b1 !== null ? 'on' : ''}">Mức 1: ${b1 !== null ? b1 + ' điểm' : 'chưa luyện'}</span><span class="${b2 !== null ? 'on' : ''}">Mức 2: ${b2 !== null ? b2 + ' điểm' : 'chưa luyện'}</span></div></div>
                <span class="sit-go">Luyện →</span></a>`;
            }).join('')}
          </div>
          <aside class="lang-box">
            <h3>Language of the day</h3>
            ${l.language.map(g => `<div class="lang-group"><h4>${esc(g.title)}</h4>${g.items.map(t => `<button class="phrase" data-say="${esc(t.replace(/_+/g, '...'))}">🔊 ${esc(t)}</button>`).join('')}</div>`).join('')}
          </aside>
        </div>
      </section>`;
    G().$$('.phrase').forEach(b => b.onclick = () => G().speak(b.dataset.say.replace(/\.\.\./g, ''), { rate: .85 }));
  }

  /* ---------- TALK: setup ---------- */
  function talk(lid, sid) {
    const { app, esc, chars } = G();
    const l = findLesson(lid); const s = l && l.situations.find(x => x.id === sid);
    if (!s) { location.hash = '#/speak'; return; }
    const p = prefs();
    const list = chars();
    if (!list.find(c => c.id === p.me)) p.me = list[0].id;
    if (!list.find(c => c.id === p.partner) || p.partner === p.me) p.partner = (list.find(c => c.id !== p.me) || list[0]).id;
    if (!s.roles.find(r => r.key === p.role)) p.role = s.roles[0].key;

    function namesFor() {
      const me = list.find(c => c.id === p.me), pa = list.find(c => c.id === p.partner);
      const other = s.roles.find(r => r.key !== p.role).key;
      return { [p.role]: me.name, [other]: pa.name };
    }
    function render() {
      const names = namesFor();
      const st = DB.student();
      const picks = (field, other) => list.map(c => `<button class="pick ${p[field] === c.id ? 'on' : ''}" data-f="${field}" data-id="${esc(c.id)}" ${p[other] === c.id ? 'data-taken="1"' : ''}>
        <div class="pick-face">${CH.svg(c, p[field] === c.id ? 'happy' : 'neutral')}</div><span>${esc(c.name)}</span></button>`).join('');
      app.innerHTML = `
        <section class="page talk-setup" style="--c:${l.color}">
          <a class="back" href="#/unit/${l.id}">← Unit ${l.unit}: ${esc(l.title)}</a>
          <div class="cast-head"><span class="story-emoji big">${l.emoji}</span>
            <div><p class="eyebrow">Tình huống · ${s.turns.length} lượt thoại</p><h2>${esc(s.title)}</h2><p class="sub">${esc(s.titleVi)}</p></div></div>
          <div class="context-card"><b>Bối cảnh:</b> ${esc(fillNames(s.context, names))}</div>
          ${s.map ? `<div class="map-box">${NEIGHBORHOOD_MAP}</div>` : ''}
          ${st ? '' : `<div id="studentBox">${studentForm(null)}</div>`}
          ${browserNote()}
          <div class="role-row"><div class="role-label"><b>1</b><span>Bạn đóng vai</span></div>
            <div class="opts big">${s.roles.map(r => `<button class="opt ${p.role === r.key ? 'on' : ''}" data-role="${r.key}">${esc(r.label)}</button>`).join('')}</div></div>
          <div class="role-row"><div class="role-label"><b>2</b><span>Nhân vật của bạn</span><a href="#/studio/new" class="mini-link">+ Tạo nhân vật</a></div>
            <div class="role-picks">${picks('me', 'partner')}</div></div>
          <div class="role-row"><div class="role-label"><b>3</b><span>Bạn diễn (máy nói)</span></div>
            <div class="role-picks">${picks('partner', 'me')}</div></div>
          <div class="role-row"><div class="role-label"><b>4</b><span>Mức độ</span></div>
            <div class="mode-cards">
              <button class="mode-card ${p.mode === 'model' ? 'on' : ''}" data-mode="model"><b>Mức 1 · Bám câu mẫu</b><span>Thấy câu mẫu trong sách, đọc lại cho đúng và rõ.</span></button>
              <button class="mode-card ${p.mode === 'free' ? 'on' : ''}" data-mode="free"><b>Mức 2 · Nói tự do</b><span>Chỉ thấy ý cần nói. Tự nói theo cách của bạn, bí thì xem gợi ý (bị trừ điểm nhẹ).</span></button>
            </div></div>
          <div class="cast-go"><button class="btn btn-primary btn-lg" id="go">🎙️ Bắt đầu luyện nói</button></div>
        </section>`;
      G().$$('[data-role]').forEach(b => b.onclick = () => { p.role = b.dataset.role; render(); });
      G().$$('[data-mode]').forEach(b => b.onclick = () => { p.mode = b.dataset.mode; render(); });
      G().$$('.pick').forEach(b => b.onclick = () => {
        const f = b.dataset.f, other = f === 'me' ? 'partner' : 'me';
        if (p[other] === b.dataset.id) p[other] = p[f];
        p[f] = b.dataset.id; render();
      });
      bindStudentForm(render);
      G().$('#go').onclick = () => {
        if (!DB.student()) { G().toast('Nhập tên trước để lưu kết quả nha'); G().$('#studentForm input').focus(); return; }
        savePrefs(p); play(l, s, p);
      };
    }
    render();
  }

  /* ---------- recorder (MediaRecorder + SpeechRecognition) ---------- */
  let stream = null;
  let srOnly = false; // set when mic sharing between recorder & recognizer fails (some iPhones)
  async function getStream() {
    if (stream && stream.active) return stream;
    stream = await navigator.mediaDevices.getUserMedia({ audio: { echoCancellation: true, noiseSuppression: true } });
    return stream;
  }
  function startCapture({ onInterim, onEnd }) {
    let recorder = null, chunks = [], recog = null, ended = false;
    let recDone = true, srDone = true, text = '', alts = [], conf = null, srError = null;
    const finish = () => {
      if (ended || !recDone || !srDone) return;
      ended = true; clearTimeout(timer);
      onEnd({ text, alts, conf, srError, blob: chunks.length ? new Blob(chunks, { type: (recorder && recorder.mimeType) || 'audio/webm' }) : null });
    };
    const ctl = {
      stop() {
        try { recog && recog.stop(); } catch { }
        try { if (recorder && recorder.state !== 'inactive') recorder.stop(); } catch { recDone = true; finish(); }
        if (!recog) srDone = true;
        if (!recorder) recDone = true;
        finish();
      }
    };
    const timer = setTimeout(() => ctl.stop(), 25000);

    const startSR = () => {
      if (!SR) return;
      srDone = false;
      recog = new SR();
      recog.lang = 'en-US'; recog.interimResults = true; recog.maxAlternatives = 3; recog.continuous = false;
      recog.onresult = e => {
        let interim = '', fin = '';
        for (let i = 0; i < e.results.length; i++) {
          const r = e.results[i];
          if (r.isFinal) {
            fin += (fin ? ' ' : '') + r[0].transcript;
            if (i === e.results.length - 1) {
              alts = [...r].map(a => a.transcript);
              if (typeof r[0].confidence === 'number') conf = r[0].confidence;
            }
          } else interim += r[0].transcript;
        }
        if (fin) text = fin;
        onInterim && onInterim((fin + ' ' + interim).trim());
      };
      recog.onerror = e => { srError = e.error; };
      recog.onend = () => {
        srDone = true;
        try { if (recorder && recorder.state !== 'inactive') recorder.stop(); } catch { recDone = true; }
        finish();
      };
      try { recog.start(); } catch (err) { srError = 'start-failed'; srDone = true; }
    };

    (async () => {
      if (CAN_RECORD && !(srOnly && SR)) {
        try {
          const s = await getStream();
          recDone = false;
          recorder = new MediaRecorder(s);
          recorder.ondataavailable = e => e.data && e.data.size && chunks.push(e.data);
          recorder.onstop = () => { recDone = true; finish(); };
          recorder.start();
        } catch (err) { recorder = null; recDone = true; if (!SR) { G().toast('Không mở được micro. Kiểm tra quyền micro của trình duyệt nhé.'); } }
      }
      startSR();
      if (!SR && !recorder) finish();
    })();
    return ctl;
  }

  /* ---------- TALK: play ---------- */
  function play(l, s, p) {
    const { app, esc, chars, actorHTML, setMood, playAct, speak, stopSpeech, store } = G();
    const list = chars();
    const me = list.find(c => c.id === p.me), partner = list.find(c => c.id === p.partner);
    const myRole = p.role, otherRole = s.roles.find(r => r.key !== myRole).key;
    const castBy = { [myRole]: me, [otherRole]: partner };
    const names = { [myRole]: me.name, [otherRole]: partner.name };
    const allNames = [me.name, partner.name];
    const T = s.turns;
    const best = {}; // turn index → best result
    let idx = 0, timers = [], capture = null, token = 0;
    const later = (fn, ms) => timers.push(setTimeout(fn, ms));
    const clear = () => { timers.forEach(clearTimeout); timers = []; };

    app.innerHTML = `
      <section class="player talk" style="--c:${l.color}">
        <div class="player-top">
          <a class="back" href="#/talk/${l.id}/${s.id}">← Đổi vai</a>
          <div class="player-title"><span>${l.emoji}</span> ${esc(s.title)} <small>${p.mode === 'model' ? 'Mức 1 · Bám câu mẫu' : 'Mức 2 · Nói tự do'}</small></div>
          <div class="toggles">
            <button class="tg ${p.voice ? 'on' : ''}" data-tg="voice" title="Bạn diễn đọc to">🔊</button>
            <button class="tg ${p.slow ? 'on' : ''}" data-tg="slow" title="Đọc chậm">🐢</button>
            <button class="tg ${p.hideText ? 'on' : ''}" data-tg="hideText" title="Ẩn chữ của bạn diễn (luyện nghe)">🙈</button>
          </div>
        </div>
        <div class="stage talk-stage">
          <div class="scene">${SCENES.get(l.scene)}</div>
          <div class="actors">
            <div class="slot in" data-who="me" style="left:28%">${actorHTML(me, 'neutral')}<div class="nametag" style="--nc:${me.outfitColor}">${esc(me.name)} (bạn)</div></div>
            <div class="slot in" data-who="partner" style="left:72%">${actorHTML(partner, 'neutral')}<div class="nametag" style="--nc:${partner.outfitColor}">${esc(partner.name)}</div></div>
          </div>
        </div>
        <div class="talk-panel">
          <details class="ctx-mini"><summary>Bối cảnh${s.map ? ' & bản đồ' : ''}</summary><p>${esc(fillNames(s.context, names))}</p>${s.map ? `<div class="map-box">${NEIGHBORHOOD_MAP}</div>` : ''}</details>
          <div class="log" id="log"></div>
          <div class="turn" id="turn"></div>
          <div class="progress"><div class="bar" id="bar"></div></div>
        </div>
        <div id="summary"></div>
      </section>`;

    const slotMe = G().$('[data-who="me"]'), slotPa = G().$('[data-who="partner"]');
    const actMe = () => G().$('.actor', slotMe), actPa = () => G().$('.actor', slotPa);
    const turnEl = G().$('#turn'), logEl = G().$('#log');

    G().$$('.tg').forEach(b => b.onclick = () => {
      const k = b.dataset.tg; p[k] = !p[k]; savePrefs(p); b.classList.toggle('on', p[k]);
      if (k === 'hideText') G().$$('.bubble.partner .btext').forEach(x => x.classList.toggle('blur', p.hideText));
      if (k === 'voice' && !p.voice) stopSpeech();
    });
    G().setCleanup(() => { clear(); token++; try { capture && capture.stop(); } catch { } stopSpeech(); });

    const sayOpts = c => ({ rate: p.slow ? .72 : .92, pitch: c.pronoun === 'she' ? 1.2 : .88, voiceIdx: c === partner ? 1 : 0 });

    function addLog(who, text, scoreRes) {
      const c = who === 'me' ? me : partner;
      const div = document.createElement('div');
      div.className = 'bubble ' + who;
      div.innerHTML = `<span class="bname" style="--nc:${c.outfitColor}">${esc(c.name)}</span>
        <span class="btext ${who === 'partner' && p.hideText ? 'blur' : ''}">${esc(text)}</span>
        ${scoreRes ? `<span class="bscore s${scoreRes.stars}">${scoreRes.self ? 'tự chấm ' : ''}${scoreRes.total}</span>` : ''}`;
      if (who === 'partner') div.querySelector('.btext').onclick = e => e.target.classList.remove('blur');
      logEl.appendChild(div);
      logEl.scrollTop = logEl.scrollHeight;
    }

    function next() {
      clear(); token++;
      G().$('#bar').style.width = (idx / T.length * 100) + '%';
      if (idx >= T.length) return finish();
      slotMe.classList.toggle('speaking', T[idx].who === myRole); slotMe.classList.toggle('dim', T[idx].who !== myRole);
      slotPa.classList.toggle('speaking', T[idx].who !== myRole); slotPa.classList.toggle('dim', T[idx].who === myRole);
      if (T[idx].who === myRole) learnerTurn(); else partnerTurn();
    }

    function partnerTurn() {
      const turn = T[idx], text = fillNames(turn.t, names), my = token;
      turnEl.innerHTML = `<div class="pturn">
        <span class="tag" style="--nc:${partner.outfitColor}">${esc(partner.name)}</span>
        <p class="ptext ${p.hideText ? 'blur' : ''}">${esc(text)}</p>
        <div class="row"><button class="btn btn-ghost sm" id="replayP">🔊 Nghe lại</button><button class="btn btn-primary sm" id="contP">Tiếp →</button></div></div>`;
      G().$('.ptext').onclick = e => e.target.classList.remove('blur');
      const a = actPa();
      playAct(a, idx === 0 ? 'wave' : (Math.random() < .3 ? 'nod' : null));
      const done = () => {
        if (my !== token) return;
        a.classList.remove('talking');
        later(() => { if (my !== token) return; addLog('partner', text); idx++; next(); }, 700);
      };
      const talk = () => {
        a.classList.add('talking');
        if (p.voice) { if (!speak(text, sayOpts(partner), done)) later(done, 1200 + text.split(' ').length * 260); }
        else later(() => a.classList.remove('talking'), 1200);
      };
      talk();
      G().$('#replayP').onclick = () => { token++; const t2 = token; a.classList.add('talking'); speak(text, sayOpts(partner), () => { if (t2 === token) a.classList.remove('talking'); }); };
      G().$('#contP').onclick = () => { stopSpeech(); token++; a.classList.remove('talking'); addLog('partner', text); idx++; next(); };
    }

    function learnerTurn() {
      const turn = T[idx];
      const model = fillNames(turn.t, names);
      const variants = [model, ...(turn.alt || []).map(a => fillNames(a, names))];
      let hints = 0, result = null, blobUrl = null;

      function render(state, extra = {}) {
        const hintList = p.mode === 'model' ? variants.slice(1, 1 + hints) : variants.slice(0, hints);
        const canHint = p.mode === 'model' ? hints < variants.length - 1 : hints < Math.min(3, variants.length);
        turnEl.innerHTML = `<div class="lturn">
          <div class="lhead"><span class="tag" style="--nc:${me.outfitColor}">Lượt của bạn</span><span class="intent">🎯 ${esc(turn.vi)}</span></div>
          ${p.mode === 'model' ? `<p class="model">${esc(model)} <button class="icon-btn" data-say="${esc(model)}" title="Nghe câu mẫu">🔊</button></p>` : ''}
          ${hintList.length ? `<div class="hints">${hintList.map((h, i) => `<div class="hint"><span>${p.mode === 'model' ? 'Cách khác' : 'Gợi ý ' + (i + 1)}:</span> ${esc(h)} <button class="icon-btn" data-say="${esc(h)}">🔊</button></div>`).join('')}</div>` : ''}
          ${state === 'result' ? resultHTML(extra.res) : ''}
          ${state === 'self' ? selfHTML() : ''}
          <div class="mic-row">
            ${canHint && state !== 'recording' ? `<button class="btn btn-ghost sm" id="hintBtn">💡 ${p.mode === 'model' ? 'Cách nói khác' : 'Gợi ý'}${p.mode === 'free' ? ` (${Math.min(3, variants.length) - hints})` : ''}</button>` : '<span></span>'}
            <button class="mic ${state === 'recording' ? 'rec' : ''}" id="mic" aria-label="${state === 'recording' ? 'Dừng' : 'Ghi âm'}">${state === 'recording' ? '■' : '🎙️'}</button>
            <span class="mic-label">${state === 'recording' ? 'Đang nghe... nói xong bấm ■' : state === 'result' || state === 'self' ? 'Nói lại' : 'Bấm để nói'}</span>
          </div>
          ${state === 'recording' ? `<p class="interim" id="interim">…</p>` : ''}
          ${state === 'result' || state === 'self' ? `<div class="row end"><button class="link-btn" id="skip">Bỏ qua</button><button class="btn btn-primary" id="contL">Tiếp →</button></div>`
            : `<div class="row end"><button class="link-btn" id="skip">Bỏ qua lượt này</button></div>`}
        </div>`;
        G().$$('[data-say]', turnEl).forEach(b => b.onclick = () => speak(b.dataset.say, { rate: p.slow ? .7 : .85 }));
        const hb = G().$('#hintBtn'); if (hb) hb.onclick = () => { hints++; render(state, extra); };
        G().$('#mic').onclick = () => state === 'recording' ? capture && capture.stop() : record();
        G().$('#skip').onclick = () => { if (!best[idx]) best[idx] = { total: 0, clarity: 0, pron: 0, use: 0, stars: 0, said: '', skipped: true }; advance(); };
        const cb = G().$('#contL'); if (cb) cb.onclick = advance;
        const pb = G().$('#playMe'); if (pb && blobUrl) pb.onclick = () => { const au = new Audio(blobUrl); au.play().catch(() => G().toast('Không phát được bản ghi')); };
        G().$$('[data-self]', turnEl).forEach(b => b.onclick = () => {
          const v = +b.dataset.self;
          const r = { total: v, clarity: v, pron: v, use: v, stars: v >= 85 ? 3 : v >= 60 ? 2 : 1, said: '', self: true, tips: [] };
          keep(r); react(r); G().toast('Đã ghi nhận'); advance();
        });
      }
      function resultHTML(r) {
        const bar = (label, v) => `<div class="sbar"><span>${label}</span><div class="track"><i style="width:${v}%"></i></div><b>${v}</b></div>`;
        return `<div class="result-card s${r.stars}">
          <div class="rc-top"><div class="rc-total"><b>${r.total}</b><span>${starStr(r.stars)}</span></div>
            <div class="rc-bars">${bar('Dễ hiểu', r.clarity)}${bar('Phát âm*', r.pron)}${bar('Dùng từ', r.use)}</div></div>
          <p class="said"><span>Máy nghe được:</span> “${esc(r.said || '…')}”</p>
          <p class="target"><span>So với câu:</span> ${r.best.words.map(x => `<i class="${x.s}">${esc(x.w)}</i>`).join(' ')}</p>
          ${r.tips.map(t => `<p class="tip-line">${esc(t)}</p>`).join('')}
          <div class="row">${blobUrl ? '<button class="btn btn-ghost sm" id="playMe">▶ Giọng của bạn</button>' : ''}<button class="btn btn-ghost sm" data-say="${esc(r.best.text)}">🔊 Câu mẫu</button></div>
          <small class="fine">*Phát âm là điểm ước lượng dựa trên những từ máy nghe ra.</small>
        </div>`;
      }
      function selfHTML() {
        return `<div class="result-card self">
          <p><b>Trình duyệt chưa chấm tự động được.</b> Nghe lại giọng bạn, so với câu mẫu rồi tự chấm:</p>
          <div class="row">${blobUrl ? '<button class="btn btn-ghost sm" id="playMe">▶ Giọng của bạn</button>' : ''}<button class="btn btn-ghost sm" data-say="${esc(model)}">🔊 Câu mẫu</button></div>
          <div class="row"><button class="btn sm" data-self="90">😀 Tốt</button><button class="btn sm" data-self="65">🙂 Tạm được</button><button class="btn sm" data-self="35">😕 Chưa ổn</button></div>
        </div>`;
      }
      function keep(r) { if (!best[idx] || r.total >= best[idx].total) best[idx] = r; }
      function react(r) {
        const mood = r.stars === 3 ? 'excited' : r.stars === 2 ? 'happy' : r.stars === 1 ? 'thinking' : 'sad';
        setMood(actMe(), me, mood); playAct(actMe(), r.stars >= 2 ? 'jump' : 'shake');
        if (r.stars >= 2) playAct(actPa(), 'nod');
      }
      function record() {
        stopSpeech();
        render('recording');
        actMe().classList.add('talking');
        capture = startCapture({
          onInterim: t => { const el = G().$('#interim'); if (el) el.textContent = t || '…'; },
          onEnd: out => {
            capture = null;
            actMe().classList.remove('talking');
            if (blobUrl) URL.revokeObjectURL(blobUrl);
            blobUrl = out.blob ? URL.createObjectURL(out.blob) : null;
            if (out.srError && ['audio-capture', 'not-allowed', 'service-not-allowed', 'start-failed'].includes(out.srError) && !out.text) {
              if (!srOnly && out.srError === 'audio-capture') { srOnly = true; G().toast('Máy bạn không ghi âm và nhận giọng cùng lúc được. Thử lại lần nữa nhé (sẽ không có bản ghi để nghe lại).'); render('idle'); return; }
              if (out.srError === 'not-allowed') { G().toast('Bạn cần cho phép dùng micro để luyện nói.'); render('idle'); return; }
              render('self'); return;
            }
            if (!SR) { render('self'); return; }
            const opts = { mode: p.mode, confidence: out.conf, hints: p.mode === 'free' ? hints : 0, names: allNames };
            const cands = out.alts.length ? out.alts : [out.text];
            let r = cands.map(t => SCORE.score(variants, t, opts)).reduce((a, b) => b.total > a.total ? b : a);
            result = r; keep(r); react(r);
            render('result', { res: r });
          }
        });
      }
      function advance() {
        try { capture && capture.stop(); } catch { }
        const b = best[idx];
        const shown = b && !b.skipped && !b.self && b.said && b.total >= 60 ? b.said : model;
        addLog('me', shown, b);
        setMood(actMe(), me, 'neutral');
        idx++; next();
      }
      render('idle');
      if (p.mode === 'model' && p.voice && idx === 0) { /* no auto play; let learner read first */ }
    }

    function finish() {
      clear();
      turnEl.innerHTML = '';
      G().$('#bar').style.width = '100%';
      slotMe.classList.remove('dim'); slotPa.classList.remove('dim');
      const mine = T.map((t, i) => ({ t, i })).filter(x => x.t.who === myRole);
      const res = mine.map(x => best[x.i] || { total: 0, clarity: 0, pron: 0, use: 0, stars: 0, said: '', skipped: true });
      const avg = k => Math.round(res.reduce((a, r) => a + (r[k] || 0), 0) / Math.max(1, res.length));
      const total = avg('total'), stars = total >= 85 ? 3 : total >= 65 ? 2 : total >= 40 ? 1 : 0;
      const st = DB.student() || {};
      DB.save({
        id: Date.now().toString(36), student: st.name || '', code: st.code || '', lessonId: l.id, unit: l.unit, sitId: s.id,
        sitTitle: s.title, role: myRole, mode: p.mode, total, clarity: avg('clarity'), pron: avg('pron'), use: avg('use'),
        turns: mine.map((x, k) => ({ i: x.i, said: res[k].said || '', total: res[k].total, self: !!res[k].self, skipped: !!res[k].skipped })),
        at: Date.now()
      });
      setMood(actMe(), me, stars >= 2 ? 'excited' : 'happy'); playAct(actMe(), 'jump');
      setMood(actPa(), partner, 'happy'); playAct(actPa(), 'wave');
      if (stars === 3) G().confetti();
      const bar = (label, v) => `<div class="sbar"><span>${label}</span><div class="track"><i style="width:${v}%"></i></div><b>${v}</b></div>`;
      G().$('#summary').innerHTML = `
        <div class="rule-card summary-card">
          <p class="eyebrow">Hoàn thành tình huống</p>
          <div class="rc-top"><div class="rc-total big"><b>${total}</b><span>${starStr(stars)}</span></div>
            <div class="rc-bars">${bar('Dễ hiểu', avg('clarity'))}${bar('Phát âm*', avg('pron'))}${bar('Dùng từ', avg('use'))}</div></div>
          <h4>Các lượt của bạn</h4>
          <ol class="turn-list">${mine.map((x, k) => `<li><div><b>${esc(fillNames(x.t.t, names))}</b>
            <span>${res[k].skipped ? 'Bỏ qua' : res[k].self ? 'Tự chấm' : 'Bạn nói: “' + esc(res[k].said || '…') + '”'}</span></div><em class="s${res[k].stars}">${res[k].total}</em></li>`).join('')}</ol>
          <div class="form-actions center">
            <button class="btn btn-ghost" id="again">↻ Luyện lại</button>
            <button class="btn btn-ghost" id="swap">⇄ Đổi vai</button>
            ${p.mode === 'model' ? '<button class="btn btn-ghost" id="lvl2">Lên Mức 2 →</button>' : ''}
            <a class="btn btn-primary" href="#/unit/${l.id}">Tình huống khác</a>
          </div>
          <small class="fine">Kết quả đã được lưu vào "Kết quả của tôi".</small>
        </div>`;
      G().$('#summary').scrollIntoView({ behavior: 'smooth', block: 'start' });
      G().$('#again').onclick = () => { G().getCleanup() && G().getCleanup()(); play(l, s, p); window.scrollTo(0, 0); };
      G().$('#swap').onclick = () => { p.role = otherRole; savePrefs(p); G().getCleanup() && G().getCleanup()(); play(l, s, p); window.scrollTo(0, 0); };
      const lv = G().$('#lvl2'); if (lv) lv.onclick = () => { p.mode = 'free'; savePrefs(p); G().getCleanup() && G().getCleanup()(); play(l, s, p); window.scrollTo(0, 0); };
    }

    next();
  }

  /* ---------- RESULTS ---------- */
  function results() {
    const { app, esc } = G();
    const list = DB.attempts().slice().reverse();
    const st = DB.student();
    const fmt = t => new Date(t).toLocaleString('vi-VN', { day: '2-digit', month: '2-digit', hour: '2-digit', minute: '2-digit' });
    app.innerHTML = `
      <section class="page">
        <a class="back" href="#/speak">← Luyện nói</a>
        <div class="section-head"><div><h2>Kết quả của tôi</h2><p class="sub">${st ? esc(st.name) + (st.code ? ' · Lớp ' + esc(st.code) : '') : ''} · ${list.length} lần luyện</p></div></div>
        ${list.length ? `<div class="table-wrap"><table class="res-table">
          <thead><tr><th>Thời gian</th><th>Bài</th><th>Mức</th><th>Dễ hiểu</th><th>Phát âm*</th><th>Dùng từ</th><th>Tổng</th></tr></thead>
          <tbody>${list.map(a => `<tr><td>${fmt(a.at)}</td><td><b>Unit ${a.unit}</b> · ${esc(a.sitTitle)}</td><td>${a.mode === 'model' ? '1' : '2'}</td>
            <td>${a.clarity}</td><td>${a.pron}</td><td>${a.use}</td><td><em class="s${a.total >= 85 ? 3 : a.total >= 65 ? 2 : a.total >= 40 ? 1 : 0}">${a.total}</em></td></tr>`).join('')}</tbody></table></div>`
          : `<div class="empty">Chưa có lần luyện nào. <a href="#/speak">Bắt đầu luyện nói →</a></div>`}
      </section>`;
  }

  return { home, unit, talk, results, DB };
})();
