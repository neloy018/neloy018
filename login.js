/* =====================================================
   BANGLADESH LIVE CLOCK
===================================================== */

function updateClock(){

    const now = new Date();

    const parts =
        new Intl.DateTimeFormat(
            "en-GB",
            {
                timeZone:"Asia/Dhaka",
                weekday:"long",
                day:"2-digit",
                month:"long",
                year:"numeric",
                hour:"2-digit",
                minute:"2-digit",
                second:"2-digit",
                hour12:false
            }
        ).formatToParts(now);


    function get(type){

        const item =
            parts.find(
                p => p.type === type
            );

        return item
            ? item.value
            : "";
    }


    const hour =
        Number(get("hour"));

    const minute =
        Number(get("minute"));

    const second =
        Number(get("second"));


    const hourAngle =
        ((hour % 12) * 30)
        +
        (minute * 0.5);


    const minuteAngle =
        (minute * 6)
        +
        (second * 0.1);


    const secondAngle =
        second * 6;


    document
        .getElementById("hourHand")
        .style.transform =

        `translate(-50%, -100%)
         rotate(${hourAngle}deg)`;


    document
        .getElementById("minuteHand")
        .style.transform =

        `translate(-50%, -100%)
         rotate(${minuteAngle}deg)`;


    document
        .getElementById("secondHand")
        .style.transform =

        `translate(-50%, -100%)
         rotate(${secondAngle}deg)`;


    document
        .getElementById("digitalTime")
        .textContent =

        `${get("hour")}:
         ${get("minute")}:
         ${get("second")}`
         .replace(/\s/g,"");


    document
        .getElementById("date")
        .textContent =

        `${get("weekday")},
         ${get("day")}
         ${get("month")}
         ${get("year")}`;
}


updateClock();


setInterval(
    updateClock,
    1000
);



/* =====================================================
   INPUT FOCUS
===================================================== */

document
    .querySelectorAll(".input")
    .forEach(
        input => {

            input.addEventListener(
                "focus",
                () => {

                    input
                        .parentElement
                        .classList
                        .add("active");

                }
            );


            input.addEventListener(
                "blur",
                () => {

                    input
                        .parentElement
                        .classList
                        .remove("active");

                }
            );

        }
    );



/* =====================================================
   PASSWORD SHOW / HIDE
===================================================== */

function togglePassword(){

    const password =
        document.getElementById("password");


    const button =
        document.getElementById("passwordToggle");


    if(
        password.type === "password"
    ){

        password.type = "text";

        button.classList.add("show");

    }

    else{

        password.type = "password";

        button.classList.remove("show");

    }

}

const passwordToggleBtn = document.getElementById("passwordToggle");
if(passwordToggleBtn){
    passwordToggleBtn.addEventListener("click", togglePassword);
}



/* =====================================================
   FORGOT PASSWORD
===================================================== */

function forgotPassword(){

    alert(
        "Password recovery will be available here."
    );

}

const forgotBtn = document.getElementById("forgotBtn");
if(forgotBtn){
    forgotBtn.addEventListener("click", forgotPassword);
}



/* =====================================================
   LOGIN SYSTEM
   ORIGINAL LOGIC + COMPATIBILITY LOGIC
===================================================== */

function getRegisteredUserData(){

    const possibleKeys = [

        "mywebsite_registered_users",

        "portal_registered_user",

        "registered_user",

        "registeredUser",

        "user",

        "currentUser",

        "account",

        "accountData",

        "registrationData"

    ];


    for(

        let i = 0;

        i < possibleKeys.length;

        i++

    ){

        const savedData =
            localStorage.getItem(
                possibleKeys[i]
            );


        if(
            savedData
        ){

            try{

                const parsedData =
                    JSON.parse(
                        savedData
                    );


                if(
                    parsedData
                ){

                    return parsedData;

                }

            }

            catch(error){

                /* Skip invalid JSON */

            }

        }

    }


    return null;

}



/* =====================================================
   GET FIELD VALUE
===================================================== */

function getUserField(
    user,
    fieldNames
){

    for(

        let i = 0;

        i < fieldNames.length;

        i++

    ){

        const value =
            user[
                fieldNames[i]
            ];


        if(
            value !== undefined
            &&
            value !== null
            &&
            String(value).trim() !== ""
        ){

            return String(
                value
            );

        }

    }


    return "";

}



/* =====================================================
   CHECK ONE ACCOUNT
===================================================== */

