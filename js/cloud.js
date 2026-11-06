/* Grammar Tales — Supabase connection
   The publishable key is meant to be public; data is protected by Row Level Security (see supabase-setup.sql):
   students can only ADD results/recordings, only a signed-in teacher can read or delete them. */
const CLOUD = (() => {
  const SUPABASE_URL = 'https://nlbrddgxxpxvbkcvhszp.supabase.co';
  const SUPABASE_KEY = 'sb_publishable_jPw_Oe_-WmEYwBi0pKI-jg_3eYTySLZ';
  const BUCKET = 'recordings';
  let client = null, loading = null;

  function load() {
    if (client) return Promise.resolve(client);
    if (loading) return loading;
    loading = new Promise((resolve, reject) => {
      const go = () => {
        client = window.supabase.createClient(SUPABASE_URL, SUPABASE_KEY, { auth: { persistSession: true, storageKey: 'gt_teacher_auth' } });
        resolve(client);
      };
      if (window.supabase && window.supabase.createClient) return go();
      const s = document.createElement('script');
      s.src = 'https://cdn.jsdelivr.net/npm/@supabase/supabase-js@2/dist/umd/supabase.min.js';
      s.onload = go;
      s.onerror = () => { loading = null; reject(new Error('Không tải được thư viện Supabase')); };
      document.head.appendChild(s);
    });
    return loading;
  }

  const uuid = () => (window.crypto && crypto.randomUUID) ? crypto.randomUUID()
    : 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, c => { const r = Math.random() * 16 | 0; return (c === 'x' ? r : (r & 3 | 8)).toString(16); });

  function extFor(type) {
    if (type.includes('mp4') || type.includes('m4a') || type.includes('aac')) return 'm4a';
    if (type.includes('ogg')) return 'ogg';
    if (type.includes('wav')) return 'wav';
    if (type.includes('mpeg')) return 'mp3';
    return 'webm';
  }

  /* attempt: local attempt object; blobs: { turnIndex: Blob } */
  async function submit(attempt, blobs = {}) {
    const c = await load();
    const turns = attempt.turns.map(t => ({ ...t }));
    for (const t of turns) {
      const b = blobs[t.i];
      if (!b || !b.size) continue;
      const type = (b.type || 'audio/webm').split(';')[0];
      const path = `${attempt.id}/${t.i}.${extFor(type)}`;
      const { error } = await c.storage.from(BUCKET).upload(path, b, { contentType: type, upsert: false });
      if (!error) t.audio = path;
    }
    const row = {
      id: attempt.id, student: attempt.student.slice(0, 60), class_code: (attempt.code || '').slice(0, 30),
      lesson_id: attempt.lessonId, unit: attempt.unit, sit_id: attempt.sitId, sit_title: (attempt.sitTitle || '').slice(0, 120),
      role: attempt.role, mode: attempt.mode, total: attempt.total, clarity: attempt.clarity, pron: attempt.pron, word_use: attempt.use,
      turns
    };
    const { error } = await c.from('attempts').insert(row);
    if (error && error.code !== '23505') throw error; // 23505 = already sent
    return true;
  }

  /* ---------- teacher ---------- */
  async function session() { const c = await load(); const { data } = await c.auth.getSession(); return data.session; }
  async function signIn(email, password) {
    const c = await load();
    const { data, error } = await c.auth.signInWithPassword({ email, password });
    if (error) throw error; return data.session;
  }
  async function signOut() { const c = await load(); await c.auth.signOut(); }
  async function list() {
    const c = await load();
    const { data, error } = await c.from('attempts').select('*').order('created_at', { ascending: false }).limit(2000);
    if (error) throw error; return data || [];
  }
  async function audioUrl(path) {
    const c = await load();
    const { data, error } = await c.storage.from(BUCKET).createSignedUrl(path, 3600);
    if (error) throw error; return data.signedUrl;
  }
  async function remove(row) {
    const c = await load();
    const paths = (row.turns || []).map(t => t.audio).filter(Boolean);
    if (paths.length) await c.storage.from(BUCKET).remove(paths);
    const { error } = await c.from('attempts').delete().eq('id', row.id);
    if (error) throw error;
  }

  return { load, submit, uuid, session, signIn, signOut, list, audioUrl, remove };
})();
