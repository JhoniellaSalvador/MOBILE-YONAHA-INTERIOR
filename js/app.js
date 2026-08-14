/* ==========================================================
   YONAHA INTERIOR
   APP INITIALIZATION
========================================================== */

console.log("app.js loaded");


/* ==========================================================
   APP START
========================================================== */

window.addEventListener("load", async ()=>{

    const authApp =
        document.getElementById("authApp");


    if(authApp){

        authApp.style.display = "block";

    }


    const { data } =
        await db.auth.getSession();


    /* ======================================================
       ACTIVE SESSION
    ====================================================== */

    if(data.session){

        console.log("ACTIVE SESSION FOUND");


        const loginPage =
            document.getElementById("loginPage");


        if(loginPage){

            loginPage.style.display = "none";

        }


        const app =
            document.getElementById("app");


        if(app){

            app.style.display = "block";

        }


    }


    /* ======================================================
       NO SESSION
    ====================================================== */

    else{

        console.log("NO SESSION");


        const loginPage =
            document.getElementById("loginPage");


        if(loginPage){

            loginPage.style.display = "flex";

        }


        const app =
            document.getElementById("app");


        if(app){

            app.style.display = "none";

        }

    }

});
