/* Grammar Tales — speaking lessons (Bloom Workbook)
   Lesson  → situations → turns.
   Turn: { who: role key, t: model sentence, vi: what to say (Vietnamese), alt: [other ways to say it] }
   Name templates: {A} {B} = name of the character playing that role (names are not scored).
*/
const LESSONS = [
  {
    id: 'bloom-u1',
    book: 'Bloom',
    unit: 1,
    title: 'In the Neighborhood',
    titleVi: 'Trong khu phố',
    emoji: '🏘️',
    color: '#3BAA5C',
    scene: 'neighborhood',
    goals: ['Chào và làm quen hàng xóm mới', 'Hỏi và chỉ vị trí địa điểm (near, next to, opposite, between, behind)', 'Nói điều thích / không thích về khu phố'],
    language: [
      { title: 'Opening', items: ['Hello. Sorry to bother you. My name is ___.', 'My family has just moved into the house next door.', 'Nice to meet you. I\'m ___. Welcome to the neighborhood.'] },
      { title: 'Action: Places', items: ['Is there a school near here?', 'Where is the restaurant?', 'Yes, there is a school near here. It is next to the library.', 'The restaurant is on Main Street, next to the supermarket.'] },
      { title: 'Action: Like & dislike', items: ['What do you like about your neighborhood?', 'What do you dislike the most about your neighborhood?', 'I like my neighborhood because it is quiet and people are friendly.', 'I dislike the traffic because it is very noisy.'] }
    ],
    situations: [
      {
        id: 'meet',
        title: 'Meeting a new neighbor',
        titleVi: 'Làm quen hàng xóm mới',
        context: 'Gia đình {A} vừa chuyển đến khu phố mới. {A} mang một món quà nhỏ sang chào hàng xóm {B} ở nhà bên cạnh.',
        roles: [{ key: 'A', label: 'Người mới chuyển đến' }, { key: 'B', label: 'Hàng xóm' }],
        turns: [
          { who: 'A', t: 'Hello. Sorry to bother you. My name is {A}. My family has just moved into the house next door.', vi: 'Chào, xin lỗi vì làm phiền, giới thiệu tên và nói gia đình vừa chuyển đến nhà bên cạnh.', alt: ['Hi, sorry to bother you. I\'m {A}. We just moved in next door.', 'Hello! My name is {A}. My family is your new neighbor.'] },
          { who: 'B', t: 'Oh, hello! Nice to meet you, {A}. I\'m {B}. Welcome to the neighborhood.', vi: 'Chào lại, rất vui được gặp, giới thiệu tên mình và chào mừng đến khu phố.', alt: ['Hi {A}, nice to meet you. My name is {B}. Welcome!', 'Hello! I\'m {B}. Welcome to our neighborhood.'] },
          { who: 'A', t: 'Thank you. This is a small gift for you. We wanted to say hello and introduce ourselves.', vi: 'Cảm ơn, đưa món quà nhỏ và nói muốn sang chào hỏi, giới thiệu gia đình.', alt: ['Thanks! Here is a small gift for you.', 'Thank you. We brought you a little gift to say hello.'] },
          { who: 'B', t: 'Oh, that\'s very kind of you. Thank you so much. You really didn\'t have to.', vi: 'Khen họ thật chu đáo, cảm ơn và nói lẽ ra không cần làm vậy đâu.', alt: ['How kind of you! Thank you very much.', 'Oh, thank you so much. That\'s really nice of you.'] },
          { who: 'A', t: 'It\'s our pleasure. This is our first time living in this area.', vi: 'Nói đó là niềm vui của mình, đây là lần đầu sống ở khu này.', alt: ['My pleasure. It is our first time living here.', 'You\'re welcome. We are new to this area.'] },
          { who: 'B', t: 'Well, you chose a good place. It\'s a quiet and friendly neighborhood.', vi: 'Nói họ chọn đúng chỗ rồi, khu phố yên tĩnh và thân thiện.', alt: ['This is a great place to live. It is quiet and friendly.', 'You will like it here. The neighborhood is very peaceful.'] },
          { who: 'A', t: 'That\'s good to know. Everything is still new for us.', vi: 'Nói thật tốt khi biết vậy, mọi thứ vẫn còn mới lạ với gia đình mình.', alt: ['Great to hear that. Everything is new to us.', 'That\'s nice. We are still learning about this place.'] },
          { who: 'B', t: 'I understand. If you need any help, just let me know.', vi: 'Nói mình hiểu, nếu cần giúp gì thì cứ báo.', alt: ['No problem. Just tell me if you need help.', 'Let me know if you need anything.'] },
          { who: 'A', t: 'Thank you very much. We\'re happy to be your neighbors.', vi: 'Cảm ơn nhiều, nói rất vui được làm hàng xóm.', alt: ['Thanks a lot. We are glad to be your neighbors.', 'Thank you. It\'s nice to be your neighbor.'] },
          { who: 'B', t: 'The pleasure is mine. Welcome again, and I hope your family enjoys living here.', vi: 'Nói mình mới là người vui, chào mừng lần nữa và chúc gia đình sống vui ở đây.', alt: ['My pleasure. I hope you enjoy living here.', 'Welcome again. Have a great time in the neighborhood!'] }
        ]
      },
      {
        id: 'places',
        title: 'Asking about places',
        titleVi: 'Hỏi đường quanh khu phố',
        context: '{A} hỏi hàng xóm {B} về các địa điểm gần nhà. Nhìn bản đồ để hỏi và trả lời. Nhà của {B} là "Neighbor\'s house".',
        map: true,
        roles: [{ key: 'A', label: 'Người mới chuyển đến' }, { key: 'B', label: 'Hàng xóm' }],
        turns: [
          { who: 'A', t: 'Hi, {B}. We\'ve just moved here, so I\'m still learning about the neighborhood.', vi: 'Chào, nói mình vừa chuyển đến nên vẫn đang tìm hiểu khu phố.', alt: ['Hello {B}. I\'m new here, so I don\'t know the neighborhood yet.', 'Hi! We just moved in. I\'m still learning about this area.'] },
          { who: 'B', t: 'Hi, {A}. Welcome! Feel free to ask if you need anything.', vi: 'Chào lại, chào mừng, nói cứ hỏi nếu cần gì.', alt: ['Welcome! Just ask me if you need anything.', 'Hi {A}! You can ask me anything.'] },
          { who: 'A', t: 'Thanks! Is there a pharmacy near here?', vi: 'Cảm ơn, hỏi gần đây có hiệu thuốc không.', alt: ['Is there a pharmacy nearby?', 'Where is the pharmacy?'] },
          { who: 'B', t: 'Yes, there is. The pharmacy is opposite my house.', vi: 'Nói có, hiệu thuốc nằm đối diện nhà mình (xem bản đồ).', alt: ['Yes. It is across the street from my house.', 'Yes, there is a pharmacy opposite my house.'] },
          { who: 'A', t: 'Oh, that\'s good to know. Is there a grocery store nearby?', vi: 'Nói tốt quá, hỏi gần đây có cửa hàng tạp hoá không.', alt: ['Great. Where is the grocery store?', 'Is there a grocery store near here?'] },
          { who: 'B', t: 'Yes. The grocery store is between Kate\'s house and my house.', vi: 'Nói có, cửa hàng tạp hoá nằm giữa nhà Kate và nhà mình.', alt: ['Yes, it is between my house and Kate\'s house.', 'The grocery store is next to my house.'] },
          { who: 'A', t: 'That sounds convenient. What about a restaurant? Is there one around here?', vi: 'Nói nghe tiện quá, hỏi thêm có nhà hàng nào quanh đây không.', alt: ['Is there a restaurant around here?', 'Where is the restaurant?'] },
          { who: 'B', t: 'Yes, there is. The restaurant is next to your house.', vi: 'Nói có, nhà hàng ở ngay cạnh nhà của người kia.', alt: ['Yes. It is right next to your house.', 'The restaurant is next to your house.'] },
          { who: 'A', t: 'Great! And where is the café?', vi: 'Hỏi quán cà phê ở đâu.', alt: ['Is there a café near here?', 'Where can I find a café?'] },
          { who: 'B', t: 'The café is behind David\'s house, on Main Street.', vi: 'Nói quán cà phê ở phía sau nhà David, trên đường Main Street.', alt: ['It is behind David\'s house.', 'The café is near David\'s house.'] },
          { who: 'A', t: 'Is there a school near here? I have two children.', vi: 'Hỏi gần đây có trường học không, nói mình có hai con.', alt: ['Where is the school?', 'Is there a school nearby for my kids?'] },
          { who: 'B', t: 'Yes. The school is behind the pharmacy.', vi: 'Nói có, trường học nằm phía sau hiệu thuốc.', alt: ['Yes, there is. It is behind the pharmacy.', 'The school is next to the pharmacy.'] },
          { who: 'A', t: 'Thank you so much for your help.', vi: 'Cảm ơn vì đã giúp đỡ.', alt: ['Thank you!', 'Thanks a lot for your help.'] },
          { who: 'B', t: 'You\'re welcome.', vi: 'Đáp lại lời cảm ơn.', alt: ['No problem.', 'My pleasure.'] }
        ]
      },
      {
        id: 'likes',
        title: 'Likes and dislikes',
        titleVi: 'Thích và không thích khu phố',
        context: 'Ở một bữa tiệc khu phố, {A} hỏi {B} thích và không thích điều gì ở khu phố này. Ở mức Tự do, hãy nói về khu phố thật của bạn.',
        roles: [{ key: 'A', label: 'Người hỏi' }, { key: 'B', label: 'Hàng xóm lâu năm' }],
        turns: [
          { who: 'A', t: 'Hi, {B}. How long have you lived in this neighborhood?', vi: 'Chào, hỏi người kia sống ở khu phố này bao lâu rồi.', alt: ['How long have you lived here?', 'Have you lived here for a long time?'] },
          { who: 'B', t: 'I have lived here for about ten years.', vi: 'Nói mình sống ở đây khoảng mười năm (hoặc số năm của bạn).', alt: ['About ten years.', 'I have been here for five years.'] },
          { who: 'A', t: 'What do you like about your neighborhood?', vi: 'Hỏi người kia thích điều gì ở khu phố.', alt: ['What do you like about this area?', 'Do you like living here?'] },
          { who: 'B', t: 'I like my neighborhood because it is quiet and people are friendly.', vi: 'Nói thích khu phố vì yên tĩnh và mọi người thân thiện (dùng because).', alt: ['I like it because the people are helpful and it is very peaceful.', 'I love it here because it is cozy and quiet.'] },
          { who: 'A', t: 'What do you dislike the most about your neighborhood?', vi: 'Hỏi người kia không thích điều gì nhất ở khu phố.', alt: ['Is there anything you don\'t like here?', 'What do you dislike about this area?'] },
          { who: 'B', t: 'I dislike the traffic because it is very noisy.', vi: 'Nói không thích giao thông vì quá ồn (dùng dislike ... because).', alt: ['I don\'t like the traffic. It is very noisy.', 'I dislike the streets because they are too crowded.'] },
          { who: 'A', t: 'I see. Thank you for telling me.', vi: 'Nói mình hiểu rồi, cảm ơn đã chia sẻ.', alt: ['Thanks for sharing.', 'I understand. Thank you.'] }
        ]
      }
    ]
  },

  {
    id: 'bloom-u4',
    book: 'Bloom',
    unit: 4,
    title: 'At the Restaurant',
    titleVi: 'Ở nhà hàng',
    emoji: '🍝',
    color: '#FF7A59',
    scene: 'restaurant',
    goals: ['Đặt bàn qua điện thoại', 'Gọi món: món khai vị, món chính, đồ uống', 'Nhận xét món ăn và thanh toán'],
    language: [
      { title: 'Make a reservation', items: ['Welcome to Green Garden Restaurant. How may I help you?', 'I\'d like to book a table for ___.', 'What time would that be for?', 'Can I have your name, please?', 'A table for ___ at ___ p.m. this evening.'] },
      { title: 'Take an order', items: ['Have you booked any tables yet?', 'Yes, I booked a table for ___. It\'s under the name of ___.', 'What would you like for your starter / main course?', 'I\'d like ___ / I\'ll have ___ / I\'ll take ___.', 'What would you like to drink? Can I have ___?', 'Would you like anything else? No, thank you. That\'ll be all.'] },
      { title: 'Comment & pay', items: ['How was your meal today?', 'It was delicious. The ___ was perfect.', 'Can I have the bill, please?', 'Would you like to pay by cash or by card?'] }
    ],
    situations: [
      {
        id: 'booking',
        title: 'Booking a table',
        titleVi: 'Đặt bàn qua điện thoại',
        context: '{A} gọi điện cho nhà hàng Green Garden để đặt bàn cho gia đình 4 người vào tối nay lúc 7 giờ. {B} là nhân viên nhà hàng.',
        roles: [{ key: 'A', label: 'Khách hàng' }, { key: 'B', label: 'Nhân viên nhà hàng' }],
        turns: [
          { who: 'B', t: 'Good evening. Welcome to Green Garden Restaurant. How may I help you?', vi: 'Chào buổi tối, giới thiệu tên nhà hàng Green Garden và hỏi có thể giúp gì.', alt: ['Green Garden Restaurant. How can I help you?', 'Hello, this is Green Garden Restaurant. How may I help you?'] },
          { who: 'A', t: 'Hi. I\'d like to book a table for four, please.', vi: 'Nói muốn đặt bàn cho 4 người.', alt: ['I\'d like a table for four people.', 'Can I book a table for four, please?'] },
          { who: 'B', t: 'Sure. What time would that be for?', vi: 'Đồng ý, hỏi đặt cho mấy giờ.', alt: ['Of course. What time would you like?', 'What day and time would you like?'] },
          { who: 'A', t: 'This evening at seven o\'clock, please.', vi: 'Nói tối nay lúc 7 giờ.', alt: ['Seven p.m. tonight, please.', 'At 7 o\'clock this evening.'] },
          { who: 'B', t: 'Can I have your name, please?', vi: 'Hỏi tên người đặt bàn.', alt: ['What name would you like the reservation under?', 'May I have your name?'] },
          { who: 'A', t: 'My name is {A}.', vi: 'Nói tên mình.', alt: ['It\'s {A}.', 'I\'m {A}.'] },
          { who: 'B', t: 'Do you have any special requests?', vi: 'Hỏi khách có yêu cầu đặc biệt nào không.', alt: ['Anything special for your table?', 'Would you like anything special?'] },
          { who: 'A', t: 'Yes. Could we have a table by the window, please?', vi: 'Nói có, xin một bàn cạnh cửa sổ.', alt: ['A table near the window, please.', 'We would like a quiet table by the window.'] },
          { who: 'B', t: 'No problem. Thank you, {A}. A table for four at seven p.m. this evening.', vi: 'Nói không vấn đề gì, cảm ơn và nhắc lại: bàn 4 người lúc 7 giờ tối nay.', alt: ['Okay. A table for four at 7 o\'clock tonight.', 'Sure. See you at seven this evening.'] },
          { who: 'A', t: 'Great, thanks! See you this evening.', vi: 'Cảm ơn và hẹn gặp tối nay.', alt: ['Great, thank you!', 'Thanks a lot. Goodbye.'] }
        ]
      },
      {
        id: 'order',
        title: 'Ordering food',
        titleVi: 'Gọi món',
        context: 'Gia đình {A} đến nhà hàng. Nhân viên {B} hỏi về bàn đã đặt và nhận gọi món. Thực đơn: vegetable soup, salad, beef steak, grilled chicken, spaghetti, orange juice.',
        roles: [{ key: 'A', label: 'Khách hàng' }, { key: 'B', label: 'Phục vụ' }],
        turns: [
          { who: 'B', t: 'Good evening. Have you booked a table yet?', vi: 'Chào và hỏi khách đã đặt bàn chưa.', alt: ['Hello. Do you have a reservation?', 'Good evening. Have you got a reservation?'] },
          { who: 'A', t: 'Yes, I booked a table for four. It\'s under the name of {A}.', vi: 'Nói đã đặt bàn 4 người, đặt theo tên mình.', alt: ['Yes, a table for four under {A}.', 'Yes. The reservation is under the name {A}.'] },
          { who: 'B', t: 'This way, please. What would you like for your starter?', vi: 'Mời đi lối này, hỏi khách muốn món khai vị gì.', alt: ['Please follow me. What would you like to start with?', 'Here is your table. Would you like a starter?'] },
          { who: 'A', t: 'I\'d like a vegetable soup and a salad, please.', vi: 'Gọi món khai vị: súp rau và salad.', alt: ['We\'ll have the vegetable soup and a salad.', 'Can I have a salad, please?'] },
          { who: 'B', t: 'And what would you like for your main course?', vi: 'Hỏi khách muốn món chính gì.', alt: ['What about your main course?', 'And for the main course?'] },
          { who: 'A', t: 'I\'ll have the beef steak, and my wife will have the grilled chicken.', vi: 'Gọi món chính: bò bít tết cho mình và gà nướng cho người nhà.', alt: ['I\'ll take the beef steak and the grilled chicken.', 'We would like one beef steak and one spaghetti.'] },
          { who: 'B', t: 'What would you like to drink?', vi: 'Hỏi khách muốn uống gì.', alt: ['Anything to drink?', 'And what would you like to drink?'] },
          { who: 'A', t: 'Can I have two orange juices and two glasses of water, please?', vi: 'Gọi đồ uống: hai nước cam và hai ly nước lọc.', alt: ['Two orange juices, please.', 'I\'d like an orange juice and some water.'] },
          { who: 'B', t: 'Would you like anything else?', vi: 'Hỏi khách có muốn gọi thêm gì không.', alt: ['Anything else?', 'Is there anything else I can get you?'] },
          { who: 'A', t: 'No, thank you. That\'ll be all.', vi: 'Nói không, cảm ơn, vậy là đủ rồi.', alt: ['No, thanks. That\'s all.', 'That\'s everything, thank you.'] },
          { who: 'B', t: 'Thank you. Your food will be ready soon.', vi: 'Cảm ơn và nói món ăn sẽ có ngay.', alt: ['Thank you. Your meal will be ready soon.', 'Great. I\'ll bring your food soon.'] }
        ]
      },
      {
        id: 'bill',
        title: 'Comments and the bill',
        titleVi: 'Nhận xét món ăn & thanh toán',
        context: 'Gia đình {A} đã ăn xong. Phục vụ {B} hỏi cảm nhận về món ăn, sau đó {A} xin hoá đơn và thanh toán.',
        roles: [{ key: 'A', label: 'Khách hàng' }, { key: 'B', label: 'Phục vụ' }],
        turns: [
          { who: 'B', t: 'How was your meal today?', vi: 'Hỏi khách thấy bữa ăn hôm nay thế nào.', alt: ['Did you enjoy your meal?', 'How was the food?'] },
          { who: 'A', t: 'It was delicious. The beef steak was perfect.', vi: 'Khen món ăn ngon, món bò bít tết rất tuyệt.', alt: ['Everything was great. I loved the steak.', 'The food was very good, thank you.'] },
          { who: 'B', t: 'I\'m glad you enjoyed it. How about the soup?', vi: 'Nói rất vui vì khách thích, hỏi thêm về món súp.', alt: ['Glad to hear that! And the soup?', 'Great! Did you like the soup?'] },
          { who: 'A', t: 'The soup was tasty, but it was a little too salty.', vi: 'Nhận xét súp ngon nhưng hơi mặn (dùng but).', alt: ['It was good, but a bit salty.', 'The soup was nice, but it was a little cold.'] },
          { who: 'B', t: 'Thank you for telling us. I will tell the chef.', vi: 'Cảm ơn góp ý và nói sẽ báo lại đầu bếp.', alt: ['Sorry about that. I\'ll tell our chef.', 'Thanks for your comment.'] },
          { who: 'A', t: 'Can I have the bill, please?', vi: 'Xin hoá đơn.', alt: ['Could we have the check, please?', 'The bill, please.'] },
          { who: 'B', t: 'Sure. That\'s eighty-five dollars. Would you like to pay by cash or by card?', vi: 'Nói tổng 85 đô và hỏi trả tiền mặt hay thẻ.', alt: ['It\'s eighty-five dollars. Cash or card?', 'Here is your bill. How would you like to pay?'] },
          { who: 'A', t: 'By card, please. Here you are.', vi: 'Nói trả bằng thẻ và đưa thẻ.', alt: ['I\'ll pay by card.', 'In cash, please. Here you are.'] },
          { who: 'B', t: 'Here is your receipt. Have a nice evening!', vi: 'Đưa hoá đơn và chúc buổi tối vui vẻ.', alt: ['Thank you. Here\'s your receipt.', 'Thanks for coming. Have a good night!'] },
          { who: 'A', t: 'Thank you. Goodbye!', vi: 'Cảm ơn và chào tạm biệt.', alt: ['Thanks. Bye!', 'Thank you very much. See you again!'] }
        ]
      }
    ]
  }
];

