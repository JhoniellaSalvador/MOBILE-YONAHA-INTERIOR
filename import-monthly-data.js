console.log("IMPORT MONTHLY DATA JS LOADED");

/* ==========================================================
IMPORT MONTHLY DATA
========================================================== */

/* ==========================================================
IMPORT MONTHLY DATA TOGGLE
========================================================== */

function toggleImportMonthlyData(){

const importCard =
    document.getElementById(
        "importCard"
    );

const importOptions =
    document.getElementById(
        "importMonthlyOptions"
    );


if(
    !importCard ||
    !importOptions
){

    console.error(
        "Import Monthly Data elements not found."
    );

    return;

}


const isOpen =
    importCard.classList.contains(
        "import-open"
    );


if(isOpen){

    importCard.classList.remove(
        "import-open"
    );

    importOptions.style.display =
        "none";


}else{

    importCard.classList.add(
        "import-open"
    );

    importOptions.style.display =
        "block";

}


}

/* ==========================================================
GET LOGGED-IN USER
========================================================== */

async function getImportUser(){

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
OPEN FILE PICKER
========================================================== */

function openImportFilePicker(inputId){

const fileInput =
    document.getElementById(
        inputId
    );


if(!fileInput){

    console.error(
        "Import file input not found:",
        inputId
    );

    return;

}


fileInput.value = "";

fileInput.click();


}

/* ==========================================================
CHECK EXCEL FILE
========================================================== */

function isExcelFile(file){

if(!file){

    return false;

}


const fileName =
    file.name.toLowerCase();


return (
    fileName.endsWith(".xlsx") ||
    fileName.endsWith(".xls")
);

}

/* ==========================================================
READ EXCEL FILE
========================================================== */

async function readImportExcel(file){

if(typeof XLSX === "undefined"){

    alert(
        "Excel import library is not loaded."
    );

    return null;

}


const arrayBuffer =
    await file.arrayBuffer();


const workbook =
    XLSX.read(
        arrayBuffer,
        {
            type: "array"
        }
    );


const sheetName =
    workbook.SheetNames[0];


if(!sheetName){

    alert(
        "No worksheet found."
    );

    return null;

}


const worksheet =
    workbook.Sheets[
        sheetName
    ];


const rows =
    XLSX.utils.sheet_to_json(
        worksheet,
        {
            defval: ""
        }
    );


if(!rows.length){

    alert(
        "The Excel file is empty."
    );

    return null;

}


return rows;

}

/* ==========================================================
IMPORT SCHEDULE HISTORY
========================================================== */

async function importScheduleHistory(){

const fileInput =
    document.getElementById(
        "pageImportScheduleFile"
    );


if(
    !fileInput ||
    !fileInput.files ||
    fileInput.files.length === 0
){

    return;

}


const file =
    fileInput.files[0];


if(!isExcelFile(file)){

    alert(
        "Please select an Excel file."
    );

    fileInput.value = "";

    return;

}


console.log(
    "Schedule History file selected:",
    file.name
);


const user =
    await getImportUser();


if(!user){

    fileInput.value = "";

    return;

}


try{

    const rows =
        await readImportExcel(file);


    if(!rows){

        fileInput.value = "";

        return;

    }


    const schedules = [];


    rows.forEach(
        row => {

            const date =
                row.date ||
                row.Date ||
                "";


            if(!date){

                return;

            }


            schedules.push({

                user_id:
                    user.id,

                date:
                    date,

                location:
                    row.location ||
                    row.Location ||
                    "",

                building:
                    row.building ||
                    row.Building ||
                    "",

                engineer:
                    row.engineer ||
                    row.Engineer ||
                    "",

                gen_con:
                    row.gen_con ||
                    row.genCon ||
                    row["Gen. Con."] ||
                    row["Gene Con."] ||
                    "",

                flooring_type:
                    row.flooring_type ||
                    row.flooringType ||
                    row["Flooring Type"] ||
                    "",

                schedule_type:
                    row.schedule_type ||
                    row.scheduleType ||
                    row["Schedule Type"] ||
                    row.type ||
                    row.Type ||
                    "",

                time_in:
                    row.time_in ||
                    row.timeIn ||
                    row["Time In"] ||
                    "",

                time_out:
                    row.time_out ||
                    row.timeOut ||
                    row["Time Out"] ||
                    "",

                notes:
                    row.notes ||
                    row.Notes ||
                    "",

                status:
                    row.status ||
                    row.Status ||
                    ""

            });

        }
    );


    if(!schedules.length){

        alert(
            "No valid Schedule History records were found."
        );

        fileInput.value = "";

        return;

    }


    const {
        error
    } = await db
        .from("schedules")
        .insert(
            schedules
        );


    if(error){

        console.error(
            "SCHEDULE IMPORT ERROR:",
            error
        );


        alert(
            "Schedule import failed:\n\n" +
            error.message
        );

        fileInput.value = "";

        return;

    }


    alert(
        schedules.length +
        " Schedule History record(s) imported successfully."
    );


    fileInput.value = "";


    if(
        typeof loadHistory === "function"
    ){

        loadHistory();

    }


    if(
        typeof updateTodaySchedule === "function"
    ){

        updateTodaySchedule();

    }


    if(
        typeof loadRecentSchedule === "function"
    ){

        loadRecentSchedule();

    }


}catch(error){

    console.error(
        "SCHEDULE EXCEL IMPORT ERROR:",
        error
    );


    alert(
        "Unable to read the Schedule History Excel file."
    );


    fileInput.value = "";

}

}

/* ==========================================================
   IMPORT SALARY WORK LOGS
========================================================== */

async function importSalaryWorkLogs(){

    const fileInput =
        document.getElementById(
            "pageImportSalaryFile"
        );


    if(
        !fileInput ||
        !fileInput.files ||
        fileInput.files.length === 0
    ){

        return;

    }


    const file =
        fileInput.files[0];


    if(!isExcelFile(file)){

        alert(
            "Please select an Excel file."
        );

        fileInput.value = "";

        return;

    }


    console.log(
        "Salary Work Logs file selected:",
        file.name
    );


    const user =
        await getImportUser();


    if(!user){

        fileInput.value = "";

        return;

    }


    try{

        const rows =
            await readImportExcel(file);


        if(!rows){

            fileInput.value = "";

            return;

        }


        const workLogs = [];


        rows.forEach(
            row => {

                const workDate =
                    row.work_date ||
                    row.workDate ||
                    row["Work Date"] ||
                    "";


                if(!workDate){

                    return;

                }


                workLogs.push({

                    user_id:
                        user.id,


                    engineer:
                        row.engineer ||
                        row.Engineer ||
                        "",


                    gen_con:
                        row.gen_con ||
                        row.genCon ||
                        row["Gen. Con."] ||
                        "",


                    location:
                        row.location ||
                        row.Location ||
                        "",


                    description:
                        row.description ||
                        row.Description ||
                        row["Work Description"] ||
                        "",


                    quantity:
                        row.quantity ??
                        row.Quantity ??
                        0,


                    unit:
                        row.unit ||
                        row.Unit ||
                        "",


                    rate:
                        row.rate ??
                        row.Rate ??
                        0,


                    subtotal:
                        row.subtotal ??
                        row.Subtotal ??
                        0,


                    tax:
                        row.tax ??
                        row.Tax ??
                        0,


                    total:
                        row.total ??
                        row.Total ??
                        0,


                    project_name:
                        row.project_name ||
                        row.projectName ||
                        row["Project Name"] ||
                        "",


                    work_date:
                        workDate,


                    status:
                        row.status ||
                        row.Status ||
                        ""

                });

            }
        );


        if(!workLogs.length){

            alert(
                "No valid Salary Work Log records were found."
            );

            fileInput.value = "";

            return;

        }


        const {
            error
        } = await db

            .from("work_logs")

            .insert(
                workLogs
            );


        if(error){

            console.error(
                "SALARY WORK LOG IMPORT ERROR:",
                error
            );


            alert(
                "Salary Work Logs import failed:\n\n" +
                error.message
            );

            fileInput.value = "";

            return;

        }


        alert(
            workLogs.length +
            " Salary Work Log record(s) imported successfully."
        );


        fileInput.value = "";


        if(
            typeof loadWorkLogs ===
            "function"
        ){

            await loadWorkLogs();

        }


        if(
            typeof renderSalaryReports ===
            "function"
        ){

            await renderSalaryReports();

        }


    }catch(error){

        console.error(
            "SALARY WORK LOG EXCEL IMPORT ERROR:",
            error
        );


        alert(
            "Unable to read the Salary Work Logs Excel file."
        );


        fileInput.value = "";

    }

}

/* ==========================================================
   IMPORT SALARY ADVANCE HISTORY
========================================================== */

async function importSalaryAdvances(){

    const fileInput =
        document.getElementById(
            "pageImportAdvanceFile"
        );


    if(
        !fileInput ||
        !fileInput.files ||
        fileInput.files.length === 0
    ){

        return;

    }


    const file =
        fileInput.files[0];


    if(!isExcelFile(file)){

        alert(
            "Please select an Excel file."
        );

        fileInput.value = "";

        return;

    }


    console.log(
        "Salary Advance History file selected:",
        file.name
    );


    const user =
        await getImportUser();


    if(!user){

        fileInput.value = "";

        return;

    }


    try{

        const rows =
            await readImportExcel(file);


        if(!rows){

            fileInput.value = "";

            return;

        }


        const advances = [];


        rows.forEach(
            row => {

                const advanceDate =
                    row.advance_date ||
                    row.advanceDate ||
                    row["Advance Date"] ||
                    "";


                if(!advanceDate){

                    return;

                }


                advances.push({

                    user_id:
                        user.id,


                    advance_date:
                        advanceDate,


                    gen_con:
                        row.gen_con ||
                        row.genCon ||
                        row["Gen. Con."] ||
                        "",


                    project_name:
                        row.project_name ||
                        row.projectName ||
                        row["Project Name"] ||
                        "",


                    engineer:
                        row.engineer ||
                        row.Engineer ||
                        "",


                    amount:
                        row.amount ??
                        row.Amount ??
                        0,


                    reason:
                        row.reason ||
                        row.Reason ||
                        ""

                });

            }
        );


        if(!advances.length){

            alert(
                "No valid Salary Advance records were found."
            );

            fileInput.value = "";

            return;

        }


        const {
            error
        } = await db

            .from("salary_advances")

            .insert(
                advances
            );


        if(error){

            console.error(
                "SALARY ADVANCE IMPORT ERROR:",
                error
            );


            alert(
                "Salary Advance History import failed:\n\n" +
                error.message
            );

            fileInput.value = "";

            return;

        }


        alert(
            advances.length +
            " Salary Advance record(s) imported successfully."
        );


        fileInput.value = "";


        if(
            typeof loadAdvanceHistory ===
            "function"
        ){

            await loadAdvanceHistory();

        }


    }catch(error){

        console.error(
            "SALARY ADVANCE EXCEL IMPORT ERROR:",
            error
        );


        alert(
            "Unable to read the Salary Advance History Excel file."
        );


        fileInput.value = "";

    }

}

/* ==========================================================
   SETUP IMPORT DATA PAGE BUTTONS
========================================================== */

function setupImportPageButtons(){

    /* ------------------------------------------------------
       SCHEDULE HISTORY
    ------------------------------------------------------ */

    const scheduleButton =
        document.getElementById(
            "pageImportScheduleBtn"
        );


    const scheduleFile =
        document.getElementById(
            "pageImportScheduleFile"
        );


    if(
        scheduleButton &&
        scheduleFile
    ){

        scheduleButton.addEventListener(
            "click",
            function(event){

                event.stopPropagation();

                scheduleFile.click();

            }
        );


        scheduleFile.addEventListener(
            "change",
            function(){

                importScheduleHistory();

            }
        );

    }


    /* ------------------------------------------------------
       SALARY WORK LOGS
    ------------------------------------------------------ */

    const salaryButton =
        document.getElementById(
            "pageImportSalaryBtn"
        );


    const salaryFile =
        document.getElementById(
            "pageImportSalaryFile"
        );


    if(
        salaryButton &&
        salaryFile
    ){

        salaryButton.addEventListener(
            "click",
            function(event){

                event.stopPropagation();

                salaryFile.click();

            }
        );


        salaryFile.addEventListener(
            "change",
            function(){

                importSalaryWorkLogs();

            }
        );

    }


    /* ------------------------------------------------------
       SALARY ADVANCE HISTORY
    ------------------------------------------------------ */

    const advanceButton =
        document.getElementById(
            "pageImportAdvanceBtn"
        );


    const advanceFile =
        document.getElementById(
            "pageImportAdvanceFile"
        );


    if(
        advanceButton &&
        advanceFile
    ){

        advanceButton.addEventListener(
            "click",
            function(event){

                event.stopPropagation();

                advanceFile.click();

            }
        );


        advanceFile.addEventListener(
            "change",
            function(){

                importSalaryAdvances();

            }
        );

    }

}

/* ==========================================================
   INITIALIZE IMPORT DATA PAGE
========================================================== */

document.addEventListener(
    "DOMContentLoaded",
    function(){

        setupImportPageButtons();

    }
);

/* ==========================================================
   CLOSE IMPORT MONTHLY DATA WHEN CLICKING OUTSIDE
========================================================== */

document.addEventListener(
    "click",
    function(event){

        const importCard =
            document.getElementById(
                "importCard"
            );

        const importOptions =
            document.getElementById(
                "importMonthlyOptions"
            );


        if(
            !importCard ||
            !importOptions
        ){

            return;

        }


        if(
            !importCard.classList.contains(
                "import-open"
            )
        ){

            return;

        }


        if(
            importCard.contains(
                event.target
            )
        ){

            return;

        }


        if(
            importOptions.contains(
                event.target
            )
        ){

            return;

        }


        importCard.classList.remove(
            "import-open"
        );


        importOptions.style.display =
            "none";

    }
);


/* ==========================================================
   END CLOSE IMPORT ON OUTSIDE CLICK
========================================================== */

/* ==========================================================
END OF IMPORT MONTHLY DATA
========================================================== */
