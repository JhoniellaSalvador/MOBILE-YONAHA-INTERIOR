/* ==========================================================
   CHANGE PASSWORD
========================================================== */

console.log("change-password.js loaded");


/* ==========================================================
   OPEN CHANGE PASSWORD PAGE
========================================================== */

function openChangePasswordPage(){

    document
        .querySelectorAll(".page-section")
        .forEach(page => {

            page.style.display = "none";

        });


    const page =
        document.getElementById(
            "changePasswordPage"
        );


    if(page){

        page.style.display = "block";

    }

}

/* ==========================================================
   BACK TO PROFILE
========================================================== */

function goBackFromChangePassword(){

    const changePasswordPage =
        document.getElementById(
            "changePasswordPage"
        );

    const profilePage =
        document.getElementById(
            "profilePage"
        );


    if(changePasswordPage){

        changePasswordPage.style.display =
            "none";

    }


    if(profilePage){

        profilePage.style.display =
            "block";

    }

}

/* ==========================================================
   UPDATE PASSWORD
========================================================== */

const updatePasswordBtn =
    document.getElementById(
        "updatePasswordBtn"
    );


if(updatePasswordBtn){

    updatePasswordBtn.addEventListener(
        "click",
        async () => {

            /* ==================================================
               GET INPUTS
            ================================================== */

            const currentPassword =
                document
                    .getElementById(
                        "currentPassword"
                    )
                    ?.value || "";


            const newPassword =
                document
                    .getElementById(
                        "newPassword"
                    )
                    ?.value || "";


            const confirmNewPassword =
                document
                    .getElementById(
                        "confirmNewPassword"
                    )
                    ?.value || "";


            /* ==================================================
               VALIDATION
            ================================================== */

            if(
                !currentPassword ||
                !newPassword ||
                !confirmNewPassword
            ){

                alert(
                    "Please complete all password fields."
                );

                return;

            }


            if(
                newPassword !==
                confirmNewPassword
            ){

                alert(
                    "New passwords do not match."
                );

                return;

            }


            if(newPassword.length < 6){

                alert(
                    "New password must be at least 6 characters."
                );

                return;

            }


            if(
                currentPassword ===
                newPassword
            ){

                alert(
                    "New password must be different from your current password."
                );

                return;

            }


            /* ==================================================
               CHECK ACTIVE SESSION
            ================================================== */

            const {
                data: sessionData,
                error: sessionError
            } =
                await db.auth.getSession();


            if(sessionError){

                console.error(
                    "PASSWORD SESSION ERROR:",
                    sessionError
                );

                alert(
                    "Your session has expired. Please login again."
                );

                return;

            }


            const session =
                sessionData?.session;


            if(!session){

                alert(
                    "Your session has expired. Please login again."
                );

                return;

            }


            /* ==================================================
               GET CURRENT USER
            ================================================== */

            const user =
                session.user;


            if(!user){

                alert(
                    "User session not found."
                );

                return;

            }


            /* ==================================================
               VERIFY CURRENT PASSWORD
            ================================================== */

            const {
                error: verifyError
            } =
                await db.auth.signInWithPassword({

                    email:
                        user.email,

                    password:
                        currentPassword

                });


            if(verifyError){

                console.error(
                    "CURRENT PASSWORD ERROR:",
                    verifyError
                );

                alert(
                    "Current password is incorrect."
                );

                return;

            }


            /* ==================================================
               UPDATE PASSWORD
            ================================================== */

            updatePasswordBtn.disabled =
                true;

            updatePasswordBtn.textContent =
                "Updating...";


            const {
                error: updateError
            } =
                await db.auth.updateUser({

                    password:
                        newPassword

                });


            updatePasswordBtn.disabled =
                false;

            updatePasswordBtn.textContent =
                "Update Password";


            if(updateError){

                console.error(
                    "UPDATE PASSWORD ERROR:",
                    updateError
                );

                alert(
                    updateError.message
                );

                return;

            }


            /* ==================================================
               SUCCESS
            ================================================== */

            console.log(
                "PASSWORD UPDATE SUCCESS"
            );


            alert(
                "Password updated successfully!"
            );


            /* ==================================================
               CLEAR PASSWORD FIELDS
            ================================================== */

            document
                .getElementById(
                    "currentPassword"
                )
                .value = "";


            document
                .getElementById(
                    "newPassword"
                )
                .value = "";


            document
                .getElementById(
                    "confirmNewPassword"
                )
                .value = "";


            /* ==================================================
               RETURN TO PROFILE
            ================================================== */

            goBackFromChangePassword();

        }
    );

}
