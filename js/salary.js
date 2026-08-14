/* ==========================================================
   SALARY
   YONAHA INTERIOR
   ========================================================== */

console.log("salary.js loaded");

/* ==========================================================
   FORMAT SALARY CURRENCY
   Uses currency.js
========================================================== */

function formatSalaryCurrency(amount){

    if(
        typeof window.formatCurrency ===
        "function"
    ){

        return window.formatCurrency(
            amount,
            window.currentCurrency || "JPY"
        );

    }


    const numericAmount =
        Number(amount) || 0;


    return (
        "¥" +
        numericAmount.toLocaleString(
            "en-US",
            {
                minimumFractionDigits: 0,
                maximumFractionDigits: 2
            }
        )
    );

}

/* ==========================================================
   GLOBAL EDIT IDS
   ========================================================== */

let editingWorkId = null;
let editingAdvanceId = null;


/* ==========================================================
   SALARY INITIALIZATION FLAG
   ========================================================== */

let salaryPageInitialized = false;


/* ==========================================================
   PAGE LOAD
   ========================================================== */

document.addEventListener("DOMContentLoaded", () => {

    initializeSalaryPage();

});


/* ==========================================================
   INITIALIZE SALARY PAGE
   ========================================================== */

function initializeSalaryPage(){

    /*
       IMPORTANT:
       Salary JS should ONLY initialize when Salary elements
       actually exist on the current page.
    */

    const salaryPage =
        document.getElementById("salaryPage");

    const salaryForm =
        document.getElementById("salaryFormSection");

    const salaryLogs =
        document.getElementById("salaryLogsSection");

    const salaryAdvance =
        document.getElementById("salaryAdvanceSection");

    const salaryAdvanceHistory =
        document.getElementById(
            "salaryAdvanceHistorySection"
        );


    if(
        !salaryPage &&
        !salaryForm &&
        !salaryLogs &&
        !salaryAdvance &&
        !salaryAdvanceHistory
    ){

        console.log(
            "Salary page not found. Salary JS skipped."
        );

        return;

    }


    if(salaryPageInitialized){

        return;

    }


    salaryPageInitialized = true;


    console.log(
        "Salary page initialized."
    );


    setupSalaryCalculation();

    setupSalaryWorkEvents();

    setupSalaryAdvanceEvents();

    setupSalaryTabs();

    setupSalaryOutsideClick();

    loadWorkLogs();

}


/* ==========================================================
   SALARY CALCULATION EVENTS
   ========================================================== */

function setupSalaryCalculation(){

    const quantity =
        document.getElementById(
            "salaryQuantity"
        );

    const rate =
        document.getElementById(
            "salaryRate"
        );


    if(quantity){

        quantity.addEventListener(
            "input",
            computeSalary
        );

    }


    if(rate){

        rate.addEventListener(
            "input",
            computeSalary
        );

    }

}


/* ==========================================================
   WORK EVENTS
   ========================================================== */

function setupSalaryWorkEvents(){

    const saveButton =
        document.getElementById(
            "saveSalaryBtn"
        );


    if(saveButton){

        saveButton.addEventListener(
            "click",
            saveWork
        );

    }


    const search =
        document.getElementById(
            "salarySearch"
        );


    if(search){

        search.addEventListener(
            "input",
            loadWorkLogs
        );

    }


    const statusFilter =
        document.getElementById(
            "salaryStatusFilter"
        );


    if(statusFilter){

        statusFilter.addEventListener(
            "change",
            () => {

                const panel =
                    document.getElementById(
                        "salaryFilterPanel"
                    );


                if(panel){

                    panel.classList.remove(
                        "show"
                    );

                }


                loadWorkLogs();

            }
        );

    }


    const filterButton =
        document.getElementById(
            "salaryFilterBtn"
        );


    if(filterButton){

        filterButton.addEventListener(
            "click",
            (event) => {

                event.stopPropagation();

                const panel =
                    document.getElementById(
                        "salaryFilterPanel"
                    );


                if(panel){

                    panel.classList.toggle(
                        "show"
                    );

                }

            }
        );

    }

}


/* ==========================================================
   ADVANCE EVENTS
   ========================================================== */

function setupSalaryAdvanceEvents(){

    const genCon =
        document.getElementById(
            "advanceGenCon"
        );


    if(genCon){

        genCon.addEventListener(
            "change",
            (event) => {

                loadAdvanceProjects(
                    event.target.value
                );

            }
        );

    }


    const project =
        document.getElementById(
            "advanceProject"
        );


    if(project){

        project.addEventListener(
            "change",
            () => {

                const genConValue =
                    document.getElementById(
                        "advanceGenCon"
                    )?.value || "";


                const projectValue =
                    document.getElementById(
                        "advanceProject"
                    )?.value || "";


                loadAdvanceEngineers(
                    genConValue,
                    projectValue
                );

            }
        );

    }


    const saveButton =
        document.getElementById(
            "saveAdvanceBtn"
        );


    if(saveButton){

        saveButton.addEventListener(
            "click",
            saveAdvance
        );

    }


    const search =
        document.getElementById(
            "advanceSearch"
        );


    if(search){

        search.addEventListener(
            "input",
            filterAdvanceHistory
        );

    }


    const month =
        document.getElementById(
            "advanceMonthFilter"
        );


    if(month){

        month.addEventListener(
            "change",
            () => {

                filterAdvanceHistory();

                closeAdvanceFilter();

            }
        );

    }


    const year =
        document.getElementById(
            "advanceYearFilter"
        );


    if(year){

        year.addEventListener(
            "change",
            () => {

                filterAdvanceHistory();

                closeAdvanceFilter();

            }
        );

    }


    const filterButton =
        document.getElementById(
            "advanceFilterBtn"
        );


    if(filterButton){

        filterButton.addEventListener(
            "click",
            (event) => {

                event.stopPropagation();

                toggleAdvanceFilter();

            }
        );

    }

}

/* ==========================================================
   SALARY TABS
   ========================================================== */

