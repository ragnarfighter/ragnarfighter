// RAGNAR FIGHTER: comportamiento de la página. Los datos viven en config.js.
(function () {
  "use strict";

  var cfg = window.RAGNAR_CONFIG || {};
  var CHANNEL = "https://www.youtube.com/@ragnarfighter";
  var pending = {};

  function val(key) {
    var v = cfg[key];
    return typeof v === "string" ? v.trim() : "";
  }

  function waDigits() {
    return val("whatsapp").replace(/\D/g, "");
  }

  function formatPhone(digits) {
    if (/^57\d{10}$/.test(digits)) {
      return "+57 " + digits.slice(2, 5) + " " + digits.slice(5, 8) + " " + digits.slice(8);
    }
    return "+" + digits;
  }

  function $all(sel) {
    return Array.prototype.slice.call(document.querySelectorAll(sel));
  }

  // ---------- Datos de config.js sobre las pegatinas [DATO POR CONFIRMAR] ----------

  $all("[data-cfg]").forEach(function (el) {
    var key = el.getAttribute("data-cfg");
    var v = val(key);
    if (!v) { pending[key] = true; return; }

    if (key === "whatsapp") {
      var d = waDigits();
      el.textContent = formatPhone(d);
      if (el.tagName === "A") {
        el.href = "https://wa.me/" + d;
        el.target = "_blank";
        el.rel = "noopener";
      }
    } else if (key === "email") {
      el.textContent = v;
      if (el.tagName === "A") el.href = "mailto:" + v;
    } else {
      el.textContent = v;
    }
    el.classList.remove("tbc");
  });

  $all("[data-hide-when-set]").forEach(function (el) {
    if (val(el.getAttribute("data-hide-when-set"))) el.hidden = true;
  });

  // Botones de WhatsApp con mensaje inicial
  var wa = waDigits();
  $all("[data-wa]").forEach(function (a) {
    if (!wa) { pending.whatsapp = true; return; }
    a.href = "https://wa.me/" + wa + "?text=" + encodeURIComponent(a.getAttribute("data-wa"));
    a.target = "_blank";
    a.rel = "noopener";
  });

  // Enlaces que dependen de config.js (media kit)
  $all("[data-cfg-href]").forEach(function (a) {
    var key = a.getAttribute("data-cfg-href");
    var v = val(key);
    if (!v) { pending[key] = true; return; }
    a.href = v;
    if (a.hasAttribute("data-new-tab")) { a.target = "_blank"; a.rel = "noopener"; }
  });

  // Cifras con fecha
  var stats = cfg.stats || {};
  $all("[data-stat]").forEach(function (el) {
    var v = stats[el.getAttribute("data-stat")];
    if (typeof v === "string" && v.trim()) el.textContent = v.trim();
  });

  // Año del ©
  $all(".js-year").forEach(function (el) { el.textContent = String(new Date().getFullYear()); });

  // ---------- Titular del hero ----------

  var HEROES = {
    a: {
      title: "El camino se camina peleando.",
      sub: "Ragnar Fighter — MMA, kickboxing y disciplina en Bogotá. Sin atajos. Sin excusas."
    },
    b: {
      title: "Dejé la vida que esperaban de mí. Elegí el camino del guerrero.",
      sub: "Iván Darío Piñeros es Ragnar. Conoce la historia, entrena con él y sigue la serie Bushido."
    }
  };
  var hero = HEROES[val("hero")];
  if (hero) {
    document.getElementById("hero-title").textContent = hero.title;
    document.getElementById("hero-sub").textContent = hero.sub;
  }

  // ---------- Tarjetas de capítulos: enlace y portada desde la URL del video ----------

  function youtubeId(url) {
    var m = url.match(/(?:youtube\.com\/(?:watch\?(?:.*&)?v=|shorts\/|embed\/)|youtu\.be\/)([A-Za-z0-9_-]{11})/);
    return m ? m[1] : "";
  }

  var videos = cfg.videos || {};
  $all(".chapter[data-video]").forEach(function (li) {
    var key = li.getAttribute("data-video");
    var url = typeof videos[key] === "string" ? videos[key].trim() : "";
    if (!url) { pending["videos." + key] = true; return; }

    var link = li.querySelector(".chapter-body a");
    if (link) link.href = url;

    var id = youtubeId(url);
    var cover = li.querySelector(".chapter-cover");
    if (id && cover && !cover.querySelector("img")) { // portada local primero; la de YouTube solo si falta
      var img = document.createElement("img");
      img.src = "https://i.ytimg.com/vi/" + id + "/hqdefault.jpg";
      img.alt = "Portada de " + li.getAttribute("data-label") + " de Bushido, El Camino del Guerrero, con Ragnar Fighter";
      img.loading = "lazy";
      img.width = 480;
      img.height = 360;
      cover.textContent = "";
      cover.appendChild(img);
    }
  });

  // ---------- Menú móvil ----------

  var toggle = document.querySelector(".nav-toggle");
  var nav = document.getElementById("menu");

  function setMenu(open) {
    toggle.setAttribute("aria-expanded", open ? "true" : "false");
    toggle.setAttribute("aria-label", open ? "Cerrar menú" : "Abrir menú");
    nav.classList.toggle("is-open", open);
  }

  if (toggle && nav) {
    toggle.addEventListener("click", function () {
      setMenu(toggle.getAttribute("aria-expanded") !== "true");
    });
    nav.addEventListener("click", function (e) {
      if (e.target.closest("a")) setMenu(false);
    });
    document.addEventListener("keydown", function (e) {
      if (e.key === "Escape") setMenu(false);
    });
    window.addEventListener("resize", function () {
      if (window.innerWidth >= 1040) setMenu(false);
    });
  }

  // ---------- Formularios ----------

  function setStatus(el, msg, kind) {
    el.textContent = msg;
    el.className = "form-status" + (kind ? " is-" + kind : "");
  }

  function send(endpoint, form) {
    var data = {};
    new FormData(form).forEach(function (v, k) { data[k] = v; });
    if (data.website) return Promise.resolve(); // campo trampa para bots: simula éxito sin enviar
    delete data.website;
    return fetch(endpoint, {
      method: "POST",
      headers: { "Content-Type": "application/json", "Accept": "application/json" },
      body: JSON.stringify(data)
    }).then(function (r) {
      if (!r.ok) throw new Error("HTTP " + r.status);
    });
  }

  var NOT_CONNECTED = "El formulario todavía no está conectado. Mientras tanto, escríbeme por Instagram o por WhatsApp.";
  var SEND_ERROR = "No se pudo enviar. Inténtalo de nuevo en un momento o escríbeme por WhatsApp.";

  // Contacto
  var contactForm = document.getElementById("contact-form");
  if (contactForm) {
    var motivo = document.getElementById("f-motivo");
    var eventoWrap = document.getElementById("f-evento-wrap");
    var evento = document.getElementById("f-evento");
    var contactStatus = document.getElementById("contact-status");
    var thanks = document.getElementById("contact-thanks");

    motivo.addEventListener("change", function () {
      var isEvent = motivo.value === "Evento — MC o cobertura";
      eventoWrap.hidden = !isEvent;
      evento.required = isEvent;
    });

    contactForm.addEventListener("submit", function (e) {
      e.preventDefault();
      if (!contactForm.checkValidity()) {
        contactForm.reportValidity();
        return;
      }
      var endpoint = val("formEndpoint");
      if (!endpoint) { pending.formEndpoint = true; setStatus(contactStatus, NOT_CONNECTED, "error"); return; }

      setStatus(contactStatus, "Enviando…", "");
      send(endpoint, contactForm).then(function () {
        contactForm.hidden = true;
        thanks.hidden = false;
        thanks.focus();
      }).catch(function () {
        setStatus(contactStatus, SEND_ERROR, "error");
      });
    });
  }

  // Lista de espera del Método Bushido
  var waitlistForm = document.getElementById("waitlist-form");
  if (waitlistForm) {
    var waitlistStatus = document.getElementById("waitlist-status");
    waitlistForm.addEventListener("submit", function (e) {
      e.preventDefault();
      if (!waitlistForm.checkValidity()) {
        waitlistForm.reportValidity();
        return;
      }
      var endpoint = val("waitlistEndpoint") || val("formEndpoint");
      if (!endpoint) { pending.waitlistEndpoint = true; setStatus(waitlistStatus, NOT_CONNECTED, "error"); return; }

      setStatus(waitlistStatus, "Enviando…", "");
      send(endpoint, waitlistForm).then(function () {
        waitlistForm.reset();
        setStatus(waitlistStatus, "Listo. Estás en la lista. Te aviso cuando el Método Bushido esté listo.", "ok");
      }).catch(function () {
        setStatus(waitlistStatus, SEND_ERROR, "error");
      });
    });
  }

  // Aviso para quien arma la página: qué falta por llenar en config.js
  var keys = Object.keys(pending);
  if (keys.length && window.console && console.info) {
    console.info("[Ragnar] Pendientes en config.js: " + keys.join(", "));
  }
})();
