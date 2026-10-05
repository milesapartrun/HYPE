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

  cardio: {
    icon: "❤️",
    label: "Sonstige Cardioeinheit",
    placeholder: "z. B. Crosstrainer"
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

const PROFILE_IMAGE_KEY_PREFIX =
  "hype_profile_image_v1:";

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
   SPORT-AUSWAHL ERGÄNZEN
========================= */

function ensureSportOptions() {
  if (!sportInput) {
    return;
  }

  const existingCardioOption =
    sportInput.querySelector(
      'option[value="cardio"]'
    );

  if (!existingCardioOption) {
    const cardioOption =
      document.createElement("option");

    cardioOption.value =
      "cardio";

    cardioOption.textContent =
      "❤️ Sonstige Cardioeinheit";

    sportInput.appendChild(
      cardioOption
    );
  }
}

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
      position: relative !important;

      display: grid !important;

      grid-template-columns:
        minmax(0, 1fr) 104px !important;

      grid-template-areas:
        "label avatar"
        "name avatar"
        "email avatar"
        "button avatar" !important;

      align-items: center !important;

      column-gap: 24px !important;

      margin-top: 18px;

      padding: 24px 20px;

      border: 1px solid rgba(255,255,255,.08);

      border-radius: 20px;

      background:
        linear-gradient(
          180deg,
          rgba(255,255,255,.025),
          rgba(255,255,255,.012)
        ),
        #12151a;

      text-align: left;
    }

    #profileView .hype-account-details
    .hype-account-label {
      display: block;

      grid-area: label;

      margin: 0 0 9px;

      color: #8d949e;

      font-size: 10px;
      line-height: 1;

      font-weight: 850;

      letter-spacing: .18em;

      text-transform: uppercase;
    }

    #profileView .hype-account-details
    #profileName {
      grid-area: name;

      margin: 0 0 7px;

      color: #f5f6f7;

      font-size: clamp(25px, 6vw, 34px);

      line-height: 1.05;

      font-weight: 900;

      letter-spacing: -.035em;
    }

    #profileView .hype-account-details
    #profileEmail {
      grid-area: email;

      margin: 0;

      color: #9aa1aa;

      font-size: 14px;

      line-height: 1.45;

      overflow-wrap: anywhere;
    }

    #profileView .hype-account-details
    #editProfileBtn {
      grid-area: button;

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

    #profileView .hype-account-details
    #editProfileBtn:hover {
      background: rgba(215,255,63,.10);

      border-color:
        rgba(215,255,63,.65);
    }

    /* =========================
       PROFILBILD
    ========================= */

    #profileView .hype-account-details
    .hype-profile-avatar-display {
      grid-area: avatar !important;

      display: flex !important;

      align-items: center !important;

      justify-content: center !important;

      justify-self: end !important;

      align-self: center !important;

      width: 104px !important;

      height: 104px !important;

      min-width: 104px !important;

      min-height: 104px !important;

      margin: 0 !important;

      padding: 0 !important;

      border: 2px solid
        rgba(255,255,255,.14) !important;

      border-radius: 50% !important;

      background:
        linear-gradient(
          180deg,
          rgba(255,255,255,.035),
          rgba(255,255,255,.01)
        ),
        #181b20 !important;

      color: #737b86 !important;

      font-size: 38px !important;

      line-height: 1 !important;

      overflow: hidden !important;

      box-sizing: border-box !important;

      box-shadow:
        0 10px 30px
        rgba(0,0,0,.20) !important;

      z-index: 20 !important;
    }

    #profileView .hype-account-details
    .hype-profile-avatar-display img {
      display: block !important;

      width: 100% !important;

      height: 100% !important;

      min-width: 100% !important;

      min-height: 100% !important;

      object-fit: cover !important;

      border-radius: 50% !important;
    }

    #profileView .hype-account-details
    .hype-profile-avatar-display.is-empty {
      display: flex !important;
    }

    #profileView .hype-account-details
    .hype-profile-avatar-display.has-image {
      background: #181b20 !important;
    }

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

      border: 1px solid
        rgba(255,255,255,.08);

      border-radius: 16px;

      background:
        rgba(255,255,255,.018);
    }

    #profileDialog .hype-profile-dialog-preview {
      display: flex;

      align-items: center;

      justify-content: center;

      width: 88px;

      height: 88px;

      border: 1px solid
        rgba(255,255,255,.12);

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

    #profileDialog
    .hype-profile-image-editor
    input[type="file"] {
      display: block;

      width: 100%;

      max-width: 100%;

      min-height: 44px;

      padding: 5px;

      border: 1px solid
        rgba(255,255,255,.08);

      border-radius: 12px;

      background: #12151a;

      color: #8d949e;

      font-family: inherit;

      font-size: 11px;

      line-height: 32px;

      box-sizing: border-box;
    }

    #profileDialog
    .hype-profile-image-editor
    input[type="file"]::file-selector-button {
      margin-right: 10px;

      padding: 8px 13px;

      border: 1px solid
        rgba(255,255,255,.12);

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

      grid-template-columns:
        44px minmax(0, 1fr) 44px;

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

      border: 1px solid
        rgba(255,255,255,.10);

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

      border-color:
        rgba(215,255,63,.35);

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

      border: 1px solid
        rgba(215,255,63,.18);

      border-radius: 999px;

      background:
        rgba(215,255,63,.055);

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
      background:
        rgba(215,255,63,.10);

      border-color:
        rgba(215,255,63,.35);
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
       7 TAGE
    ========================= */

    #profileView #weeklyShareDays {
      display: grid;

      grid-template-columns:
        repeat(7, minmax(0, 1fr));

      gap: 7px;

      width: 100%;

      margin: 0;
    }

    #profileView .weekly-share-day {
      min-width: 0;

      min-height: 154px;

      padding: 12px 7px 11px;

      border: 1px solid
        rgba(255,255,255,.10);

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
      border-color:
        rgba(215,255,63,.45);

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

    #profileView
    .weekly-share-day-training-item
    .weekly-share-day-training-icon {
      filter: none;
    }

    #profileView
    .weekly-share-day-training-item.completed-training-item
    .weekly-share-day-training-icon {
      filter:
        drop-shadow(
          0 0 5px
          rgba(215,255,63,.28)
        );
    }

    /* =========================
       SUMMARY
    ========================= */

    #profileView #weeklyShareSummary {
      margin-top: 16px;
    }

    #profileView .weekly-share-stats {
      display: grid;

      grid-template-columns:
        repeat(2, minmax(0, 1fr));

      gap: 10px;
    }

    #profileView .weekly-share-stats.has-distance {
      grid-template-columns:
        repeat(3, minmax(0, 1fr));
    }

    #profileView .weekly-share-stat {
      min-width: 0;

      padding: 15px 14px;

      border: 1px solid
        rgba(255,255,255,.08);

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

      border: 1px solid
        rgba(255,255,255,.08);

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

      border: 1px solid
        rgba(255,255,255,.08);

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

    #profileView
    .weekly-share-image-preview-head > div {
      min-width: 0;
    }

    #profileView
    .weekly-share-image-preview-head strong {
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

      border: 1px solid
        rgba(255,255,255,.10);

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
       EMPFEHLEN
    ========================= */

    #profileView .hype-referral-title {
      display: block !important;

      width: 100% !important;

      max-width: 100% !important;

      margin-bottom: 22px !important;

      color: #f5f6f7 !important;

      font-size:
        clamp(13px, 3.8vw, 30px) !important;

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
        grid-template-columns:
          minmax(0, 1fr) 88px !important;

        column-gap: 16px !important;

        padding:
          21px 17px 20px;
      }

      #profileView
      .hype-account-details
      #editProfileBtn {
        width: 100%;
      }

      #profileView
      .hype-account-details
      .hype-profile-avatar-display {
        width: 88px !important;

        height: 88px !important;

        min-width: 88px !important;

        min-height: 88px !important;

        font-size: 32px !important;
      }

      #profileView .hype-referral-title {
        font-size:
          clamp(13px, 3.8vw, 25px) !important;
      }
    }

    @media (max-width: 520px) {
      #profileView .hype-share-week-navigation {
        grid-template-columns:
          40px minmax(0, 1fr) 40px;

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

        padding:
          11px 5px 9px;

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
        grid-template-columns:
          repeat(2, minmax(0, 1fr));
      }
    }

    @media (max-width: 390px) {
      #profileView .hype-account-details {
        grid-template-columns:
          minmax(0, 1fr) 72px !important;

        column-gap: 10px !important;
      }

      #profileView
      .hype-account-details
      .hype-profile-avatar-display {
        width: 72px !important;

        height: 72px !important;

        min-width: 72px !important;

        min-height: 72px !important;

        font-size: 27px !important;
      }

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
  if (!userId) {
    return;
  }

  try {
    if (dataUrl) {
      localStorage.setItem(
        getProfileImageKey(userId),
        dataUrl
      );
    } else {
      localStorage.removeItem(
        getProfileImageKey(userId)
      );
    }
  } catch (error) {
    console.error(
      "HYPE profile image save error:",
      error
    );

    throw new Error(
      "Das Profilbild konnte nicht gespeichert werden."
    );
  }
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
                512;

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

              ctx.fillStyle =
                "#181b20";

              ctx.fillRect(
                0,
                0,
                width,
                height
              );

              ctx.drawImage(
                image,
                0,
                0,
                width,
                height
              );

              resolve(
                canvas.toDataURL(
                  "image/jpeg",
                  0.82
                )
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

  updateProfileImageDialogPreview(
    pendingProfileImage ||
      currentImage
  );

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

  preview.innerHTML = "";

  if (image) {
    const img =
      document.createElement(
        "img"
      );

    img.src =
      image;

    img.alt =
      "Profilbild Vorschau";

    preview.appendChild(
      img
    );

    return;
  }

  preview.textContent =
    "👤";
}

/* =========================
   PROFILE ACCOUNT IMAGE
========================= */

