# 🌱 PlantX Scrum Pro Dashboard

لوحة متابعة مشروع تخرج النباتات (ذكاء اصطناعي ونظام إدارة متكامل) مصممة لتنظيم مهام الفريق، تتبع أداء الأعضاء، وإدارة دورة حياة المشروع بنظام Scrum و Kanban.

---

## 🛠️ التقنيات المستخدمة (Tech Stack)
* **Frontend:** React.js, Tailwind CSS / Custom CSS
* **Backend:** Node.js, Express.js, Mongoose
* **Database:** MongoDB Atlas (NoSQL)

---

## 📋 متطلبات التشغيل المسبقة (Prerequisites)
تأكد من تثبيت الأدوات التالية على جهازك قبل البدء:
* [Node.js](https://nodejs.org/) (الإصدار الحديث LTS)
* حساب نشط على [MongoDB Atlas](https://cloud.mongodb.com/) وقاعدة بيانات جاهزة.

---

## ⚙️ خطوات التشغيل المحلي (Local Setup Instructions)

### 1️⃣ استنساخ المستودع (Clone Repository)
افتح الـ Terminal وانقل المشروع لجهازك:
```bash
git clone [https://github.com/Z-Haneen/personal-scrum-.git](https://github.com/Z-Haneen/personal-scrum-.git)
cd personal-scrum-
2️⃣ إعداد وتهيئة الـ Backend
انتقل إلى مجلد الـ backend:

Bash
cd backend
ثبّت الحزم المطلوبة:

Bash
npm install
أنشئ ملف .env داخل مجلد الـ backend واكتب بداخله المتغيرات التالية:

مقتطف الرمز
PORT=5000
MONGO_URI=mongodb+srv://<username>:<password>@cluster0.ehq5yop.mongodb.net/<dbname>?retryWrites=true&w=majority
(ملاحظة: استبدل <username> و <password> ببيانات حسابك على MongoDB Atlas).

إعدادات الشبكة في MongoDB Atlas:

تأكد من فتح لوحة تحكم MongoDB Atlas.

من القائمة الجانبية، اختر Network Access وأضف الـ IP الخاص بك (Add Current IP Address أو 0.0.0.0/0 للسماح بالاتصال).

تأكد أن الـ Cluster بحالة Active وليست معطلة (Resumed).

شغل سيرفر الـ Backend:

Bash
node server.js
يجب أن تظهر لك رسالة: Server running on port 5000 ورسالة الاتصال بقاعدة البيانات.

3️⃣ إعداد وتشغيل الـ Frontend
افتح نافذة Terminal جديدة وانتقل لمجلد الـ frontend:

Bash
cd frontend
ثبّت الحزم المطلوبة:

Bash
npm install
شغل تطبيق الواجهة الأمامية:

Bash
npm start
سيفتح المتصفح تلقائياً على الرابط: http://localhost:3000 لتظهر لك لوحة التحكم بكامل ميزاتها!

🚀 النشر على الإنترنت (Deployment)
Frontend: مرفوع ومرتبط تلقائياً عبر منصة Vercel مع ضبط Root Directory على frontend.

Backend: يمكن رفعه على منصات سحابية مجانية مثل Render أو Railway ليعمل 24/7 دون الحاجة لترك اللابتوب مفتوحاً محلياً.
