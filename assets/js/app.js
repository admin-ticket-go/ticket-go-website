/**
 * Ticket-Go kurumsal site
 * - Sticky menü / mobil menü
 * - Kullanıcı kontrollü yatay hero carousel
 * - Yasal metin bilgi kartları
 * - Footer yılı
 * API / storage / cookie yok
 */
(function () {
  "use strict";

  var nav = document.getElementById("site-nav");
  var toggle = document.getElementById("nav-toggle");
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

  function setActiveNav() {
    var links = document.querySelectorAll(".site-nav .nav-link");
    var sections = document.querySelectorAll("main section[id]");
    var y = window.scrollY || window.pageYOffset;
    var current = "anasayfa";
    sections.forEach(function (section) {
      if (section.offsetTop - 100 <= y) {
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
    if (window.innerWidth > 768) setMenuOpen(false);
  });

  window.addEventListener("scroll", setActiveNav, { passive: true });
  setActiveNav();

  if (yearEl) {
    yearEl.textContent = String(new Date().getFullYear());
  }

  // Hash ile doğrudan panel
  var initial = (location.hash || "").replace(/^#/, "");
  if (initial && /^[a-z0-9-]+$/i.test(initial) && document.getElementById(initial) && document.getElementById(initial).classList.contains("info-panel")) {
    openPanel(initial, null);
  }

  /* Otomatik hero slideshow — crossfade + Ken Burns */
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

      window.setTimeout(function () {
        leaving.classList.remove("is-leaving");
        transitioning = false;
      }, reduceMotion ? 80 : 1200);

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