function renderProfileAccountImage(
  image = ""
) {
  if (!profileView) {
    return;
  }

  /*
   * Der Account-Block muss existieren.
   */
  let details =
    profileView.querySelector(
      ".hype-account-details"
    );

  /*
   * Falls der Block noch nicht existiert,
   * hier zuverlässig erzeugen.
   */
  if (!details && profileName) {
    const parent =
      profileName.parentElement;

    if (parent) {
      details =
        document.createElement(
          "div"
        );

      details.className =
        "hype-account-details";

      parent.insertBefore(
        details,
        profileName
      );

      const accountLabel =
        Array.from(
          parent.querySelectorAll(
            "h1, h2, h3, h4, p, span, div"
          )
        ).find(
          element => {
            const text =
              element.textContent
                .replace(
                  /\s+/g,
                  " "
                )
                .trim()
                .toUpperCase();

            return (
              text === "ACCOUNT"
            );
          }
        );

      if (
        accountLabel &&
        accountLabel.parentElement !==
          details
      ) {
        details.appendChild(
          accountLabel
        );
      }

      if (profileName) {
        details.appendChild(
          profileName
        );
      }

      if (profileEmail) {
        details.appendChild(
          profileEmail
        );
      }

      if (editProfileBtn) {
        details.appendChild(
          editProfileBtn
        );
      }
    }
  }

  if (!details) {
    return;
  }

  /*
   * Profilbild IMMER rechts erzeugen.
   */
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

    avatar.setAttribute(
      "aria-label",
      "Profilbild"
    );

    details.appendChild(
      avatar
    );
  }

  /*
   * Gespeichertes Bild anzeigen.
   */
  if (image) {
    avatar.innerHTML =
      "";

    const img =
      document.createElement(
        "img"
      );

    img.src =
      image;

    img.alt =
      "Profilbild";

    avatar.appendChild(
      img
    );

    avatar.classList.add(
      "has-image"
    );

    avatar.classList.remove(
      "is-empty"
    );
  } else {
    /*
     * Noch kein Bild:
     * Platzhalter anzeigen.
     */
    avatar.innerHTML =
      "👤";

    avatar.classList.add(
      "is-empty"
    );

    avatar.classList.remove(
      "has-image"
    );
  }
}

/* =========================
   PROFILE POLISH
========================= */

function polishProfileLayout() {
  if (!profileView) {
    return;
  }

  /* =========================
     ACCOUNT BLOCK
  ========================= */

  if (
    profileName &&
    profileEmail &&
    editProfileBtn
  ) {
    const parent =
      profileName.parentElement;

    if (
      parent &&
      profileEmail.parentElement ===
        parent &&
      editProfileBtn.parentElement ===
        parent &&
      !parent.querySelector(
        ".hype-account-details"
      )
    ) {
      const details =
        document.createElement(
          "div"
        );

      details.className =
        "hype-account-details";

      parent.insertBefore(
        details,
        profileName
      );

      details.appendChild(
        profileName
      );

      details.appendChild(
        profileEmail
      );

      details.appendChild(
        editProfileBtn
      );
    }
  }

  let accountDetails =
    profileView.querySelector(
      ".hype-account-details"
    );

  if (accountDetails) {
    let accountLabel =
      accountDetails.querySelector(
        ".hype-account-label"
      );

    if (!accountLabel) {
      const possibleLabel =
        Array.from(
          profileView.querySelectorAll(
            "h1, h2, h3, h4, p, span, div"
          )
        ).find(
          element => {
            const text =
              element.textContent
                .replace(
                  /\s+/g,
                  " "
                )
                .trim()
                .toUpperCase();

            return (
              text === "ACCOUNT" &&
              !element.closest(
                ".weekly-share-card"
              )
            );
          }
        );

      if (
        possibleLabel &&
        possibleLabel !==
          accountDetails
      ) {
        accountLabel =
          possibleLabel;

        if (
          accountLabel.parentElement !==
          accountDetails
        ) {
          accountDetails.insertBefore(
            accountLabel,
            profileName
          );
        }
      }
    }

    if (accountLabel) {
      accountLabel.classList.add(
        "hype-account-label"
      );
    }

    /*
     * Profilbild IMMER aus dem aktuellen
     * Benutzerkonto laden.
     */
    const userId =
      profileView.dataset.userId ||
      "";

    const savedImage =
      getSavedProfileImage(
        userId
      );

    renderProfileAccountImage(
      savedImage
    );
  }

  /* =========================
     ACCOUNT LABEL
  ========================= */

  profileView
    .querySelectorAll(
      "h1, h2, h3, h4, p, span, div"
    )
    .forEach(
      element => {
        const text =
          element.textContent
            .replace(
              /\s+/g,
              " "
            )
            .trim()
            .toUpperCase();

        if (
          text ===
          "ACCOUNT"
        ) {
          element.classList.add(
            "hype-account-label"
          );
        }

        if (
          text ===
          "TRAINIERT JEMAND GENAU SO GERNE WIE DU?"
        ) {
          element.classList.add(
            "hype-referral-title"
          );
        }
      }
    );

  /* =========================
     PROFILBILD / DATEI
  ========================= */

  profileView
    .querySelectorAll(
      'input[type="file"]'
    )
    .forEach(
      input => {
        input.classList.add(
          "hype-profile-file"
        );
      }
    );

  profileView
    .querySelectorAll("button")
    .forEach(
      button => {
        const text =
          button.textContent
            .replace(
              /\s+/g,
              " "
            )
            .trim();

        if (
          text.includes(
            "Profilbild ändern"
          )
        ) {
          button.classList.add(
            "hype-profile-image-button"
          );
        }

        if (
          /^\?\s*\+$/.test(
            text
          )
        ) {
          button.classList.add(
            "hype-profile-avatar-button"
          );
        }
      }
    );
}

/* =========================
   TRAINING INPUT HELPERS
========================= */

function formatNumber(value) {
  const number =
    Number(value);

  if (!Number.isFinite(number)) {
    return "0";
  }

  return number.toLocaleString(
    "de-DE",
    {
      maximumFractionDigits: 2
    }
  );
}

function getSportLabel(session) {
  if (
    session?.sport === "other"
  ) {
    const custom =
      String(
        session.customSport || ""
      ).trim();

    return (
      custom ||
      "Sonstige Sportart"
    );
  }

  const meta =
    sportMeta[
      session?.sport
    ] ||
    sportMeta.running;

  return meta.label;
}

function getSportIcon(session) {
  const meta =
    sportMeta[
      session?.sport
    ] ||
    sportMeta.running;

  return meta.icon;
}

function sportSupportsDistance(
  sport
) {
  return (
    sport === "running" ||
    sport === "hyrox" ||
    sport === "cardio"
  );
}

function getSessionMetricText(session) {
  if (
    sportSupportsDistance(
      session?.sport
    ) &&
    session?.runMetric === "distance"
  ) {
    return `${formatNumber(
      session.distance
    )} km`;
  }

  return `${formatNumber(
    session?.duration
  )} min`;
}

function getSessionDurationMinutes(session) {
  if (
    sportSupportsDistance(
      session?.sport
    ) &&
    session?.runMetric === "distance"
  ) {
    return 0;
  }

  return Number(
    session?.duration || 0
  );
}

function getSessionRunningDistance(session) {
  if (
    sportSupportsDistance(
      session?.sport
    ) &&
    session?.runMetric === "distance"
  ) {
    return Number(
      session?.distance || 0
    );
  }

  return 0;
}

function updateTrainingInputVisibility(
  resetValue = false
) {
  const sport =
    sportInput?.value || "running";

  const supportsDistance =
    sportSupportsDistance(
      sport
    );

  const isOther =
    sport === "other";

  if (customSportField) {
    customSportField.classList.toggle(
      "hidden",
      !isOther
    );
  }

  if (customSportInput) {
    customSportInput.required =
      isOther;
  }

  if (runningMetricInput) {
    runningMetricInput.parentElement?.classList.toggle(
      "hidden",
      !supportsDistance
    );
  }

  if (supportsDistance) {
    const metric =
      runningMetricInput?.value ||
      "duration";

    if (metricValueLabel) {
      metricValueLabel.textContent =
        metric === "distance"
          ? "Kilometer"
          : "Dauer";
    }

    durationInput.min =
      metric === "distance"
        ? "0.1"
        : "1";

    durationInput.step =
      metric === "distance"
        ? "0.1"
        : "1";

    if (
      resetValue &&
      runningMetricInput
    ) {
      if (
        metric === "distance"
      ) {
        durationInput.value =
          "";
      } else {
        durationInput.value =
          45;
      }
    }
  } else {
    if (metricValueLabel) {
      metricValueLabel.textContent =
        "Dauer";
    }

    durationInput.min =
      "1";

    durationInput.step =
      "1";
  }
}

function updateTitlePlaceholder() {
  const meta =
    sportMeta[
      sportInput.value
    ] ||
    sportMeta.running;

  if (
    sportInput.value === "other" &&
    customSportInput &&
    customSportInput.value.trim()
  ) {
    titleInput.placeholder =
      `z. B. ${customSportInput.value.trim()}`;
  } else {
    titleInput.placeholder =
      meta.placeholder;
  }

  updateTrainingInputVisibility();
}

/* =========================
   SHARE WOCHEN-NAVIGATION
========================= */

function ensureShareWeekNavigation() {
  if (!weeklyShareCard) {
    return;
  }

  if (
    document.getElementById(
      "hypeShareWeekNavigation"
    )
  ) {
    return;
  }

  [
    shareWeekPrevBtn,
    shareWeekNextBtn,
    shareWeekCurrentBtn,
    shareWeekTitle
  ].forEach(
    element => {
      if (!element) {
        return;
      }

      element.classList.add(
        "hype-share-legacy-control"
      );
    }
  );

  const navigation =
    document.createElement("div");

  navigation.id =
    "hypeShareWeekNavigation";

  navigation.className =
    "hype-share-week-navigation";

  const previousButton =
    document.createElement("button");

  previousButton.type =
    "button";

  previousButton.className =
    "hype-share-week-arrow";

  previousButton.textContent =
    "‹";

  previousButton.setAttribute(
    "aria-label",
    "Vorherige Woche"
  );

  previousButton.addEventListener(
    "click",
    () => {
      moveShareWeek(-1);
    }
  );

  const center =
    document.createElement("div");

  center.className =
    "hype-share-week-center";

  const label =
    document.createElement("span");

  label.className =
    "hype-share-week-label";

  label.textContent =
    "AUSGEWÄHLTE WOCHE";

  const value =
    document.createElement("strong");

  value.id =
    "hypeShareWeekValue";

  value.className =
    "hype-share-week-value";

  center.appendChild(label);
  center.appendChild(value);

  const nextButton =
    document.createElement("button");

  nextButton.type =
    "button";

  nextButton.className =
    "hype-share-week-arrow";

  nextButton.textContent =
    "›";

  nextButton.setAttribute(
    "aria-label",
    "Nächste Woche"
  );

  nextButton.addEventListener(
    "click",
    () => {
      moveShareWeek(1);
    }
  );

  navigation.appendChild(
    previousButton
  );

  navigation.appendChild(
    center
  );

  navigation.appendChild(
    nextButton
  );

  const currentWeekRow =
    document.createElement("div");

  currentWeekRow.id =
    "hypeShareCurrentWeek";

  currentWeekRow.className =
    "hype-share-current-week";

  const currentWeekButton =
    document.createElement("button");

  currentWeekButton.type =
    "button";

  currentWeekButton.textContent =
    "Aktuelle Woche";

  currentWeekButton.setAttribute(
    "aria-label",
    "Aktuelle Woche auswählen"
  );

  currentWeekButton.addEventListener(
    "click",
    () => {
      shareWeekStart =
        startOfWeek(
          new Date()
        );

      renderWeeklySharePreview();
    }
  );

  currentWeekRow.appendChild(
    currentWeekButton
  );

  if (weeklyShareName) {
    weeklyShareName.parentNode.insertBefore(
      navigation,
      weeklyShareName
    );

    weeklyShareName.parentNode.insertBefore(
      currentWeekRow,
      weeklyShareName
    );
  } else {
    weeklyShareCard.appendChild(
      navigation
    );

    weeklyShareCard.appendChild(
      currentWeekRow
    );
  }
}

