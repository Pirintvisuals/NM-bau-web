# Blog + weboldal telepítése Rackhost tárhelyre — részletes útmutató

A blog egy önálló **PHP** rendszer a `blog/` mappában. A tulajdonos a
`www.nmbau.hu/blog/admin` oldalon ír, és a **Közzététel** gombbal a bejegyzés
**azonnal** él a `www.nmbau.hu/blog` oldalon — nincs build, nincs külső
szolgáltatás, nincs adatbázis. A bejegyzések egyszerű JSON fájlok a tárhelyen.

---

## ⚠️ A legfontosabb tudnivaló

A blog PHP kódja (`blog/inc/functions.php`) **beolvassa a `/index.html`-t**
ugyanarról a szerverről, hogy a fő oldal **navigációját és láblécét** átvegye.
Ezért a blognak **és** a fő oldalnak **ugyanazon a Rackhost tárhelyen, egymás
mellett** kell lennie. A fő oldal NEM lehet Vercelen, ha a blog Rackhoston van.

A cél szerkezet a szerver gyökerében (általában `web/` vagy `public_html/`):

```
public_html/
├── index.html, szolgaltatasok.html, referenciak.html, ...  (a fő oldal)
├── assets/                                                  (css, js, képek)
└── blog/                                                    (a PHP rendszer)
    ├── index.php, post.php, .htaccess
    ├── admin/  inc/
    ├── data/      ← írhatónak kell lennie
    └── uploads/   ← írhatónak kell lennie
```

---

## 1. lépés — A fő oldal buildelése a gépen

A projekt `.html` fájljai csak források. A végleges oldal a `dist/` mappába kerül.

```
node build-static.js
```

Ez frissíti a **`dist/`** mappát (kész `index.html` + a többi oldal + `assets/`).
A `blog/` mappa NEM része a `dist/`-nek — azt külön töltöd fel.

## 2. lépés — Két ZIP készítése

A gyökérben már elkészültek (a `node build-static.js` után újragenerálhatók):

- **`site.zip`** — a `dist/` **tartalma** (az `index.html` a zip tetején van,
  NEM `dist/index.html`).
- **`blog.zip`** — a teljes `blog/` mappa (a zipben `blog/...` szerkezettel).

PowerShell-ből újra:
```
Compress-Archive -Path dist\* -DestinationPath site.zip -Force
Compress-Archive -Path blog  -DestinationPath blog.zip -Force
```

## 3. lépés — Belépés a Rackhost fájlkezelőbe

1. rackhost.hu → belépés → a tárhely → **Fájlkezelő** (vagy cPanel → File Manager).
2. Lépj be a **web gyökérbe** (Rackhoston általában **`web`**, néhol `public_html`).
   Ez az a mappa, aminek a tartalma a `www.nmbau.hu/` címen jelenik meg.

## 4. lépés — A fő oldal feltöltése (ELŐSZÖR ezt)

1. A web gyökérben **Feltöltés** → `site.zip`.
2. **Kicsomagolás** a jelenlegi mappába.
3. Most a gyökérben kell lennie: `index.html`, a többi oldal és az `assets/`.
4. Töröld a `site.zip`-et.
5. Teszt: nyisd meg `https://www.nmbau.hu` — a fő oldal betölt.

## 5. lépés — A blog feltöltése

1. Ugyanitt **Feltöltés** → `blog.zip`.
2. **Kicsomagolás** → létrejön a **`blog/`** mappa az `index.html` mellett.
3. Ha a `.htaccess` nem látszik, kapcsold be a **rejtett fájlok mutatását** a
   fájlkezelőben, és ellenőrizd, hogy a `blog/.htaccess` ott van (a szép
   URL-ekhez kell).

## 6. lépés — PHP verzió beállítása

A Rackhost panelban **PHP verzió** → **8.x** (8.1 / 8.2 / 8.3 bármelyik jó).
A `blog/inc/config.php` már helyes: `SITE_URL = 'https://www.nmbau.hu'`,
időzóna `Europe/Budapest` — ezeken nem kell változtatni.

