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

const setActiveLink = (id) => {
  for (const link of navLinks) {
    if (link.hash === `#${id}`) {
      link.setAttribute("aria-current", "page");
    } else {
      link.removeAttribute("aria-current");
    }
  }
};

if (sections.length) {
  const initialTarget = (() => {
    if (globalThis.location.hash) {
      const hashId = globalThis.location.hash.substring(1);
      if (sections.some(({ target }) => target.id === hashId)) {
        return hashId;
      }
    }
    return sections[0].target.id;
  })();

  setActiveLink(initialTarget);

  if ("IntersectionObserver" in globalThis) {
    const observer = new IntersectionObserver(
      (entries) => {
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
      setActiveLink(id);
    });
  }
}

// Set the current year in the footer
const yearElement = document.getElementById("year");
if (yearElement) {
  yearElement.textContent = new Date().getFullYear();
}
