import { ScrollTrigger } from "../gsap";
import { initSmoothScroll } from "../lenis";
import { initHeroAnimation } from "./hero";
import { initBrandAnimation } from "./brand";
import { initDemosAnimation } from "./demos";
import { initCustomization } from "./customization";
import { initDifferentiators } from "./differentiators";
import { initProductLoop } from "./product-loop";
import { initHeader } from "./header";
import { initPricing } from "./pricing";
import { initFinalCtaAnimation } from "./finalCta";
import { initContactAnimation } from "./contact";

let activePageRoot: Element | null = null;
let refreshFrame: number | null = null;

export function initApp() {
  if (typeof window === "undefined") return;

  const pageRoot = document.querySelector(".page-wrapper");

  // Astro emits `astro:page-load` on the initial render too. Layout.astro also
  // calls initApp directly, so without this guard every timeline, trigger,
  // autoplay tween and event listener is registered twice.
  if (!pageRoot || pageRoot === activePageRoot) return;

  // If a client-side navigation replaces the page, discard triggers that still
  // reference the detached DOM before registering the new page.
  if (activePageRoot) {
    ScrollTrigger.getAll().forEach((trigger) => trigger.kill());
  }

  activePageRoot = pageRoot;

  // 1. Initialize Lenis Smooth Scroll singleton
  try {
    initSmoothScroll();
  } catch (err) {
    console.warn("Smooth scroll initialization skipped:", err);
  }

  // 2. Initialize all section animations & interactions safely
  const initializers = [
    initHeader,
    initHeroAnimation,
    initProductLoop,
    initDemosAnimation,
    initDifferentiators,
    initBrandAnimation,
    initCustomization,
    initPricing,
    initFinalCtaAnimation,
    initContactAnimation,
  ];

  initializers.forEach((fn) => {
    try {
      fn();
    } catch (err) {
      console.error(`Error in animation initializer ${fn.name}:`, err);
    }
  });

  // 3. Recalculate ScrollTrigger triggers across all rendering phases
  if (refreshFrame !== null) cancelAnimationFrame(refreshFrame);
  refreshFrame = requestAnimationFrame(() => {
    if (activePageRoot === pageRoot) ScrollTrigger.refresh();
    refreshFrame = null;
  });

  if (document.fonts) {
    document.fonts.ready.then(() => {
      if (activePageRoot === pageRoot) ScrollTrigger.refresh();
    });
  }

  if (document.readyState === "complete") {
    ScrollTrigger.refresh();
  } else {
    window.addEventListener("load", () => {
      if (activePageRoot === pageRoot) ScrollTrigger.refresh();
    }, { once: true });
  }
}