function setupSalaryTabs(){

    const formTab =
        document.getElementById(
            "salaryFormTab"
        );

    const logsTab =
        document.getElementById(
            "salaryLogsTab"
        );

    const advanceTab =
        document.getElementById(
            "salaryAdvanceTab"
        );

    const advanceHistoryTab =
        document.getElementById(
            "salaryAdvanceHistoryTab"
        );


    if(formTab){

        formTab.addEventListener(
            "click",
            () => {

                showSalarySection(
                    "form"
                );

            }
        );

    }


    if(logsTab){

        logsTab.addEventListener(
            "click",
            () => {

                showSalarySection(
                    "logs"
                );

            }
        );

    }


    if(advanceTab){

        advanceTab.addEventListener(
            "click",
            async () => {

                showSalarySection(
                    "advance"
                );

                await loadAdvanceGenCon();

            }
        );

    }


    if(advanceHistoryTab){

        advanceHistoryTab.addEventListener(
            "click",
            async () => {

                showSalarySection(
                    "advanceHistory"
                );

                await loadAdvanceHistory();

            }
        );

    }

}


/* ==========================================================
   SHOW SALARY SECTION
   ========================================================== */

function showSalarySection(section){

    const formTab =
        document.getElementById(
            "salaryFormTab"
        );

    const logsTab =
        document.getElementById(
            "salaryLogsTab"
        );

    const advanceTab =
        document.getElementById(
            "salaryAdvanceTab"
        );

    const advanceHistoryTab =
        document.getElementById(
            "salaryAdvanceHistoryTab"
        );


    const formSection =
        document.getElementById(
            "salaryFormSection"
        );

    const logsSection =
        document.getElementById(
            "salaryLogsSection"
        );

    const advanceSection =
        document.getElementById(
            "salaryAdvanceSection"
        );

    const advanceHistorySection =
        document.getElementById(
            "salaryAdvanceHistorySection"
        );


    /* ------------------------------------------------------
       REMOVE ALL ACTIVE STATES
       ------------------------------------------------------ */

    [
        formTab,
        logsTab,
        advanceTab,
        advanceHistoryTab
    ]
    .forEach(tab => {

        if(tab){

            tab.classList.remove(
                "active"
            );

        }

    });


    /* ------------------------------------------------------
       HIDE ALL SALARY SECTIONS
       ------------------------------------------------------ */

    [
        formSection,
        logsSection,
        advanceSection,
        advanceHistorySection
    ]
    .forEach(sectionElement => {

        if(sectionElement){

            sectionElement.style.display =
                "none";

        }

    });


    /* ------------------------------------------------------
       SHOW SELECTED SECTION
       ------------------------------------------------------ */

    if(section === "form"){

        if(formTab)
            formTab.classList.add("active");

        if(formSection)
            formSection.style.display = "block";

    }


    if(section === "logs"){

        if(logsTab)
            logsTab.classList.add("active");

        if(logsSection)
            logsSection.style.display = "block";

        loadWorkLogs();

    }


    if(section === "advance"){

        if(advanceTab)
            advanceTab.classList.add("active");

        if(advanceSection)
            advanceSection.style.display = "block";

    }


    if(section === "advanceHistory"){

        if(advanceHistoryTab)
            advanceHistoryTab.classList.add("active");

        if(advanceHistorySection)
            advanceHistorySection.style.display =
                "block";

    }

}


/* ==========================================================
   OUTSIDE CLICK
   SALARY ONLY
   ========================================================== */

function setupSalaryOutsideClick(){

    document.addEventListener(
        "click",
        (event) => {

            /* Salary work filter */

            const workPanel =
                document.getElementById(
                    "salaryFilterPanel"
                );

            const workButton =
                document.getElementById(
                    "salaryFilterBtn"
                );


            if(
                workPanel &&
                !workPanel.contains(event.target) &&
                !workButton?.contains(event.target)
            ){

                workPanel.classList.remove(
                    "show"
                );

            }


            /* Salary advance filter */

            const advancePanel =
                document.getElementById(
                    "advanceFilterPanel"
                );

            const advanceButton =
                document.getElementById(
                    "advanceFilterBtn"
                );


            if(
                advancePanel &&
                !advancePanel.contains(event.target) &&
                !advanceButton?.contains(event.target)
            ){

                advancePanel.classList.remove(
                    "show"
                );

            }


            /* Salary menus */

            if(
                !event.target.closest(
                    ".salary-menu"
                )
            ){

                document
                    .querySelectorAll(
                        ".salary-menu.active"
                    )
                    .forEach(menu => {

                        menu.classList.remove(
                            "active"
                        );

                    });

            }

        }
    );

}

 /* ==========================================================
    AUTO COMPUTE SALARY
    Currency Aware
    ========================================================== */

function computeSalary(){

    const quantityInput =
        document.getElementById(
            "salaryQuantity"
        );

    const rateInput =
        document.getElementById(
            "salaryRate"
        );


    if(
        !quantityInput ||
        !rateInput
    ){

        return;

    }


    const quantity =
        Number(
            quantityInput.value
        ) || 0;


    const rate =
        Number(
            rateInput.value
        ) || 0;


    /*
       Rate entered in the selected currency.

       Convert it back to JPY first because
       all Salary amounts stored in Supabase
       remain JPY.
    */

    let rateJPY =
        rate;


    if(
        window.currentCurrency === "PHP"
    ){

        const phpRate =
            Number(
                window.currencyRates?.PHP ||
                0
            );


        if(phpRate > 0){

            rateJPY =
                rate / phpRate;

        }

    }


    const subtotalJPY =
        quantity * rateJPY;


    const taxJPY =
        subtotalJPY * 0.10;


    const totalJPY =
        subtotalJPY + taxJPY;


    const subtotalElement =
        document.getElementById(
            "salarySubtotal"
        );

    const taxElement =
        document.getElementById(
            "salaryTax"
        );

    const totalElement =
        document.getElementById(
            "salaryTotal"
        );


    if(subtotalElement){

        subtotalElement.textContent =
            formatSalaryCurrency(
                subtotalJPY
            );

    }


    if(taxElement){

        taxElement.textContent =
            formatSalaryCurrency(
                taxJPY
            );

    }


    if(totalElement){

        totalElement.textContent =
            formatSalaryCurrency(
                totalJPY
            );

    }

}

/* ==========================================================
   SAVE WORK
   ========================================================== */

