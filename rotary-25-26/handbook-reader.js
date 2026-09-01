(() => {
  const pageCount = 41;
  const reader = document.querySelector("[data-handbook-reader]");

  if (!reader || !window.siteI18n) {
    return;
  }

  const pages = Array.from({ length: pageCount }, (_, index) => index + 1).map((page) => {
    const figure = document.createElement("figure");
    const image = new Image();
    const fileNumber = String(page).padStart(2, "0");

    figure.className = "manual-reader-page is-pending";
    figure.setAttribute("aria-busy", "true");
    image.loading = "lazy";
    image.decoding = "async";
    image.fetchPriority = "low";
    image.width = 993;
    image.height = 1404;
    image.dataset.src = `assets/handbook-pages/handover-manual-${fileNumber}.jpg`;
    figure.append(image);

    return { page, image, figure };
  });

  reader.replaceChildren(...pages.map(({ figure }) => figure));

  const revealPage = ({ image, figure }, isFirstPage = false) => {
    const source = image.dataset.src;

    if (!source) {
      return;
    }

    delete image.dataset.src;
    image.fetchPriority = isFirstPage ? "high" : "low";
    image.loading = isFirstPage ? "eager" : "lazy";

    const finishLoading = () => {
      figure.classList.remove("is-pending");
      figure.removeAttribute("aria-busy");
    };

    image.addEventListener("load", finishLoading, { once: true });
    image.addEventListener("error", finishLoading, { once: true });
    image.src = source;

    if (image.complete) {
      finishLoading();
    }
  };

  if ("IntersectionObserver" in window) {
    const pageObserver = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (!entry.isIntersecting) {
            return;
          }

          const page = pages.find(({ figure }) => figure === entry.target);

          if (page) {
            revealPage(page);
          }

          pageObserver.unobserve(entry.target);
        });
      },
      { rootMargin: "900px 0px" },
    );

    pages.slice(1).forEach(({ figure }) => pageObserver.observe(figure));
    revealPage(pages[0], true);
  } else {
    pages.forEach((page, index) => revealPage(page, index === 0));
  }

  const updateLabels = () => {
    reader.setAttribute("aria-label", window.siteI18n.t("handbook.reader.pagesAria"));

    pages.forEach(({ page, image }) => {
      image.alt = window.siteI18n.t("handbook.reader.pageAlt", { page });
    });
  };

  updateLabels();
  window.siteI18n.subscribe(updateLabels);
})();
