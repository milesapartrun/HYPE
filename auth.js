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
window.supabaseClient =
  supabaseClient;


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

let isRegisterMode =
  false;

let instagramCompleted =
  false;

let shareCompleted =
  false;


/*
 * Passwort-Reset-Zustand
 */
let isPasswordRecovery =
  false;


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


/*
 * Diese URL wird in die Passwort-Reset-Mail
 * eingebaut.
 *
 * Der Nutzer kommt nach dem Klick auf den
 * Link wieder genau auf diese Seite zurück.
 */
function getPasswordResetRedirectUrl() {

  return (
    window.location.origin +
    window.location.pathname
  );

}


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

    instagramCompleted =
      false;

    shareCompleted =
      false;

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


/* =========================================================
   PASSWORT VERGESSEN
========================================================= */


/*
 * Fügt den Link
 *
 * "Passwort vergessen?"
 *
 * direkt unter dem Passwortfeld ein.
 */
function ensureForgotPasswordLink() {

  if (!authForm || !authPassword) {
    return;
  }


  let existing =
    document.getElementById(
      "forgotPasswordLink"
    );


  if (existing) {
    return;
  }


  existing =
    document.createElement(
      "button"
    );

  existing.type =
    "button";

  existing.id =
    "forgotPasswordLink";

  existing.textContent =
    "Passwort vergessen?";


  /*
   * Optisch passend zu HYPE.
   * Dadurch brauchen wir keine zusätzliche
   * CSS-Datei nur für diese Funktion.
   */

  existing.style.display =
    "block";

  existing.style.width =
    "100%";

  existing.style.margin =
    "10px 0 0";

  existing.style.padding =
    "6px 4px";

  existing.style.border =
    "0";

  existing.style.background =
    "transparent";

  existing.style.color =
    "var(--muted)";

  existing.style.fontSize =
    "11px";

  existing.style.fontWeight =
    "700";

  existing.style.textAlign =
    "right";

  existing.style.cursor =
    "pointer";

  existing.style.textDecoration =
    "none";

  existing.style.transition =
    "color .15s ease";


  existing.addEventListener(
    "mouseenter",
    () => {

      existing.style.color =
        "var(--accent)";

    }
  );


  existing.addEventListener(
    "mouseleave",
    () => {

      existing.style.color =
        "var(--muted)";

    }
  );


  existing.addEventListener(
    "click",
    () => {

      openForgotPassword();

    }
  );


  /*
   * Wir setzen den Link direkt nach
   * dem Passwortfeld bzw. dessen Label.
   */

  const passwordLabel =
    authPassword.closest("label");


  if (passwordLabel) {

    passwordLabel.insertAdjacentElement(
      "afterend",
      existing
    );

    return;

  }


  authPassword.insertAdjacentElement(
    "afterend",
    existing
  );

}


/*
 * Entfernt bzw. versteckt den Link,
 * wenn wir uns im Registrierungsmodus
 * oder Passwort-Reset-Modus befinden.
 */
function updateForgotPasswordLink() {

  const link =
    document.getElementById(
      "forgotPasswordLink"
    );


  if (!link) {
    return;
  }


  if (
    isRegisterMode ||
    isPasswordRecovery
  ) {

    link.style.display =
      "none";

    return;

  }


  link.style.display =
    "block";

}


/* =========================================================
   PASSWORT RESET – E-MAIL
========================================================= */