async function saveWork(){

    console.log(
        "Salary: saveWork()"
    );


    const {
        data: {
            user
        }
    } = await db.auth.getUser();


    if(!user){

    return;

}


    const workDate =
        document.getElementById(
            "salaryWorkDate"
        );

    const engineer =
        document.getElementById(
            "salaryEngineer"
        );

    const genCon =
        document.getElementById(
            "salaryGenCon"
        );

    const location =
        document.getElementById(
            "salaryLocation"
        );

    const project =
        document.getElementById(
            "salaryProject"
        );

    const description =
        document.getElementById(
            "salaryDescription"
        );

    const quantityInput =
        document.getElementById(
            "salaryQuantity"
        );

    const unit =
        document.getElementById(
            "salaryUnit"
        );

    const rateInput =
        document.getElementById(
            "salaryRate"
        );


    const quantity =
        Number(
            quantityInput?.value
        ) || 0;


    const rate =
    Number(
        rateInput?.value
    ) || 0;


/* ------------------------------------------------------
   RATE IS ENTERED IN CURRENT DISPLAY CURRENCY

   Supabase always stores Salary amounts in JPY.
   ------------------------------------------------------ */

let rateJPY =
    rate;


if(
    window.currentCurrency === "PHP"
){

    const phpRate =
        Number(
            window.currencyRates?.PHP
        ) || 0;


    if(phpRate > 0){

        rateJPY =
            rate / phpRate;

    }

}


const subtotal =
    quantity * rateJPY;


const tax =
    subtotal * 0.10;


const total =
    subtotal + tax;


    /* ------------------------------------------------------
       VALIDATION
       ------------------------------------------------------ */

    if(

        !workDate ||
        !workDate.value ||

        !engineer ||
        !engineer.value.trim() ||

        !genCon ||
        !genCon.value.trim() ||

        !location ||
        !location.value.trim() ||

        !project ||
        !project.value.trim() ||

        !description ||
        !description.value.trim() ||

        quantity <= 0 ||

        !unit ||
        !unit.value ||

        rate <= 0

    ){

        alert(
            "Please complete all required fields."
        );

        return;

    }


    /* ------------------------------------------------------
       DATA
       ------------------------------------------------------ */

    const work = {

        user_id:
            user.id,

        work_date:
            workDate.value,

        engineer:
            engineer.value.trim(),

        gen_con:
            genCon.value.trim(),

        location:
            location.value.trim(),

        project_name:
            project.value.trim(),

        description:
            description.value.trim(),

        quantity,

        unit:
            unit.value,

       rate:
    rateJPY,

        subtotal,

        tax,

        total,

        status:
            "Pending"

    };


    let error;


    /* ------------------------------------------------------
       UPDATE
       ------------------------------------------------------ */

    if(editingWorkId){

        ({
            error
        } = await db

            .from("work_logs")

            .update(work)

            .eq(
                "id",
                editingWorkId
            )

            .eq(
                "user_id",
                user.id
            )

        );

    }

    /* ------------------------------------------------------
       INSERT
       ------------------------------------------------------ */

    else{

        ({
            error
        } = await db

            .from("work_logs")

            .insert([
                work
            ])

        );

    }


    if(error){

        console.error(
            "SALARY SAVE ERROR:",
            error
        );

        alert(
            error.message
        );

        return;

    }


    alert(
        editingWorkId
        ?
        "Work Log updated successfully!"
        :
        "Work Log saved successfully!"
    );


    editingWorkId = null;


    clearSalaryForm();


    showSalarySection(
        "logs"
    );


    await loadWorkLogs();

}


/* ==========================================================
   CLEAR SALARY FORM
   ========================================================== */

function clearSalaryForm(){

    const ids = [

        "salaryWorkDate",
        "salaryEngineer",
        "salaryGenCon",
        "salaryLocation",
        "salaryProject",
        "salaryDescription",
        "salaryQuantity",
        "salaryRate"

    ];


    ids.forEach(id => {

        const element =
            document.getElementById(id);


        if(element){

            element.value = "";

        }

    });


    const unit =
        document.getElementById(
            "salaryUnit"
        );


    if(unit){

        unit.selectedIndex = 0;

    }


    const subtotal =
        document.getElementById(
            "salarySubtotal"
        );

    const tax =
        document.getElementById(
            "salaryTax"
        );

    const total =
        document.getElementById(
            "salaryTotal"
        );


    if(subtotal)
    subtotal.textContent =
        formatSalaryCurrency(0);


if(tax)
    tax.textContent =
        formatSalaryCurrency(0);


if(total)
    total.textContent =
        formatSalaryCurrency(0);

}


/* ==========================================================
   LOAD WORK LOGS
   ========================================================== */

