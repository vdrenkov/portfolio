// Root setup & DOM references
const rootElement = document.documentElement;
rootElement.classList.remove("no-js");
rootElement.classList.add("js");

const header = document.querySelector(".main-header");
const navToggle = document.querySelector(".nav-toggle");
const primaryNav = document.getElementById("primary-nav");
const inPageLinks = document.querySelectorAll('.nav-links a[href^="#"]');
const homeAnchor = document.querySelector(".home");
const heroCta = document.querySelector('.hero a[href^="#"]');
const yearElement = document.getElementById("year");

// Sticky header state & offsets
let headerHeight = 0;
let collapsedHeaderHeight = 0;

function getScrollOffset(includeExtra = true) {
  const effectiveHeight = collapsedHeaderHeight || headerHeight;
  const baseOffset = Math.max(0, Math.round(effectiveHeight));
  return includeExtra ? baseOffset + 8 : baseOffset;
}

function getTargetScrollMarginTop(target) {
  if (!target || typeof globalThis.getComputedStyle !== "function") {
    return 0;
  }

  const computedValue = globalThis
    .getComputedStyle(target)
    .getPropertyValue("scroll-margin-top")
    .trim();

  if (!computedValue) return 0;

  const directValue = Number.parseFloat(computedValue);
  if (!Number.isNaN(directValue)) return directValue;

  const pixelMatches = computedValue.match(/-?\d+(\.\d+)?px/g);
  if (!pixelMatches) return 0;

  return pixelMatches.reduce(
    (total, value) => total + Number.parseFloat(value),
    0
  );
}

function getTargetScrollOffset(target) {
  const marginTop = getTargetScrollMarginTop(target);
  return marginTop > 0 ? marginTop : getScrollOffset();
}

function updateHeaderMetrics() {
  headerHeight = header ? header.getBoundingClientRect().height : 0;
  if (header && !header.classList.contains("nav-open")) {
    collapsedHeaderHeight = headerHeight;
  }

  rootElement.style.setProperty(
    "--header-offset",
    `${Math.max(0, Math.round(headerHeight))}px`
  );
  rootElement.style.setProperty(
    "--scroll-offset",
    `${getScrollOffset(false) + 16}px`
  );
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

  const targetOffset = getTargetScrollOffset(target);
  const y = target.getBoundingClientRect().top + window.scrollY - targetOffset;
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

    if (isMobileNav()) closeMobileNav();
  });
}

if (heroCta) {
  heroCta.addEventListener("click", (event) => {
    const id = heroCta.getAttribute("href").slice(1);
    if (!id || !document.getElementById(id)) return;

    event.preventDefault();
    scrollToTargetId(id, true);
  });
}

if (homeAnchor) {
  homeAnchor.addEventListener("click", (event) => {
    event.preventDefault();
    globalThis.scrollTo({
      top: 0,
      behavior: shouldReduceMotion() ? "auto" : "smooth",
    });
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
