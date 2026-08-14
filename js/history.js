/* ==========================================================
   HISTORY PAGE
========================================================== */

console.log("history.js loaded");


/* ==========================================================
   GLOBAL
========================================================== */

const historySearch =
    document.getElementById("historySearch");

const historyMonthFilter =
    document.getElementById("historyMonthFilter");

const historyYearFilter =
    document.getElementById("historyYearFilter");

const historyStatusFilter =
    document.getElementById("historyStatusFilter");

const historyFilterBtn =
    document.getElementById("historyFilterBtn");

const historyFilterPanel =
    document.getElementById("historyFilterPanel");

let editingScheduleId = null;


/* ==========================================================
   HISTORY FILTER LANGUAGE
========================================================== */

function updateHistoryFilterLanguage(){

    const lang =
        window.currentLanguage === "jp"
        ? "jp"
        : "en";


    /* ======================================================
       ALL MONTHS
    ====================================================== */

    const historyMonthAll =
        document.getElementById("historyMonthAll");

    if(historyMonthAll){

        historyMonthAll.textContent =
            lang === "jp"
            ? "すべての月"
            : "All Months";

    }


    /* ======================================================
       ALL YEARS
    ====================================================== */

    const historyYearAll =
        document.getElementById("historyYearAll");

    if(historyYearAll){

        historyYearAll.textContent =
            lang === "jp"
            ? "すべての年"
            : "All Years";

    }


    /* ======================================================
       ALL STATUS
    ====================================================== */

    const historyStatusAll =
        document.getElementById("historyStatusAll");

    if(historyStatusAll){

        historyStatusAll.textContent =
            lang === "jp"
            ? "すべての状態"
            : "All Status";

    }


    /* ======================================================
       MONTH NAMES
    ====================================================== */

    if(historyMonthFilter){

        const monthOptions =
            historyMonthFilter.querySelectorAll(
                "option:not(#historyMonthAll)"
            );

        const englishMonths = [

            "January",
            "February",
            "March",
            "April",
            "May",
            "June",
            "July",
            "August",
            "September",
            "October",
            "November",
            "December"

        ];

        const japaneseMonths = [

            "1月",
            "2月",
            "3月",
            "4月",
            "5月",
            "6月",
            "7月",
            "8月",
            "9月",
            "10月",
            "11月",
            "12月"

        ];


        monthOptions.forEach((option,index)=>{

            option.textContent =
                lang === "jp"
                ? japaneseMonths[index]
                : englishMonths[index];

        });

    }

}


/* ==========================================================
   LOAD HISTORY
========================================================== */

async function loadHistory(){


    /* ======================================================
       GET CURRENT USER
    ====================================================== */

    const {
    data: sessionData
} =
    await db.auth.getSession();


const user =
    sessionData?.session?.user;

    if(!user){

        return;

    }


    /* ======================================================
       LOAD ONLY CURRENT USER SCHEDULES
    ====================================================== */

    const {
        data,
        error
    } =
        await db

        .from("schedules")

        .select("*")

        .eq(
            "user_id",
            user.id
        )

        .order(
            "date",
            {
                ascending:false
            }
        );


    if(error){

        console.error(
            "LOAD HISTORY ERROR:",
            error
        );

        return;

    }


    /* ======================================================
       STORE CURRENT USER DATA
    ====================================================== */

    historyData =
    data || [];

console.log(
    "HISTORY DATA FROM SUPABASE:",
    historyData
);


    /* ======================================================
       UPDATE LANGUAGE / FILTERS
    ====================================================== */

    updateHistoryFilterLanguage();

applyHistoryFilters();

console.log(
    "HISTORY LOADED:",
    historyData.length
);

}


/* ==========================================================
   APPLY FILTERS
========================================================== */

