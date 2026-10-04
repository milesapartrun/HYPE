/* =========================
   HYPE SUPABASE AUTH
========================= */

const SUPABASE_URL =
  "https://bjbfncwlqhxiimjyhmch.supabase.co";

const SUPABASE_PUBLISHABLE_KEY =
  "sb_publishable_h9uL5ftUoB6NeWZ7Dzsj5w_I548i08u";

const supabaseClient =
  window.supabase.createClient(
    SUPABASE_URL,
    SUPABASE_PUBLISHABLE_KEY
  );


/* =========================
   DOM
========================= */

const authScreen =
  document.getElementById("authScreen");

const appContent =
  document.getElementById("appContent");

const authForm =
  document.getElementById("authForm");

const authEmail =
  document.getElementById("authEmail");

const authPassword =
  document.getElementById("authPassword");

const authSubmit =
  document.getElementById("authSubmit");

const authSwitch =
  document.getElementById("authSwitch");

const authMessage =
  document.getElementById("authMessage");

const authSubtitle =
  document.getElementById("authSubtitle");


/* =========================
   STATE
========================= */

let isRegisterMode = false;

let instagramCompleted = false;

let shareCompleted = false;


/* =========================
   CONSTANTS
========================= */

const INSTAGRAM_URL =
  "https://www.instagram.com/tano.loew/";

const HYPE_SHARE_TEXT =
  "Check HYPE – meine Trainingsplanung für Hybrid Athletes.";

const HYPE_SHARE_URL =
  window.location.href;


/* =========================
   HELPERS
========================= */

function getFirstNameInput() {

  return document.getElementById(
    "authFirstName"
  );

}


function getRegistrationGate() {

  return document.getElementById(
    "registrationGate"
  );

}


function showAuthMessage(
  message,
  type = ""
) {

  if (!authMessage) {
    return;
  }

  authMessage.textContent =
    message;

  authMessage.className =
    "auth-message";

  if (type) {

    authMessage.classList.add(
      type
    );

  }

}


function clearAuthMessage() {

  showAuthMessage("");

}


/* =========================
   REGISTRATION GATE
========================= */

function renderRegistrationGate() {

  if (!isRegisterMode) {

    const existing =
      getRegistrationGate();

    if (existing) {
      existing.remove();
    }

    return;

  }


  let gate =
    getRegistrationGate();


  if (!gate) {

    gate =
      document.createElement(
        "div"
      );

    gate.id =
      "registrationGate";

    gate.className =
      "registration-gate";


    /*
     * Der Gate-Block wird direkt
     * vor den E-Mail-Input gesetzt.
     */

    authForm.insertBefore(
      gate,
      authEmail
    );

  }


  const instagramDoneClass =
    instagramCompleted
      ? "completed"
      : "";


  const shareDoneClass =
    shareCompleted
      ? "completed"
      : "";


  gate.innerHTML = `

    <div class="registration-step">

      <div class="registration-step-number">
        1
      </div>

      <div class="registration-step-content">

        <strong>
          Folge Tano auf Instagram
        </strong>

        <span>
          Unterstütze HYPE auf Instagram.
        </span>

        <a
          href="${INSTAGRAM_URL}"
          target="_blank"
          rel="noopener noreferrer"
          class="registration-action instagram-action"
          id="instagramFollowBtn"
        >
          <span>Instagram öffnen</span>
          <span>↗</span>
        </a>

        <button
          type="button"
          class="registration-confirm ${instagramDoneClass}"
          id="instagramConfirmBtn"
        >
          ${
            instagramCompleted
              ? "✓ Ich folge Tano"
              : "Ich folge Tano"
          }
        </button>

      </div>

    </div>


    <div class="registration-divider"></div>


    <div
      class="registration-step ${
        instagramCompleted
          ? ""
          : "locked"
      }"
    >

      <div class="registration-step-number">
        2
      </div>

      <div class="registration-step-content">

        <strong>
          Teile HYPE mit jemandem
        </strong>

        <span>
          Schick HYPE an eine Person über
          WhatsApp, Instagram oder Nachrichten.
        </span>

        <button
          type="button"
          class="registration-action share-action"
          id="shareHypeBtn"
          ${
            instagramCompleted
              ? ""
              : "disabled"
          }
        >
          <span>HYPE teilen</span>
          <span>↗</span>
        </button>

        <button
          type="button"
          class="registration-confirm ${shareDoneClass}"
          id="shareConfirmBtn"
          ${
            instagramCompleted
              ? ""
              : "disabled"
          }
        >
          ${
            shareCompleted
              ? "✓ Ich habe HYPE geteilt"
              : "Ich habe HYPE geteilt"
          }
        </button>

      </div>

    </div>

  `;


  attachRegistrationGateEvents();

  updateRegistrationSubmitState();

}


