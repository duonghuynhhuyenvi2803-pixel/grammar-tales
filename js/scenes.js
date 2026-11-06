/* Grammar Tales — animated scene backgrounds (SVG 1000x560, ground ~ y 440) */
const SCENES = (() => {
  const wrap = (inner, defs = '') =>
    `<svg viewBox="0 0 1000 560" preserveAspectRatio="xMidYMax slice" class="scene-svg" xmlns="http://www.w3.org/2000/svg"><defs>${defs}</defs>${inner}</svg>`;

  const cloud = (x, y, s, cls = 'drift', op = 1) =>
    `<g class="${cls}" style="--d:${30 + (x % 7) * 4}s"><g transform="translate(${x} ${y}) scale(${s})" opacity="${op}">
      <ellipse cx="0" cy="0" rx="46" ry="24" fill="#fff"/><ellipse cx="38" cy="-12" rx="34" ry="26" fill="#fff"/>
      <ellipse cx="74" cy="2" rx="38" ry="22" fill="#fff"/></g></g>`;

  const sky = (id, top, bottom) =>
    `<linearGradient id="${id}" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stop-color="${top}"/><stop offset="1" stop-color="${bottom}"/></linearGradient>`;

  const tree = (x, y, s) => `<g transform="translate(${x} ${y}) scale(${s})" class="sway">
    <rect x="-9" y="0" width="18" height="70" rx="6" fill="#8A5A3C"/>
    <circle cx="0" cy="-20" r="46" fill="#3BAA5C"/><circle cx="-34" cy="4" r="32" fill="#43B864"/><circle cx="34" cy="2" r="34" fill="#35A055"/>
    <circle cx="-12" cy="-40" r="12" fill="#6FD08A" opacity=".5"/></g>`;

  const kitchen = () => wrap(`
    <rect width="1000" height="560" fill="#FBE6CC"/>
    <g opacity=".35">${Array.from({ length: 12 }, (_, i) => `<line x1="${i * 90}" y1="0" x2="${i * 90}" y2="440" stroke="#F0CFA6" stroke-width="3"/>`).join('')}</g>
    <rect x="80" y="70" width="240" height="180" rx="14" fill="#BFE6FF" stroke="#8A5A3C" stroke-width="10"/>
    <rect x="195" y="70" width="10" height="180" fill="#8A5A3C"/><rect x="80" y="155" width="240" height="10" fill="#8A5A3C"/>
    <circle cx="280" cy="112" r="22" fill="#FFD84A" class="pulse"/>
    ${cloud(110, 110, .5, 'drift-sm')}
    <path d="M70 66 Q200 120 330 66 L330 52 L70 52 Z" fill="#FF7A59"/>
    <g transform="translate(520 80)"><circle r="44" fill="#fff" stroke="#2B2340" stroke-width="8"/>
      <line x1="0" y1="0" x2="0" y2="-28" stroke="#2B2340" stroke-width="6" stroke-linecap="round"/>
      <line x1="0" y1="0" x2="20" y2="8" stroke="#FF7A59" stroke-width="5" stroke-linecap="round" class="clock-hand"/></g>
    <rect x="640" y="150" width="300" height="12" rx="4" fill="#8A5A3C"/>
    <rect x="660" y="104" width="40" height="46" rx="8" fill="#FF7A59"/><rect x="716" y="94" width="44" height="56" rx="8" fill="#2EC4B6"/>
    <rect x="776" y="110" width="36" height="40" rx="8" fill="#FFC94A"/><rect x="830" y="98" width="46" height="52" rx="8" fill="#7B5CF0"/>
    <rect x="0" y="330" width="1000" height="22" fill="#E9D2B0"/>
    <rect x="0" y="352" width="1000" height="88" fill="#C98B5A"/>
    ${Array.from({ length: 6 }, (_, i) => `<rect x="${20 + i * 170}" y="368" width="140" height="56" rx="8" fill="#B87A4B"/><circle cx="${90 + i * 170}" cy="380" r="5" fill="#F4E1C1"/>`).join('')}
    <g transform="translate(150 300)"><path d="M0 30 Q-4 0 26 0 L74 0 Q104 0 100 30 Z" fill="#3D3D46"/><rect x="40" y="-8" width="20" height="10" rx="3" fill="#3D3D46"/>
      <path class="steam" d="M40 -16 Q30 -36 44 -52 M60 -16 Q50 -40 64 -60" stroke="#fff" stroke-width="5" fill="none" stroke-linecap="round" opacity=".8"/></g>
    <rect x="0" y="440" width="1000" height="120" fill="#F2E3CB"/>
    ${Array.from({ length: 13 }, (_, i) => `<rect x="${i * 80 + (i % 2) * 0}" y="440" width="40" height="120" fill="#E6D2B3"/>`).join('')}
  `);

  const park = () => wrap(`
    <rect width="1000" height="560" fill="url(#skyPark)"/>
    <circle cx="840" cy="100" r="54" fill="#FFD84A" class="pulse"/><circle cx="840" cy="100" r="80" fill="#FFD84A" opacity=".2" class="pulse"/>
    ${cloud(80, 90, 1)}${cloud(420, 60, .8)}${cloud(650, 140, .6)}
    <path d="M0 360 Q200 260 420 340 Q640 260 1000 330 L1000 560 L0 560 Z" fill="#8FD694"/>
    <path d="M0 400 Q300 340 600 400 Q800 360 1000 390 L1000 560 L0 560 Z" fill="#6CC47A"/>
    <ellipse cx="760" cy="430" rx="190" ry="36" fill="#6EC6F0"/><ellipse cx="760" cy="424" rx="150" ry="20" fill="#9EDCF7" class="shimmer"/>
    <g class="bob"><g transform="translate(700 412)"><ellipse rx="14" ry="9" fill="#FFF"/><circle cx="10" cy="-9" r="7" fill="#fff"/><path d="M16 -9 l8 2 l-8 2z" fill="#FFB020"/></g></g>
    <g class="bob" style="animation-delay:-1s"><g transform="translate(800 420)"><ellipse rx="12" ry="8" fill="#FFF"/><circle cx="9" cy="-8" r="6" fill="#fff"/><path d="M14 -8 l7 2 l-7 2z" fill="#FFB020"/></g></g>
    ${tree(110, 300, 1.1)}${tree(300, 320, .8)}${tree(950, 300, 1)}
    <g transform="translate(430 372)"><rect x="0" y="0" width="150" height="12" rx="4" fill="#B5452B"/><rect x="0" y="-26" width="150" height="10" rx="4" fill="#B5452B"/>
      <rect x="10" y="12" width="10" height="30" fill="#3D3D46"/><rect x="130" y="12" width="10" height="30" fill="#3D3D46"/></g>
    <rect x="0" y="440" width="1000" height="120" fill="#5DB56C"/>
    <path d="M0 470 Q500 440 1000 480 L1000 520 Q500 480 0 510 Z" fill="#E9D7B0"/>
  `, sky('skyPark', '#7EC8F5', '#D4F0FF'));

  const classroom = () => wrap(`
    <rect width="1000" height="560" fill="#E8F1E4"/>
    <rect x="0" y="0" width="1000" height="40" fill="#D4E4CF"/>
    <rect x="200" y="70" width="460" height="250" rx="10" fill="#8A5A3C"/>
    <rect x="214" y="84" width="432" height="222" rx="6" fill="#2F5D50"/>
    <text x="236" y="128" font-family="Baloo 2, cursive" font-size="30" fill="#F4F1EA" opacity=".9">Yesterday...</text>
    <text x="236" y="172" font-family="Baloo 2, cursive" font-size="24" fill="#FFC94A" opacity=".85">go → went · take → took</text>
    <text x="236" y="210" font-family="Baloo 2, cursive" font-size="24" fill="#9EDCF7" opacity=".85">look → looked</text>
    <path d="M500 250 q20 -14 40 0 t40 0" stroke="#F4F1EA" stroke-width="3" fill="none" opacity=".6"/>
    <rect x="260" y="306" width="60" height="8" rx="3" fill="#F4F1EA"/>
    <rect x="740" y="70" width="200" height="200" rx="10" fill="#BFE6FF" stroke="#F4F1EA" stroke-width="12"/>
    <rect x="834" y="70" width="12" height="200" fill="#F4F1EA"/>
    ${tree(800, 220, .5)}
    ${cloud(760, 110, .45, 'drift-sm')}
    <g transform="translate(110 100)"><circle r="40" fill="#fff" stroke="#2B2340" stroke-width="7"/>
      <line x1="0" y1="0" x2="0" y2="-26" stroke="#2B2340" stroke-width="5" stroke-linecap="round"/>
      <line x1="0" y1="0" x2="18" y2="6" stroke="#FF7A59" stroke-width="4" stroke-linecap="round" class="clock-hand"/></g>
    <g transform="translate(60 230)"><rect width="90" height="120" rx="6" fill="#B87A4B"/>
      <rect x="8" y="10" width="14" height="40" fill="#FF7A59"/><rect x="24" y="16" width="12" height="34" fill="#4C8DF6"/><rect x="38" y="8" width="16" height="42" fill="#FFC94A"/>
      <rect x="0" y="54" width="90" height="6" fill="#8A5A3C"/>
      <rect x="10" y="68" width="16" height="40" fill="#2EC4B6"/><rect x="30" y="74" width="14" height="34" fill="#E0628F"/></g>
    <rect x="0" y="440" width="1000" height="120" fill="#D9A877"/>
    ${Array.from({ length: 10 }, (_, i) => `<line x1="${i * 110}" y1="440" x2="${i * 110 - 40}" y2="560" stroke="#C4915F" stroke-width="4"/>`).join('')}
    <g transform="translate(700 380)"><rect width="180" height="14" rx="4" fill="#B87A4B"/><rect x="10" y="14" width="10" height="46" fill="#8A5A3C"/><rect x="160" y="14" width="10" height="46" fill="#8A5A3C"/></g>
  `);

  const beach = () => wrap(`
    <rect width="1000" height="560" fill="url(#skyBeach)"/>
    <circle cx="160" cy="120" r="60" fill="#FFE27A" class="pulse"/>
    ${cloud(380, 80, .8)}${cloud(700, 120, .6)}
    <rect x="0" y="300" width="1000" height="160" fill="#2BA6D9"/>
    <path class="wave" d="M-100 320 Q-50 308 0 320 T100 320 T200 320 T300 320 T400 320 T500 320 T600 320 T700 320 T800 320 T900 320 T1000 320 T1100 320 L1100 340 L-100 340 Z" fill="#5CC4EC"/>
    <path class="wave wave2" d="M-100 370 Q-50 356 0 370 T100 370 T200 370 T300 370 T400 370 T500 370 T600 370 T700 370 T800 370 T900 370 T1000 370 T1100 370 L1100 390 L-100 390 Z" fill="#7DD3F2" opacity=".8"/>
    <g class="bob"><g transform="translate(560 330)"><path d="M-30 0 L30 0 L20 12 L-20 12 Z" fill="#fff"/><path d="M0 0 L0 -50 L26 -6 Z" fill="#FF7A59"/></g></g>
    <path d="M0 420 Q250 395 500 420 Q750 445 1000 415 L1000 560 L0 560 Z" fill="#F5D99C"/>
    <rect x="0" y="440" width="1000" height="120" fill="#F2D08C"/>
    <g transform="translate(880 440)" class="sway"><path d="M0 0 Q-10 -120 10 -230" stroke="#8A5A3C" stroke-width="18" fill="none" stroke-linecap="round"/>
      <g transform="translate(10 -230)"><path d="M0 0 Q-60 -30 -110 10 Q-60 -10 0 0" fill="#3BAA5C"/><path d="M0 0 Q60 -40 110 0 Q60 -14 0 0" fill="#35A055"/>
      <path d="M0 0 Q-30 -60 -70 -70 Q-30 -40 0 0" fill="#43B864"/><path d="M0 0 Q40 -60 80 -60 Q40 -36 0 0" fill="#43B864"/><circle cx="-6" cy="8" r="9" fill="#8A5A3C"/><circle cx="8" cy="10" r="8" fill="#7A4A2C"/></g></g>
    <g transform="translate(120 440)"><path d="M0 0 L0 -130" stroke="#F4F1EA" stroke-width="6"/><path d="M-90 -120 Q0 -190 90 -120 Z" fill="#FF5C8A"/><path d="M-30 -120 Q0 -190 30 -120 Z" fill="#FFC94A"/></g>
    <path d="M300 500 q8 -8 16 0 q8 -8 16 0" stroke="#E0B86C" stroke-width="3" fill="none"/>
  `, sky('skyBeach', '#5EC2F2', '#BDEBFF'));

  const street = () => wrap(`
    <rect width="1000" height="560" fill="url(#skyStreet)"/>
    ${cloud(100, 80, .9)}${cloud(500, 50, .7)}${cloud(780, 110, .8)}
    <g fill="#8C9BB8">
      <rect x="30" y="150" width="130" height="290"/><rect x="180" y="100" width="110" height="340"/>
      <rect x="560" y="130" width="120" height="310"/><rect x="700" y="180" width="140" height="260"/><rect x="860" y="120" width="120" height="320"/></g>
    <g fill="#FFE9A8">${Array.from({ length: 40 }, (_, i) => {
      const cols = [[50, 150], [200, 100], [580, 130], [720, 180], [880, 120]][i % 5];
      const r = Math.floor(i / 5); return `<rect x="${cols[0] + (r % 2) * 46}" y="${cols[1] + 24 + Math.floor(r / 2) * 56}" width="28" height="34" rx="3" opacity="${(i * 37) % 3 ? .9 : .4}"/>`;
    }).join('')}</g>
    <g transform="translate(320 220)"><rect width="220" height="220" fill="#FFB38A"/><rect x="0" y="-26" width="220" height="30" fill="#FF7A59"/>
      <path d="M0 4 L220 4 L210 40 L10 40 Z" fill="#F4F1EA"/>${Array.from({ length: 5 }, (_, i) => `<path d="M${10 + i * 40} 4 L${50 + i * 40} 4 L${50 + i * 40} 40 L${10 + i * 40} 40 Z" fill="#FF7A59" opacity="${i % 2}"/>`).join('')}
      <text x="110" y="-4" text-anchor="middle" font-family="Baloo 2, cursive" font-size="22" fill="#fff">CAFÉ</text>
      <rect x="24" y="70" width="70" height="80" rx="4" fill="#BFE6FF"/><rect x="128" y="80" width="64" height="140" rx="4" fill="#8A5A3C"/></g>
    <g transform="translate(620 440)"><rect x="-5" y="-200" width="10" height="200" fill="#3D3D46"/><rect x="-24" y="-214" width="48" height="20" rx="8" fill="#3D3D46"/><circle cy="-192" r="10" fill="#FFE27A" class="pulse"/></g>
    <rect x="0" y="440" width="1000" height="40" fill="#C9C3B6"/>
    <rect x="0" y="480" width="1000" height="80" fill="#55525E"/>
    ${Array.from({ length: 8 }, (_, i) => `<rect x="${i * 140 + 20}" y="516" width="70" height="8" rx="3" fill="#F4F1EA"/>`).join('')}
  `, sky('skyStreet', '#9DB4D9', '#E6EEF8'));

  const museum = () => wrap(`
    <rect width="1000" height="560" fill="#7A2E3A"/>
    <rect x="0" y="0" width="1000" height="60" fill="#5E2230"/>
    <rect x="0" y="400" width="1000" height="40" fill="#5E2230"/>
    ${[60, 900].map(x => `<g transform="translate(${x} 60)"><rect x="0" y="0" width="50" height="340" fill="#F4ECDD"/>
      ${[8, 20, 32].map(f => `<rect x="${f}" y="10" width="6" height="320" fill="#E3D6BF"/>`).join('')}
      <rect x="-10" y="0" width="70" height="20" fill="#E3D6BF"/><rect x="-10" y="320" width="70" height="20" fill="#E3D6BF"/></g>`).join('')}
    <g transform="translate(170 110)"><rect width="170" height="130" fill="#D9A54E"/><rect x="12" y="12" width="146" height="106" fill="#9EDCF7"/>
      <path d="M12 118 L60 60 L96 96 L120 74 L158 118 Z" fill="#3BAA5C"/><circle cx="130" cy="40" r="12" fill="#FFE27A"/></g>
    <g transform="translate(660 100)"><rect width="150" height="170" fill="#D9A54E"/><rect x="12" y="12" width="126" height="146" fill="#2B2340"/>
      <circle cx="75" cy="70" r="30" fill="#FFC94A"/><path d="M40 158 Q75 110 110 158 Z" fill="#7B5CF0"/></g>
    <g transform="translate(470 250)">
      <path d="M-40 -170 L40 -170 L120 190 L-120 190 Z" fill="#FFF6D6" opacity=".14" class="flicker"/>
      <rect x="-40" y="40" width="80" height="150" fill="#F4ECDD"/><rect x="-50" y="30" width="100" height="16" fill="#E3D6BF"/>
      <text x="0" y="110" text-anchor="middle" font-family="Baloo 2, cursive" font-size="40" fill="#B5452B">?</text>
      <path d="M-30 30 L-24 0 M30 30 L24 0" stroke="#B5452B" stroke-width="3" stroke-dasharray="4 4"/></g>
    <rect x="300" y="380" width="340" height="8" fill="#D9A54E" rx="4"/>
    ${[310, 630].map(x => `<rect x="${x}" y="380" width="8" height="60" fill="#D9A54E"/>`).join('')}
    <rect x="0" y="440" width="1000" height="120" fill="#C9B79C"/>
    ${Array.from({ length: 11 }, (_, i) => `<rect x="${i * 100}" y="440" width="50" height="60" fill="#B9A586"/><rect x="${i * 100 + 50}" y="500" width="50" height="60" fill="#B9A586"/>`).join('')}
    <g transform="translate(560 456)" opacity=".7"><ellipse rx="7" ry="5" fill="#5E2230"/><ellipse cx="22" cy="10" rx="7" ry="5" fill="#5E2230"/><ellipse cx="44" cy="2" rx="7" ry="5" fill="#5E2230"/></g>
  `);


  const house = (x, y, w, h, wall, roof, door = '#8A5A3C') => `<g transform="translate(${x} ${y})">
    <rect x="0" y="${h * .35}" width="${w}" height="${h * .65}" fill="${wall}" stroke="#2B2340" stroke-width="3"/>
    <path d="M-12 ${h * .37} L${w / 2} 0 L${w + 12} ${h * .37} Z" fill="${roof}" stroke="#2B2340" stroke-width="3" stroke-linejoin="round"/>
    <rect x="${w * .4}" y="${h * .62}" width="${w * .2}" height="${h * .38}" fill="${door}"/>
    <rect x="${w * .1}" y="${h * .5}" width="${w * .2}" height="${h * .18}" fill="#BFE6FF" stroke="#2B2340" stroke-width="2"/>
    <rect x="${w * .7}" y="${h * .5}" width="${w * .2}" height="${h * .18}" fill="#FFE9A8" stroke="#2B2340" stroke-width="2"/></g>`;

  const neighborhood = () => wrap(`
    <rect width="1000" height="560" fill="url(#skyHood)"/>
    <circle cx="880" cy="90" r="46" fill="#FFD84A" class="pulse"/>
    ${cloud(120, 80, .8)}${cloud(520, 60, .6)}
    <rect x="0" y="300" width="1000" height="140" fill="#9ED98A"/>
    ${house(40, 210, 170, 200, '#FFB38A', '#B5452B')}
    ${house(300, 230, 150, 180, '#BFE6FF', '#4C8DF6')}
    ${house(560, 200, 180, 210, '#FFE9A8', '#3BAA5C')}
    ${house(820, 230, 140, 180, '#F4C3D6', '#7B5CF0')}
    ${tree(250, 330, .6)}${tree(500, 340, .55)}${tree(780, 330, .6)}
    ${Array.from({ length: 25 }, (_, i) => `<rect x="${i * 40}" y="410" width="8" height="30" fill="#F4F1EA" stroke="#C9B79C"/>`).join('')}
    <rect x="0" y="416" width="1000" height="6" fill="#F4F1EA"/>
    <rect x="0" y="440" width="1000" height="120" fill="#D9D3C4"/>
    ${Array.from({ length: 12 }, (_, i) => `<line x1="${i * 90}" y1="440" x2="${i * 90}" y2="560" stroke="#C4BCAA" stroke-width="3"/>`).join('')}
  `, sky('skyHood', '#86CDF5', '#DDF3FF'));

  const restaurant = () => wrap(`
    <rect width="1000" height="560" fill="#2F5D50"/>
    <g opacity=".18">${Array.from({ length: 14 }, (_, i) => `<path d="M${i * 80} 0 q20 40 0 80 q-20 40 0 80 q20 40 0 80 q-20 40 0 80 q20 40 0 80" stroke="#F4F1EA" stroke-width="3" fill="none"/>`).join('')}</g>
    <rect x="0" y="0" width="1000" height="34" fill="#244A40"/>
    ${[160, 500, 840].map(x => `<g transform="translate(${x} 34)"><line x1="0" y1="0" x2="0" y2="60" stroke="#2B2340" stroke-width="3"/>
      <path d="M-34 60 L34 60 L22 92 L-22 92 Z" fill="#FFC94A" stroke="#2B2340" stroke-width="3"/><ellipse cx="0" cy="100" rx="60" ry="14" fill="#FFE27A" opacity=".25" class="pulse"/></g>`).join('')}
    <g transform="translate(330 120)"><rect width="340" height="150" rx="10" fill="#F4F1EA" stroke="#8A5A3C" stroke-width="10"/>
      <text x="170" y="48" text-anchor="middle" font-family="Baloo 2, cursive" font-size="34" fill="#2F5D50">Green Garden</text>
      <text x="170" y="84" text-anchor="middle" font-family="Baloo 2, cursive" font-size="20" fill="#B5452B">Today: Beef steak · Soup</text>
      <path d="M110 110 q60 -20 120 0" stroke="#3BAA5C" stroke-width="6" fill="none"/><circle cx="170" cy="118" r="8" fill="#FF7A59"/></g>
    <g transform="translate(60 120)"><rect width="170" height="200" rx="8" fill="#BFE6FF" stroke="#F4F1EA" stroke-width="10"/>
      <rect x="80" y="0" width="10" height="200" fill="#F4F1EA"/><circle cx="130" cy="50" r="14" fill="#F4F1EA" opacity=".9"/></g>
    <g transform="translate(790 160)"><path d="M0 120 Q-10 40 30 0 Q70 40 60 120 Z" fill="#3BAA5C"/><rect x="10" y="118" width="40" height="40" rx="6" fill="#B5452B"/></g>
    <rect x="0" y="330" width="1000" height="110" fill="#8A5A3C"/>
    <rect x="0" y="330" width="1000" height="10" fill="#6B4329"/>
    <g transform="translate(420 300)"><rect width="160" height="14" rx="4" fill="#F4F1EA"/><path d="M10 14 L150 14 L140 60 L20 60 Z" fill="#FFFFFF" opacity=".85"/>
      <rect x="30" y="-18" width="12" height="18" rx="3" fill="#FF7A59"/><rect x="118" y="-22" width="12" height="22" rx="3" fill="#FFC94A"/><ellipse cx="80" cy="-4" rx="26" ry="7" fill="#fff" stroke="#C9B79C"/></g>
    <rect x="0" y="440" width="1000" height="120" fill="#B87A4B"/>
    ${Array.from({ length: 10 }, (_, i) => `<line x1="${i * 110}" y1="440" x2="${i * 110 - 50}" y2="560" stroke="#A56A3D" stroke-width="4"/>`).join('')}
  `);

  const MAP = { kitchen, park, classroom, beach, street, museum, neighborhood, restaurant };
  return { get: name => (MAP[name] || park)(), names: Object.keys(MAP) };
})();
