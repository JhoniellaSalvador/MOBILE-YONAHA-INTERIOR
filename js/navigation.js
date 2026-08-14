/* ==========================================================
   NAVIGATION
========================================================== */

console.log("navigation.js loaded");


/* ==========================================================
   ALL MAIN PAGES
========================================================== */

const MAIN_PAGES = [
    "dashboardPage",
    "schedulePage",
    "historyPage",
    "salaryPage",
    "reportsPage",
    "pdfReportsPage",
    "exportMonthlyPage",
    "importDataPage",
    "profilePage",
    "settingsPage",
    "changePasswordPage"
];

/* ==========================================================
   SHOW ONLY ONE PAGE
========================================================== */

async function showPage(page){

    const target =
        document.getElementById(page);


    if(!target){

        console.warn(
            "Navigation page not found:",
            page
        );

        return;

    }


    /* ======================================================
       HIDE EVERY MAIN PAGE FIRST
    ====================================================== */

    MAIN_PAGES.forEach(pageId => {

        const section =
            document.getElementById(pageId);


        if(section){

            section.style.display = "none";

        }

    });


    /* ======================================================
   SHOW SELECTED PAGE ONLY
====================================================== */

target.hidden = false;

target.style.display = "block";


    /* ======================================================
       ACTIVE NAVIGATION
    ====================================================== */

    document
        .querySelectorAll(
            ".nav-btn, .nav-item"
        )
        .forEach(button => {

            button.classList.remove(
                "active"
            );

        });


    const activeButton =
        document.querySelector(
            `.nav-btn[data-page="${page}"],
             .nav-item[data-page="${page}"]`
        );


    if(activeButton){

        activeButton.classList.add(
            "active"
        );

    }


    /* ======================================================
       SAVE ACTIVE PAGE
    ====================================================== */

    if(
        window.allowPageSave !== false &&
        typeof saveActivePage === "function"
    ){

        saveActivePage(page);

    }


    /* ======================================================
       DASHBOARD
    ====================================================== */

    if(
        page === "dashboardPage"
    ){

        if(
            typeof loadDashboardSummary ===
            "function"
        ){

            await loadDashboardSummary();

        }


        if(
            typeof loadTodaySchedule ===
            "function"
        ){

            await loadTodaySchedule();

        }


        if(
            typeof loadRecentSchedule ===
            "function"
        ){

            await loadRecentSchedule();

        }


        if(
            typeof loadMonthlyOverview ===
            "function"
        ){

            await loadMonthlyOverview();

        }

    }

/* ======================================================
   HISTORY
====================================================== */

if(
    page === "historyPage"
){

    if(
    typeof loadHistory ===
    "function"
){

    await loadHistory();

}

}

    /* ======================================================
       SALARY
    ====================================================== */

    if(
        page === "salaryPage"
    ){

        if(
            typeof loadSalary ===
            "function"
        ){

            await loadSalary();

        }

        if(
            typeof renderSalaryLogs ===
            "function"
        ){

            renderSalaryLogs();

        }

        if(
            typeof renderAdvanceHistory ===
            "function"
        ){

            renderAdvanceHistory();

        }

    }

/* ======================================================
   REPORTS
====================================================== */

if(
    page === "reportsPage"
){

    /* ==================================================
       SHOW REPORTS PAGE FIRST
       Do not block navigation while data loads.
    ================================================== */

    if(
        typeof loadReportMonths ===
        "function"
    ){

        loadReportMonths();

    }

    if(
        typeof loadReports ===
        "function"
    ){

        loadReports();

    }

}

    /* ======================================================
       PDF REPORTS
    ====================================================== */

    if(
        page === "pdfReportsPage"
    ){

        if(
            typeof refreshPDFReportsPage ===
            "function"
        ){

            await refreshPDFReportsPage();

        }
        else if(
            typeof initializePDFReports ===
            "function"
        ){

            await initializePDFReports();

        }

    }


    /* ======================================================
       PROFILE
    ====================================================== */

    if(
        page === "profilePage"
    ){

        if(
            typeof loadProfile ===
            "function"
        ){

            await loadProfile();

        }

    }


    /* ======================================================
       SETTINGS
    ====================================================== */

    if(
        page === "settingsPage"
    ){

        if(
            typeof loadSettings ===
            "function"
        ){

            await loadSettings();

        }

    }

}

/* ==========================================================
   NAVIGATION BUTTONS
========================================================== */

document.addEventListener(
    "DOMContentLoaded",
    () => {

        /* ==================================================
           HIDE ALL MAIN PAGES FIRST
           PREVENT ALL PAGES FROM SHOWING ON REFRESH
        ================================================== */

        MAIN_PAGES.forEach(pageId => {

            const page =
                document.getElementById(
                    pageId
                );


            if(!page){

                return;

            }


            page.style.display = "none";
            page.hidden = true;

        });


    /* ==================================================
   DO NOT FORCE DASHBOARD ON STARTUP
   checkSession() will restore the correct page
================================================== */


        /* ==================================================
           SET DASHBOARD ACTIVE
        ================================================== */

        document.querySelectorAll(
            ".nav-btn, .nav-item"
        ).forEach(button => {

            button.classList.remove(
                "active"
            );

        });


        const homeButton =
            document.querySelector(
                `.nav-btn[data-page="dashboardPage"],
                 .nav-item[data-page="dashboardPage"]`
            );


        if(homeButton){

            homeButton.classList.add(
                "active"
            );

        }


        /* ==================================================
           NAVIGATION CLICK EVENTS
        ================================================== */

        document
            .querySelectorAll(
                ".nav-btn, .nav-item"
            )
            .forEach(button => {

                button.addEventListener(
                    "click",
                    async function(event){

                        event.preventDefault();
                        event.stopPropagation();


                        const page =
                            this.dataset.page;


                        if(!page){

                            return;

                        }


                        window.allowPageSave =
                            true;


                        await showPage(
                            page
                        );

                    }
                );

            });

    }
);


/* ==========================================================
   SAVE ACTIVE PAGE
========================================================== */

async function saveActivePage(page){

    if(
        !page ||
        typeof db === "undefined" ||
        !db
    ){

        return;

    }


    try{

        /* ==================================================
           GET CURRENT SESSION
        ================================================== */

        const {
            data
        } =
            await db.auth.getSession();


        const user =
            data?.session?.user;


        if(!user){

            return;

        }


        /* ==================================================
           SAVE PAGE FOR CURRENT USER
           profiles.id = auth.users.id
        ================================================== */

        const {
            error
        } =
            await db
                .from("profiles")
                .update({

                    active_page:
                        page

                })
                .eq(
                    "id",
                    user.id
                );


        if(error){

            console.error(
                "SAVE ACTIVE PAGE ERROR:",
                error
            );

        }

    }
    catch(error){

        console.error(
            "SAVE ACTIVE PAGE EXCEPTION:",
            error
        );

    }

}
