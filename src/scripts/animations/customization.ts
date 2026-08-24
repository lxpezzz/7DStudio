import { gsap } from "../gsap";
import { prefersReducedMotion } from "../motion";

const AUTOPLAY_DURATION = 6; // 6 seconds

let activeProductIndex = 0;
let activeAttrIndex = 0;
let isTransitioning = false;
let isPaused = false;
let transitionTl: gsap.core.Timeline | null = null;
let autoplayTween: gsap.core.Tween | null = null;

export function initCustomization() {
  const root = document.querySelector<HTMLElement>("[data-customization]");
  if (!root) return;

  // Reset state on re-initialization
  if (transitionTl) {
    transitionTl.kill();
    transitionTl = null;
  }
  if (autoplayTween) {
    autoplayTween.kill();
    autoplayTween = null;
  }
  activeProductIndex = 0;
  activeAttrIndex = 0;
  isTransitioning = false;
  isPaused = false;

  const productButtons = root.querySelectorAll<HTMLButtonElement>(".product-btn");
  const imagePanes = root.querySelectorAll<HTMLElement>(".visual-image-pane");
  const tagline = root.querySelector<HTMLElement>("#customizationTagline");
  const markerFills = root.querySelectorAll<HTMLElement>(".product-marker-fill");

  const attrButtons = root.querySelectorAll<HTMLButtonElement>(".attr-btn");
  const copy = root.querySelector<HTMLElement>("#customizationCopy");

  const reduceMotion = prefersReducedMotion();

  function resetProgressBars() {
    markerFills.forEach((fill) => {
      gsap.set(fill, { scaleX: 0 });
    });
  }

  function startAutoplayCycle() {
    if (reduceMotion || productButtons.length <= 1) return;

    if (autoplayTween) {
      autoplayTween.kill();
      autoplayTween = null;
    }

    resetProgressBars();

    const currentFill = markerFills[activeProductIndex];
    if (currentFill) {
      autoplayTween = gsap.fromTo(
        currentFill,
        { scaleX: 0 },
        {
          scaleX: 1,
          duration: AUTOPLAY_DURATION,
          ease: "none",
          onComplete: () => {
            const nextIndex = (activeProductIndex + 1) % productButtons.length;
            switchProduct(nextIndex);
          },
        },
      );
    } else {
      autoplayTween = gsap.delayedCall(AUTOPLAY_DURATION, () => {
        const nextIndex = (activeProductIndex + 1) % productButtons.length;
        switchProduct(nextIndex);
      });
    }
  }

  function pauseAutoplay() {
    if (reduceMotion) return;
    isPaused = true;
    if (autoplayTween) {
      autoplayTween.pause();
    }
  }

  function resumeAutoplay() {
    if (reduceMotion) return;
    isPaused = false;
    if (!isTransitioning) {
      startAutoplayCycle();
    }
  }

  function switchProduct(targetIndex: number) {
    if (targetIndex === activeProductIndex && !isTransitioning) {
      if (!isPaused) {
        startAutoplayCycle();
      }
      return;
    }

    const prevIndex = activeProductIndex;
    activeProductIndex = targetIndex;

    // 1. Update button states immediately
    productButtons.forEach((btn, i) => {
      const isActive = i === targetIndex;
      btn.classList.toggle("is-active", isActive);
      btn.setAttribute("aria-selected", String(isActive));
    });

    const prevPane = imagePanes[prevIndex];
    const nextPane = imagePanes[targetIndex];
    const newTagline = productButtons[targetIndex]?.dataset.tagline ?? "";

    // 2. Clear previous transitions and reset timer
    if (transitionTl) {
      transitionTl.kill();
      transitionTl = null;
    }
    if (autoplayTween) {
      autoplayTween.kill();
      autoplayTween = null;
    }
    resetProgressBars();

    // 3. Reduced motion handling
    if (reduceMotion) {
      imagePanes.forEach((pane, i) => {
        const isActive = i === targetIndex;
        pane.classList.toggle("is-active", isActive);
        pane.setAttribute("aria-hidden", String(!isActive));
        gsap.set(pane, {
          opacity: isActive ? 1 : 0,
          scale: 1,
          y: 0,
          clearProps: "transform",
        });
      });

      if (tagline) {
        tagline.textContent = newTagline;
      }
      return;
    }

    // 4. GSAP Editorial Transition
    isTransitioning = true;

    transitionTl = gsap.timeline({
      onComplete: () => {
        isTransitioning = false;
        if (!isPaused && !document.hidden) {
          startAutoplayCycle();
        }
      },
    });

    // Outgoing product animation
    if (prevPane && prevPane !== nextPane) {
      transitionTl.to(
        prevPane,
        {
          opacity: 0,
          y: -10,
          scale: 0.985,
          duration: 0.22,
          ease: "power2.in",
          onComplete: () => {
            prevPane.classList.remove("is-active");
            prevPane.setAttribute("aria-hidden", "true");
            gsap.set(prevPane, { opacity: 0, scale: 1, y: 0 });
          },
        },
        0,
      );
    }

    // Outgoing tagline animation
    if (tagline) {
      transitionTl.to(
        tagline,
        {
          opacity: 0,
          y: -4,
          duration: 0.18,
          ease: "power2.in",
          onComplete: () => {
            tagline.textContent = newTagline;
          },
        },
        0,
      );
    }

    // Incoming product animation
    if (nextPane) {
      transitionTl.call(
        () => {
          nextPane.classList.add("is-active");
          nextPane.setAttribute("aria-hidden", "false");
        },
        undefined,
        prevPane ? 0.22 : 0,
      );

      transitionTl.fromTo(
        nextPane,
        { opacity: 0, y: 12, scale: 0.985 },
        {
          opacity: 1,
          y: 0,
          scale: 1,
          duration: 0.45,
          ease: "power3.out",
        },
        prevPane ? 0.22 : 0,
      );
    }

    // Incoming tagline animation
    if (tagline) {
      transitionTl.fromTo(
        tagline,
        { opacity: 0, y: 6 },
        {
          opacity: 1,
          y: 0,
          duration: 0.4,
          ease: "power3.out",
        },
        prevPane ? 0.25 : 0,
      );
    }
  }

  function switchAttribute(targetIndex: number) {
    if (targetIndex === activeAttrIndex) return;
    activeAttrIndex = targetIndex;

    attrButtons.forEach((btn, i) => {
      const isActive = i === targetIndex;
      btn.classList.toggle("is-active", isActive);
      btn.setAttribute("aria-selected", String(isActive));
    });

    if (copy && attrButtons[targetIndex]) {
      const newDesc = attrButtons[targetIndex].dataset.description ?? "";
      copy.textContent = newDesc;
      if (!reduceMotion) {
        gsap.fromTo(
          copy,
          { opacity: 0, y: 4 },
          {
            opacity: 1,
            y: 0,
            duration: 0.25,
            ease: "power2.out",
            overwrite: true,
          },
        );
      }
    }
  }

  // Event Listeners for manual clicks
  productButtons.forEach((btn) => {
    btn.addEventListener("click", () => {
      const idx = parseInt(btn.dataset.productIndex || "0", 10);
      switchProduct(idx);
    });
  });

  attrButtons.forEach((btn) => {
    btn.addEventListener("click", () => {
      const idx = parseInt(btn.dataset.attributeIndex || "0", 10);
      switchAttribute(idx);
    });
  });

  // Pause autoplay on hover or focus within the customization section
  root.addEventListener("mouseenter", () => {
    pauseAutoplay();
  });

  root.addEventListener("mouseleave", () => {
    resumeAutoplay();
  });

  root.addEventListener("focusin", () => {
    pauseAutoplay();
  });

  root.addEventListener("focusout", (e) => {
    if (!root.contains(e.relatedTarget as Node | null)) {
      resumeAutoplay();
    }
  });

  document.addEventListener("visibilitychange", () => {
    if (document.hidden) {
      pauseAutoplay();
    } else {
      resumeAutoplay();
    }
  });

  // Initialize initial state & start autoplay cycle
  resetProgressBars();
  if (!reduceMotion) {
    startAutoplayCycle();
  }
}
