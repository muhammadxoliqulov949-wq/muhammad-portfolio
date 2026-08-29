Portret — ikki xil yo'l bilan qo'yiladi (biri ham majburiy emas):

1) ADMIN PANEL (tavsiya): /admin → Profil → «Portret» kartasi — faylni
   tanlash, sürülash yoki ⌘/Ctrl+V. Yuklangan rasm sayt bazasida saqlanadi va
   sayt uni /api/media/portrait orqali oladi. Vercel'da fayl tizimi read-only,
   shuning uchun yuklash shu yo'l bilan ishlaydi (bu papka emas).

   Bosh sahifada ham: admin kirgan holda portret freymi burchagida «+»
   tugmasi chiqadi — o'sha yerdan almashtirish mumkin (mehmonlar ko'rmaydi).

2) Bu papka: `portrait.jpg` (yoki .png/.webp/.avif) faylini shu yerga
   tashlab commit qilsangiz, DB'da «Portret URL» bo'sh bo'lsa sayt uni oladi.

Rasm bo'lmasa — hero'da monogram freym turadi, buzuq rasm ko'rsatilmaydi.
