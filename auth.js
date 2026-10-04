/* =========================================================
   HYPE – AUTH
   Supabase Login / Registrierung / Passwort vergessen
   ========================================================= */

// ---------------------------------------------------------
// SUPABASE
// ---------------------------------------------------------

const SUPABASE_URL = "https://bjbfncwlqhxiimjyhmch.supabase.co";

const SUPABASE_KEY =
  "sb_publishable_h9uL5ftUoB6NeWZ7Dzsj5w_I548i08u";

const supabaseClient = window.supabase.createClient(
  SUPABASE_URL,
  SUPABASE_KEY
);


// ---------------------------------------------------------
// KONFIGURATION
// ---------------------------------------------------------

const PASSWORD_RESET_REDIRECT =
  window.location.origin + window.location.pathname;

// Marker für einen laufenden Passwort-Reset
const PASSWORD_RECOVERY_STORAGE_KEY =
  "hype_password_recovery_pending";


// ---------------------------------------------------------
// ELEMENTE
// ---------------------------------------------------------

let authContainer = null;
let emailInput = null;
let passwordInput = null;
let resetConfirmInput = null;
let loginButton = null;
let registerButton = null;
let forgotPasswordLink = null;
let registerLink = null;
let authMessage = null;


// ---------------------------------------------------------
// STATUS
// ---------------------------------------------------------

let isPasswordRecovery = false;
let isResetMode = false;


// ---------------------------------------------------------
// RECOVERY-MARKER
// ---------------------------------------------------------

function setPasswordRecoveryPending() {
  try {
    localStorage.setItem(
      PASSWORD_RECOVERY_STORAGE_KEY,
      String(Date.now())
    );
  } catch (error) {
    console.warn(
      "Recovery-Marker konnte nicht gespeichert werden:",
      error
    );
  }
}


function isPasswordRecoveryPending() {
  try {
    const value = localStorage.getItem(
      PASSWORD_RECOVERY_STORAGE_KEY
    );

    if (!value) {
      return false;
    }

    const timestamp = Number(value);

    if (!Number.isFinite(timestamp)) {
      localStorage.removeItem(
        PASSWORD_RECOVERY_STORAGE_KEY
      );

      return false;
    }

    // Recovery-Marker nach 1 Stunde verfallen lassen.
    // Dadurch bleibt ein alter Reset nicht dauerhaft aktiv.
    const oneHour = 60 * 60 * 1000;

    if (Date.now() - timestamp > oneHour) {
      localStorage.removeItem(
        PASSWORD_RECOVERY_STORAGE_KEY
      );

      return false;
    }

    return true;

  } catch (error) {
    console.warn(
      "Recovery-Marker konnte nicht gelesen werden:",
      error
    );

    return false;
  }
}


function clearPasswordRecoveryPending() {
  try {
    localStorage.removeItem(
      PASSWORD_RECOVERY_STORAGE_KEY
    );
  } catch (error) {
    console.warn(
      "Recovery-Marker konnte nicht gelöscht werden:",
      error
    );
  }
}


// ---------------------------------------------------------
// ELEMENTE SUCHEN
// ---------------------------------------------------------

function getAuthElements() {
  authContainer =
    document.querySelector("#auth") ||
    document.querySelector(".auth") ||
    document.querySelector("#auth-container");

  emailInput =
    document.querySelector("#email") ||
    document.querySelector('input[type="email"]');

  passwordInput =
    document.querySelector("#password") ||
    document.querySelector('input[type="password"]');

  loginButton =
    document.querySelector("#login-btn") ||
    document.querySelector("#loginButton") ||
    document.querySelector('[data-action="login"]');

  registerButton =
    document.querySelector("#register-btn") ||
    document.querySelector("#registerButton") ||
    document.querySelector('[data-action="register"]');

  forgotPasswordLink =
    document.querySelector("#forgot-password") ||
    document.querySelector("#forgotPassword");

  registerLink =
    document.querySelector("#register-link") ||
    document.querySelector("#registerLink");

  authMessage =
    document.querySelector("#auth-message") ||
    document.querySelector("#authMessage") ||
    document.querySelector(".auth-message");
}


// ---------------------------------------------------------
// NACHRICHTEN
// ---------------------------------------------------------

