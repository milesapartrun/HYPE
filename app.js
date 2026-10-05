const KEY = "hype_sessions_v1";
const PROFILE_IMAGE_KEY_PREFIX = "hype_profile_image_v1:";

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
  },

  other: {
    icon: "🏅",
    label: "Sonstige Sportart",
    placeholder: "z. B. Tennis"
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

let shareWeekStart = startOfWeek(
  new Date()
);

let profileDisplayName = "";

/* =========================
   PROFILE IMAGE STATE
========================= */

let pendingProfileImage = null;

/* =========================
   DOM
========================= */

const planView =
  document.getElementById("planView");

const overviewView =
  document.getElementById("overviewView");

const profileView =
  document.getElementById("profileView");

const todayView =
  document.getElementById("todayView");

const bottomNav =
  document.getElementById("bottomNav");

const weekTitle =
  document.getElementById("weekTitle");

const heroYear =
  document.getElementById("heroYear");

const weekPrevBtn =
  document.getElementById("weekPrevBtn");

const weekNextBtn =
  document.getElementById("weekNextBtn");

const todayJumpBtn =
  document.getElementById("todayJumpBtn");

const weekStrip =
  document.getElementById("weekStrip");

const sessionsEl =
  document.getElementById("sessions");

const selectedDateLabel =
  document.getElementById("selectedDateLabel");

const weeklyInsight =
  document.getElementById("weeklyInsight");

const addTrainingBtn =
  document.getElementById("addTrainingBtn");

const calendarExportBtn =
  document.getElementById("calendarExportBtn");

const overviewContent =
  document.getElementById("overviewContent");

const periodTitle =
  document.getElementById("periodTitle");

const periodPrevBtn =
  document.getElementById("periodPrevBtn");

const periodNextBtn =
  document.getElementById("periodNextBtn");

const periodTodayBtn =
  document.getElementById("periodTodayBtn");

const todayTitle =
  document.getElementById("todayTitle");

const todayContent =
  document.getElementById("todayContent");

const trainingDialog =
  document.getElementById("trainingDialog");

const trainingForm =
  document.getElementById("trainingForm");

const dialogTitle =
  document.getElementById("dialogTitle");

const closeDialogBtn =
  document.getElementById("closeDialogBtn");

const sportInput =
  document.getElementById("sportInput");

const titleInput =
  document.getElementById("titleInput");

const durationInput =
  document.getElementById("durationInput");

const intensityInput =
  document.getElementById("intensityInput");

const notesInput =
  document.getElementById("notesInput");

/* =========================
   TRAININGS-FELDER
========================= */

const customSportField =
  document.getElementById(
    "customSportField"
  );

const customSportInput =
  document.getElementById(
    "customSportInput"
  );

const runningMetricInput =
  document.getElementById(
    "runningMetricInput"
  );

const metricValueLabel =
  document.getElementById(
    "metricValueLabel"
  );

/* =========================
   PROFILE DOM
========================= */

const profileGreeting =
  document.getElementById(
    "profileGreeting"
  );

const profileName =
  document.getElementById(
    "profileName"
  );

const profileEmail =
  document.getElementById(
    "profileEmail"
  );

const editProfileBtn =
  document.getElementById(
    "editProfileBtn"
  );

const profileDialog =
  document.getElementById(
    "profileDialog"
  );

const profileForm =
  document.getElementById(
    "profileForm"
  );

const profileFirstNameInput =
  document.getElementById(
    "profileFirstNameInput"
  );

const profileEmailEdit =
  document.getElementById(
    "profileEmailEdit"
  );

const closeProfileDialogBtn =
  document.getElementById(
    "closeProfileDialogBtn"
  );

const weeklyShareName =
  document.getElementById(
    "weeklyShareName"
  );

const weeklyShareRange =
  document.getElementById(
    "weeklyShareRange"
  );

const weeklyShareDays =
  document.getElementById(
    "weeklyShareDays"
  );

const weeklyShareSummary =
  document.getElementById(
    "weeklyShareSummary"
  );

const weeklyShareCard =
  document.getElementById(
    "weeklyShareCard"
  );

const weeklyShareFooter =
  document.getElementById(
    "weeklyShareFooter"
  );

const shareWeekTitle =
  document.getElementById(
    "shareWeekTitle"
  );

const shareWeekPrevBtn =
  document.getElementById(
    "shareWeekPrevBtn"
  );

const shareWeekNextBtn =
  document.getElementById(
    "shareWeekNextBtn"
  );

const shareWeekCurrentBtn =
  document.getElementById(
    "shareWeekCurrentBtn"
  );

const shareWeekBtn =
  document.getElementById(
    "shareWeekBtn"
  );

const shareHypeProfileBtn =
  document.getElementById(
    "shareHypeProfileBtn"
  );

const logoutBtn =
  document.getElementById(
    "logoutBtn"
  );

/* =========================
   PROFILE CLEANUP
========================= */

function cleanupProfileHeadings() {
  if (!profileView) {
    return;
  }

  const elements =
    profileView.querySelectorAll(
      "h1, h2, h3, h4, .eyebrow, .section-label, .section-title"
    );

  elements.forEach(
    element => {
      const text =
        element.textContent
          .replace(/\s+/g, " ")
          .trim()
          .toUpperCase();

      if (text === "DEIN HYPE") {
        element.remove();
        return;
      }

      if (
        weeklyShareCard &&
        weeklyShareCard.contains(
          element
        ) &&
        text === "HYPE" &&
        !element.closest("button") &&
        !element.closest("a")
      ) {
        element.remove();
      }
    }
  );

  if (weeklyShareCard) {
    weeklyShareCard
      .querySelectorAll("*")
      .forEach(
        element => {
          const text =
            element.textContent
              .replace(/\s+/g, " ")
              .trim()
              .toUpperCase();

          if (
            text === "HYPE" &&
            element.children.length === 0 &&
            !element.closest("button") &&
            !element.closest("a")
          ) {
            element.remove();
          }
        }
      );
  }
}

/* =========================
   PROFILE / SHARE STYLES
========================= */

function ensureProfileShareStyles() {
  if (
    document.getElementById(
      "hypeProfileShareStyles"
    )
  ) {
    return;
  }

  const style =
    document.createElement("style");

  style.id =
    "hypeProfileShareStyles";

  style.textContent = `
    #profileView #profileGreeting {
      margin-bottom: 28px;
    }

    #profileView #profileName {
      display: block;
      margin: 0 0 7px 0;
      line-height: 1.15;
    }

    #profileView #profileEmail {
      display: block;
      margin: 0;
      line-height: 1.45;
      overflow-wrap: anywhere;
    }

    #profileView #profileEmailEdit {
      display: block;
      margin: 10px 0 0 0;
      line-height: 1.4;
      overflow-wrap: anywhere;
    }

    #profileView #editProfileBtn {
      display: inline-flex;
      align-items: center;
      justify-content: center;
      margin-top: 18px;
      white-space: nowrap;
    }

    #profileView #weeklyShareCard {
      overflow: hidden;
    }

    /* =========================
       ACCOUNT
    ========================= */

    #profileView .hype-account-details {
      display: flex;
      flex-direction: column;
      align-items: center;
      gap: 0;
      margin-top: 18px;
      padding: 24px 20px 22px;
      border: 1px solid rgba(255,255,255,.08);
      border-radius: 20px;
      background:
        linear-gradient(
          180deg,
          rgba(255,255,255,.025),
          rgba(255,255,255,.012)
        ),
        #12151a;
      text-align: center;
    }

    #profileView .hype-profile-avatar-display {
      display: flex;
      align-items: center;
      justify-content: center;
      width: 104px;
      height: 104px;
      margin: 0 auto 18px;
      border: 1px solid rgba(255,255,255,.12);
      border-radius: 50%;
      background:
        linear-gradient(
          180deg,
          rgba(255,255,255,.035),
          rgba(255,255,255,.01)
        ),
        #181b20;
      color: #8d949e;
      font-size: 38px;
      line-height: 1;
      overflow: hidden;
      box-shadow: 0 10px 30px rgba(0,0,0,.20);
    }

    #profileView .hype-profile-avatar-display img {
      display: block;
      width: 100%;
      height: 100%;
      object-fit: cover;
    }

    #profileView .hype-profile-avatar-display.is-empty {
      color: #737b86;
    }

    #profileView .hype-account-details .hype-account-label {
      display: block;
      margin: 0 0 9px;
      color: #8d949e;
      font-size: 10px;
      line-height: 1;
      font-weight: 850;
      letter-spacing: .18em;
      text-transform: uppercase;
    }

    #profileView .hype-account-details #profileName {
      margin: 0 0 7px;
      color: #f5f6f7;
      font-size: clamp(25px, 6vw, 34px);
      line-height: 1.05;
      font-weight: 900;
      letter-spacing: -.035em;
    }

    #profileView .hype-account-details #profileEmail {
      margin: 0;
      color: #9aa1aa;
      font-size: 14px;
      line-height: 1.45;
      overflow-wrap: anywhere;
    }

    #profileView .hype-account-details #editProfileBtn {
      display: inline-flex;
      align-items: center;
      justify-content: center;
      min-height: 44px;
      margin: 18px 0 0;
      padding: 0 20px;
      border: 1px solid rgba(215,255,63,.42);
      border-radius: 12px;
      background: rgba(215,255,63,.055);
      color: #d7ff3f;
      box-shadow: none;
      font-family: inherit;
      font-size: 12px;
      font-weight: 850;
      line-height: 1;
      white-space: nowrap;
      cursor: pointer;
    }

    #profileView .hype-account-details #editProfileBtn:hover {
      background: rgba(215,255,63,.10);
      border-color: rgba(215,255,63,.65);
    }

    /* Alte Profilbild-Steuerung nicht mehr auf der Hauptseite anzeigen */
    #profileView .hype-profile-image-button,
    #profileView .hype-profile-file,
    #profileView .hype-profile-avatar-button {
      display: none !important;
    }

    /* =========================
       PROFIL-DIALOG
    ========================= */

    #profileDialog .hype-profile-image-editor {
      display: flex;
      flex-direction: column;
      align-items: center;
      gap: 12px;
      margin: 18px 0 20px;
      padding: 18px;
      border: 1px solid rgba(255,255,255,.08);
      border-radius: 16px;
      background: rgba(255,255,255,.018);
    }

    #profileDialog .hype-profile-dialog-preview {
      display: flex;
      align-items: center;
      justify-content: center;
      width: 88px;
      height: 88px;
      border: 1px solid rgba(255,255,255,.12);
      border-radius: 50%;
      background: #181b20;
      color: #737b86;
      font-size: 30px;
      overflow: hidden;
    }

    #profileDialog .hype-profile-dialog-preview img {
      display: block;
      width: 100%;
      height: 100%;
      object-fit: cover;
    }

    #profileDialog .hype-profile-image-editor-label {
      color: #8d949e;
      font-size: 11px;
      line-height: 1.35;
      text-align: center;
    }

    #profileDialog .hype-profile-image-editor input[type="file"] {
      display: block;
      width: 100%;
      max-width: 100%;
      min-height: 44px;
      padding: 5px;
      border: 1px solid rgba(255,255,255,.08);
      border-radius: 12px;
      background: #12151a;
      color: #8d949e;
      font-family: inherit;
      font-size: 11px;
      line-height: 32px;
      box-sizing: border-box;
    }

    #profileDialog .hype-profile-image-editor input[type="file"]::file-selector-button {
      margin-right: 10px;
      padding: 8px 13px;
      border: 1px solid rgba(255,255,255,.12);
      border-radius: 9px;
      background: #1b1f25;
      color: #f5f6f7;
      font-family: inherit;
      font-size: 11px;
      font-weight: 750;
      cursor: pointer;
    }

    /* =========================
       WOCHEN-SHARE NAVIGATION
    ========================= */

    #profileView .hype-share-week-navigation {
      display: grid;
      grid-template-columns: 44px minmax(0, 1fr) 44px;
      align-items: center;
      gap: 12px;
      width: 100%;
      margin-top: 18px;
      margin-bottom: 14px;
    }

    #profileView .hype-share-week-arrow {
      appearance: none;
      -webkit-appearance: none;
      display: flex;
      align-items: center;
      justify-content: center;
      width: 44px;
      height: 44px;
      padding: 0;
      border: 1px solid rgba(255,255,255,.10);
      border-radius: 13px;
      background: #15181d;
      color: #f5f6f7;
      box-shadow: none;
      font-family: inherit;
      font-size: 26px;
      font-weight: 500;
      line-height: 1;
      cursor: pointer;
      transition:
        background .15s ease,
        border-color .15s ease,
        color .15s ease,
        transform .15s ease;
    }

    #profileView .hype-share-week-arrow:hover {
      background: #1d2127;
      border-color: rgba(215,255,63,.35);
      color: #d7ff3f;
    }

    #profileView .hype-share-week-arrow:active {
      transform: scale(.96);
    }

    #profileView .hype-share-week-center {
      min-width: 0;
      text-align: center;
    }

    #profileView .hype-share-week-label {
      display: block;
      margin-bottom: 7px;
      color: #6f7680;
      font-size: 9px;
      line-height: 1;
      font-weight: 850;
      letter-spacing: .16em;
      text-transform: uppercase;
    }

    #profileView .hype-share-week-value {
      display: block;
      color: #f5f6f7;
      font-size: clamp(14px, 4vw, 17px);
      line-height: 1.25;
      font-weight: 850;
      letter-spacing: -.015em;
    }

    #profileView .hype-share-current-week {
      display: flex;
      justify-content: center;
      margin-bottom: 30px;
    }

    #profileView .hype-share-current-week button {
      appearance: none;
      -webkit-appearance: none;
      min-height: 34px;
      padding: 0 14px;
      border: 1px solid rgba(215,255,63,.18);
      border-radius: 999px;
      background: rgba(215,255,63,.055);
      color: #d7ff3f;
      box-shadow: none;
      font-family: inherit;
      font-size: 9px;
      line-height: 1;
      font-weight: 850;
      letter-spacing: .11em;
      text-transform: uppercase;
      cursor: pointer;
    }

    #profileView .hype-share-current-week button:hover {
      background: rgba(215,255,63,.10);
      border-color: rgba(215,255,63,.35);
    }

    #profileView .hype-share-legacy-control {
      display: none !important;
    }

    #profileView #weeklyShareName,
    #profileView #weeklyShareRange {
      display: none !important;
      visibility: hidden !important;
      height: 0 !important;
      margin: 0 !important;
      padding: 0 !important;
      overflow: hidden !important;
    }

    /* =========================
       7 TAGE – NUR EMOJIS
    ========================= */

    #profileView #weeklyShareDays {
      display: grid;
      grid-template-columns: repeat(7, minmax(0, 1fr));
      gap: 7px;
      width: 100%;
      margin: 0;
    }

    #profileView .weekly-share-day {
      min-width: 0;
      min-height: 154px;
      padding: 12px 7px 11px;
      border: 1px solid rgba(255,255,255,.10);
      border-radius: 15px;
      background:
        linear-gradient(
          180deg,
          rgba(255,255,255,.018),
          rgba(255,255,255,.005)
        ),
        #12151a;
      overflow: hidden;
      box-sizing: border-box;
    }

    #profileView .weekly-share-day.completed {
      border-color: rgba(215,255,63,.45);
      background:
        linear-gradient(
          180deg,
          rgba(215,255,63,.09),
          rgba(215,255,63,.025)
        ),
        #12151a;
    }

    #profileView .weekly-share-day-top {
      display: flex;
      flex-direction: column;
      align-items: center;
      gap: 5px;
      margin-bottom: 18px;
      text-align: center;
    }

    #profileView .weekly-share-day-top span {
      color: #858c96;
      font-size: 8px;
      line-height: 1;
      font-weight: 850;
      letter-spacing: .07em;
      text-transform: uppercase;
    }

    #profileView .weekly-share-day-top strong {
      color: #f5f6f7;
      font-size: 21px;
      line-height: 1;
      font-weight: 900;
    }

    #profileView .weekly-share-day-training {
      display: flex;
      flex-wrap: wrap;
      align-content: flex-start;
      justify-content: center;
      gap: 9px;
      min-width: 0;
      min-height: 72px;
    }

    #profileView .weekly-share-day-training-item {
      display: flex;
      align-items: center;
      justify-content: center;
      min-width: 0;
      padding: 0;
    }

    #profileView .weekly-share-day-training-main {
      display: flex;
      align-items: center;
      justify-content: center;
      gap: 0;
      min-width: 0;
    }

    #profileView .weekly-share-day-training-icon {
      display: block;
      flex: 0 0 auto;
      font-size: 25px;
      line-height: 1;
    }

    #profileView .weekly-share-day-training-title,
    #profileView .weekly-share-day-training-meta,
    #profileView .weekly-share-day-training .more-training {
      display: none !important;
    }

    #profileView .weekly-share-day-training .empty-day {
      display: none !important;
    }

    #profileView .weekly-share-day-training-item.completed-training-item
    .weekly-share-day-training-icon {
      filter: drop-shadow(0 0 5px rgba(215,255,63,.28));
    }

    /* =========================
       SUMMARY
    ========================= */

    #profileView #weeklyShareSummary {
      margin-top: 16px;
    }

    #profileView .weekly-share-stats {
      display: grid;
      grid-template-columns: repeat(2, minmax(0, 1fr));
      gap: 10px;
    }

    #profileView .weekly-share-stats.has-distance {
      grid-template-columns: repeat(3, minmax(0, 1fr));
    }

    #profileView .weekly-share-stat {
      min-width: 0;
      padding: 15px 14px;
      border: 1px solid rgba(255,255,255,.08);
      border-radius: 14px;
      background: #12151a;
    }

    #profileView .weekly-share-stat strong {
      display: block;
      margin: 0 0 4px;
      color: #d7ff3f;
      font-size: 22px;
      line-height: 1;
      font-weight: 900;
    }

    #profileView .weekly-share-stat span {
      display: block;
      color: #8d949e;
      font-size: 9px;
      line-height: 1.2;
      font-weight: 800;
      letter-spacing: .08em;
      text-transform: uppercase;
    }

    #profileView .weekly-share-empty {
      padding: 17px 16px;
      border: 1px solid rgba(255,255,255,.08);
      border-radius: 14px;
      background: #12151a;
    }

    #profileView .weekly-share-empty strong {
      display: block;
      margin: 0 0 5px;
      color: #f5f6f7;
      font-size: 14px;
      line-height: 1.3;
      font-weight: 850;
    }

    #profileView .weekly-share-empty span {
      display: block;
      color: #8d949e;
      font-size: 12px;
      line-height: 1.45;
    }

    #profileView #weeklyShareFooter {
      display: none !important;
    }

    #profileView #shareWeekBtn {
      width: 100%;
      margin-top: 18px;
      min-height: 48px;
      border-radius: 13px;
    }

    #profileView #shareHypeProfileBtn {
      width: 100%;
      min-height: 48px;
      border-radius: 13px;
    }

    /* =========================
       INSTAGRAM-VORSCHAU
    ========================= */

    #profileView .weekly-share-image-preview {
      margin-top: 18px;
      padding: 14px;
      border: 1px solid rgba(255,255,255,.08);
      border-radius: 16px;
      background: #111419;
    }

    #profileView .weekly-share-image-preview-head {
      display: flex;
      align-items: center;
      justify-content: space-between;
      gap: 12px;
      margin-bottom: 12px;
    }

    #profileView .weekly-share-image-preview-head > div {
      min-width: 0;
    }

    #profileView .weekly-share-image-preview-head strong {
      display: block;
      margin-top: 5px;
      color: #f5f6f7;
      font-size: 14px;
      line-height: 1.2;
    }

    #profileView .weekly-share-preview-close {
      flex: 0 0 auto;
      width: 34px;
      height: 34px;
      padding: 0;
      border: 1px solid rgba(255,255,255,.10);
      border-radius: 10px;
      background: #181b20;
      color: #f5f6f7;
      font-size: 20px;
      line-height: 1;
    }

    #profileView .weekly-share-image {
      display: block;
      width: 100%;
      height: auto;
      border-radius: 12px;
      background: #0b0d10;
    }

    /* =========================
       EMPFEHLEN – EINE ZEILE
    ========================= */

    #profileView .hype-referral-title {
      display: block !important;
      width: 100% !important;
      max-width: 100% !important;
      margin-bottom: 22px !important;
      color: #f5f6f7 !important;
      font-size: clamp(14px, 3.7vw, 30px) !important;
      line-height: 1 !important;
      font-weight: 900 !important;
      letter-spacing: -.045em !important;
      white-space: nowrap !important;
      overflow: hidden !important;
      text-overflow: clip !important;
      word-break: keep-all !important;
    }

    @media (max-width: 620px) {
      #profileView .hype-account-details {
        padding: 21px 17px 20px;
      }

      #profileView .hype-account-details #editProfileBtn {
        width: 100%;
      }

      #profileView .hype-referral-title {
        font-size: clamp(13px, 3.8vw, 25px) !important;
      }
    }

    @media (max-width: 520px) {
      #profileView .hype-share-week-navigation {
        grid-template-columns: 40px minmax(0, 1fr) 40px;
        gap: 9px;
      }

      #profileView .hype-share-week-arrow {
        width: 40px;
        height: 40px;
        border-radius: 12px;
      }

      #profileView #weeklyShareDays {
        gap: 5px;
      }

      #profileView .weekly-share-day {
        min-height: 148px;
        padding: 11px 5px 9px;
        border-radius: 12px;
      }

      #profileView .weekly-share-day-top {
        margin-bottom: 16px;
      }

      #profileView .weekly-share-day-top span {
        font-size: 8px;
      }

      #profileView .weekly-share-day-top strong {
        font-size: 18px;
      }

      #profileView .weekly-share-day-training {
        gap: 7px;
      }

      #profileView .weekly-share-day-training-icon {
        font-size: 22px;
      }

      #profileView .weekly-share-stats {
        gap: 7px;
      }

      #profileView .weekly-share-stats.has-distance {
        grid-template-columns: repeat(2, minmax(0, 1fr));
      }
    }

    @media (max-width: 390px) {
      #profileView #weeklyShareDays {
        gap: 4px;
      }

      #profileView .weekly-share-day {
        padding-left: 4px;
        padding-right: 4px;
      }

      #profileView .weekly-share-day-training-icon {
        font-size: 20px;
      }

      #profileView .hype-referral-title {
        font-size: 12.5px !important;
      }
    }
  `;

  document.head.appendChild(style);
}

/* =========================
   PROFILE IMAGE STORAGE
========================= */

function getProfileImageKey(userId) {
  return `${PROFILE_IMAGE_KEY_PREFIX}${userId}`;
}

function getSavedProfileImage(userId) {
  if (!userId) {
    return "";
  }

  try {
    return (
      localStorage.getItem(
        getProfileImageKey(userId)
      ) || ""
    );
  } catch (error) {
    console.error(
      "HYPE profile image read error:",
      error
    );

    return "";
  }
}

function saveProfileImage(
  userId,
  dataUrl
) {
  if (!userId || !dataUrl) {
    return;
  }

  localStorage.setItem(
    getProfileImageKey(userId),
    dataUrl
  );
}

function compressProfileImage(file) {
  return new Promise(
    (
      resolve,
      reject
    ) => {
      if (!file) {
        reject(
          new Error(
            "Keine Bilddatei ausgewählt."
          )
        );

        return;
      }

      if (
        !file.type.startsWith(
          "image/"
        )
      ) {
        reject(
          new Error(
            "Bitte wähle eine Bilddatei aus."
          )
        );

        return;
      }

      const reader =
        new FileReader();

      reader.onload =
        event => {
          const image =
            new Image();

          image.onload =
            () => {
              const maxSize =
                600;

              const scale =
                Math.min(
                  1,
                  maxSize /
                    Math.max(
                      image.width,
                      image.height
                    )
                );

              const width =
                Math.max(
                  1,
                  Math.round(
                    image.width *
                      scale
                  )
                );

              const height =
                Math.max(
                  1,
                  Math.round(
                    image.height *
                      scale
                  )
                );

              const canvas =
                document.createElement(
                  "canvas"
                );

              canvas.width =
                width;

              canvas.height =
                height;

              const ctx =
                canvas.getContext(
                  "2d"
                );

              if (!ctx) {
                reject(
                  new Error(
                    "Das Bild konnte nicht verarbeitet werden."
                  )
                );

                return;
              }

              ctx.drawImage(
                image,
                0,
                0,
                width,
                height
              );

              const dataUrl =
                canvas.toDataURL(
                  "image/jpeg",
                  0.82
                );

              resolve(
                dataUrl
              );
            };

          image.onerror =
            () => {
              reject(
                new Error(
                  "Das Bild konnte nicht gelesen werden."
                )
              );
            };

          image.src =
            event.target.result;
        };

      reader.onerror =
        () => {
          reject(
            new Error(
              "Die Bilddatei konnte nicht gelesen werden."
            )
          );
        };

      reader.readAsDataURL(
        file
      );
    }
  );
}

/* =========================
   PROFILE IMAGE EDITOR
========================= */

function ensureProfileImageEditor(
  currentImage = ""
) {
  if (
    !profileDialog ||
    !profileForm
  ) {
    return null;
  }

  let editor =
    profileDialog.querySelector(
      ".hype-profile-image-editor"
    );

  if (!editor) {
    editor =
      document.createElement(
        "div"
      );

    editor.className =
      "hype-profile-image-editor";

    const preview =
      document.createElement(
        "div"
      );

    preview.className =
      "hype-profile-dialog-preview";

    const label =
      document.createElement(
        "div"
      );

    label.className =
      "hype-profile-image-editor-label";

    label.textContent =
      "Profilbild auswählen";

    const input =
      document.createElement(
        "input"
      );

    input.type =
      "file";

    input.accept =
      "image/*";

    input.id =
      "profileImageInput";

    editor.appendChild(
      preview
    );

    editor.appendChild(
      label
    );

    editor.appendChild(
      input
    );

    const emailElement =
      profileEmailEdit;

    if (
      emailElement &&
      emailElement.parentElement ===
        profileForm
    ) {
      emailElement.insertAdjacentElement(
        "afterend",
        editor
      );
    } else {
      const submitButton =
        profileForm.querySelector(
          'button[type="submit"]'
        );

      if (submitButton) {
        profileForm.insertBefore(
          editor,
          submitButton
        );
      } else {
        profileForm.appendChild(
          editor
        );
      }
    }

    input.addEventListener(
      "change",
      async event => {
        const file =
          event.target.files?.[0];

        if (!file) {
          return;
        }

        try {
          pendingProfileImage =
            await compressProfileImage(
              file
            );

          updateProfileImageDialogPreview(
            pendingProfileImage
          );
        } catch (error) {
          console.error(
            "HYPE profile image error:",
            error
          );

          alert(
            error.message ||
            "Das Profilbild konnte nicht geladen werden."
          );

          input.value =
            "";
        }
      }
    );
  }

  const preview =
    editor.querySelector(
      ".hype-profile-dialog-preview"
    );

  if (pendingProfileImage) {
    updateProfileImageDialogPreview(
      pendingProfileImage
    );
  } else {
    updateProfileImageDialogPreview(
      currentImage
    );
  }

  return editor;
}

function updateProfileImageDialogPreview(
  image
) {
  const preview =
    profileDialog?.querySelector(
      ".hype-profile-dialog-preview"
    );

  if (!preview) {
    return;
  }

  if (image) {
    preview.innerHTML = `
      <img
        src="${image}"
        alt="Profilbild Vorschau"
      >
    `;

    return;
  }

  preview.innerHTML =
    "👤";
}

/* =========================
   PROFILE ACCOUNT IMAGE
========================= */

function renderProfileAccountImage(
  image
) {
  if (!profileView) {
    return;
  }

  let details =
    profileView.querySelector(
      ".hype-account-details"
    );

  if (!details) {
    return;
  }

  let avatar =
    details.querySelector(
      ".hype-profile-avatar-display"
    );

  if (!avatar) {
    avatar =
      document.createElement(
        "div"
      );

    avatar.className =
      "hype-profile-avatar-display";

    details.insertBefore(
      avatar,
      details.firstChild
    );
  }

  if (image) {
    avatar