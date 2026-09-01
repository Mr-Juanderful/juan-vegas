(function () {
  function setupCarousel(track, dotsHost, prevBtn, nextBtn) {
    if (!track) return;

    var cards = Array.prototype.slice.call(track.children);
    if (!cards.length) return;

    function scrollToIndex(index) {
      var clamped = Math.max(0, Math.min(index, cards.length - 1));
      cards[clamped].scrollIntoView({ behavior: "smooth", inline: "start", block: "nearest" });
      updateDots(clamped);
    }

    function currentIndex() {
      var left = track.scrollLeft;
      var best = 0;
      var bestDist = Infinity;
      cards.forEach(function (card, i) {
        var dist = Math.abs(card.offsetLeft - left);
        if (dist < bestDist) {
          bestDist = dist;
          best = i;
        }
      });
      return best;
    }

    function updateDots(active) {
      if (!dotsHost) return;
      var buttons = dotsHost.querySelectorAll("button");
      buttons.forEach(function (btn, i) {
        if (i === active) btn.setAttribute("aria-current", "true");
        else btn.removeAttribute("aria-current");
      });
    }

    if (dotsHost) {
      dotsHost.innerHTML = "";
      cards.forEach(function (_, i) {
        var btn = document.createElement("button");
        btn.type = "button";
        btn.setAttribute("aria-label", "Go to slide " + (i + 1));
        btn.addEventListener("click", function () {
          scrollToIndex(i);
        });
        dotsHost.appendChild(btn);
      });
      updateDots(0);
    }

    if (prevBtn) {
      prevBtn.addEventListener("click", function () {
        scrollToIndex(currentIndex() - 1);
      });
    }

    if (nextBtn) {
      nextBtn.addEventListener("click", function () {
        scrollToIndex(currentIndex() + 1);
      });
    }

    var ticking = false;
    track.addEventListener("scroll", function () {
      if (ticking) return;
      ticking = true;
      window.requestAnimationFrame(function () {
        updateDots(currentIndex());
        ticking = false;
      });
    });

    track.addEventListener("keydown", function (e) {
      if (e.key === "ArrowRight") {
        e.preventDefault();
        scrollToIndex(currentIndex() + 1);
      } else if (e.key === "ArrowLeft") {
        e.preventDefault();
        scrollToIndex(currentIndex() - 1);
      }
    });
  }

  var recordTrack = document.querySelector("[data-record-track]");
  var recordDots = document.querySelector("[data-record-dots]");
  var prev = document.querySelector("[data-prev]");
  var next = document.querySelector("[data-next]");
  setupCarousel(recordTrack, recordDots, prev, next);

  var valuesTrack = document.querySelector("[data-values-track]");
  var valuesDots = document.querySelector("[data-values-dots]");
  setupCarousel(valuesTrack, valuesDots, null, null);
})();
