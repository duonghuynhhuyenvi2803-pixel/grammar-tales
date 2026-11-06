/* Grammar Tales — free speaking scorer (transcript-based estimate)
   Scores: clarity (dễ hiểu), pron (phát âm – ước lượng), use (dùng từ), total.
*/
const SCORE = (() => {
  const CONTR = {
    "i'm": 'i am', "i'd": 'i would', "i'll": 'i will', "i've": 'i have', "you're": 'you are', "you'll": 'you will', "you've": 'you have',
    "we're": 'we are', "we've": 'we have', "we'll": 'we will', "we'd": 'we would', "it's": 'it is', "that's": 'that is', "that'll": 'that will',
    "there's": 'there is', "what's": 'what is', "here's": 'here is', "where's": 'where is', "don't": 'do not', "didn't": 'did not', "doesn't": 'does not',
    "can't": 'cannot', "won't": 'will not', "isn't": 'is not', "aren't": 'are not', "wasn't": 'was not', "let's": 'let us', "how's": 'how is',
    "she's": 'she is', "he's": 'he is', "they're": 'they are', "couldn't": 'could not', "wouldn't": 'would not', "haven't": 'have not', "i'll've": 'i will have'
  };
  const ONES = ['zero', 'one', 'two', 'three', 'four', 'five', 'six', 'seven', 'eight', 'nine', 'ten', 'eleven', 'twelve', 'thirteen', 'fourteen', 'fifteen', 'sixteen', 'seventeen', 'eighteen', 'nineteen'];
  const TENS = ['', '', 'twenty', 'thirty', 'forty', 'fifty', 'sixty', 'seventy', 'eighty', 'ninety'];
  function numWords(n) {
    n = +n; if (n < 20) return ONES[n];
    if (n < 100) return TENS[Math.floor(n / 10)] + (n % 10 ? ' ' + ONES[n % 10] : '');
    if (n < 1000) return ONES[Math.floor(n / 100)] + ' hundred' + (n % 100 ? ' ' + numWords(n % 100) : '');
    return String(n).split('').map(d => ONES[+d]).join(' ');
  }
  // words that sound the same → same token
  const HOMO = { for: 'four', four: 'four', to: 'two', too: 'two', two: 'two', ate: 'eight', eight: 'eight', there: 'their', their: 'their', theyre: 'their', right: 'write', write: 'write', bye: 'by', by: 'by', buy: 'by', ok: 'okay', okay: 'okay', cafe: 'cafe', mr: 'mister', mrs: 'missus', ms: 'miss' };
  const STOP = new Set(('a an the is am are was were be been to of and in on at it i you we they he she my your our his her this that these those so please oh well do does did ' +
    'would will can could just very really here there me us them some any for with have has had not no yes about').split(' '));

  function tokens(text) {
    let s = String(text).toLowerCase()
      .replace(/[’‘`]/g, "'").replace(/é/g, 'e')
      .replace(/(\d+):00/g, '$1').replace(/(\d+)\s*(p\.?m\.?)/g, '$1 pm').replace(/\bp\.m\.?/g, 'pm')
      .replace(/o'clock/g, 'oclock').replace(/\$(\d+)/g, '$1 dollars');
    s = s.replace(/\b[a-z]+'[a-z]+\b/g, w => CONTR[w] || w.replace(/'/g, ''));
    s = s.replace(/\d+/g, d => ' ' + numWords(d) + ' ');
    s = s.replace(/-/g, ' ').replace(/[^a-z' ]/g, ' ').replace(/'/g, '');
    return s.split(/\s+/).filter(Boolean);
  }

  function lev(a, b) {
    if (a === b) return 0;
    const m = a.length, n = b.length; if (!m || !n) return m || n;
    let prev = Array.from({ length: n + 1 }, (_, j) => j);
    for (let i = 1; i <= m; i++) {
      const cur = [i];
      for (let j = 1; j <= n; j++) cur[j] = Math.min(prev[j] + 1, cur[j - 1] + 1, prev[j - 1] + (a[i - 1] === b[j - 1] ? 0 : 1));
      prev = cur;
    }
    return prev[n];
  }
  function sim(a, b) { // 2 exact, 1 near, 0 none
    a = HOMO[a] || a; b = HOMO[b] || b;
    if (a === b) return 2;
    if (a.length < 3 || b.length < 3) return 0;
    return 1 - lev(a, b) / Math.max(a.length, b.length) >= .66 ? 1 : 0;
  }

  // ordered fuzzy alignment (weighted LCS) of target words against said words
  function align(target, said) {
    const m = target.length, n = said.length;
    const dp = Array.from({ length: m + 1 }, () => new Array(n + 1).fill(0));
    for (let i = 1; i <= m; i++) for (let j = 1; j <= n; j++) {
      const s = sim(target[i - 1], said[j - 1]);
      dp[i][j] = Math.max(dp[i - 1][j], dp[i][j - 1], s ? dp[i - 1][j - 1] + s : 0);
    }
    const status = new Array(m).fill('miss');
    let i = m, j = n;
    while (i > 0 && j > 0) {
      const s = sim(target[i - 1], said[j - 1]);
      if (s && dp[i][j] === dp[i - 1][j - 1] + s) { status[i - 1] = s === 2 ? 'ok' : 'near'; i--; j--; }
      else if (dp[i - 1][j] >= dp[i][j - 1]) i--; else j--;
    }
    return status;
  }

  function evalTarget(targetText, said, ignore) {
    const words = tokens(targetText).filter(w => !ignore.has(w));
    const st = align(words, said);
    let ok = 0, near = 0, cOk = 0, cNear = 0, cLen = 0;
    words.forEach((w, k) => {
      const content = !STOP.has(w);
      if (content) cLen++;
      if (st[k] === 'ok') { ok++; if (content) cOk++; }
      if (st[k] === 'near') { near++; if (content) cNear++; }
    });
    const len = words.length || 1;
    return {
      text: targetText, words: words.map((w, k) => ({ w, s: st[k], content: !STOP.has(w) })),
      acc: (ok + .5 * near) / len, recall: cLen ? (cOk + .5 * cNear) / cLen : (ok + .5 * near) / len,
      ok, near, len: words.length, cLen
    };
  }

  /* opts: { mode: 'model'|'free', confidence, hints, names: [] } */
  function score(variants, transcript, opts = {}) {
    const ignore = new Set((opts.names || []).flatMap(n => tokens(n)));
    const said = tokens(transcript || '').filter(w => !ignore.has(w));
    const list = opts.mode === 'model' ? variants.slice(0, 1) : variants;
    if (!said.length) {
      return { total: 0, clarity: 0, pron: 0, use: 0, stars: 0, said: '', best: evalTarget(list[0], [], ignore), tips: ['Máy chưa nghe được gì. Hãy nói to, rõ và gần micro hơn nhé.'] };
    }
    const evals = list.map(v => evalTarget(v, said, ignore));
    const key = opts.mode === 'model' ? 'acc' : 'recall';
    const best = evals.reduce((a, b) => (b[key] > a[key] ? b : a));
    const conf = typeof opts.confidence === 'number' && opts.confidence > 0 ? Math.min(1, opts.confidence) : null;

    let clarity, pron, use;
    if (opts.mode === 'model') {
      clarity = best.acc * 100;
      pron = (best.ok + .4 * best.near) / Math.max(1, best.len) * 100;
      use = best.acc * 100;
    } else {
      const matched = best.ok + best.near;
      clarity = said.length >= 3 ? Math.max(best.recall * 100, 60) : best.recall * 100;
      pron = matched ? (best.ok + .4 * best.near) / matched * 100 * Math.min(1, .4 + best.recall) : 0;
      use = best.recall * 100;
      const minLen = Math.min(...evals.map(e => e.len));
      if (said.length < minLen * .5) use *= .8;
      use -= Math.min(20, (opts.hints || 0) * 7);
    }
    if (conf !== null) { clarity = .6 * clarity + 40 * conf; pron = .7 * pron + 30 * conf; }
    const r = v => Math.max(0, Math.min(100, Math.round(v)));
    clarity = r(clarity); pron = r(pron); use = r(use);
    const total = r((clarity + pron + use) / 3);
    const stars = total >= 85 ? 3 : total >= 65 ? 2 : total >= 40 ? 1 : 0;

    const tips = [];
    const missed = best.words.filter(x => x.s === 'miss' && x.content).map(x => x.w);
    const near = best.words.filter(x => x.s === 'near').map(x => x.w);
    if (opts.mode !== 'model' && best.recall < .4) tips.push('Câu trả lời chưa đúng ý tình huống. Bấm 💡 Gợi ý để xem cách nói.');
    else if (missed.length) tips.push(`Máy chưa nghe ra: ${[...new Set(missed)].slice(0, 6).join(', ')}.`);
    if (near.length) tips.push(`Gần đúng, luyện phát âm lại: ${[...new Set(near)].slice(0, 6).join(', ')}.`);
    if (stars === 3) tips.unshift('Rất tốt! Máy nghe rõ và câu dùng đúng ý.');
    return { total, clarity, pron, use, stars, said: transcript, best, tips };
  }

  return { score, tokens };
})();
if (typeof module !== 'undefined') module.exports = SCORE;
