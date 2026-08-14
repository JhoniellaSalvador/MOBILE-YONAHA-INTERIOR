console.log("EXPORT MONTHLY DATA JS LOADED");


/* ==========================================================
   EXPORT MONTHLY DATA
========================================================== */

/*
This file handles all export functions.

Export categories:

1. Schedule History
2. Salary Work Logs
3. Salary Advance History

All exports are filtered by:

- Logged-in user
- Selected month
- Selected year

Data source:

- Supabase only
- No LocalStorage
*/


/* ==========================================================
   GET LOGGED-IN USER
========================================================== */

async function getExportUser(){

    const {
        data: {
            user
        }
    } = await db.auth.getUser();


    if(!user){

    return null;

}


    return user;

}


/* ==========================================================
   DOWNLOAD EXCEL FILE
========================================================== */

function downloadExportFile(
    data,
    fileName,
    sheetName
){

    if(
        !data ||
        data.length === 0
    ){

        alert(
            "No data found for the selected period."
        );

        return;

    }


    if(
        typeof XLSX === "undefined"
    ){

        alert(
            "Excel export library is not loaded."
        );

        return;

    }


    const worksheet =
        XLSX.utils.json_to_sheet(
            data
        );


    const workbook =
        XLSX.utils.book_new();


    XLSX.utils.book_append_sheet(
        workbook,
        worksheet,
        sheetName || "Export"
    );


    XLSX.writeFile(
        workbook,
        fileName
    );

}


/* ==========================================================
   LOAD SCHEDULE EXPORT YEARS
========================================================== */

async function loadScheduleExportYears(){

    const yearSelect =
    document.getElementById(
        "pageScheduleExportYear"
    );


    if(!yearSelect){

        return;

    }


    const user =
        await getExportUser();


    if(!user){

        return;

    }


    const {
        data,
        error
    } = await db
        .from("schedules")
        .select("date")
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
            "SCHEDULE EXPORT YEAR ERROR:",
            error
        );

        return;

    }


    const years =
        new Set();


    (data || []).forEach(
        schedule => {

            if(!schedule.date){

                return;

            }


            const year =
                String(
                    schedule.date
                ).substring(
                    0,
                    4
                );


            if(year){

                years.add(year);

            }

        }
    );


    yearSelect.innerHTML = "";


    const allYearOption =
        document.createElement(
            "option"
        );


    allYearOption.value =
        "all";


    allYearOption.textContent =
        "All Year";


    yearSelect.appendChild(
        allYearOption
    );


    Array.from(years)
        .sort(
            (a,b) =>
                Number(b) -
                Number(a)
        )
        .forEach(
            year => {

                const option =
                    document.createElement(
                        "option"
                    );


                option.value =
                    year;


                option.textContent =
                    year;


                yearSelect.appendChild(
                    option
                );

            }
        );

}


/* ==========================================================
   LOAD SALARY WORK LOG EXPORT YEARS
========================================================== */

async function loadSalaryExportYears(){

    const yearSelect =
        document.getElementById(
            "salaryExportYear"
        );


    if(!yearSelect){

        return;

    }


    const user =
        await getExportUser();


    if(!user){

        return;

    }


    const {
        data,
        error
    } = await db
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
            "SALARY EXPORT YEAR ERROR:",
            error
        );

        return;

    }


    const years =
        new Set();


    (data || []).forEach(
        log => {

            if(!log.work_date){

                return;

            }


            const year =
                String(
                    log.work_date
                ).substring(
                    0,
                    4
                );


            if(year){

                years.add(year);

            }

        }
    );


    yearSelect.innerHTML = "";


    const allYearOption =
        document.createElement(
            "option"
        );


    allYearOption.value =
        "all";


    allYearOption.textContent =
        "All Year";


    yearSelect.appendChild(
        allYearOption
    );


    Array.from(years)
        .sort(
            (a,b) =>
                Number(b) -
                Number(a)
        )
        .forEach(
            year => {

                const option =
                    document.createElement(
                        "option"
                    );


                option.value =
                    year;


                option.textContent =
                    year;


                yearSelect.appendChild(
                    option
                );

            }
        );

}


/* ==========================================================
   LOAD SALARY ADVANCE EXPORT YEARS
========================================================== */

