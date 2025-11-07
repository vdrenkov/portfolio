// Helpers
function clearActiveLinks() {
  const navLinks = document.querySelectorAll(".nav-links a[aria-current]");
  for (const navLink of navLinks) {
    navLink.removeAttribute("aria-current");
  }
}

let lastActiveId = null;
function setActiveLinkBySectionId(id) {
  if (id === "hero") {
    clearActiveLinks();
    lastActiveId = null;
    return;
  }

  const link = document.querySelector(
    `.nav-links a[href="#${CSS.escape(id)}"]`
  );

  if (!link) return;

  clearActiveLinks();
  link.setAttribute("aria-current", "page");
  lastActiveId = id;
}

function getHeaderHeight() {
  const header = document.querySelector(".main-header");
  return header ? header.offsetHeight : 0;
}

// Smooth scroll for in-page links
const inPageLinks = document.querySelectorAll('.nav-links a[href^="#"]');
for (const inPageLink of inPageLinks) {
  inPageLink.addEventListener("click", (event) => {
    const id = inPageLink.getAttribute("href").slice(1);
    const target = document.getElementById(id);

    if (!target) return;

    event.preventDefault();
    target.scrollIntoView({ behavior: "smooth", block: "start" });

    setActiveLinkBySectionId(id);
    history.replaceState(null, "", `#${id}`);
  });
}

// Scroll-to-top for the logo
const homeAnchor = document.querySelector(".home");
if (homeAnchor) {
  homeAnchor.addEventListener("click", (event) => {
    event.preventDefault();

    clearActiveLinks();
    globalThis.scrollTo({ top: 0, behavior: "smooth" });
    history.replaceState(null, "", "#");
  });
}

// Active link on section visibility
const sections = Array.from(document.querySelectorAll("section[id]"));
if (sections.length) {
  const headerOffset = getHeaderHeight();
  const activationGap = Math.max(0, Math.round(window.innerHeight * 0.11) + 8);
  const topOffset = Math.max(headerOffset, activationGap);

  const observer = new IntersectionObserver(
    (entries) => {
      const visible = entries
        .filter((en) => en.isIntersecting)
        .sort((a, b) => b.intersectionRatio - a.intersectionRatio)[0];

      if (visible) {
        setActiveLinkBySectionId(visible.target.id);
      } else if (lastActiveId) {
        setActiveLinkBySectionId(lastActiveId);
      } else {
        clearActiveLinks();
      }
    },
    {
      root: null,
      rootMargin: `-${topOffset}px 0px -40% 0px`,
      threshold: [0.25, 0.5, 0.75],
    }
  );

  for (const section of sections) {
    observer.observe(section);
  }

  window.addEventListener("load", () => {
    if (location.hash) {
      const id = location.hash.slice(1);
      if (document.getElementById(id)) setActiveLinkBySectionId(id);
    } else {
      clearActiveLinks();
    }
  });

  globalThis.addEventListener("hashchange", () => {
    const id = location.hash.slice(1);
    if (id === "hero" || !id) clearActiveLinks();
    else if (document.getElementById(id)) setActiveLinkBySectionId(id);
  });
}

// Footer year
const yearElement = document.getElementById("year");
if (yearElement) {
  yearElement.textContent = new Date().getFullYear();
}
