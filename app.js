const KEY = "hype_sessions_v1";

const sportMeta = {
  running: {
    icon: "🏃",
    label: "Laufen",
    placeholder: "z. B. Easy Run"
  },

  strength: {
    icon: "🏋️",
    label: "Krafttraining",
    placeholder: "z. B. Upper Body"
  },

  hyrox: {
    icon: "⚡",
    label: "HYROX",
    placeholder: "z. B. HYROX Intervals"
  },

  cycling: {
    icon: "🚴",
    label: "Rad",
    placeholder: "z. B. Zone 2 Ride"
  },

  swimming: {
    icon: "🏊",
    label: "Schwimmen",
    placeholder: "z. B. Technik & Ausdauer"
  },

  mobility: {
    icon: "🧘",
    label: "Mobility",
    placeholder: "z. B. 20 min Mobility"
  },

  rest: {
    icon: "😴",
    label: "Erholung",
    placeholder: "z. B. Rest Day"
  }
};


/* =========================
   STATE
========================= */

let sessions = loadSessions();

let selected = new Date();
selected.setHours(12, 0, 0, 0);

let editingId = null;

let currentView = "plan";

let overviewPeriod = "week";

let overviewDate = new Date();
overviewDate.setHours(12, 0, 0, 0);


/* =========================
   DOM
========================= */

const planView = document.getElementById("planView");
const overviewView = document.getElementById("overviewView");
const todayView = document.getElementById("todayView");

const weekTitle = document.getElementById("weekTitle");
const heroYear = document.getElementById("heroYear");

const weekStrip = document.getElementById("weekStrip");
const sessionsEl = document.getElementById("sessions");
const selectedDateLabel = document.getElementById("selectedDateLabel");
const weeklyInsight = document.getElementById("weeklyInsight");

const addTrainingBtn = document.getElementById("addTrainingBtn");

const overviewContent = document.getElementById("overviewContent");
const periodTitle = document.getElementById("periodTitle");
const periodPrevBtn = document.getElementById("periodPrevBtn");
const periodNextBtn = document.getElementById("periodNextBtn");
const periodTodayBtn = document.getElementById("periodTodayBtn");

const todayTitle = document.getElementById("todayTitle");
const todayContent = document.getElementById("todayContent");

const trainingDialog = document.getElementById("trainingDialog");
const trainingForm = document.getElementById("trainingForm");

const dialogTitle = document.getElementById("dialogTitle");
const closeDialogBtn = document.getElementById("closeDialogBtn");

const sportInput = document.getElementById("sportInput");
const titleInput = document.getElementById("titleInput");
const durationInput = document.getElementById("durationInput");
const intensityInput = document.getElementById("intensityInput");
const notesInput = document.getElementById("notesInput");


/* =========================
   HELPERS
========================= */

function pad(value) {
  return String(value).padStart(2, "0");
}


function iso(date) {
  return [
    date.getFullYear(),
    pad(date.getMonth() + 1),
    pad(date.getDate())
  ].join("-");
}


function parseDate(value) {
  const [year, month, day] = value.split("-").map(Number);

  return new Date(
    year,
    month - 1,
    day,
    12,
    0,
    0,
    0
  );
}


function startOfWeek(date) {
  const d = new Date(date);

  d.setHours(12, 0, 0, 0);

  const day = d.getDay();

  const diff = day === 0 ? -6 : 1 - day;

  d.setDate(d.getDate() + diff);

  return d;
}


function endOfWeek(date) {
  const d = startOfWeek(date);

  d.setDate(d.getDate() + 6);

  return d;
}


function addDays(date, amount) {
  const d = new Date(date);

  d.setDate(d.getDate() + amount);

  return d;
}


function addMonths(date, amount) {
  const d = new Date(date);

  d.setDate(1);
  d.setMonth(d.getMonth() + amount);

  return d;
}


function addYears(date, amount) {
  const d = new Date(date);

  d.setDate(1);
  d.setMonth(0);
  d.setFullYear(d.getFullYear() + amount);

  return d;
}