function applyHistoryFilters(){

    let filtered =
        [...historyData];


    const search =
        historySearch
        ? historySearch.value.trim().toLowerCase()
        : "";


    const month =
        historyMonthFilter
        ? historyMonthFilter.value
        : "";


    const year =
        historyYearFilter
        ? historyYearFilter.value
        : "";


    const status =
        historyStatusFilter
        ? historyStatusFilter.value
        : "";


    /* ================= SEARCH ================= */

    if(search !== ""){

        filtered =
            filtered.filter(item=>{

                return(

                    (item.location || "")
                    .toLowerCase()
                    .includes(search)

                    ||

                    (item.building || "")
                    .toLowerCase()
                    .includes(search)

                    ||

                    (item.engineer || "")
                    .toLowerCase()
                    .includes(search)

                    ||

                    (item.gen_con || "")
                    .toLowerCase()
                    .includes(search)

                    ||

                    (item.flooring_type || "")
                    .toLowerCase()
                    .includes(search)

                    ||

                    (item.schedule_type || "")
                    .toLowerCase()
                    .includes(search)

                    ||

                    (item.status || "")
                    .toLowerCase()
                    .includes(search)

                    ||

                    (item.notes || "")
                    .toLowerCase()
                    .includes(search)

                );

            });

    }


    /* ================= MONTH ================= */

    if(month !== ""){

        filtered =
            filtered.filter(item =>

                item.date &&
                item.date.substring(5,7) === month

            );

    }


    /* ================= YEAR ================= */

    if(year !== ""){

        filtered =
            filtered.filter(item =>

                item.date &&
                item.date.substring(0,4) === year

            );

    }


    /* ================= STATUS ================= */

    if(status !== ""){

        filtered =
            filtered.filter(item =>

                item.status === status

            );

    }


    /* ================= DEFAULT SHOW 10 ================= */

    if(

        search === "" &&

        month === "" &&

        year === "" &&

        status === ""

    ){

        filtered =
            filtered.slice(0,10);

    }


    renderHistoryCards(filtered);

}


/* ==========================================================
   RENDER HISTORY CARDS
========================================================== */

