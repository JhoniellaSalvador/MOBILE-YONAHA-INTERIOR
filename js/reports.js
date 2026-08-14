/* ==========================================================
   REPORTS PAGE
========================================================== */


/* ==========================================================
   REPORT TEXT
========================================================== */

function getReportText(){

    const reportLang =
        window.currentLanguage === "jp";


    return {

        workLog:
            reportLang
                ? "作業記録"
                : "Work Log",

        workLogs:
            reportLang
                ? "作業記録"
                : "Work Logs",

        date:
            reportLang
                ? "日付"
                : "Date",

        description:
            reportLang
                ? "内容"
                : "Description",

        total:
            reportLang
                ? "合計"
                : "Total",

        status:
            reportLang
                ? "状態"
                : "Status",

        salaryTotal:
            reportLang
                ? "給与合計"
                : "Salary Total",

        salaryAdvance:
            reportLang
                ? "前払い"
                : "Salary Advance",

        netSalary:
            reportLang
                ? "純給与"
                : "Net Salary",

        paid:
            reportLang
                ? "支払い済み"
                : "Paid",

        markPaid:
    reportLang
        ? "支払い済みにする"
        : "Mark as Paid",

allMonths:
    reportLang
        ? "すべての月"
        : "All Months"

    };

}


/* ==========================================================
   LOAD REPORTS
========================================================== */

