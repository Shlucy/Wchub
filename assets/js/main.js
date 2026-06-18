(() => {
  const navToggle = document.querySelector("[data-nav-toggle]");
  const navLinks = document.querySelector("[data-nav-links]");

  if (navToggle && navLinks) {
    navToggle.addEventListener("click", () => {
      const isOpen = navLinks.classList.toggle("is-open");
      navToggle.setAttribute("aria-expanded", String(isOpen));
    });

    navLinks.addEventListener("click", (event) => {
      if (event.target.closest("a")) {
        navLinks.classList.remove("is-open");
        navToggle.setAttribute("aria-expanded", "false");
      }
    });
  }

  const currentPage = window.location.pathname.split("/").pop() || "index.html";
  document.querySelectorAll("[data-nav-link]").forEach((link) => {
    const href = link.getAttribute("href");

    if (href === currentPage || (currentPage === "" && href === "index.html")) {
      link.classList.add("is-active");
      link.setAttribute("aria-current", "page");
    }
  });

  document.querySelectorAll("[data-faq-question]").forEach((button) => {
    button.addEventListener("click", () => {
      const item = button.closest("[data-faq-item]");

      if (!item) {
        return;
      }

      const isOpen = item.classList.toggle("is-open");
      button.setAttribute("aria-expanded", String(isOpen));
    });
  });

  document.querySelectorAll("[data-countdown]").forEach((element) => {
    const target = new Date(element.dataset.countdown).getTime();

    if (Number.isNaN(target)) {
      return;
    }

    const render = () => {
      const distance = target - Date.now();

      if (distance <= 0) {
        const daysElement = element.querySelector("[data-countdown-days]");
        const hoursElement = element.querySelector("[data-countdown-hours]");
        const minutesElement = element.querySelector("[data-countdown-minutes]");
        const secondsElement = element.querySelector("[data-countdown-seconds]");

        if (daysElement || hoursElement || minutesElement || secondsElement) {
          if (daysElement) daysElement.textContent = "0";
          if (hoursElement) hoursElement.textContent = "0";
          if (minutesElement) minutesElement.textContent = "0";
          if (secondsElement) secondsElement.textContent = "0";
        } else {
          element.textContent = "Tournament started";
        }
        return;
      }

      const days = Math.floor(distance / (1000 * 60 * 60 * 24));
      const hours = Math.floor((distance / (1000 * 60 * 60)) % 24);
      const minutes = Math.floor((distance / (1000 * 60)) % 60);
      const seconds = Math.floor((distance / 1000) % 60);
      const daysElement = element.querySelector("[data-countdown-days]");
      const hoursElement = element.querySelector("[data-countdown-hours]");
      const minutesElement = element.querySelector("[data-countdown-minutes]");
      const secondsElement = element.querySelector("[data-countdown-seconds]");

      if (daysElement || hoursElement || minutesElement || secondsElement) {
        if (daysElement) daysElement.textContent = String(days);
        if (hoursElement) hoursElement.textContent = String(hours).padStart(2, "0");
        if (minutesElement) minutesElement.textContent = String(minutes).padStart(2, "0");
        if (secondsElement) secondsElement.textContent = String(seconds).padStart(2, "0");
        return;
      }

      element.textContent = `${days}d ${hours}h ${minutes}m ${seconds}s`;
    };

    render();
    window.setInterval(render, 1000);
  });

  document.querySelectorAll("[data-current-year]").forEach((element) => {
    element.textContent = String(new Date().getFullYear());
  });
  const matches = Array.isArray(window.WC26_MATCHES) ? window.WC26_MATCHES : [];

  document.querySelectorAll('.featured-match-grid .ticket-card').forEach((card) => {
    const link = card.querySelector('a[href*="ticket-detail.html?match="]');

    if (!link) return;

    const matchNumber = Number(
      new URL(link.href, window.location.origin).searchParams.get("match")
    );

    const match = matches.find((m) => m.number === matchNumber);

    if (!match) return;

    const matchDate = new Date(`${match.date}T23:59:59`);

    if (Date.now() > matchDate.getTime()) {
      link.removeAttribute("href");
      link.textContent = "Sold Out";
      link.classList.remove("button-primary");
      link.classList.add("button-secondary");
      link.style.pointerEvents = "none";
      link.style.opacity = "0.7";

      const top = card.querySelector(".ticket-card-top");

      if (top && !top.querySelector(".pill-red")) {
        top.insertAdjacentHTML(
          "afterbegin",
          '<span class="pill pill-red">Sold Out</span>'
        );
      }
    }
  });
})();
