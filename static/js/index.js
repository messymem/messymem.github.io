window.HELP_IMPROVE_VIDEOJS = false;

(function () {
  "use strict";

  var reduceMotion = window.matchMedia &&
    window.matchMedia("(prefers-reduced-motion: reduce)").matches;

  /**
   * Run `onEnter` once, the first time each element scrolls into view.
   * Falls back to running immediately where IntersectionObserver is missing.
   */
  function onceVisible(elements, onEnter, options) {
    if (!elements.length) return;
    if (!("IntersectionObserver" in window)) {
      Array.prototype.forEach.call(elements, onEnter);
      return;
    }
    var io = new IntersectionObserver(function (entries) {
      entries.forEach(function (entry) {
        if (!entry.isIntersecting) return;
        onEnter(entry.target);
        io.unobserve(entry.target);
      });
    }, options || { rootMargin: "0px 0px -12% 0px", threshold: 0.12 });
    Array.prototype.forEach.call(elements, function (el) { io.observe(el); });
  }

  /* --- Scroll reveal + chart bar growth ------------------------------- */
  function initReveal() {
    var els = document.querySelectorAll(".reveal");
    if (reduceMotion) {
      Array.prototype.forEach.call(els, function (el) { el.classList.add("is-visible"); });
      return;
    }
    onceVisible(els, function (el) { el.classList.add("is-visible"); });
  }

  /* --- Count-up on stat tiles ----------------------------------------- */
  function initCounters() {
    var els = document.querySelectorAll("[data-count]");
    if (reduceMotion) return; // values are already in the markup

    onceVisible(els, function (el) {
      var target = parseFloat(el.getAttribute("data-count"));
      var decimals = parseInt(el.getAttribute("data-decimals") || "0", 10);
      if (isNaN(target)) return;

      var duration = 1100;
      var start = null;

      function frame(now) {
        if (start === null) start = now;
        var t = Math.min((now - start) / duration, 1);
        // easeOutCubic
        var eased = 1 - Math.pow(1 - t, 3);
        var value = target * eased;
        el.textContent = decimals > 0
          ? value.toFixed(decimals)
          : Math.round(value).toLocaleString();
        if (t < 1) requestAnimationFrame(frame);
        else el.textContent = decimals > 0 ? target.toFixed(decimals) : target.toLocaleString();
      }
      requestAnimationFrame(frame);
    }, { threshold: 0.5 });
  }

  /* --- Nav: burger toggle, active section, smooth close ---------------- */
  function initNav() {
    var burger = document.querySelector(".navbar-burger");
    var menu = document.getElementById("navbarMenu");
    if (burger && menu) {
      burger.addEventListener("click", function () {
        burger.classList.toggle("is-active");
        menu.classList.toggle("is-active");
        burger.setAttribute("aria-expanded", menu.classList.contains("is-active"));
      });
      menu.addEventListener("click", function (e) {
        if (e.target.classList.contains("navbar-item")) {
          burger.classList.remove("is-active");
          menu.classList.remove("is-active");
        }
      });
    }

    var links = Array.prototype.slice.call(
      document.querySelectorAll('.site-nav .navbar-end .navbar-item[href^="#"]')
    );
    if (!links.length || !("IntersectionObserver" in window)) return;

    var byId = {};
    var sections = [];
    links.forEach(function (link) {
      var id = link.getAttribute("href").slice(1);
      var section = document.getElementById(id);
      if (!section) return;
      byId[id] = link;
      sections.push(section);
    });

    var visible = {};
    var spy = new IntersectionObserver(function (entries) {
      entries.forEach(function (entry) {
        visible[entry.target.id] = entry.isIntersecting;
      });
      // Highlight the topmost section currently on screen.
      var current = null;
      for (var i = 0; i < sections.length; i++) {
        if (visible[sections[i].id]) { current = sections[i].id; break; }
      }
      links.forEach(function (l) { l.classList.remove("is-nav-current"); });
      if (current && byId[current]) byId[current].classList.add("is-nav-current");
    }, { rootMargin: "-20% 0px -70% 0px" });

    sections.forEach(function (s) { spy.observe(s); });
  }

  /**
   * Play carousel/section videos only while they are on screen.
   * Ten clips all autoplaying at once forces the browser to fetch every one
   * up front; this keeps playback (and bandwidth) to what is actually visible.
   */
  function initLazyVideo() {
    var videos = document.querySelectorAll("video[autoplay]");
    if (!videos.length || !("IntersectionObserver" in window)) return;

    // Pause without it counting as the viewer's own pause.
    function autoPause(v) {
      if (v.paused) return;
      v._autoPausing = true;
      v.pause();
    }

    var io = new IntersectionObserver(function (entries) {
      entries.forEach(function (entry) {
        var v = entry.target;
        if (entry.isIntersecting) {
          // Respect a manual pause: never restart a video the viewer stopped
          // (for the narrated teaser that would restart the voiceover unasked).
          if (v._userPaused) return;
          var playing = v.play();
          if (playing && typeof playing.catch === "function") playing.catch(function () {});
        } else {
          autoPause(v);
        }
      });
    }, { threshold: 0.15 });

    Array.prototype.forEach.call(videos, function (v) {
      v.addEventListener("pause", function () {
        if (v._autoPausing) v._autoPausing = false;
        else v._userPaused = true;
      });
      v.addEventListener("play", function () { v._userPaused = false; });
      autoPause(v);
      io.observe(v);
    });
  }

  /* --- Teaser: one-tap sound ------------------------------------------ */
  function initTeaserSound() {
    var video = document.getElementById("teaser");
    var btn = document.getElementById("teaserUnmute");
    if (!video || !btn) return;
    var frame = video.parentNode;

    // Track the real muted state, so the pill also hides when sound is turned on
    // from the native controls, and comes back if the viewer mutes again.
    function sync() {
      var on = !video.muted && video.volume > 0;
      frame.classList.toggle("is-unmuted", on);
      btn.setAttribute("aria-hidden", on ? "true" : "false");
      btn.tabIndex = on ? -1 : 0;
    }

    btn.addEventListener("click", function () {
      video.muted = false;
      if (video.volume === 0) video.volume = 1;
      var p = video.play();
      if (p && typeof p.catch === "function") p.catch(function () {});
    });
    video.addEventListener("volumechange", sync);
    sync();
  }

  /* --- Carousel ------------------------------------------------------- */
  function initCarousel() {
    if (typeof bulmaCarousel === "undefined") return;
    bulmaCarousel.attach(".carousel", {
      slidesToScroll: 1,
      slidesToShow: 3,
      loop: true,
      infinite: true,
      autoplay: false,
      autoplaySpeed: 3000,
      breakpoints: [
        { changePoint: 640, slidesToShow: 1, slidesToScroll: 1 },
        { changePoint: 900, slidesToShow: 2, slidesToScroll: 1 }
      ]
    });
  }

  /* --- Lightbox: expanded figure viewer with pan + zoom ---------------
   * Figures on the page are shown small enough that dense ones (the method
   * diagram, the retriever example) are hard to read in place. Clicking one
   * opens it full-screen where it can be zoomed and panned.
   * ------------------------------------------------------------------- */
  function initLightbox() {
    var box = document.getElementById("lightbox");
    var stage = document.getElementById("lightboxStage");
    var img = document.getElementById("lightboxImg");
    var capEl = document.getElementById("lightboxCaption");
    var zoomEl = document.getElementById("lightboxZoom");
    if (!box || !stage || !img) return;

    var MIN = 1, MAX = 8;
    var scale = 1, tx = 0, ty = 0;
    var baseW = 0, baseH = 0;
    var lastFocus = null;
    var pointers = new Map();
    var pinchStart = 0, pinchScale = 1;
    var dragging = false, dragX = 0, dragY = 0, moved = false;

    function render() {
      img.style.transform = "translate(" + tx + "px," + ty + "px) scale(" + scale + ")";
      zoomEl.textContent = Math.round(scale * 100) + "%";
      stage.classList.toggle("is-zoomed", scale > 1);
    }

    /* Keep the image from being dragged entirely off-stage. */
    function clampPan() {
      var maxX = Math.max(0, (baseW * scale - stage.clientWidth) / 2);
      var maxY = Math.max(0, (baseH * scale - stage.clientHeight) / 2);
      tx = Math.min(maxX, Math.max(-maxX, tx));
      ty = Math.min(maxY, Math.max(-maxY, ty));
    }

    function measure() {
      var prev = img.style.transform;
      img.style.transform = "none";
      var r = img.getBoundingClientRect();
      baseW = r.width; baseH = r.height;
      img.style.transform = prev;
    }

    /* Zoom about a screen point so whatever is under the cursor stays put. */
    function zoomAt(nextScale, clientX, clientY) {
      nextScale = Math.min(MAX, Math.max(MIN, nextScale));
      var r = stage.getBoundingClientRect();
      var px = (clientX === undefined ? r.left + r.width / 2 : clientX) - r.left - r.width / 2;
      var py = (clientY === undefined ? r.top + r.height / 2 : clientY) - r.top - r.height / 2;
      var ix = (px - tx) / scale;
      var iy = (py - ty) / scale;
      scale = nextScale;
      tx = px - ix * scale;
      ty = py - iy * scale;
      if (scale === MIN) { tx = 0; ty = 0; }
      clampPan();
      render();
    }

    function reset() { scale = 1; tx = 0; ty = 0; render(); }

    function open(sourceImg) {
      lastFocus = document.activeElement;
      img.src = sourceImg.currentSrc || sourceImg.src;
      img.alt = sourceImg.alt || "";

      var fig = sourceImg.closest("figure");
      var cap = fig && fig.querySelector(".figure-caption");
      capEl.innerHTML = cap ? cap.innerHTML : (sourceImg.alt || "");

      box.hidden = false;
      box.setAttribute("aria-hidden", "false");
      document.body.classList.add("lb-locked");
      reset();

      function ready() { measure(); render(); }
      if (img.complete) ready(); else img.addEventListener("load", ready, { once: true });

      requestAnimationFrame(function () { box.classList.add("is-open"); });
      var closeBtn = box.querySelector('[data-lb="close"].lb-btn');
      if (closeBtn) closeBtn.focus();
    }

    function close() {
      box.classList.remove("is-open");
      document.body.classList.remove("lb-locked");
      box.setAttribute("aria-hidden", "true");
      var done = function () {
        box.hidden = true;
        img.removeAttribute("src");
      };
      if (reduceMotion) done(); else setTimeout(done, 220);
      if (lastFocus && lastFocus.focus) lastFocus.focus();
    }

    /* Open on any figure image. */
    document.querySelectorAll(".figure-block img").forEach(function (el) {
      el.addEventListener("click", function () { open(el); });
      el.setAttribute("tabindex", "0");
      el.setAttribute("role", "button");
      el.setAttribute("aria-label", "Expand figure: " + (el.alt || "figure"));
      el.addEventListener("keydown", function (e) {
        if (e.key === "Enter" || e.key === " ") { e.preventDefault(); open(el); }
      });
    });

    box.addEventListener("click", function (e) {
      var action = e.target.closest("[data-lb]");
      if (!action) return;
      var what = action.getAttribute("data-lb");
      if (what === "close") close();
      else if (what === "zoom-in") zoomAt(scale * 1.5);
      else if (what === "zoom-out") zoomAt(scale / 1.5);
      else if (what === "reset") reset();
    });

    // The stage sits on top of the backdrop and fills the viewport, so the
    // backdrop's own click handler can never fire. Close on a click that
    // lands on the stage itself (not the image) and wasn't the end of a drag.
    stage.addEventListener("click", function (e) {
      if (box.hidden) return;
      if (e.target === stage && !moved) close();
    });

    stage.addEventListener("dblclick", function (e) {
      if (box.hidden) return;
      if (scale > 1) reset(); else zoomAt(2.5, e.clientX, e.clientY);
    });

    stage.addEventListener("wheel", function (e) {
      if (box.hidden) return;
      e.preventDefault();
      zoomAt(scale * (e.deltaY < 0 ? 1.12 : 1 / 1.12), e.clientX, e.clientY);
    }, { passive: false });

    /* Pointer drag + two-finger pinch. */
    stage.addEventListener("pointerdown", function (e) {
      if (box.hidden) return;
      pointers.set(e.pointerId, { x: e.clientX, y: e.clientY });
      stage.setPointerCapture(e.pointerId);
      if (pointers.size === 1) {
        dragging = true;
        moved = false;
        dragX = e.clientX - tx;
        dragY = e.clientY - ty;
        stage.classList.add("is-grabbing");
      } else if (pointers.size === 2) {
        dragging = false;
        var p = Array.from(pointers.values());
        pinchStart = Math.hypot(p[0].x - p[1].x, p[0].y - p[1].y);
        pinchScale = scale;
      }
    });

    stage.addEventListener("pointermove", function (e) {
      if (!pointers.has(e.pointerId)) return;
      pointers.set(e.pointerId, { x: e.clientX, y: e.clientY });

      if (pointers.size === 2 && pinchStart > 0) {
        var p = Array.from(pointers.values());
        var dist = Math.hypot(p[0].x - p[1].x, p[0].y - p[1].y);
        zoomAt(pinchScale * (dist / pinchStart), (p[0].x + p[1].x) / 2, (p[0].y + p[1].y) / 2);
      } else if (dragging && scale > 1) {
        moved = true;
        tx = e.clientX - dragX;
        ty = e.clientY - dragY;
        clampPan();
        render();
      }
    });

    function endPointer(e) {
      pointers.delete(e.pointerId);
      if (pointers.size < 2) pinchStart = 0;
      if (pointers.size === 0) {
        dragging = false;
        stage.classList.remove("is-grabbing");
      }
    }
    stage.addEventListener("pointerup", endPointer);
    stage.addEventListener("pointercancel", endPointer);

    document.addEventListener("keydown", function (e) {
      if (box.hidden) return;
      if (e.key === "Escape") { e.preventDefault(); close(); }
      else if (e.key === "+" || e.key === "=") { e.preventDefault(); zoomAt(scale * 1.4); }
      else if (e.key === "-" || e.key === "_") { e.preventDefault(); zoomAt(scale / 1.4); }
      else if (e.key === "0") { e.preventDefault(); reset(); }
      else if (e.key.indexOf("Arrow") === 0 && scale > 1) {
        e.preventDefault();
        var step = 60;
        if (e.key === "ArrowLeft") tx += step;
        if (e.key === "ArrowRight") tx -= step;
        if (e.key === "ArrowUp") ty += step;
        if (e.key === "ArrowDown") ty -= step;
        clampPan(); render();
      } else if (e.key === "Tab") {
        // Keep focus inside the dialog while it is open.
        var focusables = box.querySelectorAll("button");
        if (!focusables.length) return;
        var first = focusables[0], last = focusables[focusables.length - 1];
        if (e.shiftKey && document.activeElement === first) { e.preventDefault(); last.focus(); }
        else if (!e.shiftKey && document.activeElement === last) { e.preventDefault(); first.focus(); }
      }
    });

    window.addEventListener("resize", function () {
      if (box.hidden) return;
      measure(); clampPan(); render();
    });
  }

  document.addEventListener("DOMContentLoaded", function () {
    initCarousel();
    if (typeof bulmaSlider !== "undefined") bulmaSlider.attach();
    initNav();
    initReveal();
    initCounters();
    // After the carousel clones slides, so cloned videos are observed too.
    initLightbox();
    initTeaserSound();
    setTimeout(initLazyVideo, 0);
  });
})();
