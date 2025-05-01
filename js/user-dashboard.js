import { db } from "./firebase-config.js";
import { doc, getDoc } from "https://www.gstatic.com/firebasejs/10.11.0/firebase-firestore.js";

// Get UID from session
const uid = sessionStorage.getItem("uid");

if (!uid) {
  alert("Please login first.");
  window.location.href = "login.html";
}

// Fetch user details
async function loadUserData() {
  try {
    const docRef = doc(db, "users", uid);
    const docSnap = await getDoc(docRef);

    if (docSnap.exists()) {
      const data = docSnap.data();
      document.getElementById("name").textContent = data.name;
      document.getElementById("email").textContent = data.email;
      document.getElementById("phone").textContent = data.phone;
      document.getElementById("address").textContent = data.address;
      document.getElementById("remaining").textContent = data.remainingQuota ?? 12;
 // default 12
    } else {
      alert("User data not found!");
    }
  } catch (error) {
    console.error("Error loading user data:", error);
  }
}

loadUserData();
