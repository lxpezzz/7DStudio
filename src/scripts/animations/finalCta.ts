import { gsap } from "../gsap";
import { prefersReducedMotion } from "../motion";

export function initFinalCtaAnimation() {
  const root = document.querySelector<HTMLElement>("[data-final-cta], .final-cta-section");
  if (!root) return;

  const canvas = root.querySelector<HTMLElement>("[data-cta-canvas], .final-cta-canvas");
  const title = root.querySelector<HTMLElement>("[data-cta-title], .final-cta-title");
  const text = root.querySelector<HTMLElement>("[data-cta-desc], .final-cta-desc");
  const button = root.querySelector<HTMLElement>("[data-cta-actions], [data-cta-btn], .final-cta-actions");

  if (prefersReducedMotion()) {
    const all = [canvas, title, text, button].filter(Boolean) as HTMLElement[];
    gsap.set(all, { opacity: 1, y: 0, scale: 1, clearProps: "all" });
    return;
  }

  const tl = gsap.timeline({
    scrollTrigger: {
      trigger: root,
      start: "top 82%",
      once: true,
    },
    defaults: {
      ease: "power3.out",
    },
  });

  if (canvas) {
    tl.fromTo(
      canvas,
      { opacity: 0, y: 30, scale: 0.99 },
      { opacity: 1, y: 0, scale: 1, duration: 0.7 },
      0,
    );
  }

  if (title) {
    tl.fromTo(
      title,
      { opacity: 0, y: 20 },
      { opacity: 1, y: 0, duration: 0.6 },
      "-=0.4",
    );
  }

  if (text) {
    tl.fromTo(
      text,
      { opacity: 0, y: 16 },
      { opacity: 1, y: 0, duration: 0.5 },
      "-=0.35",
    );
  }

  if (button) {
    tl.fromTo(
      button,
      { opacity: 0, y: 12 },
      { opacity: 1, y: 0, duration: 0.45 },
      "-=0.25",
    );
  }
}