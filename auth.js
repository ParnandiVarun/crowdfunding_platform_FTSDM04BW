import { auth, db } from "../firebase-config.js";

import {
  signInWithEmailAndPassword,
  createUserWithEmailAndPassword,
  signOut,
} from "https://www.gstatic.com/firebasejs/11.6.0/firebase-auth.js";

import {
  doc,
  getDoc,
  setDoc,
} from "https://www.gstatic.com/firebasejs/11.6.0/firebase-firestore.js";

document.addEventListener("DOMContentLoaded", () => {
  const loginBtn = document.getElementById("login-btn");
  const signupBtn = document.getElementById("signup-btn");
  const logoutBtn = document.getElementById("logout-btn");

  const loginEmail = document.getElementById("login-email");
  const loginPassword = document.getElementById("login-password");

  if (loginEmail) loginEmail.value = "";
  if (loginPassword) loginPassword.value = "";

  if (loginBtn) {
    loginBtn.addEventListener("click", async () => {
      const email = loginEmail.value;
      const password = loginPassword.value;
      try {
        await signInWithEmailAndPassword(auth, email, password);
        window.open("index.html", "_blank");
      } catch (error) {
        document.getElementById("login-message").innerText = error.message;
      }
    });
  }

  const signupEmail = document.getElementById("signup-email");
  const signupPassword = document.getElementById("signup-password");
  const roleInput = document.getElementById("role");

  if (signupEmail) signupEmail.value = "";
  if (signupPassword) signupPassword.value = "";
  if (roleInput) roleInput.value = "";

  if (signupBtn) {
    signupBtn.addEventListener("click", async () => {
      const email = signupEmail.value;
      const password = signupPassword.value;
      const role = roleInput.value;
      try {
        const userCredentials = await createUserWithEmailAndPassword(
          auth,
          email,
          password
        );

        await setDoc(doc(db, "users", userCredentials.user.uid), {
          email,
          role,
        });

        window.location.href = "login.html";
      } catch (error) {
        document.getElementById("signup-message").innerText = error.message;
      }
    });
  }

  if (logoutBtn) {
    console.log("clicked");
    logoutBtn.addEventListener("click", async () => {
      await signOut(auth);
      window.location.href = "login.html";
    });
  }

  // Prevent Enter key from submitting forms accidentally
  document.addEventListener("keydown", (e) => {
    if (e.key === "Enter") {
      e.preventDefault();
    }
  });
});

// Ensures inputs are cleared even if page is loaded from cache (e.g., back button)
window.onpageshow = function (event) {
  if (event.persisted) {
    const loginEmail = document.getElementById("login-email");
    const loginPassword = document.getElementById("login-password");
    const signupEmail = document.getElementById("signup-email");
    const signupPassword = document.getElementById("signup-password");
    const roleInput = document.getElementById("role");

    if (loginEmail) loginEmail.value = "";
    if (loginPassword) loginPassword.value = "";
    if (signupEmail) signupEmail.value = "";
    if (signupPassword) signupPassword.value = "";
    if (roleInput) roleInput.value = "";
  }
};