async function loadWorkLogs(){

    const container =
        document.getElementById(
            "salaryHistoryList"
        );


    /*
       IMPORTANT:
       If Salary page isn't currently present,
       do absolutely nothing.
    */

    if(!container){

        return;

    }


    const {
        data: {
            user
        }
    } = await db.auth.getUser();


    if(!user){

    return;

}


    const searchInput =
        document.getElementById(
            "salarySearch"
        );


    const keyword =
        searchInput
        ?
        searchInput.value
            .trim()
            .toLowerCase()
        :
        "";


    const statusFilter =
        document.getElementById(
            "salaryStatusFilter"
        );


    const selectedStatus =
        statusFilter
        ?
        statusFilter.value
        :
        "";


    const {
        data,
        error
    } = await db

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
            "SALARY WORK LOG ERROR:",
            error
        );

        container.innerHTML = `

            <p class="empty-history">
                Failed to load work logs.
            </p>

        `;

        return;

    }


    if(
        !data ||
        data.length === 0
    ){

        container.innerHTML = `

            <p class="empty-history">

                ${
                    window.currentLanguage === "jp"
                    ?
                    "作業履歴がありません。"
                    :
                    "No work logs yet."
                }

            </p>

        `;

        return;

    }


    let filtered =
        data.filter(work => {

            const searchText = [

                work.project_name,
                work.engineer,
                work.location,
                work.gen_con,
                work.description

            ]
            .filter(Boolean)
            .join(" ")
            .toLowerCase();


            const matchSearch =
                !keyword ||
                searchText.includes(
                    keyword
                );


            const matchStatus =
                !selectedStatus ||
                (
                    work.status ||
                    "Pending"
                ) === selectedStatus;


            return (
                matchSearch &&
                matchStatus
            );

        });


    /*
       Default Salary history:
       show latest 10 only when no filter/search.
    */

    if(
        keyword === "" &&
        selectedStatus === ""
    ){

        filtered =
            filtered.slice(
                0,
                10
            );

    }


    if(filtered.length === 0){

        container.innerHTML = `

            <p class="empty-history">

                ${
                    window.currentLanguage === "jp"
                    ?
                    "該当する作業履歴がありません。"
                    :
                    "No matching work logs found."
                }

            </p>

        `;

        return;

    }


    container.innerHTML = "";


    filtered.forEach(
        work => {

            const date =
                new Date(
                    work.work_date
                );


            const month =
                window.currentLanguage === "jp"

                ?

                `${date.getMonth()+1}月`

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
                date.getDate();


            const year =
                date.getFullYear();


            const quantity =
    Number(
        work.quantity || 0
    );


const rateJPY =
    Number(
        work.rate || 0
    );


let rate =
    rateJPY;


const subtotal =
    quantity * rate;


const tax =
    subtotal * 0.10;


const total =
    subtotal + tax;


            const status =
                work.status ||
                "Pending";


            const displayDate =
                date.toLocaleDateString(

                    window.currentLanguage === "jp"
                    ?
                    "ja-JP"
                    :
                    "en-US",

                    {
                        year:"numeric",
                        month:"long",
                        day:"numeric"
                    }

                );


            const card =
                document.createElement(
                    "div"
                );


            card.className =
                "salary-log-card";


            card.addEventListener(
                "click",
                () => {

                    toggleSalaryLogCard(
                        card
                    );

                }
            );


            card.innerHTML = `

                <div class="salary-log-top">


                    <div class="salary-date-card">

                        <div class="month">
                            ${month}
                        </div>

                        <div class="day">
                            ${day}
                        </div>

                        <div class="year">
                            ${year}
                        </div>

                    </div>


                    <div class="salary-summary-info">

                        <h3>
                            ${work.project_name || "-"}
                        </h3>

                        <p>
                            ${work.engineer || "-"}
                        </p>

                        <p>
                            ${work.gen_con || "-"}
                        </p>


                        <div class="salary-card-summary">

                            <div>

                                <span>
                                    ${
                                        window.currentLanguage === "jp"
                                        ?
                                        "小計"
                                        :
                                        "Subtotal"
                                    }
                                </span>

                                       <strong>
                                         ${formatSalaryCurrency(subtotal)}
                                       </strong>

                            </div>


                            <div>

                                <span>
                                    ${
                                        window.currentLanguage === "jp"
                                        ?
                                        "消費税"
                                        :
                                        "10% Tax"
                                    }
                                </span>

                                          <strong>
                                            ${formatSalaryCurrency(tax)}
                                          </strong>

                            </div>


                            <div>

                                <span>
                                    ${
                                        window.currentLanguage === "jp"
                                        ?
                                        "合計"
                                        :
                                        "Total"
                                    }
                                </span>

                                       <strong>
                                          ${formatSalaryCurrency(total)}
                                       </strong>

                            </div>

                        </div>

                    </div>


                    <div class="salary-menu">

                        <button
                            type="button"
                            class="history-menu-btn salary-history-menu-btn"
                        >
                            ⋮
                        </button>


                        <div class="history-menu-dropdown">

                            <button
                                type="button"
                                class="salary-edit-btn"
                            >

                                ${
                                    window.currentLanguage === "jp"
                                    ?
                                    "編集"
                                    :
                                    "Edit"
                                }

                            </button>


                            <button
                                type="button"
                                class="delete-btn salary-delete-btn"
                            >

                                ${
                                    window.currentLanguage === "jp"
                                    ?
                                    "削除"
                                    :
                                    "Delete"
                                }

                            </button>

                        </div>

                    </div>

                </div>


                <div class="salary-log-details">


                    <div class="salary-detail-row">

                        <span class="salary-detail-label">
                            ${
                                window.currentLanguage === "jp"
                                ?
                                "日付"
                                :
                                "Date"
                            }
                        </span>

                        <span class="salary-detail-value">
                            ${displayDate}
                        </span>

                    </div>


                    <div class="salary-detail-row">

                        <span class="salary-detail-label">
                            ${
                                window.currentLanguage === "jp"
                                ?
                                "場所"
                                :
                                "Location"
                            }
                        </span>

                        <span class="salary-detail-value">
                            ${work.location || "-"}
                        </span>

                    </div>


                    <div class="salary-detail-row">

                        <span class="salary-detail-label">
                            ${
                                window.currentLanguage === "jp"
                                ?
                                "作業内容"
                                :
                                "Description"
                            }
                        </span>

                        <span class="salary-detail-value">
                            ${work.description || "-"}
                        </span>

                    </div>


                    <div class="salary-detail-row">

                        <span class="salary-detail-label">
                            ${
                                window.currentLanguage === "jp"
                                ?
                                "数量"
                                :
                                "Quantity"
                            }
                        </span>

                        <span class="salary-detail-value">
                            ${quantity}
                            ${work.unit || ""}
                        </span>

                    </div>


                    <div class="salary-detail-row">

                        <span class="salary-detail-label">
                            ${
                                window.currentLanguage === "jp"
                                ?
                                "単価"
                                :
                                "Rate"
                            }
                        </span>

<span class="salary-detail-value">
    ${formatSalaryCurrency(rate)}
</span>

                    </div>


                    <div class="salary-detail-row">

                        <span class="salary-detail-label">
                            ${
                                window.currentLanguage === "jp"
                                ?
                                "小計"
                                :
                                "Subtotal"
                            }
                        </span>

<span class="salary-detail-value">
    ${formatSalaryCurrency(subtotal)}
</span>

                    </div>


                    <div class="salary-detail-row">

                        <span class="salary-detail-label">
                            ${
                                window.currentLanguage === "jp"
                                ?
                                "消費税 (10%)"
                                :
                                "10% Tax"
                            }
                        </span>

<span class="salary-detail-value">
    ${formatSalaryCurrency(tax)}
</span>

                    </div>


                    <div class="salary-detail-row">

                        <span class="salary-detail-label">
                            <strong>
                                ${
                                    window.currentLanguage === "jp"
                                    ?
                                    "合計"
                                    :
                                    "Total"
                                }
                            </strong>
                        </span>

                           <span class="salary-detail-value">
                            <strong>
                                ${formatSalaryCurrency(total)}
                            </strong>
                        </span>

                    </div>


                    <div class="salary-detail-row">

                        <span class="salary-detail-label">
                            ${
                                window.currentLanguage === "jp"
                                ?
                                "状態"
                                :
                                "Status"
                            }
                        </span>

                        <span class="salary-detail-value">
    ${
        status === "Paid"
            ? (
                window.currentLanguage === "jp"
                    ? "支払い済み"
                    : "Paid"
              )
            : (
                window.currentLanguage === "jp"
                    ? "未払い"
                    : "Pending"
              )
    }
</span>

                    </div>


                </div>

            `;


            /* ------------------------------------------------
               SALARY MENU
               ------------------------------------------------ */

            const menu =
                card.querySelector(
                    ".salary-menu"
                );


            const menuButton =
                card.querySelector(
                    ".salary-history-menu-btn"
                );


            const editButton =
                card.querySelector(
                    ".salary-edit-btn"
                );


            const deleteButton =
                card.querySelector(
                    ".salary-delete-btn"
                );


            if(menuButton){

                menuButton.addEventListener(
                    "click",
                    (event) => {

                        event.stopPropagation();

                        toggleSalaryMenu(
                            menuButton
                        );

                    }
                );

            }


            if(menu){

                menu.addEventListener(
                    "click",
                    (event) => {

                        event.stopPropagation();

                    }
                );

            }


            if(editButton){

                editButton.addEventListener(
                    "click",
                    (event) => {

                        event.stopPropagation();

                        editWork(
                            work.id
                        );

                    }
                );

            }


            if(deleteButton){

                deleteButton.addEventListener(
                    "click",
                    (event) => {

                        event.stopPropagation();

                        deleteWork(
                            work.id
                        );

                    }
                );

            }


            container.appendChild(
                card
            );

        }
    );

}


