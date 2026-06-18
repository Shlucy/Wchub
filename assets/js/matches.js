(() => {
  const filtersForm = document.querySelector("[data-match-filters]");
  const resultsContainer = document.querySelector("[data-match-results]");
  const resultsRange = document.querySelector("[data-results-range]");
  const resultsTotal = document.querySelector("[data-results-total]");
  const pagination = document.querySelector(".pagination");
  const allMatches = Array.isArray(window.WC26_MATCHES) ? window.WC26_MATCHES : [];
  const pageSize = 20;
  let filteredMatches = allMatches;
  let currentPage = 1;

  if (!filtersForm) {
    return;
  }

  const priceRange = filtersForm.querySelector("[data-price-range]");
  const priceOutput = filtersForm.querySelector("[data-price-output]");
  const teamSearch = filtersForm.querySelector("[data-team-filter-search]");
  const teamOptions = Array.from(filtersForm.querySelectorAll("[data-team-option]"));
  const selectedTeamCount = filtersForm.querySelector("[data-selected-team-count]");
  const mainSearch = document.querySelector("#match-search-input");

  const moneyFormatter = new Intl.NumberFormat("en-US", {
    style: "currency",
    currency: "USD",
    maximumFractionDigits: 0,
  });

  const updatePriceOutput = () => {
    if (!priceRange || !priceOutput) {
      return;
    }

    priceOutput.textContent = moneyFormatter.format(Number(priceRange.value));
  };

  const updateSelectedTeamCount = () => {
    if (!selectedTeamCount) {
      return;
    }

    const count = filtersForm.querySelectorAll('input[name="team"]:checked').length;
    selectedTeamCount.textContent = `${count} selected`;
  };

  const stageToFilter = (stage) => stage.toLowerCase().replace(/\s+/g, "-");

  const monthToFilter = (date) => (date.includes("-06-") ? "june" : "july");

  const normalize = (value) => String(value || "").toLowerCase();

  const isKnockoutStage = (stage) =>
    ["Round of 32", "Round of 16", "Quarter-finals", "Semi-finals", "Third-place play-off", "Final"].includes(stage);

  const getSelectedTeams = () =>
    Array.from(filtersForm.querySelectorAll('input[name="team"]:checked')).map((input) => input.value);

  const getStadiumId = (stadiumName) => {
    const stadium = (window.WC26_STADIUMS || []).find((item) => item.name === stadiumName);
    return stadium?.id || "";
  };

  const matchSearchText = (match) =>
    normalize(
      [
        match.number,
        match.displayDate,
        match.time,
        match.stage,
        match.teamA,
        match.teamB,
        match.stadium,
        match.city,
        match.country,
      ].join(" ")
    );

  const passesFilters = (match) => {
    const formData = new FormData(filtersForm);
    const dateFilter = formData.get("date");
    const stageFilter = formData.get("stage");
    const stadiumFilter = formData.get("stadium");
    const maxPrice = Number(formData.get("price") || 2000);
    const selectedTeams = getSelectedTeams();
    const searchQuery = normalize(mainSearch?.value);

    if (dateFilter === "june" && monthToFilter(match.date) !== "june") return false;
    if (dateFilter === "july" && monthToFilter(match.date) !== "july") return false;
    if (dateFilter === "opening" && match.number !== 1) return false;
    if (dateFilter === "final" && !["2026-07-14", "2026-07-15", "2026-07-18", "2026-07-19"].includes(match.date)) return false;

    if (stageFilter) {
      if (stageFilter === "quarter-finals" && match.stage !== "Quarter-finals") return false;
      else if (stageFilter === "semi-finals" && match.stage !== "Semi-finals") return false;
      else if (stageToFilter(match.stage) !== stageFilter) return false;
    }

    if (stadiumFilter && getStadiumId(match.stadium) !== stadiumFilter) return false;

    if (match.priceMin > maxPrice) return false;

    if (selectedTeams.length && !selectedTeams.includes(match.teamA) && !selectedTeams.includes(match.teamB)) {
      return false;
    }

    if (searchQuery && !matchSearchText(match).includes(searchQuery)) return false;

    return true;
  };

  const renderTeam = (name, flagUrl) => {
    if (flagUrl) {
      return `<div><img src="${flagUrl}" alt="${name} flag" /><span>${name}</span></div>`;
    }

    return `<div><span class="team-seed">${name}</span></div>`;
  };

  const renderMatchCard = (match) => `
    <article class="result-match-card" data-stage="${match.stage}" data-stadium="${match.stadium}">
      <div class="result-card-head">
        ${match.limited ? '<span class="pill pill-gold">Limited Tickets</span>' : ""}
        <span class="pill">${match.stage}</span>
      </div>
      <div class="result-match-time">${match.displayDate} - ${match.time}</div>
      <div class="result-stadium">${match.stadium} - ${match.city}</div>
      <div class="result-teams">
        ${renderTeam(match.teamA, match.flagA)}
        <strong>vs</strong>
        ${renderTeam(match.teamB, match.flagB)}
      </div>
      <div class="result-extra"><span>Referee: TBC</span><span>Match ${match.number}</span><span>${match.source}</span></div>
      <p class="price-line">${match.priceRange}</p>
      ${
        match.soldOut ? `<span class="button button-disabled button-full">Sold Out</span>` : `<a class="button button-primary button-full" href="ticket-detail.html?match=${match.number}">Buy Ticket</a>`
      }
    </article>
  `;

  const renderPagination = () => {
    if (!pagination) return;

    const totalPages = Math.max(1, Math.ceil(filteredMatches.length / pageSize));
    const pages = Array.from({ length: Math.min(totalPages, 6) }, (_, index) => index + 1)
      .map(
        (page) =>
          `<button class="pagination-btn${page === currentPage ? " is-active" : ""}" type="button" data-page="${page}" ${
            page === currentPage ? 'aria-current="page"' : ""
          }>${page}</button>`
      )
      .join("");

    pagination.innerHTML = `${pages}<button class="button button-secondary" type="button" data-load-more>Load More</button>`;
  };

  const renderMatches = () => {
    if (!resultsContainer) return;

    const start = (currentPage - 1) * pageSize;
    const pageMatches = filteredMatches.slice(start, start + pageSize);

    resultsContainer.innerHTML = pageMatches.length
      ? pageMatches.map(renderMatchCard).join("")
      : '<div class="notice">No matches found. Try adjusting your filters.</div>';

    if (resultsRange) {
      const first = filteredMatches.length ? start + 1 : 0;
      const last = Math.min(start + pageSize, filteredMatches.length);
      resultsRange.textContent = `${first}-${last}`;
    }

    if (resultsTotal) {
      resultsTotal.textContent = String(filteredMatches.length);
    }

    renderPagination();
  };

  const applyFilters = () => {
    filteredMatches = allMatches.filter(passesFilters);
    currentPage = 1;
    renderMatches();
  };

  const filterTeams = () => {
    if (!teamSearch) {
      return;
    }

    const query = teamSearch.value.trim().toLowerCase();

    teamOptions.forEach((option) => {
      const teamName = (option.dataset.teamName || "").toLowerCase();
      option.classList.toggle("is-hidden", query.length > 0 && !teamName.includes(query));
    });
  };

  priceRange?.addEventListener("input", updatePriceOutput);
  teamSearch?.addEventListener("input", filterTeams);

  filtersForm.addEventListener("change", (event) => {
    if (event.target.matches('input[name="team"]')) {
      updateSelectedTeamCount();
    }

    applyFilters();
  });

  filtersForm.addEventListener("reset", () => {
    window.setTimeout(() => {
      updatePriceOutput();
      updateSelectedTeamCount();

      if (teamSearch) {
        teamSearch.value = "";
      }

      filterTeams();
      applyFilters();
    }, 0);
  });

  filtersForm.addEventListener("submit", (event) => {
    event.preventDefault();
    applyFilters();
  });

  mainSearch?.closest("form")?.addEventListener("submit", (event) => {
    event.preventDefault();
    applyFilters();
  });

  mainSearch?.addEventListener("input", applyFilters);

  pagination?.addEventListener("click", (event) => {
    const pageButton = event.target.closest("[data-page]");
    const loadMoreButton = event.target.closest("[data-load-more]");

    if (pageButton) {
      currentPage = Number(pageButton.dataset.page);
      renderMatches();
    }

    if (loadMoreButton) {
      currentPage += 1;
      const totalPages = Math.max(1, Math.ceil(filteredMatches.length / pageSize));
      if (currentPage > totalPages) currentPage = totalPages;
      renderMatches();
    }
  });

  const viewToggleButtons = document.querySelectorAll("[data-view-toggle]");

  if (!document.documentElement.dataset.matchView) {
    document.documentElement.dataset.matchView = "grid";
  }

  viewToggleButtons.forEach((button) => {
    button.addEventListener("click", () => {
      viewToggleButtons.forEach((item) => {
        const isActive = item === button;
        item.classList.toggle("is-active", isActive);
        item.setAttribute("aria-pressed", String(isActive));
      });

      document.documentElement.dataset.matchView = button.dataset.viewToggle;
    });
  });

  document.querySelectorAll("[data-stage-shortcut]").forEach((link) => {
    link.addEventListener("click", (event) => {
      event.preventDefault();

      const stageSelect = filtersForm.querySelector("#filter-stage");
      if (stageSelect) {
        stageSelect.value = link.dataset.stageShortcut;
      }

      applyFilters();
      filtersForm.scrollIntoView({ behavior: "smooth", block: "start" });
    });
  });

  updatePriceOutput();
  updateSelectedTeamCount();
  renderMatches();
})();
