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

/*
 * Für app.js verfügbar machen.
 */
window.supabaseClient = supabaseClient;


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
  window.location.origin +
  window.location.pathname;


/* =========================
   SESSION STORAGE KEYS
========================= */

const GATE_INSTAGRAM_KEY =
  "hype_registration_instagram";

const GATE_SHARE_KEY =
  "hype_registration_share";


/* =========================
   HELPERS
========================= */

function getRegistrationGate() {

  return document.getElementById(
    "registrationGate"
  );

}


function getFirstNameField() {

  return document.getElementById(
    "authFirstNameField"
  );

}


function getFirstNameInput() {

  return document.getElementById(
    "authFirstName"
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


function saveGateProgress() {

  try {

    sessionStorage.setItem(
      GATE_INSTAGRAM_KEY,
      instagramCompleted
        ? "true"
        : "false"
    );

    sessionStorage.setItem(
      GATE_SHARE_KEY,
      shareCompleted
        ? "true"
        : "false"
    );

  } catch (error) {

    console.warn(
      "HYPE sessionStorage unavailable:",
      error
    );

  }

}


function loadGateProgress() {

  try {

    instagramCompleted =
      sessionStorage.getItem(
        GATE_INSTAGRAM_KEY
      ) === "true";

    shareCompleted =
      sessionStorage.getItem(
        GATE_SHARE_KEY
      ) === "true";

  } catch (error) {

    instagramCompleted = false;
    shareCompleted = false;

  }

}


function clearGateProgress() {

  instagramCompleted =
    false;

  shareCompleted =
    false;

  try {

    sessionStorage.removeItem(
      GATE_INSTAGRAM_KEY
    );

    sessionStorage.removeItem(
      GATE_SHARE_KEY
    );

  } catch (error) {

    console.warn(
      "HYPE sessionStorage unavailable:",
      error
    );

  }

}


/* =========================
   FIRST NAME FIELD
========================= */

function ensureFirstNameField() {

  let field =
    getFirstNameField();

  let input =
    getFirstNameInput();


  if (
    field &&
    input
  ) {

    return {
      field,
      input
    };

  }


  if (!authForm) {

    return {
      field: null,
      input: null
    };

  }


  /*
   * Wir erzeugen das Feld automatisch,
   * falls es im HTML noch nicht existiert.
   */

  field =
    document.createElement(
      "label"
    );

  field.id =
    "authFirstNameField";

  field.className =
    "auth-first-name-field hidden";


  const labelText =
    document.createElement(
      "span"
    );

  labelText.textContent =
    "Vorname";


  input =
    document.createElement(
      "input"
    );

  input.type =
    "text";

  input.id =
    "authFirstName";

  input.name =
    "first_name";

  input.placeholder =
    "z. B. Tano";

  input.autocomplete =
    "given-name";

  input.maxLength =
    40;


  field.appendChild(
    labelText
  );

  field.appendChild(
    input
  );


  /*
   * Vorname vor das E-Mail-Feld setzen.
   */

  const emailContainer =
    authEmail?.closest("label") ||
    authEmail?.parentElement;


  if (emailContainer) {

    authForm.insertBefore(
      field,
      emailContainer
    );

  } else {

    authForm.prepend(
      field
    );

  }


  return {
    field,
    input
  };

}


function updateFirstNameField() {

  const {
    field,
    input
  } =
    ensureFirstNameField();


  if (!field || !input) {
    return;
  }


  if (isRegisterMode) {

    if (
      instagramCompleted &&
      shareCompleted
    ) {

      field.classList.remove(
        "hidden"
      );

      input.required =
        true;

      return;

    }


    field.classList.add(
      "hidden"
    );

    input.required =
      false;

    return;

  }


  field.classList.add(
    "hidden"
  );

  input.required =
    false;

}


function getFirstName() {

  const input =
    getFirstNameInput();

  if (!input) {
    return "";
  }

  return input.value.trim();

}


/* =========================
   REGISTRATION GATE
========================= */

function renderRegistrationGate() {

  if (!authForm) {
    return;
  }


  if (!isRegisterMode) {

    const existing =
      getRegistrationGate();

    if (existing) {
      existing.remove();
    }

    updateFirstNameField();

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


    const firstNameField =
      getFirstNameField();

    const emailContainer =
      authEmail?.closest("label") ||
      authEmail?.parentElement;


    if (firstNameField) {

      authForm.insertBefore(
        gate,
        firstNameField
      );

    } else if (emailContainer) {

      authForm.insertBefore(
        gate,
        emailContainer
      );

    } else {

      authForm.prepend(
        gate
      );

    }

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


    ${
      instagramCompleted &&
      shareCompleted
        ? `
          <div class="registration-ready">
            ✓ Perfekt. Jetzt kannst du deinen HYPE-Account erstellen.
          </div>
        `
        : ""
    }

  `;


  attachRegistrationGateEvents();

  updateFirstNameField();

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

        saveGateProgress();

        clearAuthMessage();

        renderRegistrationGate();

        showAuthMessage(
          "Perfekt. Jetzt kannst du HYPE mit jemandem teilen.",
          "success"
        );

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

          /*
           * Native Share Sheet
           */

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
              "Perfekt – HYPE wurde über die Teilen-Funktion geöffnet. Bestätige jetzt den Schritt.",
              "success"
            );

            return;

          }


          /*
           * Clipboard Fallback
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


          /*
           * Letzter Fallback
           */

          showAuthMessage(
            `Bitte teile diesen Link mit jemandem: ${HYPE_SHARE_URL}`,
            "success"
          );

        } catch (error) {

          /*
           * User hat das native Share Sheet
           * geschlossen.
           */

          if (
            error?.name ===
            "AbortError"
          ) {

            showAuthMessage(
              "Teilen abgebrochen. Du kannst es jederzeit erneut versuchen.",
              "error"
            );

            return;

          }


          console.error(
            "HYPE share error:",
            error
          );


          showAuthMessage(
            "Das Teilen konnte nicht geöffnet werden. Du kannst den Link trotzdem kopieren und manuell teilen.",
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

        saveGateProgress();

        clearAuthMessage();

        renderRegistrationGate();

        updateFirstNameField();

        updateRegistrationSubmitState();

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
   AUTH MODE
========================= */

function updateAuthMode() {

  clearAuthMessage();


  if (authSubtitle) {

    authSubtitle.innerHTML = `
      Deine Trainingsplanung.<br>
      Dein Account.<br>
      Dein HYPE.
    `;

  }


  ensureFirstNameField();


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

    updateFirstNameField();

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

  updateFirstNameField();

}


/* =========================
   LOADING
========================= */

function setAuthLoading(
  loading
) {

  if (!authForm) {
    return;
  }


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
   * Sicherheits-/UX-Gate.
   * Wichtig:
   * Diese beiden Schritte können im Browser
   * nicht technisch verifiziert werden.
   * Sie werden vom Nutzer bestätigt.
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


  const firstName =
    getFirstName();

  const email =
    authEmail.value.trim();

  const password =
    authPassword.value;


  if (!firstName) {

    showAuthMessage(
      "Bitte gib deinen Vornamen ein.",
      "error"
    );

    const input =
      getFirstNameInput();

    input?.focus();

    return;

  }


  if (firstName.length > 40) {

    showAuthMessage(
      "Der Vorname darf maximal 40 Zeichen haben.",
      "error"
    );

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
   * Falls Supabase direkt eine Session erzeugt,
   * ist der Account sofort eingeloggt.
   */

  if (
    data &&
    data.session
  ) {

    clearGateProgress();

    showApp();

    return;

  }


  /*
   * Falls E-Mail-Bestätigung aktiviert ist.
   */

  clearGateProgress();

  isRegisterMode =
    false;

  updateAuthMode();

  showAuthMessage(
    "Account erstellt. Bitte bestätige deine E-Mail-Adresse. Danach kannst du dich einloggen.",
    "success"
  );

}


/* =========================
   UPDATE PROFILE
========================= */

async function updateProfileFirstName(
  firstName
) {

  const cleanName =
    String(
      firstName || ""
    ).trim();


  if (!cleanName) {

    return {
      success: false,
      error:
        "Bitte gib einen Vornamen ein."
    };

  }


  if (cleanName.length > 40) {

    return {
      success: false,
      error:
        "Der Vorname darf maximal 40 Zeichen haben."
    };

  }


  const {
    data,
    error
  } =
    await supabaseClient.auth.updateUser({

      data: {

        first_name:
          cleanName

      }

    });


  if (error) {

    console.error(
      "HYPE profile update error:",
      error
    );


    return {
      success: false,
      error:
        getAuthErrorMessage(error)
    };

  }


  return {
    success: true,
    user:
      data?.user || null
  };

}


window.updateProfileFirstName =
  updateProfileFirstName;


/* =========================
   GET CURRENT USER
========================= */

async function getCurrentUser() {

  const {
    data,
    error
  } =
    await supabaseClient.auth.getUser();


  if (error) {

    console.error(
      "HYPE get user error:",
      error
    );

    return null;

  }


  return data?.user || null;

}


window.getCurrentUser =
  getCurrentUser;


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


  if (
    message.includes(
      "rate limit"
    )
  ) {

    return "Zu viele Versuche. Bitte kurz warten und erneut versuchen.";

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


  const bottomNav =
    document.getElementById(
      "bottomNav"
    );

  if (bottomNav) {

    bottomNav.classList.remove(
      "hidden"
    );

  }


  /*
   * app.js bekommt ein klares Signal,
   * dass der Auth-Status fertig ist.
   */

  window.dispatchEvent(
    new CustomEvent(
      "hype-auth-ready"
    )
  );

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


  if (authForm) {
    authForm.reset();
  }


  clearGateProgress();

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


window.logout =
  logout;


/* =========================
   FORM SUBMIT
========================= */

if (authForm) {

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

}


/* =========================
   LOGIN / REGISTER SWITCH
========================= */

if (authSwitch) {

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


      if (authPassword) {

        authPassword.value =
          "";

      }


      if (isRegisterMode) {

        /*
         * Bei jedem bewussten Wechsel
         * in die Registrierung beginnen
         * wir das Gate sauber neu.
         */

        loadGateProgress();

      } else {

        clearAuthMessage();

      }


      updateAuthMode();


      setTimeout(
        () => {

          if (
            isRegisterMode &&
            instagramCompleted &&
            shareCompleted
          ) {

            const firstNameInput =
              getFirstNameInput();

            firstNameInput?.focus();

            return;

          }


          authEmail?.focus();

        },
        50
      );

    }
  );

}


/* =========================
   AUTH STATE
========================= */

supabaseClient.auth.onAuthStateChange(
  (event, session) => {

    if (session) {

      showApp();

      return;

    }


    if (
      event === "SIGNED_OUT" ||
      event === "INITIAL_SESSION"
    ) {

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

ensureFirstNameField();

loadGateProgress();

updateAuthMode();

initAuth();