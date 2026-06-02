// ==============================================================
//  MPOURTZILAS — Motion choreography
//  Refined, architectural, never showy.
// ==============================================================

import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";

gsap.registerPlugin(ScrollTrigger);

const reduceMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
const ARCH = "expo.out"; // mirrors --ease-arch

/** Wrap each character of an element's text in a span, preserving spaces. */
function splitChars(el: HTMLElement) {
  const lines = el.querySelectorAll<HTMLElement>(".line");
  const targets = lines.length ? Array.from(lines) : [el];

  targets.forEach((line) => {
    // Skip if already split
    if (line.dataset.split === "true") return;
    line.dataset.split = "true";

    const original = line.innerHTML;
    // Walk children and split text nodes only (preserves <em>/<strong> wrappers)
    const replacer = (node: ChildNode): string => {
      if (node.nodeType === Node.TEXT_NODE) {
        return Array.from(node.textContent ?? "")
          .map((c) =>
            c === " "
              ? "<span class=\"char space\">&nbsp;</span>"
              : `<span class="char">${c}</span>`,
          )
          .join("");
      }
      if (node.nodeType === Node.ELEMENT_NODE) {
        const elNode = node as HTMLElement;
        const inner = Array.from(elNode.childNodes).map(replacer).join("");
        const tag = elNode.tagName.toLowerCase();
        return `<${tag}>${inner}</${tag}>`;
      }
      return "";
    };

    line.innerHTML = Array.from(line.childNodes).map(replacer).join("");
    void original; // (kept for readability)
  });

  return targets.flatMap((line) =>
    Array.from(line.querySelectorAll<HTMLElement>(".char")),
  );
}

/* --------------------------------------------------------------
   1. Hero load timeline
   -------------------------------------------------------------- */
function animateHero() {
  const hero = document.querySelector<HTMLElement>("[data-hero]");
  if (!hero) return;

  const heroImg = hero.querySelector<HTMLElement>("[data-hero-image] img, [data-hero-image] video");
  const titleEl = hero.querySelector<HTMLElement>("[data-split-title]");
  const titleChars = titleEl ? splitChars(titleEl) : [];
  const eyebrow = hero.querySelector<HTMLElement>(".hero-eyebrow");
  const eyebrowLine = hero.querySelector<HTMLElement>(".hero-eyebrow .line");
  const lede = hero.querySelector<HTMLElement>(".hero-lede");
  const actions = hero.querySelector<HTMLElement>(".hero-actions");
  const meta = hero.querySelector<HTMLElement>(".hero-meta");
  const brackets = hero.querySelectorAll<HTMLElement>(".brackets .b");

  // Pre-state
  gsap.set([eyebrow, lede, actions, meta], { autoAlpha: 0, y: 18 });
  gsap.set(eyebrowLine, { scaleX: 0, transformOrigin: "left center" });
  gsap.set(titleChars, { yPercent: 110, autoAlpha: 0 });
  brackets.forEach((b) => {
    const beforeLeg = b; // We animate via CSS pseudo via custom props
    gsap.set(beforeLeg, { ["--bx" as any]: 0, ["--by" as any]: 0 });
  });

  // L-bracket draw — we animate scale of pseudo legs through clip-path
  gsap.set(brackets, { clipPath: "inset(0 100% 100% 0)" });

  const tl = gsap.timeline({
    defaults: { ease: ARCH, duration: 1.2 },
  });

  if (heroImg) {
    tl.fromTo(
      heroImg,
      { scale: 1.22 },
      { scale: 1.0, duration: 2.4, ease: "power3.out" },
      0,
    );
  }

  tl.to(brackets, { clipPath: "inset(0 0% 0% 0)", duration: 1.4, stagger: 0.08 }, 0.25)
    .to(eyebrowLine, { scaleX: 1, duration: 0.9 }, 0.55)
    .to(eyebrow, { autoAlpha: 1, y: 0, duration: 0.7 }, 0.6)
    .to(
      titleChars,
      { yPercent: 0, autoAlpha: 1, duration: 1.05, stagger: 0.018 },
      0.75,
    )
    .to(lede, { autoAlpha: 1, y: 0, duration: 0.9 }, "-=0.55")
    .to(actions, { autoAlpha: 1, y: 0, duration: 0.8 }, "-=0.7")
    .to(meta, { autoAlpha: 1, y: 0, duration: 0.7 }, "-=0.55");

  // Subtle Ken-Burns drift (pause; respects reduced motion)
  if (heroImg && !reduceMotion) {
    gsap.to(heroImg, {
      scale: 1.06,
      x: -12,
      duration: 18,
      ease: "sine.inOut",
      yoyo: true,
      repeat: -1,
      delay: 2.4,
    });
  }
}

/* --------------------------------------------------------------
   2. Top-bar entrance (slides down, then staggers nav items)
   -------------------------------------------------------------- */
function animateRail() {
  const rail = document.querySelector<HTMLElement>("[data-rail]");
  if (!rail) return;
  const brand = rail.querySelector(".brand");
  const navItems = rail.querySelectorAll(".topbar-nav li");
  const end = rail.querySelectorAll(".topbar-end > *");

  gsap.from(rail, { autoAlpha: 0, y: -30, duration: 0.9, ease: ARCH });
  gsap.from(brand, { autoAlpha: 0, x: -18, duration: 1, ease: ARCH, delay: 0.15 });
  gsap.from(navItems, {
    autoAlpha: 0,
    y: -10,
    duration: 0.7,
    ease: ARCH,
    stagger: 0.06,
    delay: 0.4,
  });
  gsap.from(end, {
    autoAlpha: 0,
    y: -10,
    duration: 0.7,
    ease: ARCH,
    stagger: 0.06,
    delay: 0.7,
  });

  // Home: nav is transparent over the hero, turns solid once scrolled down.
  if (rail.classList.contains("is-over-hero")) {
    const solidify = () => rail.classList.toggle("is-solid", window.scrollY > 80);
    solidify();
    window.addEventListener("scroll", solidify, { passive: true });
  }
}

