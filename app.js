const KEY = "hype_sessions_v1";

const sportMeta = {
  running: {
    icon: "🏃",
    label: "Laufen",
    color: "#d7ff3f"
  },
  cycling: {
    icon: "⚡",
    label: "Rad",
    color: "#d7ff3f"
  },
  strength: {
    icon: "🏋️",
    label: "Kraft",
    color: "#d7ff3f"
  }
};

const defaultPlan = {
  monday: [],
  tuesday: [],
  wednesday: [],
  thursday: [],
  friday: [],
  saturday: [],
  sunday: []
};

let sessions = loadSessions();
let currentWeekOffset = 0;
let currentOverviewPeriod = "week";
let currentOverviewDate = new Date();
let currentView = "plan";
let selectedDayKey = getDayKey(new Date());
let editingSessionId = null;
let shareWeekStart = startOfWeek(new Date());
let profileDisplayName = "Deine";

const appContent = document.getElementById("appContent");
const bottomNav = document.getElementById("bottomNav");
const planView = document.getElementById("planView");
const overviewView = document.getElementById("overviewView");
const profileView = document.getElementById("profileView");

const weekTitle = document.getElementById("weekTitle");
const weekRange = document.getElementById("weekRange");
const weekStrip = document.getElementById("weekStrip");
const trainingList = document.getElementById("trainingList");
const addTrainingBtn = document.getElementById("addTrainingBtn");
const sessionDialog = document.getElementById("sessionDialog");
const sessionForm = document.getElementById("sessionForm");
const sessionTitleInput = document.getElementById("sessionTitle");
const sessionSportInput = document.getElementById("sessionSport");
const sessionDateInput = document.getElementById("sessionDate");
const sessionDurationInput = document.getElementById("sessionDuration");
const sessionNotesInput = document.getElementById("sessionNotes");
const closeSessionDialogBtn = document.getElementById("closeSessionDialogBtn");
const cancelSessionBtn = document.getElementById("cancelSessionBtn");

const profileGreeting = document.getElementById("profileGreeting");
const profileName = document.getElementById("profileName");
const profileEmail = document.getElementById("profileEmail");
const editProfileBtn = document.getElementById("editProfileBtn");
const profileDialog = document.getElementById("profileDialog");
const profileForm = document.getElementById("profileForm");
const profileFirstNameInput = document.getElementById("profileFirstNameInput");
const profileEmailEdit = document.getElementById("profileEmailEdit");
const closeProfileDialogBtn = document.getElementById("closeProfileDialogBtn");

const weeklyShareName = document.getElementById("weeklyShareName");
const weeklyShareRange = document.getElementById("weeklyShareRange");
const weeklyShareDays = document.getElementById("weeklyShareDays");
const weeklyShareSummary = document.getElementById("weeklyShareSummary");
const weeklyShareCard = document.getElementById("weeklyShareCard");
const weeklyShareFooter = document.getElementById("weeklyShareFooter");
const shareWeekTitle = document.getElementById("shareWeekTitle");
const shareWeekPrevBtn = document.getElementById("shareWeekPrevBtn");
const shareWeekNextBtn = document.getElementById("shareWeekNextBtn");
const shareWeekCurrentBtn = document.getElementById("shareWeekCurrentBtn");
const shareWeekBtn = document.getElementById("shareWeekBtn");
const shareHypeProfileBtn = document.getElementById("shareHypeProfileBtn");
const logoutBtn = document.getElementById("logoutBtn");

const overviewPeriodButtons = document.querySelectorAll(
  "[data-overview-period]"
);

const navButtons = document.querySelectorAll(
  "[data-view]"
);

function loadSessions() {
  try {
    const stored = localStorage.getItem(KEY);

    if (!stored) {
      return [];
    }

    const parsed = JSON.parse(stored);

    return Array.isArray(parsed)
      ? parsed
      : [];
  } catch (error) {
    console.warn("HYPE sessions could not be loaded:", error);
    return [];
  }
}

function saveSessions() {
  try {
    localStorage.setItem(
      KEY,
      JSON.stringify(sessions)
    );
  } catch (error) {
    console.warn("HYPE sessions could not be saved:", error);
  }
}

function generateId() {
  return (
    Date.now().toString(36) +
    Math.random().toString(36).slice(2)
  );
}

function pad(number) {
  return String(number).padStart(2, "0");
}

function dateToInputValue(date) {
  return [
    date.getFullYear(),
    pad(date.getMonth() + 1),
    pad(date.getDate())
  ].join("-");
}

function parseInputDate(value) {
  if (!value) {
    return null;
  }

  const parts = value.split("-");

  if (parts.length !== 3) {
    return null;
  }

  return new Date(
    Number(parts[0]),
    Number(parts[1]) - 1,
    Number(parts[2])
  );
}

function isSameDay(a, b) {
  if (!a || !b) {
    return false;
  }

  return (
    a.getFullYear() === b.getFullYear() &&
    a.getMonth() === b.getMonth() &&
    a.getDate() === b.getDate()
  );
}

function startOfWeek(date) {
  const result = new Date(date);

  result.setHours(
    0,
    0,
    0,
    0
  );

  const day = result.getDay();

  const diff =
    day === 0
      ? -6
      : 1 - day;

  result.setDate(
    result.getDate() + diff
  );

  return result;
}

function endOfWeek(date) {
  const result =
    startOfWeek(date);

  result.setDate(
    result.getDate() + 6
  );

  result.setHours(
    23,
    59,
    59,
    999
  );

  return result;
}

function addDays(date, amount) {
  const result =
    new Date(date);

  result.setDate(
    result.getDate() + amount
  );

  return result;
}

function addMonths(date, amount) {
  const result =
    new Date(date);

  result.setMonth(
    result.getMonth() + amount
  );

  return result;
}

function addYears(date, amount) {
  const result =
    new Date(date);

  result.setFullYear(
    result.getFullYear() + amount
  );

  return result;
}

function getDayKey(date) {
  const keys = [
    "sunday",
    "monday",
    "tuesday",
    "wednesday",
    "thursday",
    "friday",
    "saturday"
  ];

  return keys[date.getDay()];
}

