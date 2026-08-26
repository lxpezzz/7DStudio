import { gsap, ScrollTrigger } from "../gsap";
import { prefersReducedMotion } from "../motion";

export function initContactAnimation() {
  const root = document.querySelector<HTMLElement>("[data-contact]");
  if (!root) return;

  const info = root.querySelector<HTMLElement>("[data-contact-info]");
  const form = root.querySelector<HTMLElement>("[data-contact-form]");

  if (!info || !form) return;

  const elements = [info, form];

  // Contact is mission-critical: always restore a visible state before doing
  // anything else. This also repairs stale inline styles left by HMR or by the
  // previous ScrollTrigger-based implementation.
  ScrollTrigger.getAll().forEach((trigger) => {
    if (trigger.trigger === root) trigger.kill();
  });
  gsap.killTweensOf(elements);
  gsap.set(elements, {
    opacity: 1,
    visibility: "visible",
  });

  if (root.dataset.contactAnimationInitialized === "true") return;
  root.dataset.contactAnimationInitialized = "true";

  if (prefersReducedMotion()) {
    gsap.set(elements, {
      y: 0,
      clearProps: "transform,willChange",
    });
    return;
  }

  // The observer only decides when to add motion. Visibility never depends on
  // JavaScript or on a scroll trigger, so a failure cannot hide the section.
  if (!("IntersectionObserver" in window)) return;

  const observer = new IntersectionObserver(
    (entries) => {
      if (!entries.some((entry) => entry.isIntersecting)) return;

      observer.disconnect();
      gsap.fromTo(
        elements,
        { y: 24, willChange: "transform" },
        {
          y: 0,
          duration: 0.65,
          stagger: 0.12,
          ease: "power3.out",
          overwrite: "auto",
          onComplete: () => {
            gsap.set(elements, { clearProps: "transform,willChange" });
          },
        },
      );
    },
    {
      rootMargin: "0px 0px -18% 0px",
      threshold: 0.05,
    },
  );

  observer.observe(root);
}
