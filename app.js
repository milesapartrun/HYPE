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
  result.setHours(0, 0, 0, 0);

  const day = result.getDay();
  const diff = day === 0 ? -6 : 1 - day;

  result.setDate(result.getDate() + diff);

  return result;
}

function endOfWeek(date) {
  const result = startOfWeek(date);
  result.setDate(result.getDate() + 6);
  result.setHours(23, 59, 59, 999);

  return result;
}

function addDays(date, amount) {
  const result = new Date(date);
  result.setDate(result.getDate() + amount);
  return result;
}

function addMonths(date, amount) {
  const result = new Date(date);
  result.setMonth(result.getMonth() + amount);
  return result;
}

function addYears(date, amount) {
  const result = new Date(date);
  result.setFullYear(result.getFullYear() + amount);
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
  const target = new Date(
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
  const end = endOfWeek(start);

  return `KW ${getWeekNumber(start)} · ${formatShortDate(
    start
  )}–${formatShortDate(end)}`;
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
    .querySelectorAll(
      "*"
    )
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
    .querySelectorAll(
      "*"
    )
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
        Date.now(),
      updatedAt:
        Date.now()
    });
  }

  saveSessions();

  selectedDayKey =
    getDayKey(
      parseInputDate(
        date
      ) || new Date()
    );

  closeSessionDialog();
  renderPlan();
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

  session.status =
    getSessionStatus(
      session
    ) === "completed"
      ? "planned"
      : "completed";

  session.updatedAt =
    Date.now();

  saveSessions();
  renderPlan();
}

function deleteSession(
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

  const confirmed =
    window.confirm(
      `„${getSessionTitle(
        session
      )}“ wirklich löschen?`
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
  renderPlan();
}

function renderOverview() {
  if (!overviewView) {
    return;
  }

  if (
    currentOverviewPeriod ===
    "week"
  ) {
    renderOverviewWeek();
    return;
  }

  if (
    currentOverviewPeriod ===
    "month"
  ) {
    renderOverviewMonth();
    return;
  }

  renderOverviewYear();
}

function renderOverviewPeriodHeader(
  label
) {
  const title =
    overviewView.querySelector(
      "[data-overview-title]"
    );

  if (title) {
    title.textContent =
      label;
  }
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

  renderOverviewPeriodHeader(
    formatWeekLabel(
      start
    )
  );

  const container =
    overviewView.querySelector(
      "[data-overview-content]"
    );

  if (!container) {
    return;
  }

  const completed =
    weekSessions.filter(
      session =>
        getSessionStatus(
          session
        ) === "completed"
    ).length;

  const totalMinutes =
    weekSessions.reduce(
      (
        total,
        session
      ) =>
        total +
        (Number(
          session.duration
        ) || 0),
      0
    );

  container.innerHTML = `
    <div class="overview-stat-grid">
      <div class="overview-stat-card">
        <span>Einheiten</span>
        <strong>${weekSessions.length}</strong>
      </div>

      <div class="overview-stat-card">
        <span>Erledigt</span>
        <strong>${completed}</strong>
      </div>

      <div class="overview-stat-card">
        <span>Minuten</span>
        <strong>${totalMinutes}</strong>
      </div>
    </div>

    <div class="overview-list">
      ${weekSessions
        .map(
          session => `
            <button
              type="button"
              class="overview-session"
              data-session-id="${escapeHtml(
                session.id
              )}"
            >
              <span class="overview-session-icon">
                ${escapeHtml(
                  getSessionIcon(
                    session
                  )
                )}
              </span>

              <span class="overview-session-main">
                <strong>
                  ${escapeHtml(
                    getSessionTitle(
                      session
                    )
                  )}
                </strong>
                <small>
                  ${escapeHtml(
                    formatDate(
                      parseInputDate(
                        session.date
                      )
                    )
                  )}
                </small>
              </span>

              <span class="overview-session-status ${getStatusClass(
                getSessionStatus(
                  session
                )
              )}">
                ${escapeHtml(
                  getStatusLabel(
                    getSessionStatus(
                      session
                    )
                  )
                )}
              </span>
            </button>
          `
        )
        .join("")}
    </div>
  `;

  container
    .querySelectorAll(
      "[data-session-id]"
    )
    .forEach(
      button => {
        button.addEventListener(
          "click",
          () => {
            const session =
              sessions.find(
                item =>
                  item.id ===
                  button.dataset
                    .sessionId
              );

            if (session) {
              openSessionDialog(
                session
              );
            }
          }
        );
      }
    );
}

