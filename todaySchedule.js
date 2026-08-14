/* ==========================================================
   TODAY'S SCHEDULE
========================================================== */

console.log("todaySchedule.js loaded");


async function loadTodaySchedule(){

    const { data:{ user } } =
        await db.auth.getUser();

    if(!user) return;


    const today =
        new Date().toISOString().split("T")[0];


    const { data, error } = await db

        .from("schedules")

        .select("*")

        .eq("user_id", user.id)

        .eq("date", today)

        .limit(1);


    if(error){

        console.error(error);

        return;

    }


    /* ======================================================
       ELEMENTS
    ====================================================== */

    const badge =
        document.getElementById("todayStatusBadge");


    const iconCard =
        document.querySelector(".today-icon-card");


    const icon =
        iconCard
        ? iconCard.querySelector("i")
        : null;


    const iconText =
        iconCard
        ? iconCard.querySelector("span")
        : null;


    if(!badge || !iconCard){

        console.warn(
            "Today's Schedule elements not found."
        );

        return;

    }


    /* ======================================================
       NO SCHEDULE
    ====================================================== */

    if(!data || data.length === 0){

        badge.textContent =
            window.currentLanguage === "jp"
            ? "予定なし"
            : "NO SCHEDULE";


        badge.style.background =
            "#3A3A3A";


        badge.style.color =
            "#BDBDBD";


        /* Remove old icon classes */

        if(icon){

            icon.className =
                "fas fa-calendar-alt";

        }


        if(iconText){

            iconText.innerHTML =
                window.currentLanguage === "jp"
                ? "予定なし"
                : "NO SCHEDULE";

        }


        setTodayDetails({

            date:"--",

            location:"--",

            building:"--",

            engineer:"--",

            gen_con:"--",

            flooring_type:"--",

            schedule_type:"--",

            time_in:"--:--",

            time_out:"--:--"

        });


        return;

    }


    /* ======================================================
       TODAY DATA
    ====================================================== */

    const item = data[0];

    const status =
        item.status || "Work";


    /* ======================================================
       WORK
    ====================================================== */

    if(status === "Work"){

        badge.textContent =
            window.currentLanguage === "jp"
            ? "作業"
            : "WORK";


        badge.style.background =
            "#173D24";


        badge.style.color =
            "#42D86C";


        if(icon){

            icon.className =
                "fas fa-tools";

        }


        if(iconText){

            iconText.textContent =
                window.currentLanguage === "jp"
                ? "作業"
                : "WORK";

        }

    }


    /* ======================================================
       DAY OFF
    ====================================================== */

    else if(status === "Day Off"){

        badge.textContent =
            window.currentLanguage === "jp"
            ? "休日"
            : "DAY OFF";


        badge.style.background =
            "#4A3606";


        badge.style.color =
            "#F7C948";


        if(icon){

            icon.className =
                "fas fa-house";

        }


        if(iconText){

            iconText.textContent =
                window.currentLanguage === "jp"
                ? "休日"
                : "DAY OFF";

        }

    }


    /* ======================================================
       HOLIDAY
    ====================================================== */

    else if(status === "Holiday"){

        badge.textContent =
            window.currentLanguage === "jp"
            ? "祝日"
            : "HOLIDAY";


        /* Same color as Recent Schedule */

        badge.style.background =
            "#4A1515";


        badge.style.color =
            "#FF5A5A";


        if(icon){

            icon.className =
                "fas fa-gift";

        }


        if(iconText){

            iconText.textContent =
                window.currentLanguage === "jp"
                ? "祝日"
                : "HOLIDAY";

        }

    }


    /* ======================================================
       OTHER
    ====================================================== */

    else{

        badge.textContent =
            status.toUpperCase();


        badge.style.background =
            "#3A3A3A";


        badge.style.color =
            "#FFFFFF";


        if(icon){

            icon.className =
                "fas fa-calendar-alt";

        }


        if(iconText){

            iconText.textContent =
                status.toUpperCase();

        }

    }


    /* ======================================================
       TODAY DETAILS
    ====================================================== */

    setTodayDetails(item);

}


/* ==========================================================
   SET TODAY DETAILS
========================================================== */

function setTodayDetails(item){

    const date =
        document.getElementById("todayDate");

    const location =
        document.getElementById("todayLocation");

    const building =
        document.getElementById("todayBuilding");

    const engineer =
        document.getElementById("todayEngineer");

    const genCon =
        document.getElementById("todayGenCon");

    const flooring =
        document.getElementById("todayFlooring");

    const type =
        document.getElementById("todayType");

    const timeIn =
        document.getElementById("todayTimeIn");

    const timeOut =
        document.getElementById("todayTimeOut");


    if(date)
        date.textContent =
            item.date || "--";


    if(location)
        location.textContent =
            item.location || "--";


    if(building)
        building.textContent =
            item.building || "--";


    if(engineer)
        engineer.textContent =
            item.engineer || "--";


    if(genCon)
        genCon.textContent =
            item.gen_con || "--";


    if(flooring)
        flooring.textContent =
            item.flooring_type || "--";


    if(type)
        type.textContent =
            item.schedule_type || "--";


    if(timeIn)
        timeIn.textContent =
            item.time_in || "--:--";


    if(timeOut)
        timeOut.textContent =
            item.time_out || "--:--";

}


/* ==========================================================
   LOAD
========================================================== */

loadTodaySchedule();