function showAuthMessage(message, isError = false) {
  getAuthElements();

  if (!authMessage) {
    console.log(message);
    return;
  }

  authMessage.textContent = message;
  authMessage.style.display = "block";

  if (isError) {
    authMessage.classList.add("error");
    authMessage.classList.remove("success");
  } else {
    authMessage.classList.remove("error");
    authMessage.classList.add("success");
  }
}


// ---------------------------------------------------------
// RESET-CONFIRM-FELD ERSTELLEN
// ---------------------------------------------------------

function ensureResetConfirmField() {
  getAuthElements();

  if (resetConfirmInput) {
    return;
  }

  if (!passwordInput) {
    return;
  }

  resetConfirmInput = document.createElement("input");

  resetConfirmInput.type = "password";
  resetConfirmInput.id = "reset-confirm-password";
  resetConfirmInput.name = "reset-confirm-password";
  resetConfirmInput.placeholder = "Neues Passwort bestätigen";
  resetConfirmInput.autocomplete = "new-password";

  resetConfirmInput.style.display = "none";
  resetConfirmInput.style.width = "100%";
  resetConfirmInput.style.boxSizing = "border-box";

  passwordInput.parentNode.insertBefore(
    resetConfirmInput,
    passwordInput.nextSibling
  );
}


// ---------------------------------------------------------
// FORGOT-PASSWORD-LINK SICHERSTELLEN
// ---------------------------------------------------------

function ensureForgotPasswordLink() {
  getAuthElements();

  if (forgotPasswordLink) {
    return;
  }

  if (!passwordInput) {
    return;
  }

  forgotPasswordLink = document.createElement("button");

  forgotPasswordLink.type = "button";
  forgotPasswordLink.id = "forgot-password";
  forgotPasswordLink.textContent = "Passwort vergessen?";
  forgotPasswordLink.className = "forgot-password-link";

  forgotPasswordLink.style.background = "none";
  forgotPasswordLink.style.border = "none";
  forgotPasswordLink.style.padding = "8px 0";
  forgotPasswordLink.style.cursor = "pointer";

  passwordInput.parentNode.appendChild(
    forgotPasswordLink
  );

  forgotPasswordLink.addEventListener(
    "click",
    enterForgotPasswordMode
  );
}


// ---------------------------------------------------------
// NORMALER LOGIN-MODUS
// ---------------------------------------------------------

function enterLoginMode() {
  isPasswordRecovery = false;
  isResetMode = false;

  clearPasswordRecoveryPending();

  getAuthElements();
  ensureForgotPasswordLink();
  ensureResetConfirmField();

  if (emailInput) {
    emailInput.style.display = "";
    emailInput.disabled = false;
    emailInput.value = "";
    emailInput.placeholder = "E-Mail";
  }

  if (passwordInput) {
    passwordInput.style.display = "";
    passwordInput.disabled = false;
    passwordInput.value = "";
    passwordInput.placeholder = "Passwort";
    passwordInput.type = "password";
  }

  if (resetConfirmInput) {
    resetConfirmInput.value = "";
    resetConfirmInput.style.display = "none";
  }

  if (loginButton) {
    loginButton.style.display = "";
    loginButton.disabled = false;
    loginButton.textContent = "Einloggen";
  }

  if (registerButton) {
    registerButton.style.display = "";
  }

  if (forgotPasswordLink) {
    forgotPasswordLink.style.display = "";
    forgotPasswordLink.textContent = "Passwort vergessen?";
  }

  if (registerLink) {
    registerLink.style.display = "";
  }
}


// ---------------------------------------------------------
// PASSWORT-VERGESSEN – E-MAIL EINGEBEN
// ---------------------------------------------------------

