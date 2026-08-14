/* ==========================================================
   RECENT SCHEDULE
========================================================== */

console.log("recentSchedule.js loaded");


/* ==========================================================
   LOAD RECENT SCHEDULE
========================================================== */

async function loadRecentSchedule(){

    const lang =
        window.currentLanguage === "jp"
        ? "jp"
        : "en";


    /* ======================================================
       TRANSLATIONS
    ====================================================== */

    const t = {

        en:{
            noLocation:"No Location",
            noBuilding:"No Building",
            engineer:"Engineer",
            genCon:"General Contractor",
            flooring:"Flooring Type",
            scheduleType:"Schedule Type",
            status:"Status",
            notes:"Notes"
        },

        jp:{
            noLocation:"場所なし",
            noBuilding:"建物なし",
            engineer:"担当者",
            genCon:"元請会社",
            flooring:"床材",
            scheduleType:"作業内容",
            status:"状態",
            notes:"備考"
        }

    }[lang];


    /* ======================================================
       TRANSLATE VALUES
    ====================================================== */

    function translateValue(value){

        if(window.currentLanguage !== "jp")
            return value;


        const map = {

            "Work":"作業",
            "Day Off":"休日",
            "Holiday":"祝日",

            "Installation":"施工",
            "Repair":"修理",
            "Inspection":"点検",
            "Measurement":"採寸",
            "Maintenance":"メンテナンス",
            "Meeting":"会議",
            "Site Visit":"現場確認",
            "Other":"その他"

        };


        return map[value] || value;

    }


    /* ======================================================
       CONTAINER
    ====================================================== */

    const container =
        document.getElementById("recentScheduleContent");


    if(!container)
        return;


   /* ======================================================
GET CURRENT SESSION
DO NOT CALL getUser() AFTER LOGOUT
====================================================== */

const {
    data: sessionData
} =
    await db.auth.getSession();


const user =
    sessionData?.session?.user;


if(!user){

    container.innerHTML =
        window.currentLanguage === "jp"
        ?
        "<p>最近の予定はありません。</p>"
        :
        "<p>No recent schedule.</p>";

    return;

}


    /* ======================================================
       LOAD RECENT SCHEDULES
    ====================================================== */

    const { data,error } = await db

        .from("schedules")

        .select("*")

        .eq("user_id",user.id)

        .order("date",{ascending:false})

        .limit(5);


    /* ======================================================
       ERROR
    ====================================================== */

    if(error){

        console.error(
            "RECENT SCHEDULE ERROR:",
            error
        );


        container.innerHTML =
            window.currentLanguage === "jp"
            ?
            "<p>最近の予定はありません。</p>"
            :
            "<p>No recent schedule.</p>";

        return;

    }


    /* ======================================================
       EMPTY
    ====================================================== */

    if(!data || data.length === 0){

        container.innerHTML =
            window.currentLanguage === "jp"
            ?
            "<p>最近の予定はありません。</p>"
            :
            "<p>No recent schedule.</p>";

        return;

    }


    /* ======================================================
       CLEAR CONTAINER
    ====================================================== */

    container.innerHTML = "";


    /* ======================================================
       RENDER RECENT CARDS
    ====================================================== */

    data.forEach(item => {

        const d =
            new Date(item.date);


        const isJapanese =
            window.currentLanguage === "jp";


        /* ==================================================
           DATE
        ================================================== */

        const day =
            isJapanese
            ?
            String(d.getDate()).padStart(2,"0") + "日"
            :
            String(d.getDate()).padStart(2,"0");


        const month =
            isJapanese
            ?
            `${d.getMonth()+1}月`
            :
            d.toLocaleString(
                "en-US",
                {
                    month:"short"
                }
            ).toUpperCase();


        const year =
            isJapanese
            ?
            `${d.getFullYear()}年`
            :
            d.getFullYear();


        /* ==================================================
           STATUS COLORS
        ================================================== */

        let badgeBackground = "#333";
        let badgeText = "#FFFFFF";


        switch(item.status){

            case "Work":

                badgeBackground = "#173D24";
                badgeText = "#42D86C";

                break;


            case "Day Off":

                badgeBackground = "#4A3606";
                badgeText = "#F7C948";

                break;


            case "Holiday":

                badgeBackground = "#4A1515";
                badgeText = "#FF5A5A";

                break;

        }


        /* ==================================================
           CARD
        ================================================== */

        container.innerHTML += `

            <div class="recent-card">

                <!-- ================= DATE ================= -->

                <div class="recent-date">

                    <div class="recent-month">

                        ${month}

                    </div>


                    <div class="recent-day">

                        ${day}

                    </div>


                    <div class="recent-year">

                        ${year}

                    </div>

                </div>


                <!-- ================= INFO ================= -->

                <div class="recent-info">

                    <h4>

                        ${
                            item.location
                            ?
                            item.location
                            :
                            (
                                window.currentLanguage === "jp"
                                ?
                                "場所なし"
                                :
                                "No Location"
                            )
                        }

                    </h4>


                    <p>

                        ${
                            item.building
                            ?
                            item.building
                            :
                            (
                                window.currentLanguage === "jp"
                                ?
                                "建物なし"
                                :
                                "No Building"
                            )
                        }

                    </p>


                    <p>

                        ${item.time_in || "--:--"}

                        -

                        ${item.time_out || "--:--"}

                    </p>

                </div>


                <!-- ================= STATUS ================= -->

                <span

                    class="recent-status"

                    style="
                        background:${badgeBackground};
                        color:${badgeText};
                    "

                >

                    ${translateValue(item.status)}

                </span>

            </div>

        `;

    });

}


/* ==========================================================
   VIEW ALL HISTORY
========================================================== */

document.addEventListener(
    "click",
    async function(e){

        const viewAll =
            e.target.closest("#viewAllHistory");


        /* ================================================
           NOT VIEW ALL
        ================================================ */

        if(!viewAll)
            return;


        e.preventDefault();


        console.log(
            "VIEW ALL HISTORY CLICKED"
        );


        /* ================================================
           SAVE ACTIVE PAGE
        ================================================ */

        window.allowPageSave = true;


        if(
            typeof saveActivePage === "function"
        ){

            await saveActivePage(
                "historyPage"
            );

        }


        /* ================================================
           SHOW HISTORY PAGE
        ================================================ */

        if(
            typeof showPage === "function"
        ){

            showPage(
                "historyPage"
            );

        }
        else{

            console.error(
                "showPage function not found"
            );

        }

    }
);


/* ==========================================================
   LOAD
========================================================== */

loadRecentSchedule();