## 7. lépés — Írási jog a data/ és uploads/ mappákra

A blog ide ír: `blog/data/` (bejegyzések + jelszó) és `blog/uploads/` (képek).
Megosztott tárhelyen általában alapból működik. Ha mentéskor jogosultsági hibát
kapsz: a fájlkezelőben a két mappa **Jogosultságok (CHMOD)** → **755** (ha kell, **775**).

## 8. lépés — Első indítás: jelszó beállítása

1. Nyisd meg: `https://www.nmbau.hu/blog/admin`
2. Mivel még nincs jelszó, a rendszer kér egyet (**min. 8 karakter**), kétszer.
3. Ez létrehozza a `blog/data/password.php`-t (biztonságos hash, böngészőből nem
   elérhető). Mostantól ezzel lép be a tulajdonos.

> Jelszó reset: töröld a `blog/data/password.php` fájlt, és a `/blog/admin` újra
> kér egy új jelszót.

## 9. lépés — Teljes teszt

1. Admin → **+ Új bejegyzés** → cím, dátum, borítókép, szöveg → **Közzététel**.
2. `https://www.nmbau.hu/blog` → a bejegyzés megjelenik a listában.
3. Rákattintva szép URL-en nyílik: `https://www.nmbau.hu/blog/<slug>`
   (ez igazolja, hogy a `.htaccess` + mod_rewrite működik).

---

## ⚠️ Aranyszabály a későbbi frissítésekhez

A fő oldal frissítésekor:
1. `node build-static.js` a gépen.
2. Töltsd fel **csak** a `.html` fájlokat és az `assets/` mappát.
3. **SOHA ne töröld/írd felül a `/blog/` mappát** — a tulajdonos bejegyzései és
   feltöltött képei csak a szerveren élnek (`blog/data/`, `blog/uploads/`),
   nincsenek a helyi projektben. A `blog/` felülírása törölné a tartalmat.

---

## Hibaelhárítás

| Tünet | Ok | Megoldás |
|---|---|---|
| A `.php` fájl **letöltődik** vagy nyers kód látszik | PHP nincs bekapcsolva | 6. lépés (PHP 8.x) |
| A lista megy, de egy bejegyzés **404** | `.htaccess` hiányzik / nincs mod_rewrite | 5. lépés; Rackhost alapból támogatja, ha nem, kérd a support segítségét |
| **"Permission denied"** mentéskor | `data/`/`uploads/` nem írható | 7. lépés (CHMOD 755 → 775) |
| Blog betölt, de a **nav/footer hibás** | `index.html` nincs a web gyökérben | 4. lépés — `index.html` a `blog/` mellett legyen |
| A feltöltött képek nem látszanak | `uploads/` nem írható / rossz domain | 7. lépés; `SITE_URL` egyezzen a valós domainnel |
| `nmbau.hu` (www nélkül) hibás linkek | `SITE_URL` `www.`-vel van | non-www → www átirányítás Rackhoston, vagy `config.php`-ban a `SITE_URL` igazítása |

---

## Hogyan épül fel (fejlesztői infó)

- `blog/index.php` — blog lista (nyilvános), `blog/post.php` — egy bejegyzés.
- `blog/admin/index.php` — belépés + vezérlőpult + szerkesztő (TinyMCE).
- `blog/admin/upload.php` — a szerkesztőbe illesztett képek feltöltése.
- `blog/admin/demo.php` — bemutató szerkesztő (NINCS belépés, NEM ment); az
  ügyfélnek mutatható, hogy néz ki egy bejegyzés írása. Bármikor törölhető.
- `blog/inc/functions.php` — tárolás, belépés, és a fő oldal nav+footer átvétele
  (a `/index.html`-ből vágja ki, így a blog mindig az oldal arculatát viseli).
- `blog/data/posts/*.json` — a bejegyzések (egy fájl = egy bejegyzés).
- `blog/uploads/` — a feltöltött képek.
- `blog/data/password.php` — a jelszó hash-e (első indításkor jön létre).
- Szép URL-ek: `blog/.htaccess` (`/blog/<slug>`), mod_rewrite szükséges.
