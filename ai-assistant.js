/* Mokoena Law AI Assistant — Phase 11.1 website display fix */
(function () {
  "use strict";

  const ALLOWED_HOST = "lmaxsub.github.io";
  const ALLOWED_PATHS = new Set([
    "/Mokoenalaw/raf-checker.html",
    "/Mokoenalaw/raf-calculator.html",
    "/Mokoenalaw/raf-awards.html",
    "/Mokoenalaw/resources.html",
    "/Mokoenalaw/faq.html",
    "/Mokoenalaw/checklists.html",
    "/Mokoenalaw/consultation.html",
    "/Mokoenalaw/consultation-fees.html",
    "/Mokoenalaw/fees.html",
    "/Mokoenalaw/matter-intake.html",
    "/Mokoenalaw/contact.html",
    "/Mokoenalaw/privacy.html",
    "/Mokoenalaw/raf-documents.html",
    "/Mokoenalaw/ccma-guide.html",
    "/Mokoenalaw/will-guide.html",
    "/Mokoenalaw/criminal-arrest.html",
    "/Mokoenalaw/property-transfer.html",
    "/Mokoenalaw/business-contracts.html"
  ]);

  const LABELS = {
    "raf-checker.html": "RAF Assessment",
    "raf-calculator.html": "RAF Calculator",
    "raf-awards.html": "RAF Research",
    "resources.html": "Legal Resources",
    "faq.html": "Legal FAQs",
    "checklists.html": "Document Checklists",
    "consultation.html": "Request a consultation",
    "consultation-fees.html": "Consultation Fees",
    "fees.html": "Fees & Billing",
    "matter-intake.html": "Start a matter",
    "contact.html": "Contact Mokoena Law",
    "privacy.html": "Privacy & Website Notice",
    "raf-documents.html": "RAF document checklist",
    "ccma-guide.html": "CCMA guide",
    "will-guide.html": "Will-planning guide",
    "criminal-arrest.html": "Criminal-law guide",
    "property-transfer.html": "Property guide",
    "business-contracts.html": "Business contract guide"
  };

  function approved(url) {
    try {
      const u = new URL(url, location.href);
      return u.hostname === ALLOWED_HOST && ALLOWED_PATHS.has(u.pathname);
    } catch (_) {
      return false;
    }
  }

  function linkHtml(url, text) {
    if (!approved(url)) return null;
    const u = new URL(url, location.href);
    const label = text || LABELS[u.pathname.split("/").pop()] || u.pathname;
    return '<a href="' + u.href.replace(/"/g, "&quot;") +
      '" class="mokoena-ai-link">' +
      label.replace(/</g, "&lt;").replace(/>/g, "&gt;") +
      "</a>";
  }

  function formatText(text) {
    let safe = String(text || "").replace(/\r\n/g, "\n").replace(/\r/g, "\n");

    safe = safe.replace(
      /\[([^\]]+)\]\((https?:\/\/[^)\s]+)\)/g,
      function (_, label, url) {
        return linkHtml(url, label) || (label + " (" + url + ")");
      }
    );

    safe = safe.replace(
      /(?<!["'(>])https?:\/\/lmaxsub\.github\.io\/Mokoenalaw\/[A-Za-z0-9._/-]+/g,
      function (url) {
        return linkHtml(url) || url;
      }
    );

    return safe;
  }

  function renderElement(el) {
    if (!el || el.dataset.mokoenaAiFormatted === "1") return;
    const text = el.textContent || "";
    if (!text) return;

    if (
      /\[[^\]]+\]\(https?:\/\/lmaxsub\.github\.io\/Mokoenalaw\//.test(text) ||
      /https?:\/\/lmaxsub\.github\.io\/Mokoenalaw\//.test(text)
    ) {
      const html = formatText(text);
      if (html !== text) {
        el.innerHTML = html;
        el.dataset.mokoenaAiFormatted = "1";
      }
    }
  }

  function scan() {
    const selectors = [
      "#answer", "#response", "#ai-answer", "#ai-response",
      ".answer", ".response", ".ai-answer", ".ai-response",
      ".chat-answer", ".chat-response", ".assistant-message",
      "[data-ai-answer]", "[data-ai-response]"
    ];
    document.querySelectorAll(selectors.join(",")).forEach(renderElement);
  }

  function addDisplayStyles() {
    if (document.getElementById("mokoena-ai-display-fix")) return;
    const style = document.createElement("style");
    style.id = "mokoena-ai-display-fix";
    style.textContent = `
      .mokoena-ai-link {
        display: inline-block;
        margin: 0.18rem 0.35rem 0.18rem 0;
        font-weight: 600;
      }
      .mokoena-ai-link + .mokoena-ai-link {
        margin-left: 0.15rem;
      }
      .mokoena-ai-link:hover { text-decoration: underline; }
      .ai-suggestions, .suggestions, .quick-actions, .quick-links,
      [class*="suggestion"], [class*="quick-action"] {
        display: flex;
        flex-wrap: wrap;
        gap: 0.45rem;
      }
    `;
    document.head.appendChild(style);
  }

  function start() {
    addDisplayStyles();
    scan();
    const observer = new MutationObserver(scan);
    observer.observe(document.body, { childList: true, subtree: true });
  }

  if (document.readyState === "loading") {
    document.addEventListener("DOMContentLoaded", start, { once: true });
  } else {
    start();
  }
})();
