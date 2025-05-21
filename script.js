const firebaseConfig = {
  apiKey: "AIzaSyDucECRPTguaczzjbaxv8Tjy_n2uYoR4fM",
  authDomain: "budgetdreams-4b58e.firebaseapp.com",
  projectId: "budgetdreams-4b58e",
  storageBucket: "budgetdreams-4b58e.firebasestorage.app",
  messagingSenderId: "842467931310",
  appId: "1:842467931310:web:89365e0815f1707e55293f",
  measurementId: "G-YWD4983XLX"
};

// Initialize Firebase
firebase.initializeApp(firebaseConfig);
const auth = firebase.auth();

function togglePassword() {
  const input = document.getElementById("login-password");
  input.type = input.type === "password" ? "text" : "password";
}

function toggleDarkMode() {
  document.body.classList.toggle("dark");
}

function login() {
  const email = document.getElementById("login-email").value;
  const password = document.getElementById("login-password").value;

  if (!email || !password) {
    alert("Please fill in all fields.");
    return false;
  }

  auth.signInWithEmailAndPassword(email, password)
    .then(() => {
      window.location.href = "dashboard.html";
    })
    .catch(error => {
      alert("Login error: " + error.message);
    });

  return false; // prevent form submission
}

function signUp() {
  const email = document.getElementById("signup-email").value;
  const password = document.getElementById("signup-password").value;

  if (!email || !password) {
    alert("Please fill in all fields.");
    return false;
  }

  auth.createUserWithEmailAndPassword(email, password)
    .then(() => {
      alert("Signup successful! You can now log in.");
      window.location.href = "index.html";
    })
    .catch(error => {
      document.getElementById("signup-error").textContent = error.message;
    });

  return false; // prevent form submission
}

function logout() {
  auth.signOut().then(() => {
    window.location.href = "index.html";
  });
}

