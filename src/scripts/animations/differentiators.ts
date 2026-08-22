import { gsap, ScrollTrigger } from "../gsap";

export function initDifferentiators() {
  const root = document.querySelector<HTMLElement>("[data-criteria]");
  if (!root) return;

  const buttons = gsap.utils.toArray<HTMLButtonElement>(
    root.querySelectorAll("[data-index]"),
  );

  const visual = root.querySelector<HTMLElement>("[data-visual]");
  const description = root.querySelector<HTMLElement>(
    "[data-description]:not(button)",
  );
  const counter = root.querySelector<HTMLElement>("[data-counter]");
  const progress = root.querySelector<HTMLElement>("[data-progress]");

  let active = 0;

  const setActive = (index: number) => {
    if (index === active && visual?.dataset.active === String(index)) return;

    active = index;

    buttons.forEach((button, i) => {
      const selected = i === index;
      button.classList.toggle("active", selected);
      button.setAttribute("aria-pressed", String(selected));
    });

    if (visual) {
      visual.dataset.active = String(index);

      gsap.fromTo(
        visual,
        { y: 6, opacity: 0.8 },
        {
          y: 0,
          opacity: 1,
          duration: 0.45,
          ease: "power3.out",
          overwrite: true,
        },
      );
    }

    if (description) {
      description.textContent = buttons[index].dataset.description ?? "";
    }

    if (counter) {
      counter.textContent = `0${index + 1} / 0${buttons.length}`;
    }

    if (progress) {
      gsap.to(progress, {
        scaleX: (index + 1) / buttons.length,
        duration: 0.35,
        ease: "power2.out",
      });
    }
  };

  buttons.forEach((button, index) => {
    button.addEventListener("click", () => setActive(index));
  });

  if (window.innerWidth >= 1024) {
    ScrollTrigger.create({
      trigger: root,
      start: "top top+=96",
      end: "bottom bottom",
      onUpdate: (self) => {
        const index = Math.min(
          buttons.length - 1,
          Math.floor(self.progress * buttons.length),
        );
        setActive(index);
      },
    });
  }
}
