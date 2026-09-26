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
  if (yearElement) {
    yearElement.textContent = new Date().getFullYear();
  }

  if (!document.getElementById("mokoena-ai-css")) {
    var css = document.createElement("link");
    css.id = "mokoena-ai-css";
    css.rel = "stylesheet";
    css.href = "ai-assistant.css";
    document.head.appendChild(css);
  }

  if (!document.getElementById("mokoena-ai-script")) {
    var aiScript = document.createElement("script");
    aiScript.id = "mokoena-ai-script";
    aiScript.src = "ai-assistant.js";
    aiScript.onload = function () {
      if (window.MokoenaLawAI &&
          typeof window.MokoenaLawAI.init === "function") {
        window.MokoenaLawAI.init();
      }
    };
    aiScript.onerror = function () {
      console.warn("Mokoena Law AI Assistant could not be loaded.");
    };
    document.body.appendChild(aiScript);
  }
});
