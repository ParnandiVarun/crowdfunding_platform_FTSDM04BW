import {
  doc,
  getDocs,
  setDoc,
  addDoc,
  collection,
  query,
  orderBy,
} from "https://www.gstatic.com/firebasejs/11.6.0/firebase-firestore.js";
import { db, storage } from "./firebase-config.js";

import {
  ref,
  uploadBytesResumable,
  getDownloadURL,
} from "https://www.gstatic.com/firebasejs/11.6.0/firebase-storage.js";

const form = document.getElementById("campaignForm");

form.addEventListener("submit", async (e) => {
  e.preventDefault();

  let title = document.getElementById("title").value;
  let description = document.getElementById("description").value;
  let person = document.getElementById("person").value;
  let relation = document.getElementById("relation").value;
  let goal = document.getElementById("goal").value;
  let mediaUpload = document.getElementById("mediaUpload");

  const file = mediaUpload.files[0];
  if (!file) {
    alert("Please upload an image or video!");
    return;
  }

  const fileName = file.name;
  const storageRef = ref(storage, `campaigns/${fileName}`);
  const uploadTask = uploadBytesResumable(storageRef, file);

  uploadTask.on(
    "state_changed",
    (snapshot) => {
      const progress = (snapshot.bytesTransferred / snapshot.totalBytes) * 100;
      console.log("Upload is " + progress + "% done");
    },
    (error) => {
      console.error("Error uploading media:", error);
    },
    () => {
      getDownloadURL(uploadTask.snapshot.ref).then(async (downloadURL) => {
        let campaignData = {
          title,
          description,
          person,
          relation,
          goal,
          mediaUrl: downloadURL || null,
          createdAt: new Date(),
        };

        const collectionRef = collection(db, "campaign");

        try {
          await addDoc(collectionRef, campaignData);
          console.log("Campaign Created Successfully!");
          alert("Campaign Created Successfully!");
          form.reset();
          window.location.href = "./donate.html";
        } catch (error) {
          console.error("Error creating campaign:", error);
          alert("Failed to create campaign. Please try again.");
        }
      });
    }
  );

  const requiredInputs = form.querySelectorAll("input[required]");
  let valid = true;

  requiredInputs.forEach((input) => {
    if (!input.value.trim()) {
      input.style.border = "2px solid red";
      valid = false;
    } else {
      input.style.border = "2px solid green";
    }
  });

  if (!valid) {
    alert("Please fill out all required fields properly.");
  }
});