function renderHistoryCards(data){

    console.log(
        "Current Language:",
        window.currentLanguage
    );


    const lang =
        window.currentLanguage === "jp"
        ? "jp"
        : "en";


    const t = {

        en:{

            noHistory:
                "No schedule history found.",

            location:
                "Location",

            building:
                "Building",

            engineer:
                "Engineer",

            genCon:
                "General Contractor",

            flooring:
                "Flooring Type",

            scheduleType:
                "Schedule Type",

            status:
                "Status",

            notes:
                "Notes",

            edit:
                "Edit",

            delete:
                "Delete"

        },


        jp:{

            noHistory:
                "スケジュール履歴がありません。",

            location:
                "場所",

            building:
                "建物",

            engineer:
                "担当者",

            genCon:
                "元請会社",

            flooring:
                "床材",

            scheduleType:
                "作業内容",

            status:
                "状態",

            notes:
                "備考",

            edit:
                "編集",

            delete:
                "削除"

        }

    }[lang];


    const container =
        document.getElementById(
            "historyMobileList"
        );


    if(!container) return;


    /* CLOSE ANY OPEN PORTAL MENU */

    closeHistoryMenus();

    container.innerHTML = "";

    /* ======================================================
       EMPTY
    ====================================================== */

    if(!data || data.length === 0){

        container.innerHTML = `

            <div class="history-empty">

                <i class="fas fa-folder-open"></i>

                <p>
                    ${t.noHistory}
                </p>

            </div>

        `;

        return;

    }


    /* ======================================================
       RENDER EACH HISTORY CARD
    ====================================================== */

    data.forEach(schedule => {


        const date =
            new Date(schedule.date);


        const month =
            lang === "jp"

            ?

            `${date.getMonth() + 1}月`

            :

            date
            .toLocaleString(
                "en-US",
                {
                    month:"short"
                }
            )
            .toUpperCase();


        const day =
            String(
                date.getDate()
            )
            .padStart(2,"0");


        const year =
            lang === "jp"

            ?

            `${date.getFullYear()}年`

            :

            date.getFullYear();


        /* ==================================================
           STATUS CLASS
        ================================================== */

        const statusClass =
            (schedule.status || "")
            .toLowerCase()
            .replace(/\s/g,"");


        /* ==================================================
           STATUS TRANSLATION
        ================================================== */

        let statusText =
            schedule.status || "-";


        if(lang === "jp"){

            if(schedule.status === "Work"){

                statusText =
                    "作業";

            }

            else if(
                schedule.status === "Day Off"
            ){

                statusText =
                    "休日";

            }

            else if(
                schedule.status === "Holiday"
            ){

                statusText =
                    "祝日";

            }

        }


        /* ==================================================
           CARD
        ================================================== */

        container.innerHTML += `

        <div class="history-card">


            <!-- ============================================
                 CARD HEADER
            ============================================= -->

            <div
                class="history-card-header"
                onclick="toggleHistoryCard(this)"
            >


                <!-- DATE -->

                <div class="history-date-card">

                    <div class="history-month">

                        ${month}

                    </div>


                    <div class="history-day">

                        ${day}

                    </div>


                    <div class="history-year">

                        ${year}

                    </div>

                </div>


                <!-- SUMMARY -->

                <div class="history-card-left">

                    <div class="history-card-date">

                        ${schedule.location || "-"}

                    </div>


                    <div class="history-card-summary">

                        ${schedule.building || "-"}

                        •

                        ${schedule.engineer || "-"}

                    </div>


                    <div class="history-card-time">

                        🕗

                        ${schedule.time_in || "--:--"}

                        -

                        ${schedule.time_out || "--:--"}

                    </div>

                </div>


                <!-- RIGHT -->

                <div class="history-card-right">


                    <span
                        class="history-status ${statusClass}"
                    >

                        ${statusText}

                    </span>


                    <!-- MENU -->

                    <div class="history-menu">

                        <button
                            type="button"
                            class="history-menu-btn"
                            onclick="toggleHistoryMenu(event, this)"
                        >

                            ⋮

                        </button>


                        <div
                            class="history-menu-dropdown"
                            onclick="event.stopPropagation();"
                        >

                            <button
                                type="button"
                                onclick="editSchedule('${schedule.id}')"
                            >

                                ${t.edit}

                            </button>


                            <button
                                type="button"
                                class="delete-btn"
                                onclick="deleteSchedule('${schedule.id}')"
                            >

                                ${t.delete}

                            </button>

                        </div>

                    </div>

                </div>

            </div>


            <!-- ============================================
                 FULL DETAILS
            ============================================= -->

            <div class="history-card-details">


                <div class="history-detail">

                    <label>
                        ${t.location}
                    </label>

                    <span>
                        ${schedule.location || "-"}
                    </span>

                </div>


                <div class="history-detail">

                    <label>
                        ${t.building}
                    </label>

                    <span>
                        ${schedule.building || "-"}
                    </span>

                </div>


                <div class="history-detail">

                    <label>
                        ${t.engineer}
                    </label>

                    <span>
                        ${schedule.engineer || "-"}
                    </span>

                </div>


                <div class="history-detail">

                    <label>
                        ${t.genCon}
                    </label>

                    <span>
                        ${schedule.gen_con || "-"}
                    </span>

                </div>


                <div class="history-detail">

                    <label>
                        ${t.flooring}
                    </label>

                    <span>
                        ${schedule.flooring_type || "-"}
                    </span>

                </div>


                <div class="history-detail">

                    <label>
                        ${t.scheduleType}
                    </label>

                    <span>
                        ${schedule.schedule_type || "-"}
                    </span>

                </div>


                <div class="history-detail">

                    <label>
                        ${t.status}
                    </label>

                    <span>
                        ${statusText}
                    </span>

                </div>


                <div class="history-detail">

                    <label>
                        ${t.notes}
                    </label>

                    <span>
                        ${schedule.notes || "-"}
                    </span>

                </div>


            </div>

        </div>

        `;

    });

}


/* ==========================================================
   EXPAND ONE HISTORY CARD ONLY
========================================================== */

function toggleHistoryCard(header){

    const currentCard =
        header.closest(".history-card");


    if(!currentCard) return;


    document
        .querySelectorAll(
            ".history-card.active"
        )
        .forEach(card => {

            if(card !== currentCard){

                card.classList.remove(
                    "active"
                );

            }

        });


    currentCard.classList.toggle(
        "active"
    );

}


