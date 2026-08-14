/* ==========================================================
   DASHBOARD DATE & TIME
========================================================== */

console.log("dashboard.js loaded");

function updateDashboardClock(){

    const dateElement =
    document.getElementById("liveDate");

    const timeElement =
    document.getElementById("liveTime");

    if(!dateElement || !timeElement){

        return;

    }

    const now = new Date();

    const date =
now.toLocaleDateString(
    window.currentLanguage === "jp" ? "ja-JP" : "en-US",
{

    weekday:"long",

    year:"numeric",

    month:"long",

    day:"numeric"

});

    const time =
now.toLocaleTimeString(
    window.currentLanguage === "jp" ? "ja-JP" : "en-US",
{

    hour:"2-digit",

    minute:"2-digit",

    second:"2-digit"

});

    dateElement.innerHTML = date;

    timeElement.innerHTML = time;

}

setInterval(updateDashboardClock,1000);

updateDashboardClock();

/* ==========================================================
   DASHBOARD GREETING
   YONAHA INTERIOR
   Uses the username of the currently logged-in user
========================================================== */

async function updateDashboardGreeting(){

    /* ======================================================
       GET GREETING ELEMENT
    ====================================================== */

    const greeting =
        document.getElementById("dashboardGreeting");

    if(!greeting){

        return;

    }


    /* ======================================================
       DETERMINE GREETING BY CURRENT TIME
    ====================================================== */

    const hour =
        new Date().getHours();

    let greetingText;


    if(hour >= 5 && hour < 12){

        greetingText =
            window.currentLanguage === "jp"
                ? "おはようございます"
                : "Good Morning";

    }
    else if(hour >= 12 && hour < 18){

        greetingText =
            window.currentLanguage === "jp"
                ? "こんにちは"
                : "Good Afternoon";

    }
    else{

        greetingText =
            window.currentLanguage === "jp"
                ? "こんばんは"
                : "Good Evening";

    }


    /* ======================================================
   USE PROFILE ALREADY LOADED BY AUTH
   NO EXTRA SUPABASE AUTH REQUEST
====================================================== */

const username =
    window.currentUsername?.trim();


if(!username){

    console.warn(
        "Dashboard Greeting: Username not available."
    );

    return;

}


/* ======================================================
   DISPLAY GREETING
====================================================== */

greeting.textContent =
`${greetingText}, ${username} 👋`;

}


/* ==========================================================
INITIALIZE DASHBOARD GREETING
========================================================== */

window.addEventListener(
    "userAuthenticated",
    () => {

        updateDashboardGreeting();

    }
);

/* ==========================================================
   DASHBOARD SUMMARY
========================================================== */

async function loadDashboardSummary(){

    const {
    data: sessionData
} =
    await db.auth.getSession();


const user =
    sessionData?.session?.user;


if(!user){

    return;

}

    const { data, error } =
    await db
    .from("schedules")
    .select("status")
    .eq("user_id", user.id);

    if(error){

        console.error(error);

        return;

    }

    const total = data.length;

    const work =
    data.filter(item=>item.status==="Work").length;

    const dayOff =
    data.filter(item=>item.status==="Day Off").length;

    const holiday =
    data.filter(item=>item.status==="Holiday").length;

    document.getElementById("totalScheduleCount").textContent = total;
    document.getElementById("workCount").textContent = work;
    document.getElementById("dayOffCount").textContent = dayOff;
    document.getElementById("holidayCount").textContent = holiday;

}

loadDashboardSummary();