document.addEventListener("DOMContentLoaded", function () {
  var toggle = document.querySelector(".nav-toggle");
  var nav = document.querySelector(".main-nav");
  if (toggle && nav) {
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
  }
  var yearElement = document.querySelector("[data-year]");
  if (yearElement) yearElement.textContent = new Date().getFullYear();
  if (!window.__mokoenaLawAILoaderAdded) {
    window.__mokoenaLawAILoaderAdded = true;
    var aiLoader = document.createElement("script");
    aiLoader.src = "ai-loader.js";
    aiLoader.onload = function () {
      if (window.MokoenaLawAI && typeof window.MokoenaLawAI.init === "function") window.MokoenaLawAI.init();
    };
    aiLoader.onerror = function () { console.warn("Mokoena Law AI Assistant could not be loaded."); };
    document.body.appendChild(aiLoader);
  }
});
