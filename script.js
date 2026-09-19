/* ============================================================
   BLINDSHOT Assistant — script.js
   Un único archivo para todas las páginas. Cada bloque comprueba
   si sus elementos existen antes de ejecutarse.
   ============================================================ */

/* ------------------------------------------------------------
   1. CONFIGURACIÓN
   Este es el único sitio que tienes que tocar para actualizar
   los datos del bot. Nunca pongas aquí el TOKEN del bot: este
   archivo es público y cualquiera puede leerlo.
------------------------------------------------------------ */
const BOT = {
  name: "BLINDSHOT Assistant",
  applicationId: "1550802983921651922",
  inviteUrl:
    "https://discord.com/oauth2/authorize?client_id=1550802983921651922&scope=bot%20applications.commands",
  supportServerUrl: "", // Pega aquí la invitación a tu servidor de soporte cuando la tengas

  // Valores mostrados mientras no haya API. Edítalos cuando cambien.
  stats: {
    servers: 2,
    users: null,   // null = se muestra "—" hasta que tengas el dato real
    commands: null // null = se calcula solo a partir de la lista COMMANDS
  },

  status: "online", // "online" | "offline"

  /* FUTURO: cuando tengas un backend, pon aquí su URL y la web
     leerá las cifras y el estado en tiempo real. Debe responder:
     { "servers": 2, "users": 120, "commands": 27, "status": "online" } */
  statsEndpoint: null
};

