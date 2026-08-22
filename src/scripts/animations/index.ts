import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { initSmoothScroll } from "../lenis";
import { initHeroAnimation } from "./hero";
import { initBrandAnimation } from "./brand";
import { initDemosAnimation } from "./demos";
import { initPricingAnimation } from "./pricing";
import { initCustomization } from "./customization";
import { initDifferentiators } from "./differentiators";
import { initSolutions } from "./solutions";
import { initProductLoop } from "./product-loop";
import { initHeader } from "./header";

gsap.registerPlugin(ScrollTrigger);

export function initApp() {
  if (typeof window === "undefined") return;

  // 1. Initialize Lenis Smooth Scroll singleton
  initSmoothScroll();

  // 2. Initialize all section animations & interactions
  initHeader();
  initHeroAnimation();
  initProductLoop();
  initSolutions();
  initDemosAnimation();
  initDifferentiators();
  initBrandAnimation();
  initCustomization();
  initPricingAnimation();

  // 3. Recalculate ScrollTrigger triggers after layout is painted
  requestAnimationFrame(() => {
    ScrollTrigger.refresh();
  });
}