async function loadAdvanceExportYears(){

    const yearSelect =
    document.getElementById(
        "pageAdvanceExportYear"
    );


    if(!yearSelect){

        return;

    }


    const user =
        await getExportUser();


    if(!user){

        return;

    }


    const {
        data,
        error
    } = await db
        .from("salary_advances")
        .select("advance_date")
        .eq(
            "user_id",
            user.id
        )
        .order(
            "advance_date",
            {
                ascending:false
            }
        );


    if(error){

        console.error(
            "ADVANCE EXPORT YEAR ERROR:",
            error
        );

        return;

    }


    const years =
        new Set();


    (data || []).forEach(
        advance => {

            if(!advance.advance_date){

                return;

            }


            const year =
                String(
                    advance.advance_date
                ).substring(
                    0,
                    4
                );


            if(year){

                years.add(year);

            }

        }
    );


    yearSelect.innerHTML = "";


    const allYearOption =
        document.createElement(
            "option"
        );


    allYearOption.value =
        "all";


    allYearOption.textContent =
        "All Year";


    yearSelect.appendChild(
        allYearOption
    );


    Array.from(years)
        .sort(
            (a,b) =>
                Number(b) -
                Number(a)
        )
        .forEach(
            year => {

                const option =
                    document.createElement(
                        "option"
                    );


                option.value =
                    year;


                option.textContent =
                    year;


                yearSelect.appendChild(
                    option
                );

            }
        );

}


/* ==========================================================
   EXPORT SCHEDULE HISTORY
========================================================== */

async function exportScheduleHistory(){

    const user =
        await getExportUser();


    if(!user){

        return;

    }


    const monthSelect =
    document.getElementById(
        "pageScheduleExportMonth"
    );


    const yearSelect =
    document.getElementById(
        "pageScheduleExportYear"
    );


    const selectedMonth =
        monthSelect
            ? monthSelect.value
            : "all";


    const selectedYear =
        yearSelect
            ? yearSelect.value
            : "all";


    let query =
        db
            .from("schedules")
            .select("*")
            .eq(
                "user_id",
                user.id
            );


    if(
        selectedMonth !== "all" &&
        selectedYear !== "all"
    ){

        const year =
            Number(selectedYear);


        const month =
            Number(selectedMonth);


        const startDate =
            `${year}-${String(month).padStart(2,"0")}-01`;


        const nextMonth =
            month === 12
                ? 1
                : month + 1;


        const nextYear =
            month === 12
                ? year + 1
                : year;


        const endDate =
            `${nextYear}-${String(nextMonth).padStart(2,"0")}-01`;


        query =
            query
                .gte(
                    "date",
                    startDate
                )
                .lt(
                    "date",
                    endDate
                );

    }

    else if(
        selectedMonth === "all" &&
        selectedYear !== "all"
    ){

        const year =
            Number(selectedYear);


        query =
            query
                .gte(
                    "date",
                    `${year}-01-01`
                )
                .lt(
                    "date",
                    `${year + 1}-01-01`
                );

    }

    else if(
        selectedMonth !== "all" &&
        selectedYear === "all"
    ){

        const {
            data,
            error
        } = await query
            .order(
                "date",
                {
                    ascending:false
                }
            );


        if(error){

            console.error(
                "EXPORT SCHEDULE HISTORY ERROR:",
                error
            );


            alert(
                error.message
            );


            return;

        }


        const monthString =
            String(
                Number(selectedMonth)
            ).padStart(
                2,
                "0"
            );


        const filteredData =
            (data || []).filter(
                schedule => {

                    return (
                        schedule.date &&
                        String(
                            schedule.date
                        ).substring(
                            5,
                            7
                        ) ===
                        monthString
                    );

                }
            );


        const monthOption =
            document.querySelector(
                "#pageScheduleExportMonth option:checked"
            );


        const monthName =
            monthOption
                ? monthOption.textContent
                : "Month";


        downloadExportFile(
            filteredData,
            `schedule-history-${monthName}.xlsx`,
            "Schedule History"
        );


        return;

    }


    const {
        data,
        error
    } = await query
        .order(
            "date",
            {
                ascending:false
            }
        );


    if(error){

        console.error(
            "EXPORT SCHEDULE HISTORY ERROR:",
            error
        );


        alert(
            error.message
        );


        return;

    }


    const monthOption =
        document.querySelector(
            "#pageScheduleExportMonth option:checked"
        );


    const monthName =
        monthOption
            ? monthOption.textContent
            : "All-Month";


    let fileName =
        "schedule-history";


    if(
        selectedMonth !== "all"
    ){

        fileName +=
            `-${monthName}`;

    }


    if(
        selectedYear !== "all"
    ){

        fileName +=
            `-${selectedYear}`;

    }


    fileName += ".xlsx";


    downloadExportFile(
        data || [],
        fileName,
        "Schedule History"
    );

}


/* ==========================================================
   EXPORT SALARY WORK LOGS
========================================================== */

