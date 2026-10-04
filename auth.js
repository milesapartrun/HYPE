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


/* =========================
   MESSAGE
========================= */

function showAuthMessage(
  message,
  type = ""
) {
  authMessage.textContent = message;

  authMessage.className =
    "auth-message";

  if (type) {
    authMessage.classList.add(type);
  }
}


function clearAuthMessage() {
  showAuthMessage("");
}


/* =========================
   AUTH MODE
========================= */

function updateAuthMode() {

  clearAuthMessage();

  /*
   * Drei Zeilen für den HYPE-Claim.
   */
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

    return;
  }


  authSubmit.textContent =
    "Einloggen";


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

  authSubmit.disabled =
    loading;

  authSwitch.disabled =
    loading;


  if (loading) {

    authSubmit.textContent =
      "Bitte warten …";

    return;
  }


  authSubmit.textContent =
    isRegisterMode
      ? "Account erstellen"
      : "Einloggen";
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
      password
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
   * Bei deaktivierter E-Mail-Bestätigung
   * bekommen wir direkt eine Session.
   */

  if (
    data &&
    data.session
  ) {

    showApp();

    return;
  }


  /*
   * Falls E-Mail-Bestätigung aktiviert
   * wird, bleibt der User zunächst hier.
   */

  showAuthMessage(
    "Account erstellt. Bitte bestätige deine E-Mail-Adresse.",
    "success"
  );


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

  authScreen.classList.add(
    "hidden"
  );

  appContent.classList.remove(
    "hidden"
  );
}


/* =========================
   SHOW LOGIN
========================= */

function showLogin() {

  authScreen.classList.remove(
    "hidden"
  );

  appContent.classList.add(
    "hidden"
  );

  authForm.reset();

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

    return;
  }


  showLogin();
}


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

/*
 * Separater Click-Handler.
 *
 * Wichtig:
 * preventDefault verhindert,
 * dass der Button versehentlich
 * irgendeine Formularaktion auslöst.
 */

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

    authPassword.value = "";

    updateAuthMode();

    setTimeout(() => {
      authEmail.focus();
    }, 50);
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