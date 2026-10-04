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

window.supabaseClient = supabaseClient;

/* =========================
   DOM
========================= */

const authScreen = document.getElementById("authScreen");
const appContent = document.getElementById("appContent");
const authForm = document.getElementById("authForm");
const authEmail = document.getElementById("authEmail");
const authPassword = document.getElementById("authPassword");
const authSubmit = document.getElementById("authSubmit");
const authSwitch = document.getElementById("authSwitch");
const authMessage = document.getElementById("authMessage");
const authSubtitle = document.getElementById("authSubtitle");

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
  window.location.origin + window.location.pathname;

const PASSWORD_RESET_REDIRECT =
  window.location.origin + window.location.pathname;

const AVATAR_BUCKET = "avatars";
const MAX_AVATAR_SIZE = 5 * 1024 * 1024;

const GATE_INSTAGRAM_KEY =
  "hype_registration_instagram";

const GATE_SHARE_KEY =
  "hype_registration_share";

/* =========================
   HELPERS
========================= */

function getRegistrationGate() {
  return document.getElementById("registrationGate");
}

function getFirstNameField() {
  return document.getElementById("authFirstNameField");
}

function getFirstNameInput() {
  return document.getElementById("authFirstName");
}

function showAuthMessage(message, type = "") {
  if (!authMessage) return;

  authMessage.textContent = message;
  authMessage.className = "auth-message";

  if (type) {
    authMessage.classList.add(type);
  }
}

function clearAuthMessage() {
  showAuthMessage("");
}

