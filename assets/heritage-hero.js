(function () {
  var hero = document.getElementById("heritageHero");
  if (!hero) return;

  var slideA = hero.querySelector(".heritage-hero__slide--a");
  var slideB = hero.querySelector(".heritage-hero__slide--b");
  var tint = hero.querySelector(".heritage-hero__tint");
  if (!slideA || !slideB || !tint) return;

  var carouselPage = hero.getAttribute("data-carousel") || "home";
  var mode = hero.getAttribute("data-mode") || "hero";
  var isBackdrop = mode === "backdrop";
  var caption = hero.querySelector(".heritage-hero__caption");
  var textEl = hero.querySelector(".heritage-hero__text");

  if (!isBackdrop && (!caption || !textEl)) return;
  if (hero.getAttribute("data-static") === "true") return;

  var reduceMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
  var crossfadeMs = reduceMotion ? 500 : (isBackdrop ? 2200 : 2400);
  var holdMs = reduceMotion ? 1800 : 6000;
  var backdropHoldMs = reduceMotion ? 2200 : 9000;
  var tintOpacity = isBackdrop ? 0.12 : 0.18;
  var pauseBeforeTypeMs = reduceMotion ? 200 : 400;
  var textFadeMs = reduceMotion ? 120 : 600;
  var baseCharMs = reduceMotion ? 0 : 20;

  var slides = [];
  var order = [];
  var index = 0;
  var activeLayer = "a";
  var currentTint = "#1a1410";
  var typingTimer = null;
  var phaseTimer = null;
  var tintFrame = null;
  var running = false;
  var firstBeat = true;

  function shuffle(list) {
    var arr = list.slice();
    for (var i = arr.length - 1; i > 0; i--) {
      var j = Math.floor(Math.random() * (i + 1));
      var tmp = arr[i];
      arr[i] = arr[j];
      arr[j] = tmp;
    }
    return arr;
  }

  function reshuffleOrder(lastId) {
    var next = shuffle(slides);
    if (slides.length > 1 && lastId) {
      var attempts = 0;
      while (next[0].id === lastId && attempts < 12) {
        next = shuffle(slides);
        attempts++;
      }
    }
    return next;
  }

  function currentSlide() {
    return order[index];
  }

  function layerEls() {
    return activeLayer === "a"
      ? { visible: slideA, hidden: slideB }
      : { visible: slideB, hidden: slideA };
  }

  function hexToRgb(hex) {
    var value = hex.replace("#", "");
    return {
      r: parseInt(value.slice(0, 2), 16),
      g: parseInt(value.slice(2, 4), 16),
      b: parseInt(value.slice(4, 6), 16)
    };
  }

  function rgbToHex(r, g, b) {
    function part(n) {
      var s = Math.round(n).toString(16);
      return s.length === 1 ? "0" + s : s;
    }
    return "#" + part(r) + part(g) + part(b);
  }

  function lerpColor(fromHex, toHex, t) {
    var a = hexToRgb(fromHex);
    var b = hexToRgb(toHex);
    return rgbToHex(
      a.r + (b.r - a.r) * t,
      a.g + (b.g - a.g) * t,
      a.b + (b.b - a.b) * t
    );
  }

  function setTint(color, opacity) {
    currentTint = color;
    tint.style.backgroundColor = color;
    tint.style.setProperty("--heritage-tint", color);
    tint.style.setProperty("--heritage-tint-opacity", String(opacity));
  }

  function animateTint(fromColor, toColor, duration) {
    if (tintFrame) {
      cancelAnimationFrame(tintFrame);
      tintFrame = null;
    }

    var start = performance.now();

    function frame(now) {
      var t = Math.min(1, (now - start) / duration);
      var eased = t < 0.5
        ? 2 * t * t
        : 1 - Math.pow(-2 * t + 2, 2) / 2;
      setTint(lerpColor(fromColor, toColor, eased), tintOpacity);

      if (t < 1) {
        tintFrame = requestAnimationFrame(frame);
      } else {
        tintFrame = null;
      }
    }

    tintFrame = requestAnimationFrame(frame);
  }

  function preload(url) {
    return new Promise(function (resolve) {
      var img = new Image();
      img.onload = function () { resolve(url); };
      img.onerror = function () { resolve(url); };
      img.src = url;
    });
  }

  function clearTimers() {
    if (typingTimer) {
      clearTimeout(typingTimer);
      typingTimer = null;
    }
    if (phaseTimer) {
      clearTimeout(phaseTimer);
      phaseTimer = null;
    }
  }

  var PLACEMENTS = [
    "top-left",
    "top-right",
    "center-left",
    "center-right",
    "bottom-left",
    "bottom-right"
  ];

  function setPlacement(slide) {
    if (!caption) return;
    var placement = slide.placement || "center-left";
    if (PLACEMENTS.indexOf(placement) === -1) placement = "center-left";
    caption.setAttribute("data-placement", placement);
  }

  function fadeCaption(show) {
    if (!caption) return;
    caption.classList.toggle("is-fading", !show);
  }

  function crossfadeTo(slide) {
    return new Promise(function (resolve) {
      var layers = layerEls();
      var fromTint = currentTint;
      layers.hidden.style.backgroundImage = "url(" + slide.image + ")";
      void layers.hidden.offsetWidth;
      layers.visible.classList.remove("is-visible");
      layers.hidden.classList.add("is-visible");
      activeLayer = activeLayer === "a" ? "b" : "a";
      animateTint(fromTint, slide.color, crossfadeMs);
      phaseTimer = setTimeout(resolve, crossfadeMs);
    });
  }

  function showImage(slide) {
    return crossfadeTo(slide);
  }

  function typeText(fullText, done) {
    if (!textEl) {
      done();
      return;
    }

    textEl.textContent = "";
    fadeCaption(true);

    if (reduceMotion || baseCharMs === 0) {
      textEl.textContent = fullText;
      done();
      return;
    }

    var i = 0;
    var cursor = document.createElement("span");
    cursor.className = "heritage-cursor";
    cursor.setAttribute("aria-hidden", "true");

    function step() {
      if (i >= fullText.length) {
        cursor.remove();
        done();
        return;
      }

      var ch = fullText.charAt(i);
      if (cursor.parentNode) cursor.remove();
      textEl.appendChild(document.createTextNode(ch));
      textEl.appendChild(cursor);
      i++;

      var delay = baseCharMs + Math.floor(Math.random() * 16) - 4;
      if (ch === "\n") delay += 150;
      if (ch === "." || ch === "—") delay += 110;
      typingTimer = setTimeout(step, Math.max(12, delay));
    }

    step();
  }

  function advance() {
    index += 1;
    if (index >= order.length) {
      var lastId = order[order.length - 1] ? order[order.length - 1].id : null;
      order = reshuffleOrder(lastId);
      index = 0;
    }
    runBeat();
  }

  function scheduleHeroText(slide) {
    setPlacement(slide);
    if (textEl) textEl.textContent = "";
    fadeCaption(true);
    phaseTimer = setTimeout(function () {
      typeText(slide.text, function () {
        phaseTimer = setTimeout(advance, holdMs);
      });
    }, pauseBeforeTypeMs);
  }

  function runBeat(skipCrossfade) {
    clearTimers();
    var slide = currentSlide();
    if (!slide) return;

    if (isBackdrop) {
      if (!firstBeat) {
        showImage(slide).then(function () {
          phaseTimer = setTimeout(advance, backdropHoldMs);
        });
        return;
      }

      firstBeat = false;
      phaseTimer = setTimeout(advance, backdropHoldMs);
      return;
    }

    if (!textEl) return;

    if (skipCrossfade) {
      scheduleHeroText(slide);
      return;
    }

    if (!firstBeat) {
      fadeCaption(false);
      if (textEl) textEl.textContent = "";
      phaseTimer = setTimeout(function () {
        setPlacement(slide);
        showImage(slide).then(function () {
          phaseTimer = setTimeout(function () {
            typeText(slide.text, function () {
              phaseTimer = setTimeout(advance, holdMs);
            });
          }, pauseBeforeTypeMs);
        });
      }, textFadeMs);
      return;
    }

    firstBeat = false;
    scheduleHeroText(slide);
  }

  function applyBootedSlide() {
    var bootId = hero.getAttribute("data-booted");
    if (!bootId) return false;

    var bootSlide = null;
    for (var i = 0; i < slides.length; i++) {
      if (slides[i].id === bootId) {
        bootSlide = slides[i];
        break;
      }
    }
    if (!bootSlide) return false;

    order = shuffle(slides);
    index = 0;
    for (var j = 0; j < order.length; j++) {
      if (order[j].id === bootId) {
        index = j;
        break;
      }
    }

    activeLayer = "a";
    slideA.style.transition = "";
    slideA.style.backgroundImage = "url(" + bootSlide.image + ")";
    slideA.classList.add("is-visible");
    slideB.classList.remove("is-visible");
    slideB.style.backgroundImage = "";
    setTint(bootSlide.color, tintOpacity);
    if (!isBackdrop) setPlacement(bootSlide);
    hero.removeAttribute("data-booted");
    return true;
  }

  function start() {
    if (running) return;
    running = true;

    if (applyBootedSlide()) {
      firstBeat = false;
      runBeat();
      return;
    }

    order = shuffle(slides);
    index = 0;
    var first = order[0];
    slideA.style.backgroundImage = "url(" + first.image + ")";
    slideA.classList.add("is-visible");
    setTint(first.color, tintOpacity);
    if (!isBackdrop) setPlacement(first);
    runBeat();
  }

  fetch("/assets/heritage-carousels.json")
    .then(function (res) {
      if (!res.ok) throw new Error("manifest");
      return res.json();
    })
    .then(function (data) {
      var carousel = (data.carousels || {})[carouselPage];
      slides = carousel ? carousel.slides || [] : [];
      if (!slides.length) return;
      return Promise.all(slides.map(function (s) { return preload(s.image); }));
    })
    .then(function () {
      if (slides.length) start();
    })
    .catch(function () {
      hero.classList.add("heritage-hero--failed");
    });
})();
