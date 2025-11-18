// Root setup & DOM references
const rootElement = document.documentElement;
rootElement.classList.remove("no-js");
rootElement.classList.add("js");

const header = document.querySelector(".main-header");
const navToggle = document.querySelector(".nav-toggle");
const primaryNav = document.getElementById("primary-nav");
const inPageLinks = document.querySelectorAll('.nav-links a[href^="#"]');
const homeAnchor = document.querySelector(".home");
const yearElement = document.getElementById("year");

// Sticky header state & offsets
let headerHeight = 0;

function getScrollOffset() {
  return Math.max(0, Math.round(headerHeight + 8));
}

function updateHeaderMetrics() {
  headerHeight = header ? header.getBoundingClientRect().height : 0;
  rootElement.style.setProperty("--header-offset", `${getScrollOffset()}px`);
}

const handleHeaderResize = () => updateHeaderMetrics();

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
    history.replaceState(null, "", `#${id}`);

    if (isMobileNav()) closeMobileNav();
  });
}

if (homeAnchor) {
  homeAnchor.addEventListener("click", (event) => {
    event.preventDefault();
    globalThis.scrollTo({
      top: 0,
      behavior: shouldReduceMotion() ? "auto" : "smooth",
    });
    history.replaceState(null, "", "#");
    closeMobileNav();
  });
}

updateHeaderMetrics();

window.addEventListener("load", () => {
  if (location.hash) {
    const id = location.hash.slice(1);
    if (document.getElementById(id)) {
      scrollToTargetId(id, false);
    }
  }
});

globalThis.addEventListener("hashchange", () => {
  const id = location.hash.slice(1);
  if (id === "hero" || !id) return;
  if (document.getElementById(id)) {
    scrollToTargetId(id, true);
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
    if (typeof navToggle.blur === "function") {
      navToggle.blur();
    }
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
