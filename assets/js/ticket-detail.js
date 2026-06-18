(() => {
  const matches = Array.isArray(window.WC26_MATCHES) ? window.WC26_MATCHES : [];
  const stadiums = Array.isArray(window.WC26_STADIUMS) ? window.WC26_STADIUMS : [];
  const params = new URLSearchParams(window.location.search);
  const matchNumber = Number(params.get("match") || 1);
  const isSoldOut = new Date(match.date + "T23:59:59") < new Date();
  const match = matches.find((item) => item.number === matchNumber) || matches[0];
  const stadium = stadiums.find((item) => item.name === match.stadium);
  const seatMap = document.querySelector("[data-seat-map]");
  const seatMapImage = document.querySelector("[data-seat-map-image]");

  if (!match) {
    return;
  }

  const stageMultiplier = {
    "Round of 32": 1.2,
    "Round of 16": 1.35,
    "Quarter-finals": 1.6,
    "Semi-finals": 1.95,
    "Third-place play-off": 1.7,
    "Final": 3.2,
  }[match.stage] || 1;

  const money = (value) =>
    new Intl.NumberFormat("en-US", {
      style: "currency",
      currency: "USD",
      maximumFractionDigits: 0,
    }).format(Math.round(value));

  const ticketCategories = [
    { name: "Category 3", note: "Upper level", price: 260, available: 4 },
    { name: "Short Lower", note: "Lower corner / short side", price: 390, available: 4 },
    { name: "Category 2", note: "Mid level seating", price: 520, available: 6 },
    { name: "Long Lower", note: "Lower long side", price: 690, available: 8 },
    { name: "Category 1", note: "Best central view", price: 860, available: 6 },
    { name: "Half Way Line", note: "Low row best seats", price: 1250, available: 4 },
    { name: "Hospitality", note: "Premium service options", price: 2200, available: 8 },
  ].map((item, index) => ({
    ...item,
    price: Math.round(item.price * stageMultiplier),
    soldOut: index === 1 && match.limited,
  }));

  const setText = (selector, value) => {
    const element = document.querySelector(selector);
    if (element) element.textContent = value;
  };

  const matchTitle = `${match.teamA} vs ${match.teamB} Tickets`;
  const matchDate = `${match.displayDate} - ${match.time}`;

  document.title = `${matchTitle} | Wc26Hub`;
  setText("[data-ticket-title]", matchTitle);
  setText("[data-ticket-subtitle]", `FIFA World Cup 2026 - Match ${match.number}`);
  setText("[data-ticket-date]", matchDate);
  setText("[data-ticket-stage]", match.stage);
  setText("[data-ticket-stadium]", `${match.stadium}, ${match.city}`);
  setText("[data-seat-title]", match.stadium);
  setText("[data-venue-name]", `${match.stadium}, ${match.city}, ${match.country}`);
  setText(
    "[data-venue-description]",
    stadium
      ? `${stadium.address}. Stadium capacity: ${stadium.capacity}. Net capacity may change due to stadium configuration.`
      : "Select a ticket category and quantity, then book through WhatsApp to confirm availability before payment."
  );
  setText("[data-ticket-match-number]", `Match ${match.number}`);

  const venueImage = document.querySelector("[data-venue-image]");
  const imageUrl = stadium?.photoImage;
  if (venueImage && imageUrl) {
    venueImage.innerHTML = `<img src="${imageUrl}" alt="${match.stadium}" />`;
  }

  if (seatMapImage && stadium?.mapImage) {
    seatMapImage.src = stadium.mapImage;
    seatMapImage.alt = `${match.stadium} seating map`;
  }

  const optionsContainer = document.querySelector("[data-ticket-options]");
  if (optionsContainer) {
  if (isSoldOut) {
    optionsContainer.innerHTML = 
      <div class="notice notice-error">
        This match is sold out.
      </div>
    ;
  } else {
    optionsContainer.innerHTML = ticketCategories
      .map((category, index) => 
        <div class="ticket-option-row">
          <div>
            <strong>${category.name}</strong>
            <span>${category.note}</span>
          </div>
          <div class="ticket-price">${money(category.price)} <small>USD</small></div>
          <div class="ticket-quantity">
            <select data-ticket-quantity="${index}">
              ${Array.from(
                { length: category.available },
                (_, qty) => <option value="${qty + 1}">${qty + 1}</option>
              ).join("")}
            </select>
          </div>
          <div>
            <button
              class="button button-primary"
              type="button"
              data-book-ticket
              data-category-index="${index}"
            >
              Book
            </button>
          </div>
        </div>
      )
      .join("");
  }
}
if (isSoldOut) return;
  document.addEventListener("click", (event) => {
    const bookButton = event.target.closest("[data-book-ticket]");

    if (!bookButton) {
      return;
    }

    const category = ticketCategories[Number(bookButton.dataset.categoryIndex)];
    const quantity = document.querySelector(`[data-ticket-quantity="${bookButton.dataset.categoryIndex}"]`)?.value || "1";

    const message = window.WorldCupWhatsApp?.buildTicketMessage({
      match: `${match.teamA} vs ${match.teamB}`,
      stage: match.stage,
      date: matchDate,
      stadium: match.stadium,
      city: match.city,
      category: category.name,
      quantity,
      price: `${money(category.price)} USD`,
    });

    window.WorldCupWhatsApp?.openWhatsApp(message);
  });

  const zoomIn = document.querySelector("[data-seat-zoom-in]");
  const zoomOut = document.querySelector("[data-seat-zoom-out]");
  const zoomReset = document.querySelector("[data-seat-zoom-reset]");
  let zoomLevel = 1;

  const renderZoom = () => {
    if (seatMap) {
      seatMap.style.setProperty("--seat-zoom", String(zoomLevel));
    }
  };

  const setZoom = (nextZoom) => {
    zoomLevel = Math.min(2.4, Math.max(1, nextZoom));
    renderZoom();
  };

  seatMapImage?.addEventListener("error", () => {
    seatMap?.classList.add("is-missing");
  });

  zoomIn?.addEventListener("click", () => setZoom(zoomLevel + 0.2));
  zoomOut?.addEventListener("click", () => setZoom(zoomLevel - 0.2));
  zoomReset?.addEventListener("click", () => setZoom(1));

  seatMap?.addEventListener("wheel", (event) => {
    if (!event.ctrlKey && !event.metaKey) {
      return;
    }

    event.preventDefault();
    setZoom(zoomLevel + (event.deltaY < 0 ? 0.12 : -0.12));
  });

  renderZoom();
})();
