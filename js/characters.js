/* Grammar Tales — character system (SVG, fully parametric) */
const CH = (() => {
  const SKINS = ['#FDDCC0', '#F5C9A0', '#E8B07E', '#C98B5A', '#9A6440', '#6B4329'];
  const HAIR_COLORS = ['#211A17', '#4A2C1D', '#8B5A2B', '#D9A54E', '#F0D58C', '#B5452B', '#8C8C99', '#6B4FA0', '#2E7FB8', '#E0628F'];
  const OUTFIT_COLORS = ['#FF7A59', '#FFC94A', '#2EC4B6', '#4C8DF6', '#7B5CF0', '#E0628F', '#3BAA5C', '#F4F1EA', '#2B2340', '#B5452B'];
  const PANTS_COLORS = ['#2B3A67', '#3D3D46', '#6B4F3A', '#5A7D9A', '#2F5D50', '#C9B79C'];

  const HAIR_STYLES = [
    ['short', 'Ngắn'], ['spiky', 'Dựng'], ['long', 'Dài'], ['ponytail', 'Đuôi ngựa'],
    ['bun', 'Búi'], ['curly', 'Xoăn'], ['bob', 'Bob'], ['bald', 'Trọc']
  ];
  const OUTFITS = [['tshirt', 'Áo thun'], ['hoodie', 'Hoodie'], ['shirt', 'Sơ mi'], ['dress', 'Váy']];
  const ACCESSORIES = [['none', 'Không'], ['glasses', 'Kính'], ['cap', 'Mũ lưỡi trai'], ['bow', 'Nơ'], ['headphones', 'Tai nghe']];
  const MOODS = ['neutral', 'happy', 'excited', 'sad', 'surprised', 'angry', 'thinking'];

  function shade(hex, amt) {
    const n = parseInt(hex.slice(1), 16);
    const cl = v => Math.max(0, Math.min(255, v));
    const r = cl((n >> 16) + amt), g = cl(((n >> 8) & 255) + amt), b = cl((n & 255) + amt);
    return '#' + ((1 << 24) + (r << 16) + (g << 8) + b).toString(16).slice(1);
  }
  const INK = '#2B2340';

  function hairBack(style, col) {
    switch (style) {
      case 'long':
        return `<path d="M44 92 Q38 34 100 32 Q162 34 156 92 L164 204 Q132 216 100 206 Q68 216 36 204 Z" fill="${col}"/>`;
      case 'bob':
        return `<path d="M42 92 Q38 34 100 32 Q162 34 158 92 L160 146 Q130 156 100 152 Q70 156 40 146 Z" fill="${col}"/>`;
      case 'ponytail':
        return `<path d="M138 58 Q192 66 178 150 Q172 168 160 176 Q166 130 146 98 Z" fill="${col}"/>
                <circle cx="146" cy="66" r="8" fill="#FF7A59"/>`;
      case 'bun':
        return `<circle cx="100" cy="32" r="22" fill="${col}"/><circle cx="92" cy="26" r="6" fill="${shade(col, 30)}" opacity=".35"/>`;
      default: return '';
    }
  }

  function hairFront(style, col) {
    const hi = shade(col, 35);
    switch (style) {
      case 'short':
        return `<path d="M47 94 Q42 36 100 34 Q158 36 153 94 Q148 70 128 62 Q112 72 86 64 Q60 66 47 94 Z" fill="${col}"/>
                <path d="M70 48 Q90 40 112 44" stroke="${hi}" stroke-width="4" fill="none" stroke-linecap="round" opacity=".5"/>`;
      case 'spiky':
        return `<path d="M47 92 L40 56 L60 62 L62 32 L82 48 L100 22 L118 48 L138 32 L140 62 L160 56 L153 92 Q144 66 100 62 Q58 66 47 92 Z" fill="${col}"/>`;
      case 'long':
        return `<path d="M47 100 Q42 34 100 34 Q158 34 153 100 Q150 70 122 58 Q98 74 60 70 Q50 80 47 100 Z" fill="${col}"/>
                <path d="M72 46 Q92 38 116 44" stroke="${hi}" stroke-width="4" fill="none" stroke-linecap="round" opacity=".5"/>`;
      case 'ponytail':
      case 'bun':
        return `<path d="M47 94 Q42 36 100 34 Q158 36 153 94 Q146 66 100 60 Q56 66 47 94 Z" fill="${col}"/>
                <path d="M72 46 Q92 38 116 44" stroke="${hi}" stroke-width="4" fill="none" stroke-linecap="round" opacity=".5"/>`;
      case 'bob':
        return `<path d="M48 96 Q44 36 100 36 Q156 36 152 96 L152 74 Q100 64 48 74 Z" fill="${col}"/>
                <path d="M72 46 Q92 40 116 45" stroke="${hi}" stroke-width="4" fill="none" stroke-linecap="round" opacity=".5"/>`;
      case 'curly': {
        let s = `<path d="M50 92 Q44 40 100 38 Q156 40 150 92 Q140 68 100 64 Q60 68 50 92 Z" fill="${col}"/>`;
        for (let a = -185; a <= 5; a += 19) {
          const r = a * Math.PI / 180;
          s += `<circle cx="${(100 + 52 * Math.cos(r)).toFixed(1)}" cy="${(86 + 50 * Math.sin(r)).toFixed(1)}" r="15" fill="${col}"/>`;
        }
        s += `<circle cx="80" cy="44" r="5" fill="${hi}" opacity=".4"/><circle cx="118" cy="42" r="4" fill="${hi}" opacity=".4"/>`;
        return s;
      }
      default: return '';
    }
  }

  function brows(mood, col) {
    const d = {
      neutral: ['M70 80 Q80 76 90 80', 'M110 80 Q120 76 130 80'],
      happy: ['M70 77 Q80 71 90 77', 'M110 77 Q120 71 130 77'],
      excited: ['M70 75 Q80 68 90 75', 'M110 75 Q120 68 130 75'],
      sad: ['M70 80 Q80 79 90 73', 'M110 73 Q120 79 130 80'],
      angry: ['M70 74 L90 82', 'M110 82 L130 74'],
      surprised: ['M70 72 Q80 64 90 72', 'M110 72 Q120 64 130 72'],
      thinking: ['M70 80 Q80 78 90 80', 'M110 75 Q120 68 130 75']
    }[mood] || ['M70 80 Q80 76 90 80', 'M110 80 Q120 76 130 80'];
    return d.map(p => `<path d="${p}" stroke="${col}" stroke-width="4" fill="none" stroke-linecap="round"/>`).join('');
  }

  function eyes(mood) {
    if (mood === 'excited' || mood === 'happy') {
      if (mood === 'excited') {
        return `<g class="ch-eyes"><path d="M72 100 Q80 90 88 100" stroke="${INK}" stroke-width="4.5" fill="none" stroke-linecap="round"/>
                <path d="M112 100 Q120 90 128 100" stroke="${INK}" stroke-width="4.5" fill="none" stroke-linecap="round"/></g>`;
      }
    }
    const ry = mood === 'surprised' ? 9 : (mood === 'sad' ? 6 : 7.5);
    return `<g class="ch-eyes">
      <ellipse cx="80" cy="98" rx="6.5" ry="${ry}" fill="${INK}"/><ellipse cx="120" cy="98" rx="6.5" ry="${ry}" fill="${INK}"/>
      <circle cx="82.5" cy="95" r="2.3" fill="#fff"/><circle cx="122.5" cy="95" r="2.3" fill="#fff"/></g>`;
  }

  function mouth(mood) {
    const st = `stroke="${INK}" stroke-width="4" fill="none" stroke-linecap="round"`;
    const closed = {
      neutral: `<path d="M91 122 Q100 127 109 122" ${st}/>`,
      happy: `<path d="M86 117 Q100 134 114 117 Z" fill="#7A2E3A" stroke="${INK}" stroke-width="2.5" stroke-linejoin="round"/>`,
      excited: `<path d="M82 115 Q100 142 118 115 Z" fill="#7A2E3A" stroke="${INK}" stroke-width="2.5" stroke-linejoin="round"/><path d="M92 130 Q100 126 108 130 Q100 136 92 130Z" fill="#E86B7A"/>`,
      sad: `<path d="M89 128 Q100 118 111 128" ${st}/>`,
      surprised: `<ellipse cx="100" cy="124" rx="6.5" ry="8.5" fill="#7A2E3A" stroke="${INK}" stroke-width="2.5"/>`,
      angry: `<path d="M89 126 Q100 120 111 126" ${st}/>`,
      thinking: `<path d="M93 124 Q103 120 111 126" ${st}/>`
    }[mood] || `<path d="M91 122 Q100 127 109 122" ${st}/>`;
    return `<g class="mouth-closed">${closed}</g>
      <g class="mouth-open"><ellipse cx="100" cy="123" rx="9" ry="8" fill="#7A2E3A" stroke="${INK}" stroke-width="2.5"/><ellipse cx="100" cy="127" rx="5" ry="3" fill="#E86B7A"/></g>`;
  }

  function accessory(c) {
    switch (c.accessory) {
      case 'glasses':
        return `<g fill="rgba(255,255,255,.18)" stroke="${INK}" stroke-width="3.5">
          <circle cx="80" cy="98" r="14"/><circle cx="120" cy="98" r="14"/></g>
          <path d="M94 97 Q100 93 106 97" stroke="${INK}" stroke-width="3.5" fill="none"/>`;
      case 'cap': {
        const col = c.outfitColor === '#F4F1EA' ? '#FF7A59' : c.outfitColor;
        return `<path d="M44 80 Q44 26 100 26 Q156 26 156 80 Q100 66 44 80 Z" fill="${col}" stroke="${shade(col, -40)}" stroke-width="2"/>
          <path d="M100 70 Q150 64 184 76 Q178 88 150 86 Q120 84 100 80 Z" fill="${shade(col, -25)}"/>
          <circle cx="100" cy="28" r="5" fill="${shade(col, -40)}"/>`;
      }
      case 'bow':
        return `<g transform="translate(136 44) rotate(18)">
          <path d="M0 0 L-20 -13 L-20 13 Z" fill="#FF5C8A" stroke="#C43A64" stroke-width="2" stroke-linejoin="round"/>
          <path d="M0 0 L20 -13 L20 13 Z" fill="#FF5C8A" stroke="#C43A64" stroke-width="2" stroke-linejoin="round"/>
          <circle r="6" fill="#FF8FB0" stroke="#C43A64" stroke-width="2"/></g>`;
      case 'headphones':
        return `<path d="M42 100 Q40 26 100 26 Q160 26 158 100" stroke="${INK}" stroke-width="7" fill="none" stroke-linecap="round"/>
          <rect x="34" y="88" width="20" height="32" rx="9" fill="#FF7A59" stroke="${INK}" stroke-width="3"/>
          <rect x="146" y="88" width="20" height="32" rx="9" fill="#FF7A59" stroke="${INK}" stroke-width="3"/>`;
      default: return '';
    }
  }

  function bodyParts(c) {
    const o = c.outfitColor, od = shade(o, -30), skin = c.skin, skd = shade(skin, -25);
    const pants = c.pantsColor;
    const longSleeve = c.outfit === 'hoodie' || c.outfit === 'shirt';
    let legs, torso, extras = '';

    if (c.outfit === 'dress') {
      legs = `<rect x="74" y="262" width="18" height="38" rx="8" fill="${skin}"/><rect x="108" y="262" width="18" height="38" rx="8" fill="${skin}"/>`;
      torso = `<path d="M66 166 Q66 152 80 150 L120 150 Q134 152 134 166 L136 206 L162 276 Q100 290 38 276 L64 206 Z" fill="${o}" stroke="${od}" stroke-width="2.5" stroke-linejoin="round"/>
        <path d="M64 206 L136 206" stroke="${od}" stroke-width="5"/>
        <path d="M60 240 Q100 250 140 240" stroke="${shade(o, 25)}" stroke-width="3" fill="none" opacity=".7"/>`;
    } else {
      legs = `<rect x="68" y="236" width="28" height="64" rx="9" fill="${pants}"/><rect x="104" y="236" width="28" height="64" rx="9" fill="${pants}"/>
        <path d="M100 240 L100 262" stroke="${shade(pants, -20)}" stroke-width="3"/>`;
      torso = `<path d="M60 166 Q60 152 76 150 L124 150 Q140 152 140 166 L146 246 Q100 254 54 246 Z" fill="${o}" stroke="${od}" stroke-width="2.5" stroke-linejoin="round"/>`;
      if (c.outfit === 'hoodie') {
        extras = `<path d="M78 150 Q100 176 122 150" fill="${od}" opacity=".55"/>
          <path d="M92 160 L90 192 M108 160 L110 192" stroke="#F4F1EA" stroke-width="3" stroke-linecap="round"/>
          <path d="M74 212 L126 212 L120 238 L80 238 Z" fill="${od}" opacity=".45"/>`;
      } else if (c.outfit === 'shirt') {
        extras = `<path d="M84 150 L100 172 L90 180 L78 156 Z M116 150 L100 172 L110 180 L122 156 Z" fill="#F4F1EA" stroke="${od}" stroke-width="1.5"/>
          <circle cx="100" cy="190" r="3" fill="${od}"/><circle cx="100" cy="208" r="3" fill="${od}"/><circle cx="100" cy="226" r="3" fill="${od}"/>`;
      } else {
        extras = `<path d="M84 152 Q100 166 116 152" stroke="${od}" stroke-width="3" fill="none"/>
          <circle cx="100" cy="196" r="13" fill="${shade(o, 35)}" opacity=".6"/><path d="M94 196 l4 4 l8 -9" stroke="${od}" stroke-width="3" fill="none" stroke-linecap="round"/>`;
      }
    }
    const shoes = `<ellipse cx="82" cy="302" rx="19" ry="9" fill="${INK}"/><ellipse cx="118" cy="302" rx="19" ry="9" fill="${INK}"/>
      <ellipse cx="76" cy="299" rx="6" ry="2.5" fill="#fff" opacity=".3"/><ellipse cx="112" cy="299" rx="6" ry="2.5" fill="#fff" opacity=".3"/>`;

    const arm = (side) => {
      const x = side === 'l' ? 42 : 138;
      const hx = side === 'l' ? 52 : 148;
      const sleeve = longSleeve
        ? `<rect x="${x}" y="156" width="20" height="74" rx="10" fill="${o}" stroke="${od}" stroke-width="2.5"/>`
        : `<rect x="${x + 2}" y="176" width="16" height="54" rx="8" fill="${skin}"/>
           <rect x="${x}" y="156" width="20" height="30" rx="10" fill="${o}" stroke="${od}" stroke-width="2.5"/>`;
      return `<g class="ch-arm-${side}">${sleeve}<circle cx="${hx}" cy="234" r="10" fill="${skin}" stroke="${skd}" stroke-width="2"/></g>`;
    };
    return { legs: legs + shoes, torso: torso + extras, arms: arm('l') + arm('r') };
  }

  function svg(c, mood = 'neutral') {
    if (!MOODS.includes(mood)) mood = 'neutral';
    const skin = c.skin, skd = shade(skin, -22);
    const b = bodyParts(c);
    const hair = c.hairColor;
    const browCol = c.hairStyle === 'bald' ? shade(skin, -70) : shade(hair, -10);
    return `<svg viewBox="0 0 200 320" class="char-svg" xmlns="http://www.w3.org/2000/svg" aria-hidden="true">
  <ellipse cx="100" cy="308" rx="62" ry="9" fill="#000" opacity=".12"/>
  <g class="ch-legs">${b.legs}</g>
  <g class="ch-body">
    <g class="ch-head">${hairBack(c.hairStyle, hair)}</g>
    ${b.arms}
    ${b.torso}
    <rect x="90" y="136" width="20" height="20" rx="6" fill="${skd}"/>
    <g class="ch-head">
      <circle cx="49" cy="102" r="10" fill="${skin}" stroke="${skd}" stroke-width="2"/>
      <circle cx="151" cy="102" r="10" fill="${skin}" stroke="${skd}" stroke-width="2"/>
      <circle cx="100" cy="92" r="53" fill="${skin}" stroke="${skd}" stroke-width="2.5"/>
      <ellipse cx="70" cy="114" rx="9" ry="5.5" fill="#FF7A8A" opacity=".35"/>
      <ellipse cx="130" cy="114" rx="9" ry="5.5" fill="#FF7A8A" opacity=".35"/>
      ${eyes(mood)}
      ${brows(mood, browCol)}
      <path d="M99 104 Q96 112 101 113" stroke="${skd}" stroke-width="3" fill="none" stroke-linecap="round"/>
      <g class="ch-mouth">${mouth(mood)}</g>
      ${hairFront(c.hairStyle, hair)}
      ${accessory(c)}
    </g>
  </g>
</svg>`;
  }

  const PRESETS = [
    { id: 'p-mai', name: 'Mai', pronoun: 'she', skin: SKINS[0], hairStyle: 'long', hairColor: HAIR_COLORS[0], outfit: 'tshirt', outfitColor: OUTFIT_COLORS[0], pantsColor: PANTS_COLORS[0], accessory: 'none' },
    { id: 'p-leo', name: 'Leo', pronoun: 'he', skin: SKINS[2], hairStyle: 'spiky', hairColor: HAIR_COLORS[2], outfit: 'hoodie', outfitColor: OUTFIT_COLORS[2], pantsColor: PANTS_COLORS[1], accessory: 'none' },
    { id: 'p-sam', name: 'Sam', pronoun: 'he', skin: SKINS[4], hairStyle: 'curly', hairColor: HAIR_COLORS[0], outfit: 'shirt', outfitColor: OUTFIT_COLORS[1], pantsColor: PANTS_COLORS[2], accessory: 'glasses' },
    { id: 'p-ruby', name: 'Ruby', pronoun: 'she', skin: SKINS[1], hairStyle: 'bun', hairColor: HAIR_COLORS[5], outfit: 'dress', outfitColor: OUTFIT_COLORS[4], pantsColor: PANTS_COLORS[0], accessory: 'bow' }
  ];

  function random(name) {
    const pick = a => a[Math.floor(Math.random() * a.length)];
    const outfit = pick(OUTFITS)[0];
    return {
      id: 'c-' + Date.now().toString(36) + Math.random().toString(36).slice(2, 6),
      name: name || '', pronoun: outfit === 'dress' ? 'she' : pick(['he', 'she']),
      skin: pick(SKINS), hairStyle: pick(HAIR_STYLES)[0], hairColor: pick(HAIR_COLORS),
      outfit, outfitColor: pick(OUTFIT_COLORS), pantsColor: pick(PANTS_COLORS),
      accessory: Math.random() < .5 ? 'none' : pick(ACCESSORIES)[0]
    };
  }

  return { SKINS, HAIR_COLORS, OUTFIT_COLORS, PANTS_COLORS, HAIR_STYLES, OUTFITS, ACCESSORIES, MOODS, PRESETS, svg, random, shade };
})();