/* =========================
   REGISTRATION EVENTS
========================= */

function attachRegistrationGateEvents() {

  const instagramConfirm =
    document.getElementById(
      "instagramConfirmBtn"
    );


  const shareButton =
    document.getElementById(
      "shareHypeBtn"
    );


  const shareConfirm =
    document.getElementById(
      "shareConfirmBtn"
    );


  if (instagramConfirm) {

    instagramConfirm.addEventListener(
      "click",
      () => {

        instagramCompleted =
          true;

        clearAuthMessage();

        renderRegistrationGate();

      }
    );

  }


  if (shareButton) {

    shareButton.addEventListener(
      "click",
      async () => {

        if (!instagramCompleted) {
          return;
        }


        clearAuthMessage();


        try {

          if (
            navigator.share
          ) {

            await navigator.share({
              title:
                "HYPE",
              text:
                HYPE_SHARE_TEXT,
              url:
                HYPE_SHARE_URL
            });


            showAuthMessage(
              "Perfekt – HYPE wurde geteilt. Bestätige den Schritt noch einmal.",
              "success"
            );

            return;

          }


          /*
           * Fallback für Browser ohne
           * native Share API.
           */

          if (
            navigator.clipboard &&
            navigator.clipboard.writeText
          ) {

            await navigator.clipboard.writeText(
              `${HYPE_SHARE_TEXT} ${HYPE_SHARE_URL}`
            );


            showAuthMessage(
              "Der HYPE-Link wurde kopiert. Schick ihn jetzt über WhatsApp, Instagram oder Nachrichten.",
              "success"
            );

            return;

          }


          showAuthMessage(
            "Bitte kopiere den HYPE-Link manuell und teile ihn mit jemandem.",
            "error"
          );

        } catch (error) {

          /*
           * Das native Share-Menü wurde
           * möglicherweise nur geschlossen.
           */

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


          showAuthMessage(
            "Das Teilen konnte nicht geöffnet werden.",
            "error"
          );

        }

      }
    );

  }


  if (shareConfirm) {

    shareConfirm.addEventListener(
      "click",
      () => {

        if (!instagramCompleted) {
          return;
        }


        shareCompleted =
          true;

        clearAuthMessage();

        renderRegistrationGate();

        showAuthMessage(
          "Perfekt – jetzt kannst du deinen HYPE-Account erstellen.",
          "success"
        );

      }
    );

  }

}


/* =========================
   SUBMIT STATE
========================= */

function updateRegistrationSubmitState() {

  if (!authSubmit) {
    return;
  }


  if (!isRegisterMode) {

    authSubmit.disabled =
      false;

    return;

  }


  const requirementsComplete =
    instagramCompleted &&
    shareCompleted;


  authSubmit.disabled =
    !requirementsComplete;

}


/* =========================
   RESET REGISTRATION
========================= */

function resetRegistrationProgress() {

  instagramCompleted =
    false;

  shareCompleted =
    false;

}


/* =========================
   AUTH MODE
========================= */