/* ------------------------------------------------------------
   2. COMANDOS
   Añadir un comando = añadir un objeto a esta lista.
   category: "Moderation" | "Community" | "Utility" | "Verification"
------------------------------------------------------------ */
const COMMANDS = [
  /* ---- Moderation ---- */
  {
    name: "/ban",
    category: "Moderation",
    description: "Expulsa permanentemente a un miembro del servidor.",
    usage: "/ban <usuario> [motivo] [borrar_mensajes]",
    permissions: ["Ban Members"],
    example: "/ban @Usuario motivo: Publicidad repetida borrar_mensajes: 1d"
  },
  {
    name: "/unban",
    category: "Moderation",
    description: "Retira el baneo de un usuario para que pueda volver a entrar.",
    usage: "/unban <id_usuario> [motivo]",
    permissions: ["Ban Members"],
    example: "/unban 123456789012345678 motivo: Apelación aceptada"
  },
  {
    name: "/kick",
    category: "Moderation",
    description: "Expulsa a un miembro. Podrá volver con una invitación nueva.",
    usage: "/kick <usuario> [motivo]",
    permissions: ["Kick Members"],
    example: "/kick @Usuario motivo: Saltarse las normas del chat de voz"
  },
  {
    name: "/timeout",
    category: "Moderation",
    description: "Silencia temporalmente a un miembro en todo el servidor.",
    usage: "/timeout <usuario> <duración> [motivo]",
    permissions: ["Moderate Members"],
    example: "/timeout @Usuario duración: 30m motivo: Spam en general"
  },
  {
    name: "/warn",
    category: "Moderation",
    description: "Registra un aviso en el historial del miembro y se lo notifica por privado.",
    usage: "/warn <usuario> <motivo>",
    permissions: ["Moderate Members"],
    example: "/warn @Usuario motivo: Lenguaje ofensivo"
  },
  {
    name: "/warnings",
    category: "Moderation",
    description: "Muestra el historial de avisos de un miembro y permite borrarlos.",
    usage: "/warnings <usuario>",
    permissions: ["Moderate Members"],
    example: "/warnings @Usuario"
  },
  {
    name: "/purge",
    category: "Moderation",
    description: "Borra en bloque los últimos mensajes de un canal, con filtro opcional por usuario.",
    usage: "/purge <cantidad> [usuario]",
    permissions: ["Manage Messages"],
    example: "/purge cantidad: 50 usuario: @Usuario"
  },
  {
    name: "/lock",
    category: "Moderation",
    description: "Cierra un canal para que los miembros no puedan escribir. Vuelve a usarlo para abrirlo.",
    usage: "/lock [canal] [motivo]",
    permissions: ["Manage Channels"],
    example: "/lock canal: #general motivo: Revisión de moderación"
  },
  {
    name: "/slowmode",
    category: "Moderation",
    description: "Define cuántos segundos deben esperar los miembros entre mensajes.",
    usage: "/slowmode <segundos> [canal]",
    permissions: ["Manage Channels"],
    example: "/slowmode segundos: 15 canal: #chat"
  },

  /* ---- Community ---- */
  {
    name: "/rank",
    category: "Community",
    description: "Muestra tu nivel, experiencia y posición en el servidor.",
    usage: "/rank [usuario]",
    permissions: [],
    example: "/rank usuario: @Usuario"
  },
  {
    name: "/leaderboard",
    category: "Community",
    description: "Lista a los miembros más activos del servidor.",
    usage: "/leaderboard [página]",
    permissions: [],
    example: "/leaderboard página: 2"
  },
  {
    name: "/suggest",
    category: "Community",
    description: "Envía una sugerencia al canal configurado, con votos a favor y en contra.",
    usage: "/suggest <texto>",
    permissions: [],
    example: "/suggest texto: Añadir un canal de clips"
  },
  {
    name: "/poll",
    category: "Community",
    description: "Crea una encuesta con hasta cinco opciones y recuento en directo.",
    usage: "/poll <pregunta> <opciones> [duración]",
    permissions: ["Manage Messages"],
    example: "/poll pregunta: ¿Evento el sábado? opciones: Sí, No, Me da igual"
  },
  {
    name: "/giveaway",
    category: "Community",
    description: "Inicia un sorteo con duración, premio y número de ganadores.",
    usage: "/giveaway <premio> <duración> [ganadores]",
    permissions: ["Manage Guild"],
    example: "/giveaway premio: Nitro duración: 24h ganadores: 2"
  },
  {
    name: "/welcome",
    category: "Community",
    description: "Configura el canal y el mensaje de bienvenida para los nuevos miembros.",
    usage: "/welcome <canal> <mensaje>",
    permissions: ["Manage Guild"],
    example: "/welcome canal: #bienvenida mensaje: ¡Hola {user}, lee las normas!"
  },

  /* ---- Utility ---- */
  {
    name: "/help",
    category: "Utility",
    description: "Lista todos los comandos disponibles por categoría.",
    usage: "/help [comando]",
    permissions: [],
    example: "/help comando: ban"
  },
  {
    name: "/ping",
    category: "Utility",
    description: "Comprueba la latencia del bot y de la API de Discord.",
    usage: "/ping",
    permissions: [],
    example: "/ping"
  },
  {
    name: "/serverinfo",
    category: "Utility",
    description: "Muestra datos del servidor: creación, miembros, canales y roles.",
    usage: "/serverinfo",
    permissions: [],
    example: "/serverinfo"
  },
  {
    name: "/userinfo",
    category: "Utility",
    description: "Muestra la información de un miembro: entrada, roles y cuenta.",
    usage: "/userinfo [usuario]",
    permissions: [],
    example: "/userinfo usuario: @Usuario"
  },
  {
    name: "/avatar",
    category: "Utility",
    description: "Muestra el avatar de un miembro en tamaño completo.",
    usage: "/avatar [usuario]",
    permissions: [],
    example: "/avatar usuario: @Usuario"
  },
  {
    name: "/embed",
    category: "Utility",
    description: "Publica un mensaje embebido con título, descripción y color.",
    usage: "/embed <título> <descripción> [color] [canal]",
    permissions: ["Manage Messages"],
    example: "/embed título: Normas descripción: Sé respetuoso color: #5B8CFF"
  },
  {
    name: "/stats",
    category: "Utility",
    description: "Muestra el estado del bot: servidores, usuarios, tiempo activo y versión.",
    usage: "/stats",
    permissions: [],
    example: "/stats"
  },

  /* ---- Verification ---- */
  {
    name: "/verify",
    category: "Verification",
    description: "Inicia la verificación y entrega el rol de miembro al completarla.",
    usage: "/verify",
    permissions: [],
    example: "/verify"
  },
  {
    name: "/verify-setup",
    category: "Verification",
    description: "Configura el canal, el rol y el método de verificación del servidor.",
    usage: "/verify-setup <canal> <rol> [método]",
    permissions: ["Manage Guild"],
    example: "/verify-setup canal: #verificación rol: @Miembro método: roblox"
  },
  {
    name: "/link",
    category: "Verification",
    description: "Vincula tu cuenta de Roblox con Discord mediante un código de un solo uso.",
    usage: "/link <usuario_roblox>",
    permissions: [],
    example: "/link usuario_roblox: BuilderMan"
  },
  {
    name: "/unlink",
    category: "Verification",
    description: "Elimina la vinculación entre tu cuenta de Discord y la de Roblox.",
    usage: "/unlink",
    permissions: [],
    example: "/unlink"
  },
  {
    name: "/whois",
    category: "Verification",
    description: "Muestra la cuenta de Roblox vinculada a un miembro verificado.",
    usage: "/whois <usuario>",
    permissions: ["Manage Roles"],
    example: "/whois usuario: @Usuario"
  }
];

