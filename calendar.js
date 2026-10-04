/* =========================
   HYPE CALENDAR EXPORT
========================= */

const HYPE_CALENDAR_NAME = "HYPE Training";

function calendarPad(value) {
  return String(value).padStart(2, "0");
}


/* =========================
   DATE HELPERS
========================= */

function calendarDate(date) {
  return [
    date.getFullYear(),
    calendarPad(date.getMonth() + 1),
    calendarPad(date.getDate())
  ].join("");
}


function calendarIsoDate(date) {
  return [
    date.getFullYear(),
    calendarPad(date.getMonth() + 1),
    calendarPad(date.getDate())
  ].join("-");
}


function calendarEscape(value) {
  return String(value || "")
    .replace(/\\/g, "\\\\")
    .replace(/\r?\n/g, "\\n")
    .replace(/;/g, "\\;")
    .replace(/,/g, "\\,");
}


/* =========================
   WEEK
========================= */

function calendarStartOfWeek(date) {
  const result = new Date(date);

  const day =
    (result.getDay() + 6) % 7;

  result.setDate(
    result.getDate() - day
  );

  result.setHours(0, 0, 0, 0);

  return result;
}


/* =========================
   LOAD HYPE SESSIONS
========================= */

function getCalendarSessions() {
  try {
    return JSON.parse(
      localStorage.getItem("hype_sessions_v1") || "[]"
    );
  } catch {
    return [];
  }
}


/* =========================
   CREATE ICS
========================= */

function createHypeCalendarFile() {

  const sessions =
    getCalendarSessions();

  const selectedDate =
    window.hypeSelectedDate ||
    new Date();

  const weekStart =
    calendarStartOfWeek(
      selectedDate
    );

  const weekEnd =
    new Date(weekStart);

  weekEnd.setDate(
    weekEnd.getDate() + 7
  );


  const weekSessions =
    sessions.filter(session => {

      if (!session.date) {
        return false;
      }

      const sessionDate =
        new Date(
          session.date + "T12:00:00"
        );

      return (
        sessionDate >= weekStart &&
        sessionDate < weekEnd
      );

    });


  if (!weekSessions.length) {

    alert(
      "Für diese Woche sind noch keine Trainings geplant."
    );

    return;

  }


  const now =
    new Date();

  const dtStamp =
    now.getUTCFullYear() +
    calendarPad(now.getUTCMonth() + 1) +
    calendarPad(now.getUTCDate()) +
    "T" +
    calendarPad(now.getUTCHours()) +
    calendarPad(now.getUTCMinutes()) +
    calendarPad(now.getUTCSeconds()) +
    "Z";


  const events =
    weekSessions.map(session => {

      const start =
        new Date(
          session.date + "T12:00:00"
        );

      const end =
        new Date(start);

      end.setDate(
        end.getDate() + 1
      );


      const sportLabels = {
        running: "Laufen",
        strength: "Gym",
        hyrox: "HYROX",
        cycling: "Rad",
        swimming: "Schwimmen",
        mobility: "Mobility",
        rest: "Recovery"
      };


      const sport =
        sportLabels[session.sport] ||
        "Training";


      const title =
        `${sport} · ${session.title}`;


      let description =
        `HYPE Training\\n` +
        `Sport: ${sport}\\n` +
        `Dauer: ${session.duration || 0} min\\n` +
        `Intensität: ${session.intensity || 0}/5`;


      if (session.notes) {
        description +=
          `\\n\\n${session.notes}`;
      }


      return [
        "BEGIN:VEVENT",
        `UID:hype-${session.id || Date.now()}@hype`,
        `DTSTAMP:${dtStamp}`,
        `DTSTART;VALUE=DATE:${calendarDate(start)}`,
        `DTEND;VALUE=DATE:${calendarDate(end)}`,
        `SUMMARY:${calendarEscape(title)}`,
        `DESCRIPTION:${calendarEscape(description)}`,
        "END:VEVENT"
      ].join("\r\n");

    });


  const calendar =
    [
      "BEGIN:VCALENDAR",
      "VERSION:2.0",
      "PRODID:-//HYPE//Training Planner//DE",
      "CALSCALE:GREGORIAN",
      "METHOD:PUBLISH",
      ...events,
      "END:VCALENDAR"
    ].join("\r\n");


  const blob =
    new Blob(
      [calendar],
      {
        type:
          "text/calendar;charset=utf-8"
      }
    );


  const url =
    URL.createObjectURL(blob);


  const link =
    document.createElement("a");

  link.href = url;

  link.download =
    `HYPE-${calendarIsoDate(weekStart)}.ics`;

  document.body.appendChild(link);

  link.click();

  link.remove();

  setTimeout(() => {
    URL.revokeObjectURL(url);
  }, 1000);

}


/* =========================
   ADD BUTTON
========================= */

function setupHypeCalendarButton() {

  const addButton =
    document.getElementById("addBtn");

  if (!addButton) {
    return;
  }


  if (
    document.getElementById(
      "calendarExportBtn"
    )
  ) {
    return;
  }


  const calendarButton =
    document.createElement("button");

  calendarButton.type =
    "button";

  calendarButton.id =
    "calendarExportBtn";

  calendarButton.className =
    "calendar-export-btn";

  calendarButton.innerHTML =
    "🗓 Kalender";


  calendarButton.addEventListener(
    "click",
    createHypeCalendarFile
  );


  addButton.parentElement.appendChild(
    calendarButton
  );

}


/* =========================
   START
========================= */

if (
  document.readyState === "loading"
) {

  document.addEventListener(
    "DOMContentLoaded",
    setupHypeCalendarButton
  );

} else {

  setupHypeCalendarButton();

}


/*
 * app.js kann selected nicht direkt
 * exportieren. Deshalb holen wir
 * das aktuell angezeigte Datum aus
 * dem HYPE-DOM.
 */
Object.defineProperty(
  window,
  "hypeSelectedDate",
  {
    get() {

      const label =
        document.getElementById(
          "selectedDateLabel"
        );

      const text =
        label?.textContent || "";

      const now =
        new Date();

      /*
       * Für den Kalenderexport reicht
       * die aktuelle Woche. Wenn HYPE
       * später eine globale Week-State-
       * Variable bekommt, ersetzen wir
       * diesen Fallback damit.
       */

      return now;

    }
  }
);