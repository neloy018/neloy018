/* =====================================================
   MY WEBSITE - MAIN SCRIPT
   Registration + Login + Home Access System
===================================================== */

/* =====================================================
   STORAGE KEYS
===================================================== */
const USERS_KEY = "mywebsite_registered_users";
const CURRENT_USER_KEY = "mywebsite_current_user";
const HOME_ACCESS_KEY = "portal_home_access_granted";

/* =====================================================
   GET ALL REGISTERED USERS
===================================================== */
function getUsers() {
    try {
        const users = JSON.parse(localStorage.getItem(USERS_KEY));
        return Array.isArray(users) ? users : [];
    } catch (error) {
        return [];
    }
}

/* =====================================================
   SAVE ALL USERS
===================================================== */
function saveUsers(users) {
    localStorage.setItem(USERS_KEY, JSON.stringify(users));
}

/* =====================================================
   NORMALIZE TEXT
===================================================== */
function normalize(value) {
    return String(value || "").trim().toLowerCase();
}

/* =====================================================
   FIND USER BY USERNAME OR EMAIL
===================================================== */
function findUser(identifier) {
    const users = getUsers();
    const searchValue = normalize(identifier);

    return users.find(
        user => normalize(user.username) === searchValue || normalize(user.email) === searchValue
    );
}

/* =====================================================
   REGISTER USER
===================================================== */
function registerUser(username, email, password) {
    username = String(username || "").trim();
    email = String(email || "").trim();
    password = String(password || "").trim();

    /* Required fields */
    if (!username || !email || !password) {
        return { success: false, message: "Please fill in all required fields." };
    }

    const users = getUsers();

    /* Duplicate username */
    const usernameExists = users.some(user => normalize(user.username) === normalize(username));
    if (usernameExists) {
        return { success: false, message: "This username is already registered." };
    }

    /* Duplicate email */
    const emailExists = users.some(user => normalize(user.email) === normalize(email));
    if (emailExists) {
        return { success: false, message: "This email is already registered." };
    }

    /* Create user object */
    const newUser = {
        id: Date.now(),
        username: username,
        email: email,
        password: password,
        registeredAt: new Date().toISOString()
    };

    /* Save */
    users.push(newUser);
    saveUsers(users);

    return { success: true, message: "Registration successful!" };
}

/* =====================================================
   LOGIN USER
===================================================== */
function loginUser(identifier, password) {
    identifier = String(identifier || "").trim();
    password = String(password || "").trim();

    /* Empty fields */
    if (!identifier || !password) {
        return { success: false, message: "Please enter your username/email and password." };
    }

    /* Find registered account */
    const user = findUser(identifier);

    if (!user) {
        return { success: false, message: "No registered account found. Please create a new account first." };
    }

    /* Password check */
    if (user.password !== password) {
        return { success: false, message: "Incorrect password." };
    }

    /* LOGIN SUCCESS */
    localStorage.setItem(
        CURRENT_USER_KEY,
        JSON.stringify({
            id: user.id,
            username: user.username,
            email: user.email
        })
    );
    localStorage.setItem(HOME_ACCESS_KEY, "true");

    return { success: true, message: "Login successful!" };
}

/* =====================================================
   DOM EVENT LISTENERS (AUTOMATIC FORM HANDLING)
===================================================== */
document.addEventListener("DOMContentLoaded", function () {
    
    // 1. Registration Form Listener
    const registerForm = document.getElementById("registerForm");
    if (registerForm) {
        registerForm.addEventListener("submit", function (e) {
            e.preventDefault();

            const usernameInput = document.getElementById("username")?.value;
            const emailInput = document.getElementById("email")?.value;
            const passwordInput = document.getElementById("password")?.value;

            const result = registerUser(usernameInput, emailInput, passwordInput);
            alert(result.message);

            if (result.success) {
                window.location.href = "login.html"; // Redirect to Login Page
            }
        });
    }

    // 2. Login Form Listener
    const loginForm = document.getElementById("loginForm");
    if (loginForm) {
        loginForm.addEventListener("submit", function (e) {
            e.preventDefault();

            // Support inputs with id 'email', 'username' or 'identifier'
            const identifierInput = 
                document.getElementById("email")?.value || 
                document.getElementById("username")?.value || 
                document.getElementById("identifier")?.value;

            const passwordInput = document.getElementById("password")?.value;

            const result = loginUser(identifierInput, passwordInput);
            alert(result.message);

            if (result.success) {
                window.location.href = "home.html"; // Redirect to Home Page
            }
        });
    }
});
