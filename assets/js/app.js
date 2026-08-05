/**
 * Ticket-Go kurumsal site
 * - Sticky header (scroll → koyu zemin)
 * - Hero carousel
 * - Ana sayfa içerik render (site-content.js)
 * - Yasal / kurumsal bilgi kartları
 * - Sefer/bilet arama yok (tanıtım yüzü)
 * fetch / storage / cookie yok
 */
(function () {
  "use strict";

  var nav = document.getElementById("site-nav");
  var toggle = document.getElementById("nav-toggle");
  var header = document.getElementById("site-header");
  var yearEl = document.getElementById("footer-year");
  var shell = document.getElementById("info-shell");
  var card = document.getElementById("info-card");
  var cardTitle = document.getElementById("info-card-title");
  var closeBtn = document.getElementById("info-close");
  var panels = document.querySelectorAll(".info-panel");
  var lastFocus = null;
  var openPanelId = null;

  function setMenuOpen(open) {
    if (!nav || !toggle) return;
    nav.classList.toggle("is-open", open);
    toggle.setAttribute("aria-expanded", open ? "true" : "false");
    toggle.setAttribute("aria-label", open ? "Menüyü kapat" : "Menüyü aç");
  }

  function updateHeaderScroll() {
    if (!header) return;
    var y = window.scrollY || window.pageYOffset;
    header.classList.toggle("is-scrolled", y > 24);
  }

  function setActiveNav() {
    var links = document.querySelectorAll(".site-nav .nav-link");
    var sections = document.querySelectorAll("main section[id]");
    var y = window.scrollY || window.pageYOffset;
    var current = "anasayfa";
    sections.forEach(function (section) {
      if (section.offsetTop - 90 <= y) {
        current = section.id;
      }
    });
    links.forEach(function (link) {
      var href = link.getAttribute("href") || "";
      var id = href.charAt(0) === "#" ? href.slice(1) : "";
      link.classList.toggle("is-active", id === current);
    });
  }

  function closePanel() {
    if (!shell) return;
    shell.hidden = true;
    shell.setAttribute("aria-hidden", "true");
    document.body.classList.remove("info-open");
    panels.forEach(function (panel) {
      panel.hidden = true;
    });
    openPanelId = null;
    if (lastFocus && typeof lastFocus.focus === "function") {
      lastFocus.focus();
    }
    lastFocus = null;
  }

  function openPanel(panelId, sourceEl) {
    var panel = document.getElementById(panelId);
    if (!shell || !panel || !card) return;

    lastFocus = sourceEl || document.activeElement;
    setMenuOpen(false);

    panels.forEach(function (item) {
      item.hidden = item.id !== panelId;
    });

    if (cardTitle) {
      cardTitle.textContent = panel.getAttribute("data-title") || "Bilgi";
    }

    shell.hidden = false;
    shell.setAttribute("aria-hidden", "false");
    document.body.classList.add("info-open");
    openPanelId = panelId;

    window.requestAnimationFrame(function () {
      card.focus();
      var body = document.getElementById("info-card-body");
      if (body) body.scrollTop = 0;
    });
  }

  function escapeHtml(str) {
    return String(str)
      .replace(/&/g, "&amp;")
      .replace(/</g, "&lt;")
      .replace(/>/g, "&gt;")
      .replace(/"/g, "&quot;");
  }

  var BENEFIT_ICONS = {
    payment:
      '<svg viewBox="0 0 24 24" width="22" height="22" fill="none" stroke="currentColor" stroke-width="1.75" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true">' +
      '<rect x="2" y="5" width="20" height="14" rx="2"/>' +
      '<path d="M2 10h20"/>' +
      '<path d="M6 15h4"/>' +
      '<path d="M16 14.5v1"/>' +
      "</svg>",
    ticket:
      '<svg viewBox="0 0 24 24" width="22" height="22" fill="none" stroke="currentColor" stroke-width="1.75" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true">' +
      '<path d="M4 8a2 2 0 0 1 2-2h12a2 2 0 0 1 2 2v1a2 2 0 0 0 0 4v1a2 2 0 0 1-2 2H6a2 2 0 0 1-2-2v-1a2 2 0 0 0 0-4V8z"/>' +
      '<path d="M12 6v12"/>' +
      "</svg>",
    ops:
      '<svg viewBox="0 0 24 24" width="22" height="22" fill="none" stroke="currentColor" stroke-width="1.75" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true">' +
      '<circle cx="12" cy="12" r="2.5"/>' +
      '<circle cx="5" cy="6" r="1.75"/>' +
      '<circle cx="19" cy="6" r="1.75"/>' +
      '<circle cx="5" cy="18" r="1.75"/>' +
      '<circle cx="19" cy="18" r="1.75"/>' +
      '<path d="M6.5 7.2 10.2 10.5M17.5 7.2 13.8 10.5M6.5 16.8 10.2 13.5M17.5 16.8 13.8 13.5"/>' +
      "</svg>",
    notify:
      '<svg viewBox="0 0 24 24" width="22" height="22" fill="none" stroke="currentColor" stroke-width="1.75" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true">' +
      '<path d="M12 3a5 5 0 0 0-5 5v2.2c0 .7-.2 1.4-.6 2L5 14h14l-1.4-1.8c-.4-.6-.6-1.3-.6-2V8a5 5 0 0 0-5-5z"/>' +
      '<path d="M10 18a2 2 0 0 0 4 0"/>' +
      "</svg>",
    support:
      '<svg viewBox="0 0 24 24" width="22" height="22" fill="none" stroke="currentColor" stroke-width="1.75" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true">' +
      '<path d="M4 12a8 8 0 0 1 16 0"/>' +
      '<path d="M4 12v3a2 2 0 0 0 2 2h1v-5H6a2 2 0 0 0-2 2z"/>' +
      '<path d="M20 12v3a2 2 0 0 1-2 2h-1v-5h1a2 2 0 0 1 2 2z"/>' +
      '<path d="M14 19h-2a2 2 0 0 1-2-2v-1"/>' +
      "</svg>",
    scale:
      '<svg viewBox="0 0 24 24" width="22" height="22" fill="none" stroke="currentColor" stroke-width="1.75" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true">' +
      '<path d="M4 18V9"/>' +
      '<path d="M10 18V6"/>' +
      '<path d="M16 18v-7"/>' +
      '<path d="M20 18V4"/>' +
      '<path d="M3 20h18"/>' +
      "</svg>",
  };

  function renderHome() {
    var data = window.TG_HOME;
    if (!data) return;

    if (data.hero) {
      var eyebrow = document.getElementById("hero-eyebrow");
      var title = document.getElementById("hero-title");
      var lead = document.getElementById("hero-lead");
      if (eyebrow && data.hero.eyebrow) eyebrow.textContent = data.hero.eyebrow;
      if (title && data.hero.title) title.textContent = data.hero.title;
      if (lead && data.hero.lead) lead.textContent = data.hero.lead;
    }

    var benefitStrip = document.getElementById("benefit-strip");
    if (benefitStrip && data.benefits) {
      benefitStrip.innerHTML = data.benefits
        .map(function (b) {
          var iconSvg = BENEFIT_ICONS[b.icon] || BENEFIT_ICONS.ops;
          return (
            '<article class="benefit-item">' +
            '<span class="benefit-icon" aria-hidden="true">' +
            iconSvg +
            "</span>" +
            "<div><strong>" +
            escapeHtml(b.title) +
            "</strong><span>" +
            escapeHtml(b.desc) +
            "</span></div></article>"
          );
        })
        .join("");
    }

    var techGrid = document.getElementById("tech-grid");
    if (techGrid && data.tech) {
      techGrid.innerHTML = data.tech
        .map(function (t) {
          return (
            '<article class="tech-card"><h3>' +
            escapeHtml(t.title) +
            "</h3><p>" +
            escapeHtml(t.desc) +
            "</p></article>"
          );
        })
        .join("");
    }

    var partnerGrid = document.getElementById("partner-grid");
    if (partnerGrid && data.partners) {
      partnerGrid.innerHTML = data.partners
        .map(function (p) {
          return '<div class="partner-chip" role="listitem">' + escapeHtml(p) + "</div>";
        })
        .join("");
    }

    var reviewGrid = document.getElementById("review-grid");
    if (reviewGrid && data.reviews) {
      reviewGrid.innerHTML = data.reviews
        .map(function (r) {
          return (
            '<article class="review-card">' +
            "<blockquote>“" +
            escapeHtml(r.quote) +
            "”</blockquote>" +
            "<footer><strong>" +
            escapeHtml(r.name) +
            "</strong><span>" +
            escapeHtml(r.role) +
            "</span></footer></article>"
          );
        })
        .join("");
    }

    if (data.cta) {
      var ctaTitle = document.getElementById("cta-title");
      var ctaBtn = document.getElementById("cta-contact-btn");
      if (ctaTitle && data.cta.title) ctaTitle.textContent = data.cta.title;
      if (ctaBtn && data.cta.button) ctaBtn.textContent = data.cta.button;
    }

    var blurb = document.getElementById("footer-blurb");
    if (blurb && data.footerBlurb) blurb.textContent = data.footerBlurb;
  }

  document.addEventListener("click", function (event) {
    var homeLink = event.target.closest("[data-home]");
    if (homeLink) {
      event.preventDefault();
      closePanel();
      setMenuOpen(false);
      window.scrollTo({ top: 0, behavior: "smooth" });
      if (history.replaceState) {
        history.replaceState(null, "", "#anasayfa");
      } else {
        location.hash = "anasayfa";
      }
      return;
    }

    var trigger = event.target.closest("[data-panel]");
    if (!trigger) return;
    var panelId = trigger.getAttribute("data-panel");
    if (!panelId) return;
    event.preventDefault();
    if (panelId === "close") {
      closePanel();
      return;
    }
    openPanel(panelId, trigger);
  });

  if (closeBtn) {
    closeBtn.addEventListener("click", function () {
      closePanel();
    });
  }

  document.addEventListener("keydown", function (event) {
    if (event.key === "Escape") {
      if (openPanelId) closePanel();
      setMenuOpen(false);
    }
  });

  if (toggle && nav) {
    toggle.addEventListener("click", function () {
      setMenuOpen(!nav.classList.contains("is-open"));
    });
  }

  document.querySelectorAll(".site-nav .nav-link").forEach(function (link) {
    link.addEventListener("click", function () {
      setMenuOpen(false);
    });
  });

  window.addEventListener("resize", function () {
    if (window.innerWidth > 900) setMenuOpen(false);
  });

  window.addEventListener(
    "scroll",
    function () {
      updateHeaderScroll();
      setActiveNav();
    },
    { passive: true }
  );
  updateHeaderScroll();
  setActiveNav();

  if (yearEl) {
    yearEl.textContent = String(new Date().getFullYear());
  }

  renderHome();

  var initial = (location.hash || "").replace(/^#/, "");
  if (
    initial &&
    /^[a-z0-9-]+$/i.test(initial) &&
    document.getElementById(initial) &&
    document.getElementById(initial).classList.contains("info-panel")
  ) {
    openPanel(initial, null);
  }

  (function initHeroCarousel() {
    var slides = document.querySelectorAll(".hero-slide");
    var dotsWrap = document.getElementById("hero-dots");
    var prev = document.getElementById("hero-prev");
    var next = document.getElementById("hero-next");
    var hero = document.querySelector(".hero");
    if (!slides.length || !dotsWrap) return;

    var index = 0;
    var timer = null;
    var reduceMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    var INTERVAL = reduceMotion ? 7000 : 5500;
    var transitioning = false;

    slides.forEach(function (_, i) {
      var btn = document.createElement("button");
      btn.type = "button";
      btn.className = "hero-dot" + (i === 0 ? " is-active" : "");
      btn.setAttribute("role", "tab");
      btn.setAttribute("aria-label", "Görsel " + (i + 1));
      btn.setAttribute("aria-selected", i === 0 ? "true" : "false");
      btn.addEventListener("click", function () {
        goTo(i, true);
      });
      dotsWrap.appendChild(btn);
    });

    var dots = dotsWrap.querySelectorAll(".hero-dot");

    function setDots(active) {
      dots.forEach(function (dot, i) {
        var on = i === active;
        dot.classList.toggle("is-active", on);
        dot.setAttribute("aria-selected", on ? "true" : "false");
      });
    }

    function goTo(n, userTriggered) {
      if (transitioning && !userTriggered) return;
      var target = ((n % slides.length) + slides.length) % slides.length;
      if (target === index) {
        restart();
        return;
      }

      var current = index;
      var leaving = slides[current];
      var entering = slides[target];

      transitioning = true;
      leaving.classList.remove("is-active");
      leaving.classList.add("is-leaving");
      entering.classList.add("is-active");

      window.setTimeout(
        function () {
          leaving.classList.remove("is-leaving");
          transitioning = false;
        },
        reduceMotion ? 80 : 1200
      );

      index = target;
      setDots(index);
      restart();
    }

    function nextSlide() {
      goTo(index + 1, false);
    }

    function stop() {
      if (timer) {
        window.clearInterval(timer);
        timer = null;
      }
    }

    function restart() {
      stop();
      timer = window.setInterval(nextSlide, INTERVAL);
    }

    if (prev) {
      prev.addEventListener("click", function () {
        goTo(index - 1, true);
      });
    }
    if (next) {
      next.addEventListener("click", function () {
        goTo(index + 1, true);
      });
    }

    if (hero) {
      hero.addEventListener("mouseenter", stop);
      hero.addEventListener("mouseleave", restart);
      hero.addEventListener("focusin", stop);
      hero.addEventListener("focusout", function (event) {
        if (!hero.contains(event.relatedTarget)) restart();
      });
    }

    document.addEventListener("visibilitychange", function () {
      if (document.hidden) stop();
      else restart();
    });

    restart();
  })();
})();