function saveGateProgress() {
  try {
    sessionStorage.setItem(
      GATE_INSTAGRAM_KEY,
      instagramCompleted ? "true" : "false"
    );

    sessionStorage.setItem(
      GATE_SHARE_KEY,
      shareCompleted ? "true" : "false"
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
  instagramCompleted = false;
  shareCompleted = false;

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
   FIRST NAME
========================= */

function ensureFirstNameField() {
  let field = getFirstNameField();
  let input = getFirstNameInput();

  if (field && input) {
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

  field = document.createElement("label");

  field.id =
    "authFirstNameField";

  field.className =
    "auth-first-name-field hidden";

  const labelText =
    document.createElement("span");

  labelText.textContent =
    "Vorname";

  input =
    document.createElement("input");

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
    authForm.prepend(field);
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

  const visible =
    isRegisterMode &&
    instagramCompleted &&
    shareCompleted;

  field.classList.toggle(
    "hidden",
    !visible
  );

  input.required =
    visible;
}

function getFirstName() {
  return (
    getFirstNameInput()
      ?.value
      .trim() || ""
  );
}

/* =========================
   PASSWORD RESET UI
========================= */

function ensureForgotPasswordLink() {
  if (
    !authForm ||
    !authPassword
  ) {
    return null;
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
      enterResetRequestMode();
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

/* =========================
   RESET-LINK ANFORDERN
========================= */

function enterResetRequestMode() {
  isRegisterMode = false;
  isResetMode = false;

  clearAuthMessage();

  if (authSubtitle) {
    authSubtitle.innerHTML = `
      Passwort vergessen?<br>
      Gib deine E-Mail ein.<br>
      Wir schicken dir einen Reset-Link.
    `;
  }

  if (authEmail) {
    authEmail.value = "";
    authEmail.required = true;
  }

  if (authPassword) {
    authPassword.value = "";
    authPassword.required = false;
    authPassword.placeholder = "";
  }

  ensureResetConfirmField()
    ?.classList.add("hidden");

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
      <span style="display:block;color:#f5f6f7;font-size:13px;font-weight:800;margin-bottom:4px;">
        Wieder eingefallen?
      </span>
      <span style="display:block;color:#d7ff3f;font-size:13px;font-weight:900;">
        → Zurück zum Login
      </span>
    `;
  }

  getRegistrationGate()
    ?.remove();

  updateFirstNameField();
  updateForgotPasswordLink();

  setTimeout(
    () => authEmail?.focus(),
    50
  );
}

/* =========================
   NEUES PASSWORT
========================= */

function enterForgotPasswordMode() {
  isRegisterMode = false;
  isResetMode = true;

  clearAuthMessage();

  const resetField =
    ensureResetConfirmField();

  resetField
    ?.classList.remove(
      "hidden"
    );

  if (authEmail) {
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
      <span style="display:block;color:#f5f6f7;font-size:13px;font-weight:800;margin-bottom:4px;">
        Doch nicht?
      </span>
      <span style="display:block;color:#d7ff3f;font-size:13px;font-weight:900;">
        → Zurück zum Login
      </span>
    `;
  }

  getRegistrationGate()
    ?.remove();

  updateFirstNameField();
  updateForgotPasswordLink();

  setTimeout(
    () => authPassword?.focus(),
    50
  );
}

/* =========================
   LOGIN MODE
========================= */

function enterLoginMode() {
  isRegisterMode = false;
  isResetMode = false;

  clearAuthMessage();

  ensureResetConfirmField()
    ?.classList.add("hidden");

  if (authEmail) {
    authEmail.value = "";
    authEmail.required = true;
  }

  if (authPassword) {
    authPassword.value = "";
    authPassword.placeholder = "";
    authPassword.autocomplete =
      "current-password";
    authPassword.required = true;
  }

  updateAuthMode();
  updateForgotPasswordLink();
}

/* =========================
   RESET MAIL
========================= */

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

/* =========================
   PASSWORT ÄNDERN
========================= */

async function updatePassword() {
  const password =
    authPassword?.value || "";

  const confirm =
    getResetConfirmInput()
      ?.value || "";

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

    authPassword?.focus();

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
    data,
    error
  } =
    await supabaseClient.auth.updateUser(
      {
        password
      }
    );

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

  console.log(
    "HYPE password updated:",
    data?.user?.id
  );

  showAuthMessage(
    "Passwort erfolgreich geändert. Du kannst dich jetzt einloggen.",
    "success"
  );

  setTimeout(
    () => {
      enterLoginMode();
    },
    700
  );
}

/* =========================
   REGISTRATION GATE
========================= */

function ensureRegistrationGate() {
  let gate =
    getRegistrationGate();

  if (gate) {
    return gate;
  }

  if (!authForm) {
    return null;
  }

  gate =
    document.createElement(
      "div"
    );

  gate.id =
    "registrationGate";

  gate.style.cssText = `
    display:flex;
    flex-direction:column;
    gap:10px;
    margin:14px 0 16px;
  `;

  gate.innerHTML = `
    <div
      id="instagramGate"
      style="
        display:flex;
        align-items:center;
        justify-content:space-between;
        gap:12px;
        padding:12px;
        border:1px solid rgba(255,255,255,.08);
        border-radius:14px;
        background:#12151a;
      "
    >
      <div style="min-width:0;">
        <strong style="display:block;color:#f5f6f7;font-size:13px;">
          Instagram folgen
        </strong>
        <span style="display:block;margin-top:3px;color:#8d949e;font-size:11px;">
          Folge HYPE auf Instagram.
        </span>
      </div>
      <button
        type="button"
        id="instagramGateBtn"
        style="
          flex:0 0 auto;
          border:1px solid #d7ff3f;
          border-radius:10px;
          padding:9px 11px;
          background:#d7ff3f;
          color:#0b0d10;
          font-size:11px;
          font-weight:900;
          cursor:pointer;
        "
      >
        Öffnen
      </button>
    </div>

    <div
      id="shareGate"
      style="
        display:flex;
        align-items:center;
        justify-content:space-between;
        gap:12px;
        padding:12px;
        border:1px solid rgba(255,255,255,.08);
        border-radius:14px;
        background:#12151a;
      "
    >
      <div style="min-width:0;">
        <strong style="display:block;color:#f5f6f7;font-size:13px;">
          HYPE teilen
        </strong>
        <span style="display:block;margin-top:3px;color:#8d949e;font-size:11px;">
          Teile HYPE mit jemandem.
        </span>
      </div>
      <button
        type="button"
        id="shareGateBtn"
        style="
          flex:0 0 auto;
          border:1px solid #d7ff3f;
          border-radius:10px;
          padding:9px 11px;
          background:#d7ff3f;
          color:#0b0d10;
          font-size:11px;
          font-weight:900;
          cursor:pointer;
        "
      >