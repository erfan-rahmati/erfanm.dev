# erfanm.dev

سورس وب‌سایت شخصی عرفان رحمتی با وبلاگ پویا، پورتفولیوی پروژه‌ها، پنل مدیریت محتوا و مدیریت درخواست‌های مشاوره. پروژه با Next.js App Router، TypeScript، Neon/PostgreSQL، Drizzle ORM، Better Auth، Tiptap و Vercel Blob توسعه داده شده است.

## قابلیت‌های این نسخه

- صفحه آرشیو مقالات در `/blog` با دسته‌بندی و صفحه‌بندی
- صفحه جزئیات مقاله در `/blog/[slug]` با متادیتای پویا و JSON-LD معتبر
- نمایش مقالات منتشرشدهٔ اخیر روی صفحه اصلی
- صفحه پروژه‌ها در `/projects` با گرید نامتقارن و کارت‌های واکنش‌گرا
- مودال دسترس‌پذیر جزئیات پروژه، URL مستقل و صفحه قابل ایندکس `/projects/[slug]`
- ساخت، ویرایش، پیش‌نمایش، انتشار، ترتیب‌دهی، آرشیو و حذف دومرحله‌ای پروژه
- آپلود امن تصویر اصلی و گالری پروژه روی Vercel Blob
- پنل خصوصی مدیر در `/admin`
- ساخت، ویرایش، پیش‌نمایش، انتشار، آرشیو و حذف دومرحله‌ای مقاله
- ویرایشگر ساختاریافته Tiptap با تیتر، فهرست، جدول، نقل‌قول، کد، لینک و تصویر
- آپلود مستقیم و کنترل‌شدهٔ JPG، PNG، WebP و AVIF روی Vercel Blob
- مدیریت درخواست‌های مشاوره، جست‌وجو، فیلتر وضعیت، یادداشت داخلی و تاریخچه تغییر وضعیت
- Sitemap پویا، Robots، RSS، Open Graph، canonical، Breadcrumb و BlogPosting schema
- فایل `llms.txt`، پاسخ کوتاه، نکات کلیدی، منابع و ساختار معنایی مناسب GEO
- هدرهای امنیتی، CSP، HSTS، محدودسازی ورود و کنترل دسترسی در هر عملیات حساس

## پیش‌نیازها

- Node.js 20 یا جدیدتر
- یک دیتابیس Neon/PostgreSQL
- پروژه Vercel Blob متصل به سایت
- دامنه نهایی `https://erfanmdev.ir`

## راه‌اندازی محلی

```bash
npm ci
cp .env.example .env.local
npm run db:migrate
npm run dev
```

متغیرهای برنامه را فقط داخل `.env.local` در محیط توسعه و Environment Variables در Vercel تنظیم کنید. Credentialهای Vercel Blob توسط Project Connection و OIDC مدیریت می‌شوند:

| متغیر | کاربرد |
| --- | --- |
| `DATABASE_URL` | اتصال pooled/runtime دیتابیس Neon |
| `DATABASE_URL_DIRECT` | اتصال مستقیم برای Drizzle migration |
| `TELEGRAM_BOT_TOKEN` | توکن اعلان فرم مشاوره |
| `TELEGRAM_CHAT_ID` | شناسه مقصد اعلان تلگرام |
| `REQUEST_SECURITY_SECRET` | secret تصادفی Base64URL برای هش امنیتی فرم |
| `BETTER_AUTH_SECRET` | اختیاری؛ secret اختصاصی Base64URL برای نشست‌ها (پیشنهادشده) |
| `BETTER_AUTH_URL` | اختیاری؛ آدرس احراز هویت، در Vercel به‌صورت امن تشخیص داده می‌شود |
| Vercel Blob | اتصال Blob توسط Vercel و OIDC مدیریت می‌شود؛ credential بلندمدت را دستی داخل پروژه ذخیره نکنید |

برای تولید secret مناسب می‌توان از این دستور استفاده کرد:

```bash
node -e "console.log(require('node:crypto').randomBytes(32).toString('base64url'))"
```

فایل `.env.local` هرگز نباید commit، آرشیو یا برای شخص دیگری ارسال شود.

اگر `BETTER_AUTH_SECRET` تنظیم نشده باشد، برنامه یک کلید پایدار و مستقل را با HMAC و جداسازی دامنه از `REQUEST_SECURITY_SECRET` مشتق می‌کند؛ بنابراین build به‌خاطر نبودن این متغیر متوقف نمی‌شود و secret خام فرم نیز به‌عنوان کلید نشست استفاده نمی‌شود. مقدار اختصاصی همچنان برای production ترجیح دارد. در Production آدرس canonical سایت و در Preview آدرس همان Deployment استفاده می‌شود.

