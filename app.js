/* =========================================================
   FINAL PROFILE LAYOUT FIXES
   1. Empfehlungsüberschrift immer einzeilig
   2. Profilbild rechts in der Account-Karte
========================================================= */

(function applyFinalProfileLayoutFixes() {

  const styleId =
    "hype-final-profile-layout-fixes";

  if (
    !document.getElementById(styleId)
  ) {
    const style =
      document.createElement("style");

    style.id = styleId;

    style.textContent = `

      /* =====================================================
         1. HYPE WEITEREMPFEHLEN
         IMMER EINE EINZIGE ZEILE
      ===================================================== */

      #profileView .hype-referral-title {
        display: block !important;

        width: 100% !important;
        max-width: 100% !important;

        margin: 0 0 22px 0 !important;
        padding: 0 !important;

        white-space: nowrap !important;
        word-break: keep-all !important;
        overflow-wrap: normal !important;

        overflow: hidden !important;
        text-overflow: clip !important;

        line-height: 1 !important;

        /*
         * Klein genug, damit der komplette Satz
         * auch auf schmalen Smartphones in
         * EINER Zeile bleibt.
         */
        font-size: clamp(
          10px,
          3.35vw,
          30px
        ) !important;

        letter-spacing: -0.045em !important;
      }


      /* =====================================================
         2. ACCOUNT-KARTE
         PROFILBILD RECHTS
      ===================================================== */

      #profileView .hype-account-details {

        position: relative !important;

        display: block !important;

        width: 100% !important;
        box-sizing: border-box !important;

        min-height: 210px !important;

        padding: 26px 155px 26px 26px !important;

        text-align: left !important;
      }


      /* Account-Überschrift */

      #profileView
      .hype-account-details
      .hype-account-label {

        display: block !important;

        margin: 0 0 10px 0 !important;

        text-align: left !important;
      }


      /* Name */

      #profileView
      .hype-account-details
      #profileName {

        display: block !important;

        margin: 0 0 8px 0 !important;

        text-align: left !important;
      }


      /* E-Mail */

      #profileView
      .hype-account-details
      #profileEmail {

        display: block !important;

        margin: 0 !important;

        text-align: left !important;
      }


      /* Profil bearbeiten */

      #profileView
      .hype-account-details
      #editProfileBtn {

        display: inline-flex !important;

        width: auto !important;

        margin: 18px 0 0 0 !important;

        text-align: center !important;
      }


      /* =====================================================
         PROFILBILD RECHTS OBEN
      ===================================================== */

      #profileView
      .hype-account-details
      .hype-profile-avatar-display {

        position: absolute !important;

        top: 26px !important;
        right: 26px !important;

        display: flex !important;

        align-items: center !important;
        justify-content: center !important;

        width: 104px !important;
        height: 104px !important;

        margin: 0 !important;

        flex: none !important;

        border-radius: 50% !important;

        overflow: hidden !important;

        z-index: 2 !important;
      }


      #profileView
      .hype-account-details
      .hype-profile-avatar-display img {

        display: block !important;

        width: 100% !important;
        height: 100% !important;

        object-fit: cover !important;

        border-radius: 50% !important;
      }


      /* =====================================================
         MOBILE
      ===================================================== */

      @media (max-width: 620px) {

        #profileView
        .hype-account-details {

          min-height: 175px !important;

          padding:
            22px 122px 22px 20px !important;
        }


        #profileView
        .hype-account-details
        .hype-profile-avatar-display {

          top: 22px !important;
          right: 20px !important;

          width: 82px !important;
          height: 82px !important;
        }


        #profileView
        .hype-account-details
        #profileName {

          font-size:
            clamp(
              25px,
              7vw,
              34px
            ) !important;
        }


        #profileView
        .hype-account-details
        #editProfileBtn {

          margin-top: 16px !important;
        }


        #profileView
        .hype-referral-title {

          font-size:
            clamp(
              10px,
              3.35vw,
              25px
            ) !important;
        }
      }


      @media (max-width: 390px) {

        #profileView
        .hype-account-details {

          padding:
            20px 108px 20px 17px !important;
        }


        #profileView
        .hype-account-details
        .hype-profile-avatar-display {

          top: 20px !important;
          right: 17px !important;

          width: 74px !important;
          height: 74px !important;
        }


        #profileView
        .hype-referral-title {

          font-size: 10px !important;
          letter-spacing: -0.05em !important;
        }
      }

    `;

    document.head.appendChild(
      style
    );
  }


  /* =====================================================
     PROFILBILD SICHER IN ACCOUNT-KARTE EINSETZEN
  ===================================================== */

  function repositionProfileAvatar() {

    const profileView =
      document.getElementById(
        "profileView"
      );

    if (!profileView) {
      return;
    }

    const accountDetails =
      profileView.querySelector(
        ".hype-account-details"
      );

    if (!accountDetails) {
      return;
    }

    let avatar =
      accountDetails.querySelector(
        ".hype-profile-avatar-display"
      );

    /*
     * Falls das Profilbild noch nicht existiert,
     * erstellen wir den Platzhalter.
     */
    if (!avatar) {

      avatar =
        document.createElement(
          "div"
        );

      avatar.className =
        "hype-profile-avatar-display";

      avatar.innerHTML =
        "👤";

      accountDetails.insertBefore(
        avatar,
        accountDetails.firstChild
      );
    }

    /*
     * Das Profilbild ganz nach vorne setzen.
     * Die CSS-Regeln positionieren es anschließend
     * rechts oben.
     */
    if (
      avatar.parentElement ===
      accountDetails
    ) {
      accountDetails.insertBefore(
        avatar,
        accountDetails.firstChild
      );
    }


    /*
     * Gespeichertes Profilbild erneut laden.
     */
    if (
      typeof getProfileUser ===
      "function" &&
      typeof getSavedProfileImage ===
      "function"
    ) {

      getProfileUser()
        .then(
          user => {

            if (!user) {
              return;
            }

            const image =
              getSavedProfileImage(
                user.id
              );

            if (
              image
            ) {

              avatar.innerHTML = `
                <img
                  src="${esc(image)}"
                  alt="Profilbild"
                >
              `;

            } else {

              avatar.innerHTML =
                "👤";
            }
          }
        )
        .catch(
          error => {
            console.error(
              "HYPE profile avatar error:",
              error
            );
          }
        );
    }
  }


  /*
   * Beim Laden ausführen.
   */
  repositionProfileAvatar();


  /*
   * Falls renderProfile() später die
   * Account-Karte neu aufbaut:
   * nach dem Rendern erneut anwenden.
   */
  setTimeout(
    repositionProfileAvatar,
    100
  );

  setTimeout(
    repositionProfileAvatar,
    500
  );

})();