/* ==========================================================
   EDIT SCHEDULE
========================================================== */

async function editSchedule(id){

    closeHistoryMenus();


    const { data,error } =
        await db

        .from("schedules")

        .select("*")

        .eq("id",id)

        .single();


    if(error){

        console.error(error);

        return;

    }


    window.editingScheduleId =
        id;


    /* ======================================================
       FILL SCHEDULE FORM
    ====================================================== */

    const scheduleDate =
        document.getElementById(
            "scheduleDate"
        );

    if(scheduleDate){

        scheduleDate.value =
            data.date || "";

    }


    const scheduleLocation =
        document.getElementById(
            "scheduleLocation"
        );

    if(scheduleLocation){

        scheduleLocation.value =
            data.location || "";

    }


    const scheduleBuilding =
        document.getElementById(
            "scheduleBuilding"
        );

    if(scheduleBuilding){

        scheduleBuilding.value =
            data.building || "";

    }


    const scheduleEngineer =
        document.getElementById(
            "scheduleEngineer"
        );

    if(scheduleEngineer){

        scheduleEngineer.value =
            data.engineer || "";

    }


    const scheduleGenCon =
        document.getElementById(
            "scheduleGenCon"
        );

    if(scheduleGenCon){

        scheduleGenCon.value =
            data.gen_con || "";

    }


    const scheduleFlooring =
        document.getElementById(
            "scheduleFlooring"
        );

    if(scheduleFlooring){

        scheduleFlooring.value =
            data.flooring_type || "";

    }


    const scheduleType =
        document.getElementById(
            "scheduleType"
        );

    if(scheduleType){

        scheduleType.value =
            data.schedule_type || "";

    }


    const scheduleStatus =
        document.getElementById(
            "scheduleStatus"
        );

    if(scheduleStatus){

        scheduleStatus.value =
            data.status || "";

    }


    const scheduleTimeIn =
        document.getElementById(
            "scheduleTimeIn"
        );

    if(scheduleTimeIn){

        scheduleTimeIn.value =
            data.time_in || "";

    }


    const scheduleTimeOut =
        document.getElementById(
            "scheduleTimeOut"
        );

    if(scheduleTimeOut){

        scheduleTimeOut.value =
            data.time_out || "";

    }


    const scheduleNotes =
        document.getElementById(
            "scheduleNotes"
        );

    if(scheduleNotes){

        scheduleNotes.value =
            data.notes || "";

    }


    /* ======================================================
       GO TO SCHEDULE PAGE
    ====================================================== */

    document
        .querySelectorAll(
            ".page-section"
        )
        .forEach(page=>{

            page.style.display =
                "none";

        });


    const schedulePage =
        document.getElementById(
            "schedulePage"
        );


    if(schedulePage){

        schedulePage.style.display =
            "block";

    }


    document
        .querySelectorAll(".nav-btn")
        .forEach(btn=>{

            btn.classList.remove(
                "active"
            );

        });


    const scheduleNav =
        document.querySelector(
            '[data-page="schedulePage"]'
        );


    if(scheduleNav){

        scheduleNav.classList.add(
            "active"
        );

    }


    localStorage.setItem(
        "activePage",
        "schedulePage"
    );

}


/* ==========================================================
   FILTER PANEL
========================================================== */

if(historyFilterBtn){

    historyFilterBtn.addEventListener(
        "click",
        (event)=>{

            event.stopPropagation();


            if(historyFilterPanel){

                historyFilterPanel.classList.toggle(
                    "show"
                );

            }

        }
    );

}


/* ==========================================================
   SEARCH
========================================================== */

if(historySearch){

    historySearch.addEventListener(
        "input",
        ()=>{

            applyHistoryFilters();

        }
    );

}


/* ==========================================================
   MONTH
========================================================== */

if(historyMonthFilter){

    historyMonthFilter.addEventListener(
        "change",
        ()=>{

            if(historyFilterPanel){

                historyFilterPanel.classList.remove(
                    "show"
                );

            }

            applyHistoryFilters();

        }
    );

}


