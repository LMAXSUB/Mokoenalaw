/* Phase 9 — Client Communication Hub */

document.addEventListener("DOMContentLoaded", function () {
  const matterCards = document.querySelectorAll(".matter-card");
  const status = document.getElementById("whatsapp-status");
  const phone = "27796209349";

  matterCards.forEach(function (card) {
    card.addEventListener("click", function () {
      const matter = card.getAttribute("data-matter") || "legal matter";
      const message =
        "Hello Lungelo Mokoena Attorneys, I would like assistance with a " +
        matter +
        " matter. Please let me know how I can proceed.";

      if (status) {
        status.textContent = "Opening WhatsApp for your " + matter + " enquiry…";
      }

      const url = "https://wa.me/" + phone + "?text=" + encodeURIComponent(message);
      window.open(url, "_blank", "noopener,noreferrer");
    });
  });
});
