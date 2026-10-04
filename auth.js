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

let isResetMode = false;

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

const PASSWORD_RESET_REDIRECT =
  window.location.origin +
  window.location.pathname;

const AVATAR_BUCKET =
  "avatars";

const MAX_AVATAR_SIZE =
  5 * 1024 * 1024;


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
   PASSWORD RESET UI
========================= */

function ensureForgotPasswordLink() {

  if (!authForm || !authPassword) {
    return;
  }


  let link =
    document.getElementById(
      "forgotPasswordLink"
    );


  if (link) {
    return link;
  }


  link =
    document.createElement(
      "button"
    );

  link.type =
    "button";

  link.id =
    "forgotPasswordLink";

  link.textContent =
    "Passwort vergessen?";


  link.style.cssText = `
    display:block;
    width:100%;
    margin:8px 0 0;
    padding:4px 0;
    border:0;
    background:transparent;
    color:#d7ff3f;
    font-size:13px;
    font-weight:800;
    text-align:right;
    cursor:pointer;
  `;


  authPassword.insertAdjacentElement(
    "afterend",
    link
  );


  link.addEventListener(
    "click",
    () => {

      enterForgotPasswordMode();

    }
  );


  return link;

}


function ensureResetConfirmField() {

  if (!authForm) {
    return null;
  }


  let field =
    document.getElementById(
      "authResetConfirmField"
    );


  if (field) {
    return field;
  }


  field =
    document.createElement(
      "label"
    );

  field.id =
    "authResetConfirmField";

  field.className =
    "auth-reset-confirm-field hidden";


  const label =
    document.createElement(
      "span"
    );

  label.textContent =
    "Passwort wiederholen";


  const input =
    document.createElement(
      "input"
    );

  input.type =
    "password";

  input.id =
    "authResetConfirm";

  input.name =
    "password_confirmation";

  input.placeholder =
    "Passwort wiederholen";

  input.autocomplete =
    "new-password";


  field.appendChild(
    label
  );

  field.appendChild(
    input
  );


  authPassword.insertAdjacentElement(
    "afterend",
    field
  );


  return field;

}


function getResetConfirmInput() {

  return document.getElementById(
    "authResetConfirm"
  );

}


function updateForgotPasswordLink() {

  const link =
    document.getElementById(
      "forgotPasswordLink"
    );


  if (!link) {
    return;
  }


  link.classList.toggle(
    "hidden",
    isRegisterMode ||
    isResetMode
  );

}


function enterForgotPasswordMode() {

  isRegisterMode =
    false;

  isResetMode =
    true;


  clearAuthMessage();


  const resetField =
    ensureResetConfirmField();


  if (resetField) {

    resetField.classList.remove(
      "hidden"
    );

  }


  if (authEmail) {

    authEmail.closest("label")?.classList.remove(
      "hidden"
    );

    authEmail.required =
      true;

  }


  if (authPassword) {

    authPassword.value =
      "";

    authPassword.placeholder =
      "Neues Passwort";

    authPassword.autocomplete =
      "new-password";

    authPassword.required =
      true;

  }


  if (authSubtitle) {

    authSubtitle.innerHTML = `
      Neues Passwort.<br>
      Neuer Start.<br>
      Dein HYPE.
    `;

  }


  if (authSubmit) {

    authSubmit.textContent =
      "Passwort ändern";

    authSubmit.disabled =
      false;

  }


  if (authSwitch) {

    authSwitch.disabled =
      false;

    authSwitch.innerHTML = `
      <span style="
        display:block;
        color:#f5f6f7;
        font-size:13px;
        font-weight:800;
        margin-bottom:4px;
      ">
        Doch nicht?
      </span>

      <span style="
        display:block;
        color:#d7ff3f;
        font-size:13px;
        font-weight:900;
      ">
        → Zurück zum Login
      </span>
    `;

  }


  getRegistrationGate()?.remove();

  updateFirstNameField();

  updateForgotPasswordLink();


  setTimeout(
    () => {

      authPassword?.focus();

    },
    50
  );

}


