// Firebase App (the core Firebase SDK) is always required
const firebaseConfig = {
  apiKey: "AIzaSyDucECRPTguaczzjbaxv8Tjy_n2uYoR4fM",
  authDomain: "budgetdreams-4b58e.firebaseapp.com",
  projectId: "budgetdreams-4b58e",
  storageBucket: "budgetdreams-4b58e.appspot.com",
  messagingSenderId: "842467931310",
  appId: "1:842467931310:web:89365e0815f1707e55293f",
  measurementId: "G-YWD4983XLX"
};

firebase.initializeApp(firebaseConfig);
const auth = firebase.auth();

// Login
function login() {
  const email = document.getElementById("login-email").value;
  const password = document.getElementById("login-password").value;

  auth.signInWithEmailAndPassword(email, password)
    .then(() => {
      window.location.href = "dashboard.html";
    })
    .catch((error) => {
      alert("Login failed: " + error.message);
    });

  return false;
}

// Signup
function signUp() {
  const email = document.getElementById("signup-email").value;
  const password = document.getElementById("signup-password").value;

  auth.createUserWithEmailAndPassword(email, password)
    .then(() => {
      alert("Signup successful. You can now log in.");
      window.location.href = "index.html";
    })
    .catch((error) => {
      document.getElementById("signup-error").textContent = error.message;
    });

  return false;
}

// Logout
function logout() {
  auth.signOut().then(() => {
    window.location.href = "index.html";
  });
}

// Auth check for dashboard
if (window.location.pathname.includes("dashboard.html")) {
  firebase.auth().onAuthStateChanged(user => {
    if (!user) {
      window.location.href = "index.html";
    } else {
      console.log("User:", user.email);
    }
  });
}
