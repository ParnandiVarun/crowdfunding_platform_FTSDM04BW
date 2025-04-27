import { db } from "../firebase-config.js";
import {
  collection,
  query,
  getDocs,
  orderBy,
  updateDoc,
  doc,
  deleteDoc,
} from "https://www.gstatic.com/firebasejs/11.6.0/firebase-firestore.js";

const campaignsContainer = document.getElementById("campaignsContainer");
const searchInput = document.getElementById("searchInput");

const fetchCampaigns = async () => {
  try {
    const q = query(collection(db, "campaign"), orderBy("createdAt", "desc"));
    const snapshot = await getDocs(q);
    const campaigns = snapshot.docs.map((doc) => ({
      id: doc.id,
      ...doc.data(),
    }));
    renderCampaigns(campaigns);
  } catch (error) {
    console.error("Error fetching campaigns:", error);
  }
};

const renderCampaigns = (campaigns) => {
  const searchText = searchInput.value.toLowerCase();
  const filteredCampaigns = campaigns.filter(
    (campaign) =>
      campaign.title.toLowerCase().includes(searchText) ||
      campaign.description.toLowerCase().includes(searchText)
  );

  if (filteredCampaigns.length === 0) {
    campaignsContainer.innerHTML = `<p>No campaigns found.</p>`;
  } else {
    campaignsContainer.innerHTML = filteredCampaigns
      .map((campaign) => {
        const {
          title,
          description,
          person,
          relation,
          goal,
          mediaUrl,
          raiseAmount,
          mobileNumber,
          phonePeDetails,
          gpayDetails,
        } = campaign;

        const validRaiseAmount = isNaN(raiseAmount) ? 0 : raiseAmount;
        const validGoal = goal || 1;
        const progress = Math.min(
          (validRaiseAmount / validGoal) * 100,
          100
        ).toFixed(1);

        const imageUrl =
          mediaUrl ||
          "https://dummyimage.com/300x200/cccccc/000000&text=No+Image";

        return `
          <div class="card fade-in" data-id="${campaign.id}">
          <div class="div-img">
          <img src="${imageUrl}" alt="${title}" />
          </div>  
            <div class="info">
              <p><strong>Title:</strong> ${title}</p>
              <p><strong>Description:</strong> ${description}</p>
              <p><strong>Person:</strong> ${person}</p>
              <p><strong>Relationship:</strong> ${relation}</p>
              <p><strong>Goal:</strong> ₹${validGoal}</p>
              <div class="progress-bar">
                <div class="progress-fill" style="width: ${progress}%;">${progress}%</div>
              </div>
            </div>
            <div class="actions">
              <button class="edit-btn">Edit</button>
              <button class="delete-btn">Delete</button>
            </div>
            <div class="donate-action">
              <button class="donate-btn"><a href="payment.html">Donate Now</a></button>
            </div>
          </div>
        `;
      })
      .join("");

    document.querySelectorAll(".delete-btn").forEach((button) => {
      button.addEventListener("click", () => {
        const campaignId = button.closest(".card").dataset.id;
        if (campaignId) {
          deleteCampaign(campaignId);
        } else {
          console.error("Campaign ID is missing");
        }
      });
    });

    document.querySelectorAll(".donate-btn").forEach((button) => {
      button.addEventListener("click", () => {
        const campaignId = button.closest(".card").dataset.id;
        console.log(campaignId);
        localStorage.setItem("campaignId", campaignId);

        const campaign = filteredCampaigns.find(
          (campaign) => campaign.id === campaignId
        );
        donateToCampaign(campaign);
        window.location.href = `payment.html?campaignId=${
          campaign.id
        }&title=${encodeURIComponent(campaign.title)}&goal=${
          campaign.goal
        }&mobile=${encodeURIComponent(
          campaign.mobileNumber
        )}&phonePe=${encodeURIComponent(
          campaign.phonePeDetails
        )}&gpay=${encodeURIComponent(campaign.gpayDetails)}`;
      });
    });
  }
};

const deleteCampaign = async (id) => {
  try {
    if (!id) {
      throw new Error("Invalid campaign ID");
    }

    const campaignRef = doc(db, "campaign", id);
    await deleteDoc(campaignRef);
    alert("Campaign deleted successfully!");
    fetchCampaigns();
  } catch (error) {
    console.error("Error deleting campaign:", error);
    alert("Failed to delete campaign. Please try again.");
  }
};

searchInput.addEventListener("input", () => {
  fetchCampaigns();
});

fetchCampaigns();
