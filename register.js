/* ==========================================================
   REGISTER
========================================================== */

console.log("register.js loaded");

/* ==========================================================
   BACK TO LOGIN
========================================================== */

const goToLogin = document.getElementById("goToLogin");

if(goToLogin){

    goToLogin.addEventListener("click", (e)=>{

        e.preventDefault();

        document.getElementById("registerPage").style.display = "none";

        document.getElementById("loginPage").style.display = "flex";

    });

}

/* ==========================================================
   PASSWORD TOGGLE
========================================================== */

function toggleRegisterPassword(inputId, iconId){

    const input = document.getElementById(inputId);

    const icon = document.getElementById(iconId);

    if(!input || !icon) return;

    icon.addEventListener("click", ()=>{

        if(input.type === "password"){

            input.type = "text";

            icon.classList.replace(
                "fa-eye",
                "fa-eye-slash"
            );

        }else{

            input.type = "password";

            icon.classList.replace(
                "fa-eye-slash",
                "fa-eye"
            );

        }

    });

}

toggleRegisterPassword(
    "registerPassword",
    "toggleRegisterPassword"
);

toggleRegisterPassword(
    "registerConfirmPassword",
    "toggleRegisterConfirmPassword"
);


/* ==========================================================
   CREATE ACCOUNT
========================================================== */

const registerForm =
    document.getElementById("registerForm");


if(registerForm){

    registerForm.addEventListener(
        "submit",
        async (e) => {

            e.preventDefault();


            /* ==================================================
               GET REGISTER FORM VALUES
            ================================================== */

            const fullName =
                document
                    .getElementById("registerFullName")
                    .value
                    .trim();


            const email =
                document
                    .getElementById("registerEmail")
                    .value
                    .trim();


            const username =
                document
                    .getElementById("registerUsername")
                    .value
                    .trim();


            const password =
                document
                    .getElementById("registerPassword")
                    .value;


            const confirmPassword =
                document
                    .getElementById("registerConfirmPassword")
                    .value;


            /* ==================================================
               VALIDATION
            ================================================== */

            if(
                !fullName ||
                !email ||
                !username ||
                !password
            ){

                alert(
                    "Please complete all required fields."
                );

                return;

            }


            if(password !== confirmPassword){

                alert(
                    "Passwords do not match."
                );

                return;

            }


            /* ==================================================
               CREATE AUTH ACCOUNT
            ================================================== */

            const {
                data,
                error
            } =
                await db.auth.signUp({

    email:
        email,

    password:
        password,

    options: {

        data: {

            username:
                username,

            full_name:
                fullName

        }

    }

});

            if(error){

                console.error(
                    "REGISTER AUTH ERROR:",
                    error
                );

                alert(
                    error.message
                );

                return;

            }


            const user =
                data?.user;


            if(!user){

                alert(
                    "Account was created, but the user profile could not be created."
                );

                return;

            }


            /* ==================================================
               SAVE PROFILE DATA
               IMPORTANT:
               user_id MUST MATCH auth.users.id
            ================================================== */

            const {
                error: profileError
            } =
                await db

                    .from("profiles")

                    .insert({

                        user_id:
                            user.id,

                        username:
                            username,

                        email:
                            email,

                        full_name:
                            fullName

                    });


            if(profileError){

                console.error(
                    "REGISTER PROFILE ERROR:",
                    profileError
                );

                alert(
                    profileError.message
                );

                return;

            }


            /* ==================================================
               SUCCESS
            ================================================== */

            console.log(
                "REGISTER SUCCESS:",
                {
                    user_id: user.id,
                    username: username,
                    email: email
                }
            );


            alert(
                "Account created successfully!"
            );


            registerForm.reset();


            document
                .getElementById("registerPage")
                .style.display =
                    "none";


            document
                .getElementById("loginPage")
                .style.display =
                    "flex";

        }
    );

}