/* Simple neighborhood map for Unit 1 (drawn after the workbook map) */
const NEIGHBORHOOD_MAP = `<svg viewBox="0 0 520 300" class="map-svg" xmlns="http://www.w3.org/2000/svg" font-family="Nunito, sans-serif" font-weight="800">
  <rect width="520" height="300" rx="14" fill="#CFEBB5"/>
  <rect x="0" y="150" width="520" height="34" fill="#B9B3A6"/><rect x="150" y="0" width="34" height="300" fill="#B9B3A6"/>
  <g stroke="#fff" stroke-width="3" stroke-dasharray="12 10"><line x1="0" y1="167" x2="520" y2="167"/><line x1="167" y1="0" x2="167" y2="300"/></g>
  <text x="172" y="40" transform="rotate(90 172 40)" font-size="12" fill="#3D3D46">Main Street</text>
  ${[
    ['Café', 30, 18, '#FF7A59'], ['David\'s house', 30, 84, '#4C8DF6'],
    ['School', 250, 18, '#FFC94A'], ['Pharmacy', 250, 84, '#2EC4B6'],
    ['Restaurant', 10, 200, '#E0628F'], ['Your house', 76, 200, '#7B5CF0'],
    ['Neighbor\'s house', 192, 200, '#FF7A59'], ['Grocery store', 298, 200, '#3BAA5C'], ['Kate\'s house', 404, 200, '#B5452B']
  ].map(([n, x, y, c]) => `<g transform="translate(${x} ${y})"><rect width="${n.length > 12 ? 100 : 70}" height="52" rx="8" fill="${c}" stroke="#2B2340" stroke-width="2.5"/>
    <text x="${(n.length > 12 ? 100 : 70) / 2}" y="31" text-anchor="middle" font-size="${n.length > 12 ? 11 : 12}" fill="#fff">${n}</text></g>`).join('')}
</svg>`;