function enterResetRequestMode() {

  isRegisterMode =
    false;

  isResetMode =
    false;


  clearAuthMessage();


  if (authSubtitle) {

    authSubtitle.innerHTML = `
      Passwort vergessen?<br>
      Wir schicken dir einen<br>
      Link zum Zurücksetzen.
    `;

  }


  if (authEmail) {

    authEmail.value =
      "";

    authEmail.required =
      true;

    authEmail.focus();

  }


  if (authPassword) {

    authPassword.value =
      "";

    authPassword.required =
      false;

  }


  const resetField =
    document.getElementById(
      "authResetConfirmField"
    );

  resetField?.classList.add(
    "hidden"
  );


  if (authSubmit) {

    authSubmit.textContent =
      "Reset-Link senden";

    authSubmit.disabled =
      false;

  }


  if (authSwitch) {

    authSwitch.disabled =
      false;

    authSwitch.innerHTML = `
      <span style="
        display:block;
        color:#f5f6f7;
        font-size:13px;
        font-weight:800;
        margin-bottom:4px;
      ">
        Wieder eingefallen?
      </span>

      <span style="
        display:block;
        color:#d7ff3f;
        font-size:13px;
        font-weight:900;
      ">
        → Zurück zum Login
      </span>
    `;

  }


  getRegistrationGate()?.remove();

  updateFirstNameField();

  updateForgotPasswordLink();

}


function enterLoginMode() {

  isRegisterMode =
    false;

  isResetMode =
    false;


  clearAuthMessage();


  const resetField =
    document.getElementById(
      "authResetConfirmField"
    );

  resetField?.classList.add(
    "hidden"
  );


  if (authEmail) {

    authEmail.value =
      "";

    authEmail.required =
      true;

  }


  if (authPassword) {

    authPassword.value =
      "";

    authPassword.placeholder =
      "";

    authPassword.autocomplete =
      "current-password";

    authPassword.required =
      true;

  }


  updateAuthMode();

  updateForgotPasswordLink();

}


async function requestPasswordReset() {

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


  setAuthLoading(true);

  clearAuthMessage();


  const {
    error
  } =
    await supabaseClient.auth.resetPasswordForEmail(
      email,
      {
        redirectTo:
          PASSWORD_RESET_REDIRECT
      }
    );


  setAuthLoading(false);


  if (error) {

    console.error(
      "HYPE password reset request error:",
      error
    );


    showAuthMessage(
      getAuthErrorMessage(error),
      "error"
    );

    return;

  }


  showAuthMessage(
    "Reset-Link gesendet. Prüfe jetzt deine E-Mails.",
    "success"
  );

}


