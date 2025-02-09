document.addEventListener("DOMContentLoaded", () => {
    // Register Form Submission
    const registerForm = document.querySelector("#register-form");
    if (registerForm) {
        registerForm.addEventListener("submit", async (e) => {
            e.preventDefault();

            const username = document.querySelector("#register-username").value.trim();
            const password = document.querySelector("#register-password").value.trim();

            if (!username || !password) {
                alert("Username and password are required!");
                return;
            }

            try {
                const response = await fetch("http://localhost:3000/api/register", {
                    method: "POST",
                    headers: { "Content-Type": "application/json" },
                    body: JSON.stringify({ username, password })
                });

                const data = await response.json();
                alert(data.message || data.error);

                if (response.ok) {
                    window.location.href = "login.html"; // Redirect to login page after successful registration
                }
            } catch (error) {
                console.error("Registration Error:", error);
                alert("An error occurred while registering.");
            }
        });
    }

    // Login Form Submission
    const loginForm = document.querySelector("#login-form");
    if (loginForm) {
        loginForm.addEventListener("submit", async (e) => {
            e.preventDefault();

            const username = document.querySelector("#login-username").value.trim();
            const password = document.querySelector("#login-password").value.trim();

            if (!username || !password) {
                alert("Username and password are required!");
                return;
            }

            try {
                const response = await fetch("http://localhost:3000/api/login", {
                    method: "POST",
                    headers: { "Content-Type": "application/json" },
                    body: JSON.stringify({ username, password })
                });

                const data = await response.json();
                alert(data.message || data.error);

                if (response.ok) {
                    localStorage.setItem("user", username); // Store user in localStorage
                    window.location.href = "index.html"; // Redirect to home page after successful login
                }
            } catch (error) {
                console.error("Login Error:", error);
                alert("An error occurred while logging in.");
            }
        });
    }

    // Logout Functionality
    const logoutBtn = document.querySelector("#logout-btn");
    if (logoutBtn) {
        logoutBtn.addEventListener("click", () => {
            localStorage.removeItem("user");
            alert("Logged out successfully!");
            window.location.href = "login.html"; // Redirect to login page after logout
        });
    }

    // Check If User is Logged In (For Navigation)
    const user = localStorage.getItem("user");
    const userGreeting = document.querySelector("#user-greeting");
    if (user && userGreeting) {
        userGreeting.textContent = `Welcome, ${user}!`;
        document.querySelector("#login-link").style.display = "none";
        document.querySelector("#register-link").style.display = "none";
        document.querySelector("#logout-btn").style.display = "block";
    }
});
