/* Grammar Tales — stories
   Line: { who: 'A'|'B'|'C'|'N', mood, act, t }
   - who 'N' = narrator
   - act: 'jump' | 'shake' | 'wave' | 'nod'
   - t: text. [[words::ghi chú]] = highlighted grammar with a Vietnamese note; [[words]] = highlight only.
   - Name templates: {A} {A.he} {A.He} {A.his} {A.His} {A.him} (same for B, C)
*/
const STORIES = [
  {
    id: 'present-simple',
    title: 'The Friday Alarm',
    grammar: 'Present Simple',
    grammarVi: 'Thì hiện tại đơn',
    level: 'A1',
    emoji: '⏰',
    scene: 'kitchen',
    color: '#FF7A59',
    roles: [
      { key: 'A', label: 'Người hay ngủ quên' },
      { key: 'B', label: 'Người làm bữa sáng' }
    ],
    lines: [
      { who: 'N', t: 'It is 7 a.m. {A} [[wakes up::Chủ ngữ ngôi 3 số ít (he/she/it) → động từ thêm -s/-es]] late again.' },
      { who: 'A', mood: 'surprised', act: 'shake', t: 'Oh no! I [[always::Trạng từ tần suất đứng TRƯỚC động từ thường]] [[get up::I/you/we/they → động từ giữ nguyên mẫu]] at six!' },
      { who: 'B', mood: 'neutral', t: 'Not on Fridays. You [[don\'t hear::Phủ định: don\'t + V nguyên mẫu]] your alarm on Fridays.' },
      { who: 'A', mood: 'thinking', t: '[[Do::Câu hỏi: Do/Does + S + V nguyên mẫu?]] I really [[sleep]] that much?' },
      { who: 'B', mood: 'happy', t: 'Yes! Every Thursday night, you [[stay up]] late and [[watch]] movies.' },
      { who: 'N', t: '{B} [[makes::make → makes]] breakfast. {B.He} [[usually]] [[cooks]] eggs, but today {B.he} [[has::have → has (với he/she/it)]] no time.' },
      { who: 'A', mood: 'excited', act: 'jump', t: 'Toast! I [[love]] toast.' },
      { who: 'B', mood: 'neutral', act: 'nod', t: 'The bus [[leaves::Lịch trình cố định (tàu xe, giờ học) cũng dùng hiện tại đơn]] at 7:20. Hurry!' },
      { who: 'A', mood: 'surprised', t: 'Wait, [[does]] the bus [[stop::Sau does → V nguyên mẫu, KHÔNG thêm -s]] near the bakery?' },
      { who: 'B', mood: 'happy', act: 'wave', t: 'Yes, it [[does::Trả lời ngắn: Yes, it does. / No, it doesn\'t.]]. Now go!' },
      { who: 'N', t: '{A} [[runs]] out the door. {A.He} [[never::never = không bao giờ, dùng với câu khẳng định]] [[misses]] the bus... well, almost never.' }
    ],
    rule: {
      forms: [
        ['(+)', 'S + V / V-s, V-es', 'She <b>wakes</b> up at six.'],
        ['(−)', 'S + don\'t / doesn\'t + V', 'You <b>don\'t hear</b> your alarm.'],
        ['(?)', 'Do / Does + S + V?', '<b>Does</b> the bus <b>stop</b> here?']
      ],
      use: ['Thói quen, hành động lặp lại (every day, always, usually, never)', 'Sự thật, điều hiển nhiên', 'Lịch trình cố định: tàu xe, giờ học'],
      tip: 'He / She / It + V-s/es: watch → watch<b>es</b>, go → go<b>es</b>, study → stud<b>ies</b>, have → <b>has</b>.'
    },
    quiz: [
      { q: '{A} ___ up at six every day.', o: ['get', 'gets', 'getting', 'is get'], a: 1, e: '{A} là ngôi 3 số ít → gets.' },
      { q: '___ your brother like toast?', o: ['Do', 'Does', 'Is', 'Are'], a: 1, e: 'Chủ ngữ "your brother" (he) → Does + V nguyên mẫu.' },
      { q: 'The bus ___ at 7:20.', o: ['leave', 'leaves', 'is leave', 'leaving'], a: 1, e: 'Lịch trình cố định → hiện tại đơn, the bus (it) → leaves.' },
      { q: 'I ___ coffee. I prefer tea.', o: ['don\'t drink', 'doesn\'t drink', 'not drink', 'no drink'], a: 0, e: 'I → don\'t + V nguyên mẫu.' }
    ]
  },

  {
    id: 'present-continuous',
    title: 'The Park Detective',
    grammar: 'Present Continuous',
    grammarVi: 'Thì hiện tại tiếp diễn',
    level: 'A1',
    emoji: '🔍',
    scene: 'park',
    color: '#3BAA5C',
    roles: [
      { key: 'A', label: 'Thám tử công viên' },
      { key: 'B', label: 'Người bạn ghé chơi' }
    ],
    lines: [
      { who: 'N', t: 'Sunday afternoon in the park. {A} [[is sitting::am/is/are + V-ing: hành động ĐANG diễn ra]] on a bench.' },
      { who: 'B', mood: 'happy', act: 'wave', t: 'Hi {A}! What [[are]] you [[doing::Câu hỏi: What + am/is/are + S + V-ing?]]?' },
      { who: 'A', mood: 'happy', t: '[[I\'m playing::I am → I\'m (viết tắt khi nói)]] a game. I call it "Park Detective".' },
      { who: 'A', mood: 'excited', act: 'jump', t: 'Look! That man [[is running::run → running (gấp đôi phụ âm cuối)]] after his hat.' },
      { who: 'B', mood: 'surprised', act: 'shake', t: 'And the wind [[is blowing]] it into the lake!' },
      { who: 'A', mood: 'thinking', t: 'What [[is]] that girl [[doing]]?' },
      { who: 'B', mood: 'neutral', t: '[[She\'s feeding::She is → She\'s]] the ducks. But they [[aren\'t eating::Phủ định: am not / isn\'t / aren\'t + V-ing]] her bread.' },
      { who: 'A', mood: 'happy', t: 'Ha! The ducks [[are swimming::swim → swimming]] away from her.' },
      { who: 'B', mood: 'thinking', t: 'Wait... why [[are]] you [[writing::write → writing (bỏ -e)]] everything down?' },
      { who: 'A', mood: 'excited', act: 'jump', t: 'Because [[I\'m making]] a comic! And right now, YOU [[are standing]] in it.' },
      { who: 'B', mood: 'happy', act: 'wave', t: 'Then draw me nicely, please!' },
      { who: 'N', t: 'At the moment, the sun [[is setting::at the moment / right now / now → dấu hiệu tiếp diễn]] and everyone [[is having]] a great time.' }
    ],
    rule: {
      forms: [
        ['(+)', 'S + am / is / are + V-ing', 'The man <b>is running</b>.'],
        ['(−)', 'S + am / is / are + not + V-ing', 'They <b>aren\'t eating</b> the bread.'],
        ['(?)', 'Am / Is / Are + S + V-ing?', 'What <b>are</b> you <b>doing</b>?']
      ],
      use: ['Hành động đang xảy ra ngay lúc nói (now, right now, at the moment)', 'Sau câu mệnh lệnh gây chú ý: Look! Listen!', 'Việc tạm thời trong giai đoạn này'],
      tip: 'Chính tả V-ing: write → writ<b>ing</b>, run → run<b>ning</b>, lie → l<b>ying</b>. Động từ chỉ trạng thái (like, know, want) thường KHÔNG dùng V-ing.'
    },
    quiz: [
      { q: 'Look! The man ___ after his hat.', o: ['runs', 'is running', 'run', 'running'], a: 1, e: '"Look!" → hành động đang xảy ra → is running.' },
      { q: 'What ___ you doing?', o: ['do', 'are', 'is', 'does'], a: 1, e: 'you → are + V-ing.' },
      { q: 'The ducks ___ eating the bread.', o: ['isn\'t', 'aren\'t', 'don\'t', 'not'], a: 1, e: 'The ducks (số nhiều) → aren\'t + V-ing.' },
      { q: '{A} is ___ a comic.', o: ['makeing', 'makking', 'making', 'makes'], a: 2, e: 'make → bỏ -e → making.' }
    ]
  },

  {
    id: 'past-simple',
    title: 'The Lost Backpack',
    grammar: 'Past Simple',
    grammarVi: 'Thì quá khứ đơn',
    level: 'A2',
    emoji: '🎒',
    scene: 'classroom',
    color: '#4C8DF6',
    roles: [
      { key: 'A', label: 'Người làm mất cặp' },
      { key: 'B', label: 'Người bạn giúp tìm' }
    ],
    lines: [
      { who: 'N', t: 'Yesterday, {A} [[lost::lose → lost (động từ bất quy tắc)]] {A.his} backpack at school.' },
      { who: 'A', mood: 'sad', t: 'I [[looked::look → looked (có quy tắc: thêm -ed)]] everywhere, but I [[didn\'t find::Phủ định: didn\'t + V nguyên mẫu]] it.' },
      { who: 'B', mood: 'thinking', t: 'Okay, let\'s think. Where [[did]] you [[go::Câu hỏi: (Wh-) + did + S + V nguyên mẫu?]] after lunch?' },
      { who: 'A', mood: 'thinking', t: 'I [[went::go → went]] to the library. Then I [[played]] football with Tom.' },
      { who: 'B', mood: 'neutral', t: '[[Did]] you [[take]] your bag to the football field?' },
      { who: 'A', mood: 'surprised', act: 'shake', t: 'No, I [[didn\'t::Trả lời ngắn: Yes, I did. / No, I didn\'t.]]. I [[left::leave → left]] it... somewhere.' },
      { who: 'B', mood: 'neutral', t: 'What [[did]] you [[have]] in it?' },
      { who: 'A', mood: 'sad', t: 'My homework! I [[finished]] it last night. It [[took::take → took]] three hours!' },
      { who: 'N', t: 'They [[walked]] to the library. The librarian [[smiled]] and [[pointed::point → pointed]] at a table.' },
      { who: 'B', mood: 'excited', act: 'jump', t: 'There it is! You [[forgot::forget → forgot]] it under the table.' },
      { who: 'A', mood: 'excited', act: 'jump', t: 'Yes! Thank you! I [[was::am/is → was; are → were]] so worried.' }
    ],
    rule: {
      forms: [
        ['(+)', 'S + V2 / V-ed', 'I <b>went</b> to the library.'],
        ['(−)', 'S + didn\'t + V', 'I <b>didn\'t find</b> it.'],
        ['(?)', 'Did + S + V?', '<b>Did</b> you <b>take</b> your bag?']
      ],
      use: ['Hành động đã xảy ra và kết thúc trong quá khứ', 'Dấu hiệu: yesterday, last night, ago, in 2020', 'Kể chuỗi sự việc nối tiếp nhau'],
      tip: 'Có quy tắc: look → look<b>ed</b>, stop → stop<b>ped</b>, study → stud<b>ied</b>. Bất quy tắc: go → <b>went</b>, take → <b>took</b>, leave → <b>left</b>, forget → <b>forgot</b>.'
    },
    quiz: [
      { q: 'I ___ to the library after lunch.', o: ['go', 'goed', 'went', 'gone'], a: 2, e: 'go là bất quy tắc: go → went.' },
      { q: '___ you take your bag?', o: ['Do', 'Did', 'Were', 'Was'], a: 1, e: 'Câu hỏi quá khứ với động từ thường → Did + S + V.' },
      { q: 'I didn\'t ___ it anywhere.', o: ['found', 'finding', 'find', 'finds'], a: 2, e: 'Sau didn\'t → V nguyên mẫu.' },
      { q: 'The homework ___ three hours.', o: ['takes', 'took', 'taked', 'taken'], a: 1, e: 'Chuyện tối qua → quá khứ: take → took.' }
    ]
  },

  {
    id: 'present-perfect',
    title: 'Have You Ever Surfed?',
    grammar: 'Present Perfect',
    grammarVi: 'Thì hiện tại hoàn thành',
    level: 'B1',
    emoji: '🏄',
    scene: 'beach',
    color: '#2EC4B6',
    roles: [
      { key: 'A', label: 'Người lướt sóng giỏi' },
      { key: 'B', label: 'Người lần đầu thử' }
    ],
    lines: [
      { who: 'N', t: '{A} and {B} are on holiday. {B} [[has never been::have/has + V3: kinh nghiệm tính đến nay. never = chưa từng]] to this beach before.' },
      { who: 'A', mood: 'happy', act: 'wave', t: '[[Have]] you ever [[tried::Have you ever + V3? = Bạn đã từng... chưa?]] surfing?' },
      { who: 'B', mood: 'thinking', t: 'No, I [[haven\'t]]. But I [[have seen::see → seen (V3)]] a lot of surfing videos!' },
      { who: 'A', mood: 'happy', t: 'I [[went::Có thời điểm cụ thể (last summer) → dùng QUÁ KHỨ ĐƠN, không dùng hiện tại hoàn thành]] surfing last summer. I [[fell]] off the board twenty times.' },
      { who: 'B', mood: 'surprised', act: 'shake', t: 'Twenty times?! [[Have]] you [[improved::Kết quả còn liên quan đến hiện tại]] since then?' },
      { who: 'A', mood: 'excited', act: 'jump', t: 'A lot! [[I\'ve practised::I have → I\'ve]] every weekend [[since::since + mốc thời gian; for + khoảng thời gian]] June.' },
      { who: 'B', mood: 'neutral', act: 'nod', t: 'Okay... [[I\'ve just decided::just = vừa mới, đứng giữa have và V3]]. I want to try!' },
      { who: 'N', t: 'Thirty minutes later...' },
      { who: 'B', mood: 'sad', act: 'shake', t: '[[I\'ve already fallen::already = đã... rồi (sớm hơn mong đợi)]] off five times!' },
      { who: 'A', mood: 'happy', t: 'That\'s fine! You [[haven\'t given up::give up → given up. Phủ định: haven\'t / hasn\'t + V3]] [[yet::yet: dùng trong câu phủ định / câu hỏi, đứng cuối câu]]. That\'s what matters.' },
      { who: 'B', mood: 'excited', act: 'jump', t: 'Look! I\'m standing! This is the best day I [[have ever had::So sánh nhất + S + have ever + V3]]!' }
    ],
    rule: {
      forms: [
        ['(+)', 'S + have / has + V3', 'I <b>have seen</b> many videos.'],
        ['(−)', 'S + haven\'t / hasn\'t + V3', 'You <b>haven\'t given up</b> yet.'],
        ['(?)', 'Have / Has + S + V3?', '<b>Have</b> you ever <b>tried</b> surfing?']
      ],
      use: ['Kinh nghiệm tính đến hiện tại (ever, never)', 'Việc vừa xảy ra, kết quả còn ở hiện tại (just, already, yet)', 'Việc bắt đầu trong quá khứ, kéo dài đến nay (for, since)'],
      tip: 'Có thời điểm cụ thể (yesterday, last summer, in 2019) → dùng <b>quá khứ đơn</b>, không dùng hiện tại hoàn thành.'
    },
    quiz: [
      { q: 'I ___ surfing last summer.', o: ['have gone', 'went', 'have went', 'go'], a: 1, e: '"last summer" là thời điểm cụ thể → quá khứ đơn: went.' },
      { q: 'Have you ever ___ sushi?', o: ['eat', 'ate', 'eaten', 'eating'], a: 2, e: 'Have + V3: eat → eaten.' },
      { q: '{B} ___ finished the lesson yet.', o: ['hasn\'t', 'didn\'t', 'haven\'t', 'isn\'t'], a: 0, e: '"yet" + ngôi 3 số ít → hasn\'t + V3.' },
      { q: 'This is the best day I have ever ___.', o: ['have', 'had', 'having', 'has'], a: 1, e: 'have ever + V3: have → had.' }
    ]
  },

  {
    id: 'first-conditional',
    title: 'If It Rains Tomorrow',
    grammar: 'First Conditional',
    grammarVi: 'Câu điều kiện loại 1',
    level: 'B1',
    emoji: '☔',
    scene: 'street',
    color: '#7B5CF0',
    roles: [
      { key: 'A', label: 'Người lên kế hoạch' },
      { key: 'B', label: 'Người hay lo lắng' }
    ],
    lines: [
      { who: 'N', t: '{A} and {B} are planning a picnic for tomorrow.' },
      { who: 'A', mood: 'happy', t: '[[If the weather is nice::If + hiện tại đơn: điều kiện CÓ THỂ xảy ra]], [[we\'ll go::will + V nguyên mẫu: kết quả]] to the lake.' },
      { who: 'B', mood: 'thinking', t: 'But the forecast says it might rain.' },
      { who: 'A', mood: 'neutral', act: 'nod', t: '[[If it rains::KHÔNG nói "If it will rain"]], [[we\'ll watch]] a movie at my place.' },
      { who: 'B', mood: 'happy', t: 'Good plan! If we [[go]] to the lake, [[I\'ll bring]] sandwiches.' },
      { who: 'A', mood: 'excited', act: 'jump', t: '[[I\'ll make]] lemonade [[if you bring::Mệnh đề if đứng SAU → không cần dấu phẩy]] the speaker.' },
      { who: 'B', mood: 'thinking', t: 'What [[will]] we [[do]] if your sister [[wants::sister (she) → wants]] to come too?' },
      { who: 'A', mood: 'happy', t: 'She [[won\'t::will not → won\'t]] come [[unless::unless = if... not (trừ khi)]] there\'s chocolate cake.' },
      { who: 'B', mood: 'happy', act: 'wave', t: 'Then [[I\'ll buy]] one. Everyone [[will be]] happy!' },
      { who: 'N', t: 'The next morning, the sky is grey...' },
      { who: 'A', mood: 'sad', t: 'Oh no. It\'s raining.' },
      { who: 'B', mood: 'excited', act: 'jump', t: 'No problem! Movie day, just like we planned!' }
    ],
    rule: {
      forms: [
        ['If', 'If + S + V (hiện tại đơn), S + will / won\'t + V', '<b>If it rains</b>, <b>we\'ll watch</b> a movie.'],
        ['Đảo', 'S + will + V + if + S + V', '<b>I\'ll make</b> lemonade <b>if you bring</b> the speaker.'],
        ['Unless', 'Unless + S + V = If + S + don\'t/doesn\'t + V', 'She won\'t come <b>unless</b> there\'s cake.']
      ],
      use: ['Điều kiện có thể xảy ra ở hiện tại hoặc tương lai', 'Kết quả rất có thể xảy ra nếu điều kiện đúng', 'Dùng khi lên kế hoạch, hứa hẹn, cảnh báo'],
      tip: 'Mệnh đề <b>if</b> dùng hiện tại đơn, không dùng will. Mệnh đề if đứng đầu → có <b>dấu phẩy</b>.'
    },
    quiz: [
      { q: 'If it ___ tomorrow, we\'ll stay home.', o: ['will rain', 'rains', 'rained', 'rain'], a: 1, e: 'Mệnh đề if dùng hiện tại đơn: it → rains.' },
      { q: 'If you bring the speaker, I ___ lemonade.', o: ['make', 'made', 'will make', 'making'], a: 2, e: 'Mệnh đề chính: will + V.' },
      { q: 'She won\'t come ___ there\'s cake.', o: ['if', 'unless', 'when', 'so'], a: 1, e: 'unless = if... not: trừ khi có bánh.' },
      { q: 'What will we do if your sister ___ to come?', o: ['want', 'wants', 'will want', 'wanted'], a: 1, e: 'Mệnh đề if, chủ ngữ she → wants.' }
    ]
  },

  {
    id: 'passive',
    title: 'The Museum Mystery',
    grammar: 'Passive Voice',
    grammarVi: 'Câu bị động',
    level: 'B2',
    emoji: '🕵️',
    scene: 'museum',
    color: '#B5452B',
    roles: [
      { key: 'A', label: 'Thám tử' },
      { key: 'B', label: 'Trợ lý thám tử' },
      { key: 'C', label: 'Bảo vệ bảo tàng' }
    ],
    lines: [
      { who: 'N', t: 'The city museum, 9 a.m. Something precious [[has been stolen::Bị động hiện tại hoàn thành: has / have been + V3]]!' },
      { who: 'C', mood: 'sad', act: 'shake', t: 'Detective {A}! The golden cat statue [[was taken::Bị động quá khứ: was / were + V3]] last night!' },
      { who: 'A', mood: 'thinking', t: 'Interesting. When [[was]] it last [[seen::Câu hỏi bị động: Was / Were + S + V3?]]?' },
      { who: 'C', mood: 'neutral', t: 'It [[was cleaned]] at 6 p.m. [[by our staff::by + người thực hiện (có thể bỏ nếu không quan trọng)]]. Everything was fine.' },
      { who: 'B', mood: 'surprised', act: 'shake', t: 'Look, detective! This window [[was broken::break → broken (V3)]] from the inside, not the outside.' },
      { who: 'A', mood: 'thinking', t: 'So the statue [[wasn\'t stolen::Phủ định: wasn\'t / weren\'t + V3]] by someone from outside...' },
      { who: 'B', mood: 'thinking', t: 'And these footprints [[were made::footprints số nhiều → were]] by very small feet.' },
      { who: 'C', mood: 'surprised', t: 'Small feet? Only one "person" here has tiny feet...' },
      { who: 'N', t: 'Suddenly, a sound [[is heard::Bị động hiện tại: am / is / are + V3]] from the gift shop. "Meow!"' },
      { who: 'A', mood: 'excited', act: 'jump', t: 'Mystery solved! The statue [[is being hidden::Bị động tiếp diễn: is / are being + V3]] behind the cat food!' },
      { who: 'B', mood: 'happy', t: 'So the window [[was broken]] by... a cat?' },
      { who: 'C', mood: 'happy', act: 'wave', t: 'Don\'t worry. It [[will be repaired::Bị động tương lai: will be + V3]] tomorrow!' }
    ],
    rule: {
      forms: [
        ['Hiện tại', 'am / is / are + V3', 'A sound <b>is heard</b>.'],
        ['Quá khứ', 'was / were + V3', 'The window <b>was broken</b>.'],
        ['HT hoàn thành', 'have / has been + V3', 'Something <b>has been stolen</b>.'],
        ['Tương lai', 'will be + V3', 'It <b>will be repaired</b>.']
      ],
      use: ['Khi hành động / đối tượng quan trọng hơn người làm', 'Khi không biết hoặc không cần nói ai làm', 'Văn phong trang trọng: tin tức, báo cáo'],
      tip: 'Chủ động: <i>Staff cleaned the statue.</i> → Bị động: <i>The statue <b>was cleaned</b> by staff.</i> Thì của "be" theo thì của câu gốc.'
    },
    quiz: [
      { q: 'The statue ___ last night.', o: ['took', 'was taken', 'is taking', 'was took'], a: 1, e: 'Bị động quá khứ: was + V3 (taken).' },
      { q: 'The footprints ___ by small feet.', o: ['was made', 'were made', 'made', 'are make'], a: 1, e: 'footprints số nhiều → were + V3.' },
      { q: 'The window will ___ tomorrow.', o: ['repaired', 'be repaired', 'is repaired', 'repair'], a: 1, e: 'Bị động tương lai: will be + V3.' },
      { q: '"Someone broke the window." → "The window ___."', o: ['was broken', 'broke', 'is broken', 'has broke'], a: 0, e: 'broke là quá khứ → was + V3 (broken).' }
    ]
  }
];