/* ==========================================================
   YEAR
========================================================== */

if(historyYearFilter){

    historyYearFilter.addEventListener(
        "change",
        ()=>{

            if(historyFilterPanel){

                historyFilterPanel.classList.remove(
                    "show"
                );

            }

            applyHistoryFilters();

        }
    );

}


/* ==========================================================
   STATUS
========================================================== */

if(historyStatusFilter){

    historyStatusFilter.addEventListener(
        "change",
        ()=>{

            if(historyFilterPanel){

                historyFilterPanel.classList.remove(
                    "show"
                );

            }

            applyHistoryFilters();

        }
    );

}


/* ==========================================================
   LOAD YEARS
========================================================== */

async function loadHistoryYears(){

    const { data:{ user } } =
        await db.auth.getUser();


    if(!user) return;


    const { data,error } =
        await db

        .from("schedules")

        .select("date")

        .eq("user_id",user.id);


    if(error){

        console.error(error);

        return;

    }


    const years =

        [
            ...new Set(

                (data || [])
                .filter(item => item.date)
                .map(
                    item =>
                        item.date.substring(0,4)
                )

            )
        ]

        .sort(
            (a,b) => b-a
        );


    const currentValue =
        historyYearFilter
        ? historyYearFilter.value
        : "";


    if(historyYearFilter){

        historyYearFilter.innerHTML = `

            <option
                value=""
                id="historyYearAll"
            >

                ${
                    window.currentLanguage === "jp"
                    ? "すべての年"
                    : "All Years"
                }

            </option>

        `;


        years.forEach(year=>{

            historyYearFilter.innerHTML += `

                <option value="${year}">
                    ${year}
                </option>

            `;

        });


        if(
            years.includes(
                currentValue
            )
        ){

            historyYearFilter.value =
                currentValue;

        }

    }

}

/* ==========================================================
   HISTORY MENU — EDIT / DELETE
========================================================== */

function toggleHistoryMenu(event, button){

    if(event){
        event.preventDefault();
        event.stopPropagation();
    }

    if(!button){
        console.error("History menu button not found.");
        return;
    }


    /* GET DROPDOWN DIRECTLY FROM THIS CARD */

    const menu =
        button.parentElement;

    if(!menu){
        console.error("History menu container not found.");
        return;
    }


    const dropdown =
        menu.querySelector(
            ".history-menu-dropdown"
        );

    if(!dropdown){
        console.error(
            "History menu dropdown not found."
        );
        return;
    }


    /* CLOSE ALL OTHER HISTORY MENUS */

    document
        .querySelectorAll(
            ".history-menu-dropdown"
        )
        .forEach(item => {

            if(item !== dropdown){

                item.classList.remove("show");

                item.style.setProperty(
                    "display",
                    "none",
                    "important"
                );

            }

        });


    /* IF ALREADY OPEN → CLOSE */

    if(
        dropdown.classList.contains("show")
    ){

        dropdown.classList.remove("show");

        dropdown.style.setProperty(
            "display",
            "none",
            "important"
        );

        return;
    }


    /* ======================================================
       GET BUTTON POSITION
    ====================================================== */

    const rect =
        button.getBoundingClientRect();


    /* ======================================================
       FORCE DROPDOWN POSITION
    ====================================================== */

    dropdown.style.setProperty(
        "position",
        "fixed",
        "important"
    );

    dropdown.style.setProperty(
        "display",
        "flex",
        "important"
    );

    dropdown.style.setProperty(
        "flex-direction",
        "row",
        "important"
    );

    dropdown.style.setProperty(
        "width",
        "112px",
        "important"
    );

    dropdown.style.setProperty(
        "min-width",
        "112px",
        "important"
    );

    dropdown.style.setProperty(
        "height",
        "42px",
        "important"
    );

    dropdown.style.setProperty(
        "top",
        `${rect.bottom + 5}px`,
        "important"
    );

    dropdown.style.setProperty(
        "right",
        `${window.innerWidth - rect.right}px`,
        "important"
    );

    dropdown.style.setProperty(
        "left",
        "auto",
        "important"
    );

    dropdown.style.setProperty(
        "bottom",
        "auto",
        "important"
    );

    dropdown.style.setProperty(
        "z-index",
        "999999",
        "important"
    );


    /* SHOW */

    dropdown.classList.add("show");

}