function renderOverviewMonth() {
  const month =
    new Date(
      currentOverviewDate
    );

  renderOverviewPeriodHeader(
    formatMonthYear(
      month
    )
  );

  const container =
    overviewView.querySelector(
      "[data-overview-content]"
    );

  if (!container) {
    return;
  }

  const monthSessions =
    getSessionsForMonth(
      month
    );

  const completed =
    monthSessions.filter(
      session =>
        getSessionStatus(
          session
        ) === "completed"
    ).length;

  const totalMinutes =
    monthSessions.reduce(
      (
        total,
        session
      ) =>
        total +
        (Number(
          session.duration
        ) || 0),
      0
    );

  const grouped =
    {};

  monthSessions.forEach(
    session => {
      if (!grouped[session.date]) {
        grouped[session.date] =
          [];
      }

      grouped[
        session.date
      ].push(session);
    }
  );

  container.innerHTML = `
    <div class="overview-stat-grid">
      <div class="overview-stat-card">
        <span>Einheiten</span>
        <strong>${monthSessions.length}</strong>
      </div>

      <div class="overview-stat-card">
        <span>Erledigt</span>
        <strong>${completed}</strong>
      </div>

      <div class="overview-stat-card">
        <span>Minuten</span>
        <strong>${totalMinutes}</strong>
      </div>
    </div>

    <div class="month-calendar">
      ${renderMonthCalendar(
        month,
        grouped
      )}
    </div>
  `;

  container
    .querySelectorAll(
      "[data-calendar-date]"
    )
    .forEach(
      element => {
        element.addEventListener(
          "click",
          () => {
            const date =
              parseInputDate(
                element.dataset
                  .calendarDate
              );

            if (!date) {
              return;
            }

            currentWeekOffset =
              Math.round(
                (
                  startOfWeek(
                    date
                  ) -
                  startOfWeek(
                    new Date()
                  )
                ) /
                  (
                    7 *
                    86400000
                  )
              );

            selectedDayKey =
              getDayKey(
                date
              );

            setView(
              "plan"
            );
          }
        );
      }
    );
}

function renderMonthCalendar(
  month,
  grouped
) {
  const first =
    new Date(
      month.getFullYear(),
      month.getMonth(),
      1
    );

  const last =
    new Date(
      month.getFullYear(),
      month.getMonth() + 1,
      0
    );

  const offset =
    first.getDay() === 0
      ? 6
      : first.getDay() - 1;

  const cells = [];

  for (
    let index = 0;
    index < offset;
    index += 1
  ) {
    cells.push(
      `<div class="calendar-cell empty"></div>`
    );
  }

  for (
    let day = 1;
    day <= last.getDate();
    day += 1
  ) {
    const date =
      new Date(
        month.getFullYear(),
        month.getMonth(),
        day
      );

    const key =
      dateToInputValue(
        date
      );

    const daySessions =
      grouped[key] ||
      [];

    cells.push(`
      <button
        type="button"
        class="calendar-cell ${
          isSameDay(
            date,
            new Date()
          )
            ? "today"
            : ""
        } ${
          daySessions.length
            ? "has-training"
            : ""
        }"
        data-calendar-date="${key}"
      >
        <span>${day}</span>
        <small>
          ${daySessions
            .slice(0, 3)
            .map(
              session =>
                escapeHtml(
                  getSessionIcon(
                    session
                  )
                )
            )
            .join(" ")}
        </small>
      </button>
    `);
  }

  return `
    <div class="calendar-weekdays">
      <span>Mo</span>
      <span>Di</span>
      <span>Mi</span>
      <span>Do</span>
      <span>Fr</span>
      <span>Sa</span>
      <span>So</span>
    </div>

    <div class="calendar-grid">
      ${cells.join("")}
    </div>
  `;
}

