const form = document.getElementById("campaignForm");

form.addEventListener("submit", (e) => {
  const inputs = form.querySelectorAll("input[required]");
  let valid = true;

  inputs.forEach((input) => {
    if (!input.value.trim()) {
      input.style.border = "2px solid black";
      valid = false;
    } else {
      input.style.border = "2px solid green";
    }
  });

  if (!valid) {
    e.preventDefault();
    alert("Please fill out all required fields.");
  }
});
