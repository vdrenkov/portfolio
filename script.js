const rootElement = document.documentElement;
const header = document.querySelector(".main-header");
const navToggle = document.querySelector(".nav-toggle");
const primaryNav = document.getElementById("primary-nav");
const inPageLinks = document.querySelectorAll('a[href^="#"]');
const yearElement = document.getElementById("year");
const mobileNavQuery = globalThis.matchMedia("(max-width: 38em)");

rootElement.classList.remove("no-js");
rootElement.classList.add("js");

function updateHeaderMetrics() {
  const headerHeight = Math.round(header?.getBoundingClientRect().height ?? 0);
  rootElement.style.setProperty("--header-offset", `${headerHeight}px`);
  rootElement.style.setProperty("--scroll-offset", `${headerHeight + 16}px`);
}

updateHeaderMetrics();

if (header && "ResizeObserver" in globalThis) {
  const headerResizeObserver = new ResizeObserver(updateHeaderMetrics);
  headerResizeObserver.observe(header);
} else {
  let headerResizeTimer = null;
  window.addEventListener("resize", () => {
    clearTimeout(headerResizeTimer);
    headerResizeTimer = setTimeout(updateHeaderMetrics, 120);
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

// Experience card heading/meta equalizer
function equalizeExperienceCardMeta() {
  const experienceCards = document.querySelectorAll(
    ".experience-row .card:not(.experience-card--compact)",
  );
  if (!experienceCards.length) return;

  const headings = [];
  const metaBlocks = [];

  for (const card of experienceCards) {
    const heading = card.querySelector("h3");
    const meta = card.querySelector("p");
    if (heading) headings.push(heading);
    if (meta) metaBlocks.push(meta);
  }

  for (const heading of headings) heading.style.minHeight = "";
  for (const meta of metaBlocks) meta.style.minHeight = "";

  let maxHeadingHeight = 0;
  for (const heading of headings) {
    maxHeadingHeight = Math.max(maxHeadingHeight, heading.offsetHeight);
  }

  let maxMetaHeight = 0;
  for (const meta of metaBlocks) {
    maxMetaHeight = Math.max(maxMetaHeight, meta.offsetHeight);
  }

  for (const heading of headings) {
    heading.style.minHeight = `${maxHeadingHeight}px`;
  }

  for (const meta of metaBlocks) {
    meta.style.minHeight = `${maxMetaHeight}px`;
  }
}
window.addEventListener("load", equalizeExperienceCardMeta);
window.addEventListener("resize", equalizeExperienceCardMeta);

// Footer year
if (yearElement) {
  yearElement.textContent = new Date().getFullYear();
}

function closeMobileNav() {
  navToggle.setAttribute("aria-expanded", "false");
  header.classList.remove("nav-open");
  updateHeaderMetrics();
}

if (navToggle && primaryNav && header) {
  navToggle.addEventListener("click", () => {
    const expanded = navToggle.getAttribute("aria-expanded") === "true";
    navToggle.setAttribute("aria-expanded", String(!expanded));
    header.classList.toggle("nav-open", !expanded);
    updateHeaderMetrics();
  });

  for (const inPageLink of inPageLinks) {
    inPageLink.addEventListener("click", (event) => {

      if (
        event.button !== 0 ||
        event.altKey ||
        event.ctrlKey ||
        event.metaKey ||
        event.shiftKey
      ) {
        return;
      }

      const target = document.getElementById(inPageLink.hash.slice(1));

      if (!target) {
        return;
      }

      event.preventDefault();
      if (mobileNavQuery.matches) closeMobileNav();
      target.scrollIntoView({ block: "start" });
      target.focus({ preventScroll: true });
    });
  }

  header.addEventListener("keydown", (event) => {
    if (
      event.key !== "Escape" ||
      navToggle.getAttribute("aria-expanded") !== "true"
    ) {
      return;
    }

    event.preventDefault();
    closeMobileNav();
    navToggle.focus({ preventScroll: true });
  });

  header.addEventListener("focusout", (event) => {
    if (!header.contains(event.relatedTarget)) closeMobileNav();
  });

  mobileNavQuery.addEventListener("change", () => {
    const focusedElement = document.activeElement;
    const toggleHadFocus = focusedElement === navToggle;
    const linkHadFocus = primaryNav.contains(focusedElement);
    closeMobileNav();

    if (mobileNavQuery.matches && linkHadFocus) {
      navToggle.focus({ preventScroll: true });
    } else if (!mobileNavQuery.matches && toggleHadFocus) {
      primaryNav.querySelector("a")?.focus({ preventScroll: true });
    }
  });
}