function renderOverviewYear() {
  const year =
    new Date(
      currentOverviewDate
    );

  renderOverviewPeriodHeader(
    String(
      year.getFullYear()
    )
  );

  const container =
    overviewView.querySelector(
      "[data-overview-content]"
    );

  if (!container) {
    return;
  }

  const yearSessions =
    getSessionsForYear(
      year
    );

  const months = [];

  for (
    let month = 0;
    month < 12;
    month += 1
  ) {
    const monthDate =
      new Date(
        year.getFullYear(),
        month,
        1
      );

    const monthSessions =
      getSessionsForMonth(
        monthDate
      );

    months.push({
      date: monthDate,
      sessions:
        monthSessions
    });
  }

  container.innerHTML = `
    <div class="overview-stat-grid">
      <div class="overview-stat-card">
        <span>Einheiten</span>
        <strong>${yearSessions.length}</strong>
      </div>

      <div class="overview-stat-card">
        <span>Erledigt</span>
        <strong>
          ${yearSessions.filter(
            session =>
              getSessionStatus(
                session
              ) === "completed"
          ).length}
        </strong>
      </div>

      <div class="overview-stat-card">
        <span>Minuten</span>
        <strong>
          ${yearSessions.reduce(
            (
              total,
              session
            ) =>
              total +
              (Number(
                session.duration
              ) || 0),
            0
          )}
        </strong>
      </div>
    </div>

    <div class="year-month-grid">
      ${months
        .map(
          item => `
            <button
              type="button"
              class="year-month-card"
              data-year-month="${item.date.getMonth()}"
            >
              <span>
                ${item.date.toLocaleDateString(
                  "de-DE",
                  {
                    month:
                      "long"
                  }
                )}
              </span>

              <strong>
                ${item.sessions.length}
              </strong>

              <small>
                ${item.sessions.length === 1
                  ? "Einheit"
                  : "Einheiten"}
              </small>
            </button>
          `
        )
        .join("")}
    </div>
  `;

  container
    .querySelectorAll(
      "[data-year-month]"
    )
    .forEach(
      button => {
        button.addEventListener(
          "click",
          () => {
            const month =
              Number(
                button.dataset
                  .yearMonth
              );

            currentOverviewDate =
              new Date(
                year.getFullYear(),
                month,
                1
              );

            currentOverviewPeriod =
              "month";

            updateOverviewPeriodButtons();
            renderOverview();
          }
        );
      }
    );
}

function updateOverviewPeriodButtons() {
  overviewPeriodButtons.forEach(
    button => {
      button.classList.toggle(
        "active",
        button.dataset
          .overviewPeriod ===
          currentOverviewPeriod
      );
    }
  );
}

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
        button.dataset
          .view === view
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

async function getProfileUser() {
  if (
    typeof window.getCurrentUser !==
    "function"
  ) {
    return null;
  }

  return await window.getCurrentUser();
}

