# Historical

Prototype giao diện tương tác để khám phá lịch sử Việt Nam qua không gian 3D, bản đồ quan hệ dạng chòm sao và các lộ trình dẫn chuyện. Ứng dụng hiện tập trung vào một trải nghiệm polished xoay quanh trận Bạch Đằng năm 1288.

## Mục Tiêu UI

Ứng dụng không được thiết kế như một website đọc bài, giáo trình, blog hay landing page. Trọng tâm của UI là để người dùng tự khám phá lịch sử thông qua:

- Không gian chiến trường 3D có thể xoay, zoom và chọn điểm nóng.
- Chòm sao tri thức thể hiện quan hệ giữa nhân vật, sự kiện, triều đại và địa danh.
- Lộ trình khám phá có trạng thái tiến độ, điểm đã ghé và điều hướng sang lớp nội dung liên quan.
- Thanh ngữ cảnh luôn cho biết người dùng đang ở đâu trong hành trình.

## Trải Nghiệm Chính

### 1. Màn mở đầu

Hero mở ra với nền sao, sắc tối cinematic và hai chế độ khám phá:

- `Không gian lịch sử 3D`
- `Bầu trời nhân vật`

Nút `Bắt đầu khám phá` cuộn người dùng xuống lớp đang được chọn. Đây là điểm vào của trải nghiệm, không phải một landing page marketing.

### 2. Thanh ngữ cảnh sticky

Ngay dưới hero là thanh ngữ cảnh luôn bám trên đầu màn hình khi cuộn. Thanh này hiển thị:

- Lớp hiện tại: cảnh 3D Bạch Đằng hoặc chòm sao lịch sử.
- Mốc đang xem: timeline stage, hotspot hoặc node đang chọn.
- Lộ trình đang đi nếu có.
- Tiến độ lộ trình dạng `đã ghé / tổng số điểm`.
- Nút đi tới điểm kế tiếp.
- Nút hoàn tất lộ trình.
- Nút xóa ngữ cảnh để reset lựa chọn hiện tại.

### 3. Cảnh 3D trận Bạch Đằng 1288

Khu vực 3D là trải nghiệm WebGL thật, dựng bằng React Three Fiber và Drei. Người dùng có thể:

- Kéo để orbit camera.
- Cuộn để zoom.
- Chọn các hotspot phát sáng trong cảnh.
- Chuyển qua các mốc timeline của trận đánh.
- Đọc thông tin hotspot trong panel parchment nổi trên scene.

Cảnh hiện có bốn mốc:

- Đêm trước: cắm cọc trên sông.
- Sáng sớm: nhử địch vào trận.
- Đỉnh điểm: thủy triều rút.
- Toàn thắng: tiêu diệt thủy binh.

Các hotspot chính:

- Bãi cọc Bạch Đằng.
- Đoàn thuyền Nguyên Mông.
- Sở chỉ huy Trần Hưng Đạo.
- Phục binh hai bờ.

Scene cũng có fallback không WebGL để người dùng vẫn đọc được timeline và thông tin trận đánh nếu trình duyệt không khởi tạo được WebGL.

### 4. Chòm sao lịch sử

Chòm sao tri thức là lớp khám phá quan hệ giữa các thực thể lịch sử. Node được phân loại theo nhóm:

- Nhân vật.
- Sự kiện.
- Triều đại.
- Địa danh.

Tương tác trong chòm sao:

- Click node để mở panel thông tin.
- Chỉ các node và edge liên quan trực tiếp được nhấn mạnh khi chọn một node.
- Kéo nền để pan bản đồ.
- Cuộn để zoom.
- Dùng các nút zoom in, zoom out và reset view.
- Dùng phím mũi tên để chuyển node.
- Dùng `Escape` để thoát lựa chọn.

Panel node hiển thị:

- Loại node.
- Tên, giai đoạn và mô tả ngắn.
- Các nhóm liên quan theo nhân vật, sự kiện, địa danh hoặc triều đại.
- Nút mở lộ trình liên quan.
- Nút vào cảnh 3D nếu node là `Trận Bạch Đằng 1288`.

### 5. Lộ trình khám phá

Phần lộ trình gợi ý giúp người dùng đi theo mạch câu chuyện thay vì chỉ chọn node rời rạc. Mỗi lộ trình có:

- Tiêu đề.
- Mô tả ngắn.
- Danh sách node cần ghé.
- Trạng thái đang đi hoặc hoàn tất.
- Số điểm đã ghé.

Các lộ trình hiện có:

- Ba lần kháng Nguyên Mông.
- Trận Bạch Đằng.
- Triều đại nhà Trần.
- Hưng Đạo Đại Vương.