const CATEGORIES = ["Moderation", "Community", "Utility", "Verification"];

/* ------------------------------------------------------------
   3. UTILIDADES
------------------------------------------------------------ */
const $ = (sel, root = document) => root.querySelector(sel);
const $$ = (sel, root = document) => Array.from(root.querySelectorAll(sel));

function formatNumber(value) {
  if (value === null || value === undefined || Number.isNaN(value)) return "—";
  return new Intl.NumberFormat("es-ES").format(value);
}

/* ------------------------------------------------------------
   4. NAVEGACIÓN
------------------------------------------------------------ */
function initNav() {
  const toggle = $(".nav__toggle");
  const links = $("#nav-links");
  if (!toggle || !links) return;

  toggle.addEventListener("click", () => {
    const open = toggle.getAttribute("aria-expanded") === "true";
    toggle.setAttribute("aria-expanded", String(!open));
    links.classList.toggle("is-open", !open);
  });

  links.addEventListener("click", (e) => {
    if (e.target.closest("a")) {
      toggle.setAttribute("aria-expanded", "false");
      links.classList.remove("is-open");
    }
  });
}

/* Marca el enlace de la página actual */
function markCurrentPage() {
  const file = location.pathname.split("/").pop() || "index.html";
  $$(".nav__links a[href]").forEach((a) => {
    if (a.getAttribute("href") === file) a.setAttribute("aria-current", "page");
  });
}

/* Rellena todos los enlaces de invitación desde la configuración */
function initInviteLinks() {
  $$("[data-invite]").forEach((el) => {
    el.setAttribute("href", BOT.inviteUrl);
    el.setAttribute("target", "_blank");
    el.setAttribute("rel", "noopener");
  });
}

function initYear() {
  $$("[data-year]").forEach((el) => (el.textContent = new Date().getFullYear()));
}

/* ------------------------------------------------------------
   5. ESTADÍSTICAS Y ESTADO
------------------------------------------------------------ */
function countUp(el, target) {
  const reduced = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
  if (target === null || reduced) {
    el.textContent = formatNumber(target);
    return;
  }
  const duration = 900;
  const start = performance.now();
  function frame(now) {
    const p = Math.min((now - start) / duration, 1);
    const eased = 1 - Math.pow(1 - p, 3);
    el.textContent = formatNumber(Math.round(target * eased));
    if (p < 1) requestAnimationFrame(frame);
  }
  requestAnimationFrame(frame);
}

function renderStats(data) {
  const values = {
    servers: data.servers,
    users: data.users,
    commands: data.commands ?? COMMANDS.length
  };

  $$("[data-stat]").forEach((el) => {
    const key = el.dataset.stat;
    if (!(key in values)) return;
    const target = values[key];
    if (target === null || target === undefined) {
      el.textContent = "—";
      return;
    }
    // Anima solo cuando entra en pantalla
    const io = new IntersectionObserver((entries, obs) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          countUp(el, target);
          obs.disconnect();
        }
      });
    }, { threshold: 0.4 });
    io.observe(el);
  });

  const online = data.status === "online";
  $$("[data-status-dot]").forEach((el) => {
    el.classList.toggle("is-online", online);
    el.classList.toggle("is-offline", !online);
  });
  $$("[data-status-text]").forEach((el) => {
    el.textContent = online ? "Online" : "Offline";
  });
}

