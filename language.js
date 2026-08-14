/* ==========================================================
   LANGUAGE SYSTEM
========================================================== */

function applyLanguage(lang){

    window.currentLanguage = lang;


    /* ==========================================================
       SAFE HELPERS
    ========================================================== */

    function setText(id, text){

        const element = document.getElementById(id);

        if(element){
            element.textContent = text;
        }

    }


    function setPlaceholder(id, text){

        const element = document.getElementById(id);

        if(element){
            element.placeholder = text;
        }

    }


    function setOption(selectId, value, text){

        const select = document.getElementById(selectId);

        if(!select){
            return;
        }

        const option = Array.from(select.options).find(
            option => option.value === value
        );

        if(option){
            option.textContent = text;
        }

    }


    function setFirstOption(selectId, text){

        const select = document.getElementById(selectId);

        if(select && select.options.length > 0){
            select.options[0].textContent = text;
        }

    }


    /* ==========================================================
       TRANSLATE ADVANCE HISTORY FILTERS
    ========================================================== */

    function translateAdvanceHistoryFilters(){

        const monthFilter =
            document.getElementById("advanceMonthFilter");

        const yearFilter =
            document.getElementById("advanceYearFilter");


        if(monthFilter){

            const japaneseMonths = [
                "すべての月",
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

            const englishMonths = [
                "All Months",
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


            Array.from(monthFilter.options).forEach(
                (option, index) => {

                    if(lang === "jp"){

                        if(japaneseMonths[index] !== undefined){

                            option.textContent =
                                japaneseMonths[index];

                        }

                    }else{

                        if(englishMonths[index] !== undefined){

                            option.textContent =
                                englishMonths[index];

                        }

                    }

                }
            );

        }


        if(yearFilter){

            const firstOption =
                yearFilter.options[0];

            if(firstOption){

                firstOption.textContent =
                    lang === "jp"
                        ? "すべての年"
                        : "All Years";

            }

        }

    }


    /* ==========================================================
       TRANSLATE DATE TEXT
    ========================================================== */

    function translateDateText(text){

        if(!text){
            return text;
        }


        if(lang !== "jp"){
            return text;
        }


        const months = {

            January: "1月",
            February: "2月",
            March: "3月",
            April: "4月",
            May: "5月",
            June: "6月",
            July: "7月",
            August: "8月",
            September: "9月",
            October: "10月",
            November: "11月",
            December: "12月"

        };


        let result = text;


        Object.keys(months).forEach(
            month => {

                result =
                    result.replace(
                        new RegExp(month, "g"),
                        months[month]
                    );

            }
        );


        return result;

    }


    /* ==========================================================
       TRANSLATE DYNAMIC DATES
    ========================================================== */

    function translateDynamicDates(){

        if(lang !== "jp"){
            return;
        }


        const dateSelectors = [

            "#workLogsList .date",
            "#workLogsList .work-date",
            "#workLogsList .log-date",

            "#salaryLogsList .date",
            "#salaryLogsList .work-date",
            "#salaryLogsList .log-date",

            "#advanceHistoryList .date",
            "#advanceHistoryList .advance-date",
            "#advanceHistoryList .log-date",

            ".work-log-card .date",
            ".work-log-card .work-date",

            ".advance-history-card .date",
            ".advance-history-card .advance-date"

        ];


        document.querySelectorAll(
            dateSelectors.join(",")
        ).forEach(
            element => {

                element.textContent =
                    translateDateText(
                        element.textContent
                    );

            }
        );

    }


    document.title = "YONAHA INTERIOR";


    /* ==========================================================
       PROFILE
    ========================================================== */

    const profileTitle =
        document.querySelector(".profile-title");


    if(lang === "jp"){

        if(profileTitle){
            profileTitle.textContent =
                "プロフィール";
        }


        setText(
            "languageText",
            "🌐 言語"
        );


        const personalInfoCard =
            document.getElementById(
                "personalInfoCard"
            );

        if(
            personalInfoCard &&
            personalInfoCard.children[0]
        ){

            personalInfoCard.children[0].textContent =
                "👤 個人情報";

        }


        const languageCard =
            document.getElementById(
                "languageCard"
            );

        if(
            languageCard &&
            languageCard.children[0]
        ){

            languageCard.children[0].textContent =
                "🌐 言語";

        }


        const currencyCard =
            document.getElementById(
                "currencyCard"
            );

        if(
            currencyCard &&
            currencyCard.children[0]
        ){

            currencyCard.children[0].textContent =
                "💴 通貨";

        }


        const exportCard =
            document.getElementById(
                "exportCard"
            );

        if(
            exportCard &&
            exportCard.children[0]
        ){

            exportCard.children[0].textContent =
                "📤 データをエクスポート";

        }

/* ======================================================
   IMPORT MONTHLY DATA - JAPANESE
====================================================== */

const importCard =
    document.getElementById(
        "importDataCard"
    );

if(
    importCard &&
    importCard.children[0]
){

    importCard.children[0].textContent =
        "📥 データをインポート";

}

/* ======================================================
   PDF REPORTS - JAPANESE
====================================================== */

const pdfReportsCard =
    document.getElementById(
        "pdfReportsCard"
    );

if(
    pdfReportsCard &&
    pdfReportsCard.children[0]
){

    pdfReportsCard.children[0].textContent =
        "📄 PDFレポート";

}

/* ======================================================
   CHANGE PASSWORD - JAPANESE
====================================================== */

const changePasswordCard =
    document.getElementById(
        "changePasswordCard"
    );

if(
    changePasswordCard &&
    changePasswordCard.children[0]
){

    changePasswordCard.children[0].textContent =
        "🔒 パスワード変更";

}


/* ======================================================
   LOGOUT - JAPANESE
====================================================== */

const logoutBtn =
    document.getElementById(
        "logoutBtn"
    );

if(
    logoutBtn &&
    logoutBtn.children[0]
){

    logoutBtn.children[0].textContent =
        "🚪 ログアウト";

}

        /* ======================================================
           PERSONAL INFORMATION - JAPANESE
        ====================================================== */

        setText(
            "personalInfoTitle",
            "個人情報"
        );


        setText(
            "editInfoBtn",
            "編集"
        );

        setText(
            "personalDisplayPosition",
            "プロジェクトマネージャー"
        );

        /* ======================================================
           PERSONAL INFORMATION LABELS
        ====================================================== */

        setText(
            "profileFullNameLabel",
            "氏名"
        );

        setText(
            "profileUsernameLabel",
            "ユーザー名"
        );


        setText(
            "profilePositionLabel",
            "役職"
        );

        setText(
            "profileEmailLabel",
            "メールアドレス"
        );

        setText(
            "profileCountryLabel",
            "国"
        );

        setText(
            "profilePhoneLabel",
            "電話番号"
        );

        setText(
            "profileAddressLabel",
            "住所"
        );

        setText(
            "profileGenderLabel",
            "性別"
        );

        setText(
            "profileBirthdayLabel",
            "生年月日"
        );

        setText(
            "profileCivilStatusLabel",
            "婚姻状況"
        );

        /* ======================================================
           COUNTRY OPTIONS - JAPANESE
        ====================================================== */

        setOption(
            "profileCountryInput",
            "Japan",
            "🇯🇵 日本"
        );

        setOption(
            "profileCountryInput",
            "Philippines",
            "🇵🇭 フィリピン"
        );

        setOption(
            "profileCountryInput",
            "United States",
            "🇺🇸 アメリカ合衆国"
        );

        /* ======================================================
           GENDER OPTIONS - JAPANESE
        ====================================================== */

        setText(
            "genderMaleOption",
            "男性"
        );

        setText(
            "genderFemaleOption",
            "女性"
        );

        /* ======================================================
           CIVIL STATUS OPTIONS - JAPANESE
        ====================================================== */

        setText(
            "civilSingleOption",
            "未婚"
        );

        setText(
            "civilMarriedOption",
            "既婚"
        );

        setText(
            "civilWidowedOption",
            "死別"
        );

        setText(
            "civilSeparatedOption",
            "別居"
        );

/* ==========================================================
   PDF REPORTS PAGE - JAPANESE
========================================================== */

const pdfReportsTitleJP =
    document.querySelector(
        "#pdfReportsPage .pdf-reports-header .profile-title"
    );

if(pdfReportsTitleJP){

    pdfReportsTitleJP.textContent =
        "PDFレポート";

}


const pdfReportSearchJP =
    document.getElementById(
        "pdfReportSearch"
    );

if(pdfReportSearchJP){

    pdfReportSearchJP.placeholder =
        "月または年を検索...";

}


const pdfReportMonthJP =
    document.getElementById(
        "pdfReportMonth"
    );

if(pdfReportMonthJP){

    const pdfReportMonthsJapanese = [

        "すべての月",
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

    Array.from(
        pdfReportMonthJP.options
    ).forEach(
        (option, index) => {

            if(
                pdfReportMonthsJapanese[index] !== undefined
            ){

                option.textContent =
                    pdfReportMonthsJapanese[index];

            }

        }
    );

}


const pdfReportEmptyJP =
    document.querySelector(
        "#pdfReportsEmpty p"
    );

if(pdfReportEmptyJP){

    pdfReportEmptyJP.textContent =
        "PDFレポートが見つかりません。";

}


/* ==========================================================
   EXPORT MONTHLY PAGE - JAPANESE
========================================================== */

const exportMonthlyPageTitleJP =
    document.querySelector(
        "#exportMonthlyPage .profile-title"
    );

if(exportMonthlyPageTitleJP){

    exportMonthlyPageTitleJP.textContent =
        "月次データをエクスポート";

}


/* ==========================================================
   EXPORT MONTHLY CARDS - JAPANESE
========================================================== */

const exportMonthlyCardsJP =
    document.querySelectorAll(
        "#exportMonthlyPage .export-page-card"
    );


if(exportMonthlyCardsJP.length >= 3){

    /* ------------------------------------------------------
       SCHEDULE HISTORY
    ------------------------------------------------------ */

    const scheduleExportTitleJP =
        exportMonthlyCardsJP[0].querySelector("strong");

    if(scheduleExportTitleJP){

        scheduleExportTitleJP.textContent =
            "スケジュール履歴";

    }


    const scheduleExportDescriptionJP =
        exportMonthlyCardsJP[0].querySelector("span");

    if(scheduleExportDescriptionJP){

        scheduleExportDescriptionJP.textContent =
            "スケジュール記録をエクスポート";

    }


    /* ------------------------------------------------------
       SALARY WORK LOGS
    ------------------------------------------------------ */

    const salaryExportTitleJP =
        exportMonthlyCardsJP[1].querySelector("strong");

    if(salaryExportTitleJP){

        salaryExportTitleJP.textContent =
            "給与作業記録";

    }


    const salaryExportDescriptionJP =
        exportMonthlyCardsJP[1].querySelector("span");

    if(salaryExportDescriptionJP){

        salaryExportDescriptionJP.textContent =
            "給与作業記録をエクスポート";

    }


    /* ------------------------------------------------------
       SALARY ADVANCE HISTORY
    ------------------------------------------------------ */

    const advanceExportTitleJP =
        exportMonthlyCardsJP[2].querySelector("strong");

    if(advanceExportTitleJP){

        advanceExportTitleJP.textContent =
            "給与前払い履歴";

    }


    const advanceExportDescriptionJP =
        exportMonthlyCardsJP[2].querySelector("span");

    if(advanceExportDescriptionJP){

        advanceExportDescriptionJP.textContent =
            "給与前払い記録をエクスポート";

    }

}

/* ==========================================================
   EXPORT BUTTONS - JAPANESE
========================================================== */

document.querySelectorAll(
    "#exportMonthlyPage .export-action-btn"
).forEach(
    button => {

        button.textContent =
            "エクスポート";

    }
);


/* ==========================================================
   EXPORT MONTH FILTERS - JAPANESE
========================================================== */

const exportMonthlyMonthIdsJP = [

    "pageScheduleExportMonth",
    "pageSalaryExportMonth",
    "pageAdvanceExportMonth"

];


const exportMonthlyMonthsJapanese = [

    "すべての月",
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


exportMonthlyMonthIdsJP.forEach(
    id => {

        const select =
            document.getElementById(id);


        if(!select){

            return;

        }


        Array.from(
            select.options
        ).forEach(
            (option, index) => {

                if(
                    exportMonthlyMonthsJapanese[index] !== undefined
                ){

                    option.textContent =
                        exportMonthlyMonthsJapanese[index];

                }

            }
        );

    }
);


/* ==========================================================
   EXPORT YEAR FILTERS - JAPANESE
========================================================== */

const exportMonthlyYearIdsJP = [

    "pageScheduleExportYear",
    "pageSalaryExportYear",
    "pageAdvanceExportYear"

];


exportMonthlyYearIdsJP.forEach(
    id => {

        const select =
            document.getElementById(id);


        if(
            select &&
            select.options.length > 0
        ){

            select.options[0].textContent =
                "すべての年";

        }

    }
);


/* ==========================================================
   IMPORT DATA PAGE - JAPANESE
========================================================== */

const importDataPageTitleJP =
    document.querySelector(
        "#importDataPage .profile-title"
    );

if(importDataPageTitleJP){

    importDataPageTitleJP.textContent =
        "データをインポート";

}


/* ==========================================================
   IMPORT DATA CARDS - JAPANESE
========================================================== */

const importDataCardsJP =
    document.querySelectorAll(
        "#importDataPage .import-page-card"
    );


if(importDataCardsJP.length >= 3){

    /* ------------------------------------------------------
       SCHEDULE HISTORY
    ------------------------------------------------------ */

    const scheduleImportTitleJP =
        importDataCardsJP[0].querySelector("strong");

    if(scheduleImportTitleJP){

        scheduleImportTitleJP.textContent =
            "スケジュール履歴";

    }


    const scheduleImportDescriptionJP =
        importDataCardsJP[0].querySelector("span");

    if(scheduleImportDescriptionJP){

        scheduleImportDescriptionJP.textContent =
            "スケジュール記録をインポート";

    }


    /* ------------------------------------------------------
       SALARY WORK LOGS
    ------------------------------------------------------ */

    const salaryImportTitleJP =
        importDataCardsJP[1].querySelector("strong");

    if(salaryImportTitleJP){

        salaryImportTitleJP.textContent =
            "給与作業記録";

    }


    const salaryImportDescriptionJP =
        importDataCardsJP[1].querySelector("span");

    if(salaryImportDescriptionJP){

        salaryImportDescriptionJP.textContent =
            "給与作業記録をインポート";

    }


    /* ------------------------------------------------------
       SALARY ADVANCE HISTORY
    ------------------------------------------------------ */

    const advanceImportTitleJP =
        importDataCardsJP[2].querySelector("strong");

    if(advanceImportTitleJP){

        advanceImportTitleJP.textContent =
            "給与前払い履歴";

    }


    const advanceImportDescriptionJP =
        importDataCardsJP[2].querySelector("span");

    if(advanceImportDescriptionJP){

        advanceImportDescriptionJP.textContent =
            "給与前払い記録をインポート";

    }

}


/* ==========================================================
   IMPORT BUTTONS - JAPANESE
========================================================== */

document.querySelectorAll(
    "#importDataPage .import-action-btn"
).forEach(
    button => {

        button.textContent =
            "インポート";

    }
);

/* ======================================================
   CHANGE PASSWORD PAGE - JAPANESE
====================================================== */

const changePasswordPage =
    document.getElementById(
        "changePasswordPage"
    );

if(changePasswordPage){

    /* ==================================================
       PAGE HEADER
    ================================================== */

    const changePasswordHeader =
        changePasswordPage.querySelector(
            ".change-password-header h2"
        );

    if(changePasswordHeader){

        changePasswordHeader.textContent =
            "🔐 パスワード変更";

    }


    /* ==================================================
       TITLE
    ================================================== */

    const changePasswordTitle =
        changePasswordPage.querySelector(
            ".change-password-title"
        );

    if(changePasswordTitle){

        changePasswordTitle.textContent =
            "パスワード変更";

    }


    /* ==================================================
       SUBTITLE
    ================================================== */

    const changePasswordSubtitle =
        changePasswordPage.querySelector(
            ".change-password-subtitle"
        );

    if(changePasswordSubtitle){

        changePasswordSubtitle.textContent =
            "アカウントのパスワードを安全に更新します。";

    }


    /* ==================================================
       CURRENT PASSWORD
    ================================================== */

    const currentPasswordLabel =
        changePasswordPage.querySelector(
            'label[for="currentPassword"]'
        );

    if(currentPasswordLabel){

        currentPasswordLabel.textContent =
            "現在のパスワード";

    }


    setPlaceholder(
        "currentPassword",
        "現在のパスワードを入力"
    );


    /* ==================================================
       NEW PASSWORD
    ================================================== */

    const newPasswordLabel =
        changePasswordPage.querySelector(
            'label[for="newPassword"]'
        );

    if(newPasswordLabel){

        newPasswordLabel.textContent =
            "新しいパスワード";

    }


    setPlaceholder(
        "newPassword",
        "新しいパスワードを入力"
    );


    /* ==================================================
       CONFIRM NEW PASSWORD
    ================================================== */

    const confirmNewPasswordLabel =
        changePasswordPage.querySelector(
            'label[for="confirmNewPassword"]'
        );

    if(confirmNewPasswordLabel){

        confirmNewPasswordLabel.textContent =
            "新しいパスワードを確認";

    }


    setPlaceholder(
        "confirmNewPassword",
        "新しいパスワードを再入力"
    );


    /* ==================================================
       CANCEL BUTTON
    ================================================== */

    const changePasswordCancel =
        changePasswordPage.querySelector(
            ".change-password-cancel"
        );

    if(changePasswordCancel){

        changePasswordCancel.textContent =
            "キャンセル";

    }


    /* ==================================================
       UPDATE PASSWORD BUTTON
    ================================================== */

    setText(
        "updatePasswordBtn",
        "パスワードを更新"
    );

}

    }else{


    /* ======================================================
       PROFILE - ENGLISH
    ====================================================== */

    if(profileTitle){

        profileTitle.textContent =
            "My Profile";

    }


    /* ======================================================
       LANGUAGE CARD - ENGLISH
    ====================================================== */

    setText(
        "languageText",
        "🌐 Language"
    );


    /* ======================================================
       PERSONAL INFORMATION CARD - ENGLISH
    ====================================================== */

    const personalInfoCard =
        document.getElementById(
            "personalInfoCard"
        );

    if(
        personalInfoCard &&
        personalInfoCard.children[0]
    ){

        personalInfoCard.children[0].textContent =
            "👤 Personal Information";

    }


    /* ======================================================
       LANGUAGE CARD - ENGLISH
    ====================================================== */

    const languageCard =
        document.getElementById(
            "languageCard"
        );

    if(
        languageCard &&
        languageCard.children[0]
    ){

        languageCard.children[0].textContent =
            "🌐 Language";

    }


    /* ======================================================
       CURRENCY CARD - ENGLISH
    ====================================================== */

    const currencyCard =
        document.getElementById(
            "currencyCard"
        );

    if(
        currencyCard &&
        currencyCard.children[0]
    ){

        currencyCard.children[0].textContent =
            "💴 Currency";

    }


    /* ======================================================
       EXPORT MONTHLY DATA CARD - ENGLISH
    ====================================================== */

    const exportCard =
        document.getElementById(
            "exportCard"
        );

    if(
        exportCard &&
        exportCard.children[0]
    ){

        exportCard.children[0].textContent =
            "📤 Export Monthly Data";

    }


    /* ======================================================
       EXPORT MONTHLY PAGE - ENGLISH
    ====================================================== */

    const exportMonthlyTitle =
        document.querySelector(
            "#exportMonthlyPage .profile-title"
        );

    if(exportMonthlyTitle){

        exportMonthlyTitle.textContent =
            "Export Monthly Data";

    }


    /* ======================================================
       EXPORT MONTHLY PAGE - ENGLISH
       MONTH FILTERS
    ====================================================== */

    const exportMonthsEN = [

        "All Month",
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


    const exportMonthIds = [

        "pageScheduleExportMonth",
        "pageSalaryExportMonth",
        "pageAdvanceExportMonth"

    ];


    exportMonthIds.forEach(
        id => {

            const select =
                document.getElementById(id);


            if(select){

                Array.from(
                    select.options
                ).forEach(
                    (option,index) => {

                        if(
                            exportMonthsEN[index] !== undefined
                        ){

                            option.textContent =
                                exportMonthsEN[index];

                        }

                    }
                );

            }

        }
    );

    /* ======================================================
       EXPORT MONTHLY PAGE - ENGLISH
       YEAR FILTERS
    ====================================================== */

    const exportYearIds = [

        "pageScheduleExportYear",
        "pageSalaryExportYear",
        "pageAdvanceExportYear"

    ];

    exportYearIds.forEach(
        id => {

            const select =
                document.getElementById(id);

            if(
                select &&
                select.options.length > 0
            ){

                select.options[0].textContent =
                    "All Year";

            }

        }
    );

/* ======================================================
       EXPORT MONTHLY PAGE - ENGLISH
       EXPORT BUTTONS
====================================================== */

    document.querySelectorAll(
        "#exportMonthlyPage .export-action-btn"
    ).forEach(
        button => {

            button.textContent =
                "Export";

        }
    );


/* ======================================================
       IMPORT MONTHLY DATA CARD - ENGLISH
 ====================================================== */

    const importCard =
        document.getElementById(
            "importDataCard"
        );


    if(
        importCard &&
        importCard.children[0]
    ){

        importCard.children[0].textContent =
            "📥 Import Monthly Data";

    }

    /* ======================================================
   IMPORT DATA PAGE - ENGLISH
====================================================== */

const importDataPageTitleEN =
    document.querySelector(
        "#importDataPage .profile-title"
    );

if(importDataPageTitleEN){

    importDataPageTitleEN.textContent =
        "Import Data";

}


/* ======================================================
   IMPORT DATA CARDS - ENGLISH
====================================================== */

const importDataCardsEN =
    document.querySelectorAll(
        "#importDataPage .import-page-card"
    );

if(importDataCardsEN.length >= 3){

    /* --------------------------------------------------
       SCHEDULE HISTORY
    -------------------------------------------------- */

    const scheduleImportTitleEN =
        importDataCardsEN[0].querySelector("strong");

    if(scheduleImportTitleEN){

        scheduleImportTitleEN.textContent =
            "Schedule History";

    }


    const scheduleImportDescriptionEN =
        importDataCardsEN[0].querySelector("span");

    if(scheduleImportDescriptionEN){

        scheduleImportDescriptionEN.textContent =
            "Import schedule records";

    }


    /* --------------------------------------------------
       SALARY WORK LOGS
    -------------------------------------------------- */

    const salaryImportTitleEN =
        importDataCardsEN[1].querySelector("strong");

    if(salaryImportTitleEN){

        salaryImportTitleEN.textContent =
            "Salary Work Logs";

    }


    const salaryImportDescriptionEN =
        importDataCardsEN[1].querySelector("span");

    if(salaryImportDescriptionEN){

        salaryImportDescriptionEN.textContent =
            "Import salary work records";

    }


    /* --------------------------------------------------
       SALARY ADVANCE HISTORY
    -------------------------------------------------- */

    const advanceImportTitleEN =
        importDataCardsEN[2].querySelector("strong");

    if(advanceImportTitleEN){

        advanceImportTitleEN.textContent =
            "Salary Advance History";

    }


    const advanceImportDescriptionEN =
        importDataCardsEN[2].querySelector("span");

    if(advanceImportDescriptionEN){

        advanceImportDescriptionEN.textContent =
            "Import salary advance records";

    }

}


/* ======================================================
   IMPORT BUTTONS - ENGLISH
====================================================== */

document.querySelectorAll(
    "#importDataPage .import-action-btn"
).forEach(
    button => {

        button.textContent =
            "Import";

    }
);

/* ======================================================
       PDF REPORTS CARD - ENGLISH
====================================================== */

    const pdfReportsCard =
        document.getElementById(
            "pdfReportsCard"
        );

    if(
        pdfReportsCard &&
        pdfReportsCard.children[0]
    ){

        pdfReportsCard.children[0].textContent =
            "📄 PDF Reports";

    }

/* ======================================================
       CHANGE PASSWORD CARD - ENGLISH
====================================================== */

    const changePasswordCard =
        document.getElementById(
            "changePasswordCard"
        );

    if(
        changePasswordCard &&
        changePasswordCard.children[0]
    ){

        changePasswordCard.children[0].textContent =
            "🔒 Change Password";

    }

/* ======================================================
   CHANGE PASSWORD PAGE - ENGLISH
====================================================== */

const changePasswordPage =
    document.getElementById(
        "changePasswordPage"
    );

if(changePasswordPage){

/* ==================================================
       PAGE HEADER
================================================== */

    const changePasswordHeader =
        changePasswordPage.querySelector(
            ".change-password-header h2"
        );

    if(changePasswordHeader){

        changePasswordHeader.textContent =
            "🔐 Change Password";

    }

    /* ==================================================
       PAGE TITLE
    ================================================== */

    const changePasswordTitle =
        changePasswordPage.querySelector(
            ".change-password-title"
        );

    if(changePasswordTitle){

        changePasswordTitle.textContent =
            "Change Password";

    }

    /* ==================================================
       PAGE SUBTITLE
    ================================================== */

    const changePasswordSubtitle =
        changePasswordPage.querySelector(
            ".change-password-subtitle"
        );

    if(changePasswordSubtitle){

        changePasswordSubtitle.textContent =
            "Update your account password securely.";

    }

    /* ==================================================
       CURRENT PASSWORD
    ================================================== */

    const currentPasswordLabel =
        changePasswordPage.querySelector(
            'label[for="currentPassword"]'
        );

    if(currentPasswordLabel){

        currentPasswordLabel.textContent =
            "Current Password";

    }

    setPlaceholder(
        "currentPassword",
        "Enter current password"
    );

    /* ==================================================
       NEW PASSWORD
    ================================================== */

    const newPasswordLabel =
        changePasswordPage.querySelector(
            'label[for="newPassword"]'
        );

    if(newPasswordLabel){

        newPasswordLabel.textContent =
            "New Password";

    }

    setPlaceholder(
        "newPassword",
        "Enter new password"
    );

    /* ==================================================
       CONFIRM NEW PASSWORD
    ================================================== */

    const confirmNewPasswordLabel =
        changePasswordPage.querySelector(
            'label[for="confirmNewPassword"]'
        );

    if(confirmNewPasswordLabel){

        confirmNewPasswordLabel.textContent =
            "Confirm New Password";

    }

    setPlaceholder(
        "confirmNewPassword",
        "Confirm new password"
    );

    /* ==================================================
       CANCEL BUTTON
    ================================================== */

    const changePasswordCancel =
        changePasswordPage.querySelector(
            ".change-password-cancel"
        );

    if(changePasswordCancel){

        changePasswordCancel.textContent =
            "Cancel";

    }

    /* ==================================================
       UPDATE PASSWORD BUTTON
    ================================================== */

    setText(
        "updatePasswordBtn",
        "Update Password"
    );

}

    /* ======================================================
       LOGOUT BUTTON - ENGLISH
    ====================================================== */

    const logoutBtn =
        document.getElementById(
            "logoutBtn"
        );


    if(
        logoutBtn &&
        logoutBtn.children[0]
    ){

        logoutBtn.children[0].textContent =
            "🚪 Logout";

    }

        /* ======================================================
           PERSONAL INFORMATION - ENGLISH
        ====================================================== */

        setText(
            "personalInfoTitle",
            "Personal Information"
        );


        setText(
            "editInfoBtn",
            "Edit"
        );


        setText(
            "personalDisplayPosition",
            "Project Manager"
        );


        /* ======================================================
           PERSONAL INFORMATION LABELS
        ====================================================== */

        setText(
            "profileFullNameLabel",
            "Full Name"
        );


        setText(
            "profileUsernameLabel",
            "Username"
        );


        setText(
            "profilePositionLabel",
            "Position"
        );


        setText(
            "profileEmailLabel",
            "Email"
        );


        setText(
            "profileCountryLabel",
            "Country"
        );


        setText(
            "profilePhoneLabel",
            "Phone Number"
        );


        setText(
            "profileAddressLabel",
            "Address"
        );


        setText(
            "profileGenderLabel",
            "Gender"
        );


        setText(
            "profileBirthdayLabel",
            "Birthday"
        );


        setText(
            "profileCivilStatusLabel",
            "Civil Status"
        );


        /* ======================================================
           COUNTRY OPTIONS - ENGLISH
        ====================================================== */

        setOption(
            "profileCountryInput",
            "Japan",
            "🇯🇵 Japan"
        );


        setOption(
            "profileCountryInput",
            "Philippines",
            "🇵🇭 Philippines"
        );


        setOption(
            "profileCountryInput",
            "United States",
            "🇺🇸 United States"
        );


        /* ======================================================
           GENDER OPTIONS - ENGLISH
        ====================================================== */

        setText(
            "genderMaleOption",
            "Male"
        );


        setText(
            "genderFemaleOption",
            "Female"
        );


        /* ======================================================
           CIVIL STATUS OPTIONS - ENGLISH
        ====================================================== */

        setText(
            "civilSingleOption",
            "Single"
        );


        setText(
            "civilMarriedOption",
            "Married"
        );


        setText(
            "civilWidowedOption",
            "Widowed"
        );


        setText(
            "civilSeparatedOption",
            "Separated"
        );

    }


    /* ==========================================================
       MOBILE NAVIGATION
    ========================================================== */

    setText(
        "navHome",
        lang === "jp"
            ? "ホーム"
            : "Home"
    );


    setText(
        "navSchedule",
        lang === "jp"
            ? "予定"
            : "Schedule"
    );


    setText(
        "navHistory",
        lang === "jp"
            ? "履歴"
            : "History"
    );


    setText(
        "navSalary",
        lang === "jp"
            ? "給与"
            : "Salary"
    );


    setText(
        "navReports",
        lang === "jp"
            ? "レポート"
            : "Reports"
    );


    setText(
        "navProfile",
        lang === "jp"
            ? "プロフィール"
            : "Profile"
    );


    /* ==========================================================
       WORK LOGS
    ========================================================== */

    setText(
        "workLogsTitle",
        lang === "jp"
            ? "作業履歴"
            : "Work Logs"
    );


    setText(
        "salaryFilterText",
        lang === "jp"
            ? "フィルター"
            : "Filters"
    );


    setText(
        "salaryAllStatus",
        lang === "jp"
            ? "すべての状態"
            : "All Status"
    );


    setText(
        "salaryPending",
        lang === "jp"
            ? "保留中"
            : "Pending"
    );


    setText(
        "salaryPaid",
        lang === "jp"
            ? "支払い済み"
            : "Paid"
    );


    /* ==========================================================
       DASHBOARD
    ========================================================== */

    if(lang === "jp"){

        setText(
            "dashboardWelcome",
            "フローリングスケジュールマネージャーへようこそ"
        );


        setText(
            "txtTotalSchedule",
            "総スケジュール"
        );


        setText(
            "txtWork",
            "仕事"
        );


        setText(
            "txtDayOff",
            "休日"
        );


        setText(
            "txtHoliday",
            "祝日"
        );


        setText(
            "txtTodaySchedule",
            "今日の予定"
        );


        setText(
            "todayStatusBadge",
            "予定なし"
        );


        setText(
            "lblDate",
            " 日付"
        );


        setText(
            "lblLocation",
            " 場所"
        );


        setText(
            "lblBuilding",
            " 建物"
        );


        setText(
            "lblEngineer",
            " 担当者"
        );


        setText(
            "lblGenCon",
            " 元請会社"
        );


        setText(
            "lblFlooring",
            " 床材"
        );


        setText(
            "lblScheduleType",
            " 作業内容"
        );


        setText(
            "lblTimeIn",
            " 開始"
        );


        setText(
            "lblTimeOut",
            " 終了"
        );


        setText(
            "txtMonthlyOverview",
            "月間概要"
        );

        setText(
            "txtRecentSchedule",
            "最近の予定"
        );


        setText(
            "viewAllHistory",
            "すべて表示"
        );


        /* ======================================================
           SCHEDULE - JAPANESE
        ====================================================== */

        setText(
            "scheduleTitle",
            "スケジュール"
        );


        setText(
            "scheduleSubtitle",
            "床工事の予定を追加"
        );


        setText(
            "lblScheduleDate",
            "日付"
        );


        setText(
            "lblScheduleLocation",
            "場所"
        );


        setText(
            "lblScheduleBuilding",
            "建物"
        );


        setText(
            "lblScheduleEngineer",
            "担当者"
        );


        setText(
            "lblScheduleGenCon",
            "元請会社"
        );


        setText(
            "lblScheduleFlooring",
            "床材"
        );


        setText(
            "lblScheduleType2",
            "作業内容"
        );


        setText(
            "lblScheduleStatus",
            "状態"
        );


        setText(
            "lblScheduleTimeIn",
            "開始時間"
        );


        setText(
            "lblScheduleTimeOut",
            "終了時間"
        );


        setText(
            "lblScheduleNotes",
            "備考"
        );


        setText(
            "txtSaveSchedule",
            "保存"
        );


        setPlaceholder(
            "scheduleLocation",
            "場所を入力"
        );


        setPlaceholder(
            "scheduleBuilding",
            "建物名を入力"
        );


        setPlaceholder(
            "scheduleEngineer",
            "担当者名を入力"
        );


        setPlaceholder(
            "scheduleGenCon",
            "元請会社を入力"
        );


        setPlaceholder(
            "scheduleFlooring",
            "床材を入力"
        );


        setPlaceholder(
            "scheduleNotes",
            "備考を入力"
        );


        setOption(
            "scheduleType",
            "",
            "作業内容を選択"
        );


        setOption(
            "scheduleType",
            "Installation",
            "施工"
        );


        setOption(
            "scheduleType",
            "Repair",
            "修理"
        );


        setOption(
            "scheduleType",
            "Inspection",
            "点検"
        );


        setOption(
            "scheduleType",
            "Measurement",
            "採寸"
        );


        setOption(
            "scheduleType",
            "Maintenance",
            "メンテナンス"
        );


        setOption(
            "scheduleType",
            "Meeting",
            "会議"
        );


        setOption(
            "scheduleType",
            "Site Visit",
            "現場確認"
        );


        setOption(
            "scheduleType",
            "Other",
            "その他"
        );


        setOption(
            "scheduleStatus",
            "",
            "状態を選択"
        );


        setOption(
            "scheduleStatus",
            "Work",
            "作業"
        );


        setOption(
            "scheduleStatus",
            "Day Off",
            "休日"
        );


        setOption(
            "scheduleStatus",
            "Holiday",
            "祝日"
        );


        /* ======================================================
           HISTORY PAGE - JAPANESE
        ====================================================== */

        setText(
            "historyTitle",
            "履歴"
        );


        setText(
            "historySubtitle",
            "保存されたスケジュール一覧"
        );


        setPlaceholder(
            "historySearch",
            "スケジュールを検索..."
        );


        setText(
            "historyFilterText",
            "フィルター"
        );


        setText(
            "historyMonthAll",
            "すべての月"
        );


        setText(
            "historyYearAll",
            "すべての年"
        );


        setText(
            "historyStatusAll",
            "すべての状態"
        );


        setText(
            "historyStatusWork",
            "作業"
        );


        setText(
            "historyStatusDayOff",
            "休日"
        );


        setText(
            "historyStatusHoliday",
            "祝日"
        );


        /* ======================================================
           REPORTS PAGE - JAPANESE
        ====================================================== */

        setText(
            "reportsTitle",
            "レポート"
        );


        setText(
            "reportsSubtitle",
            "プロジェクト別概要"
        );


        setPlaceholder(
            "reportSearch",
            "検索..."
        );


        setText(
            "reportFilterText",
            "フィルター"
        );


        setText(
            "reportStatusAll",
            "すべての状態"
        );


        setText(
            "reportStatusPending",
            "保留中"
        );


        setText(
            "reportStatusPaid",
            "支払い済み"
        );


        setText(
            "reportMonthAll",
            "すべての月"
        );


        /* ======================================================
           SALARY PAGE - JAPANESE
        ====================================================== */

        setText(
            "salaryTitle",
            "給与"
        );


        setText(
            "salarySubtitle",
            "作業記録を作成"
        );


        setText(
            "salaryCreateTab",
            "作成"
        );


        setText(
            "salaryLogsTabText",
            "作業記録"
        );


        setText(
            "salaryAdvanceTabText",
            "前払い"
        );


        setText(
            "salaryAdvanceHistoryTabText",
            "前払い履歴"
        );


        setText(
            "salaryTotalLabel",
            "給与合計"
        );


        /* ======================================================
           SALARY FORM - JAPANESE
        ====================================================== */

        setText(
            "salaryWorkDateLabel",
            "作業日"
        );


        setText(
            "salaryEngineerLabel",
            "担当者"
        );


        setText(
            "salaryGenConLabel",
            "元請会社"
        );


        setText(
            "salaryLocationLabel",
            "場所"
        );


        setText(
            "salaryProjectLabel",
            "プロジェクト名"
        );


        setText(
            "salaryDescriptionLabel",
            "作業内容"
        );


        setText(
            "salaryQuantityLabel",
            "数量"
        );


        setText(
            "salaryUnitLabel",
            "単位"
        );


        setText(
            "salaryRateLabel",
            "単価 (¥)"
        );


        setText(
            "salarySubtotalLabel",
            "小計"
        );


        setText(
            "salaryTaxLabel",
            "10%"
        );


        setText(
            "salaryTotalAmountLabel",
            "合計"
        );


        setText(
            "saveSalaryText",
            "作業を保存"
        );


        setPlaceholder(
            "salaryEngineer",
            "担当者名を入力"
        );


        setPlaceholder(
            "salaryGenCon",
            "元請会社を入力"
        );


        setPlaceholder(
            "salaryLocation",
            "場所を入力"
        );


        setPlaceholder(
            "salaryProject",
            "プロジェクト名を入力"
        );


        setPlaceholder(
            "salaryDescription",
            "作業内容を入力"
        );


        setPlaceholder(
            "salaryQuantity",
            "0"
        );


        setPlaceholder(
            "salaryRate",
            "0"
        );


        setPlaceholder(
            "salarySearch",
            "作業を検索..."
        );


        /* ======================================================
           SALARY UNIT - JAPANESE
        ====================================================== */

        const salaryUnitJP =
            document.getElementById(
                "salaryUnit"
            );

        if(salaryUnitJP){

            if(salaryUnitJP.options[0])
                salaryUnitJP.options[0].textContent =
                    "単位を選択";

            if(salaryUnitJP.options[1])
                salaryUnitJP.options[1].textContent =
                    "㎡";

            if(salaryUnitJP.options[2])
                salaryUnitJP.options[2].textContent =
                    "m";

            if(salaryUnitJP.options[3])
                salaryUnitJP.options[3].textContent =
                    "個";

            if(salaryUnitJP.options[4])
                salaryUnitJP.options[4].textContent =
                    "部分";

            if(salaryUnitJP.options[5])
                salaryUnitJP.options[5].textContent =
                    "日";

        }


        /* ======================================================
           SALARY ADVANCE - JAPANESE
        ====================================================== */

        const advanceSectionJP =
            document.getElementById(
                "salaryAdvanceSection"
            );

        if(advanceSectionJP){

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

            const advanceAmount =
                document.getElementById(
                    "advanceAmount"
                );

            const advanceReason =
                document.getElementById(
                    "advanceReason"
                );


            if(
                advanceDate &&
                advanceDate.previousElementSibling
            ){

                advanceDate.previousElementSibling.textContent =
                    "前払い日";

            }


            if(
                advanceGenCon &&
                advanceGenCon.previousElementSibling
            ){

                advanceGenCon.previousElementSibling.textContent =
                    "元請会社";

            }


            if(
                advanceProject &&
                advanceProject.previousElementSibling
            ){

                advanceProject.previousElementSibling.textContent =
                    "プロジェクト名";

            }


            if(
                advanceEngineer &&
                advanceEngineer.previousElementSibling
            ){

                advanceEngineer.previousElementSibling.textContent =
                    "担当者";

            }


            if(
                advanceAmount &&
                advanceAmount.previousElementSibling
            ){

                advanceAmount.previousElementSibling.textContent =
                    "金額 (¥)";

            }


            if(
                advanceReason &&
                advanceReason.previousElementSibling
            ){

                advanceReason.previousElementSibling.textContent =
                    "理由（任意）";

            }


            setOption(
                "advanceGenCon",
                "",
                "元請会社を選択"
            );


            setOption(
                "advanceProject",
                "",
                "プロジェクトを選択"
            );


            setOption(
                "advanceEngineer",
                "",
                "担当者を選択"
            );


            setPlaceholder(
                "advanceAmount",
                "0"
            );


            setPlaceholder(
                "advanceReason",
                "前払いの理由を入力..."
            );


            setText(
                "saveAdvanceBtn",
                "前払いを保存"
            );

        }

/* ======================================================
   MONTHLY OVERVIEW MONTH
====================================================== */

const overviewMonth =
    document.getElementById(
        "overviewMonth"
    );

if(overviewMonth){

    const now = new Date();

    overviewMonth.textContent =
        now.toLocaleDateString(
            lang === "jp"
                ? "ja-JP"
                : "en-US",
            {
                year: "numeric",
                month: "long"
            }
        );

}


    }else{


        /* ======================================================
           DASHBOARD - ENGLISH
        ====================================================== */

        setText(
            "dashboardWelcome",
            "Welcome back to Flooring Schedule Manager"
        );


        setText(
            "txtTotalSchedule",
            "Total Schedule"
        );


        setText(
            "txtWork",
            "Work"
        );


        setText(
            "txtDayOff",
            "Day Off"
        );


        setText(
            "txtHoliday",
            "Holiday"
        );


        setText(
            "txtTodaySchedule",
            "Today's Schedule"
        );


        setText(
            "todayStatusBadge",
            "No Schedule"
        );


        setText(
            "lblDate",
            " Date"
        );


        setText(
            "lblLocation",
            " Location"
        );


        setText(
            "lblBuilding",
            " Building"
        );


        setText(
            "lblEngineer",
            " Engineer"
        );


        setText(
            "lblGenCon",
            " General Contractor"
        );


        setText(
            "lblFlooring",
            " Flooring Type"
        );


        setText(
            "lblScheduleType",
            " Schedule Type"
        );


        setText(
            "lblTimeIn",
            " Time In"
        );


        setText(
            "lblTimeOut",
            " Time Out"
        );


        setText(
            "txtMonthlyOverview",
            "Monthly Overview"
        );


        setText(
            "txtRecentSchedule",
            "Recent Schedule"
        );


        setText(
            "viewAllHistory",
            "View All"
        );


        /* ======================================================
           SCHEDULE - ENGLISH
        ====================================================== */

        setText(
            "scheduleTitle",
            "Schedule"
        );


        setText(
            "scheduleSubtitle",
            "Add your flooring schedule"
        );


        setText(
            "lblScheduleDate",
            "Date"
        );


        setText(
            "lblScheduleLocation",
            "Location"
        );


        setText(
            "lblScheduleBuilding",
            "Building"
        );


        setText(
            "lblScheduleEngineer",
            "Engineer"
        );


        setText(
            "lblScheduleGenCon",
            "General Contractor"
        );


        setText(
            "lblScheduleFlooring",
            "Flooring Type"
        );


        setText(
            "lblScheduleType2",
            "Schedule Type"
        );


        setText(
            "lblScheduleStatus",
            "Status"
        );


        setText(
            "lblScheduleTimeIn",
            "Time In"
        );


        setText(
            "lblScheduleTimeOut",
            "Time Out"
        );


        setText(
            "lblScheduleNotes",
            "Notes"
        );


        setText(
            "txtSaveSchedule",
            "SAVE SCHEDULE"
        );


        setPlaceholder(
            "scheduleLocation",
            "Enter location"
        );


        setPlaceholder(
            "scheduleBuilding",
            "Enter building"
        );


        setPlaceholder(
            "scheduleEngineer",
            "Enter engineer"
        );


        setPlaceholder(
            "scheduleGenCon",
            "Enter general contractor"
        );


        setPlaceholder(
            "scheduleFlooring",
            "Enter flooring type"
        );


        setPlaceholder(
            "scheduleNotes",
            "Enter notes..."
        );


        setOption(
            "scheduleType",
            "",
            "Select schedule type"
        );


        setOption(
            "scheduleType",
            "Installation",
            "Installation"
        );


        setOption(
            "scheduleType",
            "Repair",
            "Repair"
        );


        setOption(
            "scheduleType",
            "Inspection",
            "Inspection"
        );


        setOption(
            "scheduleType",
            "Measurement",
            "Measurement"
        );


        setOption(
            "scheduleType",
            "Maintenance",
            "Maintenance"
        );


        setOption(
            "scheduleType",
            "Meeting",
            "Meeting"
        );


        setOption(
            "scheduleType",
            "Site Visit",
            "Site Visit"
        );


        setOption(
            "scheduleType",
            "Other",
            "Other"
        );


        setOption(
            "scheduleStatus",
            "",
            "Select status"
        );


        setOption(
            "scheduleStatus",
            "Work",
            "Work"
        );


        setOption(
            "scheduleStatus",
            "Day Off",
            "Day Off"
        );


        setOption(
            "scheduleStatus",
            "Holiday",
            "Holiday"
        );


        /* ======================================================
           HISTORY PAGE - ENGLISH
        ====================================================== */

        setText(
            "historyTitle",
            "History"
        );


        setText(
            "historySubtitle",
            "View all saved schedules"
        );


        setPlaceholder(
            "historySearch",
            "Search schedule..."
        );


        setText(
            "historyFilterText",
            "Filters"
        );


        setText(
            "historyMonthAll",
            "All Months"
        );


        setText(
            "historyYearAll",
            "All Years"
        );


        setText(
            "historyStatusAll",
            "All Status"
        );


        setText(
            "historyStatusWork",
            "Work"
        );


        setText(
            "historyStatusDayOff",
            "Day Off"
        );


        setText(
            "historyStatusHoliday",
            "Holiday"
        );


        /* ======================================================
           REPORTS PAGE - ENGLISH
        ====================================================== */

        setText(
            "reportsTitle",
            "Reports"
        );


        setText(
            "reportsSubtitle",
            "Per Project Summary"
        );


        setPlaceholder(
            "reportSearch",
            "Search Gemba..."
        );


        setText(
            "reportFilterText",
            "Filters"
        );


        setText(
            "reportStatusAll",
            "All Status"
        );


        setText(
            "reportStatusPending",
            "Pending"
        );


        setText(
            "reportStatusPaid",
            "Paid"
        );


        setText(
            "reportMonthAll",
            "All Months"
        );


        /* ======================================================
           SALARY PAGE - ENGLISH
        ====================================================== */

        setText(
            "salaryTitle",
            "Salary"
        );


        setText(
            "salarySubtitle",
            "Create work log"
        );


        setText(
            "salaryCreateTab",
            "Create Work"
        );


        setText(
            "salaryLogsTabText",
            "Work Logs"
        );


        setText(
            "salaryAdvanceTabText",
            "Advance"
        );


        setText(
            "salaryAdvanceHistoryTabText",
            "Advance History"
        );


        setText(
            "salaryTotalLabel",
            "Total Salary"
        );


        /* ======================================================
           SALARY FORM - ENGLISH
        ====================================================== */

        setText(
            "salaryWorkDateLabel",
            "Work Date"
        );


        setText(
            "salaryEngineerLabel",
            "Engineer"
        );


        setText(
            "salaryGenConLabel",
            "Gen. Con."
        );


        setText(
            "salaryLocationLabel",
            "Location"
        );


        setText(
            "salaryProjectLabel",
            "Project Name"
        );


        setText(
            "salaryDescriptionLabel",
            "Work Description"
        );


        setText(
            "salaryQuantityLabel",
            "Quantity"
        );


        setText(
            "salaryUnitLabel",
            "Unit"
        );


        setText(
            "salaryRateLabel",
            "Rate (¥)"
        );


        setText(
            "salarySubtotalLabel",
            "Subtotal"
        );


        setText(
            "salaryTaxLabel",
            "10%"
        );


        setText(
            "salaryTotalAmountLabel",
            "Total"
        );


        setText(
            "saveSalaryText",
            "SAVE WORK"
        );


        setPlaceholder(
            "salaryEngineer",
            "Engineer name"
        );


        setPlaceholder(
            "salaryGenCon",
            "General contractor"
        );


        setPlaceholder(
            "salaryLocation",
            "Location"
        );


        setPlaceholder(
            "salaryProject",
            "Project / Gemba name"
        );


        setPlaceholder(
            "salaryDescription",
            "Work description"
        );


        setPlaceholder(
            "salaryQuantity",
            "0"
        );


        setPlaceholder(
            "salaryRate",
            "0"
        );


        setPlaceholder(
            "salarySearch",
            "Search work..."
        );


        /* ======================================================
           SALARY UNIT - ENGLISH
        ====================================================== */

        const salaryUnitEN =
            document.getElementById(
                "salaryUnit"
            );

        if(salaryUnitEN){

            if(salaryUnitEN.options[0])
                salaryUnitEN.options[0].textContent =
                    "Select Unit";

            if(salaryUnitEN.options[1])
                salaryUnitEN.options[1].textContent =
                    "m²";

            if(salaryUnitEN.options[2])
                salaryUnitEN.options[2].textContent =
                    "m";

            if(salaryUnitEN.options[3])
                salaryUnitEN.options[3].textContent =
                    "pcs";

            if(salaryUnitEN.options[4])
                salaryUnitEN.options[4].textContent =
                    "part";

            if(salaryUnitEN.options[5])
                salaryUnitEN.options[5].textContent =
                    "day";

        }


        /* ======================================================
           SALARY ADVANCE - ENGLISH
        ====================================================== */

        const advanceSectionEN =
            document.getElementById(
                "salaryAdvanceSection"
            );

        if(advanceSectionEN){

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

            const advanceAmount =
                document.getElementById(
                    "advanceAmount"
                );

            const advanceReason =
                document.getElementById(
                    "advanceReason"
                );


            if(
                advanceDate &&
                advanceDate.previousElementSibling
            ){

                advanceDate.previousElementSibling.textContent =
                    "Advance Date";

            }


            if(
                advanceGenCon &&
                advanceGenCon.previousElementSibling
            ){

                advanceGenCon.previousElementSibling.textContent =
                    "Gen. Con.";

            }


            if(
                advanceProject &&
                advanceProject.previousElementSibling
            ){

                advanceProject.previousElementSibling.textContent =
                    "Project Name";

            }


            if(
                advanceEngineer &&
                advanceEngineer.previousElementSibling
            ){

                advanceEngineer.previousElementSibling.textContent =
                    "Engineer";

            }


            if(
                advanceAmount &&
                advanceAmount.previousElementSibling
            ){

                advanceAmount.previousElementSibling.textContent =
                    "Amount (¥)";

            }


            if(
                advanceReason &&
                advanceReason.previousElementSibling
            ){

                advanceReason.previousElementSibling.textContent =
                    "Reason (Optional)";

            }


            setOption(
                "advanceGenCon",
                "",
                "Select Gen. Con."
            );


            setOption(
                "advanceProject",
                "",
                "Select Project"
            );


            setOption(
                "advanceEngineer",
                "",
                "Select Engineer"
            );


            setPlaceholder(
                "advanceAmount",
                "0"
            );


            setPlaceholder(
                "advanceReason",
                "Reason for salary advance..."
            );


            setText(
                "saveAdvanceBtn",
                "SAVE ADVANCE"
            );

        }

    }


    /* ==========================================================
       ADVANCE HISTORY
    ========================================================== */

    setText(
        "salaryAdvanceHistoryTitle",
        lang === "jp"
            ? "前払い履歴"
            : "Advance History"
    );


    setPlaceholder(
        "advanceSearch",
        lang === "jp"
            ? "前払い履歴を検索..."
            : "Search advance history..."
    );


    const advanceFilterBtn =
        document.getElementById(
            "advanceFilterBtn"
        );

    if(advanceFilterBtn){

        const filterSpan =
            advanceFilterBtn.querySelector("span");

        if(filterSpan){

            filterSpan.textContent =
                lang === "jp"
                    ? "フィルター"
                    : "Filter";

        }

    }


    /* ==========================================================
       ADVANCE HISTORY MONTH FILTER
    ========================================================== */

    const advanceMonthFilter =
        document.getElementById(
            "advanceMonthFilter"
        );

    if(advanceMonthFilter){

        const monthsJP = [

            "すべての月",
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


        const monthsEN = [

            "All Months",
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


        Array.from(
            advanceMonthFilter.options
        ).forEach(
            (option, index) => {

                if(lang === "jp"){

                    if(
                        monthsJP[index] !== undefined
                    ){

                        option.textContent =
                            monthsJP[index];

                    }

                }else{

                    if(
                        monthsEN[index] !== undefined
                    ){

                        option.textContent =
                            monthsEN[index];

                    }

                }

            }
        );

    }


    /* ==========================================================
       ADVANCE HISTORY YEAR FILTER
    ========================================================== */

    const advanceYearFilter =
        document.getElementById(
            "advanceYearFilter"
        );

    if(advanceYearFilter){

        if(
            advanceYearFilter.options.length > 0
        ){

            advanceYearFilter.options[0].textContent =
                lang === "jp"
                    ? "すべての年"
                    : "All Years";

        }

    }


    /* ==========================================================
       EMPTY ADVANCE HISTORY
    ========================================================== */

    setText(
        "advanceHistoryEmpty",
        lang === "jp"
            ? "前払い履歴はまだありません。"
            : "No salary advances yet."
    );


/* ==========================================================
   REFRESH DYNAMIC CONTENT
========================================================== */

if(
    typeof updateDashboardGreeting === "function"
){

    updateDashboardGreeting();

}


if(
    typeof updateDashboardClock === "function"
){

    updateDashboardClock();

}


if(
    typeof loadRecentSchedule === "function"
){

    loadRecentSchedule();

}


if(
    typeof loadTodaySchedule === "function"
){

    loadTodaySchedule();

}


/* ==========================================================
   REFRESH REPORTS
========================================================== */

if(
    typeof loadReports === "function"
){

    loadReports();

}


/* ==========================================================
   REFRESH SALARY WORK LOGS
========================================================== */

if(
    typeof loadWorkLogs === "function"
){

    loadWorkLogs();

}


/* ==========================================================
   REFRESH SALARY ADVANCE HISTORY
========================================================== */

if(
    typeof loadAdvanceHistory === "function"
){

    loadAdvanceHistory();

}

    /* ==========================================================
       RE-APPLY ADVANCE HISTORY FILTERS
    ========================================================== */

    translateAdvanceHistoryFilters();


   /* ==========================================================
   TRANSLATE EXISTING DATE ELEMENTS
========================================================== */

translateDynamicDates();


/* ==========================================================
   MONTHLY OVERVIEW MONTH
========================================================== */

const overviewMonth =
    document.getElementById(
        "overviewMonth"
    );

if(overviewMonth){

    const now = new Date();

    overviewMonth.textContent =
        now.toLocaleDateString(
            lang === "jp"
                ? "ja-JP"
                : "en-US",
            {
                year: "numeric",
                month: "long"
            }
        );

}


/* ==========================================================
   REFRESH MONTHLY OVERVIEW LANGUAGE
========================================================== */

if(
    typeof loadMonthlyOverview === "function"
){

    loadMonthlyOverview();

}

}