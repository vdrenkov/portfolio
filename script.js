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
const firstSection = sections.length ? sections[0].target : null;

const getHeaderHeight = () =>
  header ? header.getBoundingClientRect().height : 0;

const clearActiveLinks = () => {
  for (const link of navLinks) {
    link.removeAttribute("aria-current");
  }
};

const ACTIVATION_GAP = 12;
const isPastFirstSection = () => {
  if (!firstSection) return false;
  return (
    firstSection.getBoundingClientRect().top <=
    getHeaderHeight() + ACTIVATION_GAP
  );
};

const setActiveLink = (id) => {
  if (!isPastFirstSection()) {
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
  const getCurrentSectionId = () => {
    let activeId = null;
    for (const { target } of sections) {
      const top = target.getBoundingClientRect().top - getHeaderHeight();
      if (top <= ACTIVATION_GAP) activeId = target.id;
    }
    return activeId;
  };

  const updateActiveByScroll = () => {
    if (!isPastFirstSection()) {
      clearActiveLinks();
      return;
    }
    const currentId = getCurrentSectionId();
    if (currentId) setActiveLink(currentId);
  };

  // Initial paint
  updateActiveByScroll();

  for (const link of navLinks) {
    link.addEventListener("click", () => {
      globalThis.requestAnimationFrame(updateActiveByScroll);
    });
  }

  globalThis.addEventListener("scroll", updateActiveByScroll, {
    passive: true,
  });
  globalThis.addEventListener("resize", updateActiveByScroll);
}

// Scroll to top when clicking the developer logo (Home)
const homeAnchor =
  // document.querySelector('.main-nav > a[aria-label="Home"]') ||
  document.querySelector(".logo");

if (homeAnchor) {
  homeAnchor.addEventListener("click", (e) => {
    e.preventDefault();
    clearActiveLinks();
    globalThis.scrollTo({ top: 0, behavior: "smooth" });
  });
}

// Set the current year in the footer
const yearElement = document.getElementById("year");
if (yearElement) {
  yearElement.textContent = new Date().getFullYear();
}
