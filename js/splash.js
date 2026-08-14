/* ==========================================================
   SPLASH SCREEN
========================================================== */

console.log("splash.js loaded");

window.addEventListener("load", () => {

    setTimeout(() => {

        const splash = document.getElementById("splashScreen");

        if (splash) {

            splash.style.display = "none";

        }

    }, 1000);

});
