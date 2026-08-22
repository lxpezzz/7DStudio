import { gsap } from "../gsap";
import { prefersReducedMotion } from "../motion";

export function initHeroAnimation() {
  const hero = document.getElementById("hero");
  if (!hero) return;

  const eyebrow = hero.querySelector(".hero-eyebrow");
  const titleLead = hero.querySelector(".title-lead");
  const titleSub = hero.querySelector(".title-sub");
  const desc = hero.querySelector(".hero-description");
  const actions = hero.querySelectorAll(".hero-actions > *");
  const footer = hero.querySelector(".hero-footer-bar");

  if (prefersReducedMotion()) {
    gsap.set([eyebrow, titleLead, titleSub, desc, actions, footer], {
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

  if (eyebrow) {
    tl.fromTo(
      eyebrow,
      { opacity: 0, y: 24 },
      { opacity: 1, y: 0, duration: 0.65 },
      0.05,
    );
  }

  if (titleLead && titleSub) {
    tl.fromTo(
      [titleLead, titleSub],
      { opacity: 0, y: 36 },
      { opacity: 1, y: 0, stagger: 0.12, duration: 0.9 },
      0.15,
    );
  }

  if (desc) {
    tl.fromTo(
      desc,
      { opacity: 0, y: 24 },
      { opacity: 1, y: 0, duration: 0.8 },
      0.4,
    );
  }

  if (actions.length > 0) {
    tl.fromTo(
      actions,
      { opacity: 0, y: 18 },
      { opacity: 1, y: 0, stagger: 0.08, duration: 0.7 },
      0.55,
    );
  }

  if (footer) {
    tl.fromTo(
      footer,
      { opacity: 0, y: 14 },
      { opacity: 1, y: 0, duration: 0.7 },
      0.7,
    );
  }
}
