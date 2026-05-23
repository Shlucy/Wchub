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
})();