async function initStats() {
  renderStats({ ...BOT.stats, status: BOT.status });

  // FUTURO: estadísticas en tiempo real desde tu propio backend
  if (!BOT.statsEndpoint) return;
  try {
    const res = await fetch(BOT.statsEndpoint, { cache: "no-store" });
    if (!res.ok) throw new Error("Respuesta " + res.status);
    const live = await res.json();
    renderStats({
      servers: live.servers ?? BOT.stats.servers,
      users: live.users ?? BOT.stats.users,
      commands: live.commands ?? BOT.stats.commands,
      status: live.status ?? BOT.status
    });
  } catch (err) {
    console.warn("No se pudieron cargar las estadísticas en vivo:", err.message);
  }
}

/* ------------------------------------------------------------
   6. RETÍCULA DEL HÉROE (sigue al cursor, muy sutil)
------------------------------------------------------------ */
function initReticle() {
  const reticle = $(".reticle");
  if (!reticle) return;
  if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;
  if (window.matchMedia("(hover: none)").matches) return;

  const cross = $(".reticle__cross", reticle);
  const core = $(".reticle__core", reticle);
  const readout = $("[data-readout]");

  window.addEventListener("mousemove", (e) => {
    const x = (e.clientX / window.innerWidth - 0.5) * 2;
    const y = (e.clientY / window.innerHeight - 0.5) * 2;
    if (cross) cross.setAttribute("transform", `translate(${x * 9} ${y * 9})`);
    if (core) core.setAttribute("transform", `translate(${x * 16} ${y * 16})`);
    if (readout) {
      readout.textContent =
        `X ${(x * 100).toFixed(0).padStart(3, "0")}  ·  Y ${(y * 100).toFixed(0).padStart(3, "0")}`;
    }
  }, { passive: true });
}

/* ------------------------------------------------------------
   7. VISTA PREVIA DE COMANDOS (index.html)
------------------------------------------------------------ */
function initCommandPreview() {
  const box = $("#cmd-preview");
  if (!box) return;
  const picks = ["/ban", "/timeout", "/verify", "/link", "/rank", "/serverinfo"];
  box.innerHTML = picks
    .map((name) => COMMANDS.find((c) => c.name === name))
    .filter(Boolean)
    .map(
      (c) => `
      <a class="cmd-row" href="commands.html#${c.name.replace("/", "")}">
        <code>${c.name}</code>
        <span>${c.category}</span>
      </a>`
    )
    .join("");
}

/* ------------------------------------------------------------
   8. PÁGINA DE COMANDOS
------------------------------------------------------------ */
function initCommandsPage() {
  const grid = $("#cmd-grid");
  if (!grid) return;

  const searchInput = $("#cmd-search");
  const filtersBox = $("#cmd-filters");
  const counter = $("#result-count");

  let activeCategory = "All";
  let query = "";

  /* -- Filtros -- */
  const counts = CATEGORIES.reduce((acc, cat) => {
    acc[cat] = COMMANDS.filter((c) => c.category === cat).length;
    return acc;
  }, {});

  filtersBox.innerHTML = [
    `<button class="chip" type="button" data-cat="All" aria-pressed="true">Todos <b>${COMMANDS.length}</b></button>`,
    ...CATEGORIES.map(
      (cat) =>
        `<button class="chip" type="button" data-cat="${cat}" aria-pressed="false">${cat} <b>${counts[cat]}</b></button>`
    )
  ].join("");

  filtersBox.addEventListener("click", (e) => {
    const chip = e.target.closest(".chip");
    if (!chip) return;
    activeCategory = chip.dataset.cat;
    $$(".chip", filtersBox).forEach((c) =>
      c.setAttribute("aria-pressed", String(c === chip))
    );
    render();
  });

  /* -- Buscador -- */
  let debounce;
  searchInput.addEventListener("input", () => {
    clearTimeout(debounce);
    debounce = setTimeout(() => {
      query = searchInput.value.trim().toLowerCase();
      render();
    }, 120);
  });

  /* -- Render -- */
  function matches(cmd) {
    const inCategory = activeCategory === "All" || cmd.category === activeCategory;
    if (!inCategory) return false;
    if (!query) return true;
    return (
      cmd.name.toLowerCase().includes(query) ||
      cmd.description.toLowerCase().includes(query) ||
      cmd.category.toLowerCase().includes(query)
    );
  }

  function render() {
    const list = COMMANDS.filter(matches);
    counter.textContent =
      list.length === 1 ? "1 comando" : `${list.length} comandos`;

    if (!list.length) {
      grid.innerHTML = `
        <div class="empty" style="grid-column: 1 / -1">
          <h3>Sin resultados</h3>
          <p>Prueba con otra palabra o vuelve a la categoría «Todos».</p>
        </div>`;
      return;
    }

    grid.innerHTML = list
      .map(
        (c, i) => `
        <button class="cmd-card" type="button" id="${c.name.replace("/", "")}"
                data-command="${c.name}" style="animation-delay:${Math.min(i * 22, 300)}ms">
          <span class="cmd-card__name">${c.name}</span>
          <span class="cmd-card__desc">${c.description}</span>
          <span class="cmd-card__foot">
            <span class="tag tag--${c.category.toLowerCase()}">${c.category}</span>
            <span class="cmd-card__more">Ver detalles</span>
          </span>
        </button>`
      )
      .join("");
  }

  grid.addEventListener("click", (e) => {
    const card = e.target.closest(".cmd-card");
    if (card) openModal(card.dataset.command, card);
  });

  render();

  /* -- Abrir por enlace directo, p. ej. commands.html#ban -- */
  if (location.hash) {
    const target = COMMANDS.find(
      (c) => c.name.replace("/", "") === location.hash.slice(1)
    );
    if (target) openModal(target.name, null);
  }
}

