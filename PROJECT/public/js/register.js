const logoutButton = document.getElementById("logout");
const registerButton = document.getElementById("RegisterButton");
const loginButton = document.getElementById("LoginButton");

console.log({ registerButton, loginButton });

if (registerButton) {
    registerButton.addEventListener("click", (event) => {
        console.log("Register button clicked");
        register(event);
    });
} else {
    console.error("RegisterButton not found in the DOM.");
}

if (loginButton) {
    loginButton.addEventListener("click", (event) => {
        console.log("Login button clicked");
        login(event);
    });
} else {
    console.error("LoginButton not found in the DOM.");
}
if (logoutButton) {
    logoutButton.addEventListener("click", (event) => {
        console.log("Logout button clicked");
        logout(event);
    });
} else {
    console.error("LogoutButton not found in the DOM.");
}

//---------------Register

async function register(event) {
    event.preventDefault(); // Prevent the form from reloading the page
    console.log("Register function called."); // Debugging log

    // Retrieve form data
    const fullname = document.getElementById("fullname").value.trim();
    const email = document.getElementById("email").value.trim();
    const password = document.getElementById("password").value;
    const phone = document.getElementById("phone").value.trim();
    const address = document.getElementById("address").value.trim();

    console.log("Form data:", { fullname, email, password, phone, address }); // Debugging log

    // Frontend Validations
    if (!fullname || !email || !password || !phone || !address) {
        alert("All fields are required. Please fill out the form completely.");
        return;
    }

    if (!validateEmail(email)) {
        alert("Please enter a valid email address.");
        return;
    }

    if (!validatePassword(password)) {
        alert(
            "Password must be at least 8 characters long, contain a mix of uppercase, lowercase, numbers, and special characters."
        );
        return;
    }

    if (!validatePhone(phone)) {
        alert("Please enter a valid 10-digit phone number.");
        return;
    }

    try {
        // Make the POST request
        console.log("Sending POST request to /register/users...");
        const response = await fetch("http://localhost:3000/home/register/users", {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
            },
            body: JSON.stringify({ fullname, email, password, phone, address }),
        });

        console.log("Response received:", response); // Debugging log
        if (response.ok) {
            console.log("Registration successful. Clearing input fields."); // Debugging log
            alert("User registered successfully!");
            window.location.href = "http://localhost:3000/home/login"; // Redirect to login

            // Clear fields only after successful registration
            document.getElementById("fullname").value = "";
            document.getElementById("email").value = "";
            document.getElementById("password").value = "";
            document.getElementById("phone").value = "";
            document.getElementById("address").value = "";
        } else {
            // Log and handle server error response
            const errorMessage = await response.json();
            console.error("Server responded with an error:", errorMessage); // Debugging log
            alert(`Registration failed: ${errorMessage.message}`);
        }
    } catch (error) {
        // Log and handle network errors
        console.error("Error occurred during fetch:", error); // Debugging log
        alert("An error occurred while registering. Please try again.");
    }
}

// Helper functions
function validateEmail(email) {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
}

function validatePassword(password) {
    const passwordRegex =
        /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,}$/;
    return passwordRegex.test(password);
}

function validatePhone(phone) {
    const phoneRegex = /^\d{10}$/; // 10-digit phone number
    return phoneRegex.test(phone);
}
//-------------Login

async function login(event) {
    event.preventDefault(); // Prevent the form from reloading the page
    console.log("Login function called."); // Debugging log

    // Retrieve form data
    const email = document.getElementById("email").value.trim();
    const password = document.getElementById("password").value;

    console.log("Login form data:", { email, password }); // Debugging log

    if (email == "Admin@gmail.com" && password == "admin") {
        window.location.href = "http://localhost:3000/admin"
        return
    }
    // Frontend Validations
    if (!email || !password) {
        alert("Please fill out both email and password.");
        return;
    }

    if (!validateEmail(email)) {
        alert("Please enter a valid email address.");
        return;
    }
    try {
        // Make the POST request
        console.log("Sending POST request to /login/users...");
        const response = await fetch("http://localhost:3000/home/login/users", {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
            },
            body: JSON.stringify({ email, password }),
        });

        console.log("Response received:", response); // Debugging log

        if (response.ok) {
            const responseData = await response.json();
            console.log("Login successful:", responseData); // Debugging log
            // Redirect to home or dashboard
            window.location.href = "http://localhost:3000/home";
        } else {
            // Handle server error response
            const errorMessage = await response.json();
            console.error("Server responded with an error:", errorMessage); // Debugging log
            alert(`Login failed: ${errorMessage.message}`);
        }
    } catch (error) {
        // Handle network errors
        console.error("Error occurred during fetch:", error); // Debugging log
        alert("An error occurred while logging in. Please try again.");
    }
}
async function logout(event) {
    event.preventDefault(); // Prevent the default action of the button

    try {
        console.log("Sending POST request to /logout...");

        // Make the POST request to the logout route
        const response = await fetch("http://localhost:3000/home/logout", {
            method: "GET", // Assuming you're using GET for logout based on your server route
            headers: {
                "Content-Type": "application/json",
            },
        });

        console.log("Response received:", response); // Debugging log

        if (response.ok) {
            console.log("Logout successful."); // Debugging log
            window.location.href = "http://localhost:3000/home/login"; // Redirect to login page
        } else {
            // Handle server error response
            const errorMessage = await response.json();
            console.error("Server responded with an error:", errorMessage); // Debugging log
            alert(`Logout failed: ${errorMessage.message}`);
        }
    } catch (error) {
        // Handle network errors
        console.error("Error occurred during fetch:", error); // Debugging log
        alert("An error occurred while logging out. Please try again.");
    }
}
