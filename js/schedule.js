/* ==========================================================
   SCHEDULE
========================================================== */

console.log("schedule.js loaded");

/* ==========================================================
   EDIT MODE
========================================================== */

window.editingScheduleId = null;
let isSavingSchedule = false;

/* ==========================================================
   STATUS BEHAVIOR
========================================================== */

const scheduleStatus =
document.getElementById("scheduleStatus");

if(scheduleStatus){

    scheduleStatus.addEventListener("change",()=>{

        const disabled =
        scheduleStatus.value==="Day Off" ||
        scheduleStatus.value==="Holiday";

        const fields=[

            "scheduleLocation",
            "scheduleBuilding",
            "scheduleEngineer",
            "scheduleGenCon",
            "scheduleFlooring",
            "scheduleType",
            "scheduleTimeIn",
            "scheduleTimeOut"

        ];

        fields.forEach(id=>{

            const input =
            document.getElementById(id);

            if(input){

                input.disabled = disabled;

                if(disabled){

                    input.value = "";

                }

            }

        });

    });

}

/* ==========================================================
   SAVE SCHEDULE
========================================================== */

const saveScheduleBtn =
document.getElementById("saveScheduleBtn");

if(saveScheduleBtn){

    saveScheduleBtn.addEventListener("click", saveSchedule);

}

async function saveSchedule(){

if (isSavingSchedule) return;
isSavingSchedule = true;

if (saveScheduleBtn) {
    saveScheduleBtn.disabled = true;
}

    /* ==========================
       GET LOGGED IN USER
    ========================== */

    const { data:{ user } } =
    await db.auth.getUser();

    if(!user){

    isSavingSchedule = false;

    if (saveScheduleBtn) {
        saveScheduleBtn.disabled = false;
    }

    return;

}

    /* ==========================
       FORM DATA
    ========================== */

    const schedule={

        user_id:user.id,

        date:
        document.getElementById("scheduleDate").value,

        location:
        document.getElementById("scheduleLocation").value.trim(),

        building:
        document.getElementById("scheduleBuilding").value.trim(),

        engineer:
        document.getElementById("scheduleEngineer").value.trim(),

        gen_con:
        document.getElementById("scheduleGenCon").value.trim(),

        flooring_type:
        document.getElementById("scheduleFlooring").value.trim(),

        schedule_type:
        document.getElementById("scheduleType").value,

        status:
        document.getElementById("scheduleStatus").value,

        time_in:
        document.getElementById("scheduleTimeIn").value,

        time_out:
        document.getElementById("scheduleTimeOut").value,

        notes:
        document.getElementById("scheduleNotes").value.trim()

    };

    /* ==========================
       VALIDATION
    ========================== */

    if(!schedule.date){

    alert("Please select a date.");

    isSavingSchedule = false;

    if(saveScheduleBtn){

        saveScheduleBtn.disabled = false;

    }

    return;

}

    if(!schedule.status){

    alert("Please select a status.");

    isSavingSchedule = false;

    if(saveScheduleBtn){

        saveScheduleBtn.disabled = false;

    }

    return;

}

    if(schedule.status==="Work"){

    if(

        !schedule.location ||
        !schedule.building ||
        !schedule.engineer ||
        !schedule.gen_con ||
        !schedule.flooring_type ||
        !schedule.schedule_type ||
        !schedule.time_in ||
        !schedule.time_out

    ){

        alert("Please complete all required fields.");

        isSavingSchedule = false;

        if(saveScheduleBtn){

            saveScheduleBtn.disabled = false;

        }

        return;

    }

}

/* ==========================
   SAVE / UPDATE
========================== */

let error;

if(window.editingScheduleId){

    const result = await db

        .from("schedules")

        .update(schedule)

        .eq("id", window.editingScheduleId);

    error = result.error;

}else{

    const result = await db

        .from("schedules")

        .insert([schedule]);

    error = result.error;

}

if(error){

    console.error(error);

    alert(error.message);

    isSavingSchedule = false;

    if(saveScheduleBtn){

        saveScheduleBtn.disabled = false;

    }

    return;

}

/* ==========================
   SUCCESS
========================== */

if(window.editingScheduleId){

    alert("Schedule updated successfully!");

}else{

    alert("Schedule saved successfully!");

}

/* Refresh Dashboard */

if(typeof loadDashboardSummary==="function"){

    loadDashboardSummary();

}

if(typeof loadTodaySchedule==="function"){

    loadTodaySchedule();

}

if(typeof loadRecentSchedule==="function"){

    loadRecentSchedule();

}

/* Clear Form */

document.getElementById("scheduleDate").value="";
document.getElementById("scheduleLocation").value="";
document.getElementById("scheduleBuilding").value="";
document.getElementById("scheduleEngineer").value="";
document.getElementById("scheduleGenCon").value="";
document.getElementById("scheduleFlooring").value="";
document.getElementById("scheduleType").value="";
document.getElementById("scheduleStatus").value="";
document.getElementById("scheduleTimeIn").value="";
document.getElementById("scheduleTimeOut").value="";
document.getElementById("scheduleNotes").value="";

document.getElementById("scheduleLocation").disabled=false;
document.getElementById("scheduleBuilding").disabled=false;
document.getElementById("scheduleEngineer").disabled=false;
document.getElementById("scheduleGenCon").disabled=false;
document.getElementById("scheduleFlooring").disabled=false;
document.getElementById("scheduleType").disabled=false;
document.getElementById("scheduleTimeIn").disabled=false;
document.getElementById("scheduleTimeOut").disabled=false;

/* ==========================
   EXIT EDIT MODE
========================== */

const wasEditing = window.editingScheduleId !== null;

window.editingScheduleId = null;

saveScheduleBtn.textContent = "SAVE SCHEDULE";

/* ==========================================================
   BACK TO HISTORY AFTER UPDATE
========================================================== */

if(wasEditing){

    document.querySelectorAll(".page-section").forEach(page=>{

        page.style.display="none";

    });

    document.getElementById("historyPage").style.display="block";

    document.querySelectorAll(".nav-btn").forEach(btn=>{

        btn.classList.remove("active");

    });

    document
    .querySelector('[data-page="historyPage"]')
    .classList.add("active");

}

isSavingSchedule = false;

if(saveScheduleBtn){

    saveScheduleBtn.disabled = false;

}

}
