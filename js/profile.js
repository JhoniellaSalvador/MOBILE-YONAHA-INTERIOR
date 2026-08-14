/* ==========================================================
   PROFILE PAGE
========================================================== */

document.addEventListener("DOMContentLoaded",()=>{

    const profilePage =
    document.getElementById("profilePage");

    const personalInfoPage =
    document.getElementById("personalInfoPage");

    const personalInfoCard =
    document.getElementById("personalInfoCard");

    const backBtn =
    document.getElementById("backToProfileBtn");

    const editBtn =
    document.getElementById("editInfoBtn");

    let editMode = false;

    /* ==========================
       OPEN PERSONAL INFO
    ========================== */

    if(personalInfoCard){

        personalInfoCard.onclick = ()=>{

            profilePage.style.display="none";

            personalInfoPage.style.display="block";

        };

    }

    /* ==========================
       BACK
    ========================== */

    if(backBtn){

        backBtn.onclick = ()=>{

            personalInfoPage.style.display="none";

            profilePage.style.display="block";

        };

    }

    /* ==========================
       EDIT / SAVE
    ========================== */

   if(editBtn){

    editBtn.onclick = async ()=>{

        if(!editMode){

            editMode = true;

            editBtn.textContent = "Save";

            document.querySelectorAll(".profile-input").forEach(item=>{

                const value =
                item.querySelector(".profile-value");

                const input =
                item.querySelector(".profile-edit-input");

                if(!value || !input) return;

                if(input.tagName === "SELECT"){

                    input.value = value.textContent.trim();

                }else if(input.type === "date"){

                    const date = new Date(value.textContent.trim());

                    if(!isNaN(date)){

                        input.value =
                        date.toISOString().split("T")[0];

                    }

                }else{

                    input.value = value.textContent.trim();

                }

                value.style.display = "none";

                input.style.display = "block";

            });

            return;

        }

        editMode = false;

        editBtn.textContent = "Edit";

        await saveProfile();

    };

}

/* ==========================================================
   SAVE PROFILE
========================================================== */

async function saveProfile(){

    const { data } =
    await db.auth.getSession();

    if(!data.session) return;

    const user = data.session.user;

    const updateData = {

        full_name:
        document.getElementById("profileFullNameInput").value.trim(),

        username:
        document.getElementById("profileUsernameInput").value.trim(),

        position:
        document.getElementById("profilePositionInput").value.trim(),

        email:
        document.getElementById("profileEmailInput").value.trim(),

        country:
        document.getElementById("profileCountryInput").value,

        phone:
        document.getElementById("profilePhoneInput").value.trim(),

        address:
        document.getElementById("profileAddressInput").value.trim(),

        gender:
        document.getElementById("profileGenderInput").value,

        birthday:
        document.getElementById("profileBirthdayInput").value,

        civil_status:
        document.getElementById("profileCivilStatusInput").value

    };

    const { error } = await db

        .from("profiles")

        .update(updateData)

        .eq("id", user.id);

    if(error){

        alert(error.message);

        return;

    }

    await loadProfile();

    document.querySelectorAll(".profile-input").forEach(item=>{

        const value =
        item.querySelector(".profile-value");

        const input =
        item.querySelector(".profile-edit-input");

        if(!value || !input) return;

        if(input.type === "date" && input.value){

            value.textContent =
            new Date(input.value).toLocaleDateString("en-US",{

                year:"numeric",

                month:"long",

                day:"numeric"

            });

        }else{

            value.textContent = input.value;

        }

        value.style.display = "block";

        input.style.display = "none";

    });

       editMode = false;

    document.getElementById("editInfoBtn").textContent = "Edit";

    alert("Profile updated successfully.");

} // end saveProfile

}); // end DOMContentLoaded

/* ==========================================================
   LANGUAGE
========================================================== */

const languageCard =
document.getElementById("languageCard");

if(languageCard){

    languageCard.onclick = async ()=>{

        const current =
        document.getElementById("currentLanguage").textContent.trim();

        const newLanguage =

        current === "English"

        ? "jp"

        : "en";

        const { data } =
        await db.auth.getSession();

        if(!data.session) return;

        const user = data.session.user;

        const { error } = await db

            .from("profiles")

            .update({

                language:newLanguage

            })

            .eq("user_id",user.id);

        if(error){

            alert(error.message);

            return;

        }

        await loadProfile();

        applyLanguage(newLanguage);

    };

}
