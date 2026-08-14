/* ==========================================================
   CURRENCY SYSTEM
   YONAHA INTERIOR
   Supabase Based
========================================================== */

console.log("currency.js loaded");


/* ==========================================================
   CURRENCY SETTINGS
========================================================== */

const currencyData = {

    JPY: {

        code: "JPY",

        symbol: "¥",

        name: "Japanese Yen"

    },

    PHP: {

        code: "PHP",

        symbol: "₱",

        name: "Philippine Peso"

    }

};


/* ==========================================================
   EXCHANGE RATE SETTINGS
========================================================== */

/*
   BASE CURRENCY
   ----------------------------------------------------------
   All saved amounts inside the application are assumed
   to be Japanese Yen (JPY).

   Example:

   ¥10,000

   If:

   1 JPY = ₱0.37

   Then:

   ¥10,000 × 0.37
   = ₱3,700

   The PHP rate is NOT permanently stored here.

   The application gets the latest exchange rate
   automatically from the exchange-rate API.
*/

let currencyRates = {

    JPY: 1,

    PHP: 0

};


/* ==========================================================
   CURRENT CURRENCY
========================================================== */

let currentCurrency = "JPY";


/* ==========================================================
   GET CURRENT CURRENCY
========================================================== */

function getCurrentCurrency(){

    return currentCurrency;

}


/* ==========================================================
   GET CURRENCY SYMBOL
========================================================== */

function getCurrencySymbol(currency){

    const selected =
        currencyData[currency];


    if(!selected){

        return "¥";

    }


    return selected.symbol;

}


/* ==========================================================
   LOAD LIVE EXCHANGE RATES
========================================================== */

async function loadExchangeRates(){

    try{

        console.log(
            "Loading latest exchange rates..."
        );


        /*
           ExchangeRate-API

           Base currency:
           JPY

           We only need:
           JPY
           PHP
        */

        const response =
            await fetch(
                "https://open.er-api.com/v6/latest/JPY"
            );


        if(!response.ok){

            throw new Error(
                "Exchange rate request failed."
            );

        }


        const data =
            await response.json();


        if(
            !data ||
            !data.rates
        ){

            throw new Error(
                "Invalid exchange rate response."
            );

        }


        const jpyToPhp =
            Number(
                data.rates.PHP
            );


        if(
            !Number.isFinite(
                jpyToPhp
            )
        ){

            throw new Error(
                "PHP exchange rate unavailable."
            );

        }


        /*
           Update live rate
        */

        currencyRates.JPY =
            1;


        currencyRates.PHP =
            jpyToPhp;


        console.log(
            "LIVE JPY → PHP RATE:",
            jpyToPhp
        );


        return true;


    }catch(error){

        console.error(
            "EXCHANGE RATE ERROR:",
            error
        );


        /*
           Fallback rate.

           This is only used if the
           live API cannot be reached.
        */

        currencyRates.JPY =
            1;


        currencyRates.PHP =
            0.37;


        console.warn(
            "Using fallback JPY → PHP rate:",
            currencyRates.PHP
        );


        return false;

    }

}

/* ==========================================================
   CONVERT CURRENCY
   JPY ↔ PHP
   ========================================================== */

function convertCurrency(
    amount,
    targetCurrency =
        window.currentCurrency ||
        currentCurrency ||
        "JPY"
){

    const numericAmount =
        Number(amount) || 0;

    /* ------------------------------------------------------
       CHECK TARGET CURRENCY
       ------------------------------------------------------ */

    if(
        !currencyData[targetCurrency]
    ){

        console.error(
            "Invalid target currency:",
            targetCurrency
        );

        return numericAmount;

    }

    /* ------------------------------------------------------
       JPY IS THE BASE CURRENCY
       ------------------------------------------------------ */

    if(
        targetCurrency === "JPY"
    ){

        return numericAmount;

    }

    /* ------------------------------------------------------
       JPY → PHP
       ------------------------------------------------------ */

    if(
        targetCurrency === "PHP"
    ){

        const rate =
            Number(
                currencyRates.PHP
            ) || 0;

        if(rate <= 0){

            console.error(
                "PHP exchange rate not available."
            );

            return numericAmount;

        }

        return (
            numericAmount *
            rate
        );

    }

    /* ------------------------------------------------------
       UNKNOWN CURRENCY
       ------------------------------------------------------ */

    console.error(
        "Currency conversion unavailable:",
        targetCurrency
    );


    return numericAmount;

}

/* ==========================================================
   FORMAT CURRENCY
   ========================================================== */

function formatCurrency(
    amount,
    targetCurrency = currentCurrency
){

    const convertedAmount =
        convertCurrency(
            amount,
            targetCurrency
        );


    const symbol =
        getCurrencySymbol(
            targetCurrency
        );


    return (

        symbol +

        convertedAmount.toLocaleString(
            "en-US",
            {
                minimumFractionDigits: 0,
                maximumFractionDigits: 2
            }
        )

    );

}

/* ==========================================================
   OPEN / CLOSE CURRENCY SELECTOR
========================================================== */

function toggleCurrencySelector(){

    const selector =
        document.getElementById(
            "currencySelector"
        );


    if(!selector){

        console.error(
            "currencySelector not found."
        );

        return;

    }


    const isOpen =
        selector.classList.contains(
            "show"
        );


    if(isOpen){

        selector.classList.remove(
            "show"
        );

    }else{

        selector.classList.add(
            "show"
        );

    }

}


/* ==========================================================
   SELECT CURRENCY
========================================================== */

