import { gsap } from "../gsap";
import { prefersReducedMotion } from "../motion";

export function initHeroAnimation() {
  const hero = document.getElementById("hero");
  if (!hero) return;

  const titleLead = hero.querySelector(".title-lead");
  const titleSub = hero.querySelector(".title-sub");
  const desc = hero.querySelector(".hero-description");
  const actions = hero.querySelectorAll(".hero-actions > *");
  const footer = hero.querySelector(".hero-footer-bar");
  const canvas = hero.querySelector(".hero-canvas");

  const validElements = [titleLead, titleSub, desc, ...Array.from(actions), footer].filter(
    Boolean,
  ) as HTMLElement[];

  if (prefersReducedMotion()) {
    gsap.set(validElements, {
      opacity: 1,
      y: 0,
      clearProps: "all",
    });
    return;
  }

  const tl = gsap.timeline({
    defaults: {
      ease: "power3.out",
      duration: 0.85,
    },
  });

  if (canvas) {
    tl.fromTo(
      canvas,
      { opacity: 0.8, scale: 0.99 },
      { opacity: 1, scale: 1, duration: 0.9 },
      0,
    );
  }

  if (titleLead || titleSub) {
    const titles = [titleLead, titleSub].filter(Boolean) as HTMLElement[];
    tl.fromTo(
      titles,
      { opacity: 0, y: 32 },
      { opacity: 1, y: 0, stagger: 0.1, duration: 0.85 },
      0.1,
    );
  }

  if (desc) {
    tl.fromTo(
      desc,
      { opacity: 0, y: 22 },
      { opacity: 1, y: 0, duration: 0.75 },
      0.35,
    );
  }

  if (actions.length > 0) {
    tl.fromTo(
      actions,
      { opacity: 0, y: 16 },
      { opacity: 1, y: 0, stagger: 0.08, duration: 0.65 },
      0.5,
    );
  }

  if (footer) {
    tl.fromTo(
      footer,
      { opacity: 0, y: 14 },
      { opacity: 1, y: 0, duration: 0.65 },
      0.65,
    );
  }
}
