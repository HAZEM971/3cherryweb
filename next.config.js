/** @type {import('next').NextConfig} */
const nextConfig = {
  // تفعيل وضع التصدير الثابت لإنشاء مجلد 'out'
  output: "export", 

  // لأننا على Firebase Hosting (نشر ثابت)، نجعل الصور غير محسّنة
  images: {
    unoptimized: true,
  },
  
  // لتمكين النشر الثابت، يجب تعطيل التوجيهات الديناميكية
  // هذا يضمن أن 'next build' لن يرفض وجود 'force-dynamic'
  // ملاحظة: يجب أيضاً التأكد من حذف أو تعطيل أي استخدام لـ 'force-dynamic' في التطبيق.
  // لا تقم بتعيين هذه القيمة يدوياً إلا إذا كنت متأكداً، ولكن وضع output: "export" كفيل بحل المشكلة إذا تم حذف الكود المتعارض.
};

// ✅ الصيغة الصحيحة للتصدير لحل خطأ ReferenceError في GitHub Actions
export default nextConfig;