function getGermanDayName(date) {
  const names = [
    "Sonntag",
    "Montag",
    "Dienstag",
    "Mittwoch",
    "Donnerstag",
    "Freitag",
    "Samstag"
  ];

  return names[date.getDay()];
}

function getShortDayName(date) {
  const names = [
    "So",
    "Mo",
    "Di",
    "Mi",
    "Do",
    "Fr",
    "Sa"
  ];

  return names[date.getDay()];
}

function getMonthName(date) {
  return date.toLocaleDateString(
    "de-DE",
    {
      month: "long"
    }
  );
}

function formatDate(date) {
  return date.toLocaleDateString(
    "de-DE",
    {
      day: "2-digit",
      month: "2-digit",
      year: "numeric"
    }
  );
}

function formatShortDate(date) {
  return date.toLocaleDateString(
    "de-DE",
    {
      day: "2-digit",
      month: "2-digit"
    }
  );
}

function formatMonthYear(date) {
  return date.toLocaleDateString(
    "de-DE",
    {
      month: "long",
      year: "numeric"
    }
  );
}

function getWeekNumber(date) {
  const target =
    new Date(
      Date.UTC(
        date.getFullYear(),
        date.getMonth(),
        date.getDate()
      )
    );

  const dayNr =
    target.getUTCDay() || 7;

  target.setUTCDate(
    target.getUTCDate() +
      4 -
      dayNr
  );

  const yearStart =
    new Date(
      Date.UTC(
        target.getUTCFullYear(),
        0,
        1
      )
    );

  return Math.ceil(
    (
      (
        target -
        yearStart
      ) /
        86400000 +
      1
    ) /
      7
  );
}

function formatWeekLabel(start) {
  const end =
    endOfWeek(start);

  return `KW ${getWeekNumber(
    start
  )} · ${formatShortDate(
    start
  )}–${formatShortDate(
    end
  )}`;
}

function getSessionsForWeek(start) {
  const weekStart =
    startOfWeek(start);

  const weekEnd =
    endOfWeek(start);

  return sessions
    .filter(session => {
      const date =
        parseInputDate(
          session.date
        );

      return (
        date &&
        date >= weekStart &&
        date <= weekEnd
      );
    })
    .sort(
      (a, b) =>
        parseInputDate(a.date) -
        parseInputDate(b.date)
    );
}

function getSessionsForDate(date) {
  const value =
    dateToInputValue(date);

  return sessions
    .filter(
      session =>
        session.date === value
    )
    .sort(
      (a, b) =>
        (a.createdAt || 0) -
        (b.createdAt || 0)
    );
}

function getSessionsForMonth(date) {
  return sessions.filter(session => {
    const sessionDate =
      parseInputDate(
        session.date
      );

    return (
      sessionDate &&
      sessionDate.getFullYear() ===
        date.getFullYear() &&
      sessionDate.getMonth() ===
        date.getMonth()
    );
  });
}

function getSessionsForYear(date) {
  return sessions.filter(session => {
    const sessionDate =
      parseInputDate(
        session.date
      );

    return (
      sessionDate &&
      sessionDate.getFullYear() ===
        date.getFullYear()
    );
  });
}

function getSessionStatus(session) {
  return (
    session.status ||
    "planned"
  );
}

function getStatusLabel(status) {
  const labels = {
    planned: "Geplant",
    completed: "Erledigt",
    modified: "Geändert",
    skipped: "Übersprungen"
  };

  return (
    labels[status] ||
    "Geplant"
  );
}

function getSportMeta(sport) {
  return (
    sportMeta[sport] ||
    sportMeta.running
  );
}

function getSessionIcon(session) {
  return getSportMeta(
    session.sport
  ).icon;
}

function getSessionTitle(session) {
  return (
    session.title ||
    getSportMeta(
      session.sport
    ).label
  );
}

function getSessionDurationLabel(session) {
  if (!session.duration) {
    return "";
  }

  return `${session.duration} min`;
}

function getSessionSummary(session) {
  const parts = [];

  const duration =
    getSessionDurationLabel(
      session
    );

  if (duration) {
    parts.push(duration);
  }

  if (session.notes) {
    parts.push(
      session.notes
    );
  }

  return parts.join(" · ");
}

function getStatusClass(status) {
  return `status-${status || "planned"}`;
}

function escapeHtml(value) {
  return String(
    value ?? ""
  )
    .replaceAll("&", "&amp;")
    .replaceAll("<", "&lt;")
    .replaceAll(">", "&gt;")
    .replaceAll('"', "&quot;")
    .replaceAll("'", "&#039;");
}

function cleanupProfileHeadings() {
  if (!profileView) {
    return;
  }

  profileView
    .querySelectorAll("*")
    .forEach(element => {
      const text =
        element.textContent
          ?.trim();

      if (
        text === "DEIN HYPE" ||
        text === "HYPE"
      ) {
        if (
          element.children.length ===
          0
        ) {
          element.remove();
        }
      }
    });
}

function applyFinalFourChanges() {
  if (!profileView) {
    return;
  }

  profileView
    .querySelectorAll("*")
    .forEach(element => {
      const text =
        element.textContent
          ?.trim();

      if (
        text === "DEIN HYPE" ||
        text === "HYPE"
      ) {
        if (
          element.children.length ===
          0
        ) {
          element.remove();
        }
      }
    });

  const recommendation =
    Array.from(
      profileView.querySelectorAll(
        "*"
      )
    ).find(
      element =>
        element.textContent
          ?.trim() ===
        "Trainiert jemand genauso gerne wie du?"
    );

  if (recommendation) {
    recommendation.style.whiteSpace =
      "nowrap";
  }
}

function renderWeekHeader() {
  if (!weekTitle) {
    return;
  }

  const base =
    startOfWeek(
      new Date()
    );

  const start =
    addDays(
      base,
      currentWeekOffset * 7
    );

  const end =
    endOfWeek(start);

  weekTitle.textContent =
    currentWeekOffset === 0
      ? "Diese Woche"
      : `KW ${getWeekNumber(
          start
        )}`;

  if (weekRange) {
    weekRange.textContent =
      `${formatShortDate(
        start
      )} – ${formatShortDate(
        end
      )}`;
  }
}