async function sendPasswordResetEmail() {

  const email =
    authEmail?.value.trim();


  if (!email) {

    showAuthMessage(
      "Bitte gib zuerst deine E-Mail-Adresse ein.",
      "error"
    );

    authEmail?.focus();

    return;

  }


  clearAuthMessage();


  /*
   * Button temporär deaktivieren,
   * damit nicht mehrfach geklickt wird.
   */

  const forgotButton =
    document.getElementById(
      "forgotPasswordLink"
    );


  if (forgotButton) {

    forgotButton.disabled =
      true;

    forgotButton.textContent =
      "E-Mail wird gesendet …";

  }


  try {

    const {
      error
    } =
      await supabaseClient.auth
        .resetPasswordForEmail(
          email,
          {
            redirectTo:
              getPasswordResetRedirectUrl()
          }
        );


    if (error) {

      console.error(
        "HYPE password reset error:",
        error
      );


      showAuthMessage(
        getAuthErrorMessage(error),
        "error"
      );


      return;

    }


    /*
     * Absichtlich keine Aussage darüber,
     * ob die E-Mail tatsächlich zu einem
     * bestehenden Account gehört.
     *
     * Das verhindert User Enumeration.
     */

    showAuthMessage(
      "Wenn für diese E-Mail ein HYPE-Account existiert, wurde eine E-Mail zum Zurücksetzen des Passworts gesendet. Bitte prüfe auch deinen Spam-Ordner.",
      "success"
    );


  } catch (error) {

    console.error(
      "HYPE password reset exception:",
      error
    );


    showAuthMessage(
      "Die Passwort-Reset-Mail konnte nicht angefordert werden. Bitte versuche es erneut.",
      "error"
    );


  } finally {

    if (forgotButton) {

      forgotButton.disabled =
        false;

      forgotButton.textContent =
        "Passwort vergessen?";

    }

  }

}


/* =========================================================
   PASSWORT RESET – VIEW
========================================================= */

function getPasswordResetView() {

  return document.getElementById(
    "passwordResetView"
  );

}


function ensurePasswordResetView() {

  let view =
    getPasswordResetView();


  if (view) {
    return view;
  }


  if (!authForm) {
    return null;
  }


  view =
    document.createElement(
      "div"
    );

  view.id =
    "passwordResetView";

  view.className =
    "auth-form hidden";


  view.innerHTML = `

    <div
      style="
        margin-bottom:22px;
      "
    >

      <div
        style="
          color:var(--muted);
          font-size:11px;
          font-weight:800;
          letter-spacing:.12em;
          text-transform:uppercase;
          margin-bottom:6px;
        "
      >
        ACCOUNT
      </div>

      <h2
        style="
          margin:0;
          color:var(--text);
          font-size:26px;
          line-height:1.1;
          letter-spacing:-.04em;
        "
      >
        Neues Passwort
      </h2>

      <p
        style="
          margin:9px 0 0;
          color:var(--muted);
          font-size:12px;
          line-height:1.5;
        "
      >
        Gib dein neues Passwort ein.
      </p>

    </div>


    <label>

      Neues Passwort

      <input
        type="password"
        id="resetNewPassword"
        autocomplete="new-password"
        placeholder="Neues Passwort"
        minlength="6"
      >

    </label>


    <label>

      Passwort bestätigen

      <input
        type="password"
        id="resetConfirmPassword"
        autocomplete="new-password"
        placeholder="Passwort wiederholen"
        minlength="6"
      >

    </label>


    <button
      type="button"
      id="resetPasswordSubmit"
      class="primary full"
    >
      Passwort speichern
    </button>


    <button
      type="button"
      id="resetPasswordBack"
      style="
        width:100%;
        margin-top:10px;
        padding:10px;
        border:0;
        background:transparent;
        color:var(--muted);
        font-size:11px;
        font-weight:700;
        cursor:pointer;
      "
    >
      ← Zurück zum Login
    </button>

  `;


  /*
   * Direkt nach dem normalen Login-Formular
   * in denselben Auth-Container einsetzen.
   */

  authForm.insertAdjacentElement(
    "afterend",
    view
  );


  const submitButton =
    document.getElementById(
      "resetPasswordSubmit"
    );


  const backButton =
    document.getElementById(
      "resetPasswordBack"
    );


  if (submitButton) {

    submitButton.addEventListener(
      "click",
      updatePassword
    );

  }


  if (backButton) {

    backButton.addEventListener(
      "click",
      () => {

        isPasswordRecovery =
          false;

        hidePasswordResetView();

        showLogin();

      }
    );

  }


  return view;

}


/*
 * Zeigt das Formular zum Setzen
 * des neuen Passworts.
 */