/* ==========================================================
   CLOSE HISTORY MENUS
========================================================== */

function closeHistoryMenus(){

    document
        .querySelectorAll(
            ".history-menu-dropdown.history-menu-portal"
        )
        .forEach(menu => {

            menu.classList.remove(
                "show"
            );


            menu.style.removeProperty(
                "position"
            );

            menu.style.removeProperty(
                "display"
            );

            menu.style.removeProperty(
                "visibility"
            );

            menu.style.removeProperty(
                "opacity"
            );

            menu.style.removeProperty(
                "z-index"
            );

            menu.style.removeProperty(
                "width"
            );

            menu.style.removeProperty(
                "min-width"
            );

            menu.style.removeProperty(
                "height"
            );

            menu.style.removeProperty(
                "top"
            );

            menu.style.removeProperty(
                "right"
            );

            menu.style.removeProperty(
                "left"
            );

            menu.style.removeProperty(
                "margin"
            );


            menu.classList.remove(
                "history-menu-portal"
            );


            /* ==================================================
               RETURN TO ORIGINAL CARD
            ================================================== */

            if(
                menu._historyOriginalParent &&
                menu._historyOriginalParent.isConnected
            ){

                menu._historyOriginalParent.appendChild(
                    menu
                );

            }


            delete menu._historyOriginalParent;

        });

}


/* ==========================================================
   CLOSE MENU WHEN CLICKING OUTSIDE
========================================================== */

document.addEventListener(
    "click",
    (event)=>{

        const clickedHistoryMenu =
            event.target.closest(
                ".history-menu"
            );


        const clickedPortalMenu =
            event.target.closest(
                ".history-menu-dropdown"
            );


        if(
            clickedHistoryMenu ||
            clickedPortalMenu
        ){

            return;

        }


        closeHistoryMenus();

    }
);


/* ==========================================================
   CLOSE MENU ON SCROLL
========================================================== */

window.addEventListener(
    "scroll",
    ()=>{

        closeHistoryMenus();

    },
    true
);


/* ==========================================================
   CLOSE FILTER WHEN CLICKING OUTSIDE
========================================================== */

document.addEventListener(
    "click",
    (event)=>{

        if(
            !historyFilterPanel ||
            !historyFilterBtn
        ){

            return;

        }


        if(
            historyFilterPanel.contains(
                event.target
            ) ||

            historyFilterBtn.contains(
                event.target
            )
        ){

            return;

        }


        historyFilterPanel.classList.remove(
            "show"
        );

    }
);


/* ==========================================================
   DELETE SCHEDULE
========================================================== */

async function deleteSchedule(id){

    closeHistoryMenus();


    const confirmDelete =
        confirm(

            window.currentLanguage === "jp"

            ?

            "このスケジュールを削除しますか？"

            :

            "Delete this schedule?"

        );


    if(!confirmDelete) return;


    const { error } =
        await db

        .from("schedules")

        .delete()

        .eq("id",id);


    if(error){

        console.error(error);

        alert(error.message);

        return;

    }


    await loadHistory();


    if(
        typeof loadDashboardSummary ===
        "function"
    ){

        loadDashboardSummary();

    }


    if(
        typeof loadTodaySchedule ===
        "function"
    ){

        loadTodaySchedule();

    }


    if(
        typeof loadRecentSchedule ===
        "function"
    ){

        loadRecentSchedule();

    }

}


/* ==========================================================
   LANGUAGE CHANGE WATCHER
========================================================== */

window.addEventListener(
    "languageChanged",
    ()=>{

        closeHistoryMenus();

        updateHistoryFilterLanguage();

        renderHistoryCards(
            historyData
        );

    }
);


/* ==========================================================
   INITIALIZE
========================================================== */

updateHistoryFilterLanguage();

loadHistoryYears();
