/*
    ============================================================
    PAGE LINKS
    ============================================================
*/

const HOME_PAGE = "main.html"; // আপনার নির্দিষ্ট হোম পেজের ফাইল নেম

const REGISTRATION_PAGE = "registration.html";


/*
    KEYS
*/

const HOME_ACCESS_KEY =
    "portal_home_access_granted";

const PATTERN_KEY =
    "portal_saved_pattern";

const ATTEMPT_KEY =
    "portal_attempts";

const LOCK_UNTIL_KEY =
    "portal_lock_until";

const BLOCKED_KEY =
    "portal_account_blocked";

/*
    গ্রাহক পূর্বে লগইন/রেজিস্ট্রেশন করেছেন কিনা তা ট্র্যাক করার জন্য KEY
*/
const USER_REGISTERED_KEY =
    "portal_is_registered";


/*
    LOCK SYSTEM
*/

const LOCK_TIMES = {

    1:
        30 * 1000,

    2:
        1 * 60 * 1000,

    3:
        5 * 60 * 1000,

    4:
        5 * 60 * 60 * 1000,

    5:
        12 * 60 * 60 * 1000,

    6:
        24 * 60 * 60 * 1000

};


const createScreen =
    document.getElementById(
        "createScreen"
    );

const repeatScreen =
    document.getElementById(
        "repeatScreen"
    );

const accessScreen =
    document.getElementById(
        "accessScreen"
    );

const lockScreen =
    document.getElementById(
        "lockScreen"
    );

const blockedScreen =
    document.getElementById(
        "blockedScreen"
    );


const nextButton =
    document.getElementById(
        "nextButton"
    );

const confirmButton =
    document.getElementById(
        "confirmButton"
    );

const createAccount =
    document.getElementById(
        "createAccount"
    );


let createPattern = "";

let repeatPattern = "";

let countdownInterval = null;



function showScreen(id){

    [
        createScreen,
        repeatScreen,
        accessScreen,
        lockScreen,
        blockedScreen

    ].forEach(screen => {

        screen.classList.remove(
            "active"
        );

    });


    document
        .getElementById(id)
        .classList.add("active");
}



function getAttempts(){

    return parseInt(
        localStorage.getItem(
            ATTEMPT_KEY
        ) || "0",
        10
    );
}



function resetAccessState(){

    localStorage.setItem(
        ATTEMPT_KEY,
        "0"
    );


    localStorage.removeItem(
        LOCK_UNTIL_KEY
    );


    localStorage.removeItem(
        BLOCKED_KEY
    );
}



function goHome(){

    resetAccessState();

    localStorage.setItem(
        HOME_ACCESS_KEY,
        "1"
    );

    window.location.href =
        HOME_PAGE;
}



createAccount.addEventListener(
    "click",
    () => {

        localStorage.removeItem(
            PATTERN_KEY
        );

        localStorage.removeItem(
            HOME_ACCESS_KEY
        );

        localStorage.removeItem(
            USER_REGISTERED_KEY
        );

        resetAccessState();

        window.location.href =
            REGISTRATION_PAGE;

    }
);



