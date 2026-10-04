const KEY = "hype_sessions_v1";


const sportMeta = {

  running: {
    icon: "🏃",
    label: "Laufen",
    title: "z. B. Easy Run 45 min",
    notes: "Pace, Distanz, Intervalle, Laufgefühl …"
  },

  strength: {
    icon: "🏋️",
    label: "Gym",
    title: "z. B. Oberkörper Push",
    notes: "Übungen, Sätze, Wiederholungen, Gewichte …"
  },

  hyrox: {
    icon: "🔥",
    label: "HYROX",
    title: "z. B. HYROX Simulation",
    notes: "Stationen, Splits, Lauf-Pace, Gewichte …"
  },

  cycling: {
    icon: "🚴",
    label: "Rad",
    title: "z. B. Zone 2 Ride 60 min",
    notes: "Distanz, Watt, Strecke, Höhenmeter …"
  },

  swimming: {
    icon: "🏊",
    label: "Schwimmen",
    title: "z. B. 2.000 m Technik",
    notes: "Bahnen, Intervalle, Pace, Technik …"
  },

  mobility: {
    icon: "🧘",
    label: "Mobility",
    title: "z. B. Hüfte & Sprunggelenk",
    notes: "Bereiche, Übungen, Dauer, Beweglichkeit …"
  },

  rest: {
    icon: "😴",
    label: "Recovery",
    title: "z. B. Recovery & Sauna",
    notes: "Schlaf, Spaziergang, Sauna, Stretching …"
  }

};


/* -------------------------------- */
/* DATEN LADEN                       */
/* -------------------------------- */

let sessions = [];

try {

  sessions =
    JSON.parse(
      localStorage.getItem(KEY) || "[]"
    );

} catch (error) {

  sessions = [];

}


sessions =
  sessions.map(session => ({

    ...session,

    completed:
      session.completed === true,

    actualIntensity:
      session.actualIntensity ??
      null,

    postNotes:
      session.postNotes ??
      ""

  }));


let selected =
  new Date();

selected.setHours(
  12,
  0,
  0,
  0
);


let editingId = null;


/* -------------------------------- */
/* HILFSFUNKTIONEN                  */
/* -------------------------------- */

const pad = n =>
  String(n).padStart(2, "0");


const iso = d =>
  `${d.getFullYear()}-${pad(
    d.getMonth() + 1
  )}-${pad(
    d.getDate()
  )}`;


const startOfWeek = d => {

  const x =
    new Date(d);

  const day =
    (x.getDay() + 6) % 7;

  x.setDate(
    x.getDate() - day
  );

  x.setHours(
    12,
    0,
    0,
    0
  );

  return x;

};


