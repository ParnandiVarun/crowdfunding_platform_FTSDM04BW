import {
  doc,
  getDocs,
  setDoc,
  addDoc,
  collection,
  query,
  orderBy,
  updateDoc,
  increment,
} from "https://www.gstatic.com/firebasejs/11.6.0/firebase-firestore.js";
import { db } from "./firebase-config.js";
const campaignData = {
  title: "Support John's Surgery",
  goal: 50000,
  mobileNumber: "1234567890",
  phonePe: "phonepe@upi",
  gpay: "gpay@upi",
};

document.getElementById("campaignTitle").innerText = campaignData.title;
document.getElementById(
  "campaignGoal"
).innerText = `Goal: ₹${campaignData.goal}`;

document.getElementById("donorForm").addEventListener("submit", function (e) {
  e.preventDefault();
  const name = document.getElementById("name").value;
  const email = document.getElementById("email").value;
  const donationAmount = parseFloat(
    document.getElementById("donationAmount").value
  );

  if (name && email && !isNaN(donationAmount) && donationAmount > 0) {
    localStorage.setItem(
      "paymentInfo",
      JSON.stringify({
        name,
        email,
        donationAmount,
      })
    );

    document.querySelector(".donor-info").style.display = "none";
    document.querySelector(".payment-info").style.display = "block";
  } else {
    alert("Please fill in all fields with valid information.");
  }
});

let selectedPaymentMethod = "";

document.getElementById("phonepe").addEventListener("click", () => {
  selectPayment("phonepe");
});
document.getElementById("gpay").addEventListener("click", () => {
  selectPayment("gpay");
});
document.getElementById("upi").addEventListener("click", () => {
  selectPayment("upi");
});

function selectPayment(paymentMethod) {
  console.log("data");
  const paymentInfo = JSON.parse(localStorage.getItem("paymentInfo"));
  const donationAmount = paymentInfo?.donationAmount || 0;
  selectedPaymentMethod = paymentMethod;
  const paymentDetails = document.getElementById("paymentDetails");

  if (paymentMethod === "phonepe") {
    paymentDetails.innerHTML = `Please send ₹ ${donationAmount} to PhonePe number: ${campaignData.phonePe}`;
  } else if (paymentMethod === "gpay") {
    paymentDetails.innerHTML = `Please send ₹ ${donationAmount} to Google Pay number: ${campaignData.gpay}`;
  } else if (paymentMethod === "upi") {
    paymentDetails.innerHTML = `Please send ₹ ${donationAmount} to UPI ID: ${campaignData.mobileNumber}`;
  }

  document.querySelector(".payment-info").style.display = "none";
  document.querySelector(".confirmation").style.display = "block";
}

document.getElementById("completeDonation").addEventListener("click", () => {
  completeDonation();
});

async function completeDonation() {
  const collectionRef = collection(db, "campaign");

  const campaignId = localStorage.getItem("campaignId");

  console.log(campaignId);

  const paymentInfo = localStorage.getItem("paymentInfo");
  const donationAmount = paymentInfo?.donationAmount || 0;
  const docRef = doc(collectionRef, campaignId);
  try {
    await updateDoc(docRef, {
      donatedAmount: increment(donationAmount),
    });
    console.log("Campaign Created Successfully!");

    alert(
      "Thank you for your donation! Your payment has been successfully processed."
    );
  } catch (error) {
    console.log(error?.message);
    console.log("Error while processing donation!", error);

    alert("Error while processing donation!");
  }

  window.location.href = "index.html";
}
