const KEY = "hype_sessions_v1";


const sportMeta = {
  running: {
    icon: "🏃",
    label: "Laufen"
  },

  strength: {
    icon: "🏋️",
    label: "Gym"
  },

  hyrox: {
    icon: "🔥",
    label: "HYROX"
  },

  cycling: {
    icon: "🚴",
    label: "Rad"
  },

  swimming: {
    icon: "🏊",
    label: "Schwimmen"
  },

  mobility: {
    icon: "🧘",
    label: "Mobility"
  },

  rest: {
    icon: "😴",
    label: "Recovery"
  }
};


let sessions = JSON.parse(
  localStorage.getItem(KEY) || "[]"
);


let selected = new Date();

selected.setHours(12, 0, 0, 0);


const pad = n =>
  String(n).padStart(2, "0");


const iso = d =>
  `${d.getFullYear()}-${pad(d.getMonth() + 1)}-${pad(d.getDate())}`;


const startOfWeek = d => {

  let x = new Date(d);

  let day = (x.getDay() + 6) % 7;

  x.setDate(x.getDate() - day);

  x.setHours(12, 0, 0, 0);

  return x;
};


const esc = s =>
  String(s || "").replace(
    /[&<>"']/g,
    c => ({
      "&": "&amp;",
      "<": "&lt;",
      ">": "&gt;",
      '"': "&quot;",
      "'": "&#39;"
    }[c])
  );


function weekDays() {

  const s = startOfWeek(selected);

  return Array.from(
    { length: 7 },
    (_, i) => {

      let d = new Date(s);

      d.setDate(s.getDate() + i);

      return d;

    }
  );
}


function render() {

  const days = weekDays();

  const today = iso(new Date());


  /* WEEK TITLE */

  const end = new Date(days[6]);

  document.getElementById(
    "weekTitle"
  ).textContent =
    `${days[0].toLocaleDateString("de-DE", {
      day: "2-digit",
      month: "short"
    })} – ${end.toLocaleDateString("de-DE", {
      day: "2-digit",
      month: "short"
    })}`;


  /* SELECTED DATE */

  document.getElementById(
    "selectedDateLabel"
  ).textContent =
    selected.toLocaleDateString(
      "de-DE",
      {
        weekday: "long",
        day: "numeric",
        month: "long"
      }
    );


  /* LARGE WEEK STRIP */

  const strip =
    document.getElementById("weekStrip");


  strip.innerHTML = days.map(d => {

    const date = iso(d);

    const list =
      sessions.filter(
        s => s.date === date
      );


    const isToday =
      date === today;


    const isSelected =
      date === iso(selected);


    return `
      <button
        class="day ${isSelected ? "active" : ""}"
        data-date="${date}"
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
            ? '<span class="today-label">HEUTE</span>'
            : ""
        }

        ${
          list.length
            ? '<span class="dot"></span>'
            : ""
        }

      </button>
    `;

  }).join("");


  /* CLICK ON LARGE DAY */

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


  /* SMALL WEEK OVERVIEW */

  renderWeekOverview(
    days,
    today
  );


  /* TRAININGS */

  renderSessions();


  /* WEEK LOAD */

  const weekLoad =
    sessions
      .filter(s =>
        days.some(
          d => iso(d) === s.date
        )
      )
      .reduce(
        (total, s) =>
          total +
          Number(s.duration || 0) *
          Number(s.intensity || 0),
        0
      );


  document.getElementById(
    "loadScore"
  ).textContent = weekLoad;


  /* WEEKLY INSIGHT */

  const count =
    sessions.filter(s =>
      days.some(
        d => iso(d) === s.date
      )
    ).length;


  document.getElementById(
    "insightText"
  ).textContent =
    count === 0
      ? "Füge Trainings hinzu, um deine Belastung zu sehen."
      : `${count} Einheiten geplant. Deine Wochenbelastung liegt bei ${weekLoad} Punkten.`;

}


function renderWeekOverview(
  days,
  today
) {

  const el =
    document.getElementById(
      "weekOverview"
    );


  el.innerHTML =
    days.map(d => {

      const date = iso(d);


      const list =
        sessions.filter(
          s => s.date === date
        );


      const isToday =
        date === today;


      const isPast =
        date < today;


      const state =
        isToday
          ? "today"
          : isPast
            ? "past"
            : "future";


      let sessionText;


      if (list.length === 0) {

        sessionText =
          "Kein Training";

      } else if (list.length === 1) {

        sessionText =
          "1 Training";

      } else {

        sessionText =
          `${list.length} Trainings`;

      }


      return `
        <button
          class="overview-day ${state} ${
            date === iso(selected)
              ? "selected"
              : ""
          }"
          data-date="${date}"
        >

          <span class="overview-weekday">
            ${d.toLocaleDateString(
              "de-DE",
              {
                weekday: "short"
              }
            )}
          </span>


          <strong>
            ${d.getDate()}
          </strong>


          ${
            isToday
              ? '<span class="overview-today">HEUTE</span>'
              : `
                <span class="overview-state">
                  ${isPast ? "VORBEI" : "KOMMT"}
                </span>
              `
          }


          <span
            class="overview-training ${
              list.length
                ? "has-training"
                : ""
            }"
          >
            ${sessionText}
          </span>

        </button>
      `;

    }).join("");


  /* CLICK ON SMALL DAY */

  el
    .querySelectorAll(".overview-day")
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

}


function renderSessions() {

  const list =
    sessions
      .filter(
        s => s.date === iso(selected)
      )
      .sort(
        (a, b) =>
          a.created - b.created
      );


  const el =
    document.getElementById(
      "sessions"
    );


  /* NO TRAINING */

  if (!list.length) {

    el.innerHTML = `
      <div class="empty">

        Noch kein Training geplant.

        <br>
        <br>

        <button
          class="primary"
          id="emptyAdd"
        >
          Erste Einheit planen
        </button>

      </div>
    `;


    document.getElementById(
      "emptyAdd"
    ).onclick = openDialog;


    return;

  }


  /* TRAINING CARDS */

  el.innerHTML =
    list.map(s => {

      const m =
        sportMeta[s.sport] ||
        sportMeta.running;


      return `
        <article class="session">

          <div class="sport-icon">
            ${m.icon}
          </div>


          <div>

            <h4>
              ${esc(s.title)}
            </h4>


            <p>
              ${m.label}
              ·
              ${s.duration} min
              ·
              ${
                "●".repeat(
                  Number(s.intensity)
                )
              }${
                "○".repeat(
                  5 -
                  Number(s.intensity)
                )
              }
            </p>


            ${
              s.notes
                ? `<p>${esc(s.notes)}</p>`
                : ""
            }

          </div>


          <button
            class="icon-btn delete"
            data-id="${s.id}"
            aria-label="Löschen"
          >
            ×
          </button>

        </article>
      `;

    }).join("");


  /* DELETE BUTTONS */

  el
    .querySelectorAll(".delete")
    .forEach(button => {

      button.onclick = () => {

        sessions =
          sessions.filter(
            s =>
              s.id !==
              button.dataset.id
          );


        save();

        render();

      };

    });

}


function save() {

  localStorage.setItem(
    KEY,
    JSON.stringify(sessions)
  );

}


const dialog =
  document.getElementById(
    "sessionDialog"
  );


function openDialog() {

  document
    .getElementById("sessionForm")
    .reset();


  document.getElementById(
    "duration"
  ).value = 60;


  document.getElementById(
    "intensity"
  ).value = 3;


  dialog.showModal();

}


/* ADD TRAINING */

document.getElementById(
  "addBtn"
).onclick = openDialog;


/* CLOSE DIALOG */

document.getElementById(
  "closeDialog"
).onclick = () =>
  dialog.close();


/* SAVE TRAINING */

document
  .getElementById("sessionForm")
  .addEventListener(
    "submit",
    e => {

      e.preventDefault();


      sessions.push({

        id: crypto.randomUUID(),

        date: iso(selected),

        sport:
          document.getElementById(
            "sport"
          ).value,

        title:
          document.getElementById(
            "title"
          ).value,

        duration:
          document.getElementById(
            "duration"
          ).value,

        intensity:
          document.getElementById(
            "intensity"
          ).value,

        notes:
          document.getElementById(
            "notes"
          ).value,

        created: Date.now()

      });


      save();

      dialog.close();

      render();

    }
  );


/* TODAY BUTTON */

document.getElementById(
  "todayBtn"
).onclick = () => {

  selected = new Date();

  selected.setHours(
    12,
    0,
    0,
    0
  );

  render();

};


/* ALL BUTTON */

document.getElementById(
  "allBtn"
).onclick = () => {

  const s =
    startOfWeek(selected);

  selected =
    new Date(s);

  render();

};


/* SETTINGS */

document.getElementById(
  "settingsBtn"
).onclick = () => {

  alert(
    "V1: Trainings werden lokal auf diesem Gerät gespeichert. Als Nächstes kommen Profil, Ziele, Apple Health und KI-Plananpassung."
  );

};


/* SERVICE WORKER */

if (
  "serviceWorker" in navigator
) {

  navigator.serviceWorker
    .register("sw.js")
    .catch(() => {});

}


/* INITIAL RENDER */

render();