function createPatternDrawer(
    boxId,
    dotsId,
    linesId,
    callback
){

    const box =
        document.getElementById(boxId);

    const dotsContainer =
        document.getElementById(dotsId);

    const linesContainer =
        document.getElementById(linesId);


    const points = [];


    let drawing = false;

    let currentPoint = null;


    const positions = {

        1:[16.66,16.66],
        2:[50,16.66],
        3:[83.33,16.66],

        4:[16.66,50],
        5:[50,50],
        6:[83.33,50],

        7:[16.66,83.33],
        8:[50,83.33],
        9:[83.33,83.33]

    };



    for(
        let i = 1;
        i <= 9;
        i++
    ){

        const dot =
            document.createElement(
                "div"
            );

        dot.className = "dot";

        dot.dataset.point = i;


        dot.style.left =
            positions[i][0] + "%";

        dot.style.top =
            positions[i][1] + "%";


        dotsContainer.appendChild(
            dot
        );
    }



    const pairs = {

        "1-3":2,
        "3-1":2,

        "1-7":4,
        "7-1":4,

        "3-9":6,
        "9-3":6,

        "7-9":8,
        "9-7":8,

        "1-9":5,
        "9-1":5,

        "3-7":5,
        "7-3":5,

        "2-8":5,
        "8-2":5,

        "4-6":5,
        "6-4":5

    };



    function pointFromEvent(e){

        const rect =
            box.getBoundingClientRect();

        return {

            x:
                e.clientX -
                rect.left,

            y:
                e.clientY -
                rect.top

        };
    }



    function findDot(x,y){

        const rect =
            box.getBoundingClientRect();


        for(
            let i = 1;
            i <= 9;
            i++
        ){

            const px =
                rect.width *
                positions[i][0] /
                100;

            const py =
                rect.height *
                positions[i][1] /
                100;


            if(
                Math.hypot(
                    x - px,
                    y - py
                )
                <
                Math.min(
                    rect.width,
                    rect.height
                ) * 0.12
            ){

                return i;

            }
        }


        return null;
    }



    function addPoint(point){

        if(
            !point ||
            points.includes(point)
        ){

            return;
        }


        if(points.length){

            const pair =
                points[
                    points.length - 1
                ]
                + "-"
                + point;


            if(
                pairs[pair] &&
                !points.includes(
                    pairs[pair]
                )
            ){

                points.push(
                    pairs[pair]
                );
            }
        }


        points.push(point);

        updateVisuals();
    }



    function updateVisuals(){

        dotsContainer
            .querySelectorAll(".dot")
            .forEach(dot => {

                dot.classList.toggle(
                    "selected",

                    points.includes(
                        Number(
                            dot.dataset.point
                        )
                    )
                );

            });


        linesContainer.innerHTML = "";


        for(
            let i = 1;
            i < points.length;
            i++
        ){

            const a =
                positions[
                    points[i - 1]
                ];

            const b =
                positions[
                    points[i]
                ];


            const x1 =
                box.clientWidth *
                a[0] /
                100;

            const y1 =
                box.clientHeight *
                a[1] /
                100;


            const x2 =
                box.clientWidth *
                b[0] /
                100;

            const y2 =
                box.clientHeight *
                b[1] /
                100;


            const line =
                document.createElement(
                    "div"
                );

            line.className =
                "pattern-line";


            const dx =
                x2 - x1;

            const dy =
                y2 - y1;


            line.style.left =
                x1 + "px";

            line.style.top =
                y1 + "px";


            line.style.width =
                Math.hypot(
                    dx,
                    dy
                ) + "px";


            line.style.transform =
                `rotate(${Math.atan2(
                    dy,
                    dx
                )}rad)`;


            linesContainer.appendChild(
                line
            );
        }
    }



    function clear(){

        points.length = 0;

        currentPoint = null;

        drawing = false;

        updateVisuals();
    }



    function showError(){

        box.classList.remove(
            "error"
        );

        void box.offsetWidth;

        box.classList.add(
            "error"
        );


        dotsContainer
            .querySelectorAll(".dot")
            .forEach(dot => {

                dot.classList.add(
                    "error"
                );

            });


        setTimeout(() => {

            box.classList.remove(
                "error"
            );


            dotsContainer
                .querySelectorAll(".dot")
                .forEach(dot => {

                    dot.classList.remove(
                        "error"
                    );

                });


            clear();

        },450);
    }



    function finish(){

        drawing = false;

        currentPoint = null;


        if(points.length < 4){

            callback("");

            showError();

            return;
        }


        const result =
            points.join("");


        callback(result);

        clear();
    }



    box.addEventListener(
        "pointerdown",
        e => {

            e.preventDefault();

            drawing = true;


            box.setPointerCapture?.(
                e.pointerId
            );


            const p =
                pointFromEvent(e);


            addPoint(
                findDot(
                    p.x,
                    p.y
                )
            );

        }
    );



    box.addEventListener(
        "pointermove",
        e => {

            if(!drawing){
                return;
            }


            e.preventDefault();


            const p =
                pointFromEvent(e);


            const dot =
                findDot(
                    p.x,
                    p.y
                );


            if(
                dot &&
                dot !== currentPoint
            ){

                currentPoint = dot;

                addPoint(dot);
            }

        }
    );



    box.addEventListener(
        "pointerup",
        e => {

            e.preventDefault();

            finish();

        }
    );



    box.addEventListener(
        "pointercancel",
        finish
    );


    return {

        clear,

        showError,

        getPattern:
            () => points.join("")

    };
}



/*
    CREATE PATTERN
*/

const createDrawer =
    createPatternDrawer(

        "createPatternBox",

        "createDots",

        "createLines",

        pattern => {

            createPattern =
                pattern;


            if(
                createPattern &&
                createPattern.length >= 4
            ){

                document
                    .getElementById(
                        "createStatus"
                    )
                    .textContent =
                    "Pattern selected ✓";


                nextButton.disabled =
                    false;

            }else{

                document
                    .getElementById(
                        "createStatus"
                    )
                    .textContent =
                    "Pattern must contain at least 4 points.";


                nextButton.disabled =
                    true;
            }

        }

    );



/*
    REPEAT PATTERN
*/