function enterForgotPasswordMode() {
  isPasswordRecovery = false;
  isResetMode = false;

  getAuthElements();
  ensureForgotPasswordLink();
  ensureResetConfirmField();

  if (emailInput) {
    emailInput.style.display = "";
    emailInput.disabled = false;
    emailInput.value = "";
    emailInput.placeholder = "E-Mail-Adresse";
  }

  if (passwordInput) {
    passwordInput.style.display = "none";
  }

  if (resetConfirmInput) {
    resetConfirmInput.style.display = "none";
  }

  if (loginButton) {
    loginButton.style.display = "";
    loginButton.disabled = false;
    loginButton.textContent = "Reset-Link senden";
  }

  if (registerButton) {
    registerButton.style.display = "none";
  }

  if (forgotPasswordLink) {
    forgotPasswordLink.textContent = "Zurück zum Login";
    forgotPasswordLink.style.display = "";
  }

  if (registerLink) {
    registerLink.style.display = "none";
  }

  showAuthMessage(
    "Gib deine E-Mail-Adresse ein. Du bekommst anschließend einen Link zum Zurücksetzen deines Passworts.",
    false
  );

  if (loginButton) {
    loginButton.onclick = requestPasswordReset;
  }

  if (forgotPasswordLink) {
    forgotPasswordLink.onclick = enterLoginMode;
  }
}


// ---------------------------------------------------------
// RESET-E-MAIL SENDEN
// ---------------------------------------------------------

async function requestPasswordReset() {
  getAuthElements();

  const email =
    emailInput?.value?.trim() || "";

  if (!email) {
    showAuthMessage(
      "Bitte gib deine E-Mail-Adresse ein.",
      true
    );
    return;
  }

  if (!email.includes("@")) {
    showAuthMessage(
      "Bitte gib eine gültige E-Mail-Adresse ein.",
      true
    );
    return;
  }

  if (loginButton) {
    loginButton.disabled = true;
    loginButton.textContent = "Wird gesendet...";
  }

  const {
    error
  } = await supabaseClient.auth.resetPasswordForEmail(
    email,
    {
      redirectTo: PASSWORD_RESET_REDIRECT
    }
  );

  if (loginButton) {
    loginButton.disabled = false;
    loginButton.textContent = "Reset-Link senden";
  }

  if (error) {
    console.error(
      "Password reset error:",
      error
    );

    showAuthMessage(
      error.message ||
        "Der Reset-Link konnte nicht gesendet werden.",
      true
    );

    return;
  }

  // -------------------------------------------------------
  // WICHTIG:
  // Wir merken uns, dass dieser Browser auf einen
  // Passwort-Reset wartet.
  //
  // Supabase kann beim Zurückkommen die URL bereits
  // verarbeitet haben, sodass nur "#" übrig bleibt.
  // -------------------------------------------------------

  setPasswordRecoveryPending();

  showAuthMessage(
    "Wenn für diese E-Mail-Adresse ein Konto existiert, wurde ein Reset-Link gesendet. Bitte überprüfe dein E-Mail-Postfach.",
    false
  );
}


// ---------------------------------------------------------
// PASSWORT-RESET-FORMULAR
// ---------------------------------------------------------

function enterResetMode() {
  isPasswordRecovery = true;
  isResetMode = true;

  getAuthElements();
  ensureResetConfirmField();

  if (emailInput) {
    emailInput.style.display = "none";
  }

  if (passwordInput) {
    passwordInput.style.display = "";
    passwordInput.disabled = false;
    passwordInput.value = "";
    passwordInput.placeholder = "Neues Passwort";
    passwordInput.type = "password";
    passwordInput.autocomplete = "new-password";
  }

  if (resetConfirmInput) {
    resetConfirmInput.style.display = "";
    resetConfirmInput.disabled = false;
    resetConfirmInput.value = "";
    resetConfirmInput.placeholder =
      "Neues Passwort bestätigen";
    resetConfirmInput.autocomplete =
      "new-password";
  }

  if (loginButton) {
    loginButton.style.display = "";
    loginButton.disabled = false;
    loginButton.textContent = "Passwort speichern";

    loginButton.onclick = updatePassword;
  }

  if (registerButton) {
    registerButton.style.display = "none";
  }

  if (forgotPasswordLink) {
    forgotPasswordLink.style.display = "none";
  }

  if (registerLink) {
    registerLink.style.display = "none";
  }

  showAuthMessage(
    "Vergib jetzt dein neues Passwort.",
    false
  );
}


// ---------------------------------------------------------
// PASSWORT ÄNDERN
// ---------------------------------------------------------

