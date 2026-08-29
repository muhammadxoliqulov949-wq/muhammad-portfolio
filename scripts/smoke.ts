/**
 * Smoke-test: ishlayotgan serverga (default http://localhost:3000) haqiqiy
 * so'rovlar yuborib, kontent + API + admin oqimini tekshiradi.
 *
 *   npm run build && npm run start   # boshqa terminalda
 *   BASE=http://localhost:3000 npm run smoke
 *
 * Chiqish: har tekshiruv uchun ✓/✕ va oxirida hisobot. Bitta bo'lsa ham ✕
 * bo'lsa, jarayon exit 1 bilan tugaydi (CI uchun foydali).
 */

const BASE = (process.env.BASE || "http://localhost:3000").replace(/\/$/, "");
const EMAIL = process.env.ADMIN_EMAIL || "admin@example.com";
const PASSWORD = process.env.ADMIN_PASSWORD || "ChangeMe123!";

/** API javoblarida tekshiriladigan maydonlar (qat'iy tip emas — test uchun yetarli). */
type Row = { id?: number; published?: boolean; email?: string; read?: boolean; title?: string };

let pass = 0;
let fail = 0;
const failures: string[] = [];

/** Javob massivmi? 401/429 holatida ob'ekt keladi — `.some` uni yiqitmasin. */
function rowsOf(text: string): Row[] {
  try {
    const v = JSON.parse(text) as unknown;
    return Array.isArray(v) ? (v as Row[]) : [];
  } catch {
    return [];
  }
}

function ok(name: string, cond: boolean, extra = "") {
  if (cond) {
    pass++;
    console.log(`  ✓ ${name}`);
  } else {
    fail++;
    failures.push(name + (extra ? ` — ${extra}` : ""));
    console.log(`  ✕ ${name}${extra ? ` — ${extra}` : ""}`);
  }
}

async function get(path: string, cookie = "") {
  const res = await fetch(BASE + path, {
    headers: cookie ? { cookie } : undefined,
    redirect: "manual",
  });
  const text = await res.text();
  return { res, text };
}

async function post(path: string, body: unknown, cookie = "") {
  const res = await fetch(BASE + path, {
    method: "POST",
    headers: {
      "content-type": "application/json",
      origin: BASE,
      ...(cookie ? { cookie } : {}),
    },
    body: JSON.stringify(body),
  });
  let json: Record<string, unknown> | null = null;
  const text = await res.text();
  try {
    json = JSON.parse(text);
  } catch {
    /* empty body */
  }
  return { res, json, text };
}