function renderWeekStrip() {
  if (!weekStrip) {
    return;
  }

  const base =
    startOfWeek(
      new Date()
    );

  const start =
    addDays(
      base,
      currentWeekOffset * 7
    );

  weekStrip.innerHTML = "";

  for (
    let index = 0;
    index < 7;
    index += 1
  ) {
    const date =
      addDays(
        start,
        index
      );

    const dayKey =
      getDayKey(date);

    const daySessions =
      getSessionsForDate(
        date
      );

    const button =
      document.createElement(
        "button"
      );

    button.type =
      "button";

    button.className =
      "week-day";

    if (
      isSameDay(
        date,
        new Date()
      )
    ) {
      button.classList.add(
        "today"
      );
    }

    if (
      dayKey ===
      selectedDayKey
    ) {
      button.classList.add(
        "active"
      );
    }

    button.innerHTML = `
      <span class="week-day-name">
        ${getShortDayName(
          date
        )}
      </span>

      <span class="week-day-number">
        ${date.getDate()}
      </span>

      <span class="week-day-dots">
        ${daySessions
          .slice(0, 3)
          .map(
            session =>
              `<i>${escapeHtml(
                getSessionIcon(
                  session
                )
              )}</i>`
          )
          .join("")}
      </span>
    `;

    button.addEventListener(
      "click",
      () => {
        selectedDayKey =
          dayKey;

        renderWeekStrip();
        renderTrainingList();
      }
    );

    weekStrip.appendChild(
      button
    );
  }
}

function renderTrainingList() {
  if (!trainingList) {
    return;
  }

  const base =
    startOfWeek(
      new Date()
    );

  const weekStart =
    addDays(
      base,
      currentWeekOffset * 7
    );

  const selectedDate =
    addDays(
      weekStart,
      [
        "monday",
        "tuesday",
        "wednesday",
        "thursday",
        "friday",
        "saturday",
        "sunday"
      ].indexOf(
        selectedDayKey
      )
    );

  const daySessions =
    getSessionsForDate(
      selectedDate
    );

  trainingList.innerHTML = "";

  if (
    daySessions.length ===
    0
  ) {
    trainingList.innerHTML = `
      <div class="empty-state">
        <div class="empty-state-icon">
          ${isSameDay(
            selectedDate,
            new Date()
          ) ? "⚡" : "＋"}
        </div>

        <strong>
          Keine Einheiten geplant
        </strong>

        <span>
          Füge für diesen Tag dein Training hinzu.
        </span>
      </div>
    `;

    return;
  }

  daySessions.forEach(
    session => {
      const card =
        document.createElement(
          "article"
        );

      card.className =
        "training-card";

      const meta =
        getSportMeta(
          session.sport
        );

      const status =
        getSessionStatus(
          session
        );

      card.innerHTML = `
        <div class="training-card-main">

          <div class="training-card-icon">
            ${escapeHtml(
              meta.icon
            )}
          </div>

          <div class="training-card-content">

            <div class="training-card-topline">

              <span class="training-card-sport">
                ${escapeHtml(
                  meta.label
                )}
              </span>

              <span class="training-card-status ${getStatusClass(
                status
              )}">
                ${escapeHtml(
                  getStatusLabel(
                    status
                  )
                )}
              </span>

            </div>

            <h3>
              ${escapeHtml(
                getSessionTitle(
                  session
                )
              )}
            </h3>

            <p>
              ${escapeHtml(
                getSessionSummary(
                  session
                )
              )}
            </p>

          </div>

        </div>

        <div class="training-card-actions">

          <button
            type="button"
            class="training-action"
            data-action="complete"
          >
            ✓
          </button>

          <button
            type="button"
            class="training-action"
            data-action="edit"
          >
            ✎
          </button>

          <button
            type="button"
            class="training-action danger"
            data-action="delete"
          >
            ×
          </button>

        </div>
      `;

      card
        .querySelectorAll(
          "[data-action]"
        )
        .forEach(
          button => {
            button.addEventListener(
              "click",
              event => {
                event.stopPropagation();

                const action =
                  button.dataset.action;

                if (
                  action ===
                  "complete"
                ) {
                  toggleSessionCompleted(
                    session.id
                  );
                }

                if (
                  action ===
                  "edit"
                ) {
                  openSessionDialog(
                    session
                  );
                }

                if (
                  action ===
                  "delete"
                ) {
                  deleteSession(
                    session.id
                  );
                }
              }
            );
          }
        );

      card.addEventListener(
        "click",
        () => {
          openSessionDialog(
            session
          );
        }
      );

      trainingList.appendChild(
        card
      );
    }
  );
}

function renderPlan() {
  renderWeekHeader();
  renderWeekStrip();
  renderTrainingList();
}

function openSessionDialog(
  session = null,
  date = null
) {
  if (!sessionDialog) {
    return;
  }

  editingSessionId =
    session?.id ||
    null;

  if (sessionTitleInput) {
    sessionTitleInput.value =
      session?.title ||
      "";
  }

  if (sessionSportInput) {
    sessionSportInput.value =
      session?.sport ||
      "running";
  }

  if (sessionDateInput) {
    sessionDateInput.value =
      session?.date ||
      dateToInputValue(
        date ||
          new Date()
      );
  }

  if (sessionDurationInput) {
    sessionDurationInput.value =
      session?.duration ||
      "";
  }

  if (sessionNotesInput) {
    sessionNotesInput.value =
      session?.notes ||
      "";
  }

  const title =
    sessionDialog.querySelector(
      "[data-dialog-title]"
    );

  if (title) {
    title.textContent =
      session
        ? "Training bearbeiten"
        : "Training hinzufügen";
  }

  sessionDialog.showModal?.();

  if (
    !sessionDialog.open
  ) {
    sessionDialog.classList.add(
      "open"
    );
  }
}

