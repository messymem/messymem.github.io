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

    var io = new IntersectionObserver(function (entries) {
      entries.forEach(function (entry) {
        var v = entry.target;
        if (entry.isIntersecting) {
          var playing = v.play();
          if (playing && typeof playing.catch === "function") playing.catch(function () {});
        } else if (!v.paused) {
          v.pause();
        }
      });
    }, { threshold: 0.15 });

    Array.prototype.forEach.call(videos, function (v) {
      v.pause();
      io.observe(v);
    });
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

  document.addEventListener("DOMContentLoaded", function () {
    initCarousel();
    if (typeof bulmaSlider !== "undefined") bulmaSlider.attach();
    initNav();
    initReveal();
    initCounters();
    // After the carousel clones slides, so cloned videos are observed too.
    setTimeout(initLazyVideo, 0);
  });
})();
