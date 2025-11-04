# Kids Typing - Ứng dụng luyện gõ phím 10 ngón cho trẻ em

Ứng dụng web offline giúp trẻ em Việt Nam học gõ phím 10 ngón một cách thú vị và hiệu quả.

## Tính năng

- 🎯 **10 bài học** được thiết kế theo từng cấp độ (Level 1-4)
- ⌨️ **Bàn phím ảo** với màu sắc theo từng ngón tay
- 📊 **Theo dõi kết quả** với WPM và độ chính xác
- 📱 **Hoạt động offline** - PWA hỗ trợ cài đặt và sử dụng không cần internet
- 🇻🇳 **Giao diện tiếng Việt** thân thiện với trẻ em
- 🎨 **UI pastel** đẹp mắt, phù hợp với trẻ em

## Cài đặt

### Yêu cầu

- Node.js 20+ 
- pnpm hoặc npm

### Các bước

1. **Clone repository**
```bash
git clone <repository-url>
cd typing-project
```

2. **Cài đặt dependencies**
```bash
pnpm install
# hoặc
npm install
```

3. **Chạy ứng dụng ở chế độ development**
```bash
pnpm dev
# hoặc
npm run dev
```

4. **Mở trình duyệt**
Truy cập [http://localhost:3000](http://localhost:3000)

## Build và Deploy

### Build production

```bash
pnpm build
# hoặc
npm run build
```

### Chạy production server

```bash
pnpm start
# hoặc
npm start
```

### Deploy

Xem hướng dẫn chi tiết trong [DEPLOY.md](./DEPLOY.md)

**Deploy lên Vercel** (dễ nhất và tốt nhất cho Next.js):

1. Push code lên GitHub
2. Vào [vercel.com](https://vercel.com)
3. Import repository
4. Click Deploy

Xem chi tiết tại [DEPLOY.md](./DEPLOY.md)

## Scripts

- `pnpm dev` - Chạy development server
- `pnpm build` - Build ứng dụng cho production
- `pnpm start` - Chạy production server
- `pnpm lint` - Chạy ESLint
- `pnpm typecheck` - Kiểm tra TypeScript types
- `pnpm format` - Format code với Prettier

## Cấu trúc thư mục

```
/
├── src/
│   ├── app/                 # Next.js App Router pages
│   │   ├── page.tsx         # Trang chủ
│   │   ├── lessons/         # Trang chọn bài học
│   │   ├── play/[id]/       # Trang luyện gõ
│   │   └── result/[id]/     # Trang kết quả
│   ├── components/          # React components
│   │   ├── Button.tsx
│   │   ├── Keyboard.tsx
│   │   ├── TargetLine.tsx
│   │   └── Toggle.tsx
│   └── lib/
│       ├── i18n/            # Internationalization (Vietnamese)
│       ├── lesson-engine/   # Engine tạo bài học
│       └── typing/          # Utilities cho typing logic
├── public/
│   ├── lessons/             # File JSON chứa bài học
│   ├── icons/               # Icons cho PWA
│   ├── manifest.webmanifest # PWA manifest
│   └── service-worker.js    # Service Worker cho offline
└── .github/workflows/       # CI/CD workflows
```

## Sử dụng Offline

1. **Lần đầu truy cập**: Mở ứng dụng bằng trình duyệt hỗ trợ PWA (Chrome, Edge, Safari)
2. **Cài đặt**: Nhấn nút "Cài đặt" khi trình duyệt hiển thị prompt
3. **Sử dụng offline**: Sau khi cài đặt, ứng dụng hoạt động hoàn toàn offline

Ứng dụng sẽ tự động cache:
- Tất cả các trang
- Bài học (JSON)
- Icons và assets

## Cấu hình bài học

Bài học được định nghĩa trong `/public/lessons/core-pack.json`. Mỗi bài học có các thuộc tính:

- `id`: ID duy nhất
- `title`: Tiêu đề bài học (tiếng Việt)
- `type`: Loại bài học (`sequence`, `finger-mix`, `region-random`, `timed`)
- `pool`: Danh sách phím cần luyện
- `goal`: Mục tiêu WPM và độ chính xác
- `allowBackspace`: Cho phép xóa hay không

## Phát triển

### Thêm bài học mới

Chỉnh sửa file `/public/lessons/core-pack.json` và thêm bài học mới theo format:

```json
{
  "id": "L5-1",
  "title": "Tên bài học",
  "type": "sequence",
  "pool": ["a", "s", "d", "f"],
  "pattern": "ascend",
  "chunk": 4,
  "repeat": 8,
  "goal": { "wpm": 25, "accuracy": 95 },
  "allowBackspace": true
}
```

### Thay đổi màu sắc

Chỉnh sửa file `tailwind.config.ts` để thay đổi màu sắc cho từng ngón tay.

## CI/CD

GitHub Actions tự động chạy:
- ESLint
- TypeScript type checking
- Build verification

Workflow được định nghĩa trong `.github/workflows/ci.yml`.

## Lưu ý về Icons

Thư mục `public/icons/` cần chứa các icon với kích thước:
- 72x72, 96x96, 128x128, 144x144, 152x152, 192x192, 384x384, 512x512 pixels

Bạn có thể tạo icons bằng:
- [PWA Asset Generator](https://github.com/onderceylan/pwa-asset-generator)
- [RealFaviconGenerator](https://realfavicongenerator.net/)

## License

MIT

## Tác giả

Xây dựng cho trẻ em Việt Nam học gõ phím một cách vui vẻ và hiệu quả.

