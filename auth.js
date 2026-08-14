/* ==========================================================
   AUTH
========================================================== */

console.log("auth.js loaded");

/* ==================================================
   LOAD REMEMBERED USERNAME
================================================== */

async function loadRememberedUsername(){

    const rememberDeviceId =
        getRememberDeviceId();


   const {
    data,
    error
} =
    await db
        .rpc(
            "get_remembered_username",
            {
                p_device_id:
                    rememberDeviceId
            }
        );


    if(error){

        console.error(
            "LOAD REMEMBERED USERNAME ERROR:",
            error
        );

        return;

    }


    const usernameInput =
        document.getElementById(
            "loginUsername"
        );


    if(
    usernameInput &&
    data &&
    data.length > 0 &&
    data[0].username
){

    usernameInput.value =
        data[0].username;

}

}


/* ==========================================================
   GLOBAL CURRENT USER
========================================================== */

window.currentUserId = null;


/* ==========================================================
   CLEAR PREVIOUS USER DATA
========================================================== */

function clearPreviousUserData(){

    /* ======================================================
       CURRENT USER
    ====================================================== */

    window.currentUserId = null;


    /* ======================================================
       HISTORY
    ====================================================== */

    if(typeof historyData !== "undefined"){

        historyData = [];

    }


    const historyContainer =
        document.getElementById(
            "historyMobileList"
        );


    if(historyContainer){

        historyContainer.innerHTML = "";

    }


    /* ======================================================
       MONTHLY OVERVIEW
    ====================================================== */

    const monthlyOverview =
        document.getElementById(
            "monthlyOverviewTimeline"
        );


    if(monthlyOverview){

        monthlyOverview.innerHTML = "";

    }


    const overviewMonth =
        document.getElementById(
            "overviewMonth"
        );


    if(overviewMonth){

        overviewMonth.textContent = "";

    }


    /* ======================================================
       RECENT SCHEDULE
    ====================================================== */

    const recentSchedule =
        document.getElementById(
            "recentSchedule"
        );


    if(recentSchedule){

        recentSchedule.innerHTML = "";

    }


    /* ======================================================
       TODAY SCHEDULE
    ====================================================== */

    const todaySchedule =
        document.getElementById(
            "todaySchedule"
        );


    if(todaySchedule){

        todaySchedule.innerHTML = "";

    }


    /* ======================================================
       DASHBOARD SUMMARY
    ====================================================== */

    const totalSchedule =
        document.getElementById(
            "txtTotalSchedule"
        );


    if(totalSchedule){

        totalSchedule.textContent = "0";

    }


    const totalWork =
        document.getElementById(
            "txtWork"
        );


    if(totalWork){

        totalWork.textContent = "0";

    }


    const totalDayOff =
        document.getElementById(
            "txtDayOff"
        );


    if(totalDayOff){

        totalDayOff.textContent = "0";

    }


    const totalHoliday =
        document.getElementById(
            "txtHoliday"
        );


    if(totalHoliday){

        totalHoliday.textContent = "0";

    }


    console.log(
        "Previous user UI cleared."
    );

}


/* ==========================================================
   OPEN APPLICATION
========================================================== */

function openDashboard(){

    const loginPage =
        document.getElementById(
            "loginPage"
        );


    if(loginPage){

    loginPage.style.display =
        "none";

    loginPage.hidden =
        true;

}


    const authApp =
        document.getElementById(
            "authApp"
        );


    if(authApp){

        authApp.style.display =
            "block";

    }


    const app =
        document.getElementById(
            "app"
        );


    if(app){

        app.style.display =
            "block";

    }

}


/* ==========================================================
   SHOW LOGIN PAGE
========================================================== */

function showLoginPage(){

    const app =
        document.getElementById(
            "app"
        );


    if(app){

        app.style.display =
            "none";

    }


    const authApp =
        document.getElementById(
            "authApp"
        );


    if(authApp){

        authApp.style.display =
            "block";

    }


    const loginPage =
        document.getElementById(
            "loginPage"
        );


    if(loginPage){

    loginPage.hidden =
        false;

    loginPage.style.display =
        "flex";

}


/* ==================================================
   LOAD REMEMBERED USERNAME
================================================== */

loadRememberedUsername();


    const registerPage =
        document.getElementById(
            "registerPage"
        );


    if(registerPage){

        registerPage.style.display =
            "none";

    }


    const forgotPage =
        document.getElementById(
            "forgotPage"
        );


    if(forgotPage){
    forgotPage.style.display =
        "none";

}

loadRememberedUsername();

}