function closeSessionDialog() {
  if (!sessionDialog) {
    return;
  }

  if (
    typeof sessionDialog.close ===
    "function"
  ) {
    sessionDialog.close();
  }

  sessionDialog.classList.remove(
    "open"
  );

  editingSessionId =
    null;
}

function createOrUpdateSession() {
  const date =
    sessionDateInput?.value;

  const sport =
    sessionSportInput?.value ||
    "running";

  const title =
    sessionTitleInput?.value.trim() ||
    getSportMeta(
      sport
    ).label;

  const duration =
    Number(
      sessionDurationInput?.value
    ) || 0;

  const notes =
    sessionNotesInput?.value.trim() ||
    "";

  if (!date) {
    return;
  }

  if (
    editingSessionId
  ) {
    const session =
      sessions.find(
        item =>
          item.id ===
          editingSessionId
      );

    if (session) {
      session.title =
        title;

      session.sport =
        sport;

      session.date =
        date;

      session.duration =
        duration;

      session.notes =
        notes;

      session.updatedAt =
        Date.now();
    }
  } else {
    sessions.push({
      id:
        generateId(),

      title,

      sport,

      date,

      duration,

      notes,

      status:
        "planned",

      createdAt:
        Date.now()
    });
  }

  saveSessions();

  closeSessionDialog();

  const parsedDate =
    parseInputDate(
      date
    );

  if (parsedDate) {
    currentWeekOffset =
      Math.round(
        (
          startOfWeek(
            parsedDate
          ) -
          startOfWeek(
            new Date()
          )
        ) /
          (
            7 *
            24 *
            60 *
            60 *
            1000
          )
      );

    selectedDayKey =
      getDayKey(
        parsedDate
      );
  }

  renderAll();
}

function toggleSessionCompleted(
  id
) {
  const session =
    sessions.find(
      item =>
        item.id === id
    );

  if (!session) {
    return;
  }

  const current =
    getSessionStatus(
      session
    );

  session.status =
    current === "completed"
      ? "planned"
      : "completed";

  session.updatedAt =
    Date.now();

  saveSessions();

  renderAll();
}

function deleteSession(id) {
  const session =
    sessions.find(
      item =>
        item.id === id
    );

  if (!session) {
    return;
  }

  const confirmed =
    window.confirm(
      `Training "${getSessionTitle(
        session
      )}" wirklich löschen?`
    );

  if (!confirmed) {
    return;
  }

  sessions =
    sessions.filter(
      item =>
        item.id !== id
    );

  saveSessions();

  renderAll();
}

function renderOverview() {
  if (!overviewView) {
    return;
  }

  renderOverviewPeriodButtons();

  if (
    currentOverviewPeriod ===
    "week"
  ) {
    renderOverviewWeek();
  }

  if (
    currentOverviewPeriod ===
    "month"
  ) {
    renderOverviewMonth();
  }

  if (
    currentOverviewPeriod ===
    "year"
  ) {
    renderOverviewYear();
  }
}

function renderOverviewPeriodButtons() {
  overviewPeriodButtons.forEach(
    button => {
      button.classList.toggle(
        "active",
        button.dataset.overviewPeriod ===
          currentOverviewPeriod
      );
    }
  );
}

function renderOverviewWeek() {
  const start =
    startOfWeek(
      currentOverviewDate
    );

  const weekSessions =
    getSessionsForWeek(
      start
    );

  const completed =
    weekSessions.filter(
      session =>
        getSessionStatus(
          session
        ) ===
        "completed"
    ).length;

  const planned =
    weekSessions.length;

  overviewView.innerHTML = `
    <div class="overview-content">

      <div class="overview-period-title">
        ${formatWeekLabel(
          start
        )}
      </div>

      <div class="overview-summary-grid">

        <div class="overview-summary-card">
          <strong>
            ${planned}
          </strong>
          <span>
            Geplant
          </span>
        </div>

        <div class="overview-summary-card">
          <strong>
            ${completed}
          </strong>
          <span>
            Erledigt
          </span>
        </div>

      </div>

      <div class="overview-week-list">

        ${weekSessions.length
          ? weekSessions
              .map(
                session => `
                  <div class="overview-session">
                    <span>
                      ${escapeHtml(
                        getSessionIcon(
                          session
                        )
                      )}
                    </span>

                    <div>
                      <strong>
                        ${escapeHtml(
                          getSessionTitle(
                            session
                          )
                        )}
                      </strong>

                      <small>
                        ${escapeHtml(
                          getGermanDayName(
                            parseInputDate(
                              session.date
                            )
                          )
                        )}
                        ·
                        ${escapeHtml(
                          getSessionSummary(
                            session
                          )
                        )}
                      </small>
                    </div>
                  </div>
                `
              )
              .join("")
          : `
              <div class="empty-state">
                Keine Trainings in dieser Woche.
              </div>
            `}

      </div>

    </div>
  `;
}

function renderOverviewMonth() {
  const monthSessions =
    getSessionsForMonth(
      currentOverviewDate
    );

  const completed =
    monthSessions.filter(
      session =>
        getSessionStatus(
          session
        ) ===
        "completed"
    ).length;

  overviewView.innerHTML = `
    <div class="overview-content">

      <div class="overview-period-title">
        ${formatMonthYear(
          currentOverviewDate
        )}
      </div>

      <div class="overview-summary-grid">

        <div class="overview-summary-card">
          <strong>
            ${monthSessions.length}
          </strong>
          <span>
            Einheiten
          </span>
        </div>

        <div class="overview-summary-card">
          <strong>
            ${completed}
          </strong>
          <span>
            Erledigt
          </span>
        </div>

      </div>

      <div class="month-overview-grid">

        ${Array.from(
          {
            length: 12
          },
          (_, index) => {
            const month =
              new Date(
                currentOverviewDate.getFullYear(),
                index,
                1
              );

            const count =
              getSessionsForMonth(
                month
              ).length;

            return `
              <button
                type="button"
                class="month-overview-card"
                data-month="${index}"
              >

                <strong>
                  ${getMonthName(
                    month
                  )}
                </strong>

                <span>
                  ${count}
                  ${
                    count === 1
                      ? "Einheit"
                      : "Einheiten"
                  }
                </span>

              </button>
            `;
          }
        ).join("")}

      </div>

    </div>
  `;

  overviewView
    .querySelectorAll(
      "[data-month]"
    )
    .forEach(
      button => {
        button.addEventListener(
          "click",
          () => {
            currentOverviewDate =
              new Date(
                currentOverviewDate.getFullYear(),
                Number(
                  button.dataset.month
                ),
                1
              );

            currentOverviewPeriod =
              "month";

            renderOverview();
          }
        );
      }
    );
}

