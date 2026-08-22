export function initHeader() {
  const toggle = document.getElementById("menuToggle");
  const menu = document.getElementById("mobileMenu");

  if (!toggle || !menu) return;

  function closeMenu() {
    if (!toggle || !menu) return;

    toggle.setAttribute("aria-expanded", "false");
    toggle.classList.remove("is-open");
    menu.hidden = true;
    document.body.style.overflow = "";
  }

  function openMenu() {
    if (!toggle || !menu) return;

    toggle.setAttribute("aria-expanded", "true");
    toggle.classList.add("is-open");
    menu.hidden = false;
    document.body.style.overflow = "hidden";
  }

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
