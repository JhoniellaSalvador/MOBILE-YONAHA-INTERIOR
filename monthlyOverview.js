/* ==========================================================
   MONTHLY OVERVIEW TIMELINE
========================================================== */

console.log("monthlyOverview.js loaded");


function translateOverviewText(text){

    if(window.currentLanguage !== "jp")
        return text;


    const map = {

        "Work":"作業",
        "Day Off":"休日",
        "Holiday":"祝日"

    };


    return map[text] || text;

}


/* ==========================================================
   LOAD MONTHLY OVERVIEW
========================================================== */

async function loadMonthlyOverview(){

    const container =
        document.getElementById(
            "monthlyOverviewTimeline"
        );


    if(!container) return;


    /* ======================================================
       CLEAR OLD USER DATA IMMEDIATELY
    ====================================================== */

    container.innerHTML = "";


/* ======================================================
   GET CURRENT AUTHENTICATED USER
====================================================== */

const {
    data:{
        session
    }
} =
    await db.auth.getSession();


const user =
    session?.user;


if(!user){

    return;

}


const monthDisplay =
    document.getElementById(
        "overviewMonth"
    );

    /* ======================================================
       CURRENT MONTH
    ====================================================== */

    const now = new Date();


    const monthNumber =
        now.getMonth();


    const month =
        String(monthNumber + 1)
            .padStart(2,"0");


    const year =
        now.getFullYear();


    /* ======================================================
       SHOW CURRENT MONTH
    ====================================================== */

    if(monthDisplay){

        monthDisplay.textContent =
            now.toLocaleDateString(
                window.currentLanguage === "jp"
                    ? "ja-JP"
                    : "en-US",
                {
                    month:"long",
                    year:"numeric"
                }
            );

    }


/* ======================================================
   LOAD SCHEDULES
====================================================== */

const { data,error } =
    await db

    .from("schedules")

    .select("date,status")

    .eq("user_id",user.id);


if(error){

    console.error(
        "MONTHLY OVERVIEW ERROR:",
        error
    );

    return;

}


 /* ======================================================
    PREVENT OLD USER DATA FROM RENDERING
 ====================================================== */

const {
    data:{
        session: currentSession
    }
} =
    await db.auth.getSession();


const currentUser =
    currentSession?.user;


if(
    !currentUser ||
    currentUser.id !== user.id
){

    return;

}

    /* ======================================================
       DAYS IN CURRENT MONTH
    ====================================================== */

    const daysInMonth =
        new Date(
            year,
            monthNumber + 1,
            0
        ).getDate();


    const work = [];
    const dayOff = [];
    const holiday = [];


    /* ======================================================
       GET CURRENT MONTH SCHEDULES
    ====================================================== */

    data.forEach(item=>{

        if(!item.date)
            return;


        if(
            !item.date.startsWith(
                `${year}-${month}`
            )
        ){

            return;

        }


        const day =
            parseInt(
                item.date
                    .split("-")[2],
                10
            );


        const left =
            daysInMonth === 1
            ? 0
            : ((day - 1) /
                (daysInMonth - 1)) * 100;


        if(item.status === "Work"){

            work.push(left);

        }

        else if(item.status === "Day Off"){

            dayOff.push(left);

        }

        else if(item.status === "Holiday"){

            holiday.push(left);

        }

    });


    /* ======================================================
       CREATE TIMELINE ROW
    ====================================================== */

    function createRow(
        title,
        className,
        list
    ){

        let dots = "";


        list.forEach(left=>{

            dots += `

                <span
                    class="timeline-dot ${className}"
                    style="left:${left}%">
                </span>

            `;

        });


        return `

            <div class="timeline-row">

                <div class="timeline-label">

                    ${title}

                </div>


                <div class="timeline-track">

                    <div class="timeline-line"></div>

                    ${dots}

                </div>

            </div>

        `;

    }


    /* ======================================================
       DISPLAY TIMELINE
    ====================================================== */

    container.innerHTML = `

        ${createRow(
            translateOverviewText("Work"),
            "work",
            work
        )}


        ${createRow(
            translateOverviewText("Day Off"),
            "dayoff",
            dayOff
        )}


        ${createRow(
            translateOverviewText("Holiday"),
            "holiday",
            holiday
        )}


        <div class="timeline-days">

            <span></span>

            <span>1</span>

            <span>5</span>

            <span>10</span>

            <span>15</span>

            <span>20</span>

            <span>25</span>

            <span>${daysInMonth}</span>

        </div>

    `;

}


/* ==========================================================
   LOAD
========================================================== */

loadMonthlyOverview();