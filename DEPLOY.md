# Hướng dẫn Deploy lên Vercel

## Tại sao chọn Vercel?

- ✅ Hỗ trợ native Next.js (tốt nhất)
- ✅ Tự động optimize và CDN
- ✅ Deploy tự động khi push code
- ✅ Preview deployments cho mỗi PR
- ✅ Edge functions và analytics
- ✅ Miễn phí cho personal projects
- ✅ HTTPS tự động
- ✅ Dễ dàng setup (chỉ cần connect GitHub)

## Cách Deploy

### Cách 1: Deploy qua Website Vercel (Dễ nhất - Khuyến nghị)

1. **Push code lên GitHub** (nếu chưa có):
   ```bash
   git init
   git add .
   git commit -m "Initial commit"
   git remote add origin <your-github-repo-url>
   git push -u origin main
   ```

2. **Truy cập [vercel.com](https://vercel.com)** và đăng nhập với GitHub

3. **Click "New Project"**

4. **Import repository** từ GitHub

5. **Cấu hình** (Vercel tự động detect hầu hết, nhưng bạn có thể kiểm tra):
   - Framework Preset: Next.js (tự động detect)
   - Root Directory: `./`
   - Build Command: `npm run build` (hoặc `pnpm build`)
   - Output Directory: `.next` (Vercel tự động xử lý)

6. **Click "Deploy"**

7. **Xong!** Vercel sẽ tự động deploy và cung cấp URL

### Cách 2: Deploy qua CLI

```bash
# Install Vercel CLI
npm i -g vercel

# Login
vercel login

# Deploy (preview)
vercel

# Deploy production
vercel --prod
```

## Cấu hình đã được setup

File `vercel.json` đã được tạo với:
- ✅ Service Worker headers (cho PWA)
- ✅ PWA manifest headers
- ✅ Framework detection tự động
- ✅ HTTPS và CDN tự động

## Deploy tự động

Sau khi setup lần đầu:
- Mỗi khi bạn push code lên GitHub, Vercel sẽ tự động deploy
- Mỗi PR sẽ có preview deployment riêng
- Production deployment chỉ chạy khi merge vào main/master

## Environment Variables (nếu cần)

Nếu sau này cần thêm environment variables:

1. Vào Project Settings trên Vercel dashboard
2. Chọn "Environment Variables"
3. Thêm biến môi trường
4. Chọn môi trường (Production, Preview, Development)
5. Redeploy để áp dụng

## Custom Domain (Tùy chọn)

1. Vào Project Settings > Domains
2. Thêm domain của bạn (ví dụ: `typing.yourdomain.com`)
3. Follow DNS instructions từ Vercel
4. Đợi DNS propagate (có thể mất vài phút đến vài giờ)
5. HTTPS sẽ được tự động cấu hình

## Monitoring & Analytics

- **Analytics**: Tự động có sẵn trong dashboard
- **Speed Insights**: Miễn phí, hiển thị performance metrics
- **Web Vitals**: Tự động track Core Web Vitals

## Troubleshooting

### Build failed?
- Kiểm tra logs trên Vercel dashboard
- Đảm bảo `package.json` có đúng scripts
- Kiểm tra dependencies có conflict không

### Service Worker không hoạt động?
- Kiểm tra `vercel.json` đã có headers đúng chưa
- Đảm bảo file `service-worker.js` nằm trong `public/`
- Check browser console để xem errors

### PWA không install được?
- Đảm bảo HTTPS (Vercel tự động có)
- Kiểm tra `manifest.webmanifest` đã đúng format chưa
- Đảm bảo icons đã được thêm vào `public/icons/`

## Tóm tắt

**Chỉ cần 3 bước:**
1. Push code lên GitHub
2. Connect repo trên Vercel
3. Click Deploy

Vercel sẽ tự động xử lý mọi thứ còn lại! 🚀
