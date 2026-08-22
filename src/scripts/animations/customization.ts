import gsap from "gsap";

export function initCustomization() {
  const root = document.querySelector<HTMLElement>("[data-customization]");
  if (!root) return;

  const productButtons = root.querySelectorAll<HTMLButtonElement>(".product-btn");
  const imagePanes = root.querySelectorAll<HTMLElement>(".visual-image-pane");
  const tagline = root.querySelector<HTMLElement>("#customizationTagline");

  const attrButtons = root.querySelectorAll<HTMLButtonElement>(".attr-btn");
  const copy = root.querySelector<HTMLElement>("#customizationCopy");

  const prefersReducedMotion = window.matchMedia(
    "(prefers-reduced-motion: reduce)",
  ).matches;

  let activeProductIndex = 0;
  let activeAttrIndex = 0;

  function switchProduct(targetIndex: number) {
    if (targetIndex === activeProductIndex) return;
    activeProductIndex = targetIndex;

    productButtons.forEach((btn, i) => {
      const isActive = i === targetIndex;
      btn.classList.toggle("is-active", isActive);
      btn.setAttribute("aria-selected", String(isActive));
    });

    imagePanes.forEach((pane, i) => {
      const isActive = i === targetIndex;
      pane.classList.toggle("is-active", isActive);
      pane.setAttribute("aria-hidden", String(!isActive));

      if (isActive) {
        if (!prefersReducedMotion) {
          gsap.fromTo(
            pane,
            { opacity: 0, scale: 0.985, y: 8 },
            {
              opacity: 1,
              scale: 1,
              y: 0,
              duration: 0.35,
              ease: "power2.out",
              overwrite: true,
            },
          );
        } else {
          gsap.set(pane, {
            opacity: 1,
            scale: 1,
            y: 0,
            clearProps: "transform",
            overwrite: true,
          });
        }
      } else {
        gsap.set(pane, { opacity: 0, scale: 1, y: 0, overwrite: true });
      }
    });

    if (tagline && productButtons[targetIndex]) {
      const newTagline = productButtons[targetIndex].dataset.tagline ?? "";
      tagline.textContent = newTagline;
      if (!prefersReducedMotion) {
        gsap.fromTo(
          tagline,
          { opacity: 0, y: 4 },
          { opacity: 1, y: 0, duration: 0.25, ease: "power2.out", overwrite: true },
        );
      }
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
      if (!prefersReducedMotion) {
        gsap.fromTo(
          copy,
          { opacity: 0, y: 4 },
          { opacity: 1, y: 0, duration: 0.25, ease: "power2.out", overwrite: true },
        );
      }
    }
  }

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
}
