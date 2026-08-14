/* ==========================================================
   PDF REPORTS
   YONAHA INTERIOR | Flooring Schedule Manager
========================================================== */

console.log("pdf-reports.js loaded");


/* ==========================================================
   MONTH NAMES
========================================================== */

const pdfReportMonthNamesEN = [
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


const pdfReportMonthNamesJP = [
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


/* ==========================================================
   GET MONTH NAME
========================================================== */

function getPDFReportMonthName(month){

    const index =
        Number(month) - 1;


    if(
        !Number.isInteger(index) ||
        index < 0 ||
        index > 11
    ){

        return "";

    }


    return (
    window.currentLanguage === "jp"
        ? pdfReportMonthNamesJP[index]
        : pdfReportMonthNamesEN[index]
) || "";

}


/* ==========================================================
   OPEN PDF REPORTS PAGE
========================================================== */

function openPDFReportsPage(){

    console.log(
        "Opening PDF Reports page..."
    );


    if(typeof showPage === "function"){

        showPage(
            "pdfReportsPage"
        );

    }else{

        console.error(
            "PDF Reports: showPage() is not available."
        );

        return;

    }


    initializePDFReports();

}

/* ==========================================================
   GENERATE MONTHLY PDF
========================================================== */

async function generateMonthlyPDF(month, year){

    console.log(
        "Generating PDF:",
        month,
        year
    );

        const pdfLanguage =
        window.currentLanguage === "jp"
            ? "jp"
            : "en";


    month =
        Number(month);


    year =
        Number(year);


    if(
        !Number.isInteger(month) ||
        month < 1 ||
        month > 12 ||
        !Number.isInteger(year) ||
        year < 2000
    ){

        alert(
            "Invalid PDF report month or year."
        );

        return;

    }


    /* ======================================================
       CHECK SUPABASE
    ====================================================== */

    if(
        typeof db === "undefined" ||
        !db
    ){

        alert(
            "Supabase is not ready."
        );

        return;

    }


    /* ======================================================
       GET LOGGED-IN USER
    ====================================================== */

    let user;

    try{

        if(typeof loadUserCurrency === "function"){

    await loadUserCurrency();

}


    const result =
    await db.auth.getUser();


        if(
            result.error ||
            !result.data ||
            !result.data.user
        ){

            alert(
                "No logged-in user found."
            );

            return;

        }


        user =
            result.data.user;


    }catch(error){

        console.error(
            "PDF user error:",
            error
        );

        alert(
            "Unable to get logged-in user."
        );

        return;

    }


    /* ======================================================
       DATE RANGE
    ====================================================== */

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


    /* ======================================================
       DATA
    ====================================================== */

    let schedules = [];
    let workLogs = [];
    let advances = [];


    /* ======================================================
       1. SCHEDULE HISTORY
    ====================================================== */

    try{

        const result =
            await db
                .from("schedules")
                .select("*")
                .eq(
                    "user_id",
                    user.id
                )
                .gte(
                    "date",
                    startDate
                )
                .lt(
                    "date",
                    endDate
                )
                .order(
                    "date",
                    {
                        ascending:true
                    }
                );


        if(result.error){

    console.error(
        "Schedule PDF error:",
        result.error
    );

    alert(
        "Unable to load Schedule History."
    );

    return;

}


schedules =
    result.data || [];

    }catch(error){

        console.error(
            "Schedule PDF exception:",
            error
        );

    }


    /* ======================================================
       2. SALARY WORK LOGS
    ====================================================== */

    try{

        const result =
            await db
                .from("work_logs")
                .select("*")
                .eq(
                    "user_id",
                    user.id
                )
                .gte(
                    "work_date",
                    startDate
                )
                .lt(
                    "work_date",
                    endDate
                )
                .order(
                    "work_date",
                    {
                        ascending:true
                    }
                );


        if(result.error){

    console.error(
        "Work Logs PDF error:",
        result.error
    );

    alert(
        "Unable to load Salary Work Logs."
    );

    return;

}


workLogs =
    result.data || [];

    }catch(error){

        console.error(
            "Work Logs PDF exception:",
            error
        );

    }


    /* ======================================================
       3. SALARY ADVANCE HISTORY
    ====================================================== */

    try{

        const result =
            await db
                .from("salary_advances")
                .select("*")
                .eq(
                    "user_id",
                    user.id
                )
                .gte(
                    "advance_date",
                    startDate
                )
                .lt(
                    "advance_date",
                    endDate
                )
                .order(
                    "advance_date",
                    {
                        ascending:true
                    }
                );


        if(result.error){

    console.error(
        "Advance PDF error:",
        result.error
    );

    alert(
        "Unable to load Salary Advance History."
    );

    return;

}


advances =
    result.data || [];

    }catch(error){

        console.error(
            "Advance PDF exception:",
            error
        );

    }


    /* ======================================================
       LOG RESULTS
    ====================================================== */

    console.log(
    "PDF data loaded:",
    {
        schedules:
            schedules.length,

        workLogs:
            workLogs.length,

        advances:
            advances.length
    }
);


/* ======================================================
   BUILD PDF DOCUMENT
====================================================== */

const monthName =
    getPDFReportMonthName(month);


const html =
    buildRealPDFDocument(
        monthName,
        month,
        year,
        schedules,
        workLogs,
        advances
    );


/* ======================================================
   OPEN PDF DOCUMENT
====================================================== */

const pdfWindow =
    window.open(
        "",
        "_blank"
    );


if(!pdfWindow){

    alert(
        "Please allow pop-ups to generate the PDF."
    );

    return;

}


pdfWindow.document.open();

pdfWindow.document.write(
    html
);

pdfWindow.document.close();


pdfWindow.onload =
    function(){

        pdfWindow.focus();

        pdfWindow.print();

    };

 }

/* ==========================================================
   BUILD REAL PDF DOCUMENT
========================================================== */

function buildRealPDFDocument(
    monthName,
    month,
    year,
    schedules,
    workLogs,
    advances
){

    const pdfLanguage =
        window.currentLanguage === "jp"
            ? "jp"
            : "en";

    const pdfText = {

    en: {

    noScheduleHistory:
        "No Schedule History records.",

    noWorkLogs:
        "No Salary Work Logs records.",

    noAdvanceHistory:
        "No Salary Advance History records.",

    scheduleHistory:
    "Schedule History",

    workLogs:
    "WORK LOGS",

    workArea:
    "WORK AREA",

    advanceHistory:
    "ADVANCE HISTORY",

    scheduleReport:
    "SCHEDULE REPORT",

    reportDate:
    "Report Date",

    reportNo:
    "Report No.",

    totalSchedules:
    "Total Schedules",

    reportPeriod:
    "Report Period",

    salaryWorkLogs:
    "Salary Work Logs",

    salaryWorkLogsTotal:
    "Salary Work Logs Total",

    salaryAdvanceHistory:
    "Salary Advance History",

    salaryAdvanceTotal:
    "Salary Advance Total",

    monthlyPDFReport:
    "Monthly PDF Report",

    date:
    "Date",

    location:
    "Location",

    building:
    "Building",

    engineer:
    "Engineer",

    genCon:
    "Gen. Con.",

    flooringType:
    "Flooring Type",

    scheduleType:
    "Schedule Type",

    time:
    "Time",

    description:
    "Description",

    qty:
    "Qty",

    rate:
    "Rate",

    total:
    "Total",

    project:
    "Project",

    amount:
    "Amount",

    reason:
    "Reason",

    footer:
    "Flooring Schedule Manager"

},

    jp: {
    noScheduleHistory:
        "スケジュール履歴の記録はありません。",

    noWorkLogs:
        "給与作業記録はありません。",

    noAdvanceHistory:
        "給与前払い履歴の記録はありません。",

    scheduleHistory:
    "スケジュール履歴",

    workLogs:
    "作業記録",

    workArea:
    "作業面積",

    advanceHistory:
    "前払い履歴",

    scheduleReport:
    "スケジュールレポート",

    reportDate:
    "レポート日",

    reportNo:
    "レポート番号",

    totalSchedules:
    "スケジュール合計",

    reportPeriod:
    "レポート期間",

    salaryWorkLogs:
    "給与作業記録",

    salaryWorkLogsTotal:
    "給与作業記録合計",

    salaryAdvanceHistory:
    "給与前払い履歴",

    salaryAdvanceTotal:
    "給与前払い合計",

    monthlyPDFReport:
    "月次PDFレポート",

    date:
    "日付",

    location:
    "場所",

    building:
    "建物",

    engineer:
    "エンジニア",

    genCon:
    "元請業者",

    flooringType:
    "床材タイプ",

    scheduleType:
    "スケジュールタイプ",

    time:
    "時間",

    description:
    "説明",

    qty:
    "数量",

    rate:
    "単価",

    total:
    "合計",

    project:
    "プロジェクト",

    amount:
    "金額",

    reason:
    "理由",

    footer:
    "フローリングスケジュール管理"

}

};        

    const safe = value => {

    if(
        value === null ||
        value === undefined
    ){

        return "";

    }


    return String(value)

        .replace(
            /&/g,
            "&amp;"
        )

        .replace(
            /</g,
            "&lt;"
        )

        .replace(
            />/g,
            "&gt;"
        )

        .replace(
            /"/g,
            "&quot;"
        )

        .replace(
            /'/g,
            "&#039;"
        );

};


    const date = value => {

    if(
        value === null ||
        value === undefined ||
        value === ""
    ){

        return "";

    }


    const raw =
        String(value)
            .substring(0, 10);


    const d =
        new Date(
            raw + "T00:00:00"
        );


    if(
        Number.isNaN(
            d.getTime()
        )
    ){

        return safe(value);

    }


    return d.toLocaleDateString(
    pdfLanguage === "jp"
        ? "ja-JP"
        : "en-US",
    {
        month: "short",
        day: "numeric",
        year: "numeric"
    }
);

};


    const number = value => {

    const n = Number(
        String(value ?? 0)
            .replace(/,/g, "")
    );

    if(Number.isNaN(n)){
        return "0";
    }

    const currency =
        window.currentCurrency ||
        "JPY";

    const symbol =
        typeof getCurrencySymbol === "function"
            ? getCurrencySymbol(currency)
            : currency === "PHP"
                ? "₱"
                : "¥";

    const converted =
        typeof convertCurrency === "function"
            ? convertCurrency(n, currency)
            : n;

    return (
    symbol +
    converted.toLocaleString(
        pdfLanguage === "jp"
            ? "ja-JP"
            : "en-US",
        {
            maximumFractionDigits: 2
        }
    )
);

};

const plainNumber = value => {

    const n = Number(
        String(value ?? 0)
            .replace(/,/g, "")
    );

    if(Number.isNaN(n)){
        return "0";
    }

    return n.toLocaleString(
    pdfLanguage === "jp"
        ? "ja-JP"
        : "en-US",
    {
        maximumFractionDigits: 2
    }
);

};


    /* ======================================================
       TOTALS
    ====================================================== */

    const totalWork =
    workLogs.reduce(
        (sum, row) => {

            const value =
                row.total ??
                row.subtotal ??
                row.amount ??
                0;

            const amount =
                Number(
                    String(value)
                        .replace(/,/g, "")
                        .trim()
                );

            return sum +
                (
                    Number.isFinite(amount)
                        ? amount
                        : 0
                );

        },
        0
    );


    const totalAdvance =
    advances.reduce(
        (sum, row) => {

            const value =
                row.amount ?? 0;

            const amount =
                Number(
                    String(value)
                        .replace(/,/g, "")
                        .trim()
                );

            return sum +
                (
                    Number.isFinite(amount)
                        ? amount
                        : 0
                );

        },
        0
    );


    const totalArea =
    workLogs.reduce(
        (sum, row) => {

            const value =
                row.quantity ?? 0;

            const area =
                Number(
                    String(value)
                        .replace(/,/g, "")
                        .trim()
                );

            return sum +
                (
                    Number.isFinite(area)
                        ? area
                        : 0
                );

        },
        0
    );


    /* ======================================================
       SCHEDULE HISTORY
    ====================================================== */

    const scheduleRows =
        schedules.length

        ? schedules.map(row => `

            <tr>

                <td>${date(row.date)}</td>

                <td>${safe(row.location)}</td>

                <td>${safe(row.building)}</td>

                <td>${safe(row.engineer)}</td>

                <td>
                    ${safe(
                        row.gen_con ??
                        row.genCon ??
                        ""
                    )}
                </td>

                <td>
                    ${safe(
                        row.flooring_type ??
                        row.flooringType ??
                        ""
                    )}
                </td>

                <td>
                    ${safe(
                        row.schedule_type ??
                        row.scheduleType ??
                        row.type ??
                        ""
                    )}
                </td>

                <td>

    ${safe(
        row.time_in ??
        row.timeIn ??
        ""
    )}

    ${
        (
            row.time_out ??
            row.timeOut ??
            ""
        )

        ? " - " +
          safe(
              row.time_out ??
              row.timeOut ??
              ""
          )

        : ""
    }

</td>

            </tr>

        `).join("")

        :

        `
            <tr>

                <td
                    colspan="8"
                    class="empty"
                >
                    ${pdfText[pdfLanguage].noScheduleHistory}
                </td>

            </tr>
        `;


    /* ======================================================
       WORK LOGS
    ====================================================== */

    const workLogRows =
        workLogs.length

        ? workLogs.map(row => `

            <tr>

                <td>
                    ${date(row.work_date)}
                </td>

                <td>
                    ${safe(row.engineer)}
                </td>

                <td>
                    ${safe(
                        row.gen_con ??
                        row.genCon ??
                        ""
                    )}
                </td>

                <td>
                    ${safe(row.location)}
                </td>

                <td>
                    ${safe(
                        row.description ??
                        ""
                    )}
                <td class="number">
    ${plainNumber(row.quantity)}
</td>


<td class="number">
    ${number(row.rate)}
</td>


<td class="number">
    ${number(
        row.total ??
        row.subtotal ??
        row.amount ??
        0
    )}
</td>

            </tr>

        `).join("")

        :

        `
            <tr>

                <td
                    colspan="8"
                    class="empty"
                >
                    ${pdfText[pdfLanguage].noWorkLogs}
                </td>

            </tr>
        `;


    /* ======================================================
       ADVANCE HISTORY
    ====================================================== */

    const advanceRows =
        advances.length

        ? advances.map(row => `

            <tr>

                <td>
                    ${date(row.advance_date)}
                </td>

                <td>
                    ${safe(row.engineer)}
                </td>

                <td>
                    ${safe(
                        row.gen_con ??
                        row.genCon ??
                        ""
                    )}
                </td>

                <td>
                    ${safe(
                        row.project_name ??
                        row.projectName ??
                        ""
                    )}
                </td>

                <td class="number">
                    ${number(
                        row.amount ?? 0
                    )}
                </td>

                <td>
                    ${safe(row.reason)}
                </td>

            </tr>

        `).join("")

        :

        `
            <tr>

                <td
                    colspan="6"
                    class="empty"
                >
                    ${pdfText[pdfLanguage].noAdvanceHistory}
                </td>

            </tr>
        `;


    /* ======================================================
       FINAL PDF DOCUMENT
    ====================================================== */

    return `
<!DOCTYPE html>

<html>

<head>

<meta charset="UTF-8">

<title>
    YONAHA INTERIOR - ${safe(monthName)} ${safe(year)}
</title>

<style>

*{
    box-sizing:border-box;
}

body{
    margin:0;
    padding:25px;
    background:#ffffff;
    color:#111111;
    font-family:Arial, Helvetica, sans-serif;
    font-size:10px;
}

.header{
    text-align:center;
    margin-bottom:20px;
}

.brand{
    font-size:20px;
    font-weight:700;
    letter-spacing:1px;
}

.title{
    margin-top:5px;
    font-size:15px;
    font-weight:600;
}

.period{
    margin-top:4px;
    color:#666666;
    font-size:11px;
}

.summary{
    display:grid;
    grid-template-columns:repeat(4,1fr);
    gap:8px;
    margin-bottom:20px;
    page-break-inside:avoid;
}

.summary-card{
    border:1px solid #cccccc;
    padding:10px;
    text-align:center;
}

.summary-label{
    color:#666666;
    font-size:8px;
    margin-bottom:4px;
}

.summary-value{
    font-size:16px;
    font-weight:700;
}

.section{
    margin-top:20px;
    page-break-inside:avoid;
}

.section-title{
    padding:7px 9px;
    margin-bottom:7px;
    background:#eeeeee;
    font-size:12px;
    font-weight:700;
    page-break-after:avoid;
}

table{
    width:100%;
    border-collapse:collapse;
    page-break-inside:auto;
}

th,
td{
    border:1px solid #cccccc;
    padding:5px;
    text-align:left;
    vertical-align:top;
}

th{
    background:#f3f3f3;
    font-weight:700;
}

.number{
    text-align:right;
}

.empty{
    text-align:center;
    color:#777777;
    padding:12px;
}

.total{
    margin-top:7px;
    text-align:right;
    font-weight:700;
}

.footer{
    margin-top:25px;
    padding-top:8px;
    border-top:1px solid #dddddd;
    color:#777777;
    font-size:8px;
    text-align:center;
    page-break-inside:avoid;
}

.schedule-report{
    margin-bottom:30px;
    page-break-inside:auto;
}

.schedule-report-header{
    display:flex;
    justify-content:space-between;
    align-items:flex-start;
    margin-bottom:15px;
    page-break-inside:avoid;
}

.schedule-brand{
    font-size:20px;
    font-weight:700;
}

.schedule-report-title{
    margin-top:4px;
    font-size:15px;
    font-weight:700;
    page-break-after:avoid;
}

.schedule-report-subtitle{
    margin-top:3px;
    color:#666666;
    font-size:10px;
}

.schedule-report-meta{
    text-align:right;
    font-size:9px;
    color:#444444;
}

.schedule-report-meta > div{
    margin-bottom:6px;
}

.schedule-summary{
    display:flex;
    gap:10px;
    margin-bottom:10px;
    page-break-inside:avoid;
}

.schedule-summary > div{
    border:1px solid #cccccc;
    padding:8px 12px;
    min-width:150px;
}

.schedule-summary span{
    display:block;
    color:#666666;
    font-size:8px;
    margin-bottom:3px;
}

.schedule-summary strong{
    font-size:11px;
}

.schedule-table{
    width:100%;
    page-break-inside:auto;
}

.schedule-report-footer{
    display:flex;
    justify-content:space-between;
    margin-top:8px;
    color:#777777;
    font-size:8px;
    page-break-inside:avoid;
}

@media print{

    @page{
        margin:12mm;
    }


    body{
        padding:0;
    }


    thead{
        display:table-header-group;
    }


    tfoot{
        display:table-footer-group;
    }


    tr{
        page-break-inside:avoid;
        break-inside:avoid;
    }


    .section-title{
        page-break-after:avoid;
        break-after:avoid;
    }


    .schedule-report-header{
        page-break-inside:avoid;
        break-inside:avoid;
    }


    .schedule-summary{
        page-break-inside:avoid;
        break-inside:avoid;
    }


    .schedule-report-footer{
        page-break-inside:avoid;
        break-inside:avoid;
    }


    .footer{
        page-break-inside:avoid;
        break-inside:avoid;
    }

}

</style>

</head>

<body>


<!-- ======================================================
     HEADER
====================================================== -->

<div class="header">

    <div class="brand">
        YONAHA INTERIOR
    </div>

    <div class="title">
        ${pdfText[pdfLanguage].monthlyPDFReport}
    </div>

    <div class="period">
        ${safe(monthName)} ${safe(year)}
    </div>

</div>


<!-- ======================================================
     SUMMARY
====================================================== -->

<div class="summary">

    <div class="summary-card">

        <div class="summary-label">
            ${pdfText[pdfLanguage].scheduleHistory}
        </div>

        <div class="summary-value">
            ${schedules.length}
        </div>

    </div>


    <div class="summary-card">

        <div class="summary-label">
            ${pdfText[pdfLanguage].workLogs}
        </div>

        <div class="summary-value">
            ${workLogs.length}
        </div>

    </div>


    <div class="summary-card">

        <div class="summary-label">
             ${pdfText[pdfLanguage].workArea}
        </div>

        <div class="summary-value">
            ${plainNumber(totalArea)}
        </div>

    </div>


    <div class="summary-card">

        <div class="summary-label">
            ${pdfText[pdfLanguage].advanceHistory}
        </div>

        <div class="summary-value">
            ${advances.length}
        </div>

    </div>

</div>


<!-- ======================================================
     1. SCHEDULE HISTORY
====================================================== -->

<div class="schedule-report">

    <div class="schedule-report-header">

        <div>

            <div class="schedule-brand">
                YONAHA INTERIOR
            </div>

            <div class="schedule-report-title">
                ${pdfText[pdfLanguage].scheduleReport}
            </div>

            <div class="schedule-report-subtitle">
                 ${pdfText[pdfLanguage].scheduleHistory}
            </div>

        </div>


        <div class="schedule-report-meta">

            <div>

                <strong>${pdfText[pdfLanguage].reportDate}</strong>

                <br>

                ${safe(monthName)} ${safe(year)}

            </div>


            <div>

                <strong>${pdfText[pdfLanguage].reportNo}</strong>

                <br>

                SI-${safe(year)}${String(month).padStart(2,"0")}

            </div>

        </div>

    </div>


    <div class="schedule-summary">

        <div>

            <span>
                ${pdfText[pdfLanguage].totalSchedules}
            </span>

            <strong>
                ${schedules.length}
            </strong>

        </div>


        <div>

            <span>
                ${pdfText[pdfLanguage].reportPeriod}
            </span>

            <strong>
                ${safe(monthName)} ${safe(year)}
            </strong>

        </div>

    </div>


    <table class="schedule-table">

        <thead>

            <tr>

                <th>${pdfText[pdfLanguage].date}</th>
                <th>${pdfText[pdfLanguage].location}</th>
                <th>${pdfText[pdfLanguage].building}</th>
                <th>${pdfText[pdfLanguage].engineer}</th>
                <th>${pdfText[pdfLanguage].genCon}</th>
                <th>${pdfText[pdfLanguage].flooringType}</th>
                <th>${pdfText[pdfLanguage].scheduleType}</th>
                <th>${pdfText[pdfLanguage].time}</th>

            </tr>

        </thead>


        <tbody>

            ${scheduleRows}

        </tbody>

    </table>


    <div class="schedule-report-footer">

        <div>
            YONAHA INTERIOR
        </div>

        <div>
            ${pdfText[pdfLanguage].footer}
        </div>

    </div>

</div>


<!-- ======================================================
     2. SALARY WORK LOGS
====================================================== -->

<div class="section">

    <div class="section-title">
        2. ${pdfText[pdfLanguage].salaryWorkLogs}
    </div>


    <table>

        <thead>

            <tr>

                <th>${pdfText[pdfLanguage].date}</th>
                <th>${pdfText[pdfLanguage].engineer}</th>
                <th>${pdfText[pdfLanguage].genCon}</th>
                <th>${pdfText[pdfLanguage].location}</th>
                <th>${pdfText[pdfLanguage].description}</th>
                <th>${pdfText[pdfLanguage].qty}</th>
                <th>${pdfText[pdfLanguage].rate}</th>
                <th>${pdfText[pdfLanguage].total}</th>

            </tr>

        </thead>


        <tbody>

            ${workLogRows}

        </tbody>

    </table>


    <div class="total">

        ${pdfText[pdfLanguage].salaryWorkLogsTotal}:
        ${number(totalWork)}

    </div>

</div>


<!-- ======================================================
     3. SALARY ADVANCE HISTORY
====================================================== -->

<div class="section">

    <div class="section-title">
        3. ${pdfText[pdfLanguage].salaryAdvanceHistory}
    </div>


    <table>

        <thead>

            <tr>

                <th>${pdfText[pdfLanguage].date}</th>
                <th>${pdfText[pdfLanguage].engineer}</th>
                <th>${pdfText[pdfLanguage].genCon}</th>
                <th>${pdfText[pdfLanguage].project}</th>
                <th>${pdfText[pdfLanguage].amount}</th>
                <th>${pdfText[pdfLanguage].reason}</th>

            </tr>

        </thead>


        <tbody>

            ${advanceRows}

        </tbody>

    </table>


    <div class="total">

        ${pdfText[pdfLanguage].salaryAdvanceTotal}:
        ${number(totalAdvance)}

    </div>

</div>


<!-- ======================================================
     FOOTER
====================================================== -->

<div class="footer">

     YONAHA INTERIOR |
    ${pdfText[pdfLanguage].footer}

</div>


</body>

</html>
`;

}

/* ==========================================================
   GLOBAL FUNCTIONS
========================================================== */

window.openPDFReportsPage =
    openPDFReportsPage;

window.initializePDFReports =
    initializePDFReports;

window.getPDFReportMonthName =
    getPDFReportMonthName;

window.renderPDFReportList =
    renderPDFReportList;

window.setupPDFReportControls =
    setupPDFReportControls;

window.generateMonthlyPDF =
    generateMonthlyPDF;    


/* ======================================================
       PDF Report Months
====================================================== */    

async function getAvailablePDFReportMonths(){

    if(
        typeof db === "undefined" ||
        !db
    ){

        console.error(
            "PDF Reports: Supabase is not ready."
        );

        return [];

    }


    let user;


    try{

        const result =
            await db.auth.getUser();


        if(
            result.error ||
            !result.data ||
            !result.data.user
        ){

            console.error(
                "PDF Reports: No logged-in user."
            );

            return [];

        }


        user =
            result.data.user;


    }catch(error){

        console.error(
            "PDF Reports user error:",
            error
        );

        return [];

    }


    const months =
        new Map();


    /* ======================================================
       SCHEDULES
    ====================================================== */

    try{

        const result =
            await db
                .from("schedules")
                .select("date")
                .eq(
                    "user_id",
                    user.id
                );


        if(result.error){

            console.error(
                "PDF schedule months error:",
                result.error
            );

        }else{

            (result.data || [])
                .forEach(row => {

                    if(!row.date){
                        return;
                    }


                    const value =
                        String(row.date)
                            .substring(0, 7);


                    if(
                        /^\d{4}-\d{2}$/.test(value)
                    ){

                        months.set(
                            value,
                            true
                        );

                    }

                });

        }

    }catch(error){

        console.error(
            "PDF schedule months exception:",
            error
        );

    }


    /* ======================================================
       WORK LOGS
    ====================================================== */

    try{

        const result =
            await db
                .from("work_logs")
                .select("work_date")
                .eq(
                    "user_id",
                    user.id
                );


        if(result.error){

            console.error(
                "PDF work log months error:",
                result.error
            );

        }else{

            (result.data || [])
                .forEach(row => {

                    if(!row.work_date){
                        return;
                    }


                    const value =
                        String(row.work_date)
                            .substring(0, 7);


                    if(
                        /^\d{4}-\d{2}$/.test(value)
                    ){

                        months.set(
                            value,
                            true
                        );

                    }

                });

        }

    }catch(error){

        console.error(
            "PDF work log months exception:",
            error
        );

    }


    /* ======================================================
       SALARY ADVANCES
    ====================================================== */

    try{

        const result =
            await db
                .from("salary_advances")
                .select("advance_date")
                .eq(
                    "user_id",
                    user.id
                );


        if(result.error){

            console.error(
                "PDF advance months error:",
                result.error
            );

        }else{

            (result.data || [])
                .forEach(row => {

                    if(!row.advance_date){
                        return;
                    }


                    const value =
                        String(row.advance_date)
                            .substring(0, 7);


                    if(
                        /^\d{4}-\d{2}$/.test(value)
                    ){

                        months.set(
                            value,
                            true
                        );

                    }

                });

        }

    }catch(error){

        console.error(
            "PDF advance months exception:",
            error
        );

    }


    /* ======================================================
       CONVERT TO REPORT MONTHS
    ====================================================== */

    return Array.from(
        months.keys()
    )
    .sort(
        (a, b) =>
            b.localeCompare(a)
    )
    .slice(0, 12)
    .map(value => {

        const parts =
            value.split("-");


        return {

            year:
                Number(parts[0]),

            month:
                Number(parts[1])

        };

    });

}

/* ==========================================================
   SETUP SEARCH & FILTER
========================================================== */

function setupPDFReportControls(){

    const searchInput =
        document.getElementById(
            "pdfReportSearch"
        );


    const monthSelect =
        document.getElementById(
            "pdfReportMonth"
        );


    if(
        searchInput &&
        searchInput.dataset.pdfReady !== "true"
    ){

        searchInput.dataset.pdfReady =
            "true";


        searchInput.addEventListener(
    "input",
    function(){

        renderPDFReportList()
            .catch(error => {

                console.error(
                    "PDF search render error:",
                    error
                );

            });

    }
);

    }


    if(
        monthSelect &&
        monthSelect.dataset.pdfReady !== "true"
    ){

        monthSelect.dataset.pdfReady =
            "true";


        monthSelect.addEventListener(
    "change",
    function(){

        renderPDFReportList()
            .catch(error => {

                console.error(
                    "PDF month filter render error:",
                    error
                );

            });

    }
);

    }

}


/* ==========================================================
   RENDER PDF REPORT LIST
========================================================== */

async function renderPDFReportList(){

    const list =
        document.getElementById(
            "pdfReportsList"
        );


    const empty =
        document.getElementById(
            "pdfReportsEmpty"
        );


    const searchInput =
        document.getElementById(
            "pdfReportSearch"
        );


    const monthSelect =
        document.getElementById(
            "pdfReportMonth"
        );


    if(!list){

        console.error(
            "PDF Reports list was not found."
        );

        return;

    }


    const search =
        searchInput
            ? searchInput.value
                .trim()
                .toLowerCase()
            : "";


    const selectedMonth =
        monthSelect
            ? monthSelect.value
            : "all";


    let reports =
    await getAvailablePDFReportMonths();


    /* ======================================================
       SEARCH
    ====================================================== */

    if(search){

        reports =
            reports.filter(
                report => {

                    const monthName =
                        getPDFReportMonthName(
                            report.month
                        ).toLowerCase();


                    const year =
                        String(
                            report.year
                        );


                    const fullName =
                        `${monthName} ${year}`
                            .toLowerCase();


                    return (
                        monthName.includes(search) ||
                        year.includes(search) ||
                        fullName.includes(search)
                    );

                }
            );

    }


    /* ======================================================
       MONTH FILTER
    ====================================================== */

    if(
        selectedMonth !== "all"
    ){

        reports =
            reports.filter(
                report =>
                    String(
                        report.month
                    ).padStart(2,"0") ===
                    selectedMonth
            );

    }


    /* ======================================================
       ONLY 10 LATEST REPORTS
    ====================================================== */

    reports =
        reports.slice(0,10);


    list.innerHTML = "";


    /* ======================================================
       EMPTY RESULT
    ====================================================== */

    if(!reports.length){

        if(empty){

            empty.style.display =
                "flex";

        }

        return;

    }


    if(empty){

        empty.style.display =
            "none";

    }


    /* ======================================================
       CREATE REPORT ITEMS
    ====================================================== */

    reports.forEach(
        report => {

            const monthName =
                getPDFReportMonthName(
                    report.month
                );


            const item =
                document.createElement(
                    "div"
                );


            item.className =
                "pdf-report-item";


            item.innerHTML = `

                <div class="pdf-report-info">

                    <div class="pdf-report-icon">
                        📄
                    </div>

                    <div class="pdf-report-details">

                        <div class="pdf-report-title">
                            ${monthName} ${report.year}
                        </div>

                        <div class="pdf-report-subtitle">
    ${
        window.currentLanguage === "jp"
            ? "月次PDFレポート"
            : "Monthly PDF Report"
    }
</div>

                    </div>

                </div>


                <button
    type="button"
    class="pdf-report-download"
>
    ${
        window.currentLanguage === "jp"
            ? "PDF"
            : "PDF"
    }
</button>

            `;


            const downloadButton =
    item.querySelector(
        ".pdf-report-download"
    );


downloadButton.addEventListener(
    "click",
    function(){

        generateMonthlyPDF(
            report.month,
            report.year
        );

    }
);


list.appendChild(
    item
);

        }
    );

}


/* ==========================================================
   UPDATE INITIALIZATION
========================================================== */

function initializePDFReports(){

    console.log(
        "Initializing PDF Reports..."
    );


    const page =
        document.getElementById(
            "pdfReportsPage"
        );


    if(!page){

        console.error(
            "PDF Reports page was not found."
        );

        return;

    }


    setupPDFReportControls();

renderPDFReportList()
    .catch(error => {

        console.error(
            "PDF Reports render error:",
            error
        );

    });

console.log(
    "PDF Reports ready."
);

}


/* ==========================================================
   END PDF REPORTS
========================================================== */