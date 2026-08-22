import Lenis from "lenis";
import { gsap, ScrollTrigger } from "./gsap";
import { prefersReducedMotion } from "./motion";

let lenisInstance: Lenis | null = null;
let rafCallback: ((time: number) => void) | null = null;

export function initSmoothScroll(): Lenis | null {
  if (typeof window === "undefined") return null;

  if (prefersReducedMotion()) {
    if (lenisInstance) {
      lenisInstance.destroy();
      lenisInstance = null;
    }
    return null;
  }

  if (lenisInstance) {
    return lenisInstance;
  }

  const lenis = new Lenis({
    lerp: 0.08,
    smoothWheel: false,
  });

  lenisInstance = lenis;

  // Synchronize ScrollTrigger with Lenis
  lenis.on("scroll", ScrollTrigger.update);

  if (rafCallback) {
    gsap.ticker.remove(rafCallback);
  }

  rafCallback = (time: number) => {
    lenis.raf(time * 1000);
  };

  gsap.ticker.add(rafCallback);
  gsap.ticker.lagSmoothing(0);

  return lenis;
}

export function getLenis(): Lenis | null {
  return lenisInstance;
}