function updateAuthMode() {

  clearAuthMessage();


  authSubtitle.innerHTML = `
    Deine Trainingsplanung.<br>
    Dein Account.<br>
    Dein HYPE.
  `;


  if (isRegisterMode) {

    authSubmit.textContent =
      "Account erstellen";


    authSwitch.innerHTML = `
      <span style="
        display:block;
        color:#f5f6f7;
        font-size:13px;
        font-weight:800;
        margin-bottom:4px;
      ">
        Du hast bereits einen Account?
      </span>

      <span style="
        display:block;
        color:#d7ff3f;
        font-size:13px;
        font-weight:900;
      ">
        → Einloggen
      </span>
    `;


    authPassword.autocomplete =
      "new-password";


    renderRegistrationGate();

    updateRegistrationSubmitState();

    return;

  }


  authSubmit.textContent =
    "Einloggen";


  authSubmit.disabled =
    false;


  authSwitch.innerHTML = `
    <span style="
      display:block;
      color:#f5f6f7;
      font-size:13px;
      font-weight:800;
      margin-bottom:4px;
    ">
      Noch keinen Account?
    </span>

    <span style="
      display:block;
      color:#d7ff3f;
      font-size:14px;
      font-weight:900;
    ">
      → Jetzt registrieren
    </span>
  `;


  authPassword.autocomplete =
    "current-password";


  renderRegistrationGate();

}


/* =========================
   LOADING
========================= */

function setAuthLoading(
  loading
) {

  authForm.classList.toggle(
    "auth-loading",
    loading
  );


  authSwitch.disabled =
    loading;


  if (loading) {

    authSubmit.textContent =
      "Bitte warten …";

    authSubmit.disabled =
      true;

    return;

  }


  authSubmit.textContent =
    isRegisterMode
      ? "Account erstellen"
      : "Einloggen";


  updateRegistrationSubmitState();

}


/* =========================
   LOGIN
========================= */

async function signIn() {

  const email =
    authEmail.value.trim();

  const password =
    authPassword.value;


  if (!email || !password) {

    showAuthMessage(
      "Bitte E-Mail und Passwort eingeben.",
      "error"
    );

    return;

  }


  setAuthLoading(true);

  clearAuthMessage();


  const {
    error
  } =
    await supabaseClient.auth.signInWithPassword({
      email,
      password
    });


  setAuthLoading(false);


  if (error) {

    console.error(
      "HYPE login error:",
      error
    );


    showAuthMessage(
      getAuthErrorMessage(error),
      "error"
    );


    return;

  }


  showApp();

}


/* =========================
   REGISTER
========================= */

async function signUp() {

  /*
   * Zweite Prüfung direkt vor
   * der Supabase-Registrierung.
   */

  if (
    !instagramCompleted ||
    !shareCompleted
  ) {

    showAuthMessage(
      "Bitte zuerst beide Schritte abschließen.",
      "error"
    );

    updateRegistrationSubmitState();

    return;

  }


  const firstNameInput =
    getFirstNameInput();


  const firstName =
    firstNameInput
      ? firstNameInput.value.trim()
      : "";


  const email =
    authEmail.value.trim();

  const password =
    authPassword.value;


  if (!firstName) {

    showAuthMessage(
      "Bitte gib deinen Vornamen ein.",
      "error"
    );

    if (firstNameInput) {
      firstNameInput.focus();
    }

    return;

  }


  if (!email || !password) {

    showAuthMessage(
      "Bitte E-Mail und Passwort eingeben.",
      "error"
    );

    return;

  }


  if (password.length < 6) {

    showAuthMessage(
      "Das Passwort muss mindestens 6 Zeichen haben.",
      "error"
    );

    return;

  }


  setAuthLoading(true);

  clearAuthMessage();


  const {
    data,
    error
  } =
    await supabaseClient.auth.signUp({
      email,
      password,
      options: {
        data: {
          first_name:
            firstName
        }
      }
    });


  setAuthLoading(false);


  if (error) {

    console.error(
      "HYPE registration error:",
      error
    );


    showAuthMessage(
      getAuthErrorMessage(error),
      "error"
    );


    return;

  }


  /*
   * Wenn Supabase direkt eine
   * Session erstellt, ist der User
   * sofort eingeloggt.
   */

  if (
    data &&
    data.session
  ) {

    showApp();

    return;

  }


  /*
   * Falls E-Mail-Bestätigung
   * aktiviert ist.
   */

  showAuthMessage(
    "Account erstellt. Bitte bestätige deine E-Mail-Adresse.",
    "success"
  );


  resetRegistrationProgress();


  isRegisterMode =
    false;


  updateAuthMode();

}


