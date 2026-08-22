export function initSolutions() {
  const showcase = document.getElementById("visualProductsShowcase");
  if (!showcase) return;

  const tabBtns = showcase.querySelectorAll<HTMLButtonElement>(".tab-btn");
  const detailPanes = showcase.querySelectorAll(".detail-pane");
  const visualItems = showcase.querySelectorAll(".visual-item");

  function setActiveTab(index: number) {
    tabBtns.forEach((btn, i) => {
      const active = i === index;
      btn.classList.toggle("is-active", active);
      btn.setAttribute("aria-selected", String(active));
    });

    detailPanes.forEach((pane, i) => {
      const active = i === index;
      pane.classList.toggle("is-active", active);
      pane.setAttribute("aria-hidden", String(!active));
    });

    visualItems.forEach((item, i) => {
      const active = i === index;
      item.classList.toggle("is-active", active);
      item.setAttribute("aria-hidden", String(!active));
    });
  }

  tabBtns.forEach((btn, idx) => {
    btn.addEventListener("click", () => {
      setActiveTab(idx);
    });

    btn.addEventListener("keydown", (e) => {
      let targetIdx = -1;
      if (e.key === "ArrowRight" || e.key === "ArrowDown") {
        targetIdx = (idx + 1) % tabBtns.length;
      } else if (e.key === "ArrowLeft" || e.key === "ArrowUp") {
        targetIdx = (idx - 1 + tabBtns.length) % tabBtns.length;
      }

      if (targetIdx !== -1) {
        e.preventDefault();
        tabBtns[targetIdx].focus();
        setActiveTab(targetIdx);
      }
    });
  });
}