/* ==================================================
   REMEMBERED LOGIN DEVICE ID
================================================== */

function getRememberDeviceId(){

    const cookieName =
        "yonaha_remember_device";

    const cookies =
        document.cookie.split(";");


    for(
        const cookie of cookies
    ){

        const [
            name,
            ...valueParts
        ] =
            cookie.trim().split("=");


        if(name === cookieName){

            return decodeURIComponent(
                valueParts.join("=")
            );

        }

    }


    const deviceId =
        crypto.randomUUID();


    document.cookie =
        `${cookieName}=${encodeURIComponent(deviceId)}; path=/; max-age=31536000; SameSite=Lax`;


    return deviceId;

}

/* ==========================================================
   LOGIN
========================================================== */

const loginBtn =
    document.getElementById(
        "loginBtn"
    );

    console.log("LOGIN BUTTON FOUND:", loginBtn);


if(loginBtn){

    loginBtn.addEventListener(
        "click",
        async () => {

            const username =
                document
                    .getElementById(
                        "loginUsername"
                    )
                    .value
                    .trim();


            const password =
                document
                    .getElementById(
                        "loginPassword"
                    )
                    .value;

            const rememberMe =
                document
                    .getElementById(
                        "rememberMe"
                    )
                    .checked;        


            if(!username || !password){

                alert(
                    "Please enter your username and password."
                );

                return;

            }


            /* ==================================================
               CLEAR PREVIOUS USER
            ================================================== */

            clearPreviousUserData();


            /* ==================================================
   FIND USER BY USERNAME
================================================== */

const {
    data: loginEmail,
    error: profileError
} =
    await db
        .rpc(
            "get_login_email",
            {
                p_username:
                    username
            }
        );


if(profileError){

    console.error(
        "PROFILE LOOKUP ERROR:",
        profileError
    );

    alert(
        profileError.message
    );

    return;

}


if(!loginEmail){

    alert(
        "Username not found."
    );

    return;

}


/* ==================================================
   SIGN IN
================================================== */

const {
    data,
    error
} =
    await db.auth.signInWithPassword({

        email:
            loginEmail,

        password:
            password

    });


            if(error){

                console.error(
                    "LOGIN ERROR:",
                    error
                );

                alert(
                    error.message
                );

                return;

            }


            if(
                !data ||
                !data.user
            ){

                alert(
                    "Login failed. Please try again."
                );

                return;

            }

/* ==================================================
               SET CURRENT USER
================================================== */

    window.currentUserId =
    data.user.id;

/* ==================================================
   NEW LOGIN = ALWAYS DASHBOARD
================================================== */

window.isFreshLogin = true;
window.allowPageSave = false;

await db
    .from("profiles")
    .update({
        active_page: "dashboardPage"
    })
    .eq(
        "id",
        data.user.id
    );

/* ==================================================
   REMEMBERED LOGIN DEVICE
================================================== */

const rememberDeviceId =
    getRememberDeviceId();


/* ==================================================
   SAVE REMEMBERED USERNAME
================================================== */

if(rememberMe){

    const {
        error: rememberError
    } =
        await db
            .rpc(
                "save_remembered_username",
                {
                    p_device_id:
                        rememberDeviceId,

                    p_username:
                        username
                }
            );


    if(rememberError){

        console.error(
            "REMEMBER USERNAME ERROR:",
            rememberError
        );

    }

}

            console.log(
    "CURRENT USER:",
    window.currentUserId
);


/* ==================================================
   OPEN APPLICATION AFTER SUCCESSFUL LOGIN
================================================== */

console.log(
    "LOGIN SUCCESS - OPENING DASHBOARD"
);

/* ==================================================
   MARK AS FRESH LOGIN
================================================== */

window.isFreshLogin = true;


/* ==================================================
   OPEN DASHBOARD AFTER LOGIN
================================================== */

openDashboard();

window.allowPageSave = false;

await showPage(
    "dashboardPage"
);

window.allowPageSave = true;

window.isFreshLogin = false;

/* ==================================================
   ALLOW PAGE SAVING AFTER DASHBOARD IS OPEN
================================================== */

window.allowPageSave = true;

/* ==================================================
   LOAD PROFILE IN BACKGROUND
   DO NOT CHANGE CURRENT PAGE
================================================== */

loadProfile()
    .catch(
        error => {

            console.error(
                "BACKGROUND PROFILE ERROR:",
                error

            );

        }
    );

        }
    );

}