/* =========================
   HELPERS
========================= */

function pad(value) {
  return String(value).padStart(
    2,
    "0"
  );
}

function iso(date) {
  return [
    date.getFullYear(),
    pad(date.getMonth() + 1),
    pad(date.getDate())
  ].join("-");
}

function parseDate(value) {
  const [
    year,
    month,
    day
  ] = value.split("-").map(
    Number
  );

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
  const d =
    new Date(date);

  d.setHours(
    12,
    0,
    0,
    0
  );

  const day =
    d.getDay();

  const diff =
    day === 0
      ? -6
      : 1 - day;

  d.setDate(
    d.getDate() + diff
  );

  return d;
}

function endOfWeek(date) {
  const d =
    startOfWeek(date);

  d.setDate(
    d.getDate() + 6
  );

  return d;
}

function addDays(
  date,
  amount
) {
  const d =
    new Date(date);

  d.setDate(
    d.getDate() + amount
  );

  return d;
}

function addMonths(
  date,
  amount
) {
  const d =
    new Date(date);

  d.setDate(1);

  d.setMonth(
    d.getMonth() + amount
  );

  return d;
}

function addYears(
  date,
  amount
) {
  const d =
    new Date(date);

  d.setDate(1);
  d.setMonth(0);

  d.setFullYear(
    d.getFullYear() + amount
  );

  return d;
}

function esc(value) {
  return String(value ?? "")
    .replace(
      /&/g,
      "&amp;"
    )
    .replace(
      /</g,
      "&lt;"
    )
    .replace(
      />/g,
      "&gt;"
    )
    .replace(
      /"/g,
      "&quot;"
    )
    .replace(
      /'/g,
      "&#039;"
    );
}

function formatLongDate(date) {
  return new Intl.DateTimeFormat(
    "de-DE",
    {
      weekday: "long",
      day: "numeric",
      month: "long"
    }
  ).format(date);
}

function formatShortDate(date) {
  return new Intl.DateTimeFormat(
    "de-DE",
    {
      day: "numeric",
      month: "short"
    }
  ).format(date);
}

function formatMonthYear(date) {
  return new Intl.DateTimeFormat(
    "de-DE",
    {
      month: "long",
      year: "numeric"
    }
  ).format(date);
}

function formatShareWeek(date) {
  const start =
    startOfWeek(date);

  const end =
    endOfWeek(date);

  const startText =
    new Intl.DateTimeFormat(
      "de-DE",
      {
        day: "numeric",
        month: "short"
      }
    ).format(start);

  const endText =
    new Intl.DateTimeFormat(
      "de-DE",
      {
        day: "numeric",
        month: "short"
      }
    ).format(end);

  return `${startText} – ${endText}`;
}

function isToday(date) {
  return (
    iso(date) ===
    iso(new Date())
  );
}

function isFutureDate(
  dateString
) {
  const today =
    new Date();

  today.setHours(
    0,
    0,
    0,
    0
  );

  const target =
    parseDate(dateString);

  target.setHours(
    0,
    0,
    0,
    0
  );

  return target > today;
}

function getFutureMessage(
  dateString
) {
  const date =
    parseDate(dateString);

  if (
    iso(
      addDays(
        new Date(),
        1
      )
    ) === dateString
  ) {
    return "Diese Einheit kommt erst morgen. Du kannst sie noch nicht abhaken.";
  }

  return `Diese Einheit kommt erst am ${formatLongDate(
    date
  )}. Du kannst sie noch nicht abhaken.`;
}

/* =========================
   USER / PROFILE
========================= */

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
        "HYPE user lookup error:",
        error
      );

      return null;
    }

    return data?.user || null;

  } catch (error) {
    console.error(
      "HYPE profile error:",
      error
    );

    return null;
  }
}

async function getUserFirstName() {
  const user =
    await getProfileUser();

  const firstName =
    user?.user_metadata?.first_name;

  return firstName
    ? String(
        firstName
      ).trim()
    : "";
}

/* =========================
   PROFILE
========================= */

