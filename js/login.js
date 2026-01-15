import {
  signInWithEmailAndPassword,
  onAuthStateChanged,
} from "https://www.gstatic.com/firebasejs/10.7.1/firebase-auth.js";

const auth = window.firebaseAuth;

// Check if user is already logged in
onAuthStateChanged(auth, (user) => {
  if (user) {
    window.location.href = "/dashboard.html";
  }
});

// Login form handler
const loginForm = document.getElementById("loginForm");
const errorMessage = document.getElementById("errorMessage");
const loginBtn = document.getElementById("loginBtn");
const btnText = loginBtn.querySelector(".btn-text");
const btnLoader = loginBtn.querySelector(".btn-loader");

loginForm.addEventListener("submit", async (e) => {
  e.preventDefault();

  const email = document.getElementById("email").value;
  const password = document.getElementById("password").value;

  // Show loading state
  loginBtn.disabled = true;
  btnText.style.display = "none";
  btnLoader.style.display = "inline-block";
  errorMessage.style.display = "none";

  try {
    await signInWithEmailAndPassword(auth, email, password);
    // Redirect will be handled by onAuthStateChanged
  } catch (error) {
    console.error("Login error:", error);
    errorMessage.textContent = getErrorMessage(error.code);
    errorMessage.style.display = "block";

    // Reset button state
    loginBtn.disabled = false;
    btnText.style.display = "inline-block";
    btnLoader.style.display = "none";
  }
});

function getErrorMessage(errorCode) {
  switch (errorCode) {
    case "auth/invalid-email":
      return "Invalid email address.";
    case "auth/user-disabled":
      return "This account has been disabled.";
    case "auth/user-not-found":
      return "No account found with this email.";
    case "auth/wrong-password":
      return "Incorrect password.";
    case "auth/invalid-credential":
      return "Invalid email or password.";
    default:
      return "Login failed. Please try again.";
  }
}