/* ==========================================================
   LOGOUT
========================================================== */

const logoutBtn =
    document.getElementById(
        "logoutBtn"
    );


if(logoutBtn){

    logoutBtn.addEventListener(
        "click",
        async (e) => {

            e.preventDefault();

            e.stopPropagation();

/* ==================================================
   CHECK CURRENT SESSION
================================================== */

const {
    data: sessionData,
    error: sessionError
} =
    await db.auth.getSession();


if(sessionError){

    console.error(
        "LOGOUT SESSION ERROR:",
        sessionError
    );

    return;

}


if(!sessionData?.session){

    console.log(
        "NO ACTIVE SESSION - ALREADY LOGGED OUT"
    );

    clearPreviousUserData();

    showLoginPage();

    return;

}


/* ==================================================
   SIGN OUT
================================================== */

const {
    error
} =
    await db.auth.signOut();


            if(error){

                console.error(
                    "LOGOUT ERROR:",
                    error
                );

                return;

            }


            console.log(
                "LOGOUT SUCCESS"
            );


            /* ==================================================
               CLEAR CURRENT USER
            ================================================== */

            clearPreviousUserData();


            /* ==================================================
               CLEAR LOGIN INPUTS
            ================================================== */

            const username =
                document.getElementById(
                    "loginUsername"
                );


            const password =
                document.getElementById(
                    "loginPassword"
                );


            if(username){

                username.value = "";

            }


            if(password){

                password.value = "";

                password.type =
                    "password";

            }


            const togglePassword =
                document.getElementById(
                    "togglePassword"
                );


           if(togglePassword){

    togglePassword.classList.remove(
        "fa-eye-slash"
    );

    togglePassword.classList.add(
        "fa-eye"
    );

}


/* ==================================================
   SHOW LOGIN
================================================== */

showLoginPage();


        }
    );

}

/* ==========================================================
   CHECK EXISTING SESSION
========================================================== */

async function checkSession(){

    /* ======================================================
       GET CURRENT SESSION
    ====================================================== */

    const {
        data,
        error
    } =
        await db.auth.getSession();


    /* ======================================================
       SESSION ERROR
    ====================================================== */

    if(error){

        console.error(
            "CHECK SESSION ERROR:",
            error
        );


        clearPreviousUserData();

        showLoginPage();

        return;

    }


    /* ======================================================
       NO SESSION
    ====================================================== */

    const session =
        data?.session;


    if(!session){

        console.log(
            "NO USER SESSION"
        );


        clearPreviousUserData();

        showLoginPage();

        return;

    }


    /* ======================================================
       CURRENT USER
    ====================================================== */

    const user =
        session.user;


    window.currentUserId =
        user.id;


    console.log(
        "EXISTING USER:",
        window.currentUserId
    );


    /* ======================================================
       CLEAR OLD USER UI
    ====================================================== */

    clearPreviousUserData();


    /* ======================================================
       RESTORE CURRENT USER ID
    ====================================================== */

    window.currentUserId =
        user.id;


/* ======================================================
   OPEN APPLICATION
====================================================== */

if(
    typeof openDashboard === "function"
){

    openDashboard();

}


    /* ======================================================
       DO NOT SAVE PAGE WHILE RESTORING
    ====================================================== */

    window.allowPageSave =
        false;


    /* ======================================================
   LOAD CURRENT USER PROFILE FIRST
   This also loads username, language, currency, etc.
====================================================== */

try{

    await loadProfile();

}
catch(error){

    console.error(
        "SESSION PROFILE ERROR:",
        error
    );

}


/* ======================================================
   RESTORE LAST PAGE ONLY ON REFRESH / EXISTING SESSION
====================================================== */

if(
    window.isFreshLogin === true
){

    /* Fresh login already opened Dashboard */
    window.isFreshLogin = false;

}
else if(
    typeof loadLastPage ===
    "function"
){

    await loadLastPage();

}

}

/* ==========================================================
   LOAD PROFILE
========================================================== */

