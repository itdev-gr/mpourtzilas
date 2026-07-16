import { gsap } from "gsap";

const ARCH = "expo.out";
const reduceMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;

export function initLightbox() {
  const lb = document.querySelector<HTMLElement>("[data-lightbox]");
  if (!lb) return;

  const imgEl = lb.querySelector<HTMLImageElement>("[data-lb-img]");
  const capEl = lb.querySelector<HTMLElement>("[data-lb-caption]");
  const countEl = lb.querySelector<HTMLElement>("[data-lb-count]");
  const stageEl = lb.querySelector<HTMLElement>(".lightbox__stage");
  const triggers = Array.from(
    document.querySelectorAll<HTMLButtonElement>("[data-lb-trigger]"),
  );
  if (!imgEl || !capEl || !countEl || !stageEl || triggers.length === 0) return;

  const items = triggers.map((btn) => {
    const img = btn.querySelector("img");
    return {
      src: img?.currentSrc || img?.src || "",
      alt: img?.alt || btn.getAttribute("aria-label")?.replace(/^Μεγέθυνση:\s*/, "") || "",
    };
  });

  let idx = 0;
  let isOpen = false;

  const setContent = () => {
    const it = items[idx];
    imgEl.src = it.src;
    imgEl.alt = it.alt;
    capEl.textContent = it.alt;
    countEl.textContent = `${idx + 1} / ${items.length}`;
  };

  const open = (i: number) => {
    if (isOpen) return;
    idx = i;
    setContent();
    isOpen = true;
    lb.hidden = false;
    lb.setAttribute("aria-hidden", "false");
    document.body.style.overflow = "hidden";

    if (reduceMotion) {
      gsap.set(lb, { autoAlpha: 1 });
      gsap.set([imgEl, capEl, countEl], { autoAlpha: 1, y: 0, scale: 1 });
      return;
    }

    gsap.set(lb, { autoAlpha: 0 });
    gsap.set(imgEl, { autoAlpha: 0, scale: 0.94 });
    gsap.set([capEl, countEl], { autoAlpha: 0, y: 10 });

    gsap.to(lb, { autoAlpha: 1, duration: 0.42, ease: ARCH });
    gsap.to(imgEl, { autoAlpha: 1, scale: 1, duration: 0.55, ease: ARCH, delay: 0.05 });
    gsap.to([capEl, countEl], {
      autoAlpha: 1,
      y: 0,
      duration: 0.38,
      ease: ARCH,
      delay: 0.12,
      stagger: 0.05,
    });
  };

  const close = () => {
    if (!isOpen) return;

    const finish = () => {
      lb.hidden = true;
      lb.setAttribute("aria-hidden", "true");
      document.body.style.overflow = "";
      isOpen = false;
    };

    if (reduceMotion) {
      finish();
      return;
    }

    gsap.timeline({ onComplete: finish })
      .to([imgEl, capEl, countEl], {
        autoAlpha: 0,
        y: 8,
        scale: 0.97,
        duration: 0.24,
        ease: "power2.in",
      })
      .to(lb, { autoAlpha: 0, duration: 0.28, ease: "power2.in" }, 0.06);
  };

  const go = (nextIdx: number) => {
    if (!isOpen || nextIdx === idx) return;
    idx = nextIdx;
    const it = items[idx];

    if (reduceMotion) {
      setContent();
      return;
    }

    gsap.to(imgEl, {
      autoAlpha: 0,
      scale: 0.98,
      duration: 0.18,
      ease: "power2.in",
      onComplete: () => {
        imgEl.src = it.src;
        imgEl.alt = it.alt;
        capEl.textContent = it.alt;
        countEl.textContent = `${idx + 1} / ${items.length}`;
        gsap.fromTo(
          imgEl,
          { autoAlpha: 0, scale: 1.02 },
          { autoAlpha: 1, scale: 1, duration: 0.34, ease: ARCH },
        );
      },
    });
  };

  const next = () => go((idx + 1) % items.length);
  const prev = () => go((idx - 1 + items.length) % items.length);

  triggers.forEach((btn, i) => {
    btn.addEventListener("click", () => open(i));
  });

  lb.querySelector("[data-lb-close]")?.addEventListener("click", close);
  lb.querySelector("[data-lb-next]")?.addEventListener("click", next);
  lb.querySelector("[data-lb-prev]")?.addEventListener("click", prev);
  lb.addEventListener("click", (e) => {
    if (e.target === lb) close();
  });
  stageEl.addEventListener("click", (e) => e.stopPropagation());

  document.addEventListener("keydown", (e) => {
    if (!isOpen) return;
    if (e.key === "Escape") close();
    else if (e.key === "ArrowRight") next();
    else if (e.key === "ArrowLeft") prev();
  });
}
