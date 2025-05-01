import { auth, db } from "./firebase-config.js";
import { createUserWithEmailAndPassword } from "https://www.gstatic.com/firebasejs/10.11.0/firebase-auth.js";
import { doc, setDoc } from "https://www.gstatic.com/firebasejs/10.11.0/firebase-firestore.js";

// Secret key to allow admin creation
const SECRET_ADMIN_KEY = "ADMIN@123";  // Change this and keep it secret

document.getElementById("adminForm").addEventListener("submit", async (e) => {
  e.preventDefault();

  const name = document.getElementById("name").value;
  const userId = document.getElementById("userId").value;
  const email = document.getElementById("email").value;
  const phone = document.getElementById("phone").value;
  const address = document.getElementById("address").value;
  const password = document.getElementById("password").value;
  const adminKey = document.getElementById("adminKey").value;

  if (adminKey !== SECRET_ADMIN_KEY) {
    alert("Invalid admin key!");
    return;
  }

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
      role: "admin",
      createdAt: new Date()
    });

    alert("Admin account created successfully!");
    window.location.href = "login.html";
  } catch (error) {
    console.error("Admin Registration Error:", error);
    alert(error.message);
  }
});