async function loadProfile(){

    /* ======================================================
       GET CURRENT SESSION
       DO NOT USE getUser()
    ====================================================== */

    const {
        data,
        error: sessionError
    } =
        await db.auth.getSession();


    if(sessionError){

        console.error(
            "LOAD PROFILE SESSION ERROR:",
            sessionError
        );

        return;

    }


    const session =
        data?.session;


    if(!session){

        return;

    }


    const user =
        session.user;


    /* ======================================================
       USER PROTECTION
    ====================================================== */

    if(
        window.currentUserId &&
        window.currentUserId !== user.id
    ){

        console.warn(
            "USER MISMATCH - PROFILE LOAD BLOCKED"
        );

        return;

    }


    window.currentUserId =
        user.id;


    /* ======================================================
       LOAD CURRENT USER PROFILE
    ====================================================== */

    const {
    data: profile,
    error
} =
    await db
        .from("profiles")
        .select("*")
        .eq(
            "id",
            user.id
        )
        .maybeSingle();


    /* ======================================================
       PROFILE DOES NOT EXIST
       CREATE IT
    ====================================================== */

    if(error){

        console.error(
            "LOAD PROFILE ERROR:",
            error
        );

        return;

    }


    if(!profile){

        console.warn(
            "PROFILE NOT FOUND - CREATING PROFILE"
        );


        const {
            data: newProfile,
            error: insertError
        } =
            await db
                .from("profiles")
                .insert({

                    user_id:
                        user.id,

                    full_name:
                        "",

                    username:
                        "",

                    email:
                        user.email || "",

                    position:
                        "",

                    country:
                        "Japan",

                    phone:
                        "",

                    address:
                        "",

                    gender:
                        "",

                    birthday:
                        null,

                    civil_status:
                        "",

                    currency:
                        "JPY"

                })
                .select("*")
                .maybeSingle();


        if(insertError){

            console.error(
                "CREATE PROFILE ERROR:",
                insertError
            );

            return;

        }


        if(newProfile){

            applyProfileToUI(
                newProfile
            );

        }


        return;

    }

/* ======================================================
   SYNC AUTH USER METADATA
   ONLY WHEN SESSION EXISTS
====================================================== */

const {
    data: currentSession
} =
    await db.auth.getSession();


if(currentSession?.session){

    const {
        error: metadataError
    } =
        await db.auth.updateUser({

            data: {

                username:
                    profile.username || "",

                full_name:
                    profile.full_name || ""

            }

        });


    if(metadataError){

        console.error(
            "AUTH METADATA UPDATE ERROR:",
            metadataError
        );

    }

}


    /* ======================================================
       APPLY PROFILE TO UI
    ====================================================== */

    applyProfileToUI(
        profile
    );

}


/* ==========================================================
   APPLY PROFILE TO UI
========================================================== */

