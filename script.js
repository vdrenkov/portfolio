// Change active navigation link
const navLinks = Array.from(
  document.querySelectorAll(".nav-links a[href^='#']")
);
const sections = navLinks
  .map((link) => {
    const target = document.querySelector(link.hash);
    return target ? { link, target } : null;
  })
  .filter(Boolean);

const header = document.querySelector(".main-header");
const heroSection = document.getElementById("hero");
const firstSection = sections.length ? sections[0].target : null;

const getHeaderHeight = () =>
  header ? header.getBoundingClientRect().height : 0;

const clearActiveLinks = () => {
  for (const link of navLinks) {
    link.removeAttribute("aria-current");
  }
};

const isHeroVisible = () => {
  if (!heroSection) return false;
  const rect = heroSection.getBoundingClientRect();
  return rect.bottom - getHeaderHeight() > 0;
};

const isPastHero = () => !isHeroVisible();

const setActiveLink = (id) => {
  if (!isPastHero()) {
    clearActiveLinks();
    return;
  }

  for (const link of navLinks) {
    if (link.hash === `#${id}`) {
      link.setAttribute("aria-current", "page");
    } else {
      link.removeAttribute("aria-current");
    }
  }
};

if (sections.length) {
  const initialTargetId = (() => {
    if (globalThis.location.hash) {
      const hashId = globalThis.location.hash.substring(1);
      if (sections.some(({ target }) => target.id === hashId)) {
        return hashId;
      }
    }
    return sections[0].target.id;
  })();

  if (isPastHero()) setActiveLink(initialTargetId);
  else clearActiveLinks();

  if ("IntersectionObserver" in globalThis) {
    const observer = new IntersectionObserver(
      (entries) => {
        if (!isPastHero()) {
          clearActiveLinks();
          return;
        }

        const visible = entries
          .filter((entry) => entry.isIntersecting)
          .sort((a, b) => b.intersectionRatio - a.intersectionRatio);

        if (visible.length) {
          setActiveLink(visible[0].target.id);
          return;
        }

        const closest = [...entries].sort(
          (a, b) =>
            Math.abs(a.boundingClientRect.top) -
            Math.abs(b.boundingClientRect.top)
        )[0];

        if (closest) {
          setActiveLink(closest.target.id);
        }
      },
      {
        rootMargin: "-45% 0px -45% 0px",
        threshold: [0.25, 0.5, 0.75],
      }
    );

    for (const { target } of sections) {
      observer.observe(target);
    }
  }

  for (const link of navLinks) {
    link.addEventListener("click", () => {
      const id = link.hash.substring(1);
      globalThis.requestAnimationFrame(() => setActiveLink(id));
    });
  }

  const resetIfHeroVisible = () => {
    if (!isPastHero()) {
      clearActiveLinks();
    }
  };

  globalThis.addEventListener("scroll", resetIfHeroVisible, { passive: true });
  globalThis.addEventListener("resize", resetIfHeroVisible);
}

// Set the current year in the footer
const yearElement = document.getElementById("year");
if (yearElement) {
  yearElement.textContent = new Date().getFullYear();
}