## ساخت اولین حساب مدیر

ثبت‌نام عمومی عمداً غیرفعال است. بعد از اجرای migrationها، حساب مدیر را یک‌بار از محیط امن محلی بسازید:

```bash
ADMIN_NAME="Erfan Rahmati" \
ADMIN_EMAIL="your-admin@example.com" \
ADMIN_PASSWORD="a-long-unique-password" \
npm run admin:create
```

اسکریپت رمز را با الگوریتم سازگار با Better Auth هش می‌کند، مقدار خام را ذخیره یا چاپ نمی‌کند و در صورت وجود ایمیل تکراری هیچ تغییری اعمال نمی‌کند. متغیرهای `ADMIN_*` را در Vercel ذخیره نکنید.

## دیتابیس و دو مقاله اولیه

Migrationها به ترتیب در پوشه `drizzle` قرار دارند:

1. زیرساخت درخواست‌های مشاوره
2. زیرساخت Better Auth
3. جدول‌های مقاله، رسانه، یادداشت و تاریخچه درخواست
4. Seed دو مقالهٔ نهایی با اسلاگ‌های `osool-tarahi-site-herfei` و `web-design-cost-babolsar`
5. اتصال cascade امن رسانه‌ها هنگام حذف دائمی مقاله
6. جدول‌ها، رسانه‌ها و Seed چهار پروژهٔ `fixboo`، `nirvana`، `pixshow` و `amaday-gasht`

Seed با `ON CONFLICT DO NOTHING` نوشته شده است؛ بنابراین اجرای مجدد آن مقاله‌ای با همان slug را بازنویسی نمی‌کند.

دستورات توسعه دیتابیس:

```bash
npm run db:generate
npm run db:check
npm run db:migrate
npm run db:studio
```

## استقرار امن روی Vercel

1. از Neon یک branch یا دیتابیس Preview بسازید.
2. Environment Variables محیط Preview و اتصال Blob را تنظیم کنید.
3. `npm ci` و سپس `npm run db:migrate` را روی دیتابیس Preview اجرا کنید.
4. Preview را از نظر ورود مدیر، ساخت پیش‌نویس، آپلود تصویر، انتشار مقاله و فرم مشاوره آزمایش کنید.
5. از دیتابیس production نسخه پشتیبان بگیرید.
6. migrationها را با `DATABASE_URL_DIRECT` روی production اجرا کنید.
7. نسخه جدید را deploy و مسیرهای `/projects`، `/blog`، `/admin/login`، `/sitemap.xml`، `/feed.xml` و `/llms.txt` را بررسی کنید.

Migration را هم‌زمان از چند deploy اجرا نکنید. تغییر secretهای production باعث خروج نشست‌های قبلی می‌شود؛ این کار را فقط برنامه‌ریزی‌شده انجام دهید.

## کنترل کیفیت

پیش از هر انتشار این دستورات باید بدون خطا اجرا شوند:

```bash
npm run lint
npm run typecheck
npm run db:check
npm run build
```

## معماری مهم

- تمام خواندن و نوشتن دیتابیس در `src/server` قرار دارد.
- هر Server Action و endpoint حساس مستقل از layout، نقش مدیر را دوباره بررسی می‌کند.
- محتوای Tiptap به‌صورت JSON محدود و اعتبارسنجی‌شده ذخیره و با React renderer امن نمایش داده می‌شود؛ HTML خام کاربر render نمی‌شود.
- تصاویر از مرورگر مستقیماً به Blob می‌روند، اما URL امضاشده آپلود فقط بعد از احراز هویت مدیر و بررسی نوع، مسیر و حجم صادر می‌شود و finalize سمت سرور با اتصال OIDC انجام می‌شود.
- حذف دائمی مقاله فقط بعد از آرشیو و واردکردن عبارت تأیید انجام می‌شود.
- صفحات پیش‌نمایش و پنل مدیریت `noindex` هستند.

## محدوده توسعه بعدی

ورود کاربران با شماره موبایل و OTP و ثبت نظر برای پروژه یا مقاله عمداً در این نسخه پیاده‌سازی نشده‌اند تا با نیاز فعلی تداخل نداشته باشند.