function renderOverviewYear() {
  const yearSessions =
    getSessionsForYear(
      currentOverviewDate
    );

  const completed =
    yearSessions.filter(
      session =>
        getSessionStatus(
          session
        ) ===
        "completed"
    ).length;

  overviewView.innerHTML = `
    <div class="overview-content">

      <div class="overview-period-title">
        ${currentOverviewDate.getFullYear()}
      </div>

      <div class="overview-summary-grid">

        <div class="overview-summary-card">
          <strong>
            ${yearSessions.length}
          </strong>
          <span>
            Einheiten
          </span>
        </div>

        <div class="overview-summary-card">
          <strong>
            ${completed}
          </strong>
          <span>
            Erledigt
          </span>
        </div>

      </div>

      <div class="year-overview-grid">

        ${Array.from(
          {
            length: 12
          },
          (_, index) => {
            const month =
              new Date(
                currentOverviewDate.getFullYear(),
                index,
                1
              );

            const count =
              getSessionsForMonth(
                month
              ).length;

            return `
              <button
                type="button"
                class="year-month-card"
                data-month="${index}"
              >

                <strong>
                  ${getMonthName(
                    month
                  )}
                </strong>

                <span>
                  ${count}
                  ${
                    count === 1
                      ? "Einheit"
                      : "Einheiten"
                  }
                </span>

              </button>
            `;
          }
        ).join("")}

      </div>

    </div>
  `;

  overviewView
    .querySelectorAll(
      "[data-month]"
    )
    .forEach(
      button => {
        button.addEventListener(
          "click",
          () => {
            currentOverviewDate =
              new Date(
                currentOverviewDate.getFullYear(),
                Number(
                  button.dataset.month
                ),
                1
              );

            currentOverviewPeriod =
              "month";

            renderOverview();
          }
        );
      }
    );
}

/* PROFILE AVATAR */

function ensureProfileAvatarStyles() {
  if (
    document.getElementById(
      "hypeProfileAvatarStyles"
    )
  ) {
    return;
  }

  const style =
    document.createElement(
      "style"
    );

  style.id =
    "hypeProfileAvatarStyles";

  style.textContent = `
    #profileView .hype-profile-avatar-wrap {
      display:flex;
      flex-direction:column;
      align-items:center;
      justify-content:center;
      gap:9px;
      width:100%;
      margin:0 0 24px;
    }

    #profileView .hype-profile-avatar-button {
      position:relative;
      display:flex;
      align-items:center;
      justify-content:center;
      width:104px;
      height:104px;
      padding:0;
      border:2px solid #d7ff3f;
      border-radius:50%;
      background:#111419;
      overflow:hidden;
      cursor:pointer;
      box-shadow:0 0 0 5px rgba(215,255,63,.06);
    }

    #profileView .hype-profile-avatar-fallback {
      display:flex;
      align-items:center;
      justify-content:center;
      width:100%;
      height:100%;
      color:#d7ff3f;
      font-size:34px;
      line-height:1;
      font-weight:900;
    }

    #profileView .hype-profile-avatar-image {
      display:block;
      width:100%;
      height:100%;
      object-fit:cover;
    }

    #profileView .hype-profile-avatar-edit {
      position:absolute;
      right:2px;
      bottom:2px;
      display:flex;
      align-items:center;
      justify-content:center;
      width:30px;
      height:30px;
      border:2px solid #0b0d10;
      border-radius:50%;
      background:#d7ff3f;
      color:#0b0d10;
      font-size:14px;
      font-weight:900;
    }

    #profileView .hype-profile-avatar-label {
      color:#8d949e;
      font-size:11px;
      line-height:1.2;
      font-weight:800;
      text-align:center;
    }

    #profileView .hype-profile-avatar-status {
      min-height:16px;
      color:#d7ff3f;
      font-size:11px;
      line-height:1.3;
      font-weight:800;
      text-align:center;
    }

    #hypeProfileAvatarInput {
      display:none;
    }
  `;

  document.head.appendChild(
    style
  );
}

function getAvatarInitials(user) {
  const firstName =
    user?.user_metadata?.first_name
      ? String(
          user.user_metadata.first_name
        ).trim()
      : "";

  if (firstName) {
    return firstName
      .charAt(0)
      .toUpperCase();
  }

  const email =
    user?.email
      ? String(
          user.email
        ).trim()
      : "";

  if (email) {
    return email
      .charAt(0)
      .toUpperCase();
  }

  return "H";
}

function ensureProfileAvatarUI() {
  if (!profileView) {
    return;
  }

  if (
    document.getElementById(
      "hypeProfileAvatar"
    )
  ) {
    return;
  }

  const accountCard =
    profileView.querySelector(
      ".profile-account-card"
    );

  if (!accountCard) {
    return;
  }

  const wrap =
    document.createElement(
      "div"
    );

  wrap.id =
    "hypeProfileAvatar";

  wrap.className =
    "hype-profile-avatar-wrap";

  wrap.innerHTML = `
    <button
      type="button"
      id="hypeProfileAvatarButton"
      class="hype-profile-avatar-button"
      aria-label="Profilbild ändern"
    >
      <span
        id="hypeProfileAvatarFallback"
        class="hype-profile-avatar-fallback"
      >
        H
      </span>

      <img
        id="hypeProfileAvatarImage"
        class="hype-profile-avatar-image"
        alt="Profilbild"
        hidden
      >

      <span
        class="hype-profile-avatar-edit"
        aria-hidden="true"
      >
        ✎
      </span>
    </button>

    <input
      id="hypeProfileAvatarInput"
      type="file"
      accept="image/jpeg,image/png,image/webp"
    >

    <span
      class="hype-profile-avatar-label"
    >
      Profilbild ändern
    </span>

    <span
      id="hypeProfileAvatarStatus"
      class="hype-profile-avatar-status"
      aria-live="polite"
    ></span>
  `;

  accountCard.prepend(
    wrap
  );

  const button =
    document.getElementById(
      "hypeProfileAvatarButton"
    );

  const input =
    document.getElementById(
      "hypeProfileAvatarInput"
    );

  button?.addEventListener(
    "click",
    () => {
      input.value = "";
      input.click();
    }
  );

  input?.addEventListener(
    "change",
    async event => {
      const file =
        event.target.files?.[0];

      if (!file) {
        return;
      }

      await handleProfileAvatarUpload(
        file
      );

      input.value = "";
    }
  );
}

