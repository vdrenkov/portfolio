// Root setup & DOM references
const rootElement = document.documentElement;
rootElement.classList.remove("no-js");
rootElement.classList.add("js");

const header = document.querySelector(".main-header");
const navToggle = document.querySelector(".nav-toggle");
const primaryNav = document.getElementById("primary-nav");
const sections = Array.from(document.querySelectorAll("section[id]"));
const inPageLinks = document.querySelectorAll('.nav-links a[href^="#"]');
const homeAnchor = document.querySelector(".home");
const yearElement = document.getElementById("year");

// Sticky header state
let headerHeight = 0;
let sectionObserver = null;
let lastActiveId = null;

function getScrollOffset() {
  return Math.max(0, Math.round(headerHeight + 8));
}

function updateHeaderMetrics() {
  headerHeight = header ? header.getBoundingClientRect().height : 0;
  rootElement.style.setProperty("--header-offset", `${getScrollOffset()}px`);
}

function refreshHeaderState({ rebuildObserver = true } = {}) {
  updateHeaderMetrics();
  if (rebuildObserver && sections.length) rebuildSectionObserver();
}

const handleHeaderResize = () => refreshHeaderState({ rebuildObserver: true });

// Active navigation helpers
function clearActiveLinks() {
  const navLinks = document.querySelectorAll(".nav-links a[aria-current]");
  for (const navLink of navLinks) navLink.removeAttribute("aria-current");
}

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

// Reduced-motion preference
let reduceMotionPrefers = false;
const reduceMotionQuery = globalThis.matchMedia
  ? globalThis.matchMedia("(prefers-reduced-motion: reduce)")
  : null;

if (reduceMotionQuery) {
  reduceMotionPrefers = reduceMotionQuery.matches;
  const updatePreference = (event) => (reduceMotionPrefers = event.matches);
  if (typeof reduceMotionQuery.addEventListener === "function") {
    reduceMotionQuery.addEventListener("change", updatePreference);
  } else if ("onchange" in reduceMotionQuery) {
    reduceMotionQuery.onchange = updatePreference;
  }
}

function shouldReduceMotion() {
  return reduceMotionPrefers;
}

// Smooth scrolling with sticky-offset compensation
function scrollToTargetId(id, smooth = true) {
  const target = document.getElementById(id);
  if (!target) return;

  const y =
    target.getBoundingClientRect().top + window.scrollY - getScrollOffset();
  window.scrollTo({
    top: Math.max(0, y),
    behavior: smooth && !shouldReduceMotion() ? "smooth" : "auto",
  });
}

for (const inPageLink of inPageLinks) {
  inPageLink.addEventListener("click", (event) => {
    const id = inPageLink.getAttribute("href").slice(1);
    if (!id || !document.getElementById(id)) return;

    event.preventDefault();
    scrollToTargetId(id, true);
    setActiveLinkBySectionId(id);
    history.replaceState(null, "", `#${id}`);

    if (isMobileNav()) closeMobileNav();
  });
}

if (homeAnchor) {
  homeAnchor.addEventListener("click", (event) => {
    event.preventDefault();
    clearActiveLinks();
    globalThis.scrollTo({
      top: 0,
      behavior: shouldReduceMotion() ? "auto" : "smooth",
    });
    history.replaceState(null, "", "#");
  });
}

// IntersectionObserver to drive active nav state
function handleSectionIntersect(entries) {
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
}

function rebuildSectionObserver() {
  if (!sections.length) return;

  if (sectionObserver && typeof sectionObserver.disconnect === "function") {
    sectionObserver.disconnect();
  }

  sectionObserver = new IntersectionObserver(handleSectionIntersect, {
    root: null,
    rootMargin: `-${Math.max(0, headerHeight)}px 0px -40% 0px`,
    threshold: [0.25, 0.5, 0.75],
  });

  for (const section of sections) sectionObserver.observe(section);
}

refreshHeaderState({ rebuildObserver: false });

if (sections.length) {
  rebuildSectionObserver();

  window.addEventListener("load", () => {
    if (location.hash) {
      const id = location.hash.slice(1);
      if (document.getElementById(id)) {
        scrollToTargetId(id, false);
        setActiveLinkBySectionId(id);
      }
    } else {
      clearActiveLinks();
    }
  });

  globalThis.addEventListener("hashchange", () => {
    const id = location.hash.slice(1);
    if (id === "hero" || !id) {
      clearActiveLinks();
    } else if (document.getElementById(id)) {
      scrollToTargetId(id, true);
      setActiveLinkBySectionId(id);
    }
  });

  if (header && "ResizeObserver" in globalThis) {
    const headerResizeObserver = new ResizeObserver(handleHeaderResize);
    headerResizeObserver.observe(header);
  } else {
    let headerResizeTimer = null;
    window.addEventListener("resize", () => {
      clearTimeout(headerResizeTimer);
      headerResizeTimer = setTimeout(handleHeaderResize, 120);
    });
  }
}

// Skills heading equalizer
function equalizeSkillHeadings() {
  const headings = document.querySelectorAll(".skills-grid .card h3");
  if (!headings.length) return;

  for (const heading of headings) heading.style.minHeight = "";

  let maxHeight = 0;
  for (const heading of headings) {
    const headingHeight = heading.offsetHeight;
    if (headingHeight > maxHeight) maxHeight = headingHeight;
  }

  for (const heading of headings) {
    heading.style.minHeight = `${maxHeight}px`;
  }
}
window.addEventListener("load", equalizeSkillHeadings);
window.addEventListener("resize", equalizeSkillHeadings);

// Footer year
if (yearElement) {
  yearElement.textContent = new Date().getFullYear();
}

// Mobile navigation
function isMobileNav() {
  return globalThis.matchMedia("(max-width: 38em)").matches;
}

function closeMobileNav() {
  if (navToggle && header) {
    navToggle.setAttribute("aria-expanded", "false");
    header.classList.remove("nav-open");
    handleHeaderResize();
  }
}

if (navToggle && primaryNav && header) {
  navToggle.addEventListener("click", () => {
    const expanded = navToggle.getAttribute("aria-expanded") === "true";
    navToggle.setAttribute("aria-expanded", String(!expanded));
    header.classList.toggle("nav-open", !expanded);
    handleHeaderResize();
  });

  window.addEventListener("resize", () => {
    if (!isMobileNav()) closeMobileNav();
  });
}
