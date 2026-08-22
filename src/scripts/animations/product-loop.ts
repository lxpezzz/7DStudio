import { prefersReducedMotion } from "../motion";

export function initProductLoop() {
  const loopRoot = document.getElementById("productSalesLoop");
  if (!loopRoot) return;

  const textSlides = loopRoot.querySelectorAll(".text-slide");
  const visualSlides = loopRoot.querySelectorAll(".visual-slide");
  const indicatorBtns =
    loopRoot.querySelectorAll<HTMLButtonElement>(".indicator-btn");

  let currentIndex = 0;
  const AUTOPLAY_DURATION = 4500;
  const reduceMotion = prefersReducedMotion();

  loopRoot.style.setProperty("--autoplay-duration", `${AUTOPLAY_DURATION}ms`);

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
      const fill = btn.querySelector<HTMLElement>(".progress-fill");

      btn.classList.remove("is-active");
      btn.setAttribute("aria-selected", String(active));

      if (fill) {
        fill.style.animation = "none";
        void fill.offsetWidth; // Trigger reflow to restart css animation
        fill.style.animation = "";
      }

      if (active) {
        btn.classList.add("is-active");
      }
    });
  }

  function nextSlide() {
    const nextIndex = (currentIndex + 1) % textSlides.length;
    setSlide(nextIndex);
  }

  indicatorBtns.forEach((btn, idx) => {
    const fill = btn.querySelector(".progress-fill");
    fill?.addEventListener("animationend", () => {
      if (btn.classList.contains("is-active") && !reduceMotion) {
        nextSlide();
      }
    });

    btn.addEventListener("click", () => {
      setSlide(idx);
    });
  });

  const setPaused = (paused: boolean) => {
    loopRoot.classList.toggle("is-paused", paused);
  };

  loopRoot.addEventListener("mouseenter", () => setPaused(true));
  loopRoot.addEventListener("mouseleave", () => setPaused(false));
  loopRoot.addEventListener("focusin", () => setPaused(true));
  loopRoot.addEventListener("focusout", () => setPaused(false));

  setSlide(0);
}