Khi chọn một lộ trình, UI sẽ tự chọn node đầu tiên, cuộn tới chòm sao và cập nhật thanh ngữ cảnh. Người dùng có thể bấm `Điểm kế tiếp` để tiếp tục hành trình.

## Kiến Trúc UI

```text
app/
  layout.tsx              Root layout, metadata, theme shell
  page.tsx                Route chính và state điều phối toàn bộ trải nghiệm
  globals.css             Tailwind theme, màu sắc, texture, responsive styles

components/
  hero.tsx                Màn mở đầu và chọn chế độ khám phá
  space-scene.tsx         Scene 3D Bạch Đằng, timeline, hotspot, fallback WebGL
  constellation.tsx       Graph quan hệ, zoom/pan, side panel, node highlighting
  exploration-paths.tsx   Lộ trình khám phá và trạng thái tiến độ
  starfield.tsx           Nền sao cho hero
  ui/button.tsx           Button primitive dùng trong UI

lib/
  history-data.ts         Mock data typed cho graph, edge, timeline, hotspot, path
  utils.ts                Helper className
```

`app/page.tsx` là nơi kết nối ba lớp trải nghiệm. File này quản lý:

- Chế độ hiện tại: `space` hoặc `constellation`.
- Node đang chọn.
- Hotspot đang chọn.
- Stage timeline đang focus.
- Lộ trình đang active.
- Lộ trình đã hoàn tất.
- Các node đã ghé.

## Dữ Liệu Mock

Toàn bộ dữ liệu nằm trong `lib/history-data.ts`, bao gồm:

- `graphNodes`: nhân vật, sự kiện, địa danh, triều đại.
- `graphEdges`: quan hệ giữa các node.
- `explorationPaths`: các lộ trình khám phá.
- `battleTimeline`: các mốc diễn biến trận Bạch Đằng.
- `battleHotspots`: điểm nóng trong scene 3D.

Ứng dụng không dùng backend, database, authentication hay API bên ngoài.

## Visual Direction

UI đi theo hướng:

- Nền dark navy và near-black.
- Accent vàng trầm, parchment và xanh lạnh.
- Typography tiếng Việt rõ, tương phản cao.
- Panel thông tin dạng parchment để tạo cảm giác tư liệu lịch sử.
- Animation tiết chế bằng Framer Motion.
- Scene và bề mặt khám phá chiếm phần lớn viewport.

Ứng dụng có hỗ trợ `prefers-reduced-motion` trong các chuyển động chính của scene và UI.

## Tech Stack

- Next.js
- React
- TypeScript
- Tailwind CSS
- React Three Fiber
- Drei
- Three.js
- Framer Motion
- Zustand
- Lucide React

## Cài Đặt Và Chạy Local

Cài dependencies:

```bash
npm install
```

Chạy dev server:

```bash
npm run dev
```

Mở trình duyệt:

```text
http://localhost:3000
```

Build production:

```bash
npm run build
```

Chạy bản production sau khi build:

```bash
npm run start
```

## Scripts

```bash
npm run dev
npm run build
npm run start
npm run lint
```

Lưu ý: script `npm run lint` hiện gọi `eslint .`. Nếu muốn dùng lint trong CI, cần bổ sung dependency và cấu hình ESLint phù hợp.

## Deploy Lên Vercel

Repo này dùng `package-lock.json`, vì vậy Vercel nên cài dependency bằng npm.

Thiết lập khuyến nghị:

- Framework preset: `Next.js`
- Install command: `npm install`
- Build command: `npm run build`
- Output directory: để mặc định

Nếu Vercel báo lỗi:

```text
Command "pnpm install" exited with 1
```

hãy kiểm tra để chắc chắn `pnpm-lock.yaml` không được commit. Vercel chọn package manager dựa trên lockfile trong project root.

## Phạm Vi Prototype

- Frontend only.
- Mock data only.
- Không authentication.
- Không database.
- Không backend/API.
- Desktop-first.
- Ưu tiên một route khám phá hoàn chỉnh thay vì nhiều trang rời rạc.

## Checklist Kiểm Tra UI

Trước khi deploy hoặc demo:

- Chạy `npm run build`.
- Chạy `npx tsc --noEmit`.
- Mở route `/`.
- Kiểm tra hero, chuyển mode và scroll.
- Kiểm tra scene 3D: orbit, zoom, chọn hotspot, đổi timeline.
- Kiểm tra chòm sao: chọn node, zoom, pan, reset view.
- Kiểm tra lộ trình: chọn path, đi điểm kế tiếp, hoàn tất, reset.
- Kiểm tra viewport desktop `1440x900` và `1920x1080`.