async function updatePassword() {

  const password =
    authPassword?.value || "";

  const confirm =
    getResetConfirmInput()?.value || "";


  if (!password) {

    showAuthMessage(
      "Bitte gib ein neues Passwort ein.",
      "error"
    );

    authPassword?.focus();

    return;

  }


  if (password.length < 6) {

    showAuthMessage(
      "Das Passwort muss mindestens 6 Zeichen haben.",
      "error"
    );

    return;

  }


  if (password !== confirm) {

    showAuthMessage(
      "Die Passwörter stimmen nicht überein.",
      "error"
    );

    getResetConfirmInput()?.focus();

    return;

  }


  setAuthLoading(true);

  clearAuthMessage();


  const {
    error
  } =
    await supabaseClient.auth.updateUser({
      password
    });


  setAuthLoading(false);


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


  isResetMode =
    false;

  isRegisterMode =
    false;


  if (authPassword) {

    authPassword.value =
      "";

    authPassword.placeholder =
      "";

  }


  if (getResetConfirmInput()) {

    getResetConfirmInput().value =
      "";

  }


  showAuthMessage(
    "Passwort erfolgreich geändert. Du kannst dich jetzt einloggen.",
    "success"
  );


  updateAuthMode();

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

  if (isResetMode) {
    return;
  }


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


  if (authSwitch) {

    authSwitch.disabled =
      loading;

  }


  if (loading) {

    authSubmit.textContent =
      "Bitte warten …";

    authSubmit.disabled =
      true;

    return;

  }


  if (isResetMode) {

    authSubmit.textContent =
      "Passwort ändern";

    authSubmit.disabled =
      false;

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
   UPDATE PROFILE FIRST NAME
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
   PROFILE AVATAR UPLOAD
========================= */

function getAvatarExtension(
  file
) {

  const type =
    String(
      file?.type || ""
    ).toLowerCase();


  if (
    type === "image/jpeg"
  ) {
    return "jpg";
  }


  if (
    type === "image/png"
  ) {
    return "png";
  }


  if (
    type === "image/webp"
  ) {
    return "webp";
  }


  return null;

}


async function uploadProfileAvatar(
  file
) {

  if (!file) {

    return {
      success: false,
      error:
        "Bitte wähle ein Bild aus."
    };

  }


  const extension =
    getAvatarExtension(file);


  if (!extension) {

    return {
      success: false,
      error:
        "Bitte verwende JPG, PNG oder WebP."
    };

  }


  if (
    file.size >
    MAX_AVATAR_SIZE
  ) {

    return {
      success: false,
      error:
        "Das Profilbild darf maximal 5 MB groß sein."
    };

  }


  const {
    data: userData,
    error: userError
  } =
    await supabaseClient.auth.getUser();


  if (
    userError ||
    !userData?.user
  ) {

    return {
      success: false,
      error:
        "Du musst eingeloggt sein, um ein Profilbild hochzuladen."
    };

  }


  const user =
    userData.user;


  const path =
    `${user.id}/avatar-${Date.now()}.${extension}`;


  try {

    const {
      error: uploadError
    } =
      await supabaseClient.storage
        .from(AVATAR_BUCKET)
        .upload(
          path,
          file,
          {
            cacheControl:
              "3600",
            upsert:
              false,
            contentType:
              file.type
          }
        );


    if (uploadError) {

      console.error(
        "HYPE avatar upload error:",
        uploadError
      );


      return {
        success: false,
        error:
          "Das Profilbild konnte nicht hochgeladen werden."
      };

    }


    const {
      data: publicUrlData
    } =
      supabaseClient.storage
        .from(AVATAR_BUCKET)
        .getPublicUrl(path);


    const publicUrl =
      publicUrlData?.publicUrl;


    if (!publicUrl) {

      return {
        success: false,
        error:
          "Die URL des Profilbilds konnte nicht erstellt werden."
      };

    }


    const {
      data: updatedUserData,
      error: updateError
    } =
      await supabaseClient.auth.updateUser({

        data: {

          avatar_url:
            publicUrl

        }

      });


    if (updateError) {

      console.error(
        "HYPE avatar profile update error:",
        updateError
      );


      return {
        success: false,
        error:
          "Das Bild wurde hochgeladen, konnte aber nicht im Profil gespeichert werden."
      };

    }


    return {
      success: true,
      url:
        publicUrl,
      user:
        updatedUserData?.user || null
    };

  } catch (error) {

    console.error(
      "HYPE avatar error:",
      error
    );


    return {
      success: false,
      error:
        "Beim Hochladen des Profilbilds ist ein Fehler aufgetreten."
    };

  }

}


window.uploadProfileAvatar =
  uploadProfileAvatar;


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


  if (
    message.includes(
      "redirect"
    ) &&
    message.includes(
      "not allowed"
    )
  ) {

    return "Der Passwort-Reset ist noch nicht korrekt konfiguriert. Bitte prüfe die Redirect-URL in Supabase.";

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


  if (authForm) {

    authForm.reset();

  }


  clearGateProgress();

  isRegisterMode =
    false;

  isResetMode =
    false;


  const resetField =
    document.getElementById(
      "authResetConfirmField"
    );

  resetField?.classList.add(
    "hidden"
  );


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


      if (isResetMode) {

        await updatePassword();

        return;

      }


      if (isRegisterMode) {

        await signUp();

        return;

      }


      /*
       * Falls wir uns auf dem
       * "Passwort vergessen"-Request
       * Bildschirm befinden.
       */
      if (
        authSubmit?.textContent ===
        "Reset-Link senden"
      ) {

        await requestPasswordReset();

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


      /*
       * Passwort-Reset-Modus:
       * zurück zum normalen Login.
       */

      if (isResetMode) {

        enterLoginMode();

        return;

      }


      /*
       * Passwort-Reset-Anfrage:
       * zurück zum normalen Login.
       */

      if (
        !isRegisterMode &&
        authSubmit?.textContent ===
        "Reset-Link senden"
      ) {

        enterLoginMode();

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
     * Supabase löst PASSWORD_RECOVERY aus,
     * wenn der Nutzer über den Reset-Link
     * zurück zu HYPE kommt.
     */

    if (
      event ===
      "PASSWORD_RECOVERY"
    ) {

      enterForgotPasswordMode();

      return;

    }


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

ensureForgotPasswordLink();

ensureResetConfirmField();

loadGateProgress();

updateAuthMode();

updateForgotPasswordLink();

initAuth();