/* ==========================================================
   TOGGLE SALARY WORK CARD
   ========================================================== */

function toggleSalaryLogCard(card){

    if(!card) return;


    document
        .querySelectorAll(
            "#salaryHistoryList .salary-log-card.open"
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


/* ==========================================================
   SALARY MENU
   IMPORTANT:
   NOT toggleHistoryMenu()
   ========================================================== */

function toggleSalaryMenu(button){

    if(!button) return;


    const currentMenu =
        button.closest(
            ".salary-menu"
        );


    if(!currentMenu) return;


    document
        .querySelectorAll(
            ".salary-menu.active"
        )
        .forEach(
            menu => {

                if(menu !== currentMenu){

                    menu.classList.remove(
                        "active"
                    );

                }

            }
        );


    currentMenu.classList.toggle(
        "active"
    );

}


/* ==========================================================
   EDIT WORK
   ========================================================== */

async function editWork(id){

    if(!id) return;


    const {
        data,
        error
    } = await db

        .from("work_logs")

        .select("*")

        .eq(
            "id",
            id
        )

        .single();


    if(error){

        console.error(
            "EDIT WORK ERROR:",
            error
        );

        alert(
            error.message
        );

        return;

    }


    if(!data){

        alert(
            "Work log not found."
        );

        return;

    }


    editingWorkId =
        id;


    const fields = {

        salaryWorkDate:
            data.work_date,

        salaryEngineer:
            data.engineer,

        salaryGenCon:
            data.gen_con,

        salaryLocation:
            data.location,

        salaryProject:
            data.project_name,

        salaryDescription:
            data.description,

        salaryQuantity:
            data.quantity,

        salaryUnit:
            data.unit,

        salaryRate:
    window.currentCurrency === "PHP" &&
    Number(window.currencyRates?.PHP) > 0
    ?
    Number(data.rate) *
    Number(window.currencyRates.PHP)
    :
    data.rate

    };


    Object.entries(
        fields
    )
    .forEach(
        ([id,value]) => {

            const element =
                document.getElementById(
                    id
                );


            if(element){

                element.value =
                    value ?? "";

            }

        }
    );


    computeSalary();


    showSalarySection(
        "form"
    );


    const formSection =
        document.getElementById(
            "salaryFormSection"
        );


    if(formSection){

        formSection.scrollIntoView({
            behavior:"smooth",
            block:"start"
        });

    }

}


/* ==========================================================
   DELETE WORK
   ========================================================== */

async function deleteWork(id){

    if(!id) return;


    const confirmed =
        confirm(

            window.currentLanguage === "jp"
            ?
            "この作業履歴を削除しますか？"
            :
            "Delete this work log?"

        );


    if(!confirmed) return;


    const {
        data: {
            user
        }
    } = await db.auth.getUser();


   if(!user){

    return;

}


    const {
        error
    } = await db

        .from("work_logs")

        .delete()

        .eq(
            "id",
            id
        )

        .eq(
            "user_id",
            user.id
        );


    if(error){

        console.error(
            "DELETE WORK ERROR:",
            error
        );

        alert(
            error.message
        );

        return;

    }


    await loadWorkLogs();

}


/* ==========================================================
   LOAD ADVANCE GEN CON
   ========================================================== */

async function loadAdvanceGenCon(){

    const select =
        document.getElementById(
            "advanceGenCon"
        );


    if(!select) return;


    const {
        data:{
            user
        }
    } = await db.auth.getUser();


    if(!user) return;


    const {
        data,
        error
    } = await db

        .from("work_logs")

        .select("gen_con")

        .eq(
            "user_id",
            user.id
        )

        .order(
            "gen_con"
        );


    if(error){

        console.error(
            "ADVANCE GEN CON ERROR:",
            error
        );

        return;

    }


    const unique =
        [
            ...new Set(

                (data || [])
                    .map(
                        item =>
                            item.gen_con
                    )
                    .filter(Boolean)

            )
        ];


    select.innerHTML = `

        <option value="">
            Select Gen. Con.
        </option>

    `;


    unique.forEach(
        genCon => {

            const option =
                document.createElement(
                    "option"
                );


            option.value =
                genCon;


            option.textContent =
                genCon;


            select.appendChild(
                option
            );

        }
    );

}


/* ==========================================================
   LOAD ADVANCE PROJECTS
   ========================================================== */

async function loadAdvanceProjects(
    genCon
){

    const select =
        document.getElementById(
            "advanceProject"
        );


    if(!select) return;


    select.innerHTML = `

        <option value="">
            Select Project
        </option>

    `;


    if(!genCon) return;


    const {
        data:{
            user
        }
    } = await db.auth.getUser();


    if(!user) return;


    const {
        data,
        error
    } = await db

        .from("work_logs")

        .select("project_name")

        .eq(
            "user_id",
            user.id
        )

        .eq(
            "gen_con",
            genCon
        )

        .order(
            "project_name"
        );


    if(error){

        console.error(
            "ADVANCE PROJECT ERROR:",
            error
        );

        return;

    }


    const unique =
        [
            ...new Set(

                (data || [])
                    .map(
                        item =>
                            item.project_name
                    )
                    .filter(Boolean)

            )
        ];


    unique.forEach(
        project => {

            const option =
                document.createElement(
                    "option"
                );


            option.value =
                project;


            option.textContent =
                project;


            select.appendChild(
                option
            );

        }
    );

}


/* ==========================================================
   LOAD ADVANCE ENGINEERS
   ========================================================== */

async function loadAdvanceEngineers(
    genCon,
    project
){

    const select =
        document.getElementById(
            "advanceEngineer"
        );


    if(!select) return;


    select.innerHTML = `

        <option value="">
            Select Engineer
        </option>

    `;


    if(
        !genCon ||
        !project
    ){

        return;

    }


    const {
        data:{
            user
        }
    } = await db.auth.getUser();


    if(!user) return;


    const {
        data,
        error
    } = await db

        .from("work_logs")

        .select("engineer")

        .eq(
            "user_id",
            user.id
        )

        .eq(
            "gen_con",
            genCon
        )

        .eq(
            "project_name",
            project
        )

        .order(
            "engineer"
        );


    if(error){

        console.error(
            "ADVANCE ENGINEER ERROR:",
            error
        );

        return;

    }


    const unique =
        [
            ...new Set(

                (data || [])
                    .map(
                        item =>
                            item.engineer
                    )
                    .filter(Boolean)

            )
        ];


    unique.forEach(
        engineer => {

            const option =
                document.createElement(
                    "option"
                );


            option.value =
                engineer;


            option.textContent =
                engineer;


            select.appendChild(
                option
            );

        }
    );

}


/* ==========================================================
   SAVE ADVANCE
   ========================================================== */

async function saveAdvance(){

    const {
        data:{
            user
        }
    } = await db.auth.getUser();


    if(!user){

    return;

}


    const advance = {

        user_id:
            user.id,

        advance_date:
            document.getElementById(
                "advanceDate"
            )?.value || "",

        gen_con:
            document.getElementById(
                "advanceGenCon"
            )?.value || "",

        project_name:
            document.getElementById(
                "advanceProject"
            )?.value || "",

        engineer:
            document.getElementById(
                "advanceEngineer"
            )?.value || "",

        amount:
    window.currentCurrency === "PHP" &&
    Number(window.currencyRates?.PHP) > 0
    ?
    (
        Number(
            document.getElementById(
                "advanceAmount"
            )?.value
        ) || 0
    ) / Number(window.currencyRates.PHP)
    :
    (
        Number(
            document.getElementById(
                "advanceAmount"
            )?.value
        ) || 0
    ),

        reason:
            document.getElementById(
                "advanceReason"
            )?.value || ""

    };


    if(

        !advance.advance_date ||
        !advance.gen_con ||
        !advance.project_name ||
        !advance.engineer ||
        advance.amount <= 0

    ){

        alert(
            "Please complete all required fields."
        );

        return;

    }


    let error;


    if(editingAdvanceId){

        ({
            error
        } = await db

            .from("salary_advances")

            .update(advance)

            .eq(
                "id",
                editingAdvanceId
            )

            .eq(
                "user_id",
                user.id
            )

        );

    }

    else{

        ({
            error
        } = await db

            .from("salary_advances")

            .insert([
                advance
            ])

        );

    }


    if(error){

        console.error(
            "SAVE ADVANCE ERROR:",
            error
        );

        alert(
            error.message
        );

        return;

    }


    alert(

        editingAdvanceId
        ?
        "Salary Advance updated successfully!"
        :
        "Salary Advance saved successfully!"

    );


    editingAdvanceId =
        null;


    const saveButton =
        document.getElementById(
            "saveAdvanceBtn"
        );


    if(saveButton){

        saveButton.textContent =
            "SAVE ADVANCE";

    }


    clearAdvanceForm();


    await loadAdvanceHistory();


    showSalarySection(
        "advanceHistory"
    );

}


/* ==========================================================
   CLEAR ADVANCE FORM
   ========================================================== */

function clearAdvanceForm(){

    const ids = [

        "advanceDate",
        "advanceGenCon",
        "advanceProject",
        "advanceEngineer",
        "advanceAmount",
        "advanceReason"

    ];


    ids.forEach(
        id => {

            const element =
                document.getElementById(
                    id
                );


            if(element){

                element.value = "";

            }

        }
    );

}


/* ==========================================================
   LOAD ADVANCE HISTORY
   ========================================================== */

async function loadAdvanceHistory(){

    const list =
        document.getElementById(
            "advanceHistoryList"
        );


    if(!list) return;


    const {
        data:{
            user
        }
    } = await db.auth.getUser();


    if(!user){

    return;

}


    const {
        data,
        error
    } = await db

        .from("salary_advances")

        .select("*")

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
            "ADVANCE HISTORY ERROR:",
            error
        );


        list.innerHTML = `

            <p class="empty-history">
                Failed to load salary advances.
            </p>

        `;


        return;

    }


    window.allAdvanceHistory =
        data || [];


    populateAdvanceYears();

    filterAdvanceHistory();

}


