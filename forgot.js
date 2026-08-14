/* ==========================================================
   FORGOT PASSWORD
========================================================== */

console.log("forgot.js loaded");


/* ==========================================================
   BACK TO LOGIN
========================================================== */

const backToLogin = document.getElementById("backToLogin");


if(backToLogin){

    backToLogin.addEventListener("click", (e)=>{

        e.preventDefault();


        document.getElementById("forgotPage").style.display = "none";

        document.getElementById("loginPage").style.display = "flex";


    });

}


/* ==========================================================
   SEND RESET EMAIL
========================================================== */

const forgotForm = document.getElementById("forgotForm");


if(forgotForm){


    forgotForm.addEventListener("submit", async (e)=>{


        e.preventDefault();


        const email =
            document.getElementById("forgotEmail").value.trim();



        if(!email){

            alert("Please enter your email.");

            return;

        }



        const { error } =
            await db.auth.resetPasswordForEmail(email);



        if(error){

            alert(error.message);

            return;

        }



        alert("Password reset link sent to your email.");


        forgotForm.reset();



    });


}