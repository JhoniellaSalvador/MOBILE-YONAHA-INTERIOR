/* ==========================================================
   LOGIN PAGE
========================================================== */

console.log("login.js loaded");

/* ==========================================================
   PASSWORD TOGGLE
========================================================== */

const loginPassword = document.getElementById("loginPassword");

const togglePassword = document.getElementById("togglePassword");


if(loginPassword && togglePassword){


    togglePassword.addEventListener("click", ()=>{


        if(loginPassword.type === "password"){


            loginPassword.type = "text";


            togglePassword.classList.replace(
                "fa-eye",
                "fa-eye-slash"
            );


        }else{


            loginPassword.type = "password";


            togglePassword.classList.replace(
                "fa-eye-slash",
                "fa-eye"
            );


        }


    });


}



/* ==========================================================
   OPEN REGISTER
========================================================== */

const openRegister = document.getElementById("openRegister");


if(openRegister){


    openRegister.addEventListener("click", ()=>{


        document.getElementById("loginPage").style.display = "none";


        document.getElementById("registerPage").style.display = "flex";


    });


}



/* ==========================================================
   OPEN FORGOT PASSWORD
========================================================== */

const openForgot = document.getElementById("openForgot");


if(openForgot){


    openForgot.addEventListener("click", ()=>{


        document.getElementById("loginPage").style.display = "none";


        document.getElementById("forgotPage").style.display = "flex";


    });


}
