import { gsap } from "../gsap";
import { prefersReducedMotion } from "../motion";

export function initPricing() {
  const root = document.querySelector<HTMLElement>("[data-pricing]");
  if (!root) return;

  // 1. Target Elements Selection
  const header = root.querySelector<HTMLElement>("[data-pricing-header]");
  const eyebrow = header?.querySelector<HTMLElement>("[data-pricing-eyebrow]");
  const title = header?.querySelector<HTMLElement>("[data-pricing-title]");
  const desc = header?.querySelector<HTMLElement>("[data-pricing-desc]");

  const comparison = root.querySelector<HTMLElement>("[data-pricing-comparison]");
  const comparisonHeader = comparison?.querySelector<HTMLElement>(
    "[data-pricing-comparison-header]",
  );
  const desktopTable = root.querySelector<HTMLElement>("[data-pricing-table]");
  const desktopRows = desktopTable
    ? gsap.utils.toArray<HTMLElement>(
        desktopTable.querySelectorAll("[data-pricing-row]"),
      )
    : [];
  const featuredEls = desktopTable
    ? gsap.utils.toArray<HTMLElement>(
        desktopTable.querySelectorAll("[data-pricing-featured]"),
      )
    : [];
  const recommendedBadges = gsap.utils.toArray<HTMLElement>(
    root.querySelectorAll("[data-pricing-recommended]"),
  );

  const mobileTable = root.querySelector<HTMLElement>(
    "[data-pricing-table-mobile]",
  );
  const mobileRows = mobileTable
    ? gsap.utils.toArray<HTMLElement>(
        mobileTable.querySelectorAll("[data-pricing-row]"),
      )
    : [];

  const physical = root.querySelector<HTMLElement>("[data-pricing-physical]");
  const physicalHeader = physical?.querySelector<HTMLElement>(
    "[data-pricing-physical-header]",
  );
  const physicalSub = physical?.querySelector<HTMLElement>(
    "[data-pricing-physical-sub]",
  );
  const cards = gsap.utils.toArray<HTMLElement>(
    root.querySelectorAll("[data-pricing-card]"),
  );

  const cta = root.querySelector<HTMLElement>("[data-pricing-cta]");

  // 2. Reduced Motion Fallback
  if (prefersReducedMotion()) {
    const allAnimatedElements = [
      header,
      eyebrow,
      title,
      desc,
      comparison,
      comparisonHeader,
      desktopTable,
      ...desktopRows,
      ...featuredEls,
      ...recommendedBadges,
      mobileTable,
      ...mobileRows,
      physical,
      physicalHeader,
      physicalSub,
      ...cards,
      cta,
    ].filter((el): el is HTMLElement => Boolean(el));

    gsap.set(allAnimatedElements, {
      opacity: 1,
      y: 0,
      scale: 1,
      clearProps: "all",
    });
    return;
  }

  // 3. ScrollTrigger Animations (Exactly 4 targeted triggers)

  // --- Trigger 1: Section Header ---
  if (header) {
    const headerTl = gsap.timeline({
      scrollTrigger: {
        trigger: header,
        start: "top 82%",
        once: true,
      },
      defaults: {
        ease: "power3.out",
      },
    });

    if (eyebrow) {
      headerTl.fromTo(
        eyebrow,
        { opacity: 0, y: 24 },
        { opacity: 1, y: 0, duration: 0.55 },
      );
    }

    if (title) {
      headerTl.fromTo(
        title,
        { opacity: 0, y: 24 },
        { opacity: 1, y: 0, duration: 0.65 },
        "-=0.4",
      );
    }

    if (desc) {
      headerTl.fromTo(
        desc,
        { opacity: 0, y: 24 },
        { opacity: 1, y: 0, duration: 0.7 },
        "-=0.45",
      );
    }
  }

  // --- Trigger 2: Web Services Comparison Table ---
  if (comparison) {
    const comparisonTl = gsap.timeline({
      scrollTrigger: {
        trigger: comparison,
        start: "top 82%",
        once: true,
      },
      defaults: {
        ease: "power3.out",
      },
    });

    if (comparisonHeader) {
      comparisonTl.fromTo(
        comparisonHeader,
        { opacity: 0, y: 16 },
        { opacity: 1, y: 0, duration: 0.5 },
      );
    }

    // Desktop Table Animation
    if (desktopTable) {
      comparisonTl.fromTo(
        desktopTable,
        { opacity: 0, y: 30, scale: 0.985 },
        { opacity: 1, y: 0, scale: 1, duration: 0.65 },
        comparisonHeader ? "-=0.3" : 0,
      );

      if (desktopRows.length > 0) {
        comparisonTl.fromTo(
          desktopRows,
          { opacity: 0, y: 8 },
          { opacity: 1, y: 0, duration: 0.45, stagger: 0.05 },
          "-=0.35",
        );
      }

      if (featuredEls.length > 0) {
        comparisonTl.fromTo(
          featuredEls,
          { opacity: 0.85, scale: 0.99 },
          { opacity: 1, scale: 1, duration: 0.45 },
          "-=0.25",
        );
      }
    }

    // Mobile Comparison Cards Animation
    if (mobileRows.length > 0) {
      comparisonTl.fromTo(
        mobileRows,
        { opacity: 0, y: 24, scale: 0.985 },
        { opacity: 1, y: 0, scale: 1, duration: 0.6, stagger: 0.1 },
        comparisonHeader ? "-=0.3" : 0,
      );
    }

    // "Recomendado" Floating Badge Entry (Editorial Finishing Touch)
    if (recommendedBadges.length > 0) {
      comparisonTl.fromTo(
        recommendedBadges,
        { opacity: 0, y: -6 },
        { opacity: 1, y: 0, duration: 0.5 },
        "-=0.15",
      );
    }
  }

  // --- Trigger 3: Physical Products Block ---
  if (physical) {
    const physicalTl = gsap.timeline({
      scrollTrigger: {
        trigger: physical,
        start: "top 82%",
        once: true,
      },
      defaults: {
        ease: "power3.out",
      },
    });

    if (physicalHeader) {
      physicalTl.fromTo(
        physicalHeader,
        { opacity: 0, y: 16 },
        { opacity: 1, y: 0, duration: 0.5 },
      );
    }

    if (physicalSub) {
      physicalTl.fromTo(
        physicalSub,
        { opacity: 0, y: 14 },
        { opacity: 1, y: 0, duration: 0.5 },
        "-=0.35",
      );
    }

    if (cards.length > 0) {
      physicalTl.fromTo(
        cards,
        { opacity: 0, y: 30, scale: 0.985 },
        {
          opacity: 1,
          y: 0,
          scale: 1,
          duration: 0.65,
          stagger: 0.12,
        },
        physicalHeader ? "-=0.3" : 0,
      );
    }
  }

  // --- Trigger 4: Final CTA Block ---
  if (cta) {
    gsap.fromTo(
      cta,
      { opacity: 0, y: 20 },
      {
        opacity: 1,
        y: 0,
        duration: 0.65,
        ease: "power3.out",
        scrollTrigger: {
          trigger: cta,
          start: "top 82%",
          once: true,
        },
      },
    );
  }
}