/* ------------------------------------------------------------
   9. MODAL DE COMANDO
------------------------------------------------------------ */
let lastFocused = null;

function openModal(commandName, trigger) {
  const modal = $("#cmd-modal");
  const cmd = COMMANDS.find((c) => c.name === commandName);
  if (!modal || !cmd) return;

  lastFocused = trigger || document.activeElement;

  $("#modal-title").textContent = cmd.name;
  $("#modal-desc").textContent = cmd.description;
  $("#modal-usage").textContent = cmd.usage;
  $("#modal-example").textContent = cmd.example;
  $("#modal-category").textContent = cmd.category;
  $("#modal-category").className = `tag tag--${cmd.category.toLowerCase()}`;

  const perms = $("#modal-perms");
  perms.innerHTML = cmd.permissions.length
    ? cmd.permissions.map((p) => `<span class="perm">${p}</span>`).join("")
    : `<span class="perm perm--none">Sin permisos especiales</span>`;

  modal.classList.add("is-open");
  modal.setAttribute("aria-hidden", "false");
  document.body.style.overflow = "hidden";
  $(".modal__close", modal).focus();
}

function closeModal() {
  const modal = $("#cmd-modal");
  if (!modal || !modal.classList.contains("is-open")) return;
  modal.classList.remove("is-open");
  modal.setAttribute("aria-hidden", "true");
  document.body.style.overflow = "";
  if (lastFocused && lastFocused.focus) lastFocused.focus();
}

function initModal() {
  const modal = $("#cmd-modal");
  if (!modal) return;

  modal.addEventListener("click", (e) => {
    if (e.target === modal || e.target.closest("[data-close]")) closeModal();
  });

  document.addEventListener("keydown", (e) => {
    if (e.key === "Escape") closeModal();
    // Mantiene el foco dentro del modal mientras está abierto
    if (e.key === "Tab" && modal.classList.contains("is-open")) {
      const focusables = $$(
        'button, a[href], input, [tabindex]:not([tabindex="-1"])',
        modal
      );
      if (!focusables.length) return;
      const first = focusables[0];
      const last = focusables[focusables.length - 1];
      if (e.shiftKey && document.activeElement === first) {
        e.preventDefault();
        last.focus();
      } else if (!e.shiftKey && document.activeElement === last) {
        e.preventDefault();
        first.focus();
      }
    }
  });
}

/* ------------------------------------------------------------
   10. ARRANQUE
------------------------------------------------------------ */
document.addEventListener("DOMContentLoaded", () => {
  initNav();
  markCurrentPage();
  initInviteLinks();
  initYear();
  initStats();
  initReticle();
  initCommandPreview();
  initCommandsPage();
  initModal();
});
