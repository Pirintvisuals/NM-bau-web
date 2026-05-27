"use client";

import { motion, useInView, AnimatePresence } from "framer-motion";
import { useRef, useState, useEffect } from "react";
import { ImagesSlider } from "@/components/ui/images-slider";
import {
  ArrowRight, Phone, Mail, MapPin,
  Menu, X, ShieldCheck, Clock, BadgeCheck, Heart,
  ChevronRight, ChevronDown, Check,
} from "lucide-react";

/* ─────────────────────────────────────────
   HELPERS
───────────────────────────────────────── */
function FadeIn({
  children, delay = 0, className = "", direction = "up",
}: {
  children: React.ReactNode; delay?: number;
  className?: string; direction?: "up" | "left" | "right";
}) {
  const ref = useRef<HTMLDivElement>(null);
  const inView = useInView(ref, { once: true, margin: "-80px" });
  const initial =
    direction === "left" ? { opacity: 0, x: -32 }
    : direction === "right" ? { opacity: 0, x: 32 }
    : { opacity: 0, y: 28 };
  return (
    <motion.div ref={ref}
      initial={initial}
      animate={inView ? { opacity: 1, x: 0, y: 0 } : initial}
      transition={{ duration: 0.7, delay, ease: [0.16, 1, 0.3, 1] }}
      className={className}
    >{children}</motion.div>
  );
}

function CountUp({ to, suffix = "" }: { to: number; suffix?: string }) {
  const ref = useRef<HTMLSpanElement>(null);
  const inView = useInView(ref, { once: true });
  const [val, setVal] = useState(0);
  useEffect(() => {
    if (!inView) return;
    let start: number | undefined;
    const tick = (ts: number) => {
      if (!start) start = ts;
      const p = Math.min((ts - start) / 2000, 1);
      setVal(Math.floor(to * (1 - Math.pow(1 - p, 3))));
      if (p < 1) requestAnimationFrame(tick); else setVal(to);
    };
    requestAnimationFrame(tick);
  }, [inView, to]);
  return <span ref={ref}>{val}{suffix}</span>;
}

function Eyebrow({ children, center }: { children: React.ReactNode; center?: boolean }) {
  return (
    <div className={`inline-flex items-center gap-3 text-nm-gold text-[0.6875rem] font-bold tracking-[0.18em] uppercase mb-5 ${center ? "justify-center" : ""}`}>
      <span className="w-7 h-px bg-nm-gold flex-shrink-0" />
      {children}
    </div>
  );
}

/* ─────────────────────────────────────────
   DATA
───────────────────────────────────────── */
const HERO_IMAGES = [
  "https://images.unsplash.com/photo-1600047509807-ba8f99d2cdde?q=80&w=1992&auto=format&fit=crop",
  "https://images.unsplash.com/photo-1600596542815-ffad4c1539a9?q=80&w=2075&auto=format&fit=crop",
  "https://images.unsplash.com/photo-1600210492486-724fe5c67fb3?q=80&w=2074&auto=format&fit=crop",
];

const SERVICES = [
  {
    num: "01", title: "Általános Kivitelezés",
    desc: "Lakóépületek, irodaházak és kereskedelmi ingatlanok teljes körű kivitelezése tervezéstől a kulcsrakész átadásig.",
    img: "https://images.unsplash.com/photo-1503387762-592deb58ef4e?q=80&w=1471&auto=format&fit=crop",
  },
  {
    num: "02", title: "Felújítás és Bővítés",
    desc: "Meglévő ingatlanok prémium felújítása és bővítése — egy régi villa modernizálásától egy irodatér teljes átalakításáig.",
    img: "https://images.unsplash.com/photo-1558618666-fcd25c85cd64?q=80&w=1470&auto=format&fit=crop",
  },
  {
    num: "03", title: "Belső Tér Kialakítás",
    desc: "Prémium belső terek kialakítása igényes anyaghasználattal és kézműves részletgazdagsággal.",
    img: "https://images.unsplash.com/photo-1556909114-f6e7ad7d3136?q=80&w=1470&auto=format&fit=crop",
  },
];

const WHY_FEATURES = [
  { Icon: BadgeCheck, title: "Igazolt szakmai tapasztalat", desc: "15+ év az iparágban, 250+ sikeresen befejezett projekt." },
  { Icon: ShieldCheck, title: "Átlátható árazás, nulla meglepetés", desc: "Részletes árajánlat, rögzített mérföldkövek, folyamatos tájékoztatás." },
  { Icon: Clock,       title: "Határidő-tartás garantálva",   desc: "Reális ütemtervet készítünk és tartjuk — szerződésben rögzítjük." },
  { Icon: Heart,       title: "Prémium anyagok, 2 éves garancia", desc: "Bevizsgált anyagok, minden munkára 2 éves garancia." },
];