const repeatDrawer =
    createPatternDrawer(

        "repeatPatternBox",

        "repeatDots",

        "repeatLines",

        pattern => {

            repeatPattern =
                pattern;


            if(
                repeatPattern &&
                repeatPattern ===
                createPattern
            ){

                document
                    .getElementById(
                        "repeatStatus"
                    )
                    .textContent =
                    "Pattern matched ✓";


                confirmButton.disabled =
                    false;

            }else{

                confirmButton.disabled =
                    true;


                if(!repeatPattern){

                    document
                        .getElementById(
                            "repeatStatus"
                        )
                        .textContent =
                        "Pattern must contain at least 4 points.";

                    return;
                }


                document
                    .getElementById(
                        "repeatStatus"
                    )
                    .textContent =
                    "Pattern does not match. Creating a new pattern...";


                repeatDrawer.showError();


                setTimeout(() => {

                    createPattern = "";

                    repeatPattern = "";


                    createDrawer.clear();

                    repeatDrawer.clear();


                    nextButton.disabled =
                        true;

                    confirmButton.disabled =
                        true;


                    document
                        .getElementById(
                            "createStatus"
                        )
                        .textContent = "";


                    document
                        .getElementById(
                            "repeatStatus"
                        )
                        .textContent = "";


                    showScreen(
                        "createScreen"
                    );

                },500);

            }

        }

    );



/*
    ACCESS PATTERN
*/

const accessDrawer =
    createPatternDrawer(

        "accessPatternBox",

        "accessDots",

        "accessLines",

        pattern => {

            if(pattern){

                verifyAccess(pattern);

            }

        }

    );



nextButton.addEventListener(
    "click",
    () => {

        if(
            !createPattern ||
            createPattern.length < 4
        ){

            return;
        }


        repeatPattern = "";


        repeatDrawer.clear();


        confirmButton.disabled =
            true;


        document
            .getElementById(
                "repeatStatus"
            )
            .textContent = "";


        showScreen(
            "repeatScreen"
        );

    }
);



confirmButton.addEventListener(
    "click",
    () => {

        if(
            !repeatPattern ||
            repeatPattern.length < 4
        ){

            return;
        }


        if(
            createPattern !==
            repeatPattern
        ){

            document
                .getElementById(
                    "repeatStatus"
                )
                .textContent =
                "Pattern does not match. Creating a new pattern...";


            confirmButton.disabled =
                true;


            repeatDrawer.showError();


            repeatPattern = "";


            setTimeout(() => {

                createPattern = "";


                createDrawer.clear();

                repeatDrawer.clear();


                nextButton.disabled =
                    true;


                document
                    .getElementById(
                        "createStatus"
                    )
                    .textContent = "";


                document
                    .getElementById(
                        "repeatStatus"
                    )
                    .textContent = "";


                showScreen(
                    "createScreen"
                );

            },500);


            return;
        }


        /*
            Pattern confirm হওয়া মাত্র saved pattern হিসেবে সেভ হবে।
        */

        localStorage.setItem(
            PATTERN_KEY,
            createPattern
        );

        resetAccessState();

        /*
            যদি গ্রাহক আগে থেকে রেজিস্টার্ড থাকেন, তবে সরাসরি হোম পেজে (main.html) চলে যাবে।
            অন্যথায় রেজিস্ট্রেশন পেজে যাবে।
        */
        const isRegistered = localStorage.getItem(USER_REGISTERED_KEY) === "true";

        if(isRegistered){
            goHome();
        } else {
            localStorage.removeItem(HOME_ACCESS_KEY);
            window.location.href = REGISTRATION_PAGE;
        }

    }
);



/*
    VERIFY ACCESS
*/

function verifyAccess(pattern){

    const savedPattern =
        localStorage.getItem(
            PATTERN_KEY
        );


    if(!savedPattern){

        showScreen(
            "createScreen"
        );

        return;
    }


    /*
        সঠিক প্যাটার্ন মিললে গ্রাহকের রেজিস্ট্রেশন স্ট্যাটাস চেক করবে
    */

    if(
        pattern === savedPattern
    ){

        const isRegistered = localStorage.getItem(USER_REGISTERED_KEY) === "true";

        if(isRegistered){
            goHome();
        } else {
            resetAccessState();
            window.location.href = REGISTRATION_PAGE;
        }

        return;
    }


    wrongAccessAttempt();
}



/*
    WRONG PATTERN SYSTEM
*/

