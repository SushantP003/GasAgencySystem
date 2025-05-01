import { db } from "./firebase-config.js";
import {
  collection,
  addDoc,
  doc,
  getDoc,
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

// Show QR for UPI
document.querySelectorAll('input[name="payment"]').forEach(input => {
  input.addEventListener("change", () => {
    const selected = document.querySelector('input[name="payment"]:checked').value;
    document.getElementById("upiSection").style.display = selected === "UPI" ? "block" : "none";
  });
});

// Prevent multiple bookings
async function hasPendingBooking(uid) {
  const bookingsRef = collection(db, "bookings");
  const q = query(bookingsRef, where("userId", "==", uid), where("status", "in", ["pending", "approved"]));
  const snapshot = await getDocs(q);
  return !snapshot.empty;
}

// Handle booking
document.getElementById("bookingForm").addEventListener("submit", async (e) => {
  e.preventDefault();
  const paymentMethod = document.querySelector('input[name="payment"]:checked').value;

  if (await hasPendingBooking(uid)) {
    alert("You already have a pending/approved booking. Wait for it to be delivered.");
    return;
  }

  try {
    const userDoc = await getDoc(doc(db, "users", uid));
    const userData = userDoc.data();

    const booking = {
      userId: uid,
      userName: userData.name,
      paymentMethod,
      status: "pending", // to be approved by admin
      requestedAt: Timestamp.now(),
    };

    await addDoc(collection(db, "bookings"), booking);

    alert("Booking request sent! Wait for admin approval.");
    window.location.href = "user-dashboard.html";
  } catch (error) {
    console.error("Booking error:", error);
    alert("Failed to book cylinder.");
  }
});