async function loadReports(){

    const reportList =
        document.getElementById("reportList");


    if(!reportList){

        return;

    }


    const reportSearch =
        document.getElementById(
            "reportSearch"
        );


    const reportStatusFilter =
        document.getElementById(
            "reportStatusFilter"
        );


    const reportMonthFilter =
        document.getElementById(
            "reportMonthFilter"
        );


    const keyword =
        reportSearch
            ? reportSearch.value
                .trim()
                .toLowerCase()
            : "";


    const selectedStatus =
        reportStatusFilter
            ? reportStatusFilter.value
            : "";


    const selectedMonth =
        reportMonthFilter
            ? reportMonthFilter.value
            : "";


    const reportText =
        getReportText();


    /* ======================================================
       GET CURRENT USER
    ====================================================== */

    const {
        data: {
            user
        }
    } =
        await db.auth.getUser();


    if(!user){

    return;

}


    /* ======================================================
       GET WORK LOGS
    ====================================================== */

    const {
        data,
        error
    } =
        await db

            .from("work_logs")

            .select("*")

            .eq(
                "user_id",
                user.id
            )

            .order(
                "work_date",
                {
                    ascending:false
                }
            );


    if(error){

        console.error(
            "LOAD REPORTS ERROR:",
            error
        );

        reportList.innerHTML = `

            <div class="reports-empty-state">

                <i class="fa-solid fa-folder-open"></i>

                <span>
                    Unable to load reports.
                </span>

            </div>

        `;

        return;

    }


    /* ======================================================
       GROUP WORK LOGS
    ====================================================== */

    const grouped = {};


    (data || []).forEach(work => {

        const projectName =
            work.project_name || "";


        const genCon =
            work.gen_con || "";


        const groupKey =
            `${projectName}||${genCon}`;


        if(!grouped[groupKey]){

            grouped[groupKey] = [];

        }


        grouped[groupKey].push(work);

    });


    /* ======================================================
       FILTER PROJECTS
    ====================================================== */

    const filteredProjects =

        Object.keys(grouped)

        .filter(groupKey => {

            const works =
                grouped[groupKey];


            const project =
                works[0]?.project_name || "";


            const genCon =
                works[0]?.gen_con || "";


            /* ==============================================
               SEARCH
            ============================================== */

            const searchText =

                `${project} ${genCon}`
                    .toLowerCase();


            if(
                keyword &&
                !searchText.includes(keyword)
            ){

                return false;

            }


            /* ==============================================
               MONTH + STATUS
            ============================================== */

            return works.some(work => {

                const workDate =
                    new Date(
                        work.work_date
                    );


                const monthLabel =
                    workDate.toLocaleString(

                        "en-US",

                        {

                            month:
                                "long",

                            year:
                                "numeric"

                        }

                    );


                const monthOK =

                    !selectedMonth ||
                    monthLabel === selectedMonth;


                const statusOK =

                    !selectedStatus ||
                    work.status === selectedStatus;


                return (
                    monthOK &&
                    statusOK
                );

            });

        });


    /* ======================================================
   NO MATCHING RECORDS
====================================================== */

if(
    filteredProjects.length === 0
){

    reportList.innerHTML = `

        <div class="reports-empty-state">

            <i class="fa-solid fa-folder-open"></i>

            <span>
                ${
                    window.currentLanguage === "jp"
                        ? "該当するレコードが見つかりません"
                        : "No matching records found"
                }
            </span>

        </div>

    `;

    return;

}

    /* ======================================================
       BUILD ALL REPORT HTML
    ====================================================== */

    let output = "";


    for(
        const groupKey
        of filteredProjects
    ){

        const allWorks =
            grouped[groupKey];


        const project =
            allWorks[0]?.project_name || "";


        const genCon =
            allWorks[0]?.gen_con || "";


        /* ==================================================
           APPLY ROW FILTER
        ================================================== */

        const works =

            allWorks.filter(work => {

                const workDate =
                    new Date(
                        work.work_date
                    );


                const monthLabel =
                    workDate.toLocaleString(

                        "en-US",

                        {

                            month:
                                "long",

                            year:
                                "numeric"

                        }

                    );


                const monthOK =

                    !selectedMonth ||
                    monthLabel === selectedMonth;


                const statusOK =

                    !selectedStatus ||
                    work.status === selectedStatus;


                return (
                    monthOK &&
                    statusOK
                );

            });


        if(!works.length){

            continue;

        }


        /* ==================================================
           ENGINEERS
        ================================================== */

        const engineers = [

            ...new Set(

                works.map(
                    work =>
                        work.engineer || ""
                )

            )

        ]

        .filter(Boolean)

        .join(", ");


        /* ==================================================
           WORK TABLE ROWS
        ================================================== */

        let rows = "";


        works.forEach(work => {

            const workDate =
                new Date(
                    work.work_date
                );


            const formattedDate =

                workDate.toLocaleDateString(

                    window.currentLanguage === "jp"
                        ? "ja-JP"
                        : "en-US",

                    {

                        year:
                            "numeric",

                        month:
                            "long",

                        day:
                            "numeric"

                    }

                );


            const amount =
                Number(
                    work.total || 0
                );


            rows += `

                <tr>

                    <td>
                        ${formattedDate}
                    </td>

                    <td>
                        ${work.description || ""}
                    </td>

                    <td>
                        ¥${amount.toLocaleString()}
                    </td>

                    <td>

                        ${
    work.status === "Paid"

    ? `

        <button
            type="button"
            class="report-status-btn"
            onclick="undoPaid('${work.id}')"
        >
            ✓ ${reportText.paid}
        </button>

    `

    : `

        <button
            type="button"
            class="report-status-btn"
            onclick="markWorkPaid('${work.id}')"
        >
            ${reportText.markPaid}
        </button>

    `
}

                    </td>

                </tr>

            `;

        });


        /* ==================================================
           SUBTOTAL
        ================================================== */

        const subtotal =

            works.reduce(

                (
                    sum,
                    work
                ) => {

                    return (
                        sum +
                        Number(
                            work.total || 0
                        )
                    );

                },

                0

            );


        /* ==================================================
           SALARY ADVANCES
        ================================================== */

        const engineersList =

            works.map(
                work =>
                    work.engineer
            );


        let advanceTotal = 0;


        const {
            data: advances,
            error: advanceError
        } =

            await db

                .from("salary_advances")

                .select("amount")

                .eq(
                    "user_id",
                    user.id
                )

                .eq(
                    "project_name",
                    project
                )

                .eq(
                    "gen_con",
                    genCon
                )

                .in(
                    "engineer",
                    engineersList
                );


        if(advanceError){

            console.error(
                "LOAD ADVANCE ERROR:",
                advanceError
            );

        }


        advanceTotal =

            (advances || [])

            .reduce(

                (
                    sum,
                    row
                ) => {

                    return (
                        sum +
                        Number(
                            row.amount || 0
                        )
                    );

                },

                0

            );


        /* ==================================================
           NET SALARY
        ================================================== */

        const netSalary =
            subtotal -
            advanceTotal;


        /* ==================================================
           DATE HEADER
        ================================================== */

        const firstDate =
            new Date(
                works[0].work_date
            );


        const monthText =

            firstDate.toLocaleString(

                window.currentLanguage === "jp"
                    ? "ja-JP"
                    : "en-US",

                {

                    month:
                        "short"

                }

            );


        const dayText =

            window.currentLanguage === "jp"

                ? `${firstDate.getDate()}日`

                : firstDate.getDate();


        const yearText =

            window.currentLanguage === "jp"

                ? `${firstDate.getFullYear()}年`

                : firstDate.getFullYear();


        /* ==================================================
           REPORT CARD
        ================================================== */

        output += `

            <div class="report-summary-card">

                <div class="report-summary-top">


                    <div class="report-date">

                        <div class="month">

                            ${monthText}

                        </div>


                        <div class="day">

                            ${dayText}

                        </div>


                        <div class="year">

                            ${yearText}

                        </div>

                    </div>


                    <div class="report-summary-info">


                        <h3>
                            ${project}
                        </h3>


                        <p>
                            ${genCon}
                        </p>


                        <p>
                            ${engineers}
                        </p>


                        <div class="report-work-count">

                            ${works.length}

                            ${
                                works.length === 1

                                ? reportText.workLog

                                : reportText.workLogs
                            }

                        </div>


                    </div>

                </div>


                <div class="report-summary-details">


                    <table class="report-table">


                        <thead>

                            <tr>

                                <th>
                                    ${reportText.date}
                                </th>

                                <th>
                                    ${reportText.description}
                                </th>

                                <th>
                                    ${reportText.total}
                                </th>

                                <th>
                                    ${reportText.status}
                                </th>

                            </tr>

                        </thead>


                        <tbody>

                            ${rows}

                        </tbody>


                    </table>


                    <div class="report-subtotal">

                        <span>
                            ${reportText.salaryTotal}
                        </span>

                        <span>
                            ¥${subtotal.toLocaleString()}
                        </span>

                    </div>


                    <div class="report-subtotal">

                        <span>
                            ${reportText.salaryAdvance}
                        </span>

                        <span>
                            ¥${advanceTotal.toLocaleString()}
                        </span>

                    </div>


                    <div class="report-subtotal">

                        <strong>
                            ${reportText.netSalary}
                        </strong>

                        <strong>
                            ¥${netSalary.toLocaleString()}
                        </strong>

                    </div>


                </div>

            </div>

        `;

    }


    /* ======================================================
       FINAL RENDER
    ====================================================== */

    reportList.innerHTML =
        output;


}