async function selectCurrency(
    currency
){

    console.log(
        "Selecting currency:",
        currency
    );


    const selected =
        currencyData[currency];


    if(!selected){

        console.error(
            "Invalid currency:",
            currency
        );

        return;

    }


    /* ------------------------------------------------------
       CHECK LOGIN
    ------------------------------------------------------ */

    const {
        data: {
            user
        }
    } =
        await db.auth.getUser();


    if(!user){

    return;

}


    /* ------------------------------------------------------
       SAVE CURRENCY TO SUPABASE
    ------------------------------------------------------ */

    const {
        error
    } =
        await db

            .from("profiles")

            .update({

                currency:
                    selected.code

            })

            .eq(
                "user_id",
                user.id
            );


    if(error){

        console.error(
            "CURRENCY SAVE ERROR:",
            error
        );


        alert(
            "Unable to save currency."
        );


        return;

    }


    /* ------------------------------------------------------
       UPDATE CURRENT CURRENCY
    ------------------------------------------------------ */

    currentCurrency =
        selected.code;


    window.currentCurrency =
        selected.code;


    window.currentCurrencySymbol =
        selected.symbol;


    window.currentCurrencyName =
        selected.name;


    /* ------------------------------------------------------
       UPDATE PROFILE DISPLAY
    ------------------------------------------------------ */

    updateCurrencyDisplay(
        selected
    );


    /* ------------------------------------------------------
       CLOSE SELECTOR
    ------------------------------------------------------ */

    const selector =
        document.getElementById(
            "currencySelector"
        );


    if(selector){

        selector.classList.remove(
            "show"
        );

    }


    /* ------------------------------------------------------
       REFRESH APPLICATION DATA
    ------------------------------------------------------ */

    if(
        typeof loadRecentSchedule ===
        "function"
    ){

        await loadRecentSchedule();

    }


    if(
        typeof loadMonthlyOverview ===
        "function"
    ){

        await loadMonthlyOverview();

    }


    if(
        typeof loadWorkLogs ===
        "function"
    ){

        await loadWorkLogs();

    }


    if(
        typeof loadAdvanceHistory ===
        "function"
    ){

        await loadAdvanceHistory();

    }


    if(
        typeof renderReports ===
        "function"
    ){

        await renderReports();

    }


    if(
        typeof loadReports ===
        "function"
    ){

        await loadReports();

    }


    console.log(
        "Currency changed to:",
        selected.code
    );

}


/* ==========================================================
   UPDATE CURRENCY DISPLAY
========================================================== */

function updateCurrencyDisplay(
    currency
){

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


    const currencyArrow =
        document.getElementById(
            "currencyArrow"
        );


    if(currencyArrow){

        currencyArrow.textContent =
            "›";

    }

}


/* ==========================================================
   LOAD USER CURRENCY
========================================================== */

async function loadUserCurrency(){

    const {
    data: sessionData
} =
    await db.auth.getSession();


const user =
    sessionData?.session?.user;


if(!user){

    return;

}


    /* ------------------------------------------------------
       LOAD LIVE EXCHANGE RATE FIRST
    ------------------------------------------------------ */

    await loadExchangeRates();


    /* ------------------------------------------------------
       LOAD CURRENCY FROM SUPABASE
    ------------------------------------------------------ */

    const {
    data,
    error
} =
    await db
        .from("profiles")
        .select("currency")
        .eq("user_id", user.id)
        .maybeSingle();


    if(error){

        console.error(
            "LOAD CURRENCY ERROR:",
            error
        );


        currentCurrency =
            "JPY";


        window.currentCurrency =
            "JPY";


        window.currentCurrencySymbol =
            "¥";


        return;

    }


    const savedCurrency =
        data?.currency ||
        "JPY";


    const selected =
        currencyData[
            savedCurrency
        ] ||
        currencyData.JPY;


    currentCurrency =
        selected.code;


    window.currentCurrency =
        selected.code;


    window.currentCurrencySymbol =
        selected.symbol;


    window.currentCurrencyName =
        selected.name;


    updateCurrencyDisplay(
        selected
    );


    console.log(
        "User currency:",
        selected.code
    );


    console.log(
        "Current exchange rates:",
        currencyRates
    );

}


/* ==========================================================
   INITIALIZE
========================================================== */

document.addEventListener(
    "DOMContentLoaded",
    () => {

        loadUserCurrency();


        /* ==================================================
           CLOSE CURRENCY SELECTOR WHEN CLICKING OUTSIDE
        ================================================== */

        document.addEventListener(
            "click",
            (event) => {

                const selector =
                    document.getElementById(
                        "currencySelector"
                    );

                const card =
                    document.getElementById(
                        "currencyCard"
                    );


                if(!selector){
                    return;
                }


                if(
                    selector.contains(event.target) ||
                    card?.contains(event.target)
                ){

                    return;

                }


                selector.classList.remove(
                    "show"
                );

            }
        );

    }
);


/* ==========================================================
   GLOBAL FUNCTIONS
   Required by HTML onclick
========================================================== */

window.toggleCurrencySelector =
    toggleCurrencySelector;


window.selectCurrency =
    selectCurrency;


window.loadUserCurrency =
    loadUserCurrency;


window.convertCurrency =
    convertCurrency;


window.formatCurrency =
    formatCurrency;


window.getCurrentCurrency =
    getCurrentCurrency;


window.getCurrencySymbol =
    getCurrencySymbol;


window.loadExchangeRates =
loadExchangeRates;

window.currencyRates =
currencyRates;