function getAvatarInitials(
  user
) {
  const firstName =
    user?.user_metadata
      ?.first_name
      ?.trim();

  if (firstName) {
    return firstName
      .slice(0, 1)
      .toUpperCase();
  }

  const email =
    user?.email ||
    "";

  if (email) {
    return email
      .slice(0, 1)
      .toUpperCase();
  }

  return "H";
}

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
    .hype-profile-avatar-wrap {
      display:flex;
      flex-direction:column;
      align-items:center;
      justify-content:center;
      gap:10px;
      margin:0 0 22px;
      width:100%;
    }

    .hype-profile-avatar-button {
      position:relative;
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

    .hype-profile-avatar-button:active {
      transform:scale(.97);
    }

    .hype-profile-avatar-fallback {
      display:flex;
      align-items:center;
      justify-content:center;
      width:100%;
      height:100%;
      color:#d7ff3f;
      font-size:34px;
      font-weight:950;
      letter-spacing:-.04em;
    }

    .hype-profile-avatar-image {
      display:block;
      width:100%;
      height:100%;
      object-fit:cover;
    }

    .hype-profile-avatar-edit {
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
      font-weight:950;
    }

    .hype-profile-avatar-label {
      color:#8d949e;
      font-size:11px;
      font-weight:800;
      text-align:center;
    }

    .hype-profile-avatar-status {
      min-height:16px;
      color:#d7ff3f;
      font-size:11px;
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

function getProfileAvatarContainer() {
  if (!profileView) {
    return null;
  }

  return (
    profileView.querySelector(
      ".profile-account-card"
    ) ||
    profileView.querySelector(
      ".profile-card"
    ) ||
    profileName?.parentElement ||
    profileView
  );
}

function ensureProfileAvatarUI() {
  if (
    document.getElementById(
      "hypeProfileAvatar"
    )
  ) {
    return;
  }

  const container =
    getProfileAvatarContainer();

  if (!container) {
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
      class="hype-profile-avatar-button"
      id="hypeProfileAvatarButton"
      aria-label="Profilbild ändern"
    >
      <span
        class="hype-profile-avatar-fallback"
        id="hypeProfileAvatarFallback"
      >
        H
      </span>

      <img
        class="hype-profile-avatar-image"
        id="hypeProfileAvatarImage"
        alt="Profilbild"
        hidden
      >

      <span class="hype-profile-avatar-edit">
        ✎
      </span>
    </button>

    <input
      type="file"
      id="hypeProfileAvatarInput"
      accept="image/jpeg,image/png,image/webp"
    >

    <span class="hype-profile-avatar-label">
      Profilbild ändern
    </span>

    <span
      class="hype-profile-avatar-status"
      id="hypeProfileAvatarStatus"
      aria-live="polite"
    ></span>
  `;

  container.prepend(
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
      input?.click();
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

      event.target.value =
        "";
    }
  );
}

function renderProfileAvatar(
  user
) {
  ensureProfileAvatarUI();

  const fallback =
    document.getElementById(
      "hypeProfileAvatarFallback"
    );

  const image =
    document.getElementById(
      "hypeProfileAvatarImage"
    );

  if (!fallback || !image) {
    return;
  }

  const avatarUrl =
    user?.user_metadata
      ?.avatar_url
      ? String(
          user.user_metadata
            .avatar_url
        ).trim()
      : "";

  fallback.textContent =
    getAvatarInitials(
      user
    );

  if (avatarUrl) {
    image.src =
      avatarUrl;

    image.hidden =
      false;

    fallback.hidden =
      true;

    image.onerror = () => {
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

  if (status) {
    status.textContent =
      "Profilbild wird hochgeladen …";
  }

  if (
    typeof window.uploadProfileAvatar !==
    "function"
  ) {
    if (status) {
      status.textContent =
        "Upload-Funktion nicht verfügbar.";
    }

    return;
  }

  const result =
    await window.uploadProfileAvatar(
      file
    );

  if (!result?.success) {
    if (status) {
      status.textContent =
        result?.error ||
        "Upload fehlgeschlagen.";
    }

    return;
  }

  const user =
    result.user ||
    (await getProfileUser());

  renderProfileAvatar(
    user
  );

  if (status) {
    status.textContent =
      "Profilbild gespeichert.";
  }
}

async function renderProfile() {
  const user =
    await getProfileUser();

  if (!user) {
    return;
  }

  ensureProfileAvatarUI();
  renderProfileAvatar(
    user
  );

  shareWeekStart =
    startOfWeek(
      new Date()
    );

  cleanupProfileHeadings();

  const firstName =
    user?.user_metadata
      ?.first_name
      ? String(
          user.user_metadata
            .first_name
        ).trim()
      : "";

  const displayName =
    firstName ||
    "Deine";

  profileDisplayName =
    displayName;

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

  if (
    profileFirstNameInput
  ) {
    profileFirstNameInput.value =
      firstName;
  }

  if (!firstName) {
    setTimeout(
      () => {
        openProfileDialog(
          true
        );
      },
      150
    );
  }

  renderWeeklySharePreview(
    displayName
  );

  applyFinalFourChanges();
}

function openProfileDialog(
  force = false
) {
  if (!profileDialog) {
    return;
  }

  if (
    force &&
    profileFirstNameInput
  ) {
    profileFirstNameInput.value =
      profileName?.textContent ===
      "Vorname hinzufügen"
        ? ""
        : profileName?.textContent ||
          "";
  }

  profileDialog.showModal?.();

  if (
    !profileDialog.open
  ) {
    profileDialog.classList.add(
      "open"
    );
  }

  setTimeout(
    () =>
      profileFirstNameInput?.focus(),
    50
  );
}

function closeProfileDialog() {
  if (!profileDialog) {
    return;
  }

  if (
    typeof profileDialog.close ===
    "function"
  ) {
    profileDialog.close();
  }

  profileDialog.classList.remove(
    "open"
  );
}

async function saveProfileForm() {
  const firstName =
    profileFirstNameInput?.value.trim() ||
    "";

  if (
   