async function renderProfile() {
  const user =
    await getProfileUser();

  if (!user) {
    return;
  }

  /*
   * Benutzer-ID speichern.
   */
  if (profileView) {
    profileView.dataset.userId =
      user.id;
  }

  shareWeekStart =
    startOfWeek(
      new Date()
    );

  cleanupProfileHeadings();

  ensureProfileShareStyles();

  const firstName =
    user?.user_metadata?.first_name
      ? String(
          user.user_metadata.first_name
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
      user.email || "";
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

  /*
   * Account-Layout zuerst aufbauen.
   */
  polishProfileLayout();

  /*
   * Danach gespeichertes Profilbild laden.
   */
  const savedImage =
    getSavedProfileImage(
      user.id
    );

  /*
   * Profilbild rechts anzeigen.
   */
  renderProfileAccountImage(
    savedImage
  );

  /*
   * Share-Bereich.
   */
  renderWeeklySharePreview(
    displayName
  );

  /*
   * Dialog vorbereiten.
   */
  if (profileDialog) {
    ensureProfileImageEditor(
      savedImage
    );
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
}

/* =========================
   PROFILE EDIT
========================= */

async function openProfileDialog(
  focusInput = false
) {
  if (!profileDialog) {
    return;
  }

  pendingProfileImage =
    null;

  const user =
    await getProfileUser();

  const savedImage =
    user
      ? getSavedProfileImage(
          user.id
        )
      : "";

  ensureProfileImageEditor(
    savedImage
  );

  if (profileFirstNameInput) {
    const firstName =
      await getUserFirstName();

    profileFirstNameInput.value =
      firstName || "";

    if (focusInput) {
      setTimeout(
        () => {
          profileFirstNameInput.focus();
        },
        100
      );
    }
  }

  if (
    typeof profileDialog.showModal ===
    "function"
  ) {
    if (!profileDialog.open) {
      profileDialog.showModal();
    }
  } else {
    profileDialog.setAttribute(
      "open",
      ""
    );
  }
}

function closeProfileDialog() {
  if (!profileDialog) {
    return;
  }

  pendingProfileImage =
    null;

  if (
    typeof profileDialog.close ===
    "function"
  ) {
    profileDialog.close();
  } else {
    profileDialog.removeAttribute(
      "open"
    );
  }
}

async function saveProfileName() {
  if (!profileFirstNameInput) {
    return;
  }

  const firstName =
    profileFirstNameInput.value.trim();

  if (!firstName) {
    alert(
      "Bitte gib deinen Vornamen ein."
    );

    profileFirstNameInput.focus();

    return;
  }

  if (firstName.length > 40) {
    alert(
      "Der Vorname darf maximal 40 Zeichen haben."
    );

    return;
  }

  if (
    typeof updateProfileFirstName !==
    "function"
  ) {
    alert(
      "Die Profilfunktion ist momentan nicht verfügbar."
    );

    return;
  }

  const submitButton =
    profileForm?.querySelector(
      'button[type="submit"]'
    );

  if (submitButton) {
    submitButton.disabled =
      true;

    submitButton.textContent =
      "Speichern …";
  }

  try {
    const result =
      await updateProfileFirstName(
        firstName
      );

    if (!result?.success) {
      throw new Error(
        result?.error ||
        "Der Name konnte nicht gespeichert werden."
      );
    }

    const user =
      await getProfileUser();

    /*
     * Profilbild speichern.
     */
    if (
      user &&
      pendingProfileImage
    ) {
      saveProfileImage(
        user.id,
        pendingProfileImage
      );
    }

    pendingProfileImage =
      null;

    closeProfileDialog();

    /*
     * Profil komplett neu laden.
     * Dadurch erscheint das Bild sofort rechts.
     */
    await renderProfile();

  } catch (error) {
    console.error(
      "HYPE profile save error:",
      error
    );

    alert(
      error.message ||
      "Der Name konnte nicht gespeichert werden."
    );

  } finally {
    if (submitButton) {
      submitButton.disabled =
        false;

      submitButton.textContent =
        "Profil speichern";
    }
  }
}

/* =========================
   STORAGE
========================= */

function loadSessions() {
  try {
    const raw =
      localStorage.getItem(
        KEY
      );

    if (!raw) {
      return [];
    }

    const data =
      JSON.parse(raw);

    if (!Array.isArray(data)) {
      return [];
    }

    return data.map(
      session => {
        return {
          ...session,

          completed:
            Boolean(
              session.completed
            ),

          actualIntensity:
            session.actualIntensity ===
            undefined
              ? null
              : session.actualIntensity,

          postNotes:
            session.postNotes || "",

          customSport:
            session.customSport || "",

          distance:
            session.distance ===
              undefined ||
            session.distance ===
              null
              ? null
              : Number(
                  session.distance
                ),

          duration:
            session.duration ===
              undefined ||
            session.duration ===
              null
              ? null
              : Number(
                  session.duration
                ),

          runMetric:
            session.runMetric ||
            (
              sportSupportsDistance(
                session.sport
              ) &&
              session.distance !==
                undefined &&
              session.distance !==
                null
                ? "distance"
                : "duration"
            )
        };
      }
    );

  } catch (error) {
    console.error(
      "HYPE storage error:",
      error
    );

    return [];
  }
}

function save() {
  localStorage.setItem(
    KEY,
    JSON.stringify(
      sessions
    )
  );
}

/* =========================
   SESSION QUERIES
========================= */

function sessionsForDate(
  dateString
) {
  return sessions
    .filter(
      session =>
        session.date ===
        dateString
    )
    .sort(
      (a, b) =>
        Number(
          a.createdAt || 0
        ) -
        Number(
          b.createdAt || 0
        )
    );
}

function sessionsForWeek(
  date
) {
  const start =
    startOfWeek(date);

  const end =
    endOfWeek(date);

  const startIso =
    iso(start);

  const endIso =
    iso(end);

  return sessions.filter(
    session =>
      session.date >=
        startIso &&
      session.date <=
        endIso
  );
}

function sessionsForMonth(
  date
) {
  const year =
    date.getFullYear();

  const month =
    date.getMonth();

  return sessions.filter(
    session => {
      const d =
        parseDate(
          session.date
        );

      return (
        d.getFullYear() ===
          year &&
        d.getMonth() ===
          month
      );
    }
  );
}

function sessionsForYear(
  year
) {
  return sessions.filter(
    session =>
      parseDate(
        session.date
      ).getFullYear() ===
      year
  );
}

/* =========================
   SHARE WEEK
========================= */

function setShareWeek(
  date
) {
  shareWeekStart =
    startOfWeek(date);

  renderWeeklySharePreview();
}

function moveShareWeek(
  amount
) {
  shareWeekStart =
    addDays(
      shareWeekStart,
      amount * 7
    );

  renderWeeklySharePreview();
}

function renderWeeklySharePreview(
  displayName
) {
  ensureProfileShareStyles();
  ensureShareWeekNavigation();
  cleanupProfileHeadings();

  const weekStart =
    startOfWeek(
      shareWeekStart
    );

  const weekEnd =
    endOfWeek(
      weekStart
    );

  const weekSessions =
    sessionsForWeek(
      weekStart
    );

  const completed =
    weekSessions.filter(
      session =>
        session.completed
    );

  const totalMinutes =
    completed.reduce(
      (
        sum,
        session
      ) =>
        sum +
        getSessionDurationMinutes(
          session
        ),
      0
    );

  const totalDistance =
    completed.reduce(
      (
        sum,
        session
      ) =>
        sum +
        getSessionRunningDistance(
          session
        ),
      0
    );

  const cleanName =
    displayName ||
    profileDisplayName ||
    "Deine";

  profileDisplayName =
    cleanName;

  const newWeekValue =
    document.getElementById(
      "hypeShareWeekValue"
    );

  if (newWeekValue) {
    newWeekValue.textContent =
      formatShareWeek(
        weekStart
      );
  }

  if (shareWeekPrevBtn) {
    shareWeekPrevBtn.textContent =
      "‹";

    shareWeekPrevBtn.setAttribute(
      "aria-label",
      "Vorherige Woche"
    );
  }

  if (shareWeekNextBtn) {
    shareWeekNextBtn.textContent =
      "›";

    shareWeekNextBtn.setAttribute(
      "aria-label",
      "Nächste Woche"
    );
  }

  if (shareWeekCurrentBtn) {
    shareWeekCurrentBtn.textContent =
      "Aktuelle Woche";

    shareWeekCurrentBtn.setAttribute(
      "aria-label",
      "Aktuelle Woche auswählen"
    );
  }

  if (shareWeekTitle) {
    shareWeekTitle.textContent =
      "";

    shareWeekTitle.style.display =
      "none";
  }

  if (weeklyShareName) {
    weeklyShareName.textContent =
      "";

    weeklyShareName.style.display =
      "none";

    weeklyShareName.style.visibility =
      "hidden";

    weeklyShareName.style.height =
      "0";

    weeklyShareName.style.margin =
      "0";

    weeklyShareName.style.padding =
      "0";
  }

  if (weeklyShareRange) {
    weeklyShareRange.textContent =
      "";

    weeklyShareRange.style.display =
      "none";

    weeklyShareRange.style.visibility =
      "hidden";

    weeklyShareRange.style.height =
      "0";

    weeklyShareRange.style.margin =
      "0";

    weeklyShareRange.style.padding =
      "0";
  }

  if (weeklyShareDays) {
    const days = [];

    for (
      let i = 0;
      i < 7;
      i++
    ) {
      const date =
        addDays(
          weekStart,
          i
        );

      const daySessions =
        sessionsForDate(
          iso(date)
        );

      const completedDay =
        daySessions.filter(
          session =>
            session.completed
        );

      const weekday =
        new Intl.DateTimeFormat(
          "de-DE",
          {
            weekday:
              "short"
          }
        )
          .format(date)
          .replace(
            ".",
            ""
          );

      days.push(`
        <div
          class="weekly-share-day ${
            completedDay.length
              ? "completed"
              : ""
          }"
        >

          <div class="weekly-share-day-top">

            <span>
              ${esc(
                weekday
              )}
            </span>

            <strong>
              ${date.getDate()}
            </strong>

          </div>

          <div class="weekly-share-day-training">

            ${
              daySessions.length
                ? daySessions
                    .map(
                      session =>
                        `
                          <div
                            class="
                              weekly-share-day-training-item
                              ${
                                session.completed
                                  ? "completed-training-item"
                                  : ""
                              }
                            "
                          >

                            <div class="weekly-share-day-training-main">

                              <span class="weekly-share-day-training-icon">
                                ${esc(
                                  getSportIcon(
                                    session
                                  )
                                )}
                              </span>

                            </div>

                          </div>
                        `
                    )
                    .join("")
                : ""
            }

          </div>

        </div>
      `);
    }

    weeklyShareDays.innerHTML =
      days.join("");
  }

  if (weeklyShareSummary) {
    if (!weekSessions.length) {
      weeklyShareSummary.innerHTML = `
        <div class="weekly-share-empty">

          <strong>
            Noch kein Training in dieser Woche
          </strong>

          <span>
            Für diese Woche sind noch keine Einheiten geplant.
          </span>

        </div>
      `;

    } else {
      weeklyShareSummary.innerHTML = `
        <div class="weekly-share-stats ${
          totalDistance > 0
            ? "has-distance"
            : ""
        }">

          <div class="weekly-share-stat">

            <strong>
              ${completed.length}
            </strong>

            <span>
              ${
                completed.length ===
                1
                  ? "Training erledigt"
                  : "Trainings erledigt"
              }
            </span>

          </div>

          <div class="weekly-share-stat">

            <strong>
              ${formatNumber(
                totalMinutes
              )}
            </strong>

            <span>
              Minuten erledigt
            </span>

          </div>

          ${
            totalDistance > 0
              ? `
                <div class="weekly-share-stat">

                  <strong>
                    ${formatNumber(
                      totalDistance
                    )}
                  </strong>

                  <span>
                    Kilometer gelaufen
                  </span>

                </div>
              `
              : ""
          }

        </div>
      `;
    }
  }

  if (weeklyShareFooter) {
    weeklyShareFooter.innerHTML =
      "";

    weeklyShareFooter.style.display =
      "none";
  }
}

/* =========================
   SHARE HYPE
========================= */

async function shareHype() {
  const shareData = {
    title:
      "HYPE – HYbrid Plan & Execution",

    text:
      "Ich nutze HYPE für meine Trainingsplanung. Probier's aus:",

    url:
      window.location.href
  };

  try {
    if (navigator.share) {
      await navigator.share(
        shareData
      );

      return;
    }

    await copyHypeLink();

    alert(
      "Der HYPE-Link wurde kopiert. Du kannst ihn jetzt über WhatsApp, Instagram oder Nachrichten verschicken."
    );

  } catch (error) {
    if (
      error?.name ===
      "AbortError"
    ) {
      return;
    }

    console.error(
      "HYPE share error:",
      error
    );

    await copyHypeLink();

    alert(
      "Der HYPE-Link wurde kopiert."
    );
  }
}

async function copyHypeLink() {
  const text =
    `HYPE – HYbrid Plan & Execution\n${window.location.href}`;

  try {
    await navigator.clipboard.writeText(
      text
    );
  } catch (error) {
    console.error(
      "HYPE clipboard error:",
      error
    );
  }
}

/* =========================
   WEEK SHARE IMAGE
========================= */

async function createWeeklyShareImage() {
  const firstName =
    await getUserFirstName();

  const displayName =
    firstName ||
    "Athlete";

  const weekStart =
    startOfWeek(
      shareWeekStart
    );

  const weekEnd =
    endOfWeek(
      weekStart
    );

  const weekSessions =
    sessionsForWeek(
      weekStart
    );

  const completed =
    weekSessions.filter(
      session =>
        session.completed
    );

  const totalMinutes =
    completed.reduce(
      (
        sum,
        session
      ) =>
        sum +
        getSessionDurationMinutes(
          session
        ),
      0
    );

  const totalDistance =
    completed.reduce(
      (
        sum,
        session
      ) =>
        sum +
        getSessionRunningDistance(
          session
        ),
      0
    );

  const canvas =
    document.createElement(
      "canvas"
    );

  canvas.width = 1080;
  canvas.height = 1920;

  const ctx =
    canvas.getContext(
      "2d"
    );

  if (!ctx) {
    throw new Error(
      "Canvas wird nicht unterstützt."
    );
  }

  ctx.fillStyle =
    "#0b0d10";

  ctx.fillRect(
    0,
    0,
    1080,
    1920
  );

  const glow =
    ctx.createRadialGradient(
      870,
      150,
      0,
      870,
      150,
      720
    );

  glow.addColorStop(
    0,
    "rgba(215,255,63,.18)"
  );

  glow.addColorStop(
    0.45,
    "rgba(215,255,63,.05)"
  );

  glow.addColorStop(
    1,
    "rgba(215,255,63,0)"
  );

  ctx.fillStyle =
    glow;

  ctx.fillRect(
    0,
    0,
    1080,
    1920
  );

  ctx.fillStyle =
    "#d7ff3f";

  ctx.fillRect(
    80,
    72,
    120,
    6
  );

  ctx.fillStyle =
    "#f5f6f7";

  ctx.font =
    "900 74px Arial";

  ctx.fillText(
    "HYPE",
    80,
    155
  );

  ctx.fillStyle =
    "#8d949e";

  ctx.font =
    "700 20px Arial";

  ctx.fillText(
    "HYBRID PLAN & EXECUTION",
    83,
    190
  );

  ctx.fillStyle =
    "#d7ff3f";

  ctx.font =
    "800 20px Arial";

  ctx.fillText(
    "DEINE WOCHE",
    80,
    275
  );

  ctx.fillStyle =
    "#f5f6f7";

  ctx.font =
    "900 58px Arial";

  const nameTitle =
    `${displayName}s Woche`;

  ctx.fillText(
    nameTitle,
    80,
    350
  );

  ctx.fillStyle =
    "#8d949e";

  ctx.font =
    "600 25px Arial";

  ctx.fillText(
    `${formatShortDate(
      weekStart
    )} – ${formatShortDate(
      weekEnd
    )}`,
    83,
    395
  );

  drawShareStat(
    ctx,
    70,
    470,
    String(
      completed.length
    ),
    "TRAININGS",
    300
  );

  drawShareStat(
    ctx,
    390,
    470,
    formatNumber(
      totalMinutes
    ),
    "MINUTEN",
    300
  );

  drawShareStat(
    ctx,
    710,
    470,
    formatNumber(
      totalDistance
    ),
    "KM LAUFEN",
    300
  );

  const dayStartY =
    690;

  const rowHeight =
    143;

  for (
    let i = 0;
    i < 7;
    i++
  ) {
    const date =
      addDays(
        weekStart,
        i
      );

    const daySessions =
      sessionsForDate(
        iso(date)
      );

    const y =
      dayStartY +
      i * rowHeight;

    const hasCompleted =
      daySessions.some(
        session =>
          session.completed
      );

    ctx.fillStyle =
      hasCompleted
        ? "#151a13"
        : "#14171c";

    roundRect(
      ctx,
      70,
      y,
      940,
      116,
      22
    );

    ctx.fill();

    if (hasCompleted) {
      ctx.fillStyle =
        "#d7ff3f";

      ctx.fillRect(
        70,
        y + 22,
        5,
        72
      );
    }

    ctx.fillStyle =
      "#8d949e";

    ctx.font =
      "800 18px Arial";

    const weekday =
      new Intl.DateTimeFormat(
        "de-DE",
        {
          weekday:
            "short"
        }
      )
        .format(date)
        .replace(
          ".",
          ""
        )
        .toUpperCase();

    ctx.fillText(
      weekday,
      105,
      y + 42
    );

    ctx.fillStyle =
      "#f5f6f7";

    ctx.font =
      "900 30px Arial";

    ctx.fillText(
      String(
        date.getDate()
      ),
      106,
      y + 78
    );

    if (!daySessions.length) {
      ctx.fillStyle =
        "#626973";

      ctx.font =
        "600 20px Arial";

      ctx.fillText(
        "Kein Training",
        270,
        y + 62
      );

      continue;
    }

    const visibleSessions =
      daySessions.slice(
        0,
        2
      );

    visibleSessions.forEach(
      (
        session,
        index
      ) => {
        const lineY =
          y +
          39 +
          index * 37;

        ctx.font =
          "28px Arial";

        ctx.fillText(
          getSportIcon(
            session
          ),
          270,
          lineY
        );

        ctx.fillStyle =
          session.completed
            ? "#d7ff3f"
            : "#f5f6f7";

        ctx.font =
          "750 20px Arial";

        const rawTitle =
          String(
            session.title ||
            "Training"
          );

        const maxTitleWidth =
          500;

        const title =
          fitCanvasText(
            ctx,
            rawTitle,
            maxTitleWidth
          );

        ctx.fillText(
          title,
          315,
          lineY
        );

        ctx.fillStyle =
          "#737b86";

        ctx.font =
          "600 16px Arial";

        ctx.fillText(
          getSessionMetricText(
            session
          ),
          855,
          lineY
        );
      }
    );

    if (
      daySessions.length >
      2
    ) {
      ctx.fillStyle =
        "#737b86";

      ctx.font =
        "600 14px Arial";

      ctx.fillText(
        `+${
          daySessions.length -
          2
        } weitere`,
        315,
        y + 101
      );
    }
  }

  ctx.fillStyle =
    "#d7ff3f";

  ctx.font =
    "900 24px Arial";

  ctx.fillText(
    "TRAIN SMART. STAY HYPE.",
    80,
    1770
  );

  return new Promise(
    (
      resolve,
      reject
    ) => {
      canvas.toBlob(
        blob => {
          if (!blob) {
            reject(
              new Error(
                "Die Share-Grafik konnte nicht erstellt werden."
              )
            );

            return;
          }

          resolve(blob);
        },
        "image/png",
        1
      );
    }
  );
}

function fitCanvasText(
  ctx,
  text,
  maxWidth
) {
  const clean =
    String(text || "");

  if (
    ctx.measureText(
      clean
    ).width <= maxWidth
  ) {
    return clean;
  }

  let result =
    clean;

  while (
    result.length > 1 &&
    ctx.measureText(
      `${result}…`
    ).width > maxWidth
  ) {
    result =
      result.slice(
        0,
        -1
      );
  }

  return `${result}…`;
}

function drawShareStat(
  ctx,
  x,
  y,
  value,
  label,
  width = 460
) {
  ctx.fillStyle =
    "#14171c";

  roundRect(
    ctx,
    x,
    y,
    width,
    150,
    24
  );

  ctx.fill();

  ctx.fillStyle =
    "#d7ff3f";

  ctx.font =
    "900 54px Arial";

  ctx.fillText(
    value,
    x + 28,
    y + 68
  );

  ctx.fillStyle =
    "#8d949e";

  ctx.font =
    "800 17px Arial";

  ctx.fillText(
    label,
    x + 29,
    y + 110
  );
}

function roundRect(
  ctx,
  x,
  y,
  width,
  height,
  radius
) {
  ctx.beginPath();

  ctx.moveTo(
    x + radius,
    y
  );

  ctx.lineTo(
    x +
      width -
      radius,
    y
  );

  ctx.quadraticCurveTo(
    x + width,
    y,
    x + width,
    y + radius
  );

  ctx.lineTo(
    x + width,
    y +
      height -
      radius
  );

  ctx.quadraticCurveTo(
    x + width,
    y + height,
    x +
      width -
      radius,
    y + height
  );

  ctx.lineTo(
    x + radius,
    y + height
  );

  ctx.quadraticCurveTo(
    x,
    y + height,
    x,
    y +
      height -
      radius
  );

  ctx.lineTo(
    x,
    y + radius
  );

  ctx.quadraticCurveTo(
    x,
    y,
    x + radius,
    y
  );

  ctx.closePath();
}

/* =========================
   SHARE WEEK ACTION
========================= */

async function shareLastWeek() {
  if (shareWeekBtn) {
    shareWeekBtn.disabled =
      true;

    shareWeekBtn.textContent =
      "Grafik wird erstellt …";
  }

  try {
    const blob =
      await createWeeklyShareImage();

    showShareImagePreview(
      blob
    );

    const file =
      new File(
        [blob],
        "HYPE-meine-Woche.png",
        {
          type:
            "image/png"
        }
      );

    if (
      navigator.share &&
      navigator.canShare &&
      navigator.canShare({
        files: [
          file
        ]
      })
    ) {
      await navigator.share({
        title:
          "Meine Woche mit HYPE",

        text:
          "Meine Trainingswoche mit HYPE.",

        files: [
          file
        ]
      });

      return;
    }

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
      "HYPE-meine-Woche.png";

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

  } catch (error) {
    if (
      error?.name !==
      "AbortError"
    ) {
      console.error(
        "HYPE weekly share error:",
        error
      );

      alert(
        "Die Wochen-Grafik konnte nicht erstellt werden."
      );
    }

  } finally {
    if (shareWeekBtn) {
      shareWeekBtn.disabled =
        false;

      shareWeekBtn.textContent =
        "📸 Auf Instagram teilen";
    }
  }
}

/* =========================
   SHARE IMAGE PREVIEW
========================= */

function showShareImagePreview(
  blob
) {
  if (!weeklyShareCard) {
    return;
  }

  let preview =
    document.getElementById(
      "weeklyShareImagePreview"
    );

  if (!preview) {
    preview =
      document.createElement(
        "div"
      );

    preview.id =
      "weeklyShareImagePreview";

    preview.className =
      "weekly-share-image-preview";

    weeklyShareCard.parentNode.insertBefore(
      preview,
      weeklyShareCard.nextSibling
    );
  }

  const oldUrl =
    preview.dataset.url;

  if (oldUrl) {
    URL.revokeObjectURL(
      oldUrl
    );
  }

  const url =
    URL.createObjectURL(
      blob
    );

  preview.dataset.url =
    url;

  preview.innerHTML = `
    <div class="weekly-share-image-preview-head">

      <div>

        <div class="eyebrow">
          DEINE SHARE-KARTE
        </div>

        <strong>
          Bereit zum Teilen
        </strong>

      </div>

      <button
        type="button"
        class="weekly-share-preview-close"
        aria-label="Vorschau schließen"
      >
        ×
      </button>

    </div>

    <img
      src="${url}"
      alt="HYPE Wochenkarte"
      class="weekly-share-image"
    >
  `;

  const closeButton =
    preview.querySelector(
      ".weekly-share-preview-close"
    );

  if (closeButton) {
    closeButton.addEventListener(
      "click",
      () => {
        const currentUrl =
          preview.dataset.url;

        if (currentUrl) {
          URL.revokeObjectURL(
            currentUrl
          );
        }

        preview.dataset.url =
          "";

        preview.innerHTML =
          "";
      }
    );
  }
}

/* =========================
   CALENDAR EXPORT
========================= */

function calendarEscape(value) {
  return String(value ?? "")
    .replace(
      /\\/g,
      "\\\\"
    )
    .replace(
      /\r?\n/g,
      "\\n"
    )
    .replace(
      /;/g,
      "\\;"
    )
    .replace(
      /,/g,
      "\\,"
    );
}

function calendarDate(date) {
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

function calendarDateTimeUTC(
  date
) {
  return (
    date.getUTCFullYear() +
    pad(
      date.getUTCMonth() + 1
    ) +
    pad(
      date.getUTCDate()
    ) +
    "T" +
    pad(
      date.getUTCHours()
    ) +
    pad(
      date.getUTCMinutes()
    ) +
    pad(
      date.getUTCSeconds()
    ) +
    "Z"
  );
}

function createCalendarFile() {
  const weekStart =
    startOfWeek(
      selected
    );

  const weekEndExclusive =
    addDays(
      weekStart,
      7
    );

  const weekSessions =
    sessions.filter(
      session => {
        if (!session.date) {
          return false;
        }

        const sessionDate =
          parseDate(
            session.date
          );

        return (
          sessionDate >=
            weekStart &&
          sessionDate <
            weekEndExclusive
        );
      }
    );

  if (!weekSessions.length) {
    alert(
      "Für diese Woche sind noch keine Trainings geplant."
    );

    return;
  }

  const dtStamp =
    calendarDateTimeUTC(
      new Date()
    );

  const events =
    weekSessions.map(
      session => {
        const sportLabel =
          getSportLabel(
            session
          );

        const title =
          `${sportLabel} · ${session.title}`;

        let description =
          [
            "HYPE Training",
            `Sport: ${sportLabel}`,
            `Umfang: ${getSessionMetricText(
              session
            )}`,
            `Intensität: ${
              session.intensity ||
              0
            }/5`
          ].join(
            "\n"
          );

        if (session.notes) {
          description +=
            `\n\n${session.notes}`;
        }

        const start =
          parseDate(
            session.date
          );

        const end =
          addDays(
            start,
            1
          );

        const uid =
          `hype-${session.id}@hype`;

        return [
          "BEGIN:VEVENT",
          `UID:${calendarEscape(
            uid
          )}`,
          `DTSTAMP:${dtStamp}`,
          `DTSTART;VALUE=DATE:${calendarDate(
            start
          )}`,
          `DTEND;VALUE=DATE:${calendarDate(
            end
          )}`,
          `SUMMARY:${calendarEscape(
            title
          )}`,
          `DESCRIPTION:${calendarEscape(
            description
          )}`,
          "END:VEVENT"
        ].join(
          "\r\n"
        );
      }
    );

  const calendar =
    [
      "BEGIN:VCALENDAR",
      "VERSION:2.0",
      "PRODID:-//HYPE//Training Planner//DE",
      "CALSCALE:GREGORIAN",
      "METHOD:PUBLISH",
      ...events,
      "END:VCALENDAR"
    ].join(
      "\r\n"
    );

  const blob =
    new Blob(
      [calendar],
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
    `HYPE-${calendarDate(
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

/* =========================
   PLAN
========================= */

function renderPlan() {
  const start =
    startOfWeek(
      selected
    );

  const end =
    endOfWeek(
      selected
    );

  const startText =
    new Intl.DateTimeFormat(
      "de-DE",
      {
        day:
          "numeric",
        month:
          "short"
      }
    ).format(
      start
    );

  const endText =
    new Intl.DateTimeFormat(
      "de-DE",
      {
        day:
          "numeric",
        month:
          "short"
      }
    ).format(
      end
    );

  weekTitle.textContent =
    `${startText} – ${endText}`;

  heroYear.textContent =
    start.getFullYear();

  const weekEyebrow =
    document.querySelector(
      ".week-navigation .eyebrow"
    );

  if (weekEyebrow) {
    const currentWeekStart =
      startOfWeek(
        new Date()
      );

    weekEyebrow.textContent =
      iso(start) ===
      iso(currentWeekStart)
        ? "DIESE WOCHE"
        : "WOCHENPLAN";
  }

  renderWeekStrip();

  selectedDateLabel.textContent =
    formatLongDate(
      selected
    );

  renderSelectedDay();

  renderWeeklyInsight();
}

function renderWeekStrip() {
  weekStrip.innerHTML =
    "";

  const start =
    startOfWeek(
      selected
    );

  const dayNames = [
    "Mo",
    "Di",
    "Mi",
    "Do",
    "Fr",
    "Sa",
    "So"
  ];

  for (
    let i = 0;
    i < 7;
    i++
  ) {
    const date =
      addDays(
        start,
        i
      );

    const dateString =
      iso(date);

    const daySessions =
      sessionsForDate(
        dateString
      );

    const button =
      document.createElement(
        "button"
      );

    button.className =
      "day" +
      (
        dateString ===
        iso(selected)
          ? " active"
          : ""
      );

    button.type =
      "button";

    const todayLabel =
      isToday(date)
        ? `<span class="today-label">HEUTE</span>`
        : `<span class="today-label">&nbsp;</span>`;

    button.innerHTML = `
      ${dayNames[i]}

      <strong>
        ${date.getDate()}
      </strong>

      ${todayLabel}

      ${
        daySessions.length
          ? `<span class="dot"></span>`
          : `<span style="display:block;height:5px;margin-top:7px;"></span>`
      }
    `;

    button.addEventListener(
      "click",
      () => {
        selected =
          date;

        renderPlan();
      }
    );

    weekStrip.appendChild(
      button
    );
  }
}

function renderSelectedDay() {
  const list =
    sessionsForDate(
      iso(selected)
    );

  if (!list.length) {
    sessionsEl.innerHTML = `
      <div class="empty">
        Für diesen Tag ist noch kein Training geplant.
      </div>
    `;

    return;
  }

  sessionsEl.innerHTML =
    list
      .map(
        renderSessionCard
      )
      .join("");

  attachSessionEvents(
    sessionsEl
  );
}

/* =========================
   SESSION CARD
========================= */

function renderSessionCard(
  session
) {
  const dots =
    Array.from({
      length: 5
    })
      .map(
        (
          _,
          index
        ) =>
          index <
          Number(
            session.intensity ||
              0
          )
            ? "●"
            : "○"
      )
      .join("");

  const actualOptions = [
    [0, "entspannend"],
    [1, "sehr leicht"],
    [2, "leicht"],
    [3, "moderat"],
    [4, "hart"],
    [5, "sehr hart"]
  ];

  const actualSelect =
    actualOptions
      .map(
        (
          [
            value,
            label
          ]
        ) =>
          `
            <option
              value="${value}"
              ${
                Number(
                  session.actualIntensity
                ) ===
                value
                  ? "selected"
                  : ""
              }
            >
              ${value} · ${label}
            </option>
          `
      )
      .join("");

  return `
    <article
      class="session ${
        session.completed
          ? "completed"
          : ""
      }"
      data-id="${esc(
        session.id
      )}"
    >

      <div class="sport-icon">
        ${getSportIcon(
          session
        )}
      </div>

      <div class="session-content">

        <div class="session-title-row">

          <h4>
            ${esc(
              session.title
            )}
          </h4>

          ${
            session.completed
              ? `
                <span class="completed-label">
                  ERLEDIGT
                </span>
              `
              : ""
          }

        </div>

        <p>
          ${esc(
            getSportLabel(
              session
            )
          )}
          ·
          ${esc(
            getSessionMetricText(
              session
            )
          )}
        </p>

        <p>
          ${dots}
        </p>

        ${
          session.notes
            ? `
              <p>
                ${esc(
                  session.notes
                )}
              </p>
            `
            : ""
        }

        ${
          session.completed
            ? `
              <div class="actual-intensity">

                <span>
                  Gefühlt:
                </span>

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
                  >${esc(
                    session.postNotes ||
                    ""
                  )}</textarea>

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

function attachSessionEvents(
  container
) {
  container
    .querySelectorAll(
      ".session"
    )
    .forEach(
      card => {
        const id =
          card.dataset.id;

        const session =
          sessions.find(
            item =>
              item.id ===
              id
          );

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
            if (
              !session.completed &&
              isFutureDate(
                session.date
              )
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
              !session.completed
            ) {
              session.actualIntensity =
                null;

              session.postNotes =
                "";
            }

            save();

            renderAll();
          }
        );

        editButton.addEventListener(
          "click",
          () => {
            openEditDialog(
              session
            );
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
                item =>
                  item.id !==
                  id
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
                Number(
                  actualIntensity.value
                );

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
      }
    );
}

/* =========================
   WEEKLY INSIGHT
========================= */

function renderWeeklyInsight() {
  const weekSessions =
    sessionsForWeek(
      selected
    );

  const completed =
    weekSessions.filter(
      session =>
        session.completed
    ).length;

  const planned =
    weekSessions.length;

  if (!planned) {
    weeklyInsight.innerHTML = `
      <div class="insight-icon">
        ✦
      </div>

      <div>

        <strong>
          Deine Woche ist noch frei.
        </strong>

        <p>
          Plane deine ersten Einheiten und baue dir
          deine Woche Schritt für Schritt auf.
        </p>

      </div>
    `;

    return;
  }

  const remaining =
    planned -
    completed;

  let text =
    `${completed} von ${planned} Einheiten erledigt.`;

  if (
    remaining > 0
  ) {
    text +=
      ` ${remaining} ${
        remaining === 1
          ? "Einheit ist"
          : "Einheiten sind"
      } noch offen.`;
  } else {
    text +=
      " Stark – deine Woche ist komplett.";
  }

  weeklyInsight.innerHTML = `
    <div class="insight-icon">
      ✦
    </div>

    <div>

      <strong>
        Wochenstatus
      </strong>

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

  if (
    overviewPeriod ===
    "week"
  ) {
    renderOverviewWeek();
  }

  if (
    overviewPeriod ===
    "month"
  ) {
    renderOverviewMonth();
  }

  if (
    overviewPeriod ===
    "year"
  ) {
    renderOverviewYear();
  }
}

function renderPeriodButtons() {
  document
    .querySelectorAll(
      ".period-btn"
    )
    .forEach(
      button => {
        button.classList.toggle(
          "active",
          button.dataset.period ===
            overviewPeriod
        );
      }
    );
}

function renderPeriodNavigation() {
  if (
    overviewPeriod ===
    "week"
  ) {
    const start =
      startOfWeek(
        overviewDate
      );

    const end =
      endOfWeek(
        overviewDate
      );

    const startText =
      new Intl.DateTimeFormat(
        "de-DE",
        {
          day:
            "numeric",
          month:
            "short"
        }
      ).format(
        start
      );

    const endText =
      new Intl.DateTimeFormat(
        "de-DE",
        {
          day:
            "numeric",
          month:
            "short"
        }
      ).format(
        end
      );

    periodTitle.textContent =
      `${startText} – ${endText} ${start.getFullYear()}`;

    return;
  }

  if (
    overviewPeriod ===
    "month"
  ) {
    periodTitle.textContent =
      formatMonthYear(
        overviewDate
      );

    return;
  }

  periodTitle.textContent =
    overviewDate.getFullYear();
}

function renderOverviewWeek() {
  const start =
    startOfWeek(
      overviewDate
    );

  let html =
    `<div class="overview-week">`;

  for (
    let i = 0;
    i < 7;
    i++
  ) {
    const date =
      addDays(
        start,
        i
      );

    const dateString =
      iso(date);

    const daySessions =
      sessionsForDate(
        dateString
      );

    const completed =
      daySessions.filter(
        session =>
          session.completed
      ).length;

    html += `
      <section
        class="overview-day ${
          isToday(date)
            ? "today"
            : ""
        }"
        data-date="${dateString}"
      >

        <div class="overview-day-head">

          <div class="overview-day-date">

            <span class="overview-day-name">
              ${
                new Intl.DateTimeFormat(
                  "de-DE",
                  {
                    weekday:
                      "long"
                  }
                ).format(
                  date
                )
              }
            </span>

            <span class="overview-day-number">
              ${
                date.getDate()
              }.${
                pad(
                  date.getMonth() +
                    1
                )
              }.
            </span>

          </div>

          <span
            class="overview-day-status ${
              daySessions.length &&
              completed ===
                daySessions.length
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

    if (
      !daySessions.length
    ) {
      html += `
        <div class="overview-empty-day">
          Keine Einheit geplant
        </div>
      `;
    } else {
      daySessions.forEach(
        session => {
          html += `
            <div
              class="overview-mini-session"
            >

              <div class="mini-icon">
                ${getSportIcon(
                  session
                )}
              </div>

              <div>

                <div class="mini-title">
                  ${esc(
                    session.title
                  )}
                </div>

                <div class="mini-meta">
                  ${esc(
                    getSportLabel(
                      session
                    )
                  )}
                  ·
                  ${esc(
                    getSessionMetricText(
                      session
                    )
                  )}
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
        }
      );
    }

    html += `
        </div>

      </section>
    `;
  }

  html +=
    `</div>`;

  overviewContent.innerHTML =
    html;

  attachOverviewDayNavigation();
}

