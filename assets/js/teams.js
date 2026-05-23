(() => {
  const teams = [
    ["Canada", "Hosts", "https://flagcdn.com/w320/ca.png", "canada"],
    ["Mexico", "Hosts", "https://flagcdn.com/w320/mx.png", "mexico"],
    ["USA", "Hosts", "https://flagcdn.com/w320/us.png", "usa"],
    ["Australia", "AFC", "https://flagcdn.com/w320/au.png", "australia"],
    ["Iraq", "AFC", "https://flagcdn.com/w320/iq.png", "iraq"],
    ["IR Iran", "AFC", "https://flagcdn.com/w320/ir.png", "iran"],
    ["Japan", "AFC", "https://flagcdn.com/w320/jp.png", "japan"],
    ["Jordan", "AFC", "https://flagcdn.com/w320/jo.png", "jordan"],
    ["Korea Republic", "AFC", "https://flagcdn.com/w320/kr.png", "korea-republic"],
    ["Qatar", "AFC", "https://flagcdn.com/w320/qa.png", "qatar"],
    ["Saudi Arabia", "AFC", "https://flagcdn.com/w320/sa.png", "saudi-arabia"],
    ["Uzbekistan", "AFC", "https://flagcdn.com/w320/uz.png", "uzbekistan"],
    ["Algeria", "CAF", "https://flagcdn.com/w320/dz.png", "algeria"],
    ["Cabo Verde", "CAF", "https://flagcdn.com/w320/cv.png", "cabo-verde"],
    ["Congo DR", "CAF", "https://flagcdn.com/w320/cd.png", "dr-congo"],
    ["Cote d'Ivoire", "CAF", "https://flagcdn.com/w320/ci.png", "ivory-coast"],
    ["Egypt", "CAF", "https://flagcdn.com/w320/eg.png", "egypt"],
    ["Ghana", "CAF", "https://flagcdn.com/w320/gh.png", "ghana"],
    ["Morocco", "CAF", "https://flagcdn.com/w320/ma.png", "morocco"],
    ["Senegal", "CAF", "https://flagcdn.com/w320/sn.png", "senegal"],
    ["South Africa", "CAF", "https://flagcdn.com/w320/za.png", "south-africa"],
    ["Tunisia", "CAF", "https://flagcdn.com/w320/tn.png", "tunisia"],
    ["Curacao", "Concacaf", "https://flagcdn.com/w320/cw.png", "curacao"],
    ["Haiti", "Concacaf", "https://flagcdn.com/w320/ht.png", "haiti"],
    ["Panama", "Concacaf", "https://flagcdn.com/w320/pa.png", "panama"],
    ["Argentina", "CONMEBOL", "https://flagcdn.com/w320/ar.png", "argentina"],
    ["Brazil", "CONMEBOL", "https://flagcdn.com/w320/br.png", "brazil"],
    ["Colombia", "CONMEBOL", "https://flagcdn.com/w320/co.png", "colombia"],
    ["Ecuador", "CONMEBOL", "https://flagcdn.com/w320/ec.png", "ecuador"],
    ["Paraguay", "CONMEBOL", "https://flagcdn.com/w320/py.png", "paraguay"],
    ["Uruguay", "CONMEBOL", "https://flagcdn.com/w320/uy.png", "uruguay"],
    ["New Zealand", "OFC", "https://flagcdn.com/w320/nz.png", "new-zealand"],
    ["Austria", "UEFA", "https://flagcdn.com/w320/at.png", "austria"],
    ["Belgium", "UEFA", "https://flagcdn.com/w320/be.png", "belgium"],
    ["Bosnia and Herzegovina", "UEFA", "https://flagcdn.com/w320/ba.png", "bosnia-herzegovina"],
    ["Croatia", "UEFA", "https://flagcdn.com/w320/hr.png", "croatia"],
    ["Czechia", "UEFA", "https://flagcdn.com/w320/cz.png", "czech-republic"],
    ["England", "UEFA", "https://flagcdn.com/w320/gb-eng.png", "england"],
    ["France", "UEFA", "https://flagcdn.com/w320/fr.png", "france"],
    ["Germany", "UEFA", "https://flagcdn.com/w320/de.png", "germany"],
    ["Netherlands", "UEFA", "https://flagcdn.com/w320/nl.png", "netherlands"],
    ["Norway", "UEFA", "https://flagcdn.com/w320/no.png", "norway"],
    ["Portugal", "UEFA", "https://flagcdn.com/w320/pt.png", "portugal"],
    ["Scotland", "UEFA", "https://flagcdn.com/w320/gb-sct.png", "scotland"],
    ["Spain", "UEFA", "https://flagcdn.com/w320/es.png", "spain"],
    ["Sweden", "UEFA", "https://flagcdn.com/w320/se.png", "sweden"],
    ["Switzerland", "UEFA", "https://flagcdn.com/w320/ch.png", "switzerland"],
    ["Turkiye", "UEFA", "https://flagcdn.com/w320/tr.png", "turkey"],
  ].map(([name, confed, flag, slug]) => ({ name, confed, flag, slug }));

  const grid = document.querySelector("[data-teams-page-grid]");
  const search = document.querySelector("[data-team-page-search]");
  const tabs = document.querySelectorAll("[data-confed-filter]");
  const summary = document.querySelector("[data-teams-results-summary]");
  const pagination = document.querySelector("[data-teams-pagination]");
  const mobileQuery = window.matchMedia("(max-width: 720px)");
  const pageSize = 12;
  let activeConfed = "all";
  let currentPage = 1;
  let handledHash = false;

  if (!grid) return;

  const getFilteredTeams = () => {
    const query = (search?.value || "").trim().toLowerCase();

    return teams.filter((team) => {
      const matchesConfed = activeConfed === "all" || team.confed === activeConfed;
      const matchesQuery = !query || `${team.name} ${team.confed}`.toLowerCase().includes(query);
      return matchesConfed && matchesQuery;
    });
  };

  const getPagedTeams = (filtered) => {
    if (!mobileQuery.matches) {
      return filtered;
    }

    const hashSlug = window.location.hash.replace("#", "");
    if (hashSlug && !handledHash) {
      const hashIndex = filtered.findIndex((team) => team.slug === hashSlug);
      if (hashIndex >= 0) {
        currentPage = Math.floor(hashIndex / pageSize) + 1;
      }
      handledHash = true;
    }

    const totalPages = Math.max(Math.ceil(filtered.length / pageSize), 1);
    currentPage = Math.min(Math.max(currentPage, 1), totalPages);

    const start = (currentPage - 1) * pageSize;
    return filtered.slice(start, start + pageSize);
  };

  const renderSummary = (filtered, visible) => {
    if (!summary) return;

    if (!filtered.length) {
      summary.textContent = "No teams found.";
      return;
    }

    if (!mobileQuery.matches) {
      summary.textContent = `Showing all ${filtered.length} teams`;
      return;
    }

    const start = (currentPage - 1) * pageSize + 1;
    const end = start + visible.length - 1;
    summary.textContent = `Showing ${start}-${end} of ${filtered.length} teams`;
  };

  const renderPagination = (filtered) => {
    if (!pagination) return;

    const totalPages = Math.ceil(filtered.length / pageSize);
    pagination.hidden = !mobileQuery.matches || totalPages <= 1;

    if (pagination.hidden) {
      pagination.innerHTML = "";
      return;
    }

    const pageButtons = Array.from({ length: totalPages }, (_, index) => {
      const page = index + 1;
      return `
        <button class="pagination-btn ${page === currentPage ? "is-active" : ""}" type="button" data-team-page="${page}" aria-label="Show teams page ${page}">
          ${page}
        </button>
      `;
    }).join("");

    pagination.innerHTML = `
      <button class="pagination-btn pagination-step" type="button" data-team-page-prev ${currentPage === 1 ? "disabled" : ""} aria-label="Previous teams page">Prev</button>
      ${pageButtons}
      <button class="pagination-btn pagination-step" type="button" data-team-page-next ${currentPage === totalPages ? "disabled" : ""} aria-label="Next teams page">Next</button>
    `;
  };

  const render = () => {
    const filtered = getFilteredTeams();
    const visibleTeams = getPagedTeams(filtered);

    grid.innerHTML = filtered.length
      ? visibleTeams
          .map(
            (team) => `
              <article class="team-page-card" id="${team.slug}">
                <img src="${team.flag}" alt="${team.name} flag" />
                <div>
                  <span>${team.confed}</span>
                  <h3>${team.name}</h3>
                </div>
                <a
                  class="button button-secondary"
                  href="matches.html"
                  data-whatsapp-general
                  data-message="Hi, I want World Cup 2026 tickets for ${team.name}. Please send available matches and categories."
                >
                  Request Tickets
                </a>
              </article>
            `
          )
          .join("")
      : '<div class="notice">No teams found. Try another search.</div>';

    renderSummary(filtered, visibleTeams);
    renderPagination(filtered);

    if (window.location.hash) {
      window.setTimeout(() => {
        document.querySelector(window.location.hash)?.scrollIntoView({ block: "center" });
      }, 0);
    }
  };

  tabs.forEach((button) => {
    button.addEventListener("click", () => {
      tabs.forEach((item) => item.classList.toggle("is-active", item === button));
      activeConfed = button.dataset.confedFilter;
      currentPage = 1;
      render();
    });
  });

  search?.closest("form")?.addEventListener("submit", (event) => event.preventDefault());
  search?.addEventListener("input", () => {
    currentPage = 1;
    render();
  });

  pagination?.addEventListener("click", (event) => {
    const pageButton = event.target.closest("[data-team-page]");
    const previousButton = event.target.closest("[data-team-page-prev]");
    const nextButton = event.target.closest("[data-team-page-next]");

    if (pageButton) {
      currentPage = Number.parseInt(pageButton.dataset.teamPage, 10);
    } else if (previousButton) {
      currentPage -= 1;
    } else if (nextButton) {
      currentPage += 1;
    } else {
      return;
    }

    render();
    grid.scrollIntoView({ block: "start", behavior: "smooth" });
  });

  if (mobileQuery.addEventListener) {
    mobileQuery.addEventListener("change", render);
  } else {
    mobileQuery.addListener(render);
  }

  render();
})();