/* ==========================================================
   POPULATE ADVANCE YEARS
========================================================== */

function populateAdvanceYears(){

    const select =
        document.getElementById(
            "advanceYearFilter"
        );


    if(!select) return;


    const currentValue =
        select.value;


    const years =
        [
            ...new Set(

                (window.allAdvanceHistory || [])
                    .map(item => {

                        const date =
                            new Date(
                                item.advance_date
                            );


                        return date.getFullYear();

                    })

            )
        ]
        .sort(
            (a,b) => b-a
        );


    const isJapanese =
        window.currentLanguage === "jp";


    /*
       IMPORTANT:
       The option text itself must also
       change according to the language.
    */

    select.innerHTML = `

        <option value="">
            ${
                isJapanese
                ?
                "すべての年"
                :
                "All Years"
            }
        </option>

    `;


    years.forEach(
        year => {

            const option =
                document.createElement(
                    "option"
                );


            option.value =
                year;


            /*
               Year numbers stay numeric.
               Only the "All Years" label is translated.
            */

            option.textContent =
                year;


            select.appendChild(
                option
            );

        }
    );


    if(
        years.includes(
            Number(currentValue)
        )
    ){

        select.value =
            currentValue;

    }

}


/* ==========================================================
   FILTER ADVANCE HISTORY
========================================================== */

