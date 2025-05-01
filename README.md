# 🧯 Gas Agency System

The **Gas Agency System** is a simple web application built using **HTML, CSS, and JavaScript** (no frontend frameworks), powered by **Firebase Firestore** for database and authentication. It supports separate roles for **Admin** and **Users** with custom dashboards and booking functionalities.

---

## 🚀 Features

### 👤 User
- Sign up and log in with email/password.
- View personal profile details.
- Book cylinders and choose payment options (Cash or UPI).
- View booking status and delivery date.
- See the number of remaining cylinders (quota).
- Receive notifications when:
  - Booking is approved.
  - Cylinder is delivered.

### 🛠️ Admin
- Add new users.
- View and manage all bookings.
- Approve bookings and assign delivery dates.
- Mark bookings as delivered.
- See user payment method and perform manual verification for Cash.
- Receive notifications when:
  - New booking is made.
  - Online payment is done.

### 🔔 Notifications
- Separate notification system for Admin and Users.
- Unread notifications are shown with bold titles (like Gmail).
- Clicking a notification marks it as read.

---

## 🧩 Tech Stack

- **HTML, CSS, JavaScript**
- **Firebase Firestore** (Database)
- **Firebase Authentication**

---

## 🔧 Firebase Setup Instructions

1. Go to [Firebase Console](https://console.firebase.google.com/) and create a new project.
2. Add a new **Web App** to the project.
3. Enable **Authentication**:
   - Go to **Authentication > Sign-in method**.
   - Enable **Email/Password** sign-in provider.
4. Create Firestore Database:
   - Go to **Firestore Database**.
   - Click **Create database** → Start in test mode (for development).
   - Create the following collections manually:
     - `users`: Stores user profiles and roles.
     - `bookings`: Stores booking requests.
     - `notifications`: Stores admin/user notifications.

5. Copy your Firebase config and replace it in `firebase-config.js`:

```javascript
// firebase-config.js
import { initializeApp } from "https://www.gstatic.com/firebasejs/10.11.0/firebase-app.js";
import { getFirestore } from "https://www.gstatic.com/firebasejs/10.11.0/firebase-firestore.js";
import { getAuth } from "https://www.gstatic.com/firebasejs/10.11.0/firebase-auth.js";

const firebaseConfig = {
  apiKey: "YOUR_API_KEY",
  authDomain: "YOUR_AUTH_DOMAIN",
  projectId: "YOUR_PROJECT_ID",
  storageBucket: "YOUR_STORAGE_BUCKET",
  messagingSenderId: "YOUR_MESSAGING_ID",
  appId: "YOUR_APP_ID"
};

const app = initializeApp(firebaseConfig);
export const db = getFirestore(app);
export const auth = getAuth(app);
