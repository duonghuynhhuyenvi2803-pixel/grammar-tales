# Grammar Tales 📖

Học ngữ pháp tiếng Anh qua truyện hoạt hình. Tự tạo nhân vật, giao vai, xem các bạn ấy diễn, rồi làm quiz.

Web tĩnh thuần HTML/CSS/JS, không cần build — deploy thẳng lên Vercel.

## Cấu trúc

- `index.html` — trang chính
- `styles.css` — giao diện + animation
- `js/characters.js` — vẽ nhân vật (SVG), kiểu tóc, trang phục, biểu cảm
- `js/scenes.js` — 6 bối cảnh: kitchen, park, classroom, beach, street, museum
- `js/stories.js` — **nội dung truyện + quiz** (sửa/thêm truyện ở đây)
- `js/app.js` — logic web

## Thêm truyện mới

Copy một khối trong `js/stories.js` rồi sửa:

- `[[từ::ghi chú tiếng Việt]]` → tô sáng điểm ngữ pháp kèm giải thích
- `{A}`, `{A.he}`, `{A.He}`, `{A.his}`, `{A.him}` → tên / đại từ của nhân vật đóng vai A
- `who: 'N'` = người kể chuyện; `mood`: neutral, happy, excited, sad, surprised, angry, thinking; `act`: jump, shake, wave, nod
- `scene`: kitchen, park, classroom, beach, street, museum

Đẩy lên GitHub là Vercel tự cập nhật.

## Luyện nói + bảng điểm giáo viên (Supabase)

- Bài luyện nói: `js/lessons.js` · chấm điểm: `js/scoring.js` · kết nối: `js/cloud.js` · trang giáo viên: `#/teacher`
- Cài đặt database: chạy `supabase-setup.sql` trong Supabase → SQL Editor.
- Thêm giáo viên: `insert into public.teachers (email) values ('ten@email.com');` rồi tạo user cùng email trong Authentication → Users.