function renderProfileAvatar(user) {
  ensureProfileAvatarStyles();
  ensureProfileAvatarUI();

  const fallback =
    document.getElementById(
      "hypeProfileAvatarFallback"
    );

  const image =
    document.getElementById(
      "hypeProfileAvatarImage"
    );

  if (
    !fallback ||
    !image
  ) {
    return;
  }

  fallback.textContent =
    getAvatarInitials(
      user
    );

  const avatarUrl =
    user?.user_metadata?.avatar_url
      ? String(
          user.user_metadata.avatar_url
        ).trim()
      : "";

  if (avatarUrl) {
    image.src =
      avatarUrl;

    image.hidden =
      false;

    fallback.hidden =
      true;

    image.onerror =
      () => {
        image.hidden =
          true;

        fallback.hidden =
          false;
      };
  } else {
    image.removeAttribute(
      "src"
    );

    image.hidden =
      true;

    fallback.hidden =
      false;
  }
}

async function handleProfileAvatarUpload(
  file
) {
  const status =
    document.getElementById(
      "hypeProfileAvatarStatus"
    );

  const button =
    document.getElementById(
      "hypeProfileAvatarButton"
    );

  if (
    typeof uploadProfileAvatar !==
    "function"
  ) {
    if (status) {
      status.textContent =
        "Upload-Funktion nicht verfügbar.";
    }

    return;
  }

  if (status) {
    status.textContent =
      "Profilbild wird gespeichert …";
  }

  if (button) {
    button.disabled =
      true;
  }

  try {
    const result =
      await uploadProfileAvatar(
        file
      );

    if (!result?.success) {
      throw new Error(
        result?.error ||
        "Das Profilbild konnte nicht gespeichert werden."
      );
    }

    const user =
      result.user ||
      await getProfileUser();

    renderProfileAvatar(
      user
    );

    if (status) {
      status.textContent =
        "Profilbild gespeichert.";
    }
  } catch (error) {
    console.error(
      "HYPE profile avatar error:",
      error
    );

    if (status) {
      status.textContent =
        error.message ||
        "Profilbild konnte nicht gespeichert werden.";
    }
  } finally {
    if (button) {
      button.disabled =
        false;
    }
  }
}

/* PROFILE */

async function getProfileUser() {
  if (
    typeof supabaseClient ===
    "undefined"
  ) {
    return null;
  }

  try {
    const {
      data,
      error
    } =
      await supabaseClient.auth.getUser();

    if (error) {
      console.error(
        "HYPE profile user error:",
        error
      );

      return null;
    }

    return data?.user ||
      null;
  } catch (error) {
    console.error(
      "HYPE profile error:",
      error
    );

    return null;
  }
}

async function renderProfile() {
  const user =
    await getProfileUser();

  if (!user) {
    return;
  }

  ensureProfileAvatarStyles();
  ensureProfileAvatarUI();
  renderProfileAvatar(
    user
  );

  cleanupProfileHeadings();

  const firstName =
    user?.user_metadata?.first_name
      ? String(
          user.user_metadata.first_name
        ).trim()
      : "";

  profileDisplayName =
    firstName ||
    "Deine";

  if (profileGreeting) {
    profileGreeting.textContent =
      firstName
        ? `Hallo ${firstName} 👋`
        : "Hallo 👋";
  }

  if (profileName) {
    profileName.textContent =
      firstName ||
      "Vorname hinzufügen";
  }

  if (profileEmail) {
    profileEmail.textContent =
      user.email ||
      "";
  }

  if (profileEmailEdit) {
    profileEmailEdit.textContent =
      user.email
        ? `E-Mail: ${user.email}`
        : "";
  }

  if (profileFirstNameInput) {
    profileFirstNameInput.value =
      firstName;
  }

  renderWeeklySharePreview();

  applyFinalFourChanges();
}

/* WEEK NAVIGATION */

function moveWeek(amount) {
  currentWeekOffset +=
    amount;

  renderPlan();
}

function goToCurrentWeek() {
  currentWeekOffset =
    0;

  selectedDayKey =
    getDayKey(
      new Date()
    );

  renderPlan();
}

/* OVERVIEW NAVIGATION */

function moveOverviewPeriod(
  amount
) {
  if (
    currentOverviewPeriod ===
    "week"
  ) {
    currentOverviewDate =
      addDays(
        currentOverviewDate,
        amount * 7
      );
  }

  if (
    currentOverviewPeriod ===
    "month"
  ) {
    currentOverviewDate =
      addMonths(
        currentOverviewDate,
        amount
      );
  }

  if (
    currentOverviewPeriod ===
    "year"
  ) {
    currentOverviewDate =
      addYears(
        currentOverviewDate,
        amount
      );
  }

  renderOverview();
}

/* SHARE WEEK */

