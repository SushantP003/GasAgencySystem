import { db } from "./firebase-config.js";
import {
  collection,
  query,
  where,
  getDocs,
} from "https://www.gstatic.com/firebasejs/10.11.0/firebase-firestore.js";

const billingTable = document.getElementById("billingTable");
const totalRevenueEl = document.getElementById("totalRevenue");

let total = 0;

async function loadBilling() {
  const q = query(collection(db, "bookings"), where("status", "==", "delivered"));
  const snapshot = await getDocs(q);

  snapshot.forEach(docSnap => {
    const data = docSnap.data();
    const tr = document.createElement("tr");

    const deliveredDate = data.deliveryDate?.toDate().toLocaleDateString() || "-";
    const amount = 950; // fixed price per cylinder

    total += amount;

    tr.innerHTML = `
      <td>${data.userName}</td>
      <td>${data.paymentMethod}</td>
      <td>${deliveredDate}</td>
      <td>₹${amount}</td>
    `;

    billingTable.appendChild(tr);
  });

  totalRevenueEl.innerText = total;
}

loadBilling();