function attachOverviewDayNavigation() {
  overviewContent
    .querySelectorAll(
      ".overview-day"
    )
    .forEach(
      dayElement => {
        const dateString =
          dayElement.dataset.date;

        dayElement.addEventListener(
          "click",
          event => {
            event.preventDefault();

            selected =
              parseDate(
                dateString
              );

            setView(
              "plan"
            );
          }
        );
      }
    );
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
    firstDay.getDay() ===
    0
      ? 6
      : firstDay.getDay() -
        1;

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

  for (
    let i = 0;
    i < mondayOffset;
    i++
  ) {
    const previousDate =
      new Date(
        year,
        month,
        i -
          mondayOffset +
          1,
        12
      );

    html +=
      renderMonthCell(
        previousDate,
        true
      );
  }

  for (
    let day = 1;
    day <=
    daysInMonth;
    day++
  ) {
    const date =
      new Date(
        year,
        month,
        day,
        12
      );

    html +=
      renderMonthCell(
        date,
        false
      );
  }

  const usedCells =
    mondayOffset +
    daysInMonth;

  const remaining =
    (
      7 -
      (
        usedCells %
        7
      )
    ) %
    7;

  for (
    let i = 1;
    i <= remaining;
    i++
  ) {
    const nextDate =
      new Date(
        year,
        month,
        daysInMonth +
          i,
        12
      );

    html +=
      renderMonthCell(
        nextDate,
        true
      );
  }

  html += `
      </div>
    </div>
  `;

  overviewContent.innerHTML =
    html;

  attachMonthWeekNavigation();
}

