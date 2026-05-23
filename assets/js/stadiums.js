(() => {
  const stadiums = Array.isArray(window.WC26_STADIUMS) ? window.WC26_STADIUMS : [];
  const matches = Array.isArray(window.WC26_MATCHES) ? window.WC26_MATCHES : [];
  const grid = document.querySelector("[data-stadium-grid]");
  const form = document.querySelector("[data-stadium-filters]");

  if (!grid || !form) {
    return;
  }

  const stageMatches = (stadiumName, stageFilter) => {
    const hosted = matches.filter((match) => match.stadium === stadiumName);

    if (stageFilter === "Final") {
      return hosted.filter((match) => match.stage === "Final");
    }

    if (stageFilter === "Knockout") {
      return hosted.filter((match) => !match.stage.startsWith("Group"));
    }

    if (stageFilter === "Group Stage") {
      return hosted.filter((match) => match.stage.startsWith("Group"));
    }

    return hosted;
  };

  const renderCard = (stadium) => {
    const hostedMatches = matches.filter((match) => match.stadium === stadium.name);
    const imageUrl = stadium.photoImage;
    const finalVenue = hostedMatches.some((match) => match.stage === "Final");
    const knockoutMatches = hostedMatches.filter((match) => !match.stage.startsWith("Group")).length;

    return `
      <article class="stadium-page-card" id="${stadium.id}">
        <div class="stadium-page-image ${imageUrl ? "" : "is-placeholder"}">
          ${
            imageUrl
              ? `<img src="${imageUrl}" alt="${stadium.name}" />`
              : `<span>${stadium.name}</span>`
          }
          ${finalVenue ? '<span class="stadium-badge">Final Venue</span>' : ""}
        </div>
        <div class="stadium-page-body">
          <div>
            <p class="eyebrow">${stadium.country}</p>
            <h3>${stadium.name}</h3>
            <p class="muted">${stadium.city}, ${stadium.country}</p>
          </div>
          <div class="stadium-card-stats">
            <span><strong>${hostedMatches.length}</strong> Matches</span>
            <span><strong>${knockoutMatches}</strong> Knockout</span>
            <span><strong>${stadium.capacity}</strong> Capacity</span>
            <span><strong>${stadium.country === "United States" ? "USA" : stadium.country}</strong> Country</span>
          </div>
          <p class="stadium-address">${stadium.address}</p>
          <div class="stadium-mini-seating">
            <img src="${stadium.mapImage || "assets/images/stdium.png"}" alt="${stadium.name} seating arrangement preview" />
          </div>
          <div class="button-row">
            <a class="button button-secondary" href="ticket-detail.html?match=${hostedMatches[0]?.number || 1}">View Seating</a>
            <a
              class="button button-primary"
              href="#"
              data-whatsapp-general
              data-message="Hi, I want tickets for matches at ${stadium.name}, ${stadium.city}. Please send seating options and availability."
            >
              Buy Tickets
            </a>
          </div>
        </div>
      </article>
    `;
  };

  const filterStadiums = () => {
    const query = form.querySelector("[data-stadium-search]")?.value.trim().toLowerCase() || "";
    const country = form.querySelector("[data-stadium-country]")?.value || "";
    const stage = form.querySelector("[data-stadium-stage]")?.value || "";

    const filtered = stadiums.filter((stadium) => {
      const searchable = `${stadium.name} ${stadium.city} ${stadium.country}`.toLowerCase();
      if (query && !searchable.includes(query)) return false;
      if (country && stadium.country !== country) return false;
      if (stage && stageMatches(stadium.name, stage).length === 0) return false;
      return true;
    });

    grid.innerHTML = filtered.length
      ? filtered.map(renderCard).join("")
      : '<div class="notice">No stadiums found. Try changing your filters.</div>';
  };

  form.addEventListener("input", filterStadiums);
  form.addEventListener("change", filterStadiums);
  form.addEventListener("reset", () => window.setTimeout(filterStadiums, 0));

  filterStadiums();
})();
