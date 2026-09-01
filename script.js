
function setupFlipCards() {
  const cards = Array.from(document.querySelectorAll("[data-flip-card]"));
  if (!cards.length) return;

  function setFlipped(card, on) {
    card.classList.toggle("is-flipped", on);
    card.setAttribute("aria-pressed", on ? "true" : "false");
  }

  cards.forEach((card) => {
    card.addEventListener("click", (e) => {
      e.stopPropagation();
      const willFlip = !card.classList.contains("is-flipped");
      cards.forEach((c) => setFlipped(c, false));
      setFlipped(card, willFlip);
    });
    card.addEventListener("keydown", (e) => {
      if (e.key === "Enter" || e.key === " ") {
        e.preventDefault();
        card.click();
      }
    });
  });
}

function setupCarousel(trackSel, dotsSel, prevSel, nextSel) {
  const track = document.querySelector(trackSel);
  if (!track) return;
  const cards = Array.from(track.children);
  if (!cards.length) return;

  const dotsWrap = dotsSel ? document.querySelector(dotsSel) : null;
  let index = 0;

  function go(i, behavior) {
    index = Math.max(0, Math.min(cards.length - 1, i));
    const card = cards[index];
    // Scroll ONLY the track horizontally — never scrollIntoView (that jumps the page)
    const left = card.offsetLeft - (track.clientWidth - card.offsetWidth) / 2;
    track.scrollTo({ left: Math.max(0, left), behavior: behavior || "smooth" });
    if (dotsWrap) {
      Array.from(dotsWrap.children).forEach((d, di) => {
        d.setAttribute("aria-current", di === index ? "true" : "false");
      });
    }
  }

  if (dotsWrap) {
    dotsWrap.innerHTML = "";
    cards.forEach((_, i) => {
      const b = document.createElement("button");
      b.type = "button";
      b.setAttribute("aria-label", "Go to slide " + (i + 1));
      b.addEventListener("click", () => go(i));
      dotsWrap.appendChild(b);
    });
  }

  const prev = prevSel ? document.querySelector(prevSel) : null;
  const next = nextSel ? document.querySelector(nextSel) : null;
  if (prev) prev.addEventListener("click", () => go(index - 1));
  if (next) next.addEventListener("click", () => go(index + 1));

  track.addEventListener("scroll", () => {
    const mid = track.scrollLeft + track.clientWidth / 2;
    let best = 0;
    let bestDist = Infinity;
    cards.forEach((c, i) => {
      const center = c.offsetLeft + c.offsetWidth / 2;
      const d = Math.abs(center - mid);
      if (d < bestDist) { bestDist = d; best = i; }
    });
    index = best;
    if (dotsWrap) {
      Array.from(dotsWrap.children).forEach((d, di) => {
        d.setAttribute("aria-current", di === index ? "true" : "false");
      });
    }
  }, { passive: true });

  // Instant on load so the page stays at the top
  go(0, "auto");
}

function setupParallax() {
  const bg = document.querySelector("[data-parallax-bg]");
  const photo = document.querySelector("[data-parallax-photo]");
  if (!bg && !photo) return;
  if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;

  let ticking = false;

  function update() {
    const y = window.scrollY || 0;
    // Background moves slower (lag behind scroll)
    if (bg) bg.style.transform = "translate3d(0, " + (y * 0.22) + "px, 0) scale(1.18)";
    // Portrait moves faster upward relative to the canyon
    if (photo) photo.style.transform = "translate3d(0, " + (y * -0.18) + "px, 0)";
    ticking = false;
  }

  window.addEventListener("scroll", () => {
    if (!ticking) {
      window.requestAnimationFrame(update);
      ticking = true;
    }
  }, { passive: true });

  update();
}

// Keep load at top (Safari sometimes restores mid-page)
if ("scrollRestoration" in history) history.scrollRestoration = "manual";
window.scrollTo(0, 0);

setupFlipCards();
setupCarousel("[data-values-track]", "[data-values-dots]");
setupCarousel("[data-record-track]", "[data-record-dots]", "[data-prev]", "[data-next]");
setupParallax();

window.addEventListener("load", () => window.scrollTo(0, 0));