function checkAccountLogin(
    user,
    enteredUsername,
    enteredPassword
){

    if(
        !user
        ||
        typeof user !== "object"
    ){

        return false;

    }


    const savedUsername =
        getUserField(
            user,
            [

                "userName",

                "username",

                "user_name",

                "name",

                "fullName"

            ]
        )
        .trim()
        .toLowerCase();


    const savedEmail =
        getUserField(
            user,
            [

                "email",

                "emailAddress",

                "email_address",

                "userEmail"

            ]
        )
        .trim()
        .toLowerCase();


    const savedPassword =
        getUserField(
            user,
            [

                "password",

                "userPassword",

                "pass",

                "user_password"

            ]
        );


    const usernameMatched =

        enteredUsername ===
        savedUsername

        ||

        enteredUsername ===
        savedEmail;


    const passwordMatched =

        enteredPassword ===
        savedPassword;


    return (
        usernameMatched
        &&
        passwordMatched
    );

}



/* =====================================================
   FORM SUBMIT
===================================================== */

const loginForm = document.querySelector(".form");

if(loginForm){
    loginForm.addEventListener(
        "submit",
        function(e){

            e.preventDefault();


            /* =================================================
               GET INPUTS
            ================================================= */

            const usernameInput =
                document.querySelector(
                    'input[name="username"]'
                );


            const passwordInput =
                document.getElementById(
                    "password"
                );


            const username =
                usernameInput.value
                    .trim()
                    .toLowerCase();


            const enteredPassword =
                passwordInput.value;



            /* =================================================
               GET REGISTERED ACCOUNT
            ================================================= */

            const savedUserData =
                getRegisteredUserData();



            /* No account found */

            if(
                !savedUserData
            ){

                alert(
                    "No registered account found. Please create a new account first."
                );

                return;

            }



            let matchedUser =
                null;



            /* =================================================
               IF MULTIPLE ACCOUNTS ARRAY
            ================================================= */

            if(
                Array.isArray(
                    savedUserData
                )
            ){

                for(

                    let i = 0;

                    i < savedUserData.length;

                    i++

                ){

                    if(

                        checkAccountLogin(

                            savedUserData[i],

                            username,

                            enteredPassword

                        )

                    ){

                        matchedUser =
                            savedUserData[i];

                        break;

                    }

                }

            }



            /* =================================================
               SINGLE ACCOUNT
            ================================================= */

            else{

                if(

                    checkAccountLogin(

                        savedUserData,

                        username,

                        enteredPassword

                    )

                ){

                    matchedUser =
                        savedUserData;

                }

            }



            /* =================================================
               LOGIN SUCCESS
            ================================================= */

            if(
                matchedUser
            ){

                localStorage.setItem(
                    "portal_home_access_granted",
                    "true"
                );


                const currentUsername =
                    getUserField(
                        matchedUser,
                        [

                            "userName",

                            "username",

                            "user_name",

                            "name",

                            "fullName",

                            "email"

                        ]
                    );


                localStorage.setItem(
                    "portal_current_user",
                    currentUsername
                );


                localStorage.setItem(
                    "portal_user_logged_in",
                    "true"
                );


                const rememberCheckbox =
                    document.querySelector(
                        'input[name="remember"]'
                    );


                if(
                    rememberCheckbox
                    &&
                    rememberCheckbox.checked
                ){

                    localStorage.setItem(
                        "portal_remembered_user",
                        usernameInput.value
                    );

                }

                else{

                    localStorage.removeItem(
                        "portal_remembered_user"
                    );

                }


                alert(
                    "Login successful!"
                );


                window.location.href =
                    "main.html";


                return;

            }



            /* =================================================
               LOGIN FAILED
            ================================================= */

            else{

                localStorage.removeItem(
                    "portal_home_access_granted"
                );


                localStorage.removeItem(
                    "portal_user_logged_in"
                );


                alert(
                    "Incorrect username/email or password."
                );


                passwordInput.focus();

            }

        }
    );
}



/* =====================================================
   AUTO FILL REMEMBERED USER
===================================================== */

window.addEventListener(
    "DOMContentLoaded",
    function(){

        const rememberedUser =
            localStorage.getItem(
                "portal_remembered_user"
            );


        const usernameInput =
            document.querySelector(
                'input[name="username"]'
            );


        if(
            rememberedUser
            &&
            usernameInput
        ){

            usernameInput.value =
                rememberedUser;


            const rememberCheckbox =
                document.querySelector(
                    'input[name="remember"]'
                );


            if(
                rememberCheckbox
            ){

                rememberCheckbox.checked =
                    true;

            }

        }

    }
);



/* =====================================================
   CREATE NEW ACCOUNT
===================================================== */

const registerBtn = document.querySelector(".register");

if(registerBtn){
    registerBtn.addEventListener(
        "click",
        function(e){

            e.preventDefault();

            window.location.href =
                "registration.html";

        }
    );
}