interface ProcessStep {
  num: string; title: string; intro: string;
  bullets?: string[]; note?: string;
}
const PROCESS: ProcessStep[] = [
  {
    num: "01", title: "Kapcsolatfelvétel",
    intro: "A felújítás egy rövid egyeztetéssel indul, ahol átbeszéljük az elképzeléseket, a fürdőszoba jelenlegi állapotát és a kívánt stílust.",
    bullets: ["Fotók vagy alaprajz küldése nagyban segíti az első konzultációt."],
  },
  {
    num: "02", title: "Helyszíni felmérés",
    intro: "A pontos árajánlathoz személyes felmérés szükséges. A helyszínen:",
    bullets: [
      "pontos méreteket veszünk fel",
      "ellenőrizzük a víz- és lefolyó kiállásokat",
      "átbeszéljük a műszaki lehetőségeket",
      "javaslatokat adunk a praktikusabb és esztétikusabb kialakításra",
      "szükség esetén látványtervet készítünk",
    ],
    note: "Külön figyelmet fordítunk arra, hogy a tervezett megoldás hosszú távon is megbízható és könnyen használható legyen.",
  },
  {
    num: "03", title: "Árajánlat és tervezés",
    intro: "A felmérés után részletes árajánlat készül, amely tartalmazza:",
    bullets: [
      "a munkafolyamatokat",
      "a vállalt kivitelezési tartalmat",
      "az anyagigényeket",
      "a várható ütemezést",
      "a fizetési ütemezést",
    ],
    note: "Itt véglegesítjük a burkolatokat, szanitereket, zuhanymegoldásokat, falpaneleket, világítást és egyéb részleteket.",
  },
  {
    num: "04", title: "Előkészítés és védelem",
    intro: "A munkakezdés előtt kiemelten figyelünk a tisztaságra és a pormentes kivitelezésre. Ennek része:",
    bullets: [
      "közlekedési útvonalak védelme",
      "takarás",
      "csúszásmentes padlóvédelem",
      "porvédő ajtó használata",
      "napi takarítás",
    ],
    note: "Célunk, hogy a felújítás a lehető legkevesebb kellemetlenséggel járjon.",
  },
  {
    num: "05", title: "Bontási munkák",
    intro: "A régi burkolatok, szaniterek és vezetékek bontása után előkészítjük a helyiséget az új rendszer kialakítására. Szükség esetén:",
    bullets: [
      "aljzatjavítást",
      "faljavítást",
      "szerkezeti módosításokat",
      "előtétfal építést is végzünk",
    ],
  },
  {
    num: "06", title: "Gépészet és elektromos előkészítés",
    intro: "Ebben a szakaszban készülnek el:",
    bullets: [
      "víz- és lefolyó vezetékek",
      "zuhany és WC kiállások",
      "Geberit rendszer",
      "elektromos kiállások",
      "világítás előkészítése",
      "elszívás kialakítása",
    ],
    note: "A pontos méretezésre és használhatóságra kiemelt figyelmet fordítunk.",
  },
  {
    num: "07", title: "Vízszigetelés",
    intro: "A fürdőszoba egyik legfontosabb része a megfelelő vízszigetelés. Csak megfelelő technológiával és minőségi anyagokkal dolgozunk, különösen a zuhanyzónákban.",
  },
  {
    num: "08", title: "Burkolás / falpanelezés",
    intro: "Az ügyfél igénye alapján készülhet:",
    bullets: [
      "hagyományos csempeburkolat",
      "nagyméretű lap",
      "vinyl burkolat",
      "SPC/PVC falpanel",
      "mikrocement felület",
    ],
    note: "A kivitelezés során törekszünk a modern, letisztult megjelenésre és a könnyű tisztíthatóságra.",
  },
  {
    num: "09", title: "Szaniterek és befejező munkák",
    intro: "A burkolás után beépítjük:",
    bullets: [
      "zuhanytálcát vagy walk-in zuhanyt",
      "zuhanyfalat",
      "WC-t",
      "mosdót",
      "csaptelepeket",
      "bútorokat",
      "kiegészítőket",
    ],
    note: "Ezután elvégezzük a végső szilikonozást, finombeállításokat és ellenőrzéseket.",
  },
  {
    num: "10", title: "Takarítás és átadás",
    intro: "A munka végén kitakarítjuk a munkaterületet és közösen átadjuk a kész fürdőszobát. Az átadás során:",
    bullets: [
      "minden funkciót ellenőrzünk",
      "bemutatjuk a használatot",
      "átadjuk a szükséges információkat és garanciát",
    ],
  },
];

const WHY_CHOOSE = [
  "Komplett kivitelezés egy kézben",
  "Pontos és átgondolt munkaszervezés",
  "Modern és praktikus megoldások",
  "Tiszta, kulturált munkavégzés",
  "Folyamatos kommunikáció",
  "Megbízható csapat és minőségi kivitelezés",
];

const PORTFOLIO = [
  { title: "Budai Villa Felújítás",  cat: "Luxuslakás · 2024",    img: "https://images.unsplash.com/photo-1613977257363-707ba9348227?q=80&w=1470&auto=format&fit=crop", large: true },
  { title: "Pesti Irodaház",         cat: "Kereskedelmi · 2024",  img: "https://images.unsplash.com/photo-1487958449943-2429e8be8625?q=80&w=1470&auto=format&fit=crop" },
  { title: "Modern Penthouse",       cat: "Belső tér · 2023",     img: "https://images.unsplash.com/photo-1560448205-4d9b3e6bb6db?q=80&w=1470&auto=format&fit=crop" },
  { title: "Balatoni Nyaraló",       cat: "Lakóépület · 2023",    img: "https://images.unsplash.com/photo-1512917774080-9991f1c4c750?q=80&w=1470&auto=format&fit=crop" },
  { title: "Étterem Kialakítás",     cat: "Belső tér · 2023",     img: "https://images.unsplash.com/photo-1414235077428-338989a2e8c0?q=80&w=1470&auto=format&fit=crop" },
  { title: "Budakeszi Kúria",        cat: "Felújítás · 2022",     img: "https://images.unsplash.com/photo-1600566752229-250ed79470f8?q=80&w=1470&auto=format&fit=crop" },
];