async function updatePassword() {
  getAuthElements();

  const password =
    passwordInput?.value?.trim() || "";

  const confirmation =
    resetConfirmInput?.value?.trim() || "";

  if (!password) {
    showAuthMessage(
      "Bitte gib ein neues Passwort ein.",
      true
    );
    return;
  }

  if (password.length < 6) {
    showAuthMessage(
      "Das Passwort muss mindestens 6 Zeichen lang sein.",
      true
    );
    return;
  }

  if (!confirmation) {
    showAuthMessage(
      "Bitte bestätige dein neues Passwort.",
      true
    );
    return;
  }

  if (password !== confirmation) {
    showAuthMessage(
      "Die Passwörter stimmen nicht überein.",
      true
    );
    return;
  }

  if (loginButton) {
    loginButton.disabled = true;
    loginButton.textContent =
      "Passwort wird gespeichert...";
  }

  const {
    error
  } = await supabaseClient.auth.updateUser({
    password: password
  });

  if (error) {
    console.error(
      "Password update error:",
      error
    );

    if (loginButton) {
      loginButton.disabled = false;
      loginButton.textContent =
        "Passwort speichern";
    }

    showAuthMessage(
      error.message ||
        "Das Passwort konnte nicht geändert werden.",
      true
    );

    return;
  }

  // -------------------------------------------------------
  // Passwort erfolgreich geändert.
  // Recovery-Session beenden.
  // -------------------------------------------------------

  isPasswordRecovery = false;
  isResetMode = false;

  clearPasswordRecoveryPending();

  await supabaseClient.auth.signOut();

  enterLoginMode();

  showAuthMessage(
    "Passwort erfolgreich geändert. Du kannst dich jetzt mit deinem neuen Passwort einloggen.",
    false
  );
}


// ---------------------------------------------------------
// AUTH-MODUS AKTUALISIEREN
// ---------------------------------------------------------

function updateAuthMode() {
  if (isPasswordRecovery || isResetMode) {
    enterResetMode();
    return;
  }

  enterLoginMode();
}


// ---------------------------------------------------------
// APP ANZEIGEN
// ---------------------------------------------------------

function showApp() {

  // -------------------------------------------------------
  // WICHTIG:
  // Während Passwort-Recovery niemals Dashboard öffnen.
  // -------------------------------------------------------

  if (isPasswordRecovery || isResetMode) {
    console.log(
      "showApp() blockiert – Passwort-Recovery aktiv."
    );

    enterResetMode();
    return;
  }

  console.log("showApp()");

  const authElements = [
    document.querySelector("#auth"),
    document.querySelector(".auth"),
    document.querySelector("#auth-container"),
    document.querySelector("#login-screen"),
    document.querySelector("#loginScreen")
  ];

  authElements.forEach((element) => {
    if (element) {
      element.classList.add("hidden");
      element.style.display = "none";
    }
  });

  const appElements = [
    document.querySelector("#app"),
    document.querySelector("#app-container"),
    document.querySelector("#main-app"),
    document.querySelector("#dashboard"),
    document.querySelector("#home")
  ];

  appElements.forEach((element) => {
    if (element) {
      element.classList.remove("hidden");
      element.style.display = "";
    }
  });

  document.body.classList.add("logged-in");
}


// ---------------------------------------------------------
// LOGIN ANZEIGEN
// ---------------------------------------------------------

function showLogin() {
  console.log("showLogin()");

  const authElements = [
    document.querySelector("#auth"),
    document.querySelector(".auth"),
    document.querySelector("#auth-container"),
    document.querySelector("#login-screen"),
    document.querySelector("#loginScreen")
  ];

  authElements.forEach((element) => {
    if (element) {
      element.classList.remove("hidden");
      element.style.display = "";
    }
  });

  const appElements = [
    document.querySelector("#app"),
    document.querySelector("#app-container"),
    document.querySelector("#main-app"),
    document.querySelector("#dashboard"),
    document.querySelector("#home")
  ];

  appElements.forEach((element) => {
    if (element) {
      element.classList.add("hidden");
      element.style.display = "none";
    }
  });

  document.body.classList.remove("logged-in");
}


// ---------------------------------------------------------
// LOGIN
// ---------------------------------------------------------

