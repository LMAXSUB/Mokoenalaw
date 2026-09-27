document.addEventListener("DOMContentLoaded", function () {
  const form = document.getElementById("matter-intake-form");
  if (!form) return;

  const steps = Array.from(document.querySelectorAll(".intake-step"));
  const nextButton = document.getElementById("next-button");
  const backButton = document.getElementById("back-button");
  const progressBar = document.getElementById("progress-bar");
  const stepLabel = document.getElementById("step-label");
  const progressPercent = document.getElementById("progress-percent");
  const summary = document.getElementById("matterSummary");
  const summaryCount = document.getElementById("summary-count");
  const conditionalFields = document.getElementById("conditional-fields");
  const reviewSummary = document.getElementById("review-summary");
  const status = document.getElementById("submit-status");

  let currentStep = 1;

  const practiceDetails = {
    "RAF & Personal Injury": [
      ["accidentDate", "Approximate accident date", "text", "Optional"],
      ["matterStage", "Matter stage", "select", ["Initial enquiry", "Claim already submitted", "Existing legal representation", "Court / litigation stage"]]
    ],
    "Criminal Law": [
      ["matterStage", "Matter stage", "select", ["Arrested / detained", "Charged", "Bail stage", "Trial / court proceedings", "General enquiry"]]
    ],
    "Labour & CCMA": [
      ["matterStage", "Matter stage", "select", ["Dismissal", "Disciplinary process", "CCMA referral", "Arbitration", "Other"]],
      ["importantDate", "Important date", "text", "Optional"]
    ],
    "Wills & Estates": [
      ["matterStage", "Matter stage", "select", ["Need a will", "Estate administration", "Deceased estate already reported", "Other"]]
    ],
    "Property & Conveyancing": [
      ["transactionType", "Transaction type", "select", ["Property purchase / transfer", "Sale / transfer", "Bond-related", "Other"]]
    ],
    "Business & Contracts": [
      ["documentType", "Matter type", "select", ["Company registration", "Contract", "Lease", "NDA", "Other"]]
    ]
  };

  const guidance = {
    "RAF & Personal Injury": {
      title: "Useful RAF preparation",
      text: "Useful starting information can include accident and police information, medical records and invoices, employment or income records, witness details, relevant expenses and existing RAF correspondence. Do not upload sensitive documents through this initial intake.",
      link: "raf-documents.html",
      linkText: "View the RAF document checklist"
    },
    "Criminal Law": {
      title: "Useful criminal-matter preparation",
      text: "If available, keep the case number, charge information, court details, appearance date and arrest or bail paperwork ready. Do not send confidential documents through this initial form.",
      link: "criminal-arrest.html",
      linkText: "Read the criminal-law guide"
    },
    "Labour & CCMA": {
      title: "Useful labour-matter preparation",
      text: "Keep the employment contract, dismissal or disciplinary documents, CCMA referral or notices, relevant correspondence, pay records and important dates available.",
      link: "ccma-guide.html",
      linkText: "Read the CCMA guide"
    },
    "Wills & Estates": {
      title: "Useful estate-planning preparation",
      text: "Useful information can include identity details, beneficiary information, a list of assets and liabilities, any existing will and relevant policy or account information.",
      link: "will-guide.html",
      linkText: "Read the will-planning guide"
    },
    "Property & Conveyancing": {
      title: "Useful property preparation",
      text: "Have the property and transaction details, identification documents, sale agreement where applicable, bond or finance information and relevant municipal information available.",
      link: "property-transfer.html",
      linkText: "Read the property guide"
    },
    "Business & Contracts": {
      title: "Useful business preparation",
      text: "Have the company or entity details, contract or draft agreement, relevant correspondence, payment or invoice records and a short timeline available.",
      link: "business-contracts.html",
      linkText: "Read the business-contract guide"
    },
    "Other": {
      title: "Start with the essentials",
      text: "A short description of what happened, the important dates, the people or organisations involved and the assistance you are looking for is a useful starting point.",
      link: "resources.html",
      linkText: "Browse Legal Resources"
    }
  };

  function escapeHtml(value) {
    return String(value || "")
      .replaceAll("&", "&amp;")
      .replaceAll("<", "&lt;")
      .replaceAll(">", "&gt;")
      .replaceAll('"', "&quot;")
      .replaceAll("'", "&#039;");
  }

  function selectedPractice() {
    return form.querySelector('input[name="practiceArea"]:checked')?.value || "";
  }

  function selectedMatterStage() {
    const field = document.getElementById("matterStage");
    return field ? field.value : "";
  }

  function isUrgentMatter() {
    const area = selectedPractice();
    const urgency = document.getElementById("urgency")?.value || "";
    const stage = selectedMatterStage();
    return urgency === "Urgent" ||
      (area === "Criminal Law" && stage === "Arrested / detained");
  }

  function renderGuidance() {
    const area = selectedPractice();
    const item = guidance[area] || guidance.Other;

    const existing = conditionalFields.querySelector(".intake-guidance");
    if (existing) existing.remove();

    const box = document.createElement("div");
    box.className = "intake-guidance";
    box.innerHTML =
      '<strong>' + escapeHtml(item.title) + '</strong>' +
      '<p>' + escapeHtml(item.text) + '</p>' +
      '<a href="' + item.link + '">' + escapeHtml(item.linkText) + ' →</a>';
    conditionalFields.appendChild(box);
  }

  function renderUrgentNotice() {
    const existing = document.getElementById("intake-urgent-notice");
    if (existing) existing.remove();

    if (!isUrgentMatter()) return;

    const notice = document.createElement("div");
    notice.id = "intake-urgent-notice";
    notice.className = "intake-urgent-notice";
    notice.setAttribute("role", "alert");
    notice.innerHTML =
      '<strong>Urgent matter: contact the firm directly.</strong>' +
      '<p>For an arrest, imminent court appearance, or another immediate legal deadline, do not rely solely on this online intake. Call Lungelo Mokoena Attorneys on <a href="tel:+27796209349">079 620 9349</a>.</p>' +
      '<a class="button button-primary" href="tel:+27796209349">Call 079 620 9349</a>';
    document.querySelector(".intake-main").prepend(notice);
  }

  function renderConditionalFields() {
    const area = selectedPractice();
    const fields = practiceDetails[area] || [];
    conditionalFields.innerHTML = "";

    if (fields.length) {
      const title = document.createElement("p");
      title.className = "conditional-title";
      title.textContent = "A little more context (optional)";
      conditionalFields.appendChild(title);

      const grid = document.createElement("div");
      grid.className = "conditional-grid";

      fields.forEach(([id, label, type, options]) => {
        const wrap = document.createElement("div");
        const labelEl = document.createElement("label");
        labelEl.setAttribute("for", id);
        labelEl.textContent = label;

        let control;
        if (type === "select") {
          control = document.createElement("select");
          control.id = id;
          control.name = id;
          const blank = document.createElement("option");
          blank.value = "";
          blank.textContent = "Select";
          control.appendChild(blank);
          options.forEach(option => {
            const el = document.createElement("option");
            el.value = option;
            el.textContent = option;
            control.appendChild(el);
          });
          control.addEventListener("change", renderUrgentNotice);
        } else {
          control = document.createElement("input");
          control.type = type;
          control.id = id;
          control.name = id;
          control.placeholder = options;
          control.maxLength = 100;
        }

        wrap.appendChild(labelEl);
        wrap.appendChild(control);
        grid.appendChild(wrap);
      });

      conditionalFields.appendChild(grid);
    }

    renderGuidance();
    renderUrgentNotice();
  }

  function clearErrors() {
    document.querySelectorAll(".field-error").forEach(el => el.textContent = "");
  }

  function setError(name, message) {
    const el = document.querySelector('[data-error-for="' + name + '"]');
    if (el) el.textContent = message;
  }

  function validateStep(step) {
    clearErrors();

    if (step === 1 && !selectedPractice()) {
      setError("practiceArea", "Please select a practice area.");
      return false;
    }

    if (step === 2) {
      const text = summary.value.trim();
      if (text.length < 15) {
        setError("matterSummary", "Please provide a short description of at least 15 characters.");
        summary.focus();
        return false;
      }
    }

    if (step === 3) {
      const name = document.getElementById("fullName").value.trim();
      const phone = document.getElementById("phone").value.trim();
      const email = document.getElementById("email").value.trim();
      const consent = document.getElementById("consent").checked;

      let ok = true;
      if (name.length < 2) { setError("fullName", "Please enter your name."); ok = false; }
      if (phone.length < 7) { setError("phone", "Please enter a valid contact number."); ok = false; }
      if (email && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
        setError("email", "Please enter a valid email address.");
        ok = false;
      }
      if (!consent) {
        setError("consent", "Please confirm the initial-enquiry notice.");
        ok = false;
      }
      return ok;
    }

    return true;
  }

  function updateProgress() {
    const percent = Math.round((currentStep / steps.length) * 100);
    progressBar.style.width = percent + "%";
    progressPercent.textContent = percent + "%";
    stepLabel.textContent = "Step " + currentStep + " of " + steps.length;
  }

  function showStep(step) {
    currentStep = step;
    steps.forEach(section =>
      section.classList.toggle("active", Number(section.dataset.step) === step)
    );
    backButton.hidden = step === 1;
    nextButton.textContent = step === steps.length ? "Review Enquiry" : "Continue";
    updateProgress();

    if (step === 2) {
      renderGuidance();
      renderUrgentNotice();
    }
    if (step === 4) renderUrgentNotice();

    window.scrollTo({
      top: document.querySelector(".intake-section").offsetTop - 20,
      behavior: "smooth"
    });
  }

  function getData() {
    const data = {};
    new FormData(form).forEach((value, key) => {
      if (key === "practiceArea" || key === "consent") data[key] = value;
      else if (String(value).trim()) data[key] = String(value).trim();
    });
    data.consent = document.getElementById("consent").checked;
    return data;
  }

  function buildEnquiry() {
    const data = getData();
    const lines = [
      "LUNGELO MOKOENA ATTORNEYS — INITIAL ENQUIRY",
      "",
      "Practice area: " + (data.practiceArea || ""),
      "Matter summary: " + (data.matterSummary || ""),
      ""
    ];

    const extras = [
      ["accidentDate", "Approximate accident date"],
      ["matterStage", "Matter stage"],
      ["importantDate", "Important date"],
      ["transactionType", "Transaction type"],
      ["documentType", "Matter type"],
      ["fullName", "Name"],
      ["phone", "Phone / WhatsApp"],
      ["email", "Email"],
      ["preferredContact", "Preferred contact"],
      ["urgency", "Urgency"],
      ["deadline", "Important date / deadline"]
    ];

    extras.forEach(([key, label]) => {
      if (data[key]) lines.push(label + ": " + data[key]);
    });

    lines.push(
      "",
      "This is an initial enquiry only and does not by itself create an attorney-client relationship.",
      "Please do not send passwords, banking details, identity-document numbers, medical records or other highly sensitive documents with this initial enquiry."
    );

    return lines.join("\n");
  }

  function renderReview() {
    const data = getData();
    const rows = [
      ["Practice area", data.practiceArea],
      ["Matter summary", data.matterSummary],
      ["Name", data.fullName],
      ["Phone / WhatsApp", data.phone],
      ["Email", data.email],
      ["Preferred contact", data.preferredContact],
      ["Urgency", data.urgency],
      ["Important date / deadline", data.deadline]
    ];

    const conditionalKeys = [
      ["accidentDate", "Approximate accident date"],
      ["matterStage", "Matter stage"],
      ["importantDate", "Important date"],
      ["transactionType", "Transaction type"],
      ["documentType", "Matter type"]
    ];

    conditionalKeys.forEach(([key, label]) => {
      if (data[key]) rows.splice(2, 0, [label, data[key]]);
    });

    reviewSummary.innerHTML = rows
      .filter(([, value]) => value)
      .map(([label, value]) =>
        '<div class="review-row"><div class="review-label">' +
        escapeHtml(label) +
        '</div><div class="review-value">' +
        escapeHtml(value) +
        '</div></div>'
      ).join("");

    const existing = document.getElementById("review-urgent-note");
    if (existing) existing.remove();

    if (isUrgentMatter()) {
      const note = document.createElement("div");
      note.id = "review-urgent-note";
      note.className = "review-urgent-note";
      note.innerHTML =
        '<strong>Important:</strong> Because this enquiry is marked as urgent, please call the firm directly on <a href="tel:+27796209349">079 620 9349</a>. The online form should not be your only method of contact.';
      reviewSummary.parentNode.insertBefore(note, reviewSummary);
    }
  }

  document.querySelectorAll('input[name="practiceArea"]').forEach(input => {
    input.addEventListener("change", renderConditionalFields);
  });

  summary.addEventListener("input", () => {
    summaryCount.textContent = summary.value.length + " / 1500";
  });

  const urgencyField = document.getElementById("urgency");
  if (urgencyField) urgencyField.addEventListener("change", renderUrgentNotice);

  nextButton.addEventListener("click", () => {
    if (!validateStep(currentStep)) return;

    if (currentStep < steps.length) {
      if (currentStep === 3) renderReview();
      showStep(currentStep + 1);
    }
  });

  backButton.addEventListener("click", () => {
    if (currentStep > 1) showStep(currentStep - 1);
  });

  document.getElementById("whatsapp-submit").addEventListener("click", () => {
    const message = buildEnquiry();
    const url = "https://wa.me/27796209349?text=" + encodeURIComponent(message);
    window.open(url, "_blank", "noopener");
    status.textContent = isUrgentMatter()
      ? "Your enquiry has been prepared. Please also call the firm directly because this matter is marked urgent."
      : "Your WhatsApp enquiry has been prepared.";
  });

  document.getElementById("email-submit").addEventListener("click", () => {
    const message = buildEnquiry();
    const subject = "Initial Legal Enquiry - " + (selectedPractice() || "Matter");
    window.location.href =
      "mailto:lungelomokoena8@yahoo.com?subject=" +
      encodeURIComponent(subject) +
      "&body=" +
      encodeURIComponent(message);
    status.textContent = isUrgentMatter()
      ? "Your email enquiry has been prepared. Please also call the firm directly because this matter is marked urgent."
      : "Your email enquiry has been prepared.";
  });

  document.getElementById("copy-submit").addEventListener("click", async () => {
    const message = buildEnquiry();
    try {
      await navigator.clipboard.writeText(message);
      status.textContent = "Enquiry copied to your clipboard.";
    } catch (error) {
      status.textContent = "Your browser could not copy the enquiry automatically. Please use WhatsApp or Email.";
    }
  });

  showStep(1);
});