async function exportSalaryWorkLogs(){

    const user =
        await getExportUser();


    if(!user){

        return;

    }


    const monthSelect =
    document.getElementById(
        "pageSalaryExportMonth"
    );


    const yearSelect =
    document.getElementById(
        "pageSalaryExportYear"
    );


    const selectedMonth =
        monthSelect
            ? monthSelect.value
            : "all";


    const selectedYear =
        yearSelect
            ? yearSelect.value
            : "all";


    let query =
        db
            .from("work_logs")
            .select("*")
            .eq(
                "user_id",
                user.id
            );


    if(
        selectedMonth !== "all" &&
        selectedYear !== "all"
    ){

        const year =
            Number(selectedYear);


        const month =
            Number(selectedMonth);


        const startDate =
            `${year}-${String(month).padStart(2,"0")}-01`;


        const nextMonth =
            month === 12
                ? 1
                : month + 1;


        const nextYear =
            month === 12
                ? year + 1
                : year;


        const endDate =
            `${nextYear}-${String(nextMonth).padStart(2,"0")}-01`;


        query =
            query
                .gte(
                    "work_date",
                    startDate
                )
                .lt(
                    "work_date",
                    endDate
                );

    }

    else if(
        selectedMonth === "all" &&
        selectedYear !== "all"
    ){

        const year =
            Number(selectedYear);


        query =
            query
                .gte(
                    "work_date",
                    `${year}-01-01`
                )
                .lt(
                    "work_date",
                    `${year + 1}-01-01`
                );

    }

    else if(
        selectedMonth !== "all" &&
        selectedYear === "all"
    ){

        const {
            data,
            error
        } = await query
            .order(
                "work_date",
                {
                    ascending:false
                }
            );


        if(error){

            console.error(
                "EXPORT SALARY WORK LOGS ERROR:",
                error
            );


            alert(
                error.message
            );


            return;

        }


        const monthString =
            String(
                Number(selectedMonth)
            ).padStart(
                2,
                "0"
            );


        const filteredData =
            (data || []).filter(
                log => {

                    return (
                        log.work_date &&
                        String(
                            log.work_date
                        ).substring(
                            5,
                            7
                        ) ===
                        monthString
                    );

                }
            );


        const monthOption =
            document.querySelector(
                "#pageSalaryExportMonth option:checked"
            );


        const monthName =
            monthOption
                ? monthOption.textContent
                : "Month";


        downloadExportFile(
            filteredData,
            `salary-work-logs-${monthName}.xlsx`,
            "Salary Work Logs"
        );


        return;

    }


    const {
        data,
        error
    } = await query
        .order(
            "work_date",
            {
                ascending:false
            }
        );


    if(error){

        console.error(
            "EXPORT SALARY WORK LOGS ERROR:",
            error
        );


        alert(
            error.message
        );


        return;

    }


    const monthOption =
        document.querySelector(
            "#pageSalaryExportMonth option:checked"
        );


    const monthName =
        monthOption
            ? monthOption.textContent
            : "All-Month";


    let fileName =
        "salary-work-logs";


    if(
        selectedMonth !== "all"
    ){

        fileName +=
            `-${monthName}`;

    }


    if(
        selectedYear !== "all"
    ){

        fileName +=
            `-${selectedYear}`;

    }


    fileName += ".xlsx";


    downloadExportFile(
        data || [],
        fileName,
        "Salary Work Logs"
    );

}


/* ==========================================================
   EXPORT SALARY ADVANCE HISTORY
========================================================== */