function wrongAccessAttempt(){

    const attempts =
        getAttempts() + 1;


    accessDrawer.clear();


    document
        .getElementById(
            "accessStatus"
        )
        .textContent =
        "Incorrect pattern ✕";


    if(attempts >= 7){

        localStorage.setItem(
            ATTEMPT_KEY,
            String(attempts)
        );


        localStorage.setItem(
            BLOCKED_KEY,
            "true"
        );


        localStorage.removeItem(
            LOCK_UNTIL_KEY
        );


        clearInterval(
            countdownInterval
        );


        showScreen(
            "blockedScreen"
        );

        return;
    }


    localStorage.setItem(
        ATTEMPT_KEY,
        String(attempts)
    );


    const lockDuration =
        LOCK_TIMES[
            attempts
        ];


    const lockUntil =
        Date.now() +
        lockDuration;


    localStorage.setItem(
        LOCK_UNTIL_KEY,
        String(lockUntil)
    );


    startLiveCountdown(
        lockUntil
    );


    showScreen(
        "lockScreen"
    );
}



/*
    TIME FORMAT
*/

function formatTime(ms){

    const total =
        Math.max(
            0,
            Math.ceil(
                ms / 1000
            )
        );


    const h =
        Math.floor(
            total / 3600
        );


    const m =
        Math.floor(
            (total % 3600) / 60
        );


    const s =
        total % 60;


    if(h > 0){

        return [

            String(h).padStart(
                2,
                "0"
            ),

            String(m).padStart(
                2,
                "0"
            ),

            String(s).padStart(
                2,
                "0"
            )

        ].join(":");
    }


    return [

        String(m).padStart(
            2,
            "0"
        ),

        String(s).padStart(
            2,
            "0"
        )

    ].join(":");
}



/*
    LIVE LOCK COUNTDOWN
*/

function startLiveCountdown(
    lockUntil
){

    clearInterval(
        countdownInterval
    );


    function update(){

        const remaining =
            lockUntil -
            Date.now();


        if(remaining <= 0){

            clearInterval(
                countdownInterval
            );


            localStorage.removeItem(
                LOCK_UNTIL_KEY
            );


            accessDrawer.clear();


            document
                .getElementById(
                    "accessStatus"
                )
                .textContent =
                "";


            const attempts =
                getAttempts();


            document
                .getElementById(
                    "attemptsText"
                )
                .textContent =
                `Incorrect Attempts: ${attempts} / 7`;


            showScreen(
                "accessScreen"
            );


            return;
        }


        document
            .getElementById(
                "countdown"
            )
            .textContent =
            formatTime(
                remaining
            );
    }


    update();


    countdownInterval =
        setInterval(
            update,
            1000
        );
}



/*
    PAGE LOAD CHECK
*/

function checkAccount(){

    const savedPattern =
        localStorage.getItem(
            PATTERN_KEY
        );


    const blocked =
        localStorage.getItem(
            BLOCKED_KEY
        ) === "true";


    const lockUntil =
        parseInt(

            localStorage.getItem(
                LOCK_UNTIL_KEY
            ) || "0",

            10

        );


    if(blocked){

        showScreen(
            "blockedScreen"
        );

        return;
    }


    if(!savedPattern){

        nextButton.disabled =
            true;

        confirmButton.disabled =
            true;


        createPattern = "";

        repeatPattern = "";


        showScreen(
            "createScreen"
        );

        return;
    }


    if(
        lockUntil > Date.now()
    ){

        startLiveCountdown(
            lockUntil
        );


        showScreen(
            "lockScreen"
        );

        return;
    }


    if(
        lockUntil &&
        lockUntil <= Date.now()
    ){

        localStorage.removeItem(
            LOCK_UNTIL_KEY
        );
    }


    const attempts =
        getAttempts();


    document
        .getElementById(
            "attemptsText"
        )
        .textContent =
        `Incorrect Attempts: ${attempts} / 7`;


    showScreen(
        "accessScreen"
    );
}



document.addEventListener(
    "visibilitychange",
    () => {

        if(
            document.visibilityState !==
            "visible"
        ){

            return;
        }


        const blocked =
            localStorage.getItem(
                BLOCKED_KEY
            ) === "true";


        if(blocked){

            showScreen(
                "blockedScreen"
            );

            return;
        }


        const lockUntil =
            parseInt(

                localStorage.getItem(
                    LOCK_UNTIL_KEY
                ) || "0",

                10

            );


        if(
            lockUntil > Date.now()
        ){

            startLiveCountdown(
                lockUntil
            );


            showScreen(
                "lockScreen"
            );

        }


        else if(lockUntil){

            clearInterval(
                countdownInterval
            );


            localStorage.removeItem(
                LOCK_UNTIL_KEY
            );


            const attempts =
                getAttempts();


            document
                .getElementById(
                    "attemptsText"
                )
                .textContent =
                `Incorrect Attempts: ${attempts} / 7`;


            accessDrawer.clear();


            document
                .getElementById(
                    "accessStatus"
                )
                .textContent =
                "";


            showScreen(
                "accessScreen"
            );
        }

    }
);



/*
    Initial Page Load
*/

checkAccount();