const esc = s =>
  String(s || "")
    .replace(
      /[&<>"']/g,
      c => ({
        "&": "&amp;",
        "<": "&lt;",
        ">": "&gt;",
        '"': "&quot;",
        "'": "&#39;"
      }[c])
    );


function save() {

  localStorage.setItem(
    KEY,
    JSON.stringify(
      sessions
    )
  );

}


/* -------------------------------- */
/* ZUKUNFT PRÜFEN                   */
/* -------------------------------- */

function isFutureDate(dateString) {

  return dateString >
    iso(new Date());

}


function getFutureMessage(dateString) {

  const today =
    new Date();

  today.setHours(
    12,
    0,
    0,
    0
  );


  const date =
    new Date(
      dateString +
      "T12:00:00"
    );


  const tomorrow =
    new Date(today);

  tomorrow.setDate(
    tomorrow.getDate() + 1
  );


  if (
    iso(date) ===
    iso(tomorrow)
  ) {

    return "Diese Einheit kommt erst morgen. Du kannst sie noch nicht abhaken.";

  }


  const formatted =
    date.toLocaleDateString(
      "de-DE",
      {
        weekday: "long",
        day: "numeric",
        month: "long"
      }
    );


  return `Diese Einheit kommt erst am ${formatted}. Du kannst sie noch nicht abhaken.`;

}


/* -------------------------------- */
/* WOCHENTAGE                        */
/* -------------------------------- */

function weekDays() {

  const s =
    startOfWeek(selected);

  return Array.from(
    { length: 7 },
    (_, i) => {

      const d =
        new Date(s);

      d.setDate(
        s.getDate() + i
      );

      return d;

    }
  );

}


/* -------------------------------- */
/* RENDER                            */
/* -------------------------------- */

function render() {

  const days =
    weekDays();

  const today =
    iso(new Date());


  /* WEEK TITLE */

  const end =
    new Date(days[6]);


  document.getElementById(
    "weekTitle"
  ).textContent =
    `${days[0].toLocaleDateString(
      "de-DE",
      {
        day: "2-digit",
        month: "short"
      }
    )} – ${end.toLocaleDateString(
      "de-DE",
      {
        day: "2-digit",
        month: "short"
      }
    )}`;


  /* SELECTED DATE */

  const selectedLabel =
    document.getElementById(
      "selectedDateLabel"
    );


  selectedLabel.textContent =
    selected.toLocaleDateString(
      "de-DE",
      {
        weekday: "long",
        day: "numeric",
        month: "long"
      }
    );


  selectedLabel.classList.add(
    "selected-date"
  );


  /* WEEK STRIP */

  const strip =
    document.getElementById(
      "weekStrip"
    );


  strip.innerHTML =
    days.map(d => {

      const date =
        iso(d);


      const list =
        sessions.filter(
          s =>
            s.date === date
        );


      const isToday =
        date === today;


      const isSelected =
        date === iso(selected);


      return `

        <button
          class="day ${
            isSelected
              ? "active"
              : ""
          }"
          data-date="${date}"
          type="button"
        >

          ${d.toLocaleDateString(
            "de-DE",
            {
              weekday: "short"
            }
          ).slice(0, 2).toUpperCase()}

          <strong>
            ${d.getDate()}
          </strong>

          ${
            isToday
              ? `
                <span class="today-label">
                  HEUTE
                </span>
              `
              : ""
          }

          ${
            list.length
              ? `
                <span class="dot"></span>
              `
              : ""
          }

        </button>

      `;

    }).join("");


  /* DAY CLICK */

  strip
    .querySelectorAll(".day")
    .forEach(button => {

      button.onclick = () => {

        selected =
          new Date(
            button.dataset.date +
            "T12:00:00"
          );

        render();

      };

    });


  renderSessions();


  /* WEEKLY INSIGHT */

  const count =
    sessions.filter(s =>
      days.some(
        d =>
          iso(d) === s.date
      )
    ).length;


  const completed =
    sessions.filter(s =>
      days.some(
        d =>
          iso(d) === s.date
      ) &&
      s.completed === true
    ).length;


  document.getElementById(
    "insightText"
  ).textContent =
    count === 0
      ? "Füge Trainings hinzu, um deine Woche zu planen."
      : `${completed} von ${count} Einheiten abgeschlossen.`;

}


/* -------------------------------- */
/* TRAININGS DARSTELLEN              */
/* -------------------------------- */

function renderSessions() {

  const list =
    sessions
      .filter(
        s =>
          s.date ===
          iso(selected)
      )
      .sort(
        (a, b) =>
          a.created -
          b.created
      );


  const el =
    document.getElementById(
      "sessions"
    );


  if (!list.length) {

    el.innerHTML = `

      <div class="empty">

        Noch kein Training geplant.

        <br>
        <br>

        <button
          class="primary"
          id="emptyAdd"
          type="button"
        >
          Erste Einheit planen
        </button>

      </div>

    `;


    document.getElementById(
      "emptyAdd"
    ).onclick =
      openNewDialog;


    return;

  }


  el.innerHTML =
    list.map(s => {

      const m =
        sportMeta[s.sport] ||
        sportMeta.running;


      const plannedIntensity =
        Number(
          s.intensity || 0
        );


      const actualIntensity =
        s.actualIntensity !== null &&
        s.actualIntensity !== undefined
          ? Number(
              s.actualIntensity
            )
          : null;


      return `

        <article
          class="session ${
            s.completed
              ? "completed"
              : ""
          }"
        >

          <div class="sport-icon">
            ${m.icon}
          </div>


          <div class="session-content">

            <div class="session-title-row">

              <h4>
                ${esc(s.title)}
              </h4>

              ${
                s.completed
                  ? `
                    <span class="completed-label">
                      ABGESCHLOSSEN
                    </span>
                  `
                  : ""
              }

            </div>


            <p>
              ${m.label}
              ·
              ${s.duration} min
              ${
                "●".repeat(
                  plannedIntensity
                )
              }${
                "○".repeat(
                  5 -
                  plannedIntensity
                )
              }
            </p>


            ${
              s.notes
                ? `
                  <p>
                    ${esc(
                      s.notes
                    )}
                  </p>
                `
                : ""
            }


            ${
              s.completed
                ? `
                  <div class="actual-intensity">

                    <span>
                      Tatsächlich
                    </span>

                    <select
                      class="actual-intensity-select"
                      data-id="${s.id}"
                    >

                      <option
                        value=""
                        ${
                          actualIntensity === null
                            ? "selected"
                            : ""
                        }
                      >
                        0–5
                      </option>

                      <option
                        value="0"
                        ${
                          actualIntensity === 0
                            ? "selected"
                            : ""
                        }
                      >
                        0 — entspannend
                      </option>

                      <option
                        value="1"
                        ${
                          actualIntensity === 1
                            ? "selected"
                            : ""
                        }
                      >
                        1 — sehr leicht
                      </option>

                      <option
                        value="2"
                        ${
                          actualIntensity === 2
                            ? "selected"
                            : ""
                        }
                      >
                        2 — leicht
                      </option>

                      <option
                        value="3"
                        ${
                          actualIntensity === 3
                            ? "selected"
                            : ""
                        }
                      >
                        3 — moderat
                      </option>

                      <option
                        value="4"
                        ${
                          actualIntensity === 4
                            ? "selected"
                            : ""
                        }
                      >
                        4 — hart
                      </option>

                      <option
                        value="5"
                        ${
                          actualIntensity === 5
                            ? "selected"
                            : ""
                        }
                      >
                        5 — sehr hart
                      </option>

                    </select>

                  </div>


                  <div class="post-training-notes">

                    <label
                      for="postNotes-${s.id}"
                    >
                      Wie war das Training?

                      <textarea
                        id="postNotes-${s.id}"
                        class="post-training-notes-input"
                        data-id="${s.id}"
                        rows="3"
                        placeholder="z. B. Hat sich heute sehr gut angefühlt …"
                      >${esc(s.postNotes)}</textarea>

                    </label>

                  </div>
                `
                : ""
            }

          </div>


          <div class="session-actions">

            <!-- TRAINING ABHAKEN -->

            <button
              class="complete-btn ${
                s.completed
                  ? "is-completed"
                  : ""
              }"
              data-id="${s.id}"
              type="button"
              aria-label="${
                s.completed
                  ? "Training als offen markieren"
                  : "Training abschließen"
              }"
            >
              ${
                s.completed
                  ? "✓"
                  : "○"
              }
            </button>


            <!-- BEARBEITEN -->

            <button
              class="edit-btn"
              data-id="${s.id}"
              type="button"
              aria-label="Training bearbeiten"
            >
              ✎&nbsp; Bearbeiten
            </button>


            <!-- LÖSCHEN -->

            <button
              class="icon-btn delete"
              data-id="${s.id}"
              type="button"
              aria-label="Training löschen"
            >
              ×
            </button>

          </div>

        </article>

      `;

    }).join("");


  /* -------------------------------- */
  /* TRAINING ABHAKEN                 */
  /* -------------------------------- */

  el
    .querySelectorAll(
      ".complete-btn"
    )
    .forEach(button => {

      button.addEventListener(
        "click",
        function () {

          const id =
            this.dataset.id;


          const session =
            sessions.find(
              s =>
                String(s.id) ===
                String(id)
            );


          if (!session) {
            return;
          }


          if (
            !session.completed &&
            isFutureDate(session.date)
          ) {

            alert(
              getFutureMessage(
                session.date
              )
            );

            return;

          }


          session.completed =
            !session.completed;


          if (
            session.completed === false
          ) {

            session.actualIntensity =
              null;

            session.postNotes =
              "";

          }


          save();

          render();

        }
      );

    });


  /* -------------------------------- */
  /* BEARBEITEN                       */
  /* -------------------------------- */

  el
    .querySelectorAll(
      ".edit-btn"
    )
    .forEach(button => {

      button.addEventListener(
        "click",
        function () {

          openEditDialog(
            this.dataset.id
          );

        }
      );

    });


  /* -------------------------------- */
  /* LÖSCHEN                          */
  /* -------------------------------- */

  el
    .querySelectorAll(
      ".delete"
    )
    .forEach(button => {

      button.addEventListener(
        "click",
        function () {

          const id =
            this.dataset.id;


          const session =
            sessions.find(
              s =>
                String(s.id) ===
                String(id)
            );


          if (!session) {
            return;
          }


          const confirmed =
            window.confirm(
              `Möchtest du diese Einheit wirklich löschen?\n\n${session.title}`
            );


          if (!confirmed) {
            return;
          }


          sessions =
            sessions.filter(
              s =>
                String(s.id) !==
                String(id)
            );


          save();

          render();

        }
      );

    });


  /* -------------------------------- */
  /* TATSÄCHLICHE INTENSITÄT         */
  /* -------------------------------- */

  el
    .querySelectorAll(
      ".actual-intensity-select"
    )
    .forEach(select => {

      select.addEventListener(
        "change",
        function () {

          const session =
            sessions.find(
              s =>
                String(s.id) ===
                String(
                  this.dataset.id
                )
            );


          if (!session) {
            return;
          }


          session.actualIntensity =
            this.value === ""
              ? null
              : Number(
                  this.value
                );


          save();

          render();

        }
      );

    });


  /* -------------------------------- */
  /* TRAININGS-NOTIZ NACH ABSCHLUSS  */
  /* -------------------------------- */

  el
    .querySelectorAll(
      ".post-training-notes-input"
    )
    .forEach(textarea => {

      textarea.addEventListener(
        "input",
        function () {

          const session =
            sessions.find(
              s =>
                String(s.id) ===
                String(
                  this.dataset.id
                )
            );


          if (!session) {
            return;
          }


          session.postNotes =
            this.value;

          save();

        }
      );

    });

}


/* -------------------------------- */
/* DIALOG                            */
/* -------------------------------- */

const dialog =
  document.getElementById(
    "sessionDialog"
  );


function updatePlaceholders() {

  const sport =
    document.getElementById(
      "sport"
    ).value;


  const meta =
    sportMeta[sport] ||
    sportMeta.running;


  document.getElementById(
    "title"
  ).placeholder =
    meta.title;


  document.getElementById(
    "notes"
  ).placeholder =
    meta.notes;

}


/* -------------------------------- */
/* NEUES TRAINING                    */
/* -------------------------------- */

function openNewDialog() {

  editingId = null;


  document.getElementById(
    "dialogEyebrow"
  ).textContent =
    "NEUES TRAINING";


  document.getElementById(
    "dialogTitle"
  ).textContent =
    "Einheit planen";


  document.getElementById(
    "saveSessionBtn"
  ).textContent =
    "Training speichern";


  document.getElementById(
    "sport"
  ).value =
    "running";


  document.getElementById(
    "title"
  ).value =
    "";


  document.getElementById(
    "duration"
  ).value =
    60;


  document.getElementById(
    "intensity"
  ).value =
    3;


  document.getElementById(
    "notes"
  ).value =
    "";


  updatePlaceholders();


  dialog.showModal();

}


/* -------------------------------- */
/* TRAINING BEARBEITEN               */
/* -------------------------------- */

function openEditDialog(id) {

  const session =
    sessions.find(
      s =>
        String(s.id) ===
        String(id)
    );


  if (!session) {
    return;
  }


  editingId =
    session.id;


  document.getElementById(
    "dialogEyebrow"
  ).textContent =
    "TRAINING BEARBEITEN";


  document.getElementById(
    "dialogTitle"
  ).textContent =
    "Einheit bearbeiten";


  document.getElementById(
    "saveSessionBtn"
  ).textContent =
    "Änderungen speichern";


  document.getElementById(
    "sport"
  ).value =
    session.sport;


  document.getElementById(
    "title"
  ).value =
    session.title;


  document.getElementById(
    "duration"
  ).value =
    session.duration;


  document.getElementById(
    "intensity"
  ).value =
    session.intensity;


  document.getElementById(
    "notes"
  ).value =
    session.notes || "";


  updatePlaceholders();


  dialog.showModal();

}


/* -------------------------------- */
/* SPORTART ÄNDERN                   */
/* -------------------------------- */

document.getElementById(
  "sport"
).addEventListener(
  "change",
  updatePlaceholders
);


/* -------------------------------- */
/* + TRAINING                        */
/* -------------------------------- */

document.getElementById(
  "addBtn"
).addEventListener(
  "click",
  openNewDialog
);


/* -------------------------------- */
/* DIALOG SCHLIESSEN                 */
/* -------------------------------- */

document.getElementById(
  "closeDialog"
).addEventListener(
  "click",
  () => {

    editingId = null;

    dialog.close();

  }
);


/* -------------------------------- */
/* SPEICHERN                         */
/* -------------------------------- */

document.getElementById(
  "saveSessionBtn"
).addEventListener(
  "click",
  () => {

    const sport =
      document.getElementById(
        "sport"
      ).value;


    const title =
      document.getElementById(
        "title"
      ).value.trim();


    const duration =
      document.getElementById(
        "duration"
      ).value;


    const intensity =
      document.getElementById(
        "intensity"
      ).value;


    const notes =
      document.getElementById(
        "notes"
      ).value.trim();


    if (!title) {

      document.getElementById(
        "title"
      ).focus();

      return;

    }


    /* BEARBEITEN */

    if (editingId !== null) {

      const session =
        sessions.find(
          s =>
            String(s.id) ===
            String(editingId)
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

    }


    /* NEUES TRAINING */

    else {

      sessions.push({

        id:
          Date.now().toString(),

        date:
          iso(selected),

        sport:
          sport,

        title:
          title,

        duration:
          duration,

        intensity:
          intensity,

        notes:
          notes,

        completed:
          false,

        actualIntensity:
          null,

        postNotes:
          "",

        created:
          Date.now()

      });

    }


    save();


    editingId =
      null;


    dialog.close();


    render();

  }
);


/* -------------------------------- */
/* HEUTE                             */
/* -------------------------------- */

document.getElementById(
  "todayBtn"
).addEventListener(
  "click",
  () => {

    selected =
      new Date();

    selected.setHours(
      12,
      0,
      0,
      0
    );

    render();

  }
);


/* -------------------------------- */
/* ALLE                              */
/* -------------------------------- */

document.getElementById(
  "allBtn"
).addEventListener(
  "click",
  () => {

    const s =
      startOfWeek(
        selected
      );

    selected =
      new Date(s);

    render();

  }
);


/* -------------------------------- */
/* SERVICE WORKER                    */
/* -------------------------------- */

if (
  "serviceWorker" in navigator
) {

  navigator.serviceWorker
    .register("sw.js")
    .catch(() => {});

}


/* -------------------------------- */
/* START                             */
/* -------------------------------- */

render();