async function exportSalaryAdvanceHistory(){

    const user =
        await getExportUser();


    if(!user){

        return;

    }


    const monthSelect =
    document.getElementById(
        "pageAdvanceExportMonth"
    );


    const yearSelect =
    document.getElementById(
        "pageAdvanceExportYear"
    );


    const selectedMonth =
        monthSelect
            ? monthSelect.value
            : "all";


    const selectedYear =
        yearSelect
            ? yearSelect.value
            : "all";


    let query =
        db
            .from("salary_advances")
            .select("*")
            .eq(
                "user_id",
                user.id
            );


    if(
        selectedMonth !== "all" &&
        selectedYear !== "all"
    ){

        const year =
            Number(selectedYear);


        const month =
            Number(selectedMonth);


        const startDate =
            `${year}-${String(month).padStart(2,"0")}-01`;


        const nextMonth =
            month === 12
                ? 1
                : month + 1;


        const nextYear =
            month === 12
                ? year + 1
                : year;


        const endDate =
            `${nextYear}-${String(nextMonth).padStart(2,"0")}-01`;


        query =
            query
                .gte(
                    "advance_date",
                    startDate
                )
                .lt(
                    "advance_date",
                    endDate
                );

    }

    else if(
        selectedMonth === "all" &&
        selectedYear !== "all"
    ){

        const year =
            Number(selectedYear);


        query =
            query
                .gte(
                    "advance_date",
                    `${year}-01-01`
                )
                .lt(
                    "advance_date",
                    `${year + 1}-01-01`
                );

    }

    else if(
        selectedMonth !== "all" &&
        selectedYear === "all"
    ){

        const {
            data,
            error
        } = await query
            .order(
                "advance_date",
                {
                    ascending:false
                }
            );


        if(error){

            console.error(
                "EXPORT SALARY ADVANCE HISTORY ERROR:",
                error
            );


            alert(
                error.message
            );


            return;

        }


        const monthString =
            String(
                Number(selectedMonth)
            ).padStart(
                2,
                "0"
            );


        const filteredData =
            (data || []).filter(
                advance => {

                    return (
                        advance.advance_date &&
                        String(
                            advance.advance_date
                        ).substring(
                            5,
                            7
                        ) ===
                        monthString
                    );

                }
            );


        const monthOption =
            document.querySelector(
                "#pageAdvanceExportMonth option:checked"
            );


        const monthName =
            monthOption
                ? monthOption.textContent
                : "Month";


        downloadExportFile(
            filteredData,
            `salary-advance-history-${monthName}.xlsx`,
            "Salary Advance History"
        );


        return;

    }


    const {
        data,
        error
    } = await query
        .order(
            "advance_date",
            {
                ascending:false
            }
        );


    if(error){

        console.error(
            "EXPORT SALARY ADVANCE HISTORY ERROR:",
            error
        );


        alert(
            error.message
        );


        return;

    }


    const monthOption =
        document.querySelector(
            "#pageAdvanceExportMonth option:checked"
        );


    const monthName =
        monthOption
            ? monthOption.textContent
            : "All-Month";


    let fileName =
        "salary-advance-history";


    if(
        selectedMonth !== "all"
    ){

        fileName +=
            `-${monthName}`;

    }


    if(
        selectedYear !== "all"
    ){

        fileName +=
            `-${selectedYear}`;

    }


    fileName += ".xlsx";


    downloadExportFile(
        data || [],
        fileName,
        "Salary Advance History"
    );

}


/* ==========================================================
   EXPORT MONTHLY PAGE SETUP
========================================================== */

function setupExportCard(){

    const exportPage =
        document.getElementById(
            "exportMonthlyPage"
        );


    if(!exportPage){

        console.warn(
            "Export Monthly Data page not found."
        );

        return;

    }


    /*
        Export Monthly Data is now
        a separate page.

        No dropdown or toggle is needed.
    */

    exportPage.style.display =
        "none";

}

/* ==========================================================
   SETUP EXPORT BUTTONS
========================================================== */

function setupExportButtons(){

    /* ==================================================
       SCHEDULE HISTORY
    ================================================== */

    const scheduleButton =
        document.getElementById(
            "pageExportScheduleBtn"
        );


    if(scheduleButton){

        scheduleButton.addEventListener(
            "click",
            function(event){

                event.stopPropagation();

                exportScheduleHistory();

            }
        );

    }


    /* ==================================================
       SALARY WORK LOGS
    ================================================== */

    const salaryButton =
        document.getElementById(
            "pageExportSalaryBtn"
        );


    if(salaryButton){

        salaryButton.addEventListener(
            "click",
            function(event){

                event.stopPropagation();

                exportSalaryWorkLogs();

            }
        );

    }


    /* ==================================================
       SALARY ADVANCE HISTORY
    ================================================== */

    const advanceButton =
        document.getElementById(
            "pageExportAdvanceBtn"
        );


    if(advanceButton){

        advanceButton.addEventListener(
            "click",
            function(event){

                event.stopPropagation();

                exportSalaryAdvanceHistory();

            }
        );

    }

}

/* ==========================================================
   FORCE EXPORT CLOSED
========================================================== */

function forceCloseExportMonthlyData(){

    const exportCard =
        document.getElementById(
            "exportCard"
        );


    const exportOptions =
        document.getElementById(
            "exportMonthlyOptions"
        );


    if(exportCard){

        exportCard.classList.remove(
            "export-open"
        );

    }


    if(exportOptions){

        exportOptions.style.display =
            "none";

    }

}


/* ==========================================================
   INITIALIZE EXPORT
========================================================== */

document.addEventListener(
    "DOMContentLoaded",
    async function(){

        /*
            FIRST:
            Force Export Monthly Data CLOSED.
        */

        forceCloseExportMonthlyData();


        /*
            Setup toggle.
        */

        setupExportCard();


        /*
            Setup export buttons.
        */

        setupExportButtons();


        /*
            Load available years.
        */

        await loadScheduleExportYears();

        await loadSalaryExportYears();

        await loadAdvanceExportYears();


        /*
            FINAL:
            Make absolutely sure Export is
            still CLOSED after async loading.
        */

        forceCloseExportMonthlyData();

    }
);


/* ==========================================================
   END OF EXPORT MONTHLY DATA
========================================================== */
