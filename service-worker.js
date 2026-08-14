/* ==========================================================
   YONAHA INTERIOR - PWA SERVICE WORKER
========================================================== */

if ("serviceWorker" in navigator) {

    window.addEventListener("load", async () => {

        try {

            const registration =
                await navigator.serviceWorker.register(
                    "./service-worker.js",
                    {
                        scope: "./"
                    }
                );

            console.log(
                "YONAHA INTERIOR PWA ready.",
                registration.scope
            );

        } catch (error) {

            console.error(
                "YONAHA INTERIOR PWA service worker error:",
                error
            );

        }

    });

}