export function initHeader() {
  const header = document.querySelector<HTMLElement>(".studio-header");
  if (!header) return;

  // 1. Mobile menu toggle setup
  const toggle = document.getElementById("menuToggle");
  const menu = document.getElementById("mobileMenu");

  if (toggle && menu && !toggle.dataset.listenerAttached) {
    toggle.dataset.listenerAttached = "true";

    const closeMenu = () => {
      toggle.setAttribute("aria-expanded", "false");
      toggle.classList.remove("is-open");
      menu.hidden = true;
      document.body.style.overflow = "";
    };

    const openMenu = () => {
      toggle.setAttribute("aria-expanded", "true");
      toggle.classList.add("is-open");
      menu.hidden = false;
      document.body.style.overflow = "hidden";
    };

    toggle.addEventListener("click", () => {
      const isOpen = toggle.getAttribute("aria-expanded") === "true";
      isOpen ? closeMenu() : openMenu();
    });

    menu.querySelectorAll("a").forEach((link) => {
      link.addEventListener("click", closeMenu);
    });

    document.addEventListener("keydown", (event) => {
      if (event.key === "Escape") closeMenu();
    });
  }

  // 2. Scroll-linked Header Theme Detection
  const sections = Array.from(
    document.querySelectorAll<HTMLElement>("[data-header-theme]"),
  );
  if (sections.length === 0) return;

  let currentTheme = header.getAttribute("data-theme") || "light";

  const updateHeaderTheme = () => {
    const headerRect = header.getBoundingClientRect();
    // Sample at the vertical midpoint of the fixed header
    const sampleY = headerRect.top + headerRect.height / 2;

    let matchedTheme: string | null = null;

    for (let i = 0; i < sections.length; i++) {
      const section = sections[i];
      const rect = section.getBoundingClientRect();
      if (rect.top <= sampleY && rect.bottom > sampleY) {
        matchedTheme = section.getAttribute("data-header-theme");
        break;
      }
    }

    // Fallback if above first section or below last section
    if (!matchedTheme) {
      if (window.scrollY < 80) {
        matchedTheme = sections[0].getAttribute("data-header-theme") || "light";
      } else {
        for (let i = sections.length - 1; i >= 0; i--) {
          const rect = sections[i].getBoundingClientRect();
          if (rect.top <= sampleY) {
            matchedTheme = sections[i].getAttribute("data-header-theme") || "light";
            break;
          }
        }
      }
    }

    if (matchedTheme && matchedTheme !== currentTheme) {
      currentTheme = matchedTheme;
      header.setAttribute("data-theme", currentTheme);
    }
  };

  // Run immediate initial detection
  updateHeaderTheme();

  // Attach optimized scroll and resize listeners
  if (!header.dataset.scrollListenerAttached) {
    header.dataset.scrollListenerAttached = "true";

    let ticking = false;
    const onScrollOrResize = () => {
      if (!ticking) {
        window.requestAnimationFrame(() => {
          updateHeaderTheme();
          ticking = false;
        });
        ticking = true;
      }
    };

    window.addEventListener("scroll", onScrollOrResize, { passive: true });
    window.addEventListener("resize", onScrollOrResize, { passive: true });
  }
}

