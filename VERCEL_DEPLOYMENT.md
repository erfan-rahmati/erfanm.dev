# چک‌لیست انتشار روی Vercel

## ۱. متغیرهای محیطی

مقادیر `DATABASE_URL`، `DATABASE_URL_DIRECT`، `TELEGRAM_BOT_TOKEN`، `TELEGRAM_CHAT_ID` و `REQUEST_SECURITY_SECRET` باید در محیط هدف Vercel وجود داشته باشند.

اتصال Vercel Blob توسط Project Connection و OIDC مدیریت می‌شود. `BLOB_STORE_ID` و سایر credentialهای مربوط به Blob باید توسط اتصال خود Vercel تأمین شوند و نباید credential بلندمدت Blob به‌صورت دستی داخل Repository ذخیره شود.

`BETTER_AUTH_SECRET` و `BETTER_AUTH_URL` برای build اجباری نیستند. برنامه در صورت نبودن آن‌ها:

- یک کلید نشست پایدار و مستقل را با HMAC از `REQUEST_SECURITY_SECRET` مشتق می‌کند؛
- در Production از `https://erfanmdev.ir` و در Preview از URL همان Deployment استفاده می‌کند.

با این حال، تنظیم یک `BETTER_AUTH_SECRET` اختصاصی ۳۲ بایتی برای Production پیشنهاد می‌شود:

```bash
node -e "console.log(require('node:crypto').randomBytes(32).toString('base64url'))"
```

## ۲. اجرای migration

پیش از انتشار نسخه جدید، از دیتابیس Production پشتیبان بگیرید. سپس migration را فقط یک‌بار و با اتصال مستقیم اجرا کنید:

```bash
npm ci
npm run db:check
npm run db:migrate
```

Migration شماره `0006_projects_portfolio` جدول‌های پروژه و رسانه را ایجاد و چهار پروژه فعلی را با `ON CONFLICT DO NOTHING` وارد می‌کند.

## ۳. کنترل نهایی

```bash
npm run lint
npm run typecheck
npm run build
```

پس از Deploy این مسیرها را بررسی کنید:

- `/projects` و بازشدن/بسته‌شدن مودال با ماوس، Escape و دکمه Back
- `/projects/fixboo`
- `/admin/projects` و پیش‌نمایش یک پروژه
- آپلود آزمایشی تصویر و پاک‌کردن فایل بلااستفاده در `/admin/media`
- `/sitemap.xml` و `/llms.txt`
- ورود در `/admin/login`

صفحات Admin و Preview دارای `noindex` هستند و عملیات نوشتن، آپلود و حذف در سمت سرور نقش مدیر را دوباره بررسی می‌کنند.
