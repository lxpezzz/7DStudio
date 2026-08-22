import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";

export function initDemosAnimation() {
  const section = document.getElementById("prototipos");
  if (!section) return;

  const prefersReducedMotion = window.matchMedia(
    "(prefers-reduced-motion: reduce)",
  ).matches;

  const header = section.querySelector(".prototypes-header");
  const cards = section.querySelectorAll(".demo-card");

  if (prefersReducedMotion) {
    if (header) gsap.set(header, { opacity: 1, y: 0, clearProps: "all" });
    if (cards.length > 0)
      gsap.set(cards, { opacity: 1, y: 0, scale: 1, clearProps: "all" });
    return;
  }

  if (header) {
    gsap.fromTo(
      header,
      { opacity: 0, y: 28 },
      {
        opacity: 1,
        y: 0,
        duration: 0.8,
        ease: "power2.out",
        scrollTrigger: {
          trigger: header,
          start: "top 88%",
          once: true,
        },
      },
    );
  }

  if (cards && cards.length > 0) {
    gsap.fromTo(
      cards,
      { opacity: 0, y: 40, scale: 0.98 },
      {
        opacity: 1,
        y: 0,
        scale: 1,
        duration: 0.85,
        stagger: 0.15,
        ease: "power2.out",
        scrollTrigger: {
          trigger: section.querySelector(".demos-grid") || section,
          start: "top 84%",
          once: true,
        },
      },
    );
  }
}