/* ==========================================================
   LOAD REPORT MONTHS
========================================================== */

async function loadReportMonths(){

    const monthFilter =
        document.getElementById(
            "reportMonthFilter"
        );


    if(!monthFilter){

        return;

    }


    const {
        data: {
            user
        }
    } =
        await db.auth.getUser();


    if(!user){

        return;

    }


    const {
        data,
        error
    } =
        await db

            .from("work_logs")

            .select("work_date")

            .eq(
                "user_id",
                user.id
            )

            .order(
                "work_date",
                {
                    ascending:false
                }
            );


    if(error){

        console.error(
            "LOAD REPORT MONTHS ERROR:",
            error
        );

        return;

    }


    const months = [];


    (data || []).forEach(work => {

        const date =
            new Date(
                work.work_date
            );


        const label =
            date.toLocaleString(

                window.currentLanguage === "jp"
                    ? "ja-JP"
                    : "en-US",

                {

                    month:
                        "long",

                    year:
                        "numeric"

                }

            );


        if(
            !months.includes(label)
        ){

            months.push(label);

        }

    });


    const reportText = getReportText();

monthFilter.innerHTML = `

    <option value="">
        ${reportText.allMonths}
    </option>

`;

months.forEach(month => {

    monthFilter.innerHTML += `

        <option value="${month}">
            ${month}
        </option>

    `;

});

}

/* ==========================================================
   MARK PROJECT AS PAID
========================================================== */

async function markProjectPaid(
    projectName,
    genCon
){

    const confirmPaid =
        confirm(
            `Mark "${projectName}" as Paid?`
        );


    if(!confirmPaid){

        return;

    }


    const {
        data: {
            user
        }
    } =
        await db.auth.getUser();


    if(!user){

        return;

    }


    const {
        error
    } =
        await db

            .from("work_logs")

            .update({

                status:
                    "Paid"

            })

            .eq(
                "user_id",
                user.id
            )

            .eq(
                "project_name",
                projectName
            )

            .eq(
                "gen_con",
                genCon
            );


    if(error){

        console.error(
            "MARK PROJECT PAID ERROR:",
            error
        );

        alert(
            error.message
        );

        return;

    }


    await loadReports();

}


/* ==========================================================
   MARK SINGLE WORK AS PAID
========================================================== */

async function markWorkPaid(id){

    const confirmPaid =
        confirm(
            "Mark this work as Paid?"
        );


    if(!confirmPaid){

        return;

    }


    const {
        error
    } =
        await db

            .from("work_logs")

            .update({

                status:
                    "Paid"

            })

            .eq(
                "id",
                id
            );


    if(error){

        console.error(
            "MARK WORK PAID ERROR:",
            error
        );

        alert(
            error.message
        );

        return;

    }


    await loadReports();

}


