(() => {
  const WHATSAPP_CONFIG = {
    selectionMode: "rotate", // Use "rotate" to share leads evenly, or "random" to pick any number.
    numbers: [
      "15745262861",
      "18287502153",
      "15043964033",
      "16068135916",
    ],
    defaultMessage:
      "Hi, I want to check World Cup 2026 ticket availability. Please send me the available matches and categories.",
  };

  const STORAGE_KEY = "wc26_whatsapp_number_index";

  const cleanNumber = (number) => String(number || "").replace(/\D/g, "");

  const getConfiguredNumbers = () =>
    WHATSAPP_CONFIG.numbers
      .map(cleanNumber)
      .filter((number) => number.length >= 10 && !/^1X+$/i.test(number));

  const getRandomNumber = (numbers) => numbers[Math.floor(Math.random() * numbers.length)];

  const getRotatingNumber = (numbers) => {
    const storedIndex = Number.parseInt(window.localStorage.getItem(STORAGE_KEY) || "0", 10);
    const currentIndex = Number.isNaN(storedIndex) ? 0 : storedIndex % numbers.length;
    const nextIndex = (currentIndex + 1) % numbers.length;

    window.localStorage.setItem(STORAGE_KEY, String(nextIndex));

    return numbers[currentIndex];
  };

  const getWhatsAppNumber = () => {
    const numbers = getConfiguredNumbers();

    if (!numbers.length) {
      return "";
    }

    if (WHATSAPP_CONFIG.selectionMode === "random") {
      return getRandomNumber(numbers);
    }

    return getRotatingNumber(numbers);
  };

  const addLine = (lines, label, value) => {
    if (value) {
      lines.push(`${label}: ${value}`);
    }
  };

  const buildTicketMessage = (details = {}) => {
    const lines = ["Hi, I want to check World Cup 2026 ticket availability."];

    addLine(lines, "Name", details.name);
    addLine(lines, "WhatsApp", details.phone);
    addLine(lines, "Match", details.match);
    addLine(lines, "Stage", details.stage);
    addLine(lines, "Date", details.date);
    addLine(lines, "Stadium", details.stadium);
    addLine(lines, "City", details.city);
    addLine(lines, "Category", details.category);
    addLine(lines, "Price", details.price);
    addLine(lines, "Quantity", details.quantity);

    if (details.message) {
      lines.push(`Notes: ${details.message}`);
    }

    lines.push("Please confirm availability, ticket category options, and next steps.");

    return lines.join("\n");
  };

  const buildUrl = (message) => {
    const number = getWhatsAppNumber();

    if (!number) {
      return "";
    }

    return `https://wa.me/${number}?text=${encodeURIComponent(message || WHATSAPP_CONFIG.defaultMessage)}`;
  };

  const openWhatsApp = (message) => {
    const url = buildUrl(message);

    if (!url) {
      window.alert("WhatsApp numbers are not configured yet. Add the four US numbers in assets/js/whatsapp.js.");
      return;
    }

    window.open(url, "_blank", "noopener,noreferrer");
  };

  const getButtonDetails = (button) => ({
    match: button.dataset.match,
    stage: button.dataset.stage,
    date: button.dataset.date,
    stadium: button.dataset.stadium,
    city: button.dataset.city,
    category: button.dataset.category,
    price: button.dataset.price,
    quantity: button.dataset.quantity,
  });

  const getFormDetails = (form) => {
    const formData = new FormData(form);

    return {
      name: formData.get("name"),
      phone: formData.get("phone"),
      match: formData.get("match") || form.dataset.match,
      stage: formData.get("stage") || form.dataset.stage,
      date: formData.get("date") || form.dataset.date,
      stadium: formData.get("stadium") || form.dataset.stadium,
      city: formData.get("city") || form.dataset.city,
      category: formData.get("category") || form.dataset.category,
      price: formData.get("price") || form.dataset.price,
      quantity: formData.get("quantity") || form.dataset.quantity,
      message: formData.get("message"),
    };
  };

  document.addEventListener("click", (event) => {
    const ticketButton = event.target.closest("[data-whatsapp-ticket]");
    const generalButton = event.target.closest("[data-whatsapp-general]");

    if (ticketButton) {
      event.preventDefault();
      openWhatsApp(buildTicketMessage(getButtonDetails(ticketButton)));
      return;
    }

    if (generalButton) {
      event.preventDefault();
      openWhatsApp(generalButton.dataset.message || WHATSAPP_CONFIG.defaultMessage);
    }
  });

  document.querySelectorAll("[data-whatsapp-form]").forEach((form) => {
    form.addEventListener("submit", (event) => {
      event.preventDefault();
      openWhatsApp(buildTicketMessage(getFormDetails(form)));
    });
  });

  window.WorldCupWhatsApp = {
    buildTicketMessage,
    buildUrl,
    openWhatsApp,
    getWhatsAppNumber,
  };
})();