async function main() {
  console.log(`\n▶ BASE = ${BASE}\n`);

  /* ─── 1. Sayt sahifalari ─────────────────────────────────────────────── */
  console.log("1) Sahifalar");
  const home = await get("/");
  ok("GET / → 200", home.res.status === 200, `status=${home.res.status}`);
  ok(
    "Hero identiteti va bo'limlar mavjud",
    ["Student", "AI Developer", "Kimman", "Aloqa", "Yutuqlar"].every((x) => home.text.includes(x)),
  );
  ok("Ish oqimi panellari chiqdi", home.text.includes("hero-panels"));
  ok("Portret freymi (rasm yoki monogram) chiqdi", home.text.includes('<figure class="hero-photo"'));
  ok("Ta'lim bo'limi DB'dan keladi", home.text.includes("International OXUS University"));
  ok("Telefon tel: havolasi bilan", /href="tel:\+998/.test(home.text));
  ok("Soxta mijoz fikri yo'q", !home.text.includes("Mijozlar fikri"));
  ok("Yutuqlar ro'yxati", ["CEFR B1", "DXX 2026"].every((x) => home.text.includes(x)));
  ok("Skip-link bor", home.text.includes("skip-link"));
  ok("JSON-LD bor", home.text.includes("application/ld+json"));
  ok("Tema bootstrap (FOUC oldini oladi)", home.text.includes('data-theme'));
  ok("Uslublar faylida mavjud bo'lmagan klass yo'q", !home.text.includes("aspect-16/9\""));

  const projects = await get("/projects");
  ok("GET /projects → 200", projects.res.status === 200);
  ok("Arxiv loyihalar bilan ochiladi", /loyiha/i.test(projects.text));
  ok("Arxivda 'ishlab chiqilmoqda' holati halol aytilgan", /ishlab chiqilmoqda/i.test(projects.text));

  const publicProjects = JSON.parse((await get("/api/projects")).text) as Row[];
  const firstId = publicProjects[0]?.id;
  ok("Ochiq loyiha topildi (case study testi uchun)", typeof firstId === "number");
  const case1 = await get(`/projects/${firstId}`);
  ok("GET /projects/1 → 200", case1.res.status === 200);
  ok(
    "Case study bo'limlari",
    ["Muammo", "Yechim", "Platforma nima qiladi", "Texnologiya"].every((x) => case1.text.includes(x)),
  );
  ok("Case study'da jonli demo va GitHub havolasi", case1.text.includes("ielts-mock-v2.vercel.app") && case1.text.includes("github.com/muhammadxoliqulov949-wq"));
  ok("Canonical qo'yilgan", case1.text.includes('rel="canonical"'));

  const meta = await get("/robots.txt");
  ok("GET /robots.txt → 200", meta.res.status === 200);
  const sitemap = await get("/sitemap.xml");
  ok(
    "sitemap'da case study URL'i bor",
    typeof firstId === "number" && sitemap.text.includes(`/projects/${firstId}`),
  );
  const og = await get("/opengraph-image");
  ok("GET /opengraph-image → image/png", (og.res.headers.get("content-type") || "").includes("image/"));
  const icon = await get("/icon");
  ok("GET /icon → 200", icon.res.status === 200);
  const nf = await get("/yoq-bunday-sahifa");
  ok("404 brend sahifasi", nf.res.status === 404 && /Sahifa topilmadi/i.test(nf.text), `status=${nf.res.status}`);

  /* ─── 2. Ochiq API ───────────────────────────────────────────────────── */
  console.log("\n2) Ochiq API");
  for (const path of ["/api/education", "/api/achievements"]) {
    const r = await get(path);
    ok(`GET ${path} → massiv`, r.res.status === 200 && Array.isArray(JSON.parse(r.text)), `status=${r.res.status}`);
  }
  {
    const ed = JSON.parse((await get("/api/education")).text) as { institution?: string }[];
    ok("Ta'lim ma'lumoti to'ldirilgan", ed.length > 0 && !!ed[0]?.institution);
    const prof = JSON.parse((await get("/api/profile")).text) as { phone?: string; goals?: string };
    ok("Profielda telefon va rejalar bor", !!prof.phone && !!prof.goals);
  }
  const list = await get("/api/projects");
  const arr = JSON.parse(list.text) as Row[];

  ok("GET /api/projects → massiv", Array.isArray(arr));
  ok("Faqat publish qilinganlar", arr.every((p: Row) => p.published === true));
  const all = await get("/api/projects?all=1");
  ok(
    "all=1 admin'siz qora tasma qaytarmaydi",
    all.res.status === 200 && JSON.parse(all.text).every((p: Row) => p.published === true),
    `status=${all.res.status}`,
  );
  const crossProfile = await fetch(BASE + "/api/profile", {
    method: "PUT",
    headers: { "content-type": "application/json", origin: "https://evil.example" },
    body: JSON.stringify({}),
  });
  ok("Cross-origin PUT /api/profile → 403", crossProfile.status === 403, `status=${crossProfile.status}`);
  const anonWrite = await post("/api/projects", { title: "Hack" });
  ok("Anonim POST /api/projects → 401", anonWrite.res.status === 401, `status=${anonWrite.res.status}`);

  /* ─── 3. Admin oqimi ─────────────────────────────────────────────────── */
  console.log("\n3) Admin");
  let login = await post("/api/auth/login", { email: EMAIL, password: PASSWORD });
  for (let i = 0; i < 2 && login.res.status === 429; i++) {
    const wait = Math.min(45, Number(login.res.headers.get("retry-after") ?? 20) || 20);
    console.log(`  … login rate limit — ${wait}s kutib qayta urilmoqda`);
    await new Promise((r) => setTimeout(r, wait * 1000));
    login = await post("/api/auth/login", { email: EMAIL, password: PASSWORD });
  }
  ok("Login → 200", login.res.status === 200, JSON.stringify(login.json));
  const rawSet = login.res.headers.getSetCookie?.() ?? [];
  const cookie = rawSet.map((c) => c.split(";")[0]).join("; ");
  ok("Session cookie berildi", cookie.includes("portfolio_admin_session"));

  const bad = await post("/api/auth/login", { email: EMAIL, password: "wrong-password" });
  ok("Noto'g'ri parol → 401", bad.res.status === 401, `status=${bad.res.status}`);

  const me = await get("/api/auth/me", cookie);
  ok("GET /api/auth/me → email qaytadi", me.res.status === 200 && me.text.includes(EMAIL));

  const allNow = await get("/api/projects?all=1", cookie);
  ok("admin all=1 → 200", allNow.res.status === 200, `status=${allNow.res.status}`);

  const created = await post(
    "/api/projects",
    {
      title: "Smoke test loyihasi",
      year: "2026",
      role: "Test",
      description: "Bu yozuv smoke-test tomonidan yaratildi va o'chiriladi.",
      tech: "Next.js, SQLite",
    },
    cookie,
  );
  ok("POST /api/projects → 201", created.res.status === 201, JSON.stringify(created.json));
  const newId = created.json?.id as number | undefined;
  ok("Yangi id qaytdi", typeof newId === "number");

  const invalid = await post("/api/projects", { title: "", description: "qisqa", year: "" }, cookie);
  ok(
    "Yaroqsiz forma → 422 + fields",
    invalid.res.status === 422 && !!invalid.json?.fields && Object.keys(invalid.json.fields).length > 0,
    JSON.stringify(invalid.json),
  );

  const patched = await fetch(`${BASE}/api/projects/${newId}`, {
    method: "PATCH",
    headers: { "content-type": "application/json", origin: BASE, cookie },
    body: JSON.stringify({ published: false }),
  });
  ok("PATCH published=false → 200", patched.status === 200, `status=${patched.status}`);
  const hidden = await get("/api/projects");
  ok("Public ro'yxatdan chiqdi", !rowsOf(hidden.text).some((p: Row) => p.id === newId));

  const del = await fetch(`${BASE}/api/projects/${newId}`, {
    method: "DELETE",
    headers: { origin: BASE, cookie },
  });
  ok("DELETE → ok:true", del.status === 200 && (await del.json()).ok === true);
  const delAgain = await fetch(`${BASE}/api/projects/${newId}`, {
    method: "DELETE",
    headers: { origin: BASE, cookie },
  });
  ok("Ikkinchi DELETE → 404", delAgain.status === 404, `status=${delAgain.status}`);

  /* reorder */
  const ids = (JSON.parse((await get("/api/projects?all=1", cookie)).text) as Row[])
    .slice(0, 2)
    .map((p) => p.id as number);
  if (ids.length === 2) {
    const rev = await post(`/api/projects/reorder`, { ids: [ids[1], ids[0]] }, cookie);
    ok("reorder → 200", rev.res.status === 200, JSON.stringify(rev.json));
    const after = JSON.parse((await get("/api/projects?all=1", cookie)).text) as Row[];
    ok(
      "order haqiqatan o'zgardi",
      after[0]?.id === ids[1] || after.findIndex((p: Row) => p.id === ids[1]) < after.findIndex((p: Row) => p.id === ids[0]),
      `first=${after[0]?.id} kutilgan=${ids[1]}`,
    );
    await post(`/api/projects/reorder`, { ids }, cookie);
  }

  /* profile */
  const prof = await get("/api/profile", cookie);
  ok("GET /api/profile → 200", prof.res.status === 200);
  const body = JSON.parse(prof.text);
  const putRes = await fetch(`${BASE}/api/profile`, {
    method: "PUT",
    headers: { "content-type": "application/json", origin: BASE, cookie },
    body: JSON.stringify(body),
  });
  ok("PUT /api/profile → 200 (o'zgarmagan holatga qaytarildi)", putRes.status === 200, `status=${putRes.status}`);


  /* ─── 3b. Portret yuklash (rasm → DB → sayt) ─────────────────────────── */
  console.log("\n3b) Portret yuklash");
  // Test uchun haqiqiy PNG: sharp bilan yasalgan 120×400 solid rangli rasm
  // (portret nisbatiga yaqin — kesish yo'li ham sinovdan o'tadi).
  const { default: sharp } = await import("sharp");
  const tinyPng = await sharp({
    create: { width: 120, height: 400, channels: 3, background: { r: 214, g: 242, b: 92 } },
  })
    .png()
    .toBuffer();
  async function upload(cookie?: string, type = "image/png") {
    const fd = new FormData();
    fd.append("file", new Blob([tinyPng], { type }));
    const res = await fetch(BASE + "/api/media/portrait", {
      method: "POST",
      headers: { origin: BASE, ...(cookie ? { cookie } : {}) },
      body: fd,
    });
    const text = await res.text();
    let json: Record<string, unknown> | null = null;
    try {
      json = JSON.parse(text) as Record<string, unknown>;
    } catch {
      /* rasm javobi yoki bo'sh tana */
    }
    return { res, json, text };
  }

  const anonUp = await upload();
  ok("Anonim yuklash → 401", anonUp.res.status === 401, `status=${anonUp.res.status}`);

  const badType = await upload(cookie, "text/plain");
  ok(
    "Rasm bo'lmagan fayl → 422 + maydon xatosi",
    badType.res.status === 422 && Boolean((badType.json?.fields as Record<string, unknown> | undefined)?.file),
    `status=${badType.res.status}`
  );

  const up = await upload(cookie);
  ok("Admin yuklashi → 200", up.res.status === 200, `status=${up.res.status} ${up.text.slice(0, 140)}`);
  ok(
    "Rasm 4:5 freymga kesiladi",
    up.json?.width === 1100 && up.json?.height === 1375,
    JSON.stringify({ w: up.json?.width, h: up.json?.height })
  );
  ok("profile.photoUrl avtomatik yo'naltirildi", up.json?.url === "/api/media/portrait");

  const served = await fetch(BASE + "/api/media/portrait");
  const etag = served.headers.get("etag") ?? "";
  ok(
    "GET /api/media/portrait → 200 va image/*",
    served.status === 200 && (served.headers.get("content-type") ?? "").startsWith("image/"),
    `status=${served.status}`
  );
  ok("ETag beriladi", etag.length > 0);
  await served.arrayBuffer();
  const reval = await fetch(BASE + "/api/media/portrait", { headers: { "if-none-match": etag } });
  ok("ETag mos kelse → 304", reval.status === 304, `status=${reval.status}`);

  const homeAfter = await get("/");
  ok(
    "Sayt portret almashtirilganini ko'radi (revalidatePath)",
    homeAfter.text.includes("/api/media/portrait")
  );

  const up2 = await upload(cookie);
  ok("Almashtirish eski nusxani qayta yozadi", up2.res.status === 200 && up2.json?.replaced === true);

  const delMedia = await fetch(BASE + "/api/media/portrait", { method: "DELETE", headers: { origin: BASE, cookie } });
  ok("DELETE → 200", delMedia.status === 200, `status=${delMedia.status}`);
  const gone = await fetch(BASE + "/api/media/portrait");
  ok("O'chirilgach → 404", gone.status === 404, `status=${gone.status}`);
  const profAfter = await get("/api/profile");
  ok(
    "photoUrl bo'shatildi (sayt monogramga qaytadi)",
    (JSON.parse(profAfter.text) as { photoUrl?: string }).photoUrl === ""
  );
  /* ─── 4. Kontakt + xabarlar + CSRF ───────────────────────────────────── */
  console.log("\n4) Kontakt va xabarlar");
  const msg = await post("/api/contact", {
    name: "Smoke Test",
    email: "smoke@example.com",
    message: "Bu avtomatik tekshiruv xabari.",
  });
  ok("POST /api/contact → 201", msg.res.status === 201, JSON.stringify(msg.json));
  const honeypot = await post("/api/contact", {
    name: "Bot",
    email: "bot@example.com",
    message: "Bu spam xabari honeypot tufayli saqlanmasligi kerak.",
    website: "http://spam",
  });
  ok("Honeypot → 201 (jimgina rad)", honeypot.res.status === 201);
  const hp = await get("/api/messages?limit=200", cookie);
  ok(
    "Honeypot xabari DB'ga tushmadi",
    !rowsOf(hp.text).some((m: Row) => m.email === "bot@example.com"),
  );

  const msgs = await get("/api/messages", cookie);
  const list2 = JSON.parse(msgs.text) as unknown[];
  ok("GET /api/messages → massiv", Array.isArray(list2) && list2.length > 0);
  const target = (list2 as Row[])[0];
  if (target) {
    const pr = await fetch(`${BASE}/api/messages/${target.id}`, {
      method: "PATCH",
      headers: { "content-type": "application/json", origin: BASE, cookie },
      body: JSON.stringify({ read: true }),
    });
    ok("Xabar PATCH read → 200", pr.status === 200, `status=${pr.status}`);
    const unread = await get("/api/messages?unread=1", cookie);
    ok(
      "unread filtri ishlaydi",
      JSON.parse(unread.text).every((m: Row) => m.read === false),
    );
    const dr = await fetch(`${BASE}/api/messages/${target.id}`, {
      method: "DELETE",
      headers: { origin: BASE, cookie },
    });
    ok("Xabar DELETE → 200", dr.status === 200, `status=${dr.status}`);
  }

  /* ─── 5. Admin UI HTML ───────────────────────────────────────────────── */
  console.log("\n5) Admin UI");
  const adminHtml = await get("/admin", cookie);
  ok("GET /admin (session bilan) → 200", adminHtml.res.status === 200, `status=${adminHtml.res.status}`);
  ok("Admin'da skip-link bor", adminHtml.text.includes("skip-link"));

  const logout = await fetch(`${BASE}/api/auth/logout`, {
    method: "POST",
    headers: { origin: BASE, cookie },
  });
  ok("Logout → 200", logout.status === 200);
  // Cookie o'chirilgan AND token ham bekor qilingan (stateless JWT revoke)
  const afterLogout = await get("/api/messages", cookie);
  ok(
    "Logout'dan keyin eski token ham ishlamaydi → 401",
    afterLogout.res.status === 401,
    `status=${afterLogout.res.status}`,
  );
  // Bir sekunda to'g'ri keladigan qayta kirish 401 bo'lib qolmasligi kerak
  const relogin = await post("/api/auth/login", { email: EMAIL, password: PASSWORD });
  const freshCookie = (relogin.res.headers.getSetCookie?.() ?? []).map((c) => c.split(";")[0]).join("; ");
  ok(
    "Darhol qayta login → yangi token ishlaydi",
    relogin.res.status === 200 && (await get("/api/messages", freshCookie)).res.status === 200,
    `login=${relogin.res.status}`,
  );

  console.log(
    `\n────────────────────────────\n  ✓ ${pass}   ✕ ${fail}${
      failures.length ? `\n\nMuvaffaqiyatsiz:\n${failures.map((f) => "  • " + f).join("\n")}` : ""
    }\n`,
  );
  process.exit(fail > 0 ? 1 : 0);
}

main().catch((err) => {
  console.error("\n✖ Smoke-test o'zi xato berdi:", err?.message ?? err);
  console.error("  Server ishlayaptimi?  npm run build && npm run start\n");
  process.exit(1);
});