/* ==========================================================
   UNDO PAID
========================================================== */

async function undoPaid(id){

    const confirmUndo =
        confirm(
            "Change this work back to Pending?"
        );


    if(!confirmUndo){

        return;

    }


    const {
        error
    } =
        await db

            .from("work_logs")

            .update({

                status:
                    "Pending"

            })

            .eq(
                "id",
                id
            );


    if(error){

        console.error(
            "UNDO PAID ERROR:",
            error
        );

        alert(
            error.message
        );

        return;

    }


    await loadReports();

}


/* ==========================================================
   REPORT FILTER BUTTON
========================================================== */

function initializeReportFilter(){

    const filterBtn =
        document.getElementById(
            "reportFilterBtn"
        );


    const filterPanel =
        document.getElementById(
            "reportFilterPanel"
        );


    if(
        !filterBtn ||
        !filterPanel
    ){

        return;

    }


    /* ==============================================
       REMOVE DUPLICATE HANDLERS
    ============================================== */

    if(
        filterBtn.dataset.initialized === "true"
    ){

        return;

    }


    filterBtn.dataset.initialized =
        "true";


    filterBtn.addEventListener(
        "click",
        function(event){

            event.stopPropagation();

            filterPanel.classList.toggle(
                "show"
            );

        }
    );


    filterPanel.addEventListener(
        "click",
        function(event){

            event.stopPropagation();

        }
    );


    document.addEventListener(
        "click",
        function(){

            filterPanel.classList.remove(
                "show"
            );

        }
    );

}


/* ==========================================================
   INITIALIZE REPORTS
========================================================== */

function initializeReports(){

    const reportSearch =
        document.getElementById(
            "reportSearch"
        );


    const reportStatusFilter =
        document.getElementById(
            "reportStatusFilter"
        );


    const reportMonthFilter =
        document.getElementById(
            "reportMonthFilter"
        );


    /* ======================================================
       SEARCH
    ====================================================== */

    if(
        reportSearch &&
        reportSearch.dataset.initialized !== "true"
    ){

        reportSearch.dataset.initialized =
            "true";


        reportSearch.addEventListener(
            "input",
            function(){

                loadReports();

            }
        );

    }


    /* ======================================================
       STATUS FILTER
    ====================================================== */

    if(
        reportStatusFilter &&
        reportStatusFilter.dataset.initialized !== "true"
    ){

        reportStatusFilter.dataset.initialized =
            "true";


        reportStatusFilter.addEventListener(
            "change",
            function(){

                loadReports();

                const panel =
                    document.getElementById(
                        "reportFilterPanel"
                    );


                if(panel){

                    panel.classList.remove(
                        "show"
                    );

                }

            }
        );

    }


    /* ======================================================
       MONTH FILTER
    ====================================================== */

    if(
        reportMonthFilter &&
        reportMonthFilter.dataset.initialized !== "true"
    ){

        reportMonthFilter.dataset.initialized =
            "true";


        reportMonthFilter.addEventListener(
            "change",
            function(){

                loadReports();

                const panel =
                    document.getElementById(
                        "reportFilterPanel"
                    );


                if(panel){

                    panel.classList.remove(
                        "show"
                    );

                }

            }
        );

    }


    /* ======================================================
       FILTER BUTTON
    ====================================================== */

    initializeReportFilter();

}


/* ==========================================================
   START INITIALIZATION
========================================================== */

if(
    document.readyState === "loading"
){

    document.addEventListener(
        "DOMContentLoaded",
        initializeReports
    );

}
else{

    initializeReports();

}


/* ==========================================================
   REPORT CARD EXPAND
========================================================== */

document.addEventListener(
    "click",
    function(event){

        const card =
            event.target.closest(
                ".report-summary-card"
            );


        if(!card){

            return;

        }


        /* Don't toggle when clicking
           buttons or links inside card */

        if(
            event.target.closest(
                "button, a, input, select"
            )
        ){

            return;

        }


        document
            .querySelectorAll(
                ".report-summary-card"
            )
            .forEach(
                item => {

                    if(item !== card){

                        item.classList.remove(
                            "open"
                        );

                    }

                }
            );


        card.classList.toggle(
            "open"
        );

    }
);

/* ==========================================================
   PRELOAD REPORTS
========================================================== */

setTimeout(() => {

    if(
        typeof loadReports ===
        "function"
    ){

        loadReports();

    }

}, 300);