function esc(value) {
  return String(value ?? "")
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;")
    .replace(/'/g, "&#039;");
}


function formatLongDate(date) {
  return new Intl.DateTimeFormat("de-DE", {
    weekday: "long",
    day: "numeric",
    month: "long"
  }).format(date);
}


function formatShortDate(date) {
  return new Intl.DateTimeFormat("de-DE", {
    day: "numeric",
    month: "short"
  }).format(date);
}


function formatMonthYear(date) {
  return new Intl.DateTimeFormat("de-DE", {
    month: "long",
    year: "numeric"
  }).format(date);
}


function isToday(date) {
  return iso(date) === iso(new Date());
}


function isFutureDate(dateString) {
  const today = new Date();
  today.setHours(0, 0, 0, 0);

  const target = parseDate(dateString);
  target.setHours(0, 0, 0, 0);

  return target > today;
}


function getFutureMessage(dateString) {
  const date = parseDate(dateString);

  if (iso(addDays(new Date(), 1)) === dateString) {
    return "Diese Einheit kommt erst morgen. Du kannst sie noch nicht abhaken.";
  }

  return `Diese Einheit kommt erst am ${formatLongDate(date)}. Du kannst sie noch nicht abhaken.`;
}


/* =========================
   STORAGE
========================= */

function loadSessions() {
  try {
    const raw = localStorage.getItem(KEY);

    if (!raw) {
      return [];
    }

    const data = JSON.parse(raw);

    if (!Array.isArray(data)) {
      return [];
    }

    return data.map(session => ({
      ...session,
      completed: Boolean(session.completed),
      actualIntensity:
        session.actualIntensity === undefined
          ? null
          : session.actualIntensity,
      postNotes: session.postNotes || ""
    }));

  } catch (error) {
    console.error("HYPE storage error:", error);

    return [];
  }
}


function save() {
  localStorage.setItem(
    KEY,
    JSON.stringify(sessions)
  );
}


/* =========================
   SESSION QUERIES
========================= */

function sessionsForDate(dateString) {
  return sessions
    .filter(session => session.date === dateString)
    .sort((a, b) => {
      return Number(a.createdAt || 0) - Number(b.createdAt || 0);
    });
}


function sessionsForWeek(date) {
  const start = startOfWeek(date);
  const end = endOfWeek(date);

  const startIso = iso(start);
  const endIso = iso(end);

  return sessions.filter(session => {
    return session.date >= startIso &&
           session.date <= endIso;
  });
}


function sessionsForMonth(date) {
  const year = date.getFullYear();
  const month = date.getMonth();

  return sessions.filter(session => {
    const d = parseDate(session.date);

    return (
      d.getFullYear() === year &&
      d.getMonth() === month
    );
  });
}


function sessionsForYear(year) {
  return sessions.filter(session => {
    return parseDate(session.date).getFullYear() === year;
  });
}


/* =========================
   PLAN VIEW
========================= */

function renderPlan() {
  const start = startOfWeek(selected);
  const end = endOfWeek(selected);

  const startText = new Intl.DateTimeFormat("de-DE", {
    day: "numeric",
    month: "short"
  }).format(start);

  const endText = new Intl.DateTimeFormat("de-DE", {
    day: "numeric",
    month: "short"
  }).format(end);

  weekTitle.textContent =
    `${startText} – ${endText}`;

  heroYear.textContent =
    start.getFullYear();

  renderWeekStrip();

  selectedDateLabel.textContent =
    formatLongDate(selected);

  renderSelectedDay();

  renderWeeklyInsight();
}


function renderWeekStrip() {
  weekStrip.innerHTML = "";

  const start = startOfWeek(selected);

  const dayNames = [
    "Mo",
    "Di",
    "Mi",
    "Do",
    "Fr",
    "Sa",
    "So"
  ];

  for (let i = 0; i < 7; i++) {
    const date = addDays(start, i);

    const dateString = iso(date);

    const daySessions =
      sessionsForDate(dateString);

    const button =
      document.createElement("button");

    button.className =
      "day" +
      (
        dateString === iso(selected)
          ? " active"
          : ""
      );

    button.type = "button";

    const todayLabel =
      isToday(date)
        ? `<span class="today-label">HEUTE</span>`
        : `<span class="today-label">&nbsp;</span>`;

    button.innerHTML = `
      ${dayNames[i]}
      <strong>${date.getDate()}</strong>
      ${todayLabel}
      ${
        daySessions.length
          ? `<span class="dot"></span>`
          : `<span style="display:block;height:5px;margin-top:7px;"></span>`
      }
    `;

    button.addEventListener("click", () => {
      selected = date;
      renderPlan();
    });

    weekStrip.appendChild(button);
  }
}


function renderSelectedDay() {
  const list =
    sessionsForDate(iso(selected));

  if (!list.length) {
    sessionsEl.innerHTML = `
      <div class="empty">
        Für diesen Tag ist noch kein Training geplant.
      </div>
    `;

    return;
  }

  sessionsEl.innerHTML =
    list.map(renderSessionCard).join("");

  attachSessionEvents(sessionsEl);
}


/* =========================
   SESSION CARD
========================= */

function renderSessionCard(session) {
  const meta =
    sportMeta[session.sport] ||
    sportMeta.running;

  const dots =
    Array.from({ length: 5 })
      .map((_, index) => {
        return index < Number(session.intensity || 0)
          ? "●"
          : "○";
      })
      .join("");

  const actualOptions = [
    [0, "entspannend"],
    [1, "sehr leicht"],
    [2, "leicht"],
    [3, "moderat"],
    [4, "hart"],
    [5, "sehr hart"]
  ];

  const actualSelect = actualOptions
    .map(([value, label]) => {
      return `
        <option
          value="${value}"
          ${
            Number(session.actualIntensity) === value
              ? "selected"
              : ""
          }
        >
          ${value} · ${label}
        </option>
      `;
    })
    .join("");

  return `
    <article
      class="session ${session.completed ? "completed" : ""}"
      data-id="${esc(session.id)}"
    >

      <div class="sport-icon">
        ${meta.icon}
      </div>

      <div class="session-content">

        <div class="session-title-row">

          <h4>${esc(session.title)}</h4>

          ${
            session.completed
              ? `<span class="completed-label">ERLEDIGT</span>`
              : ""
          }

        </div>

        <p>
          ${meta.label}
          · ${esc(session.duration)} min
        </p>

        <p>
          ${dots}
        </p>

        ${
          session.notes
            ? `<p>${esc(session.notes)}</p>`
            : ""
        }

        ${
          session.completed
            ? `
              <div class="actual-intensity">

                <span>Gefühlt:</span>

                <select
                  class="actual-intensity-select"
                  data-action="actual-intensity"
                >
                  ${actualSelect}
                </select>

              </div>

              <div class="post-training-notes">

                <label>
                  Wie war das Training?

                  <textarea
                    rows="3"
                    data-action="post-notes"
                    placeholder="z. B. Hat sich heute sehr gut angefühlt …"
                  >${esc(session.postNotes || "")}</textarea>

                </label>

              </div>
            `
            : ""
        }

      </div>

      <div class="session-actions">

        <button
          type="button"
          class="complete-btn ${
            session.completed
              ? "is-completed"
              : ""
          }"
          data-action="complete"
          aria-label="${
            session.completed
              ? "Training als offen markieren"
              : "Training abhaken"
          }"
        >
          ${
            session.completed
              ? "✓"
              : "○"
          }
        </button>

        <button
          type="button"
          class="edit-btn"
          data-action="edit"
        >
          ✎ Bearbeiten
        </button>

        <button
          type="button"
          class="edit-btn"
          data-action="delete"
        >
          × Löschen
        </button>

      </div>

    </article>
  `;
}


/* =========================
   SESSION EVENTS
========================= */

function attachSessionEvents(container) {
  container
    .querySelectorAll(".session")
    .forEach(card => {

      const id = card.dataset.id;

      const session =
        sessions.find(item => item.id === id);

      if (!session) {
        return;
      }

      const completeButton =
        card.querySelector(
          '[data-action="complete"]'
        );

      const editButton =
        card.querySelector(
          '[data-action="edit"]'
        );

      const deleteButton =
        card.querySelector(
          '[data-action="delete"]'
        );

      const actualIntensity =
        card.querySelector(
          '[data-action="actual-intensity"]'
        );

      const postNotes =
        card.querySelector(
          '[data-action="post-notes"]'
        );


      completeButton.addEventListener(
        "click",
        () => {

          if (!session.completed &&
              isFutureDate(session.date)) {

            alert(
              getFutureMessage(session.date)
            );

            return;
          }

          session.completed =
            !session.completed;

          if (!session.completed) {
            session.actualIntensity = null;
            session.postNotes = "";
          }

          save();

          renderAll();
        }
      );


      editButton.addEventListener(
        "click",
        () => {
          openEditDialog(session);
        }
      );


      deleteButton.addEventListener(
        "click",
        () => {

          const confirmed =
            window.confirm(
              "Möchtest du diese Einheit wirklich löschen?\n\n" +
              session.title
            );

          if (!confirmed) {
            return;
          }

          sessions =
            sessions.filter(
              item => item.id !== id
            );

          save();

          renderAll();
        }
      );


      if (actualIntensity) {
        actualIntensity.addEventListener(
          "change",
          () => {

            session.actualIntensity =
              Number(actualIntensity.value);

            save();
          }
        );
      }


      if (postNotes) {
        postNotes.addEventListener(
          "input",
          () => {

            session.postNotes =
              postNotes.value;

            save();
          }
        );
      }

    });
}


/* =========================
   WEEKLY INSIGHT
========================= */

function renderWeeklyInsight() {
  const weekSessions =
    sessionsForWeek(selected);

  const completed =
    weekSessions.filter(
      session => session.completed
    ).length;

  const planned =
    weekSessions.length;

  if (!planned) {
    weeklyInsight.innerHTML = `
      <div class="insight-icon">✦</div>

      <div>
        <strong>Deine Woche ist noch frei.</strong>

        <p>
          Plane deine ersten Einheiten und baue dir
          deine Woche Schritt für Schritt auf.
        </p>
      </div>
    `;

    return;
  }

  const remaining =
    planned - completed;

  let text =
    `${completed} von ${planned} Einheiten erledigt.`;

  if (remaining > 0) {
    text += ` ${remaining} ${
      remaining === 1
        ? "Einheit ist"
        : "Einheiten sind"
    } noch offen.`;
  } else {
    text += " Stark – deine Woche ist komplett.";
  }

  weeklyInsight.innerHTML = `
    <div class="insight-icon">✦</div>

    <div>
      <strong>Wochenstatus</strong>

      <p>
        ${text}
      </p>
    </div>
  `;
}


/* =========================
   OVERVIEW
========================= */

function renderOverview() {
  renderPeriodButtons();
  renderPeriodNavigation();

  if (overviewPeriod === "week") {
    renderOverviewWeek();
  }

  if (overviewPeriod === "month") {
    renderOverviewMonth();
  }

  if (overviewPeriod === "year") {
    renderOverviewYear();
  }
}


function renderPeriodButtons() {
  document
    .querySelectorAll(".period-btn")
    .forEach(button => {

      button.classList.toggle(
        "active",
        button.dataset.period === overviewPeriod
      );

    });
}


function renderPeriodNavigation() {
  if (overviewPeriod === "week") {

    const start = startOfWeek(overviewDate);
    const end = endOfWeek(overviewDate);

    const startText =
      new Intl.DateTimeFormat("de-DE", {
        day: "numeric",
        month: "short"
      }).format(start);

    const endText =
      new Intl.DateTimeFormat("de-DE", {
        day: "numeric",
        month: "short"
      }).format(end);

    periodTitle.textContent =
      `${startText} – ${endText} ${start.getFullYear()}`;

    return;
  }

  if (overviewPeriod === "month") {

    periodTitle.textContent =
      formatMonthYear(overviewDate);

    return;
  }

  periodTitle.textContent =
    overviewDate.getFullYear();
}


/* =========================
   OVERVIEW WEEK
========================= */

function renderOverviewWeek() {
  const start =
    startOfWeek(overviewDate);

  let html =
    `<div class="overview-week">`;

  for (let i = 0; i < 7; i++) {

    const date =
      addDays(start, i);

    const dateString =
      iso(date);

    const daySessions =
      sessionsForDate(dateString);

    const completed =
      daySessions.filter(
        session => session.completed
      ).length;


    html += `
      <section
        class="overview-day ${
          isToday(date)
            ? "today"
            : ""
        }"
      >

        <div class="overview-day-head">

          <div class="overview-day-date">

            <span class="overview-day-name">
              ${
                new Intl.DateTimeFormat("de-DE", {
                  weekday: "long"
                }).format(date)
              }
            </span>

            <span class="overview-day-number">
              ${date.getDate()}.${pad(date.getMonth() + 1)}.
            </span>

          </div>


          <span
            class="overview-day-status ${
              daySessions.length &&
              completed === daySessions.length
                ? "done"
                : ""
            }"
          >
            ${
              daySessions.length
                ? `${completed}/${daySessions.length}`
                : "frei"
            }
          </span>

        </div>


        <div class="overview-day-sessions">
    `;


    if (!daySessions.length) {

      html += `
        <div class="overview-empty-day">
          Keine Einheit geplant
        </div>
      `;

    } else {

      daySessions.forEach(session => {

        const meta =
          sportMeta[session.sport] ||
          sportMeta.running;

        html += `
          <div
            class="overview-mini-session"
            data-session-id="${esc(session.id)}"
          >

            <div class="mini-icon">
              ${meta.icon}
            </div>


            <div>

              <div class="mini-title">
                ${esc(session.title)}
              </div>

              <div class="mini-meta">
                ${meta.label}
                · ${esc(session.duration)} min
              </div>

            </div>


            <div
              class="mini-status ${
                session.completed
                  ? "completed"
                  : ""
              }"
            >
              ${
                session.completed
                  ? "✓"
                  : "○"
              }
            </div>

          </div>
        `;
      });

    }


    html += `
        </div>

      </section>
    `;
  }


  html += `
    </div>
  `;

  overviewContent.innerHTML = html;
}


/* =========================
   OVERVIEW MONTH
========================= */

function renderOverviewMonth() {
  const year =
    overviewDate.getFullYear();

  const month =
    overviewDate.getMonth();

  const firstDay =
    new Date(
      year,
      month,
      1,
      12
    );

  const lastDay =
    new Date(
      year,
      month + 1,
      0,
      12
    );

  const mondayOffset =
    firstDay.getDay() === 0
      ? 6
      : firstDay.getDay() - 1;

  const daysInMonth =
    lastDay.getDate();


  let html = `
    <div class="month-calendar">

      <div class="month-weekdays">

        <div class="month-weekday">MO</div>
        <div class="month-weekday">DI</div>
        <div class="month-weekday">MI</div>
        <div class="month-weekday">DO</div>
        <div class="month-weekday">FR</div>
        <div class="month-weekday">SA</div>
        <div class="month-weekday">SO</div>

      </div>

      <div class="month-grid">
  `;


  /*
   * Leere Felder vor dem Monat
   */
  for (let i = 0; i < mondayOffset; i++) {

    const previousDate =
      new Date(
        year,
        month,
        i - mondayOffset + 1,
        12
      );

    html += renderMonthCell(
      previousDate,
      true
    );
  }


  /*
   * Monatstage
   */
  for (let day = 1; day <= daysInMonth; day++) {

    const date =
      new Date(
        year,
        month,
        day,
        12
      );

    html += renderMonthCell(
      date,
      false
    );
  }


  /*
   * Restliche Felder
   */
  const usedCells =
    mondayOffset + daysInMonth;

  const remaining =
    (7 - (usedCells % 7)) % 7;


  for (let i = 1; i <= remaining; i++) {

    const nextDate =
      new Date(
        year,
        month,
        daysInMonth + i,
        12
      );

    html += renderMonthCell(
      nextDate,
      true
    );
  }


  html += `
      </div>
    </div>
  `;


  overviewContent.innerHTML = html;

  /*
   * Klick auf eine Kalenderwoche
   */
  attachMonthWeekNavigation();
}


function renderMonthCell(date, otherMonth) {
  const dateString =
    iso(date);

  const daySessions =
    sessionsForDate(dateString);

  const completed =
    daySessions.filter(
      session => session.completed
    ).length;


  let dots = "";

  daySessions
    .slice(0, 5)
    .forEach(session => {

      dots += `
        <span
          class="month-dot ${
            session.completed
              ? "completed"
              : ""
          }"
        ></span>
      `;
    });


  return `
    <div
      class="month-cell ${
        otherMonth
          ? "other-month"
          : ""
      } ${
        isToday(date)
          ? "today"
          : ""
      }"
      data-date="${dateString}"
    >

      <div class="month-date">
        ${date.getDate()}
      </div>

      ${
        daySessions.length
          ? `
            <div class="month-dots">
              ${dots}
            </div>

            <div class="month-count">
              ${completed}/${daySessions.length}
            </div>
          `
          : ""
      }

    </div>
  `;
}


/*
 * Wir machen die einzelnen Kalenderwochen
 * als klickbare Bereiche.
 *
 * Dadurch ist es egal, ob man auf eine Zahl,
 * einen freien Bereich oder einen Trainingspunkt
 * dieser Woche klickt.
 */
function attachMonthWeekNavigation() {
  const grid =
    overviewContent.querySelector(".month-grid");

  if (!grid) {
    return;
  }


  const cells =
    Array.from(
      grid.querySelectorAll(".month-cell")
    );


  /*
   * 7 Tage ergeben jeweils eine Woche.
   */
  for (let i = 0; i < cells.length; i += 7) {

    const weekCells =
      cells.slice(i, i + 7);

    if (!weekCells.length) {
      continue;
    }


    const firstDate =
      parseDate(
        weekCells[0].dataset.date
      );


    const lastDate =
      parseDate(
        weekCells[weekCells.length - 1]
          .dataset.date
      );


    /*
     * Unsichtbarer klickbarer Bereich
     * über der kompletten Woche.
     */
    const weekButton =
      document.createElement("button");

    weekButton.type = "button";

    weekButton.className =
      "month-week-hit-area";

    weekButton.setAttribute(
      "aria-label",
      `Woche vom ${formatShortDate(firstDate)} bis ${formatShortDate(lastDate)} öffnen`
    );


    /*
     * Positionierung relativ zum Kalender.
     */
    const firstRect =
      weekCells[0].getBoundingClientRect();

    const lastRect =
      weekCells[weekCells.length - 1]
        .getBoundingClientRect();

    const gridRect =
      grid.getBoundingClientRect();


    weekButton.style.top =
      `${firstRect.top - gridRect.top}px`;

    weekButton.style.height =
      `${lastRect.bottom - firstRect.top}px`;


    weekButton.addEventListener(
      "click",
      event => {

        event.preventDefault();

        /*
         * Wir nehmen den Montag der angeklickten Woche.
         */
        overviewDate =
          startOfWeek(firstDate);

        overviewPeriod =
          "week";

        renderOverview();

      }
    );


    grid.appendChild(weekButton);
  }
}


/* =========================
   OVERVIEW YEAR
========================= */

function renderOverviewYear() {
  const year =
    overviewDate.getFullYear();

  const yearSessions =
    sessionsForYear(year);

  const completed =
    yearSessions.filter(
      session => session.completed
    ).length;

  const planned =
    yearSessions.length;

  const trainingDays =
    new Set(
      yearSessions.map(
        session => session.date
      )
    ).size;


  let html = `
    <div class="year-overview">

      <div class="year-summary">

        <div class="year-stat">
          <strong>${planned}</strong>
          <span>Einheiten</span>
        </div>

        <div class="year-stat">
          <strong>${completed}</strong>
          <span>Erledigt</span>
        </div>

        <div class="year-stat">
          <strong>${trainingDays}</strong>
          <span>Trainingstage</span>
        </div>

      </div>


      <div class="year-months">
  `;


  for (let month = 0; month < 12; month++) {

    html += renderYearMonth(
      year,
      month
    );

  }


  html += `
      </div>

    </div>
  `;


  overviewContent.innerHTML = html;

  /*
   * Monate klickbar machen
   */
  attachYearMonthNavigation();
}


function renderYearMonth(year, month) {
  const firstDay =
    new Date(
      year,
      month,
      1,
      12
    );

  const daysInMonth =
    new Date(
      year,
      month + 1,
      0,
      12
    ).getDate();

  const mondayOffset =
    firstDay.getDay() === 0
      ? 6
      : firstDay.getDay() - 1;


  const monthSessions =
    sessions.filter(session => {

      const date =
        parseDate(session.date);

      return (
        date.getFullYear() === year &&
        date.getMonth() === month
      );

    });


  let html = `
    <button
      type="button"
      class="year-month"
      data-year="${year}"
      data-month="${month}"
    >

      <div class="year-month-head">

        <span class="year-month-name">
          ${
            new Intl.DateTimeFormat("de-DE", {
              month: "long"
            }).format(firstDay)
          }
        </span>

        <span class="year-month-count">
          ${monthSessions.length}
          ${
            monthSessions.length === 1
              ? "Einheit"
              : "Einheiten"
          }
        </span>

      </div>


      <div class="year-month-grid">

        <div class="year-weekday">M</div>
        <div class="year-weekday">D</div>
        <div class="year-weekday">M</div>
        <div class="year-weekday">D</div>
        <div class="year-weekday">F</div>
        <div class="year-weekday">S</div>
        <div class="year-weekday">S</div>
  `;


  for (let i = 0; i < mondayOffset; i++) {

    html += `
      <div></div>
    `;

  }


  for (let day = 1; day <= daysInMonth; day++) {

    const date =
      new Date(
        year,
        month,
        day,
        12
      );

    const dateString =
      iso(date);

    const daySessions =
      sessionsForDate(dateString);

    const hasTraining =
      daySessions.length > 0;

    const allCompleted =
      hasTraining &&
      daySessions.every(
        session => session.completed
      );


    html += `
      <div
        class="year-day ${
          hasTraining
            ? "has-training"
            : ""
        } ${
          allCompleted
            ? "completed"
            : ""
        } ${
          isToday(date)
            ? "today"
            : ""
        }"
      ></div>
    `;
  }


  html += `
      </div>
    </button>
  `;


  return html;
}


function attachYearMonthNavigation() {
  overviewContent
    .querySelectorAll(".year-month")
    .forEach(monthButton => {

      monthButton.addEventListener(
        "click",
        () => {

          const year =
            Number(
              monthButton.dataset.year
            );

          const month =
            Number(
              monthButton.dataset.month
            );

          overviewDate =
            new Date(
              year,
              month,
              1,
              12
            );

          overviewPeriod =
            "month";

          renderOverview();

        }
      );

    });
}


/* =========================
   TODAY VIEW
========================= */

function renderToday() {
  const today =
    new Date();

  todayTitle.textContent =
    formatLongDate(today);

  const todaySessions =
    sessionsForDate(
      iso(today)
    );


  if (!todaySessions.length) {

    todayContent.innerHTML = `
      <div class="today-empty">

        <strong>
          Heute steht nichts im Plan.
        </strong>

        <p>
          Du kannst den Tag frei lassen
          oder eine neue Einheit hinzufügen.
        </p>

        <button
          class="primary"
          id="todayAddBtn"
        >
          + Training hinzufügen
        </button>

      </div>
    `;

    document
      .getElementById("todayAddBtn")
      .addEventListener(
        "click",
        () => openNewDialog(today)
      );

    return;
  }


  todayContent.innerHTML = `
    <div class="today-session-list">
      ${todaySessions.map(renderSessionCard).join("")}
    </div>
  `;

  attachSessionEvents(todayContent);
}


/* =========================
   VIEW SWITCHING
========================= */

function setView(view) {
  currentView = view;

  planView.classList.toggle(
    "hidden",
    view !== "plan"
  );

  overviewView.classList.toggle(
    "hidden",
    view !== "overview"
  );

  todayView.classList.toggle(
    "hidden",
    view !== "today"
  );


  document
    .querySelectorAll(".nav-item")
    .forEach(button => {

      button.classList.toggle(
        "active",
        button.dataset.view === view
      );

    });


  if (view === "plan") {
    renderPlan();
  }

  if (view === "overview") {
    renderOverview();
  }

  if (view === "today") {
    renderToday();
  }
}


/* =========================
   DIALOG
========================= */

function openNewDialog() {
  editingId = null;

  dialogTitle.textContent =
    "Training hinzufügen";

  trainingForm.reset();

  sportInput.value = "running";

  durationInput.value = 45;

  intensityInput.value = 3;

  updateTitlePlaceholder();

  trainingDialog.showModal();

  setTimeout(() => {
    titleInput.focus();
  }, 50);
}


function openEditDialog(session) {
  editingId = session.id;

  dialogTitle.textContent =
    "Training bearbeiten";

  sportInput.value =
    session.sport;

  titleInput.value =
    session.title;

  durationInput.value =
    session.duration;

  intensityInput.value =
    session.intensity;

  notesInput.value =
    session.notes || "";

  updateTitlePlaceholder();

  trainingDialog.showModal();

  setTimeout(() => {
    titleInput.focus();
  }, 50);
}


function closeDialog() {
  trainingDialog.close();

  editingId = null;
}


function updateTitlePlaceholder() {
  const meta =
    sportMeta[sportInput.value] ||
    sportMeta.running;

  titleInput.placeholder =
    meta.placeholder;
}


/* =========================
   FORM
========================= */

trainingForm.addEventListener(
  "submit",
  event => {

    event.preventDefault();

    const sport =
      sportInput.value;

    const title =
      titleInput.value.trim();

    const duration =
      Number(durationInput.value);

    const intensity =
      Number(intensityInput.value);

    const notes =
      notesInput.value.trim();


    if (!title) {
      return;
    }

    if (!duration || duration < 1) {
      return;
    }


    if (editingId) {

      const session =
        sessions.find(
          item => item.id === editingId
        );

      if (session) {

        session.sport =
          sport;

        session.title =
          title;

        session.duration =
          duration;

        session.intensity =
          intensity;

        session.notes =
          notes;

      }

    } else {

      sessions.push({
        id:
          `${Date.now()}-${Math.random()
            .toString(16)
            .slice(2)}`,

        date:
          iso(selected),

        sport,
        title,
        duration,
        intensity,
        notes,

        completed: false,

        actualIntensity: null,

        postNotes: "",

        createdAt:
          Date.now()
      });

    }


    save();

    closeDialog();

    renderAll();
  }
);


sportInput.addEventListener(
  "change",
  updateTitlePlaceholder
);


closeDialogBtn.addEventListener(
  "click",
  closeDialog
);


trainingDialog.addEventListener(
  "click",
  event => {

    if (event.target === trainingDialog) {
      closeDialog();
    }

  }
);


/* =========================
   NAVIGATION
========================= */

document
  .querySelectorAll(".nav-item")
  .forEach(button => {

    button.addEventListener(
      "click",
      () => {

        setView(
          button.dataset.view
        );

      }
    );

  });


/* =========================
   OVERVIEW PERIOD BUTTONS
========================= */

document
  .querySelectorAll(".period-btn")
  .forEach(button => {

    button.addEventListener(
      "click",
      () => {

        overviewPeriod =
          button.dataset.period;

        renderOverview();

      }
    );

  });


/* =========================
   OVERVIEW PERIOD NAVIGATION
========================= */

periodPrevBtn.addEventListener(
  "click",
  () => {

    if (overviewPeriod === "week") {

      overviewDate =
        addDays(
          overviewDate,
          -7
        );

    }

    if (overviewPeriod === "month") {

      overviewDate =
        addMonths(
          overviewDate,
          -1
        );

    }

    if (overviewPeriod === "year") {

      overviewDate =
        addYears(
          overviewDate,
          -1
        );

    }

    renderOverview();
  }
);


periodNextBtn.addEventListener(
  "click",
  () => {

    if (overviewPeriod === "week") {

      overviewDate =
        addDays(
          overviewDate,
          7
        );

    }

    if (overviewPeriod === "month") {

      overviewDate =
        addMonths(
          overviewDate,
          1
        );

    }

    if (overviewPeriod === "year") {

      overviewDate =
        addYears(
          overviewDate,
          1
        );

    }

    renderOverview();
  }
);


periodTodayBtn.addEventListener(
  "click",
  () => {

    overviewDate =
      new Date();

    overviewDate.setHours(
      12,
      0,
      0,
      0
    );

    renderOverview();

  }
);


/* =========================
   ADD TRAINING
========================= */

addTrainingBtn.addEventListener(
  "click",
  () => {

    openNewDialog();

  }
);


/* =========================
   GLOBAL RENDER
========================= */

function renderAll() {
  renderPlan();

  if (currentView === "overview") {
    renderOverview();
  }

  if (currentView === "today") {
    renderToday();
  }
}


/* =========================
   PWA
========================= */

if ("serviceWorker" in navigator) {

  window.addEventListener(
    "load",
    () => {

      navigator.serviceWorker
        .register("sw.js")
        .catch(error => {
          console.error(
            "Service worker registration failed:",
            error
          );
        });

    }
  );

}


/* =========================
   INITIAL RENDER
========================= */

renderPlan();

setView("plan");