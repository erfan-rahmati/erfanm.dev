CREATE TYPE "public"."project_card_layout" AS ENUM('featured', 'standard', 'wide');--> statement-breakpoint
CREATE TYPE "public"."project_media_kind" AS ENUM('hero', 'gallery');--> statement-breakpoint
CREATE TYPE "public"."project_status" AS ENUM('draft', 'published', 'archived');--> statement-breakpoint
CREATE TABLE "project_media_assets" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"project_id" uuid,
	"uploaded_by_id" uuid,
	"kind" "project_media_kind" DEFAULT 'gallery' NOT NULL,
	"url" text NOT NULL,
	"pathname" text NOT NULL,
	"content_type" varchar(100) NOT NULL,
	"size_bytes" integer,
	"alt" varchar(260) NOT NULL,
	"caption" text,
	"created_at" timestamp with time zone DEFAULT now() NOT NULL
);
--> statement-breakpoint
CREATE TABLE "projects" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"slug" varchar(180) NOT NULL,
	"title" varchar(200) NOT NULL,
	"eyebrow" varchar(100) NOT NULL,
	"short_description" varchar(360) NOT NULL,
	"overview" text NOT NULL,
	"challenge" text NOT NULL,
	"solution" text NOT NULL,
	"category" varchar(100) NOT NULL,
	"services" text[] DEFAULT '{}' NOT NULL,
	"technologies" text[] DEFAULT '{}' NOT NULL,
	"highlights" jsonb DEFAULT '[]'::jsonb NOT NULL,
	"hero_image_url" text NOT NULL,
	"hero_image_alt" varchar(260) NOT NULL,
	"gallery_images" jsonb DEFAULT '[]'::jsonb NOT NULL,
	"accent_color" varchar(9) DEFAULT '#6D5CFF' NOT NULL,
	"external_url" text,
	"repository_url" text,
	"card_layout" "project_card_layout" DEFAULT 'standard' NOT NULL,
	"sort_order" integer DEFAULT 0 NOT NULL,
	"status" "project_status" DEFAULT 'draft' NOT NULL,
	"is_featured" boolean DEFAULT false NOT NULL,
	"no_index" boolean DEFAULT false NOT NULL,
	"seo_title" varchar(75),
	"seo_description" varchar(180) NOT NULL,
	"canonical_url" text,
	"published_at" timestamp with time zone,
	"author_id" uuid,
	"updated_by_id" uuid,
	"created_at" timestamp with time zone DEFAULT now() NOT NULL,
	"updated_at" timestamp with time zone DEFAULT now() NOT NULL
);
--> statement-breakpoint
ALTER TABLE "project_media_assets" ADD CONSTRAINT "project_media_assets_project_id_projects_id_fk" FOREIGN KEY ("project_id") REFERENCES "public"."projects"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "project_media_assets" ADD CONSTRAINT "project_media_assets_uploaded_by_id_users_id_fk" FOREIGN KEY ("uploaded_by_id") REFERENCES "public"."users"("id") ON DELETE set null ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "projects" ADD CONSTRAINT "projects_author_id_users_id_fk" FOREIGN KEY ("author_id") REFERENCES "public"."users"("id") ON DELETE set null ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "projects" ADD CONSTRAINT "projects_updated_by_id_users_id_fk" FOREIGN KEY ("updated_by_id") REFERENCES "public"."users"("id") ON DELETE set null ON UPDATE no action;--> statement-breakpoint
CREATE UNIQUE INDEX "project_media_url_unique" ON "project_media_assets" USING btree ("url");--> statement-breakpoint
CREATE UNIQUE INDEX "project_media_path_unique" ON "project_media_assets" USING btree ("pathname");--> statement-breakpoint
CREATE INDEX "project_media_project_idx" ON "project_media_assets" USING btree ("project_id","created_at");--> statement-breakpoint
CREATE UNIQUE INDEX "projects_slug_unique" ON "projects" USING btree ("slug");--> statement-breakpoint
CREATE INDEX "projects_status_sort_idx" ON "projects" USING btree ("status","sort_order");--> statement-breakpoint
CREATE INDEX "projects_featured_idx" ON "projects" USING btree ("is_featured","published_at");--> statement-breakpoint
INSERT INTO "projects" (
	"slug", "title", "eyebrow", "short_description", "overview", "challenge", "solution", "category",
	"services", "technologies", "highlights", "hero_image_url", "hero_image_alt", "gallery_images",
	"accent_color", "card_layout", "sort_order", "status", "is_featured", "no_index", "seo_title",
	"seo_description", "published_at"
) VALUES
(
	'fixboo', 'FixBoo', 'مدیریت یکپارچه کسب‌وکار',
	'وب‌اپلیکیشنی متمرکز برای مدیریت پروژه‌ها، مشتریان، قراردادها و جریان‌های اجرایی در یک محیط روشن و منسجم.',
	$$FixBoo یک تجربه مدیریتی چندبخشی است که اطلاعات پروژه، مشتری، قرارداد و فعالیت‌های روزانه را در یک فضای مشترک جمع می‌کند. طراحی رابط بر خوانایی داده، دسترسی سریع به عملیات پرتکرار و حفظ ریتم کاری در نمایشگرهای مختلف تمرکز دارد.$$,
	$$گستردگی ماژول‌ها و حجم اطلاعات می‌توانست کاربر را با ناوبری پیچیده و داشبوردی شلوغ روبه‌رو کند. مسئله اصلی، ایجاد تعادل میان نمایش جزئیات و حفظ مسیرهای کوتاه برای کارهای روزمره بود.$$,
	$$معماری رابط با سلسله‌مراتب واضح، کارت‌های آماری قابل اسکن و الگوهای تکرارشونده شکل گرفت. نمایش واکنش‌گرا نیز طوری طراحی شد که عملیات اصلی در موبایل بدون حذف زمینه اطلاعاتی در دسترس بماند.$$,
	'وب‌اپلیکیشن مدیریتی', ARRAY['طراحی تجربه کاربری','طراحی رابط کاربری','طراحی داشبورد','توسعه واکنش‌گرا'], ARRAY['معماری اطلاعات','داشبورد مدیریتی','طراحی واکنش‌گرا'],
	'[{
      "title":"داشبورد قابل اسکن","description":"شاخص‌ها و وضعیت‌ها با سلسله‌مراتب روشن برای تصمیم‌گیری سریع نمایش داده می‌شوند."
    },{
      "title":"مدیریت چرخه پروژه","description":"پروژه‌ها، مشتریان و قراردادها در یک ساختار منسجم و قابل پیگیری قرار گرفته‌اند."
    },{
      "title":"تجربه چنددستگاهی","description":"مسیرهای اصلی در دسکتاپ و موبایل با الگوهای تعاملی هماهنگ در دسترس‌اند."
    }]'::jsonb,
	'/images/projects/fixboo/hero.png', 'نمای رابط کاربری و داشبورد پروژه FixBoo',
	'[{"url":"/images/projects/fixboo/gallery-desktop.png","alt":"نمای دسکتاپ داشبورد و مدیریت پروژه FixBoo","caption":"نمای گسترده پنل مدیریت"},{"url":"/images/projects/fixboo/gallery-mobile.png","alt":"نمای موبایل بخش‌های مدیریتی FixBoo","caption":"تجربه واکنش‌گرا در موبایل"}]'::jsonb,
	'#5B73FF', 'featured', 10, 'published', true, false, 'FixBoo | طراحی وب‌اپلیکیشن مدیریت پروژه',
	'جزئیات طراحی FixBoo؛ وب‌اپلیکیشن مدیریت پروژه، مشتریان و قراردادها با داشبورد واکنش‌گرا و تجربه کاربری منسجم.', now()
),
(
	'nirvana', 'Nirvana', 'تجربه فروش آنلاین عطر',
	'فروشگاهی دیجیتال برای کشف و انتخاب عطر، همراه با پنل مدیریتی که کاتالوگ، سفارش‌ها و محتوای محصول را یکپارچه می‌کند.',
	$$Nirvana یک تجربه فروشگاهی با هویت بصری لوکس و آرام است. تمرکز پروژه بر نمایش دقیق محصولات، ایجاد مسیر کشف ساده و پیوند یکپارچه فروشگاه با ابزارهای مدیریتی پشت صحنه قرار دارد.$$,
	$$محصولات عطر به روایت بصری، جزئیات کافی و مقایسه‌ای ساده نیاز دارند؛ در عین حال مدیریت موجودی و سفارش نباید زیر پیچیدگی رابط پنهان شود.$$,
	$$ساختار فروشگاه با فضای تنفس، تصاویر شاخص و کارت‌های محصول خوانا طراحی شد. پنل مدیریت نیز از همان زبان بصری ساده استفاده می‌کند تا کنترل کاتالوگ و سفارش‌ها سریع و کم‌خطا باشد.$$,
	'فروشگاه آنلاین', ARRAY['طراحی فروشگاه اینترنتی','طراحی رابط کاربری','طراحی پنل مدیریت','تجربه موبایل'], ARRAY['تجارت الکترونیک','سیستم طراحی','پنل مدیریت'],
	'[{"title":"کشف آسان محصول","description":"دسته‌بندی و ارائه محصول برای مرور سریع و انتخاب آگاهانه طراحی شده است."},{"title":"هویت بصری منسجم","description":"رنگ، تایپوگرافی و تصاویر، حس لوکس و آرام برند را در تمام صفحات حفظ می‌کنند."},{"title":"مدیریت یکپارچه","description":"کاتالوگ، سفارش و اطلاعات محصول از یک محیط مدیریتی روشن کنترل می‌شوند."}]'::jsonb,
	'/images/projects/nirvana/hero.png', 'نمای فروشگاه آنلاین و پنل مدیریت پروژه Nirvana',
	'[{"url":"/images/projects/nirvana/gallery-desktop.png","alt":"نمای دسکتاپ فروشگاه و پنل Nirvana","caption":"فروشگاه و ابزارهای مدیریتی"},{"url":"/images/projects/nirvana/gallery-mobile.png","alt":"نمای موبایل فروشگاه عطر Nirvana","caption":"مسیر خرید در موبایل"}]'::jsonb,
	'#A46BFF', 'standard', 20, 'published', false, false, 'Nirvana | طراحی فروشگاه آنلاین عطر',
	'جزئیات طراحی Nirvana؛ فروشگاه آنلاین عطر با تجربه خرید واکنش‌گرا، هویت بصری لوکس و پنل مدیریت یکپارچه محصولات و سفارش‌ها.', now()
),
(
	'pixshow', 'PixShow', 'کشف خدمات و کسب‌وکارها',
	'پلتفرمی برای جست‌وجو و کشف کسب‌وکارها که اطلاعات، دسته‌بندی‌ها و مسیر ارتباط را در قالبی سریع و قابل فهم ارائه می‌کند.',
	$$PixShow بستری برای مرور و کشف مجموعه‌ها و خدمات است. صفحه‌ها به‌گونه‌ای طراحی شده‌اند که کاربر بتواند بدون سردرگمی میان دسته‌بندی‌ها حرکت کند، گزینه مناسب را پیدا کند و جزئیات ضروری را در یک نگاه ببیند.$$,
	$$تنوع دسته‌بندی و تعداد نقاط ورود، خطر پراکندگی اطلاعات را ایجاد می‌کرد. کاربر باید بتواند از جست‌وجوی عمومی به نتیجه دقیق برسد و همچنان جایگاه خود را در ساختار محصول بداند.$$,
	$$ناوبری مبتنی بر دسته‌بندی، کارت‌های اطلاعاتی فشرده و الگوهای جست‌وجوی روشن در مرکز طراحی قرار گرفت. نمایش موبایل نیز برای تصمیم‌گیری و تماس سریع بهینه شد.$$,
	'پلتفرم معرفی کسب‌وکار', ARRAY['معماری اطلاعات','طراحی جست‌وجو','رابط کاربری واکنش‌گرا'], ARRAY['جست‌وجوی محصول','دایرکتوری دیجیتال','تجربه موبایل'],
	'[{"title":"جست‌وجوی متمرکز","description":"ورودی جست‌وجو و دسته‌بندی‌ها مسیر رسیدن به نتیجه را کوتاه می‌کنند."},{"title":"کارت‌های اطلاعاتی","description":"اطلاعات ضروری هر مجموعه در قالبی قابل مقایسه و سریع ارائه می‌شود."},{"title":"ناوبری روشن","description":"کاربر در ساختار چنددسته‌ای محصول، زمینه و مسیر خود را حفظ می‌کند."}]'::jsonb,
	'/images/projects/pixshow/hero.png', 'نمای پلتفرم جست‌وجو و معرفی کسب‌وکار PixShow',
	'[{"url":"/images/projects/pixshow/gallery-desktop.png","alt":"نمای دسکتاپ صفحات جست‌وجو و معرفی PixShow","caption":"مرور خدمات در دسکتاپ"},{"url":"/images/projects/pixshow/gallery-mobile.png","alt":"نمای موبایل پلتفرم PixShow","caption":"کشف سریع در موبایل"}]'::jsonb,
	'#4E8CFF', 'standard', 30, 'published', false, false, 'PixShow | طراحی پلتفرم معرفی کسب‌وکار',
	'جزئیات طراحی PixShow؛ پلتفرم جست‌وجو و معرفی کسب‌وکارها با معماری اطلاعات روشن، کارت‌های قابل مقایسه و تجربه موبایل سریع.', now()
),
(
	'amaday-gasht', 'Amaday Gasht', 'برنامه‌ریزی و رزرو سفر',
	'تجربه‌ای دیجیتال برای کشف مقصد، بررسی تورها و آغاز فرایند رزرو با تمرکز بر تصاویر الهام‌بخش و اطلاعات کاربردی سفر.',
	$$Amaday Gasht تجربه‌ای برای الهام گرفتن، بررسی گزینه‌های سفر و حرکت به سمت رزرو است. تصاویر مقصد، اطلاعات کلیدی و پیشنهادهای سفر در ساختاری هماهنگ کنار هم قرار گرفته‌اند تا تصمیم‌گیری ساده‌تر شود.$$,
	$$صفحه سفر باید هم حس کشف و الهام را منتقل می‌کرد و هم اطلاعات عملی موردنیاز برای انتخاب تور را بدون شلوغی در اختیار کاربر می‌گذاشت.$$,
	$$چیدمان تصویری، کارت‌های مقصد و مسیرهای اقدام واضح با هم ترکیب شدند. اطلاعات تکمیلی به‌صورت مرحله‌ای نمایش داده می‌شوند تا رابط در نگاه اول سبک بماند و جزئیات هنگام نیاز در دسترس باشد.$$,
	'گردشگری و رزرو آنلاین', ARRAY['طراحی تجربه سفر','طراحی رابط کاربری','تجربه رزرو','طراحی واکنش‌گرا'], ARRAY['طراحی محتوامحور','رابط رزرو','تجربه چنددستگاهی'],
	'[{"title":"کشف تصویری مقصد","description":"تصاویر و پیشنهادها، مسیر الهام گرفتن و انتخاب مقصد را تقویت می‌کنند."},{"title":"اطلاعات مرحله‌ای","description":"جزئیات سفر در زمان مناسب و بدون سنگین کردن نمای اولیه ارائه می‌شوند."},{"title":"مسیر اقدام واضح","description":"از مرور مقصد تا شروع رزرو، اقدام بعدی همواره قابل تشخیص است."}]'::jsonb,
	'/images/projects/amaday-gasht/hero.png', 'نمای رابط گردشگری و رزرو آنلاین Amaday Gasht',
	'[{"url":"/images/projects/amaday-gasht/gallery-desktop.png","alt":"نمای دسکتاپ سایت گردشگری Amaday Gasht","caption":"کشف مقصد و تور در دسکتاپ"},{"url":"/images/projects/amaday-gasht/gallery-mobile.png","alt":"نمای موبایل رزرو و مقصدهای Amaday Gasht","caption":"تجربه سفر در موبایل"}]'::jsonb,
	'#FF7A59', 'wide', 40, 'published', true, false, 'Amaday Gasht | طراحی سایت گردشگری و رزرو',
	'جزئیات طراحی Amaday Gasht؛ تجربه کشف مقصد و رزرو سفر با رابط تصویری، اطلاعات مرحله‌ای و طراحی واکنش‌گرا برای دسکتاپ و موبایل.', now()
)
ON CONFLICT ("slug") DO NOTHING;
