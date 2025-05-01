import { db } from "./firebase-config.js";


import {
  collection,
  getDocs,
  doc,
  updateDoc,
  query,
  where,
  Timestamp,
  getDoc  // ✅ ADD THIS
} from "https://www.gstatic.com/firebasejs/10.11.0/firebase-firestore.js";


const bookingTable = document.getElementById("bookingTable");
const statusFilter = document.getElementById("statusFilter");

statusFilter.addEventListener("change", loadBookings);

async function loadBookings() {
  bookingTable.innerHTML = "";

  const selectedStatus = statusFilter.value;
  let q = collection(db, "bookings");

  if (selectedStatus !== "all") {
    q = query(q, where("status", "==", selectedStatus));
  }

  const snapshot = await getDocs(q);

  snapshot.forEach(docSnap => {
    const data = docSnap.data();
    const tr = document.createElement("tr");

    const deliveryDate = data.deliveryDate
      ? data.deliveryDate.toDate().toLocaleDateString()
      : "-";

    tr.innerHTML = `
      <td>${data.userName}</td>
      <td>${data.paymentMethod}</td>
      <td>${data.status}</td>
      <td>${data.requestedAt.toDate().toLocaleDateString()}</td>
      <td>${deliveryDate}</td>
      <td id="action-${docSnap.id}"></td>
    `;

    bookingTable.appendChild(tr);

    const actionTd = document.getElementById(`action-${docSnap.id}`);
    if (data.status === "pending") {
      const approveBtn = document.createElement("button");
      approveBtn.innerText = "Approve";
      approveBtn.onclick = () => approveBooking(docSnap.id);
      actionTd.appendChild(approveBtn);
    } else if (data.status === "approved") {
      const deliverBtn = document.createElement("button");
      deliverBtn.innerText = "Mark Delivered";
      deliverBtn.onclick = () => deliverBooking(docSnap.id, data.userId);
      actionTd.appendChild(deliverBtn);
    } else {
      actionTd.innerText = "-";
    }
  });
}

async function approveBooking(bookingId) {
  try {
    // Get booking details (to find userId)
    const bookingRef = doc(db, "bookings", bookingId);
    const bookingSnap = await getDoc(bookingRef);
    const bookingData = bookingSnap.data();
    const userId = bookingData.userId;

    // Get user info
    const userRef = doc(db, "users", userId);
    const userSnap = await getDoc(userRef);
    const userData = userSnap.data();
    const currentQuota = userData.remainingQuota || 0;

    if (currentQuota <= 0) {
      alert("User has no cylinders remaining.");
      return;
    }

    // Approve booking and update delivery date
    const deliveryDate = new Date();
    deliveryDate.setDate(deliveryDate.getDate() + 2);

    await updateDoc(bookingRef, {
      status: "approved",
      deliveryDate: Timestamp.fromDate(deliveryDate)
    });

    // Decrease quota
    await updateDoc(userRef, {
      remainingQuota: currentQuota - 1
    });

    alert("Booking approved and cylinder allocated.");
    loadBookings();
  } catch (error) {
    console.error("Approval error:", error);
    alert("Error while approving booking.");
  }
}


async function deliverBooking(bookingId) {
  await updateDoc(doc(db, "bookings", bookingId), {
    status: "delivered"
  });

  alert("Booking marked as delivered.");
  loadBookings();
}


loadBookings();