function renderMonthCell(
  date,
  otherMonth
) {
  const dateString =
    iso(date);

  const daySessions =
    sessionsForDate(
      dateString
    );

  const completed =
    daySessions.filter(
      session =>
        session.completed
    ).length;

  let dots =
    "";

  daySessions
    .slice(
      0,
      5
    )
    .forEach(
      session => {
        dots += `
          <span
            class="month-dot ${
              session.completed
                ? "completed"
                : ""
            }"
          ></span>
        `;
      }
    );

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

function attachMonthWeekNavigation() {
  const grid =
    overviewContent.querySelector(
      ".month-grid"
    );

  if (!grid) {
    return;
  }

  const cells =
    Array.from(
      grid.querySelectorAll(
        ".month-cell"
      )
    );

  for (
    let i = 0;
    i < cells.length;
    i += 7
  ) {
    const weekCells =
      cells.slice(
        i,
        i + 7
      );

    if (!weekCells.length) {
      continue;
    }

    const firstDate =
      parseDate(
        weekCells[0]
          .dataset
          .date
      );

    const lastDate =
      parseDate(
        weekCells[
          weekCells.length -
            1
        ].dataset
          .date
      );

    const weekButton =
      document.createElement(
        "button"
      );

    weekButton.type =
      "button";

    weekButton.className =
      "month-week-hit-area";

    weekButton.setAttribute(
      "aria-label",
      `Woche vom ${formatShortDate(
        firstDate
      )} bis ${formatShortDate(
        lastDate
      )} öffnen`
    );

    const firstRect =
      weekCells[0]
        .getBoundingClientRect();

    const lastRect =
      weekCells[
        weekCells.length -
          1
      ].getBoundingClientRect();

    const gridRect =
      grid.getBoundingClientRect();

    weekButton.style.top =
      `${
        firstRect.top -
        gridRect.top
      }px`;

    weekButton.style.height =
      `${
        lastRect.bottom -
        firstRect.top
      }px`;

    weekButton.addEventListener(
      "click",
      event => {
        event.preventDefault();

        overviewDate =
          startOfWeek(
            firstDate
          );

        overviewPeriod =
          "week";

        renderOverview();
      }
    );

    grid.appendChild(
      weekButton
    );
  }
}

/* =========================
   OVERVIEW YEAR
========================= */

function renderOverviewYear() {
  const year =
    overviewDate.getFullYear();

  const yearSessions =
    sessionsForYear(
      year
    );

  const completed =
    yearSessions.filter(
      session =>
        session.completed
    ).length;

  const planned =
    yearSessions.length;

  const trainingDays =
    new Set(
      yearSessions.map(
        session =>
          session.date
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

  for (
    let month = 0;
    month < 12;
    month++
  ) {
    html +=
      renderYearMonth(
        year,
        month
      );
  }

  html += `
      </div>
    </div>
  `;

  overviewContent.innerHTML =
    html;

  attachYearMonthNavigation();
}

function renderYearMonth(
  year,
  month
) {
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
    firstDay.getDay() ===
    0
      ? 6
      : firstDay.getDay() -
        1;

  const monthSessions =
    sessions.filter(
      session => {
        const date =
          parseDate(
            session.date
          );

        return (
          date.getFullYear() ===
            year &&
          date.getMonth() ===
            month
        );
      }
    );

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
            new Intl.DateTimeFormat(
              "de-DE",
              {
                month:
                  "long"
              }
            ).format(
              firstDay
            )
          }
        </span>

        <span class="year-month-count">
          ${monthSessions.length}
          ${
            monthSessions.length ===
            1
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

  for (
    let i = 0;
    i < mondayOffset;
    i++
  ) {
    html +=
      `<div></div>`;
  }

  for (
    let day = 1;
    day <=
    daysInMonth;
    day++
  ) {
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
      sessionsForDate(
        dateString
      );

    const hasTraining =
      daySessions.length >
      0;

    const allCompleted =
      hasTraining &&
      daySessions.every(
        session =>
          session.completed
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
    .querySelectorAll(
      ".year-month"
    )
    .forEach(
      monthButton => {
        monthButton.addEventListener(
          "click",
          () => {
            const year =
              Number(
                monthButton.dataset
                  .year
              );

            const month =
              Number(
                monthButton.dataset
                  .month
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
      }
    );
}

/* =========================
   TODAY
========================= */

function renderToday() {
  const today =
    new Date();

  todayTitle.textContent =
    formatLongDate(
      today
    );

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
          type="button"
        >
          + Training hinzufügen
        </button>

      </div>
    `;

    document
      .getElementById(
        "todayAddBtn"
      )
      .addEventListener(
        "click",
        () =>
          openNewDialog()
      );

    return;
  }

  todayContent.innerHTML = `
    <div class="today-session-list">
      ${
        todaySessions
          .map(
            renderSessionCard
          )
          .join("")
      }
    </div>
  `;

  attachSessionEvents(
    todayContent
  );
}

/* =========================
   VIEW SWITCHING
========================= */

function setView(
  view
) {
  currentView =
    view;

  planView.classList.toggle(
    "hidden",
    view !== "plan"
  );

  overviewView.classList.toggle(
    "hidden",
    view !== "overview"
  );

  profileView.classList.toggle(
    "hidden",
    view !== "profile"
  );

  todayView.classList.toggle(
    "hidden",
    view !== "today"
  );

  if (bottomNav) {
    bottomNav.classList.remove(
      "hidden"
    );
  }

  document
    .querySelectorAll(
      ".nav-item"
    )
    .forEach(
      button => {
        button.classList.toggle(
          "active",
          button.dataset
            .view ===
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

  if (
    view ===
    "today"
  ) {
    renderToday();
  }
}

/* =========================
   TRAINING DIALOG
========================= */

function openNewDialog() {
  ensureSportOptions();

  editingId =
    null;

  dialogTitle.textContent =
    "Training hinzufügen";

  trainingForm.reset();

  sportInput.value =
    "running";

  if (
    runningMetricInput
  ) {
    runningMetricInput.value =
      "duration";
  }

  durationInput.value =
    45;

  intensityInput.value =
    3;

  if (
    customSportInput
  ) {
    customSportInput.value =
      "";
  }

  updateTitlePlaceholder();

  updateTrainingInputVisibility();

  trainingDialog.showModal();

  setTimeout(
    () => {
      titleInput.focus();
    },
    50
  );
}

function openEditDialog(
  session
) {
  editingId =
    session.id;

  dialogTitle.textContent =
    "Training bearbeiten";

  sportInput.value =
    session.sport;

  titleInput.value =
    session.title;

  intensityInput.value =
    session.intensity;

  notesInput.value =
    session.notes ||
    "";

  if (
    customSportInput
  ) {
    customSportInput.value =
      session.customSport ||
      "";
  }

  if (
    runningMetricInput
  ) {
    runningMetricInput.value =
      sportSupportsDistance(
        session.sport
      )
        ? (
            session.runMetric ||
            "duration"
          )
        : "duration";
  }

  if (
    sportSupportsDistance(
      session.sport
    ) &&
    session.runMetric ===
      "distance"
  ) {
    durationInput.value =
      session.distance ??
      "";
  } else {
    durationInput.value =
      session.duration ??
      "";
  }

  updateTitlePlaceholder();

  updateTrainingInputVisibility();

  trainingDialog.showModal();

  setTimeout(
    () => {
      titleInput.focus();
    },
    50
  );
}

function closeDialog() {
  trainingDialog.close();

  editingId =
    null;
}

function validateTrainingForm() {
  const sport =
    sportInput.value;

  const title =
    titleInput.value.trim();

  const intensity =
    Number(
      intensityInput.value
    );

  if (!title) {
    alert(
      "Bitte gib einen Titel für das Training ein."
    );

    titleInput.focus();

    return null;
  }

  if (
    sport ===
    "other"
  ) {
    const customSport =
      customSportInput
        ? customSportInput.value.trim()
        : "";

    if (!customSport) {
      alert(
        "Bitte gib die Sportart ein."
      );

      customSportInput?.focus();

      return null;
    }

    if (
      customSport.length >
      50
    ) {
      alert(
        "Der Name der Sportart darf maximal 50 Zeichen haben."
      );

      customSportInput?.focus();

      return null;
    }
  }

  const value =
    Number(
      durationInput.value
    );

  if (
    !Number.isFinite(
      value
    )
  ) {
    alert(
      sportSupportsDistance(sport) &&
      runningMetricInput?.value ===
        "distance"
        ? "Bitte gib die Kilometer ein."
        : "Bitte gib die Dauer ein."
    );

    durationInput.focus();

    return null;
  }

  if (
    value <= 0
  ) {
    alert(
      sportSupportsDistance(sport) &&
      runningMetricInput?.value ===
        "distance"
        ? "Die Kilometer müssen größer als 0 sein."
        : "Die Dauer muss größer als 0 sein."
    );

    durationInput.focus();

    return null;
  }

  if (
    sportSupportsDistance(sport) &&
    runningMetricInput?.value ===
      "duration" &&
    !Number.isInteger(
      value
    )
  ) {
    alert(
      "Die Dauer bitte in ganzen Minuten eingeben."
    );

    durationInput.focus();

    return null;
  }

  if (
    sportSupportsDistance(sport) &&
    runningMetricInput?.value ===
      "distance" &&
    value > 1000
  ) {
    alert(
      "Bitte gib eine realistische Kilometerzahl ein."
    );

    durationInput.focus();

    return null;
  }

  if (
    !Number.isFinite(
      intensity
    )
  ) {
    return null;
  }

  return {
    sport,

    title,

    intensity,

    notes:
      notesInput.value.trim(),

    value,

    customSport:
      sport ===
      "other"
        ? customSportInput.value.trim()
        : "",

    runMetric:
      sportSupportsDistance(
        sport
      )
        ? (
            runningMetricInput?.value ||
            "duration"
          )
        : null
  };
}

/* =========================
   TRAINING FORM
========================= */

trainingForm.addEventListener(
  "submit",
  event => {
    event.preventDefault();

    const formData =
      validateTrainingForm();

    if (!formData) {
      return;
    }

    if (
      editingId
    ) {
      const session =
        sessions.find(
          item =>
            item.id ===
            editingId
        );

      if (session) {
        session.sport =
          formData.sport;

        session.title =
          formData.title;

        session.intensity =
          formData.intensity;

        session.notes =
          formData.notes;

        session.customSport =
          formData.customSport;

        if (
          sportSupportsDistance(
            formData.sport
          ) &&
          formData.runMetric ===
            "distance"
        ) {
          session.runMetric =
            "distance";

          session.distance =
            formData.value;

          session.duration =
            null;

        } else {
          session.runMetric =
            sportSupportsDistance(
              formData.sport
            )
              ? "duration"
              : null;

          session.duration =
            formData.value;

          session.distance =
            null;
        }
      }

    } else {
      sessions.push({
        id:
          `${Date.now()}-${Math.random()
            .toString(16)
            .slice(2)}`,

        date:
          iso(selected),

        sport:
          formData.sport,

        title:
          formData.title,

        duration:
          sportSupportsDistance(
            formData.sport
          ) &&
          formData.runMetric ===
            "distance"
            ? null
            : formData.value,

        distance:
          sportSupportsDistance(
            formData.sport
          ) &&
          formData.runMetric ===
            "distance"
            ? formData.value
            : null,

        runMetric:
          sportSupportsDistance(
            formData.sport
          )
            ? formData.runMetric
            : null,

        customSport:
          formData.customSport,

        intensity:
          formData.intensity,

        notes:
          formData.notes,

        completed:
          false,

        actualIntensity:
          null,

        postNotes:
          "",

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
  () => {
    updateTitlePlaceholder();

    updateTrainingInputVisibility(
      true
    );
  }
);

if (
  runningMetricInput
) {
  runningMetricInput.addEventListener(
    "change",
    () => {
      const metric =
        runningMetricInput.value;

      if (
        metricValueLabel
      ) {
        metricValueLabel.textContent =
          metric ===
          "distance"
            ? "Kilometer"
            : "Dauer";
      }

      durationInput.min =
        metric ===
        "distance"
          ? "0.1"
          : "1";

      durationInput.step =
        metric ===
        "distance"
          ? "0.1"
          : "1";

      if (
        metric ===
        "distance"
      ) {
        durationInput.value =
          "";
      } else {
        durationInput.value =
          45;
      }

      durationInput.focus();
    }
  );
}

if (
  customSportInput
) {
  customSportInput.addEventListener(
    "input",
    () => {
      updateTitlePlaceholder();
    }
  );
}

closeDialogBtn.addEventListener(
  "click",
  closeDialog
);

trainingDialog.addEventListener(
  "click",
  event => {
    if (
      event.target ===
      trainingDialog
    ) {
      closeDialog();
    }
  }
);

/* =========================
   PROFILE EVENTS
========================= */

if (
  editProfileBtn
) {
  editProfileBtn.addEventListener(
    "click",
    () => {
      openProfileDialog(
        true
      );
    }
  );
}

if (
  closeProfileDialogBtn
) {
  closeProfileDialogBtn.addEventListener(
    "click",
    closeProfileDialog
  );
}

if (
  profileForm
) {
  profileForm.addEventListener(
    "submit",
    event => {
      event.preventDefault();

      saveProfileName();
    }
  );
}

if (
  profileDialog
) {
  profileDialog.addEventListener(
    "click",
    event => {
      if (
        event.target ===
        profileDialog
      ) {
        closeProfileDialog();
      }
    }
  );
}

/* =========================
   PROFILE WEEK EVENTS
========================= */

if (
  shareWeekPrevBtn
) {
  shareWeekPrevBtn.addEventListener(
    "click",
    () => {
      moveShareWeek(
        -1
      );
    }
  );
}

if (
  shareWeekNextBtn
) {
  shareWeekNextBtn.addEventListener(
    "click",
    () => {
      moveShareWeek(
        1
      );
    }
  );
}

if (
  shareWeekCurrentBtn
) {
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

/* =========================
   NAVIGATION
========================= */

document
  .querySelectorAll(
    ".nav-item"
  )
  .forEach(
    button => {
      button.addEventListener(
        "click",
        () => {
          setView(
            button.dataset
              .view
          );
        }
      );
    }
  );

/* =========================
   WEEK NAVIGATION
========================= */

weekPrevBtn.addEventListener(
  "click",
  () => {
    selected =
      addDays(
        selected,
        -7
      );

    renderPlan();
  }
);

weekNextBtn.addEventListener(
  "click",
  () => {
    selected =
      addDays(
        selected,
        7
      );

    renderPlan();
  }
);

/* =========================
   TODAY
========================= */

todayJumpBtn.addEventListener(
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

    renderPlan();
  }
);

/* =========================
   OVERVIEW PERIOD
========================= */

document
  .querySelectorAll(
    ".period-btn"
  )
  .forEach(
    button => {
      button.addEventListener(
        "click",
        () => {
          overviewPeriod =
            button.dataset
              .period;

          renderOverview();
        }
      );
    }
  );

periodPrevBtn.addEventListener(
  "click",
  () => {
    if (
      overviewPeriod ===
      "week"
    ) {
      overviewDate =
        addDays(
          overviewDate,
          -7
        );
    }

    if (
      overviewPeriod ===
      "month"
    ) {
      overviewDate =
        addMonths(
          overviewDate,
          -1
        );
    }

    if (
      overviewPeriod ===
      "year"
    ) {
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
    if (
      overviewPeriod ===
      "week"
    ) {
      overviewDate =
        addDays(
          overviewDate,
          7
        );
    }

    if (
      overviewPeriod ===
      "month"
    ) {
      overviewDate =
        addMonths(
          overviewDate,
          1
        );
    }

    if (
      overviewPeriod ===
      "year"
    ) {
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
   ACTION BUTTONS
========================= */

addTrainingBtn.addEventListener(
  "click",
  () => {
    openNewDialog();
  }
);

if (
  calendarExportBtn
) {
  calendarExportBtn.addEventListener(
    "click",
    createCalendarFile
  );
}

if (
  shareWeekBtn
) {
  shareWeekBtn.addEventListener(
    "click",
    shareLastWeek
  );
}

if (
  shareHypeProfileBtn
) {
  shareHypeProfileBtn.addEventListener(
    "click",
    shareHype
  );
}

if (
  logoutBtn
) {
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

/* =========================
   GLOBAL RENDER
========================= */

function renderAll() {
  renderPlan();

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

  if (
    currentView ===
    "today"
  ) {
    renderToday();
  }
}

/* =========================
   AUTH STATE
========================= */

if (
  typeof supabaseClient !==
  "undefined"
) {
  supabaseClient.auth
    .onAuthStateChange(
      (
        event,
        session
      ) => {
        if (session) {
          if (bottomNav) {
            bottomNav.classList.remove(
              "hidden"
            );
          }
        } else {
          if (bottomNav) {
            bottomNav.classList.add(
              "hidden"
            );
          }
        }
      }
    );
}

/* =========================
   PWA
========================= */

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
            console.error(
              "Service worker registration failed:",
              error
            );
          }
        );
    }
  );
}

/* =========================
   INITIAL RENDER
========================= */

ensureProfileShareStyles();

ensureShareWeekNavigation();

cleanupProfileHeadings();

shareWeekStart =
  startOfWeek(
    new Date()
  );

updateTrainingInputVisibility();

renderPlan();

setView(
  "plan"
);