function renderWeeklySharePreview() {
  if (!weeklyShareCard) {
    return;
  }

  const weekStart =
    startOfWeek(
      shareWeekStart
    );

  const weekEnd =
    endOfWeek(
      weekStart
    );

  const weekSessions =
    getSessionsForWeek(
      weekStart
    );

  const completed =
    weekSessions.filter(
      session =>
        getSessionStatus(
          session
        ) ===
        "completed"
    );

  const totalMinutes =
    completed.reduce(
      (sum, session) =>
        sum +
        Number(
          session.duration || 0
        ),
      0
    );

  if (shareWeekTitle) {
    shareWeekTitle.textContent =
      `${formatShortDate(
        weekStart
      )} – ${formatShortDate(
        weekEnd
      )}`;
  }

  if (weeklyShareName) {
    weeklyShareName.textContent =
      profileDisplayName;
  }

  if (weeklyShareRange) {
    weeklyShareRange.textContent =
      `${formatShortDate(
        weekStart
      )} – ${formatShortDate(
        weekEnd
      )}`;
  }

  if (weeklyShareDays) {
    weeklyShareDays.innerHTML =
      Array.from(
        {
          length: 7
        },
        (_, index) => {
          const date =
            addDays(
              weekStart,
              index
            );

          const daySessions =
            getSessionsForDate(
              date
            );

          return `
            <div class="weekly-share-day">

              <strong>
                ${getShortDayName(
                  date
                )}
              </strong>

              <span>
                ${date.getDate()}
              </span>

              ${
                daySessions.length
                  ? daySessions
                      .map(
                        session =>
                          `
                            <small>
                              ${escapeHtml(
                                getSessionIcon(
                                  session
                                )
                              )}
                              ${escapeHtml(
                                getSessionTitle(
                                  session
                                )
                              )}
                            </small>
                          `
                      )
                      .join("")
                  : `
                    <small>
                      —
                    </small>
                  `
              }

            </div>
          `;
        }
      ).join("");
  }

  if (weeklyShareSummary) {
    weeklyShareSummary.innerHTML = `
      <strong>
        ${completed.length}
      </strong>

      <span>
        erledigte Trainings ·
        ${totalMinutes} min
      </span>
    `;
  }
}

/* PROFILE DIALOG */

async function openProfileDialog(
  focusInput = false
) {
  if (!profileDialog) {
    return;
  }

  const user =
    await getProfileUser();

  if (
    profileFirstNameInput
  ) {
    profileFirstNameInput.value =
      user?.user_metadata?.first_name ||
      "";
  }

  if (profileEmailEdit) {
    profileEmailEdit.textContent =
      user?.email
        ? `E-Mail: ${user.email}`
        : "";
  }

  profileDialog.showModal?.();

  if (
    !profileDialog.open
  ) {
    profileDialog.classList.add(
      "open"
    );
  }

  if (
    focusInput &&
    profileFirstNameInput
  ) {
    setTimeout(
      () => {
        profileFirstNameInput.focus();
      },
      50
    );
  }
}

function closeProfileDialog() {
  if (!profileDialog) {
    return;
  }

  profileDialog.close?.();

  profileDialog.classList.remove(
    "open"
  );
}

async function saveProfile() {
  const firstName =
    profileFirstNameInput?.value.trim() ||
    "";

  if (
    typeof updateProfileFirstName !==
    "function"
  ) {
    return;
  }

  const result =
    await updateProfileFirstName(
      firstName
    );

  if (!result?.success) {
    alert(
      result?.error ||
      "Profil konnte nicht gespeichert werden."
    );

    return;
  }

  closeProfileDialog();

  renderProfile();
}

/* SHARE */

async function shareHypeProfile() {
  const firstName =
    profileDisplayName ||
    "Deine";

  const text =
    `${firstName}s Woche mit HYPE.`;

  if (
    navigator.share
  ) {
    try {
      await navigator.share({
        title:
          "HYPE",
        text
      });

      return;
    } catch (error) {
      if (
        error?.name ===
        "AbortError"
      ) {
        return;
      }
    }
  }

  try {
    await navigator.clipboard.writeText(
      text
    );

    alert(
      "Text kopiert."
    );
  } catch {
    alert(text);
  }
}

function createWeeklyCalendarExport() {
  const weekStart =
    startOfWeek(
      new Date()
    );

  const weekEnd =
    endOfWeek(
      weekStart
    );

  const weekSessions =
    getSessionsForWeek(
      weekStart
    );

  if (!weekSessions.length) {
    alert(
      "Keine Trainings für diese Woche vorhanden."
    );

    return;
  }

  const events =
    weekSessions.map(
      session => {
        const date =
          parseInputDate(
            session.date
          );

        const nextDay =
          addDays(
            date,
            1
          );

        const uid =
          `${session.id}@hype`;

        return [
          "BEGIN:VEVENT",
          `UID:${uid}`,
          `DTSTAMP:${dateToCalendarDate(
            new Date()
          )}`,
          `DTSTART;VALUE=DATE:${dateToCalendarDate(
            date
          )}`,
          `DTEND;VALUE=DATE:${dateToCalendarDate(
            nextDay
          )}`,
          `SUMMARY:${calendarEscape(
            getSessionTitle(
              session
            )
          )}`,
          `DESCRIPTION:${calendarEscape(
            getSessionSummary(
              session
            )
          )}`,
          "END:VEVENT"
        ].join("\r\n");
      }
    );

  const content =
    [
      "BEGIN:VCALENDAR",
      "VERSION:2.0",
      "PRODID:-//HYPE//Training Planner//DE",
      "CALSCALE:GREGORIAN",
      ...events,
      "END:VCALENDAR"
    ].join("\r\n");

  const blob =
    new Blob(
      [content],
      {
        type:
          "text/calendar;charset=utf-8"
      }
    );

  const url =
    URL.createObjectURL(
      blob
    );

  const link =
    document.createElement(
      "a"
    );

  link.href =
    url;

  link.download =
    `HYPE-${dateToInputValue(
      weekStart
    )}.ics`;

  document.body.appendChild(
    link
  );

  link.click();

  link.remove();

  setTimeout(
    () => {
      URL.revokeObjectURL(
        url
      );
    },
    1000
  );
}

function dateToCalendarDate(
  date
) {
  return [
    date.getFullYear(),
    pad(
      date.getMonth() + 1
    ),
    pad(
      date.getDate()
    )
  ].join("");
}