function filterAdvanceHistory(){

    const data =
        window.allAdvanceHistory ||
        [];


    const searchInput =
        document.getElementById(
            "advanceSearch"
        );


    const monthSelect =
        document.getElementById(
            "advanceMonthFilter"
        );


    const yearSelect =
        document.getElementById(
            "advanceYearFilter"
        );


    const keyword =
        searchInput
        ?
        searchInput.value
            .trim()
            .toLowerCase()
        :
        "";


    const selectedMonth =
        monthSelect
        ?
        monthSelect.value
        :
        "";


    const selectedYear =
        yearSelect
        ?
        yearSelect.value
        :
        "";


    let filtered =
        data.filter(item => {

            /*
               IMPORTANT:
               Do NOT use new Date() here.

               The database date is already in
               YYYY-MM-DD format.

               We read the month/year directly
               so timezone cannot shift the date.
            */

            const dateParts =
                String(
                    item.advance_date
                ).split("-");


            const year =
                dateParts[0];


            const month =
                dateParts[1];


            const searchText = [

                item.project_name,
                item.engineer,
                item.gen_con,
                item.reason,
                item.amount

            ]
            .filter(Boolean)
            .join(" ")
            .toLowerCase();


            const matchSearch =
                !keyword ||
                searchText.includes(
                    keyword
                );


            const matchMonth =
                !selectedMonth ||
                month ===
                String(
                    Number(selectedMonth) + 1
                ).padStart(
                    2,
                    "0"
                );


            const matchYear =
                !selectedYear ||
                year ===
                String(
                    selectedYear
                );


            return (
                matchSearch &&
                matchMonth &&
                matchYear
            );

        });


    /*
       Default:
       Show latest 10 only when there is
       no search, month filter, or year filter.
    */

    if(

        keyword === "" &&
        selectedMonth === "" &&
        selectedYear === ""

    ){

        filtered =
            filtered.slice(
                0,
                10
            );

    }


    renderAdvanceHistory(
        filtered
    );

}


/* ==========================================================
   RENDER ADVANCE HISTORY
   ========================================================== */

function renderAdvanceHistory(
    data
){

    const list =
        document.getElementById(
            "advanceHistoryList"
        );


    if(!list) return;


    if(
        !data ||
        data.length === 0
    ){

        list.innerHTML = `

            <p class="empty-history">

                ${
                    window.currentLanguage === "jp"
                    ?
                    "給与前払い履歴がありません。"
                    :
                    "No salary advances found."
                }

            </p>

        `;

        return;

    }


    list.innerHTML = "";


    data.forEach(
        item => {

            const date =
                new Date(
                    item.advance_date
                );


            const month =
                window.currentLanguage === "jp"

                ?

                `${date.getMonth()+1}月`

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
                date.getDate();


            const year =
                date.getFullYear();


            const amountJPY =
    Number(
        item.amount || 0
    );


let amount =
    amountJPY;


            const displayDate =
                date.toLocaleDateString(

                    window.currentLanguage === "jp"
                    ?
                    "ja-JP"
                    :
                    "en-US",

                    {
                        year:"numeric",
                        month:"long",
                        day:"numeric"
                    }

                );


            const card =
                document.createElement(
                    "div"
                );


            card.className =
                "salary-log-card advance-log-card";


            card.addEventListener(
                "click",
                () => {

                    toggleAdvanceCard(
                        card
                    );

                }
            );


            card.innerHTML = `

                <div class="salary-log-top">


                    <div class="salary-date-card">

                        <div class="month">
                            ${month}
                        </div>

                        <div class="day">
                            ${day}
                        </div>

                        <div class="year">
                            ${year}
                        </div>

                    </div>


                    <div class="salary-summary-info">

                        <h3>
                            ${item.project_name || "-"}
                        </h3>

                        <p>
                            ${item.engineer || "-"}
                        </p>

                        <p>
                            ${item.gen_con || "-"}
                        </p>


                        <div class="salary-card-summary">

                            <div>

                                <span>
                                    ${
                                        window.currentLanguage === "jp"
                                        ?
                                        "日付"
                                        :
                                        "Date"
                                    }
                                </span>

                                <strong>
    ${
        window.currentLanguage === "jp"
        ?
        date.toLocaleDateString(
            "ja-JP",
            {
                year:"numeric",
                month:"long",
                day:"numeric"
            }
        )
        :
        date.toLocaleDateString(
            "en-US",
            {
                month:"short",
                day:"numeric",
                year:"numeric"
            }
        )
    }
</strong>

                            </div>


                            <div>

                                <span>
                                    ${
                                        window.currentLanguage === "jp"
                                        ?
                                        "前払い"
                                        :
                                        "Advance"
                                    }
                                </span>

                           <strong>
                                  ${formatSalaryCurrency(amount)}
                           </strong>

                            </div>

                        </div>

                    </div>


                    <div class="salary-menu">

                        <button
                            type="button"
                            class="history-menu-btn salary-history-menu-btn"
                        >
                            ⋮
                        </button>


                        <div class="history-menu-dropdown">

                            <button
                                type="button"
                                class="salary-edit-btn"
                            >

                                ${
                                    window.currentLanguage === "jp"
                                    ?
                                    "編集"
                                    :
                                    "Edit"
                                }

                            </button>


                            <button
                                type="button"
                                class="delete-btn salary-delete-btn"
                            >

                                ${
                                    window.currentLanguage === "jp"
                                    ?
                                    "削除"
                                    :
                                    "Delete"
                                }

                            </button>

                        </div>

                    </div>

                </div>


                <div class="salary-log-details">


                    <div class="salary-detail-row">

                        <span class="salary-detail-label">
                            ${
                                window.currentLanguage === "jp"
                                ?
                                "日付"
                                :
                                "Date"
                            }
                        </span>

                        <span class="salary-detail-value">
                            ${displayDate}
                        </span>

                    </div>


                    <div class="salary-detail-row">

                        <span class="salary-detail-label">
                            ${
                                window.currentLanguage === "jp"
                                ?
                                "担当者"
                                :
                                "Engineer"
                            }
                        </span>

                        <span class="salary-detail-value">
                            ${item.engineer || "-"}
                        </span>

                    </div>


                    <div class="salary-detail-row">

                        <span class="salary-detail-label">
                            ${
                                window.currentLanguage === "jp"
                                ?
                                "元請会社"
                                :
                                "Gen. Con."
                            }
                        </span>

                        <span class="salary-detail-value">
                            ${item.gen_con || "-"}
                        </span>

                    </div>


                    <div class="salary-detail-row">

                        <span class="salary-detail-label">
                            ${
                                window.currentLanguage === "jp"
                                ?
                                "プロジェクト"
                                :
                                "Project"
                            }
                        </span>

                        <span class="salary-detail-value">
                            ${item.project_name || "-"}
                        </span>

                    </div>


                    <div class="salary-detail-row">

                        <span class="salary-detail-label">
                            ${
                                window.currentLanguage === "jp"
                                ?
                                "理由"
                                :
                                "Reason"
                            }
                        </span>

                        <span class="salary-detail-value">
                            ${item.reason || "-"}
                        </span>

                    </div>


                    <div class="salary-detail-row">

                        <span class="salary-detail-label">

                            <strong>
                                ${
                                    window.currentLanguage === "jp"
                                    ?
                                    "前払い合計"
                                    :
                                    "Total Advance"
                                }
                            </strong>

                        </span>


                        <span class="salary-detail-value">

                              <strong>
                          ${formatSalaryCurrency(amount)}
                              </strong>

                        </span>

                    </div>


                </div>

            `;


            const menu =
                card.querySelector(
                    ".salary-menu"
                );


            const menuButton =
                card.querySelector(
                    ".salary-history-menu-btn"
                );


            const editButton =
                card.querySelector(
                    ".salary-edit-btn"
                );


            const deleteButton =
                card.querySelector(
                    ".salary-delete-btn"
                );


            if(menuButton){

                menuButton.addEventListener(
                    "click",
                    event => {

                        event.stopPropagation();

                        toggleSalaryMenu(
                            menuButton
                        );

                    }
                );

            }


            if(menu){

                menu.addEventListener(
                    "click",
                    event => {

                        event.stopPropagation();

                    }
                );

            }


            if(editButton){

                editButton.addEventListener(
                    "click",
                    event => {

                        event.stopPropagation();

                        editAdvance(
                            item.id
                        );

                    }
                );

            }


            if(deleteButton){

                deleteButton.addEventListener(
                    "click",
                    event => {

                        event.stopPropagation();

                        deleteAdvance(
                            item.id
                        );

                    }
                );

            }


            list.appendChild(
                card
            );

        }
    );

}