/* =========================
   AUTH ERRORS
========================= */

function getAuthErrorMessage(
  error
) {

  const message =
    String(
      error?.message || ""
    ).toLowerCase();


  if (
    message.includes(
      "invalid login credentials"
    )
  ) {

    return "E-Mail oder Passwort ist falsch.";

  }


  if (
    message.includes(
      "user already registered"
    )
  ) {

    return "Für diese E-Mail existiert bereits ein Account.";

  }


  if (
    message.includes(
      "password should be at least"
    )
  ) {

    return "Das Passwort ist zu kurz.";

  }


  if (
    message.includes(
      "email not confirmed"
    )
  ) {

    return "Bitte bestätige zuerst deine E-Mail-Adresse.";

  }


  return (
    error?.message ||
    "Es ist ein Fehler aufgetreten."
  );

}


/* =========================
   SHOW APP
========================= */

function showApp() {

  if (authScreen) {

    authScreen.classList.add(
      "hidden"
    );

  }


  if (appContent) {

    appContent.classList.remove(
      "hidden"
    );

  }


  /*
   * Bottom Navigation wieder
   * sichtbar machen.
   */

  const bottomNav =
    document.getElementById(
      "bottomNav"
    );

  if (bottomNav) {

    bottomNav.classList.remove(
      "hidden"
    );

  }

}


/* =========================
   SHOW LOGIN
========================= */

function showLogin() {

  if (authScreen) {

    authScreen.classList.remove(
      "hidden"
    );

  }


  if (appContent) {

    appContent.classList.add(
      "hidden"
    );

  }


  const bottomNav =
    document.getElementById(
      "bottomNav"
    );

  if (bottomNav) {

    bottomNav.classList.add(
      "hidden"
    );

  }


  authForm.reset();


  resetRegistrationProgress();


  isRegisterMode =
    false;


  updateAuthMode();

}


/* =========================
   LOGOUT
========================= */

async function logout() {

  const {
    error
  } =
    await supabaseClient.auth.signOut();


  if (error) {

    console.error(
      "HYPE logout error:",
      error
    );

    showAuthMessage(
      "Logout fehlgeschlagen.",
      "error"
    );

    return;

  }


  showLogin();

}


/*
 * app.js kann logout()
 * direkt verwenden.
 */

window.logout =
  logout;


/* =========================
   FORM SUBMIT
========================= */

authForm.addEventListener(
  "submit",
  async event => {

    event.preventDefault();


    if (isRegisterMode) {

      await signUp();

      return;

    }


    await signIn();

  }
);


/* =========================
   LOGIN / REGISTER SWITCH
========================= */

authSwitch.addEventListener(
  "click",
  event => {

    event.preventDefault();
    event.stopPropagation();


    if (authSwitch.disabled) {
      return;
    }


    isRegisterMode =
      !isRegisterMode;


    authPassword.value =
      "";


    if (isRegisterMode) {

      resetRegistrationProgress();

    }


    updateAuthMode();


    setTimeout(
      () => {

        const firstNameInput =
          getFirstNameInput();


        if (
          isRegisterMode &&
          firstNameInput
        ) {

          firstNameInput.focus();

          return;

        }


        authEmail.focus();

      },
      50
    );

  }
);


/* =========================
   AUTH STATE
========================= */

supabaseClient.auth.onAuthStateChange(
  (event, session) => {

    if (session) {

      showApp();

    } else {

      showLogin();

    }

  }
);


/* =========================
   INITIAL AUTH CHECK
========================= */

async function initAuth() {

  const {
    data,
    error
  } =
    await supabaseClient.auth.getSession();


  if (error) {

    console.error(
      "HYPE auth initialization error:",
      error
    );


    showAuthMessage(
      "Die Verbindung zu HYPE konnte nicht hergestellt werden.",
      "error"
    );


    return;

  }


  if (data.session) {

    showApp();

  } else {

    showLogin();

  }

}


/* =========================
   START
========================= */

updateAuthMode();

initAuth();