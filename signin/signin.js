const registerForm = document.getElementById("registerForm");
const createAccountBtn = document.getElementById("createAccountBtn");

const passwordInput = document.getElementById("password");
const confirmPasswordInput = document.getElementById("confirmPassword");
const passwordError = document.getElementById("passwordError");

// =======================
// PASSWORD VALIDATION
// =======================

function validatePasswords() {
  if (!passwordError) return;

  if (confirmPasswordInput.value === "") {
    passwordError.textContent = "";
    return;
  }

  if (passwordInput.value !== confirmPasswordInput.value) {
    passwordError.textContent = "Passwords do not match!";
    passwordError.style.color = "red";
  } else {
    passwordError.textContent = "Passwords match!";
    passwordError.style.color = "green";
  }
}

passwordInput.addEventListener("input", validatePasswords);
confirmPasswordInput.addEventListener("input", validatePasswords);

// =======================
// REGISTER FORM SUBMIT
// =======================

registerForm.addEventListener("submit", async (event) => {
  event.preventDefault();

  createAccountBtn.disabled = true;
  createAccountBtn.textContent = "Creating Account...";

  const fullName = document.getElementById("fullName").value.trim();
  const email = document.getElementById("email").value.trim();
  const phone = document.getElementById("phone").value.trim();

  const password = passwordInput.value;
  const confirmPassword = confirmPasswordInput.value;

  // Empty field validation
  if (!fullName || !email || !phone || !password || !confirmPassword) {
    alert("Please fill in all fields.");
    resetButton();
    return;
  }

  // Email validation
  const emailPattern = /^[^\s@]+@[^\s@]+.[^\s@]+$/;

  if (!emailPattern.test(email)) {
    alert("Please enter a valid email address.");
    resetButton();
    return;
  }

  // Password validation
  const passwordPattern =
    /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&]).{8,}$/;

  if (!passwordPattern.test(password)) {
    alert(
      "Password must contain at least 8 characters, one uppercase letter, one lowercase letter, one number and one special character.",
    );
    resetButton();
    return;
  }

  // Confirm password validation
  if (password !== confirmPassword) {
    alert("Passwords do not match.");
    resetButton();
    return;
  }

  try {
    const response = await fetch(
      "https://tax-system-backend.onrender.com/api/auth/sign_up",
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        credentials: "include",
        body: JSON.stringify({
          fullName,
          email,
          phone,
          password,
        }),
      },
    );

    const data = await response.json();

if (response.ok && data.success) {
  alert("Account created successfully!");

  if (data.data) {
    localStorage.setItem("user", JSON.stringify(data.data));
  }

  registerForm.reset();

  if (passwordError) {
    passwordError.textContent = "";
  }

  window.location.href = "/login/index.html";
} else {
  alert(data.message || "Registration failed.");
}
  } catch (error) {
    console.error("Registration Error:", error);
    alert("Unable to connect to the server. Please try again later.");
  } finally {
    resetButton();
  }
});

// =======================
// BUTTON RESET
// =======================

function resetButton() {
  createAccountBtn.disabled = false;
  createAccountBtn.textContent = "Create Account";
}

// =======================
// GOOGLE SIGN IN
// =======================

window.addEventListener("load", () => {
  if (
    typeof google !== "undefined" &&
    document.getElementById("google-signin-button")
  ) {
    google.accounts.id.initialize({
      client_id: "YOUR_GOOGLE_CLIENT_ID.apps.googleusercontent.com",
      callback: handleGoogleResponse,
    });

    google.accounts.id.renderButton(
      document.getElementById("google-signin-button"),
      {
        theme: "outline",
        size: "large",
        text: "continue_with",
        shape: "rectangular",
        width: "300",
      }
    );
  }
});

function handleGoogleResponse(response) {
  console.log("Google Login Success:", response);

  fetch("https://tax-system-backend.onrender.com/api/auth/google", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    credentials: "include",
    body: JSON.stringify({
      credential: response.credential,
    }),
  })
    .then((res) => res.json())
    .then((data) => {
      if (data.success) {
        localStorage.setItem("user", JSON.stringify(data.data));
        window.location.href = "/dashboard/index.html";
      } else {
        alert(data.message || "Google login failed.");
      }
    })
    .catch((error) => {
      console.error("Google Login Error:", error);
      alert("Google login failed.");
    });
}