function showPasswordResetView() {

  const view =
    ensurePasswordResetView();


  if (!view) {
    return;
  }


  isPasswordRecovery =
    true;


  /*
   * Auth-Seite sichtbar halten.
   */

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


  /*
   * Normales Login-Formular ausblenden.
   */

  if (authForm) {

    authForm.classList.add(
      "hidden"
    );

  }


  if (authSwitch) {

    authSwitch.classList.add(
      "hidden"
    );

  }


  if (authSubtitle) {

    authSubtitle.innerHTML = `
      Setze dein HYPE-Passwort zurück.
    `;

  }


  view.classList.remove(
    "hidden"
  );


  updateForgotPasswordLink();


  clearAuthMessage();


  /*
   * Cursor direkt ins neue Passwortfeld.
   */

  setTimeout(
    () => {

      document
        .getElementById(
          "resetNewPassword"
        )
        ?.focus();

    },
    100
  );

}


/*
 * Passwort-Reset-Formular wieder
 * ausblenden.
 */
function hidePasswordResetView() {

  const view =
    getPasswordResetView();


  if (view) {

    view.classList.add(
      "hidden"
    );

  }


  if (authForm) {

    authForm.classList.remove(
      "hidden"
    );

  }


  if (authSwitch) {

    authSwitch.classList.remove(
      "hidden"
    );

  }


  isPasswordRecovery =
    false;


  updateForgotPasswordLink();

}


/* =========================================================
   PASSWORT AKTUALISIEREN
========================================================= */

async function updatePassword() {

  const newPassword =
    document
      .getElementById(
        "resetNewPassword"
      )
      ?.value || "";


  const confirmPassword =
    document
      .getElementById(
        "resetConfirmPassword"
      )
      ?.value || "";


  if (!newPassword) {

    showAuthMessage(
      "Bitte gib ein neues Passwort ein.",
      "error"
    );

    return;

  }


  if (newPassword.length < 6) {

    showAuthMessage(
      "Das neue Passwort muss mindestens 6 Zeichen haben.",
      "error"
    );

    return;

  }


  if (
    newPassword !==
    confirmPassword
  ) {

    showAuthMessage(
      "Die beiden Passwörter stimmen nicht überein.",
      "error"
    );

    return;

  }


  const submitButton =
    document.getElementById(
      "resetPasswordSubmit"
    );


  if (submitButton) {

    submitButton.disabled =
      true;

    submitButton.textContent =
      "Passwort wird gespeichert …";

  }


  clearAuthMessage();


  try {

    const {
      data,
      error
    } =
      await supabaseClient.auth
        .updateUser({
          password:
            newPassword
        });


    if (error) {

      console.error(
        "HYPE password update error:",
        error
      );


      showAuthMessage(
        getAuthErrorMessage(error),
        "error"
      );


      return;

    }


    console.log(
      "HYPE password successfully updated:",
      data
    );


    /*
     * Nach erfolgreicher Änderung
     * aus der Recovery-Session ausloggen.
     *
     * Danach muss sich der Nutzer mit
     * dem neuen Passwort einloggen.
     */

    await supabaseClient.auth.signOut();


    hidePasswordResetView();


    showLogin();


    showAuthMessage(
      "Dein Passwort wurde erfolgreich geändert. Du kannst dich jetzt mit deinem neuen Passwort einloggen.",
      "success"
    );


  } catch (error) {

    console.error(
      "HYPE password update exception:",
      error
    );


    showAuthMessage(
      "Das Passwort konnte nicht geändert werden. Bitte versuche den Link aus der E-Mail erneut.",
      "error"
    );


  } finally {

    if (submitButton) {

      submitButton.disabled =
        false;

      submitButton.textContent =
        "Passwort speichern";

    }

  }

}


/* =========================================================
   FORGOT PASSWORD ÖFFNEN
========================================================= */