function applyProfileToUI(profile){

    if(!profile){

        return;

    }

    console.log(
    "PROFILE LOADED:",
    profile
);


    /* ======================================================
       PROFILE AVATAR
    ====================================================== */

    const profileAvatarImage =
        document.getElementById(
            "profileAvatarImage"
        );


    const profileAvatarPlaceholder =
        document.getElementById(
            "profileAvatarPlaceholder"
        );


    if(
        profileAvatarImage &&
        profile.avatar_url
    ){

        profileAvatarImage.src =
            profile.avatar_url +
            "?t=" +
            Date.now();

        profileAvatarImage.style.display =
            "block";


        if(profileAvatarPlaceholder){

            profileAvatarPlaceholder.style.display =
                "none";

        }

    }
    else{

        if(profileAvatarImage){

            profileAvatarImage.src = "";

            profileAvatarImage.style.display =
                "none";

        }


        if(profileAvatarPlaceholder){

            profileAvatarPlaceholder.style.display =
                "flex";

        }

    }


    /* ======================================================
       PROFILE HEADER
    ====================================================== */

    const profileDisplayName =
        document.getElementById(
            "profileDisplayName"
        );


    if(profileDisplayName){

        profileDisplayName.textContent =
            profile.username ||
            "Administrator";

    }


    const profileDisplayPosition =
        document.getElementById(
            "profileDisplayPosition"
        );


    if(profileDisplayPosition){

        profileDisplayPosition.textContent =
            profile.position ||
            "Project Manager";

    }


    /* ======================================================
       PROFILE INFORMATION
    ====================================================== */

    const profileFields = {

        profileFullNameText:
            profile.full_name,

        profileUsernameText:
            profile.username,

        profilePositionText:
            profile.position,

        profileEmailText:
            profile.email,

        profileCountryText:
            profile.country,

        profilePhoneText:
            profile.phone,

        profileAddressText:
            profile.address,

        profileGenderText:
            profile.gender,

        profileBirthdayText:
            profile.birthday,

        profileCivilStatusText:
            profile.civil_status

    };


    Object.entries(
        profileFields
    ).forEach(
        ([id,value]) => {

            const element =
                document.getElementById(
                    id
                );


            if(element){

                element.textContent =
                    value || "";

            }

        }
    );


    /* ======================================================
       LANGUAGE
    ====================================================== */

    const language =
    profile.language === "jp"
        ? "jp"
        : "en";


    window.currentLanguage =
    language;

    window.currentUsername =
    profile.username || "";


    const currentLanguage =
        document.getElementById(
            "currentLanguage"
        );


    if(currentLanguage){

        currentLanguage.textContent =
            language === "jp"
                ? "Japanese"
                : "English";

    }


    if(
    typeof applyLanguage ===
    "function" &&
    window.currentUserId
){

    applyLanguage(
        language
    );

}


    /* ======================================================
       CURRENCY
    ====================================================== */

    const currencyData = {

        PHP:{
            code:"PHP",
            symbol:"₱",
            name:"Philippine Peso"
        },

        JPY:{
            code:"JPY",
            symbol:"¥",
            name:"Japanese Yen"
        },

        USD:{
            code:"USD",
            symbol:"$",
            name:"US Dollar"
        }

    };


    const currency =
        currencyData[
            profile.currency
        ]
        ||
        currencyData.JPY;


    window.currentCurrency =
        currency.code;


    window.currentCurrencySymbol =
        currency.symbol;


    window.currentCurrencyName =
        currency.name;


    const selectedCurrencyText =
        document.getElementById(
            "selectedCurrencyText"
        );


    if(selectedCurrencyText){

        selectedCurrencyText.textContent =
            currency.symbol +
            " " +
            currency.code;

    }


    /* ======================================================
       GREETING
       USE CURRENT USER ID / PROFILE
       NO AUTH REQUEST
    ====================================================== */

    const greeting =
        document.getElementById(
            "dashboardGreeting"
        );


    if(
        greeting &&
        profile.username
    ){

        const hour =
            new Date().getHours();


        let greetingText;


        if(hour >= 5 && hour < 12){

            greetingText =
                language === "jp"
                    ? "おはようございます"
                    : "Good Morning";

        }
        else if(hour >= 12 && hour < 18){

            greetingText =
                language === "jp"
                    ? "こんにちは"
                    : "Good Afternoon";

        }
        else{

            greetingText =
                language === "jp"
                    ? "こんばんは"
                    : "Good Evening";

        }


        greeting.textContent =
            `${greetingText}, ${profile.username} 👋`;

    }

}

 /* ==========================================================
   PROFILE AVATAR
========================================================== */

window.openAvatarUpload = function(){

    const input =
        document.getElementById(
            "profileAvatarInput"
        );

    if(input){

        input.click();

    }

};


