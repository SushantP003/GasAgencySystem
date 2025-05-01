import { auth, db } from "./firebase-config.js";
import { createUserWithEmailAndPassword } from "https://www.gstatic.com/firebasejs/10.11.0/firebase-auth.js";
import { doc, setDoc } from "https://www.gstatic.com/firebasejs/10.11.0/firebase-firestore.js";

document.getElementById("registerForm").addEventListener("submit", async (e) => {
  e.preventDefault();

  const name = document.getElementById("name").value;
  const userId = document.getElementById("userId").value;
  const email = document.getElementById("email").value;
  const phone = document.getElementById("phone").value;
  const address = document.getElementById("address").value;
  const password = document.getElementById("password").value;

  try {
    const userCredential = await createUserWithEmailAndPassword(auth, email, password);
    const user = userCredential.user;

    await setDoc(doc(db, "users", user.uid), {
      uid: user.uid,
      name,
      userId,
      email,
      phone,
      address,
      role: "user",
    //   remainingQuota: 12,
    remainingCylinders: 12,

      createdAt: new Date()
    });

    alert("Registration successful! Please login.");
    window.location.href = "login.html";
  } catch (error) {
    console.error("Registration Error:", error);
    alert(error.message);
  }
});