function openForgotPassword() {

  /*
   * Wir bleiben auf derselben Login-Seite.
   * Der Nutzer kann seine E-Mail dort
   * direkt eingeben.
   */

  isRegisterMode =
    false;

  clearAuthMessage();


  /*
   * E-Mail-Adresse behalten.
   */

  const currentEmail =
    authEmail?.value.trim() || "";


  /*
   * Einfacher Dialog für die E-Mail.
   */

  const existing =
    document.getElementById(
      "forgotPasswordDialog"
    );


  if (existing) {

    existing.remove();

  }


  const overlay =
    document.createElement(
      "div"
    );

  overlay.id =
    "forgotPasswordDialog";


  overlay.style.position =
    "fixed";

  overlay.style.inset =
    "0";

  overlay.style.zIndex =
    "1000";

  overlay.style.display =
    "flex";

  overlay.style.alignItems =
    "center";

  overlay.style.justifyContent =
    "center";

  overlay.style.padding =
    "20px";

  overlay.style.background =
    "rgba(0,0,0,.72)";

  overlay.style.backdropFilter =
    "blur(10px)";

  overlay.style.webkitBackdropFilter =
    "blur(10px)";


  const card =
    document.createElement(
      "div"
    );


  card.style.width =
    "min(430px,100%)";

  card.style.padding =
    "24px";

  card.style.background =
    "#14171c";

  card.style.border =
    "1px solid var(--line)";

  card.style.borderRadius =
    "22px";

  card.style.boxShadow =
    "0 30px 100px rgba(0,0,0,.6)";


  card.innerHTML = `

    <div
      style="
        color:var(--muted);
        font-size:11px;
        font-weight:800;
        letter-spacing:.12em;
        margin-bottom:6px;
      "
    >
      ACCOUNT
    </div>

    <h3
      style="
        margin:0;
        color:var(--text);
        font-size:24px;
        line-height:1.1;
      "
    >
      Passwort vergessen?
    </h3>

    <p
      style="
        margin:10px 0 18px;
        color:var(--muted);
        font-size:12px;
        line-height:1.5;
      "
    >
      Gib die E-Mail-Adresse deines HYPE-Accounts ein.
      Wir schicken dir einen Link, über den du ein neues
      Passwort festlegen kannst.
    </p>

    <label
      style="
        display:block;
        margin:0 0 14px;
      "
    >

      E-Mail

      <input
        type="email"
        id="forgotPasswordEmail"
        autocomplete="email"
        placeholder="deine@email.de"
        value=""
      >

    </label>

    <button
      type="button"
      id="forgotPasswordSend"
      class="primary full"
    >
      Reset-E-Mail senden
    </button>

    <button
      type="button"
      id="forgotPasswordCancel"
      style="
        width:100%;
        margin-top:9px;
        padding:10px;
        border:0;
        background:transparent;
        color:var(--muted);
        font-size:11px;
        font-weight:700;
        cursor:pointer;
      "
    >
      Abbrechen
    </button>

    <div
      id="forgotPasswordDialogMessage"
      style="
        min-height:18px;
        margin-top:10px;
        color:var(--muted);
        font-size:11px;
        line-height:1.45;
        text-align:center;
      "
    ></div>

  `;


  overlay.appendChild(
    card
  );


  document.body.appendChild(
    overlay
  );


  const emailInput =
    document.getElementById(
      "forgotPasswordEmail"
    );


  /*
   * Aktuelle Login-E-Mail übernehmen,
   * wenn schon eine eingegeben wurde.
   */

  if (currentEmail) {

    emailInput.value =
      currentEmail;

  }


  const sendButton =
    document.getElementById(
      "forgotPasswordSend"
    );


  const cancelButton =
    document.getElementById(
      "forgotPasswordCancel"
    );


  const dialogMessage =
    document.getElementById(
      "forgotPasswordDialogMessage"
    );


  if (cancelButton) {

    cancelButton.addEventListener(
      "click",
      () => {

        overlay.remove();

      }
    );

  }


  if (sendButton) {

    sendButton.addEventListener(
      "click",
      async () => {

        const email =
          emailInput.value.trim();


        if (!email) {

          dialogMessage.textContent =
            "Bitte gib deine E-Mail-Adresse ein.";

          dialogMessage.style.color =
            "var(--danger)";

          emailInput.focus();

          return;

        }


        sendButton.disabled =
          true;

        sendButton.textContent =
          "E-Mail wird gesendet …";


        dialogMessage.textContent =
          "";


        try {

          const {
            error
          } =
            await supabaseClient.auth
              .resetPasswordForEmail(
                email,
                {
                  redirectTo:
                    getPasswordResetRedirectUrl()
                }
              );


          if (error) {

            console.error(
              "HYPE password reset dialog error:",
              error
            );


            dialogMessage.textContent =
              getAuthErrorMessage(
                error
              );

            dialogMessage.style.color =
              "var(--danger)";


            sendButton.disabled =
              false;

            sendButton.textContent =
              "Reset-E-Mail senden";

            return;

          }


          dialogMessage.textContent =
            "Wenn für diese E-Mail ein HYPE-Account existiert, wurde eine Reset-E-Mail gesendet. Bitte prüfe auch deinen Spam-Ordner.";

          dialogMessage.style.color =
            "var(--accent)";


          sendButton.textContent =
            "E-Mail gesendet";


          /*
           * Nach erfolgreichem Versand
           * kurz offen lassen, damit der Nutzer
           * die Meldung lesen kann.
           */

          setTimeout(
            () => {

              overlay.remove();

            },
            3500
          );


        } catch (error) {

          console.error(
            "HYPE password reset dialog exception:",
            error
          );


          dialogMessage.textContent =
            "Die E-Mail konnte nicht gesendet werden. Bitte versuche es erneut.";

          dialogMessage.style.color =
            "var(--danger)";


          sendButton.disabled =
            false;

          sendButton.textContent =
            "Reset-E-Mail senden";

        }

      }
    );

  }


  /*
   * Klick auf den dunklen Hintergrund
   * schließt den Dialog.
   */

  overlay.addEventListener(
    "click",
    event => {

      if (
        event.target ===
        overlay
      ) {

        overlay.remove();

      }

    }
  );


  setTimeout(
    () => {

      emailInput?.focus();

    },
    50
  );

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
            `Bitte teile diesen Link mit jemandem: ${HYPE_SHARE_URL}`,
            "success"
          );

        } catch (error) {

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

  ensureForgotPasswordLink();


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

    updateForgotPasswordLink();

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

  updateForgotPasswordLink();

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
    await supabaseClient.auth
      .signInWithPassword({

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
    await supabaseClient.auth
      .signUp({

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


  if (
    data &&
    data.session
  ) {

    clearGateProgress();

    showApp();

    return;

  }


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
    await supabaseClient.auth
      .updateUser({

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
    await supabaseClient.auth
      .getUser();


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


  if (
    message.includes(
      "same password"
    )
  ) {

    return "Das neue Passwort muss sich vom bisherigen Passwort unterscheiden.";

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


  /*
   * Passwort-Reset-Ansicht schließen.
   */

  hidePasswordResetView();


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
    await supabaseClient.auth
      .signOut();


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

    /*
     * GANZ WICHTIG:
     *
     * Wenn der Nutzer den Link aus der
     * Passwort-Reset-Mail anklickt, meldet
     * Supabase PASSWORD_RECOVERY.
     *
     * Dann NICHT die normale App öffnen,
     * sondern das neue Passwortformular.
     */

    if (
      event ===
      "PASSWORD_RECOVERY"
    ) {

      showPasswordResetView();

      return;

    }


    /*
     * Normale eingeloggte Session.
     */

    if (session) {

      if (!isPasswordRecovery) {

        showApp();

      }

      return;

    }


    if (
      event === "SIGNED_OUT" ||
      event === "INITIAL_SESSION"
    ) {

      /*
       * Während eines Passwort-Recovery-Flows
       * darf die Login-Ansicht nicht dazwischenfunken.
       */

      if (
        isPasswordRecovery
      ) {

        return;

      }


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
    await supabaseClient.auth
      .getSession();


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


  /*
   * Wenn die Seite über einen Recovery-Link
   * geöffnet wurde, übernimmt das
   * PASSWORD_RECOVERY-Event.
   *
   * Wir öffnen hier deshalb nur die normale
   * App, wenn kein Recovery-Flow aktiv ist.
   */

  if (
    data.session &&
    !isPasswordRecovery
  ) {

    showApp();

  } else if (
    !isPasswordRecovery
  ) {

    showLogin();

  }

}


/* =========================
   START
========================= */

ensureFirstNameField();

ensureForgotPasswordLink();

ensurePasswordResetView();

loadGateProgress();

updateAuthMode();

initAuth();