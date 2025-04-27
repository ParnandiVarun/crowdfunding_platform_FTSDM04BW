import { initializeApp } from "https://www.gstatic.com/firebasejs/11.6.0/firebase-app.js";

import { getAuth } from "https://www.gstatic.com/firebasejs/11.6.0/firebase-auth.js";
import { getFirestore } from "https://www.gstatic.com/firebasejs/11.6.0/firebase-firestore.js";
import { getStorage } from "https://www.gstatic.com/firebasejs/11.6.0/firebase-storage.js";

const firebaseConfig = {
  apiKey: "AIzaSyCeqiXXIlzhAZXQHhzZKM-CVN0DbkZt4n0",
  authDomain: "crowdfunding-platform-67ab1.firebaseapp.com",
  projectId: "crowdfunding-platform-67ab1",
  storageBucket: "crowdfunding-platform-67ab1.firebasestorage.app",

  messagingSenderId: "465230025150",
  appId: "1:465230025150:web:c76f3ed16b229604be69ef",
  measurementId: "G-RBFR3FFP0Q",
};

const app = initializeApp(firebaseConfig);

export const auth = getAuth(app);

export const db = getFirestore(app);

export const storage = getStorage(app);