async function login() {
  getAuthElements();

  const email =
    emailInput?.value?.trim() || "";

  const password =
    passwordInput?.value || "";

  if (!email || !password) {
    showAuthMessage(
      "Bitte E-Mail und Passwort eingeben.",
      true
    );
    return;
  }

  if (loginButton) {
    loginButton.disabled = true;
    loginButton.textContent = "Einloggen...";
  }

  const {
    data,
    error
  } = await supabaseClient.auth.signInWithPassword({
    email,
    password
  });

  if (loginButton) {
    loginButton.disabled = false;
    loginButton.textContent = "Einloggen";
  }

  if (error) {
    console.error(
      "Login error:",
      error
    );

    showAuthMessage(
      error.message ||
        "Login fehlgeschlagen.",
      true
    );

    return;
  }

  // Falls vorher ein alter Recovery-Marker existierte,
  // ist der normale Login jetzt wieder eindeutig.
  clearPasswordRecoveryPending();

  console.log(
    "Login erfolgreich:",
    data?.user?.email
  );

  showAuthMessage(
    "Erfolgreich eingeloggt.",
    false
  );

  showApp();
}


// ---------------------------------------------------------
// REGISTRIERUNG
// ---------------------------------------------------------

async function register() {
  getAuthElements();

  const email =
    emailInput?.value?.trim() || "";

  const password =
    passwordInput?.value || "";

  if (!email || !password) {
    showAuthMessage(
      "Bitte E-Mail und Passwort eingeben.",
      true
    );
    return;
  }

  if (password.length < 6) {
    showAuthMessage(
      "Das Passwort muss mindestens 6 Zeichen lang sein.",
      true
    );
    return;
  }

  if (registerButton) {
    registerButton.disabled = true;
    registerButton.textContent =
      "Registrieren...";
  }

  const {
    data,
    error
  } = await supabaseClient.auth.signUp({
    email,
    password
  });

  if (registerButton) {
    registerButton.disabled = false;
    registerButton.textContent =
      "Registrieren";
  }

  if (error) {
    console.error(
      "Registration error:",
      error
    );

    showAuthMessage(
      error.message ||
        "Registrierung fehlgeschlagen.",
      true
    );

    return;
  }

  if (data?.session) {
    clearPasswordRecoveryPending();

    showApp();

    showAuthMessage(
      "Registrierung erfolgreich.",
      false
    );
  } else {
    showAuthMessage(
      "Registrierung erfolgreich. Bitte bestätige deine E-Mail-Adresse.",
      false
    );
  }
}


// ---------------------------------------------------------
// AUTH STATE CHANGE
// ---------------------------------------------------------

supabaseClient.auth.onAuthStateChange(
  (event, session) => {

    console.log(
      "SUPABASE AUTH EVENT:",
      event,
      session ? "SESSION" : "NO SESSION"
    );

    // -----------------------------------------------------
    // PASSWORD_RECOVERY
    // -----------------------------------------------------

    if (event === "PASSWORD_RECOVERY") {

      console.log(
        "PASSWORD_RECOVERY erkannt."
      );

      isPasswordRecovery = true;
      isResetMode = true;

      enterResetMode();

      return;
    }


    // -----------------------------------------------------
    // Während Recovery niemals automatisch anmelden
    // -----------------------------------------------------

    if (isPasswordRecovery || isResetMode) {

      console.log(
        "Normale Session-Anzeige blockiert – Recovery aktiv."
      );

      return;
    }


    // -----------------------------------------------------
    // NORMALER LOGIN
    // -----------------------------------------------------

    if (event === "SIGNED_IN" && session) {
      showApp();
      return;
    }


    // -----------------------------------------------------
    // LOGOUT
    // -----------------------------------------------------

    if (event === "SIGNED_OUT") {
      showLogin();
      return;
    }


    // -----------------------------------------------------
    // INITIAL SESSION
    // -----------------------------------------------------

    if (event === "INITIAL_SESSION") {

      // ---------------------------------------------------
      // GANZ WICHTIG:
      // Wenn vorher ein Passwort-Reset gestartet wurde,
      // darf die vorhandene Recovery-Session NICHT als
      // normaler Login behandelt werden.
      // ---------------------------------------------------

      if (isPasswordRecoveryPending()) {

        console.log(
          "INITIAL_SESSION: Passwort-Recovery wartet – Dashboard bleibt geschlossen."
        );

        isPasswordRecovery = true;
        isResetMode = true;

        showLogin();
        enterResetMode();

        return;
      }

      if (session) {
        showApp();
      } else {
        showLogin();
      }

      return;
    }
  }
);