/* ==========================================================
   TOGGLE ADVANCE CARD
   ========================================================== */

function toggleAdvanceCard(card){

    if(!card) return;


    document
        .querySelectorAll(
            "#advanceHistoryList .advance-log-card.open"
        )
        .forEach(
            openCard => {

                if(
                    openCard !== card
                ){

                    openCard.classList.remove(
                        "open"
                    );

                }

            }
        );


    card.classList.toggle(
        "open"
    );

}


/* ==========================================================
   EDIT ADVANCE
   ========================================================== */

async function editAdvance(id){

    if(!id) return;


    const {
        data,
        error
    } = await db

        .from("salary_advances")

        .select("*")

        .eq(
            "id",
            id
        )

        .single();


    if(error){

        console.error(
            "EDIT ADVANCE ERROR:",
            error
        );

        alert(
            error.message
        );

        return;

    }


    if(!data){

        alert(
            "Salary advance not found."
        );

        return;

    }


    editingAdvanceId =
        id;


    const advanceDate =
        document.getElementById(
            "advanceDate"
        );

    const advanceGenCon =
        document.getElementById(
            "advanceGenCon"
        );

    const advanceProject =
        document.getElementById(
            "advanceProject"
        );

    const advanceEngineer =
        document.getElementById(
            "advanceEngineer"
        );

    const advanceReason =
        document.getElementById(
            "advanceReason"
        );

    const advanceAmount =
        document.getElementById(
            "advanceAmount"
        );


    if(advanceDate){

        advanceDate.value =
            data.advance_date || "";

    }


    if(advanceGenCon){

        advanceGenCon.value =
            data.gen_con || "";

    }


    await loadAdvanceProjects(
        data.gen_con || ""
    );


    if(advanceProject){

        advanceProject.value =
            data.project_name || "";

    }


    await loadAdvanceEngineers(

        data.gen_con || "",

        data.project_name || ""

    );


    if(advanceEngineer){

        advanceEngineer.value =
            data.engineer || "";

    }


    if(advanceReason){

        advanceReason.value =
            data.reason || "";

    }


    if(advanceAmount){

    advanceAmount.value =
        window.currentCurrency === "PHP" &&
        Number(window.currencyRates?.PHP) > 0
        ?
        Number(data.amount || 0) *
        Number(window.currencyRates.PHP)
        :
        data.amount || "";

}


    const saveButton =
        document.getElementById(
            "saveAdvanceBtn"
        );


    if(saveButton){

        saveButton.textContent =
            "UPDATE ADVANCE";

    }


    showSalarySection(
        "advance"
    );


    const advanceSection =
        document.getElementById(
            "salaryAdvanceSection"
        );


    if(advanceSection){

        advanceSection.scrollIntoView({
            behavior:"smooth",
            block:"start"
        });

    }

}


/* ==========================================================
   DELETE ADVANCE
   ========================================================== */

async function deleteAdvance(id){

    if(!id) return;


    const confirmed =
        confirm(

            window.currentLanguage === "jp"
            ?
            "この給与前払いを削除しますか？"
            :
            "Are you sure you want to delete this salary advance?"

        );


    if(!confirmed) return;


    const {
        data:{
            user
        }
    } = await db.auth.getUser();


    if(!user){

    return;

}


    const {
        error
    } = await db

        .from("salary_advances")

        .delete()

        .eq(
            "id",
            id
        )

        .eq(
            "user_id",
            user.id
        );


    if(error){

        console.error(
            "DELETE ADVANCE ERROR:",
            error
        );

        alert(
            error.message
        );

        return;

    }


    await loadAdvanceHistory();

}


/* ==========================================================
   ADVANCE FILTER
   ========================================================== */

function toggleAdvanceFilter(){

    const panel =
        document.getElementById(
            "advanceFilterPanel"
        );


    if(!panel) return;


    panel.classList.toggle(
        "show"
    );

}


/* ==========================================================
   CLOSE ADVANCE FILTER
   ========================================================== */

function closeAdvanceFilter(){

    const panel =
        document.getElementById(
            "advanceFilterPanel"
        );


    if(panel){

        panel.classList.remove(
            "show"
        );

    }

}


/* ==========================================================
   OPTIONAL COMPATIBILITY
   ==========================================================

   These are kept only if some existing Salary HTML
   still calls these functions directly.

   They DO NOT control History, Reports or Profile.
   ========================================================== */

window.salaryToggleHistoryMenu =
    toggleSalaryMenu;

window.salaryToggleLogCard =
    toggleSalaryLogCard;

window.salaryToggleAdvanceCard =
    toggleAdvanceCard;

window.salaryEditWork =
    editWork;

window.salaryDeleteWork =
    deleteWork;

window.salaryEditAdvance =
    editAdvance;

window.salaryDeleteAdvance =
    deleteAdvance;
