import { gsap } from "../gsap";
import { prefersReducedMotion } from "../motion";

export function initDemosAnimation() {
  const section =
    document.getElementById("demos") ||
    document.getElementById("prototipos") ||
    document.querySelector(".prototypes-section");
  if (!section) return;

  const header = section.querySelector(".prototypes-header");
  const cards = section.querySelectorAll(".demo-card");

  if (prefersReducedMotion()) {
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

  if (cards.length > 0) {
    gsap.fromTo(
      cards,
      { opacity: 0, y: 36, scale: 0.985 },
      {
        opacity: 1,
        y: 0,
        scale: 1,
        duration: 0.8,
        stagger: 0.12,
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
