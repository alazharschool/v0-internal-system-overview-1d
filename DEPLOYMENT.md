# نشر على Vercel

## الخطوات السريعة للنشر:

### 1. التحقق من البيئة المحلية
\`\`\`bash
# تحديث المشروع
npm install

# اختبار البناء محلياً
npm run build

# اختبار التشغيل
npm run dev
\`\`\`

### 2. التحقق من المتغيرات البيئية
تأكد من أن لديك في `.env.local`:
\`\`\`
NEXT_PUBLIC_SUPABASE_URL=
NEXT_PUBLIC_SUPABASE_ANON_KEY=
\`\`\`

### 3. إرسال التغييرات إلى Git
\`\`\`bash
# إضافة جميع التغييرات
git add .

# إنشاء رسالة Commit
git commit -m "feat: Add student and class editing with enhanced toast messages"

# دفع إلى المستودع
git push origin main
\`\`\`

### 4. النشر على Vercel
الطريقة 1 - من خلال واجهة Vercel:
- اذهب إلى https://vercel.com
- انقر على "New Project"
- حدد المستودع الخاص بك
- سيتم النشر تلقائياً

الطريقة 2 - باستخدام CLI:
\`\`\`bash
# تثبيت Vercel CLI
npm i -g vercel

# النشر
vercel
\`\`\`

### 5. التحقق من المتغيرات على Vercel
- اذهب إلى Project Settings
- اختر Environment Variables
- أضف:
  - `NEXT_PUBLIC_SUPABASE_URL`
  - `NEXT_PUBLIC_SUPABASE_ANON_KEY`

## المشاكل الشائعة وحلولها:

### مشكلة: Build Failed
- تحقق من الأخطاء في Console
- تأكد من استيراد جميع المكتبات بشكل صحيح

### مشكلة: Database Connection Error
- تحقق من متغيرات البيئة
- تأكد من أن Supabase مفعل

### مشكلة: بطء في التحميل
- تحقق من حجم الحزم
- استخدم `next/image` للصور

## نصائح مهمة:

✅ تأكد من أن جميع الاستيرادات صحيحة
✅ اختبر محلياً قبل النشر
✅ تحقق من رسائل الخطأ في Console
✅ استخدم Vercel Analytics لتتبع الأداء
\`\`\`

الآن دعني أنشئ سكريبت للمساعدة في النشر:
