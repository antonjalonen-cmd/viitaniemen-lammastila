(function () {
  "use strict";

  var STORAGE_KEY = "viitaniemenlammastila-lang";

  function applyLang(lang) {
    document.documentElement.lang = lang;
    document.querySelectorAll("[data-fi]").forEach(function (el) {
      var val = el.getAttribute("data-" + lang);
      if (val !== null) el.innerHTML = val;
    });
    document.querySelectorAll(".lang-btn").forEach(function (btn) {
      btn.classList.toggle("active", btn.dataset.lang === lang);
      btn.setAttribute("aria-pressed", btn.dataset.lang === lang ? "true" : "false");
    });
    var title = document.body.getAttribute("data-title-" + lang) || document.body.getAttribute("data-title-fi");
    if (title) {
      document.title = title;
    }
    try { localStorage.setItem(STORAGE_KEY, lang); } catch (e) {}
  }

  function initLang() {
    var saved = "fi";
    try { saved = localStorage.getItem(STORAGE_KEY) || "fi"; } catch (e) {}
    applyLang(saved);
    document.querySelectorAll(".lang-btn").forEach(function (btn) {
      btn.addEventListener("click", function () { applyLang(btn.dataset.lang); });
    });
  }

  function initNav() {
    var toggle = document.querySelector(".nav-toggle");
    var nav = document.querySelector(".site-nav");
    if (!toggle || !nav) return;
    toggle.addEventListener("click", function () {
      var isOpen = nav.classList.toggle("open");
      toggle.setAttribute("aria-expanded", isOpen ? "true" : "false");
    });
    nav.querySelectorAll("a").forEach(function (link) {
      link.addEventListener("click", function () {
        nav.classList.remove("open");
        toggle.setAttribute("aria-expanded", "false");
      });
    });
    document.addEventListener("keydown", function (e) {
      if (e.key === "Escape" && nav.classList.contains("open")) {
        nav.classList.remove("open");
        toggle.setAttribute("aria-expanded", "false");
        toggle.focus();
      }
    });
  }

  function initHeaderShadow() {
    var header = document.querySelector(".site-header");
    if (!header) return;
    var onScroll = function () {
      header.classList.toggle("scrolled", window.scrollY > 8);
    };
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
  }

  function initReveal() {
    var items = document.querySelectorAll(".reveal");
    if (!items.length) return;
    if (!("IntersectionObserver" in window)) {
      items.forEach(function (el) { el.classList.add("in-view"); });
      return;
    }
    var observer = new IntersectionObserver(function (entries) {
      entries.forEach(function (entry) {
        if (entry.isIntersecting) {
          entry.target.classList.add("in-view");
          observer.unobserve(entry.target);
        }
      });
    }, { threshold: 0.15 });
    items.forEach(function (el) { observer.observe(el); });
  }

  document.addEventListener("DOMContentLoaded", function () {
    initLang();
    initNav();
    initHeaderShadow();
    initReveal();
  });
})();