/* --------------------------------------------------------------
   3. Scroll-triggered section title splits + reveals
   -------------------------------------------------------------- */
function animateSectionTitles() {
  document
    .querySelectorAll<HTMLElement>(".section [data-split-title]")
    .forEach((el) => {
      const chars = splitChars(el);
      gsap.set(chars, { yPercent: 110, autoAlpha: 0 });

      ScrollTrigger.create({
        trigger: el,
        start: "top 82%",
        once: true,
        onEnter: () => {
          gsap.to(chars, {
            yPercent: 0,
            autoAlpha: 1,
            duration: 1.1,
            ease: ARCH,
            stagger: 0.025,
          });
        },
      });
    });
}

/* --------------------------------------------------------------
   4. Generic reveals: [data-reveal], [data-reveal-stagger], [data-reveal-line]
   -------------------------------------------------------------- */
function animateReveals() {
  document.querySelectorAll<HTMLElement>("[data-reveal]").forEach((el) => {
    gsap.set(el, { autoAlpha: 0, y: 24 });
    ScrollTrigger.create({
      trigger: el,
      start: "top 90%",
      once: true,
      onEnter: () =>
        gsap.to(el, {
          autoAlpha: 1,
          y: 0,
          duration: 1,
          ease: ARCH,
          delay: 0.05,
        }),
    });
  });

  document
    .querySelectorAll<HTMLElement>("[data-reveal-stagger]")
    .forEach((el) => {
      const kids = el.children;
      gsap.set(kids, { autoAlpha: 0, y: 22 });
      ScrollTrigger.create({
        trigger: el,
        start: "top 88%",
        once: true,
        onEnter: () =>
          gsap.to(kids, {
            autoAlpha: 1,
            y: 0,
            duration: 0.85,
            ease: ARCH,
            stagger: 0.08,
          }),
      });
    });

  document
    .querySelectorAll<HTMLElement>(".eyebrow-line")
    .forEach((el) => {
      gsap.set(el, { scaleX: 0, transformOrigin: "left center" });
      ScrollTrigger.create({
        trigger: el,
        start: "top 92%",
        once: true,
        onEnter: () =>
          gsap.to(el, { scaleX: 1, duration: 0.9, ease: ARCH, delay: 0.1 }),
      });
    });
}

/* --------------------------------------------------------------
   5. Project tile reveals — grid stagger from below
   -------------------------------------------------------------- */
function animateProjects() {
  const tiles = document.querySelectorAll<HTMLElement>("[data-tile]");
  if (!tiles.length) return;

  gsap.set(tiles, { autoAlpha: 0, y: 60 });
  ScrollTrigger.batch(tiles, {
    start: "top 86%",
    once: true,
    onEnter: (batch) =>
      gsap.to(batch, {
        autoAlpha: 1,
        y: 0,
        duration: 1.1,
        ease: ARCH,
        stagger: 0.09,
      }),
  });

  // Subtle parallax on tile imagery
  if (!reduceMotion) {
    tiles.forEach((tile) => {
      const img = tile.querySelector<HTMLElement>("img");
      if (!img) return;
      gsap.to(img, {
        yPercent: -6,
        ease: "none",
        scrollTrigger: {
          trigger: tile,
          start: "top bottom",
          end: "bottom top",
          scrub: true,
        },
      });
    });
  }
}

/* --------------------------------------------------------------
   6. Service rows reveal
   -------------------------------------------------------------- */
function animateServices() {
  const rows = document.querySelectorAll<HTMLElement>("[data-svc]");
  if (!rows.length) return;
  rows.forEach((row, i) => {
    const num = row.querySelector(".svc-num");
    const body = row.querySelector(".svc-body");
    gsap.set([num, body], { autoAlpha: 0, y: 28 });
    ScrollTrigger.create({
      trigger: row,
      start: "top 84%",
      once: true,
      onEnter: () =>
        gsap.to([num, body], {
          autoAlpha: 1,
          y: 0,
          duration: 1,
          ease: ARCH,
          stagger: 0.1,
          delay: i * 0.05,
        }),
    });
  });
}

/* --------------------------------------------------------------
   7. Smooth-ish nav scroll (native + offset for sticky rail on mobile)
   -------------------------------------------------------------- */
function wireNav() {
  document
    .querySelectorAll<HTMLAnchorElement>("[data-nav-link]")
    .forEach((a) => {
      a.addEventListener("click", (e) => {
        const id = a.getAttribute("href");
        if (!id || !id.startsWith("#")) return;
        const target = document.querySelector(id);
        if (!target) return;
        e.preventDefault();
        target.scrollIntoView({ behavior: "smooth", block: "start" });
      });
    });
}

/* --------------------------------------------------------------
   Boot
   -------------------------------------------------------------- */
function boot() {
  if (reduceMotion) {
    // Reveal everything immediately for users who prefer reduced motion
    document
      .querySelectorAll<HTMLElement>("[data-reveal], [data-reveal-stagger], [data-split-title]")
      .forEach((el) => gsap.set(el, { autoAlpha: 1, y: 0 }));
    wireNav();
    return;
  }

  animateRail();
  animateHero();
  animateSectionTitles();
  animateReveals();
  animateProjects();
  animateServices();
  wireNav();

  // Refresh once images settle their layout
  window.addEventListener("load", () => ScrollTrigger.refresh());
}

if (document.readyState === "loading") {
  document.addEventListener("DOMContentLoaded", boot);
} else {
  boot();
}