function calendarEscape(value) {
  return String(
    value ?? ""
  )
    .replaceAll(
      "\\",
      "\\\\"
    )
    .replaceAll(
      ";",
      "\\;"
    )
    .replaceAll(
      ",",
      "\\,"
    )
    .replaceAll(
      "\n",
      "\\n"
    );
}

/* EVENTS */

if (addTrainingBtn) {
  addTrainingBtn.addEventListener(
    "click",
    () => {
      openSessionDialog(
        null,
        addDays(
          startOfWeek(
            new Date()
          ),
          [
            "monday",
            "tuesday",
            "wednesday",
            "thursday",
            "friday",
            "saturday",
            "sunday"
          ].indexOf(
            selectedDayKey
          )
        )
      );
    }
  );
}

if (closeSessionDialogBtn) {
  closeSessionDialogBtn.addEventListener(
    "click",
    closeSessionDialog
  );
}

if (cancelSessionBtn) {
  cancelSessionBtn.addEventListener(
    "click",
    closeSessionDialog
  );
}

if (sessionForm) {
  sessionForm.addEventListener(
    "submit",
    event => {
      event.preventDefault();

      createOrUpdateSession();
    }
  );
}

if (editProfileBtn) {
  editProfileBtn.addEventListener(
    "click",
    () => {
      openProfileDialog(
        true
      );
    }
  );
}

if (closeProfileDialogBtn) {
  closeProfileDialogBtn.addEventListener(
    "click",
    closeProfileDialog
  );
}

if (profileForm) {
  profileForm.addEventListener(
    "submit",
    event => {
      event.preventDefault();

      saveProfile();
    }
  );
}

if (shareWeekPrevBtn) {
  shareWeekPrevBtn.addEventListener(
    "click",
    () => {
      shareWeekStart =
        addDays(
          shareWeekStart,
          -7
        );

      renderWeeklySharePreview();
    }
  );
}

if (shareWeekNextBtn) {
  shareWeekNextBtn.addEventListener(
    "click",
    () => {
      shareWeekStart =
        addDays(
          shareWeekStart,
          7
        );

      renderWeeklySharePreview();
    }
  );
}

if (shareWeekCurrentBtn) {
  shareWeekCurrentBtn.addEventListener(
    "click",
    () => {
      shareWeekStart =
        startOfWeek(
          new Date()
        );

      renderWeeklySharePreview();
    }
  );
}

if (shareHypeProfileBtn) {
  shareHypeProfileBtn.addEventListener(
    "click",
    shareHypeProfile
  );
}

if (shareWeekBtn) {
  shareWeekBtn.addEventListener(
    "click",
    shareHypeProfile
  );
}

if (logoutBtn) {
  logoutBtn.addEventListener(
    "click",
    async () => {
      if (
        typeof logout ===
        "function"
      ) {
        await logout();
      }
    }
  );
}

navButtons.forEach(
  button => {
    button.addEventListener(
      "click",
      () => {
        setView(
          button.dataset.view
        );
      }
    );
  }
);

overviewPeriodButtons.forEach(
  button => {
    button.addEventListener(
      "click",
      () => {
        currentOverviewPeriod =
          button.dataset.overviewPeriod;

        renderOverview();
      }
    );
  }
);

/* VIEW */

function setView(view) {
  currentView =
    view;

  planView?.classList.toggle(
    "hidden",
    view !== "plan"
  );

  overviewView?.classList.toggle(
    "hidden",
    view !== "overview"
  );

  profileView?.classList.toggle(
    "hidden",
    view !== "profile"
  );

  navButtons.forEach(
    button => {
      button.classList.toggle(
        "active",
        button.dataset.view ===
          view
      );
    }
  );

  if (
    view ===
    "plan"
  ) {
    renderPlan();
  }

  if (
    view ===
    "overview"
  ) {
    renderOverview();
  }

  if (
    view ===
    "profile"
  ) {
    renderProfile();
  }
}

function renderAll() {
  if (
    currentView ===
    "plan"
  ) {
    renderPlan();
  }

  if (
    currentView ===
    "overview"
  ) {
    renderOverview();
  }

  if (
    currentView ===
    "profile"
  ) {
    renderProfile();
  }
}

/* WEEK BUTTONS */

const weekPrevBtn =
  document.getElementById(
    "weekPrevBtn"
  );

const weekNextBtn =
  document.getElementById(
    "weekNextBtn"
  );

const todayBtn =
  document.getElementById(
    "todayBtn"
  );

if (weekPrevBtn) {
  weekPrevBtn.addEventListener(
    "click",
    () => {
      moveWeek(-1);
    }
  );
}

if (weekNextBtn) {
  weekNextBtn.addEventListener(
    "click",
    () => {
      moveWeek(1);
    }
  );
}

if (todayBtn) {
  todayBtn.addEventListener(
    "click",
    goToCurrentWeek
  );
}

/* OVERVIEW NAV */

const overviewPrevBtn =
  document.getElementById(
    "overviewPrevBtn"
  );

const overviewNextBtn =
  document.getElementById(
    "overviewNextBtn"
  );

const overviewTodayBtn =
  document.getElementById(
    "overviewTodayBtn"
  );

if (overviewPrevBtn) {
  overviewPrevBtn.addEventListener(
    "click",
    () => {
      moveOverviewPeriod(
        -1
      );
    }
  );
}

if (overviewNextBtn) {
  overviewNextBtn.addEventListener(
    "click",
    () => {
      moveOverviewPeriod(
        1
      );
    }
  );
}

if (overviewTodayBtn) {
  overviewTodayBtn.addEventListener(
    "click",
    () => {
      currentOverviewDate =
        new Date();

      renderOverview();
    }
  );
}

/* SERVICE WORKER */

if (
  "serviceWorker" in
  navigator
) {
  window.addEventListener(
    "load",
    () => {
      navigator.serviceWorker
        .register(
          "sw.js"
        )
        .catch(
          error => {
            console.warn(
              "HYPE service worker registration failed:",
              error
            );
          }
        );
    }
  );
}

/* INITIAL */

ensureProfileAvatarStyles();

cleanupProfileHeadings();

applyFinalFourChanges();

renderPlan();

setView(
  currentView
);