window.handleAvatarUpload = async function(event){

    const file =
        event.target.files?.[0];


    if(!file){

        return;

    }


    /* ======================================================
       CHECK FILE TYPE
    ====================================================== */

    const allowedTypes = [
        "image/jpeg",
        "image/png",
        "image/webp"
    ];


    if(
        !allowedTypes.includes(
            file.type
        )
    ){

        alert(
            "Please select a JPG, PNG, or WebP image."
        );

        event.target.value = "";

        return;

    }


    /* ======================================================
       CHECK FILE SIZE
    ====================================================== */

    if(file.size > 5 * 1024 * 1024){

        alert(
            "Avatar image must be 5 MB or smaller."
        );

        event.target.value = "";

        return;

    }


    /* ======================================================
       INSTANT PREVIEW
    ====================================================== */

    const image =
        document.getElementById(
            "profileAvatarImage"
        );


    const placeholder =
        document.getElementById(
            "profileAvatarPlaceholder"
        );


    const previewUrl =
        URL.createObjectURL(file);


    if(image){

        image.src =
            previewUrl;

        image.style.display =
            "block";

    }


    if(placeholder){

        placeholder.style.display =
            "none";

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

        URL.revokeObjectURL(
            previewUrl
        );

        return;

    }


    /* ======================================================
       GET CURRENT USER
    ====================================================== */

    let user;


    try{

        const result =
            await db.auth.getUser();


        if(
            result.error ||
            !result.data ||
            !result.data.user
        ){

            alert(
                "Please log in again."
            );

            return;

        }


        user =
            result.data.user;


    }catch(error){

        console.error(
            "Avatar user error:",
            error
        );

        alert(
            "Unable to get current user."
        );

        return;

    }


    /* ======================================================
       FILE PATH
    ====================================================== */

    const extension =
        file.name
            .split(".")
            .pop()
            .toLowerCase();


    const filePath =
        `${user.id}/avatar.${extension}`;


    try{

        /* ==================================================
           REMOVE OLD AVATAR FILES
        ================================================== */

        const oldFiles =
            await db.storage
                .from("avatars")
                .list(
                    user.id
                );


        if(
            !oldFiles.error &&
            oldFiles.data?.length
        ){

            const filesToRemove =
                oldFiles.data.map(
                    oldFile =>
                        `${user.id}/${oldFile.name}`
                );


            await db.storage
                .from("avatars")
                .remove(
                    filesToRemove
                );

        }


        /* ==================================================
           UPLOAD
        ================================================== */

        const uploadResult =
            await db.storage
                .from("avatars")
                .upload(
                    filePath,
                    file,
                    {
                        upsert:true,
                        contentType:file.type
                    }
                );


        if(uploadResult.error){

            console.error(
                "Avatar upload error:",
                uploadResult.error
            );

            alert(
                "Unable to save profile photo."
            );

            return;

        }


        /* ==================================================
           PUBLIC URL
        ================================================== */

        const publicResult =
            db.storage
                .from("avatars")
                .getPublicUrl(
                    filePath
                );


        const avatarUrl =
            publicResult.data?.publicUrl;


        if(!avatarUrl){

            alert(
                "Unable to create avatar URL."
            );

            return;

        }


        /* ==================================================
           SAVE PROFILE URL
        ================================================== */

        const updateResult =
            await db
                .from("profiles")
                .update({
                    avatar_url:
                        avatarUrl
                })
                .eq(
                    "id",
                    user.id
                );


        if(updateResult.error){

            console.error(
                "Avatar profile update error:",
                updateResult.error
            );

            alert(
                "Photo previewed, but could not be saved."
            );

            return;

        }


        /* ==================================================
           KEEP CACHE-BUSTED URL
        ================================================== */

        if(image){

            image.src =
                avatarUrl +
                "?t=" +
                Date.now();

        }


        console.log(
            "Profile avatar updated."
        );


    }catch(error){

        console.error(
            "Avatar upload exception:",
            error
        );

        alert(
            "An error occurred while saving the avatar."
        );

    }finally{

        URL.revokeObjectURL(
            previewUrl
        );

        event.target.value = "";

    }

};

/* ==========================================================
   LOAD LAST ACTIVE PAGE
   RESTORE CURRENT USER'S LAST PAGE
========================================================== */

async function loadLastPage(){

    /* ======================================================
       GET CURRENT SESSION
    ====================================================== */

    const {
        data,
        error: sessionError
    } =
        await db.auth.getSession();


    if(sessionError){

        console.error(
            "LOAD LAST PAGE SESSION ERROR:",
            sessionError
        );

        return;

    }


    const session =
        data?.session;


    if(!session){

        return;

    }


    const user =
        session.user;


    /* ======================================================
       USER PROTECTION
    ====================================================== */

    if(
        window.currentUserId &&
        window.currentUserId !== user.id
    ){

        console.warn(
            "USER MISMATCH - LAST PAGE LOAD BLOCKED"
        );

        return;

    }


    window.currentUserId =
        user.id;


    /* ======================================================
       LOAD ACTIVE PAGE
       profiles.id = auth.users.id
    ====================================================== */

    const {
        data: profile,
        error
    } =
        await db
            .from("profiles")
            .select("active_page")
            .eq(
                "id",
                user.id
            )
            .maybeSingle();


    if(error){

        console.error(
            "LOAD LAST PAGE ERROR:",
            error
        );

        return;

    }


    /* ======================================================
   VALID PAGES
====================================================== */

const validPages = [

    "dashboardPage",
    "schedulePage",
    "historyPage",
    "salaryPage",
    "reportsPage",
    "pdfReportsPage",
    "exportMonthlyPage",
    "importDataPage",
    "profilePage",
    "settingsPage",
    "changePasswordPage"

];


/* ======================================================
   GET SAVED PAGE
====================================================== */

const savedPage =
    profile?.active_page;


const page =
    validPages.includes(savedPage)
        ? savedPage
        : "dashboardPage";


console.log(
    "RESTORING LAST PAGE:",
    page
);


/* ======================================================
   DO NOT SAVE WHILE RESTORING
====================================================== */

window.allowPageSave =
    false;


/* ======================================================
   SHOW LAST PAGE
====================================================== */

if(
    typeof showPage ===
    "function"
){

    await showPage(
        page
    );

}

}


/* ==========================================================
   START APP
========================================================== */

document.addEventListener(
    "DOMContentLoaded",
    () => {

        checkSession();

    }
);