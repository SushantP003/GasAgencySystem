import { db } from "./firebase-config.js";
import {
  collection,
  query,
  where,
  getDocs,
  Timestamp,
} from "https://www.gstatic.com/firebasejs/10.11.0/firebase-firestore.js";

const uid = sessionStorage.getItem("uid");
if (!uid) {
  alert("Please login first.");
  window.location.href = "login.html";
}

const historyBody = document.getElementById("historyBody");

async function loadHistory() {
  const q = query(collection(db, "bookings"), where("userId", "==", uid));
  const snapshot = await getDocs(q);

  snapshot.forEach(doc => {
    const data = doc.data();
    const tr = document.createElement("tr");

    const requestedDate = data.requestedAt?.toDate().toLocaleDateString() || "-";
    const payment = data.paymentMethod;
    const status = data.status;
    const deliveryDate = data.deliveryDate ? data.deliveryDate.toDate().toLocaleDateString() : "-";

    tr.innerHTML = `
      <td>${requestedDate}</td>
      <td>${payment}</td>
      <td>${status}</td>
      <td>${status === "approved" || status === "delivered" ? deliveryDate : "-"}</td>
    `;

    historyBody.appendChild(tr);
  });
}

loadHistory();