// ---------------------------------------------------------
// INIT AUTH
// ---------------------------------------------------------

async function initAuth() {

  getAuthElements();

  ensureForgotPasswordLink();
  ensureResetConfirmField();


  // -------------------------------------------------------
  // URL PRÜFEN
  // -------------------------------------------------------

  const hash =
    window.location.hash || "";

  const search =
    window.location.search || "";


  console.log(
    "AUTH URL:",
    window.location.href
  );

  console.log(
    "HASH:",
    hash
  );

  console.log(
    "SEARCH:",
    search
  );


  // -------------------------------------------------------
  // RECOVERY AUS URL ERKENNEN
  // -------------------------------------------------------

  const hasRecoveryHash =
    hash.includes("type=recovery") ||
    hash.includes("access_token=") ||
    hash.includes("refresh_token=");

  const hasRecoveryQuery =
    search.includes("type=recovery");

  const hasRecoveryCode =
    search.includes("code=");


  // -------------------------------------------------------
  // RECOVERY AUS URL ODER STORAGE
  // -------------------------------------------------------

  if (
    hasRecoveryHash ||
    hasRecoveryQuery ||
    hasRecoveryCode ||
    isPasswordRecoveryPending()
  ) {

    console.log(
      "Passwort-Recovery erkannt."
    );

    isPasswordRecovery = true;
    isResetMode = true;

    showLogin();
    enterResetMode();

    return;
  }


  // -------------------------------------------------------
  // SESSION LADEN
  // -------------------------------------------------------

  const {
    data,
    error
  } = await supabaseClient.auth.getSession();


  if (error) {

    console.error(
      "getSession error:",
      error
    );

    showLogin();

    return;
  }


  // -------------------------------------------------------
  // RECOVERY NIEMALS DURCH SESSION ÜBERSCHREIBEN
  // -------------------------------------------------------

  if (
    isPasswordRecovery ||
    isResetMode
  ) {

    enterResetMode();

    return;
  }


  // -------------------------------------------------------
  // NORMALE SESSION
  // -------------------------------------------------------

  if (data?.session) {

    console.log(
      "Normale Session gefunden."
    );

    showApp();

  } else {

    console.log(
      "Keine Session gefunden."
    );

    showLogin();
  }
}


// ---------------------------------------------------------
// BUTTONS VERBINDEN
// ---------------------------------------------------------

function setupAuthButtons() {

  getAuthElements();

  ensureForgotPasswordLink();
  ensureResetConfirmField();


  // LOGIN
  if (loginButton) {

    loginButton.onclick = () => {

      if (
        isPasswordRecovery ||
        isResetMode
      ) {
        updatePassword();
      } else {
        login();
      }
    };
  }


  // REGISTRIEREN
  if (registerButton) {

    registerButton.onclick = () => {
      register();
    };
  }


  // PASSWORT VERGESSEN
  if (forgotPasswordLink) {

    forgotPasswordLink.onclick = () => {

      if (
        isPasswordRecovery ||
        isResetMode
      ) {
        return;
      }

      enterForgotPasswordMode();
    };
  }
}


// ---------------------------------------------------------
// START
// ---------------------------------------------------------

document.addEventListener(
  "DOMContentLoaded",
  () => {

    console.log(
      "HYPE Auth wird gestartet..."
    );

    getAuthElements();

    setupAuthButtons();

    initAuth();
  }
);


// ---------------------------------------------------------
// GLOBALE FUNKTIONEN
// ---------------------------------------------------------

window.login = login;
window.register = register;
window.updatePassword = updatePassword;
window.requestPasswordReset =
  requestPasswordReset;
window.enterForgotPasswordMode =
  enterForgotPasswordMode;
window.enterResetMode =
  enterResetMode;
window.showApp = showApp;
window.showLogin = showLogin;
window.initAuth = initAuth;