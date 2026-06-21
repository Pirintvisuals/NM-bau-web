# Blog — telepítés Rackhost tárhelyre

A blog egy önálló PHP rendszer a `blog/` mappában. A tulajdonos a
`www.nmbau.hu/blog/admin` oldalon ír, és a **Közzététel** gombra kattintva a
bejegyzés **azonnal** megjelenik a `www.nmbau.hu/blog` oldalon — nincs build,
nincs külső szolgáltatás, nincs GitHub. A bejegyzések egyszerű fájlokként
tárolódnak a tárhelyen (nincs szükség adatbázisra).

---

## A. A weboldal feltöltése (Rackhost fájlkezelő / cPanel)

1. Lépj be a Rackhost vezérlőpultba → **Fájlkezelő** (vagy cPanel → File Manager).
2. Nyisd meg a weboldal gyökérmappáját (általában `public_html` vagy `web`).
3. **Töltsd fel a teljes oldalt:**
   - A `dist/` mappa **tartalmát** (index.html, a többi .html, és az `assets/`
     mappa) a gyökérbe.
     - A `dist/` a `node build-static.js` futtatásával készül a gépeden.
   - **És** a `blog/` mappát egészben, szintén a gyökérbe.
   - Az eredmény szerkezet a szerveren:
     ```
     /index.html, /szolgaltatasok.html, ... 
     /assets/...
     /blog/  (ebben az index.php, post.php, admin/, inc/, data/, uploads/)
     ```
4. **PHP verzió:** a Rackhost panelban ellenőrizd, hogy a tárhelyhez **PHP 8.x**
   van beállítva (alapból általában igen).

> ⚠️ Amikor később frissíted a fő oldalt, **NE töröld a `/blog/` mappát** — a
> bejegyzések és a feltöltött képek ott élnek a szerveren. Csak a .html
> fájlokat és az `assets/` mappát írd felül.

## B. Írási/feltöltési jogosultság

A blognak írnia kell két mappába: `blog/data/` és `blog/uploads/`.
Megosztott tárhelyen ez általában alapból működik. Ha mégis hibát jelez
mentéskor, a fájlkezelőben állítsd be ezeknek a mappáknak a jogosultságát
**755**-re (vagy ha kell, 775-re).

## C. Domain beállítás (egyszer)

Nyisd meg a `blog/inc/config.php` fájlt, és a `SITE_URL` értéket állítsd a
végleges címre (https-sel), ha még nem az:

```php
const SITE_URL = 'https://www.nmbau.hu';
```

---

## Kész! Így használja a tulajdonos

1. Megnyitja: **`https://www.nmbau.hu/blog/admin`**
2. **Első alkalommal** beállít egy jelszót (legalább 8 karakter). A rendszer
   biztonságosan elmenti — legközelebb ezzel lép be.
3. **+ Új bejegyzés** → beírja a címet, kiválasztja a dátumot, feltölt egy
   borítóképet, és a szövegszerkesztőben megírja a bejegyzést (félkövér,
   címsorok, listák, linkek, képek — mint egy Word).
4. **Közzététel** → pár másodperc múlva él a `www.nmbau.hu/blog` oldalon.
   - Ha még nem kész: pipáld be a **Piszkozat** kapcsolót, akkor nem jelenik meg.
5. Régi bejegyzést bármikor **Szerkeszthet** vagy **Törölhet** a listából.

---

## Hogyan épül fel (fejlesztői infó)

- `blog/index.php` — blog lista (nyilvános), `blog/post.php` — egy bejegyzés.
- `blog/admin/index.php` — belépés + vezérlőpult + szerkesztő (TinyMCE).
- `blog/admin/upload.php` — a szerkesztőbe illesztett képek feltöltése.
- `blog/inc/functions.php` — tárolás, belépés, és a fő oldal nav+footer
  átvétele (a `/index.html`-ből vágja ki, így a blog mindig az oldal
  arculatát viseli).
- `blog/data/posts/*.json` — a bejegyzések (egy fájl = egy bejegyzés).
- `blog/uploads/` — a feltöltött képek.
- `blog/data/password.php` — a jelszó hash-e (az első indításkor jön létre,
  a böngészőből nem elérhető).
- Szép URL-ek: `blog/.htaccess` (`/blog/<slug>`), mod_rewrite szükséges
  (a Rackhost támogatja).

A „Blog” menüpont az összes oldal navigációjában a `/blog/` mappára mutat.
A jelszó megváltoztatása: töröld a `blog/data/password.php` fájlt, és a
`/blog/admin` újra megkér egy új jelszó beállítására.