/* ─────────────────────────────────────────
   PAGE
───────────────────────────────────────── */
export default function Home() {
  const [scrolled, setScrolled] = useState(false);
  const [mobileOpen, setMobileOpen] = useState(false);
  const [openStep, setOpenStep] = useState<number | null>(0);

  useEffect(() => {
    const fn = () => setScrolled(window.scrollY > 50);
    window.addEventListener("scroll", fn, { passive: true });
    return () => window.removeEventListener("scroll", fn);
  }, []);

  const navLinks = [
    { label: "Szolgáltatások", href: "#services" },
    { label: "Rólunk",         href: "#why" },
    { label: "Folyamat",       href: "#process" },
    { label: "Portfólió",      href: "#portfolio" },
    { label: "Kapcsolat",      href: "#contact" },
  ];

  /* Headline lines for the split-reveal animation */
  const headline = ["Ahol az álom", "valósággá", "válik."];

  return (
    <>
      {/* ═══════════════════════════════════════
          NAV
      ═══════════════════════════════════════ */}
      <nav className={`fixed inset-x-0 top-0 z-[100] h-[72px] flex items-center transition-all duration-300
        ${scrolled ? "bg-[rgba(12,10,9,0.92)] backdrop-blur-xl border-b border-nm-border-subtle" : ""}`}
      >
        <div className="max-w-6xl mx-auto px-6 lg:px-10 w-full flex items-center justify-between gap-6">
          <a href="#hero" className="flex-shrink-0" aria-label="NM Bau főoldal">
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img src="/nm-bau.jpg" alt="NM Bau" className="h-10 w-auto" style={{ filter: "invert(1) brightness(0.92)" }} />
          </a>
          <ul className="hidden md:flex items-center gap-8 list-none m-0 p-0">
            {navLinks.map(({ label, href }) => (
              <li key={href}>
                <a href={href} className="text-[0.875rem] font-medium text-nm-muted hover:text-nm-text transition-colors duration-200 cursor-pointer">
                  {label}
                </a>
              </li>
            ))}
          </ul>
          <a href="#contact" className="hidden md:inline-flex items-center gap-2 bg-nm-gold text-nm-bg text-[0.8125rem] font-semibold px-5 py-2.5 hover:bg-nm-gold-light transition-colors flex-shrink-0 cursor-pointer">
            Azonnali árajánlat kérése
          </a>
          <button className="md:hidden text-nm-text p-1 cursor-pointer bg-transparent border-none"
            onClick={() => setMobileOpen(v => !v)}
            aria-label={mobileOpen ? "Bezárás" : "Menü"}
          >
            {mobileOpen ? <X size={22} /> : <Menu size={22} />}
          </button>
        </div>
      </nav>

      {/* Mobile nav */}
      <AnimatePresence>
        {mobileOpen && (
          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} transition={{ duration: 0.22 }}
            className="fixed inset-0 top-[72px] z-[99] bg-[rgba(12,10,9,0.97)] backdrop-blur-xl flex flex-col items-center justify-center gap-8 md:hidden"
          >
            {navLinks.map(({ label, href }, i) => (
              <motion.a key={href} href={href}
                initial={{ opacity: 0, y: 14 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: i * 0.07 }}
                className="font-serif text-4xl text-nm-text hover:text-nm-gold transition-colors cursor-pointer"
                onClick={() => setMobileOpen(false)}
              >{label}</motion.a>
            ))}
            <motion.a href="#contact" initial={{ opacity: 0, y: 14 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.4 }}
              className="mt-4 bg-nm-gold text-nm-bg font-semibold px-7 py-4 cursor-pointer hover:bg-nm-gold-light transition-colors"
              onClick={() => setMobileOpen(false)}
            >
              Azonnali árajánlat kérése
            </motion.a>
          </motion.div>
        )}
      </AnimatePresence>

      {/* ═══════════════════════════════════════
          HERO  — dramatic editorial layout
          Content is ALWAYS visible immediately.
          Images fade in behind as they load.
      ═══════════════════════════════════════ */}
      <section id="hero" className="relative h-screen min-h-[640px] bg-nm-bg overflow-hidden">

        {/* Background image slider — purely decorative layer */}
        <div className="absolute inset-0 z-0">
          <ImagesSlider images={HERO_IMAGES} className="h-full" overlay={false}>
            <div />
          </ImagesSlider>
        </div>

        {/* Gradient overlays — always visible, no dependence on image loading */}
        <div className="absolute inset-0 z-10 bg-gradient-to-r from-nm-bg via-nm-bg/85 to-nm-bg/30 pointer-events-none" />
        <div className="absolute inset-0 z-10 bg-gradient-to-t from-nm-bg/80 via-transparent to-nm-bg/60 pointer-events-none" />

        {/* Decorative vertical rule lines */}
        <div className="absolute top-0 bottom-0 right-[35%] w-px bg-gradient-to-b from-transparent via-nm-border/40 to-transparent z-20 hidden lg:block pointer-events-none" />

        {/* Large watermark text — decorative */}
        <div className="absolute right-[2%] top-1/2 -translate-y-1/2 z-20 pointer-events-none select-none hidden xl:block">
          <div className="font-serif text-[18rem] leading-none text-nm-text/[0.028] tracking-tighter">NM</div>
        </div>

        {/* ── Main hero content — bottom-left anchored, always visible ── */}
        <div className="absolute inset-0 z-30 flex items-end">
          <div className="max-w-6xl mx-auto px-6 lg:px-10 w-full pb-16 md:pb-24">
            <div className="max-w-[700px]">

              {/* Animated gold accent line */}
              <motion.div
                initial={{ scaleX: 0 }}
                animate={{ scaleX: 1 }}
                transition={{ duration: 0.7, delay: 0.15, ease: [0.16, 1, 0.3, 1] }}
                style={{ originX: 0 }}
                className="w-16 h-[2px] bg-nm-gold mb-7"
              />

              {/* Eyebrow — fades in */}
              <motion.div
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: 0.25 }}
                className="flex items-center gap-3 text-nm-gold text-[0.6875rem] font-bold tracking-[0.2em] uppercase mb-7"
              >
                Prémium Kivitelezés — Budapest
              </motion.div>

              {/* Headline — each line wipes up from overflow-hidden */}
              <h1 className="font-serif leading-[0.97] tracking-[-0.03em] mb-8">
                {headline.map((line, i) => (
                  <div key={i} className="overflow-hidden">
                    <motion.div
                      initial={{ y: "108%" }}
                      animate={{ y: "0%" }}
                      transition={{
                        duration: 0.85,
                        delay: 0.4 + i * 0.13,
                        ease: [0.16, 1, 0.3, 1],
                      }}
                    >
                      <span
                        className={`block text-[clamp(3.25rem,7vw,6.5rem)] ${
                          i === 1 ? "text-nm-gold italic" : "text-nm-text"
                        }`}
                      >
                        {line}
                      </span>
                    </motion.div>
                  </div>
                ))}
              </h1>

              {/* Sub + CTAs */}
              <motion.div
                initial={{ opacity: 0, y: 16 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.7, delay: 0.9 }}
                className="flex flex-col sm:flex-row items-start sm:items-center gap-5"
              >
                <p className="text-nm-muted text-[1rem] leading-[1.75] max-w-[380px]">
                  Generálkivitelezéstől a belső terek kialakításáig — minden munkánkba belevisszük a mesterségbeli tudást.
                </p>
                <div className="flex gap-3 flex-shrink-0">
                  <a href="#contact"
                    className="inline-flex items-center gap-2 bg-nm-gold text-nm-bg font-semibold text-[0.875rem] px-6 py-3.5 hover:bg-nm-gold-light transition-all hover:-translate-y-0.5 hover:shadow-[0_8px_28px_rgba(202,138,4,0.35)] cursor-pointer"
                  >
                    Árajánlat kérése <ArrowRight size={15} />
                  </a>
                  <a href="#portfolio"
                    className="inline-flex items-center gap-2 border border-white/20 text-white text-[0.875rem] px-6 py-3.5 hover:border-nm-gold hover:text-nm-gold transition-colors cursor-pointer"
                  >
                    Portfólió
                  </a>
                </div>
              </motion.div>
            </div>
          </div>
        </div>

        {/* Floating right-side stats */}
        <div className="absolute right-8 top-1/2 -translate-y-1/2 z-30 hidden xl:flex flex-col gap-4">
          {[
            { val: "250+", label: "Projekt" },
            { val: "15+", label: "Év" },
            { val: "2 év", label: "Garancia" },
          ].map(({ val, label }, i) => (
            <motion.div key={i}
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.6, delay: 1.1 + i * 0.1 }}
              className="bg-nm-bg/60 backdrop-blur border border-nm-border text-center px-5 py-4 min-w-[80px]"
            >
              <div className="font-serif text-[1.5rem] text-nm-gold leading-none mb-1">{val}</div>
              <div className="text-[0.6rem] font-bold tracking-[0.14em] uppercase text-nm-faint">{label}</div>
            </motion.div>
          ))}
        </div>

        {/* Scroll indicator */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 1.4 }}
          className="absolute bottom-8 left-1/2 -translate-x-1/2 z-30 flex flex-col items-center gap-2"
        >
          <span className="text-white/30 text-[0.5625rem] tracking-[0.22em] uppercase">Görgessen</span>
          <motion.div
            animate={{ y: [0, 9, 0] }}
            transition={{ repeat: Infinity, duration: 1.6, ease: "easeInOut" }}
            className="w-px h-9 bg-gradient-to-b from-white/30 to-transparent"
          />
        </motion.div>
      </section>

      {/* ═══════════════════════════════════════
          TRUST BAR
      ═══════════════════════════════════════ */}
      <section id="trust" className="bg-nm-surface border-y border-nm-border-subtle">
        <div className="max-w-6xl mx-auto px-6 lg:px-10 grid grid-cols-2 md:grid-cols-4">
          {[
            { to: 250, suffix: "+", label: "Befejezett projekt" },
            { to: 15,  suffix: "+", label: "Év tapasztalat" },
            { to: 98,  suffix: "%", label: "Elégedett ügyfél" },
            { to: 2,   suffix: " év", label: "Garancia" },
          ].map((s, i) => (
            <FadeIn key={i} delay={i * 0.08}
              className={`py-10 text-center
                ${i < 3 ? "border-r border-nm-border-subtle" : ""}
                ${i === 0 || i === 1 ? "border-b md:border-b-0 border-nm-border-subtle" : ""}
              `}
            >
              <div className="font-serif text-[2.75rem] md:text-[3.25rem] text-nm-gold leading-none mb-2">
                <CountUp to={s.to} suffix={s.suffix} />
              </div>
              <div className="text-[0.6875rem] font-semibold tracking-[0.12em] uppercase text-nm-faint">{s.label}</div>
            </FadeIn>
          ))}
        </div>
      </section>

      {/* ═══════════════════════════════════════
          SERVICES
      ═══════════════════════════════════════ */}
      <section id="services" className="py-28 bg-nm-bg">
        <div className="max-w-6xl mx-auto px-6 lg:px-10">
          <div className="mb-16">
            <Eyebrow>Szolgáltatásaink</Eyebrow>
            <FadeIn>
              <h2 className="font-serif text-[clamp(2rem,4vw,3.25rem)] text-nm-text mb-5">
                Teljes körű<br />építőipari megoldások
              </h2>
            </FadeIn>
            <FadeIn delay={0.1}>
              <p className="text-nm-muted text-[1.0625rem] leading-[1.75] max-w-[500px]">
                Az első konzultációtól az átadásig minden munkafázist mi koordinálunk.
              </p>
            </FadeIn>
          </div>

          <div className="grid md:grid-cols-3 border border-nm-border-subtle divide-y md:divide-y-0 md:divide-x divide-nm-border-subtle">
            {SERVICES.map((svc, i) => (
              <FadeIn key={i} delay={i * 0.1}>
                <div className="group relative overflow-hidden bg-nm-bg hover:bg-nm-card transition-colors duration-300 cursor-pointer h-full">
                  <div className="relative overflow-hidden aspect-[16/9]">
                    {/* eslint-disable-next-line @next/next/no-img-element */}
                    <img src={svc.img} alt={svc.title}
                      className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105" />
                    <div className="absolute inset-0 bg-gradient-to-t from-nm-bg/60 to-transparent" />
                  </div>
                  <div className="p-8 lg:p-10">
                    <div className="absolute bottom-0 left-0 right-0 h-[2px] bg-nm-gold scale-x-0 group-hover:scale-x-100 transition-transform duration-400 origin-left" />
                    <div className="w-[46px] h-[46px] border border-nm-border flex items-center justify-center text-nm-gold mb-6">
                      <span className="font-serif text-[0.875rem]">{svc.num}</span>
                    </div>
                    <h3 className="font-serif text-[1.375rem] text-nm-text mb-3">{svc.title}</h3>
                    <p className="text-nm-muted text-[0.9375rem] leading-[1.72] mb-6">{svc.desc}</p>
                    <span className="inline-flex items-center gap-2 text-[0.75rem] font-bold tracking-[0.1em] uppercase text-nm-gold group-hover:gap-3 transition-all">
                      Részletek <ChevronRight size={13} />
                    </span>
                  </div>
                </div>
              </FadeIn>
            ))}
          </div>
        </div>
      </section>

      {/* ═══════════════════════════════════════
          WHY NM BAU
      ═══════════════════════════════════════ */}
      <section id="why" className="py-28 bg-nm-surface overflow-hidden">
        <div className="max-w-6xl mx-auto px-6 lg:px-10">
          <div className="grid lg:grid-cols-2 gap-16 xl:gap-24 items-center">
            <div>
              <Eyebrow>Miért mi?</Eyebrow>
              <FadeIn>
                <h2 className="font-serif text-[clamp(2rem,4vw,3.25rem)] text-nm-text mb-5">
                  Nem csak építünk.<br />Garanciát vállalunk.
                </h2>
              </FadeIn>
              <FadeIn delay={0.1}>
                <p className="text-nm-muted text-[1.0625rem] leading-[1.75] mb-10 max-w-[480px]">
                  Az NM Bau minden projektjébe a megbízhatóságot, az átláthatóságot és a prémium minőséget viszi — kompromisszumok nélkül.
                </p>
              </FadeIn>
              <div className="space-y-6">
                {WHY_FEATURES.map(({ Icon, title, desc }, i) => (
                  <FadeIn key={i} delay={0.1 + i * 0.08}>
                    <div className="flex gap-4 items-start">
                      <div className="w-10 h-10 flex-shrink-0 flex items-center justify-center bg-[rgba(202,138,4,0.12)] text-nm-gold mt-0.5">
                        <Icon size={17} />
                      </div>
                      <div>
                        <div className="font-semibold text-[0.9375rem] text-nm-text mb-1">{title}</div>
                        <p className="text-nm-muted text-[0.875rem] leading-[1.68]">{desc}</p>
                      </div>
                    </div>
                  </FadeIn>
                ))}
              </div>
            </div>

            <FadeIn direction="right" delay={0.15} className="relative hidden lg:block">
              <div className="relative">
                <div className="absolute -left-5 top-6 w-[3px] h-[60%] bg-nm-gold" />
                <div className="aspect-[3/4] overflow-hidden">
                  {/* eslint-disable-next-line @next/next/no-img-element */}
                  <img src="https://images.unsplash.com/photo-1504307651254-35680f356dfd?q=80&w=1470&auto=format&fit=crop"
                    alt="Prémium kivitelezés" className="w-full h-full object-cover" />
                </div>
                <div className="absolute -bottom-8 -right-8 w-[52%] aspect-square border-4 border-nm-surface overflow-hidden shadow-2xl">
                  {/* eslint-disable-next-line @next/next/no-img-element */}
                  <img src="https://images.unsplash.com/photo-1581578731548-c64695cc6952?q=80&w=1470&auto=format&fit=crop"
                    alt="Kézműves munka" className="w-full h-full object-cover" />
                </div>
                <div className="absolute top-8 -right-4 bg-nm-gold text-nm-bg px-5 py-4 shadow-[0_12px_40px_rgba(202,138,4,0.3)]">
                  <div className="font-serif text-[2.25rem] leading-none font-bold">15+</div>
                  <div className="text-[0.6875rem] font-bold tracking-[0.1em] uppercase">Év tapasztalat</div>
                </div>
              </div>
            </FadeIn>
          </div>
        </div>
      </section>

      {/* ═══════════════════════════════════════
          PROCESS — 10-step accordion
      ═══════════════════════════════════════ */}
      <section id="process" className="py-28 bg-nm-bg">
        <div className="max-w-6xl mx-auto px-6 lg:px-10">
          <div className="max-w-[620px] mb-16">
            <Eyebrow>Hogyan dolgozunk</Eyebrow>
            <FadeIn>
              <h2 className="font-serif text-[clamp(2rem,4vw,3.25rem)] text-nm-text mb-5">
                Fürdőszoba felújítás<br />lépésről lépésre
              </h2>
            </FadeIn>
            <FadeIn delay={0.1}>
              <p className="text-nm-muted text-[1.0625rem] leading-[1.75]">
                Átlátható, jól strukturált folyamat — tudja pontosan, mi vár Önre minden egyes lépésnél.
              </p>
            </FadeIn>
          </div>

          {/* Accordion */}
          <div className="border border-nm-border-subtle divide-y divide-nm-border-subtle">
            {PROCESS.map((step, i) => {
              const isOpen = openStep === i;
              return (
                <FadeIn key={i} delay={Math.min(i * 0.04, 0.25)}>
                  <div>
                    {/* Header */}
                    <button
                      onClick={() => setOpenStep(isOpen ? null : i)}
                      className="w-full flex items-center gap-5 px-6 py-5 text-left hover:bg-nm-surface/50 transition-colors duration-200 cursor-pointer group"
                    >
                      {/* Number */}
                      <span className={`font-serif text-[0.875rem] w-8 flex-shrink-0 transition-colors duration-200 ${isOpen ? "text-nm-gold" : "text-nm-faint"}`}>
                        {step.num}
                      </span>

                      {/* Progress dot */}
                      <span className={`w-2 h-2 rounded-full flex-shrink-0 transition-all duration-300 ${isOpen ? "bg-nm-gold" : "bg-nm-border"}`} />

                      {/* Title */}
                      <span className={`font-serif text-[1.125rem] md:text-[1.25rem] flex-1 transition-colors duration-200 ${isOpen ? "text-nm-text" : "text-nm-muted group-hover:text-nm-text"}`}>
                        {step.title}
                      </span>

                      {/* Chevron */}
                      <motion.span
                        animate={{ rotate: isOpen ? 180 : 0 }}
                        transition={{ duration: 0.3 }}
                        className="text-nm-faint flex-shrink-0"
                      >
                        <ChevronDown size={18} />
                      </motion.span>
                    </button>

                    {/* Expandable content */}
                    <AnimatePresence initial={false}>
                      {isOpen && (
                        <motion.div
                          key="content"
                          initial={{ height: 0, opacity: 0 }}
                          animate={{ height: "auto", opacity: 1 }}
                          exit={{ height: 0, opacity: 0 }}
                          transition={{ duration: 0.38, ease: [0.16, 1, 0.3, 1] }}
                          style={{ overflow: "hidden" }}
                        >
                          <div className="px-6 pb-7 pt-1 ml-[4.75rem]">
                            <p className="text-nm-muted text-[0.9375rem] leading-[1.78] mb-4">
                              {step.intro}
                            </p>
                            {step.bullets && step.bullets.length > 0 && (
                              <ul className="space-y-2 mb-4">
                                {step.bullets.map((b, bi) => (
                                  <li key={bi} className="flex items-start gap-3 text-nm-muted text-[0.9375rem] leading-[1.7]">
                                    <span className="w-4 h-4 rounded-full border border-nm-gold/50 flex items-center justify-center flex-shrink-0 mt-0.5">
                                      <span className="w-1.5 h-1.5 rounded-full bg-nm-gold" />
                                    </span>
                                    {b}
                                  </li>
                                ))}
                              </ul>
                            )}
                            {step.note && (
                              <div className="border-l-2 border-nm-gold/50 pl-4 mt-4">
                                <p className="text-nm-text/80 text-[0.875rem] leading-[1.72] italic">
                                  {step.note}
                                </p>
                              </div>
                            )}
                          </div>
                        </motion.div>
                      )}
                    </AnimatePresence>
                  </div>
                </FadeIn>
              );
            })}
          </div>

          {/* Why choose us callout */}
          <FadeIn delay={0.1} className="mt-12">
            <div className="bg-nm-surface border border-nm-border-subtle p-8 lg:p-10">
              <div className="grid lg:grid-cols-[1fr_auto] gap-8 items-start">
                <div>
                  <Eyebrow>Miért választanak minket?</Eyebrow>
                  <div className="grid sm:grid-cols-2 gap-3 mt-2">
                    {WHY_CHOOSE.map((item, i) => (
                      <div key={i} className="flex items-center gap-3 text-nm-muted text-[0.9375rem]">
                        <Check size={15} className="text-nm-gold flex-shrink-0" />
                        {item}
                      </div>
                    ))}
                  </div>
                </div>
                <a href="#contact"
                  className="flex-shrink-0 inline-flex items-center gap-2 bg-nm-gold text-nm-bg font-semibold text-[0.875rem] px-6 py-3.5 hover:bg-nm-gold-light transition-colors cursor-pointer self-end"
                >
                  Azonnali árajánlat kérése <ArrowRight size={15} />
                </a>
              </div>
            </div>
          </FadeIn>
        </div>
      </section>

      {/* ═══════════════════════════════════════
          PORTFOLIO
      ═══════════════════════════════════════ */}
      <section id="portfolio" className="py-28 bg-nm-surface">
        <div className="max-w-6xl mx-auto px-6 lg:px-10">
          <div className="flex items-end justify-between gap-6 mb-14 flex-wrap">
            <div>
              <Eyebrow>Referenciáink</Eyebrow>
              <FadeIn>
                <h2 className="font-serif text-[clamp(2rem,4vw,3.25rem)] text-nm-text">Válogatott<br />munkáink</h2>
              </FadeIn>
            </div>
            <FadeIn>
              <a href="#contact" className="inline-flex items-center gap-2 border border-nm-border text-nm-text text-[0.875rem] px-5 py-3 hover:border-nm-gold hover:text-nm-gold transition-colors cursor-pointer flex-shrink-0">
                Teljes portfólió <ArrowRight size={15} />
              </a>
            </FadeIn>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 md:grid-rows-[270px_270px_270px] gap-3">
            {PORTFOLIO.map((item, i) => (
              <FadeIn key={i} delay={Math.min(i * 0.07, 0.3)}
                className={i === 0 ? "md:col-span-2 md:row-span-2" : ""}
              >
                <div className="group relative overflow-hidden h-full cursor-pointer">
                  {/* eslint-disable-next-line @next/next/no-img-element */}
                  <img src={item.img} alt={item.title}
                    className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105" />
                  <div className="absolute inset-0 bg-nm-bg/0 group-hover:bg-nm-bg/65 transition-colors duration-300" />
                  <div className="absolute inset-0 flex items-end p-5 sm:p-6">
                    <div className="translate-y-3 opacity-0 group-hover:translate-y-0 group-hover:opacity-100 transition-all duration-300">
                      <h3 className="font-serif text-[1rem] text-nm-text mb-0.5">{item.title}</h3>
                      <p className="text-nm-muted text-[0.8rem]">{item.cat}</p>
                    </div>
                  </div>
                </div>
              </FadeIn>
            ))}
          </div>
        </div>
      </section>

      {/* ═══════════════════════════════════════
          CTA BANNER
      ═══════════════════════════════════════ */}
      <section id="cta-banner" className="py-32 bg-nm-bg relative overflow-hidden text-center">
        <div className="absolute inset-0 pointer-events-none">
          <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[800px] h-[500px] bg-nm-gold/8 rounded-full blur-[120px]" />
        </div>
        <div className="relative z-10 max-w-6xl mx-auto px-6 lg:px-10">
          <FadeIn><Eyebrow center>Készen áll?</Eyebrow></FadeIn>
          <FadeIn delay={0.05}>
            <h2 className="font-serif text-[clamp(2.25rem,5.5vw,4.75rem)] text-nm-text leading-[1.0] tracking-tight mb-6 text-balance">
              Indítsa el projektjét<br />még <em className="text-nm-gold not-italic">ma.</em>
            </h2>
          </FadeIn>
          <FadeIn delay={0.12}>
            <p className="text-nm-muted text-[1.0625rem] leading-[1.78] max-w-[420px] mx-auto mb-10">
              Ingyenes konzultáció és helyszíni felmérés. Vegye fel velünk a kapcsolatot — 48 órán belül visszahívjuk.
            </p>
          </FadeIn>
          <FadeIn delay={0.18}>
            <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
              <a href="#contact" className="inline-flex items-center gap-2.5 bg-nm-gold text-nm-bg font-semibold text-[1rem] px-8 py-4 hover:bg-nm-gold-light transition-all hover:-translate-y-0.5 hover:shadow-[0_10px_36px_rgba(202,138,4,0.35)] cursor-pointer">
                Azonnali árajánlat kérése <ArrowRight size={17} />
              </a>
              <a href="tel:+36202546624" className="inline-flex items-center gap-2.5 border border-nm-border text-nm-text text-[1rem] px-8 py-4 hover:border-nm-gold hover:text-nm-gold transition-colors cursor-pointer">
                <Phone size={17} /> +36 20 254 6624
              </a>
            </div>
          </FadeIn>
        </div>
      </section>

      {/* ═══════════════════════════════════════
          CONTACT
      ═══════════════════════════════════════ */}
      <section id="contact" className="py-28 bg-nm-surface">
        <div className="max-w-6xl mx-auto px-6 lg:px-10">
          <div className="grid lg:grid-cols-[1fr_1.35fr] gap-16 xl:gap-24 items-start">
            <div>
              <Eyebrow>Kapcsolat</Eyebrow>
              <FadeIn>
                <h2 className="font-serif text-[clamp(2rem,4vw,3.25rem)] text-nm-text mb-5">Lépjen velünk<br />kapcsolatba</h2>
              </FadeIn>
              <FadeIn delay={0.1}>
                <p className="text-nm-muted text-[1.0625rem] leading-[1.75] mb-10 max-w-[460px]">
                  Töltse ki az űrlapot és 48 órán belül felvesszük Önnel a kapcsolatot egy ingyenes konzultáció egyeztetésére.
                </p>
              </FadeIn>
              <div className="space-y-6">
                {[
                  { Icon: Phone, label: "Telefonszám", value: "+36 20 254 6624", href: "tel:+36202546624" },
                  { Icon: Mail,  label: "E-mail",      value: "info@nmbau.hu",   href: "mailto:info@nmbau.hu" },
                  { Icon: MapPin, label: "Irodacím",   value: "Budapest, Magyarország" },
                ].map(({ Icon, label, value, href }, i) => (
                  <FadeIn key={i} delay={0.1 + i * 0.07}>
                    <div className="flex gap-4 items-start">
                      <div className="w-10 h-10 flex-shrink-0 flex items-center justify-center border border-nm-border text-nm-gold">
                        <Icon size={17} />
                      </div>
                      <div>
                        <div className="text-[0.6875rem] font-bold tracking-[0.12em] uppercase text-nm-faint mb-0.5">{label}</div>
                        {href
                          ? <a href={href} className="text-[1rem] text-nm-text hover:text-nm-gold transition-colors">{value}</a>
                          : <span className="text-[1rem] text-nm-text">{value}</span>
                        }
                      </div>
                    </div>
                  </FadeIn>
                ))}
              </div>
            </div>

            <FadeIn delay={0.15}>
              <div className="bg-nm-card border border-nm-border-subtle p-8 lg:p-10">
                <h3 className="font-serif text-[1.5rem] text-nm-text mb-1">Ingyenes árajánlat</h3>
                <p className="text-nm-muted text-[0.9rem] mb-8">Töltse ki az alábbi mezőket és hamarosan jelentkezünk.</p>
                {/* PHASE 2: wire form action */}
                <form action="#" method="post" onSubmit={e => e.preventDefault()} className="space-y-4">
                  <div className="grid sm:grid-cols-2 gap-4">
                    {[
                      { id: "name", label: "Neve", type: "text", placeholder: "Kovács János", autoComplete: "name" },
                      { id: "phone", label: "Telefonszám", type: "tel", placeholder: "+36 XX XXX XXXX", autoComplete: "tel" },
                    ].map(f => (
                      <div key={f.id} className="flex flex-col gap-1.5">
                        <label htmlFor={f.id} className="text-[0.6875rem] font-bold tracking-[0.12em] uppercase text-nm-faint">{f.label}</label>
                        <input id={f.id} name={f.id} type={f.type} placeholder={f.placeholder} autoComplete={f.autoComplete}
                          className="bg-nm-surface border border-nm-border-subtle text-nm-text text-[0.9375rem] px-4 py-3.5 outline-none focus:border-nm-gold transition-colors placeholder:text-nm-faint font-sans" />
                      </div>
                    ))}
                  </div>
                  <div className="flex flex-col gap-1.5">
                    <label htmlFor="email" className="text-[0.6875rem] font-bold tracking-[0.12em] uppercase text-nm-faint">E-mail cím</label>
                    <input id="email" name="email" type="email" placeholder="nev@email.hu" autoComplete="email"
                      className="bg-nm-surface border border-nm-border-subtle text-nm-text text-[0.9375rem] px-4 py-3.5 outline-none focus:border-nm-gold transition-colors placeholder:text-nm-faint font-sans" />
                  </div>
                  <div className="flex flex-col gap-1.5">
                    <label htmlFor="service" className="text-[0.6875rem] font-bold tracking-[0.12em] uppercase text-nm-faint">Szolgáltatás típusa</label>
                    <div className="relative">
                      <select id="service" name="service" defaultValue=""
                        className="w-full appearance-none bg-nm-surface border border-nm-border-subtle text-nm-text text-[0.9375rem] px-4 py-3.5 outline-none focus:border-nm-gold transition-colors cursor-pointer font-sans pr-10">
                        <option value="" disabled>Válasszon...</option>
                        <option value="general">Általános kivitelezés</option>
                        <option value="renovation">Felújítás és bővítés</option>
                        <option value="interior">Belső tér kialakítás</option>
                        <option value="other">Egyéb</option>
                      </select>
                      <ChevronDown size={14} className="absolute right-4 top-1/2 -translate-y-1/2 text-nm-faint pointer-events-none" />
                    </div>
                  </div>
                  <div className="flex flex-col gap-1.5">
                    <label htmlFor="message" className="text-[0.6875rem] font-bold tracking-[0.12em] uppercase text-nm-faint">Projekt leírása</label>
                    <textarea id="message" name="message" rows={4}
                      placeholder="Kérjük, röviden írja le projektjét: helyszín, méret, határidő..."
                      className="bg-nm-surface border border-nm-border-subtle text-nm-text text-[0.9375rem] px-4 py-3.5 outline-none focus:border-nm-gold transition-colors resize-y placeholder:text-nm-faint font-sans" />
                  </div>
                  <button type="submit"
                    className="w-full flex items-center justify-center gap-2.5 bg-nm-gold text-nm-bg font-semibold text-[0.9375rem] py-4 mt-2 hover:bg-nm-gold-light transition-colors cursor-pointer">
                    Azonnali árajánlat kérése <ArrowRight size={17} />
                  </button>
                </form>
                <p className="mt-4 text-[0.8rem] text-nm-faint text-center">
                  {/* PHASE 2: link real privacy policy */}
                  Az űrlap beküldésével elfogadja az <a href="#" className="text-nm-gold underline hover:text-nm-gold-light transition-colors">adatkezelési tájékoztatót</a>.
                </p>
              </div>
            </FadeIn>
          </div>
        </div>
      </section>

      {/* ═══════════════════════════════════════
          FOOTER
      ═══════════════════════════════════════ */}
      <footer id="footer" className="bg-nm-bg border-t border-nm-border-subtle pt-20 pb-8">
        <div className="max-w-6xl mx-auto px-6 lg:px-10">
          <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-10 mb-16">
            <div className="sm:col-span-2 lg:col-span-1">
              <a href="#hero" className="inline-block mb-4" aria-label="NM Bau főoldal">
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img src="/nm-bau.jpg" alt="NM Bau" className="h-16 w-auto" style={{ filter: "invert(1) brightness(0.92)" }} />
              </a>
              <p className="text-nm-muted text-[0.875rem] leading-[1.7] max-w-[240px] mb-6">
                Prémium kivitelezés, felújítás és belső tér kialakítás igényes ügyfelek számára.
              </p>
              {/* PHASE 2: real social URLs */}
              <div className="flex gap-2.5">
                <a href="#" aria-label="Facebook" className="w-9 h-9 border border-nm-border flex items-center justify-center text-nm-faint hover:border-nm-gold hover:text-nm-gold transition-colors cursor-pointer">
                  <svg width="15" height="15" viewBox="0 0 24 24" fill="currentColor" aria-hidden="true"><path d="M18 2h-3a5 5 0 00-5 5v3H7v4h3v8h4v-8h3l1-4h-4V7a1 1 0 011-1h3z"/></svg>
                </a>
                <a href="#" aria-label="Instagram" className="w-9 h-9 border border-nm-border flex items-center justify-center text-nm-faint hover:border-nm-gold hover:text-nm-gold transition-colors cursor-pointer">
                  <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" aria-hidden="true"><rect x="2" y="2" width="20" height="20" rx="5"/><path d="M16 11.37A4 4 0 1112.63 8 4 4 0 0116 11.37z"/><line x1="17.5" y1="6.5" x2="17.51" y2="6.5"/></svg>
                </a>
                <a href="#" aria-label="LinkedIn" className="w-9 h-9 border border-nm-border flex items-center justify-center text-nm-faint hover:border-nm-gold hover:text-nm-gold transition-colors cursor-pointer">
                  <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" aria-hidden="true"><path d="M16 8a6 6 0 016 6v7h-4v-7a2 2 0 00-2-2 2 2 0 00-2 2v7h-4v-7a6 6 0 016-6z"/><rect x="2" y="9" width="4" height="12"/><circle cx="4" cy="4" r="2"/></svg>
                </a>
              </div>
            </div>
            <div>
              <div className="text-[0.6875rem] font-bold tracking-[0.14em] uppercase text-nm-text mb-5">Szolgáltatások</div>
              <ul className="space-y-3 list-none p-0 m-0">
                {["Általános kivitelezés", "Felújítás és bővítés", "Belső tér kialakítás"].map(item => (
                  <li key={item}><a href="#services" className="text-[0.875rem] text-nm-muted hover:text-nm-text transition-colors cursor-pointer">{item}</a></li>
                ))}
              </ul>
            </div>
            <div>
              <div className="text-[0.6875rem] font-bold tracking-[0.14em] uppercase text-nm-text mb-5">Navigáció</div>
              <ul className="space-y-3 list-none p-0 m-0">
                {[["Főoldal","#hero"],["Rólunk","#why"],["Folyamat","#process"],["Portfólió","#portfolio"],["Kapcsolat","#contact"]].map(([l,h]) => (
                  <li key={h}><a href={h} className="text-[0.875rem] text-nm-muted hover:text-nm-text transition-colors cursor-pointer">{l}</a></li>
                ))}
              </ul>
            </div>
            <div>
              <div className="text-[0.6875rem] font-bold tracking-[0.14em] uppercase text-nm-text mb-5">Elérhetőség</div>
              <ul className="space-y-3 list-none p-0 m-0">
                <li><a href="tel:+36202546624" className="text-[0.875rem] text-nm-muted hover:text-nm-text transition-colors cursor-pointer">+36 20 254 6624</a></li>
                <li><a href="mailto:info@nmbau.hu" className="text-[0.875rem] text-nm-muted hover:text-nm-text transition-colors cursor-pointer">info@nmbau.hu</a></li>
                <li><a href="https://www.nmbau.hu" className="text-[0.875rem] text-nm-muted hover:text-nm-text transition-colors cursor-pointer">www.nmbau.hu</a></li>
                <li><span className="text-[0.875rem] text-nm-muted">Budapest, Magyarország</span></li>
              </ul>
            </div>
          </div>
          <div className="border-t border-nm-border-subtle pt-8 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
            <p className="text-[0.8125rem] text-nm-faint">© 2025 NM Bau. Minden jog fenntartva.</p>
            <div className="flex gap-6">
              <a href="#" className="text-[0.8125rem] text-nm-faint hover:text-nm-muted transition-colors cursor-pointer">Adatkezelési tájékoztató</a>
              <a href="#" className="text-[0.8125rem] text-nm-faint hover:text-nm-muted transition-colors cursor-pointer">Általános feltételek</a>
            </div>
          </div>
        </div>
      </footer>
    </>
  );
}
