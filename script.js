const header = document.querySelector(".main-header");
const navToggle = document.querySelector(".nav-toggle");
const primaryNav = document.getElementById("primary-nav");
const inPageLinks = document.querySelectorAll('a[href^="#"]');
const yearElement = document.getElementById("year");
const mobileNavQuery = globalThis.matchMedia("(max-width: 38em)");

document.documentElement.classList.remove("no-js");

if (yearElement) {
  yearElement.textContent = new Date().getFullYear();
}

function closeMobileNav() {
  navToggle.setAttribute("aria-expanded", "false");
  header.classList.remove("nav-open");
}

if (navToggle && primaryNav && header) {
  navToggle.addEventListener("click", () => {
    const expanded = navToggle.getAttribute("aria-expanded") === "true";
    navToggle.setAttribute("aria-expanded", String(!expanded));
    header.classList.toggle("nav-open", !expanded);
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
