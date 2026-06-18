// assets/js/soldout.js

(() => {
  const matches = window.WC26_MATCHES;

  if (!Array.isArray(matches)) return;

  const now = new Date();

  const updated = matches.map((match) => {
    const matchDate = new Date(match.date + "T23:59:59");

    const isSoldOut = matchDate < now;

    return {
      ...match,
      soldOut: isSoldOut,
    };
  });

  window.WC26_MATCHES = updated;
})();