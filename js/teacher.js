/* Grammar Tales — teacher dashboard */
const TEACHER = (() => {
  const G = () => window.GT;
  let rows = [], open = null;
  const f = { code: '', unit: '', mode: '', q: '', tab: 'students' };
  const sc = v => v >= 85 ? 3 : v >= 65 ? 2 : v >= 40 ? 1 : 0;
  const fmt = t => new Date(t).toLocaleString('vi-VN', { day: '2-digit', month: '2-digit', year: '2-digit', hour: '2-digit', minute: '2-digit' });
  const avg = (list, k) => list.length ? Math.round(list.reduce((a, r) => a + (r[k] || 0), 0) / list.length) : 0;
  const lessonOf = r => LESSONS.find(l => l.id === r.lesson_id);
  const sitOf = r => { const l = lessonOf(r); return l && l.situations.find(s => s.id === r.sit_id); };

  async function view() {
    const { app } = G();
    app.innerHTML = `<section class="page teacher"><p class="loading">Đang kết nối…</p></section>`;
    let sess = null;
    try { sess = await CLOUD.session(); }
    catch { app.innerHTML = `<section class="page teacher"><div class="empty">Không kết nối được máy chủ. Kiểm tra mạng rồi tải lại trang.</div></section>`; return; }
    if (!sess) return login();
    dashboard(sess);
  }

  function login(msg) {
    const { app, esc } = G();
    app.innerHTML = `
      <section class="page teacher">
        <a class="back" href="#/speak">← Luyện nói</a>
        <form class="login-card" id="login">
          <div class="sc-icon">🧑‍🏫</div>
          <h2>Đăng nhập giáo viên</h2>
          <p class="sub">Xem điểm, nghe ghi âm và xuất bảng điểm của học viên.</p>
          ${msg ? `<p class="err">${esc(msg)}</p>` : ''}
          <label class="field"><span>Email</span><input type="email" name="email" required autocomplete="username"></label>
          <label class="field"><span>Mật khẩu</span><input type="password" name="pw" required autocomplete="current-password"></label>
          <button class="btn btn-primary btn-lg" type="submit">Đăng nhập</button>
        </form>
      </section>`;
    G().$('#login').onsubmit = async e => {
      e.preventDefault();
      const fm = e.target, btn = fm.querySelector('button');
      btn.disabled = true; btn.textContent = 'Đang đăng nhập…';
      try { const s = await CLOUD.signIn(fm.email.value.trim(), fm.pw.value); dashboard(s); }
      catch (err) { login(/invalid/i.test(err.message || '') ? 'Sai email hoặc mật khẩu.' : 'Không đăng nhập được: ' + (err.message || 'lỗi không rõ')); }
    };
  }

  async function dashboard(sess) {
    const { app, esc } = G();
    app.innerHTML = `<section class="page teacher"><p class="loading">Đang tải bảng điểm…</p></section>`;
    try { rows = await CLOUD.list(); }
    catch (err) {
      app.innerHTML = `<section class="page teacher"><div class="empty">Chưa đọc được dữ liệu: ${esc(err.message || '')}<br>Bạn đã chạy file <b>supabase-setup.sql</b> trong Supabase chưa?</div>
        <p class="teacher-link"><button class="link-btn" id="out">Đăng xuất</button></p></section>`;
      G().$('#out').onclick = async () => { await CLOUD.signOut(); login(); };
      return;
    }
    render(sess);
  }

  function filtered() {
    const q = f.q.trim().toLowerCase();
    return rows.filter(r => (!f.code || r.class_code === f.code) && (!f.unit || String(r.unit) === f.unit) && (!f.mode || r.mode === f.mode) &&
      (!q || r.student.toLowerCase().includes(q)));
  }

  function render(sess) {
    const { app, esc } = G();
    const codes = [...new Set(rows.map(r => r.class_code).filter(Boolean))].sort();
    const units = [...new Set(rows.map(r => r.unit))].sort((a, b) => a - b);
    const list = filtered();
    const students = {};
    list.forEach(r => { const k = r.student + '|' + r.class_code; (students[k] = students[k] || []).push(r); });
    const today = new Date().toDateString();
    const opt = (v, label, cur) => `<option value="${esc(v)}" ${String(cur) === String(v) ? 'selected' : ''}>${esc(label)}</option>`;

    app.innerHTML = `
      <section class="page teacher">
        <div class="section-head">
          <div><p class="eyebrow">Giáo viên · ${esc(sess.user.email)}</p><h2>Bảng điểm luyện nói</h2></div>
          <div class="row"><button class="btn btn-ghost sm" id="reload">↻ Tải lại</button><button class="btn btn-ghost sm" id="csv">⬇ Xuất CSV</button><button class="btn btn-ghost sm" id="out">Đăng xuất</button></div>
        </div>
        <div class="filters">
          <select id="fCode">${opt('', 'Tất cả lớp', f.code)}${codes.map(c => opt(c, 'Lớp ' + c, f.code)).join('')}</select>
          <select id="fUnit">${opt('', 'Tất cả unit', f.unit)}${units.map(u => opt(u, 'Unit ' + u, f.unit)).join('')}</select>
          <select id="fMode">${opt('', 'Cả 2 mức', f.mode)}${opt('model', 'Mức 1 · câu mẫu', f.mode)}${opt('free', 'Mức 2 · tự do', f.mode)}</select>
          <input id="fQ" placeholder="Tìm học viên…" value="${esc(f.q)}">
        </div>
        <div class="stats">
          <div class="stat"><b>${list.length}</b><span>Lượt luyện</span></div>
          <div class="stat"><b>${Object.keys(students).length}</b><span>Học viên</span></div>
          <div class="stat"><b>${avg(list, 'total')}</b><span>Điểm TB</span></div>
          <div class="stat"><b>${list.filter(r => new Date(r.created_at).toDateString() === today).length}</b><span>Hôm nay</span></div>
        </div>
        <div class="chips tabs">
          <button class="chip ${f.tab === 'students' ? 'on' : ''}" data-tab="students">Theo học viên</button>
          <button class="chip ${f.tab === 'attempts' ? 'on' : ''}" data-tab="attempts">Tất cả lượt luyện</button>
        </div>
        ${!rows.length ? `<div class="empty">Chưa có học viên nào nộp bài.<br><small>Nếu học viên đã luyện mà vẫn trống, kiểm tra email <b>${esc(sess.user.email)}</b> đã có trong bảng <b>teachers</b> của Supabase chưa.</small></div>`
          : f.tab === 'students' ? studentTable(students) : attemptTable(list)}
      </section>`;

    const re = () => render(sess);
    G().$('#fCode').onchange = e => { f.code = e.target.value; re(); };
    G().$('#fUnit').onchange = e => { f.unit = e.target.value; re(); };
    G().$('#fMode').onchange = e => { f.mode = e.target.value; re(); };
    const qi = G().$('#fQ'); qi.oninput = e => { f.q = e.target.value; clearTimeout(qi._t); qi._t = setTimeout(() => { re(); const n = G().$('#fQ'); n.focus(); n.setSelectionRange(n.value.length, n.value.length); }, 350); };
    G().$$('[data-tab]').forEach(b => b.onclick = () => { f.tab = b.dataset.tab; re(); });
    G().$('#reload').onclick = () => dashboard(sess);
    G().$('#out').onclick = async () => { await CLOUD.signOut(); login(); };
    G().$('#csv').onclick = () => csv(list);
    G().$$('[data-student]').forEach(b => b.onclick = () => { f.q = b.dataset.student; f.code = b.dataset.code; f.tab = 'attempts'; re(); });
    G().$$('[data-open]').forEach(tr => tr.onclick = e => { if (e.target.closest('button')) return; open = open === tr.dataset.open ? null : tr.dataset.open; re(); });
    G().$$('[data-play]').forEach(b => b.onclick = async () => {
      b.disabled = true; b.textContent = '…';
      try { const url = await CLOUD.audioUrl(b.dataset.play); const au = new Audio(url); await au.play(); b.textContent = '▶ Nghe'; }
      catch { G().toast('Không mở được bản ghi'); b.textContent = '▶ Nghe'; }
      b.disabled = false;
    });
    G().$$('[data-del]').forEach(b => b.onclick = async () => {
      const r = rows.find(x => x.id === b.dataset.del);
      if (!r || !confirm(`Xoá lượt luyện của ${r.student}? Bản ghi âm cũng bị xoá.`)) return;
      try { await CLOUD.remove(r); rows = rows.filter(x => x.id !== r.id); G().toast('Đã xoá'); re(); }
      catch (err) { G().toast('Không xoá được: ' + (err.message || '')); }
    });
  }

  function studentTable(students) {
    const { esc } = G();
    const list = Object.values(students).map(l => ({ name: l[0].student, code: l[0].class_code, n: l.length, total: avg(l, 'total'), clarity: avg(l, 'clarity'), pron: avg(l, 'pron'), use: avg(l, 'word_use'), last: l[0].created_at, sits: new Set(l.map(r => r.lesson_id + r.sit_id)).size }))
      .sort((a, b) => a.code.localeCompare(b.code) || a.name.localeCompare(b.name));
    return `<div class="table-wrap"><table class="res-table">
      <thead><tr><th>Học viên</th><th>Lớp</th><th>Lượt luyện</th><th>Tình huống</th><th>Dễ hiểu</th><th>Phát âm*</th><th>Dùng từ</th><th>TB tổng</th><th>Lần cuối</th></tr></thead>
      <tbody>${list.map(s => `<tr><td><button class="link-btn name" data-student="${esc(s.name)}" data-code="${esc(s.code)}">${esc(s.name)}</button></td><td>${esc(s.code || '—')}</td>
        <td>${s.n}</td><td>${s.sits}</td><td>${s.clarity}</td><td>${s.pron}</td><td>${s.use}</td><td><em class="s${sc(s.total)}">${s.total}</em></td><td>${fmt(s.last)}</td></tr>`).join('')}</tbody></table></div>
      <small class="fine">Bấm vào tên để xem từng lượt luyện và nghe ghi âm.</small>`;
  }

  function attemptTable(list) {
    const { esc } = G();
    return `<div class="table-wrap"><table class="res-table">
      <thead><tr><th>Thời gian</th><th>Học viên</th><th>Lớp</th><th>Bài</th><th>Mức</th><th>Dễ hiểu</th><th>Phát âm*</th><th>Dùng từ</th><th>Tổng</th></tr></thead>
      <tbody>${list.slice(0, 500).map(r => {
        const isOpen = open === r.id;
        return `<tr class="clickable ${isOpen ? 'open' : ''}" data-open="${esc(r.id)}"><td>${fmt(r.created_at)}</td><td><b>${esc(r.student)}</b></td><td>${esc(r.class_code || '—')}</td>
          <td>Unit ${r.unit} · ${esc(r.sit_title || r.sit_id)}</td><td>${r.mode === 'model' ? '1' : '2'}</td><td>${r.clarity}</td><td>${r.pron}</td><td>${r.word_use}</td>
          <td><em class="s${sc(r.total)}">${r.total}</em> <span class="caret">${isOpen ? '▴' : '▾'}</span></td></tr>
          ${isOpen ? `<tr class="detail"><td colspan="9">${detail(r)}</td></tr>` : ''}`;
      }).join('')}</tbody></table></div>
      ${list.length > 500 ? '<small class="fine">Đang hiện 500 lượt mới nhất. Dùng bộ lọc để thu hẹp.</small>' : ''}`;
  }

  function detail(r) {
    const { esc } = G();
    const s = sitOf(r);
    const roleLabel = s ? (s.roles.find(x => x.key === r.role) || {}).label : r.role;
    return `<div class="detail-box">
      <p class="sub">Vai: <b>${esc(roleLabel || '')}</b> · ${r.mode === 'model' ? 'Mức 1 · Bám câu mẫu' : 'Mức 2 · Nói tự do'}</p>
      <ol class="turn-list">${(r.turns || []).map(t => {
        const model = s && s.turns[t.i] ? s.turns[t.i].t.replace(/\{[ABC]\}/g, '___') : '';
        return `<li><div><b>${esc(model)}</b>
          <span>${t.skipped ? 'Bỏ qua' : t.self ? 'Học viên tự chấm' : 'Máy nghe được: “' + esc(t.said || '…') + '”'}${t.self || t.skipped ? '' : ` · dễ hiểu ${t.clarity ?? '-'} · phát âm ${t.pron ?? '-'} · dùng từ ${t.use ?? '-'}`}</span>
          ${t.audio ? `<button class="btn btn-ghost sm" data-play="${esc(t.audio)}">▶ Nghe</button>` : '<span class="muted">Không có bản ghi</span>'}</div>
          <em class="s${sc(t.total)}">${t.total}</em></li>`;
      }).join('')}</ol>
      <div class="row end"><button class="link-btn danger" data-del="${esc(r.id)}">Xoá lượt luyện này</button></div>
    </div>`;
  }

  function csv(list) {
    const head = ['Thời gian', 'Học viên', 'Lớp', 'Unit', 'Tình huống', 'Vai', 'Mức', 'Dễ hiểu', 'Phát âm', 'Dùng từ', 'Tổng'];
    const q = v => `"${String(v ?? '').replace(/"/g, '""')}"`;
    const lines = [head.map(q).join(',')].concat(list.map(r => [fmt(r.created_at), r.student, r.class_code, r.unit, r.sit_title, r.role, r.mode === 'model' ? 1 : 2, r.clarity, r.pron, r.word_use, r.total].map(q).join(',')));
    const blob = new Blob(['﻿' + lines.join('\n')], { type: 'text/csv;charset=utf-8' });
    const a = document.createElement('a'); a.href = URL.createObjectURL(blob);
    a.download = `bang-diem-${f.code || 'tat-ca'}-${new Date().toISOString().slice(0, 10)}.csv`;
    document.body.appendChild(a); a.click(); a.remove();
  }

  return { view };
})();
