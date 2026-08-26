import { gsap } from "../gsap";
import { prefersReducedMotion } from "../motion";

export function initProductLoop() {
  const loopRoot = document.getElementById("productSalesLoop");
  if (!loopRoot) return;

  const textSlides = loopRoot.querySelectorAll(".text-slide");
  const visualSlides = loopRoot.querySelectorAll(".visual-slide");
  const indicatorBtns =
    loopRoot.querySelectorAll<HTMLButtonElement>(".indicator-btn");

  if (textSlides.length === 0 || visualSlides.length === 0) return;

  let currentIndex = 0;
  let progressTween: gsap.core.Tween | null = null;
  let isPaused = false;
  const AUTOPLAY_DURATION = 4.5;
  const reduceMotion = prefersReducedMotion();

  function startProgress() {
    if (progressTween) {
      progressTween.kill();
      progressTween = null;
    }

    // Reset all progress fills
    indicatorBtns.forEach((btn, i) => {
      const fill = btn.querySelector<HTMLElement>(".progress-fill");
      if (fill) {
        gsap.set(fill, { scaleX: i === currentIndex && reduceMotion ? 1 : 0 });
      }
    });

    if (reduceMotion || indicatorBtns.length <= 1) return;

    const currentBtn = indicatorBtns[currentIndex];
    const currentFill = currentBtn?.querySelector<HTMLElement>(".progress-fill");

    if (currentFill) {
      progressTween = gsap.fromTo(
        currentFill,
        { scaleX: 0 },
        {
          scaleX: 1,
          duration: AUTOPLAY_DURATION,
          ease: "none",
          onComplete: () => {
            nextSlide();
          },
        },
      );

      if (isPaused) {
        progressTween.pause();
      }
    }
  }

  function setSlide(index: number) {
    currentIndex = index;

    textSlides.forEach((slide, i) => {
      const active = i === index;
      slide.classList.toggle("is-active", active);
      slide.setAttribute("aria-hidden", String(!active));
    });

    visualSlides.forEach((slide, i) => {
      const active = i === index;
      slide.classList.toggle("is-active", active);
      slide.setAttribute("aria-hidden", String(!active));
    });

    indicatorBtns.forEach((btn, i) => {
      const active = i === index;
      btn.classList.toggle("is-active", active);
      btn.setAttribute("aria-selected", String(active));
    });

    startProgress();
  }

  function nextSlide() {
    const nextIndex = (currentIndex + 1) % textSlides.length;
    setSlide(nextIndex);
  }

  indicatorBtns.forEach((btn, idx) => {
    btn.addEventListener("click", () => {
      setSlide(idx);
    });
  });

  const pauseLoop = () => {
    isPaused = true;
    if (progressTween) progressTween.pause();
    loopRoot.classList.add("is-paused");
  };

  const resumeLoop = () => {
    isPaused = false;
    if (progressTween) progressTween.resume();
    loopRoot.classList.remove("is-paused");
  };

  loopRoot.addEventListener("mouseenter", pauseLoop);
  loopRoot.addEventListener("mouseleave", resumeLoop);
  loopRoot.addEventListener("focusin", pauseLoop);
  loopRoot.addEventListener("focusout", (e) => {
    if (!loopRoot.contains(e.relatedTarget as Node | null)) {
      resumeLoop();
    }
  });

  setSlide(0);
}
