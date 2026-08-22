import { gsap } from "../gsap";
import { prefersReducedMotion } from "../motion";

export function initBrandAnimation() {
  const section = document.getElementById("statementScene");
  if (!section) return;

  const frame = document.getElementById("statementImageFrame");
  const title = document.getElementById("statementTitle");
  const desc = document.getElementById("statementDesc");
  const actions = document.getElementById("statementActions");

  if (!frame || !title || !desc || !actions) return;

  if (prefersReducedMotion()) {
    gsap.set([frame, title, desc, actions], {
      opacity: 1,
      y: 0,
      scale: 1,
      clearProps: "all",
    });
    return;
  }

  const tl = gsap.timeline({
    scrollTrigger: {
      trigger: section,
      start: "top 85%",
      end: "bottom 65%",
      scrub: 0.8,
    },
  });

  tl.fromTo(
    frame,
    {
      scale: 1.05,
      y: 40,
      opacity: 0.6,
      clipPath: "inset(6% 0% 0% 0% round 24px)",
    },
    {
      scale: 1,
      y: 0,
      opacity: 1,
      clipPath: "inset(0% 0% 0% 0% round 24px)",
      ease: "power2.out",
    },
  )
    .fromTo(
      title,
      { opacity: 0, y: 24 },
      { opacity: 1, y: 0, ease: "power2.out" },
      "-=0.35",
    )
    .fromTo(
      desc,
      { opacity: 0, y: 18 },
      { opacity: 1, y: 0, ease: "power2.out" },
      "-=0.25",
    )
    .fromTo(
      actions,
      { opacity: 0, y: 14 },
      { opacity: 1, y: 0, ease: "power2.out" },
      "-=0.2",
    );
}
