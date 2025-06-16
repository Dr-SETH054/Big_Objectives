// Firebase Configuration
const firebaseConfig = {
  apiKey: "AIzaSyDucECRPTguaczzjbaxv8Tjy_n2uYoR4fM",
  authDomain: "budgetdreams-4b58e.firebaseapp.com",
  projectId: "budgetdreams-4b58e",
  storageBucket: "budgetdreams-4b58e.appspot.com",
  messagingSenderId: "842467931310",
  appId: "1:842467931310:web:89365e0815f1707e55293f",
  measurementId: "G-YWD4983XLX"
};

// Initialize Firebase
firebase.initializeApp(firebaseConfig);
const auth = firebase.auth();
const db = firebase.firestore();

// DOM Elements
const sidebar = document.querySelector('.sidebar');
const toggleBtn = document.querySelector('.fa-bars').parentElement;
const forms = document.querySelectorAll('form');
const addButtons = document.querySelectorAll('[class*="Add"]');
const viewAllButtons = document.querySelectorAll('[class*="View All"]');
const transactionRows = document.querySelectorAll('tbody tr');
const progressCircles = document.querySelectorAll('.progress-ring__circle');
const budgetProgressBars = document.querySelectorAll('[class*="h-2.5"]');
const logoutBtn = document.querySelector('.fa-sign-out-alt').parentElement;
const userProfile = document.querySelector('.ml-3.sidebar-text');

// Initialize the dashboard
function initDashboard() {
  // Check auth state
  auth.onAuthStateChanged(user => {
    if (user) {
      // User is signed in
      console.log('User logged in:', user.email);
      updateUserProfile(user);
      loadUserData(user.uid);
    } else {
      // No user is signed in
      console.log('User not logged in');
      window.location.href = 'login.html'; // Redirect to login page
    }
  });
  
  // Set up progress rings
  setupProgressRings();
  
  // Add event listeners
  addEventListeners();
  
  // Set current date in forms
  setDefaultDates();
}

// Update user profile in sidebar
function updateUserProfile(user) {
  const displayName = user.displayName || 'User';
  const email = user.email || '';
  
  userProfile.innerHTML = `
    <p class="text-sm font-medium text-gray-900">${displayName}</p>
    <p class="text-xs text-gray-500">${email}</p>
  `;
}

// Load user data from Firestore
function loadUserData(userId) {
  // Load transactions
  db.collection('users').doc(userId).collection('transactions')
    .orderBy('date', 'desc')
    .limit(5)
    .get()
    .then(querySnapshot => {
      const transactions = [];
      querySnapshot.forEach(doc => {
        transactions.push(doc.data());
      });
      renderTransactions(transactions);
    })
    .catch(error => {
      console.error("Error loading transactions: ", error);
    });
  
  // Load budget data
  db.collection('users').doc(userId).collection('budgets')
    .doc('current')
    .get()
    .then(doc => {
      if (doc.exists) {
        renderBudgetData(doc.data());
      }
    })
    .catch(error => {
      console.error("Error loading budget: ", error);
    });
  
  // Load goals
  db.collection('users').doc(userId).collection('goals')
    .where('completed', '==', false)
    .get()
    .then(querySnapshot => {
      const goals = [];
      querySnapshot.forEach(doc => {
        goals.push(doc.data());
      });
      renderGoals(goals);
    })
    .catch(error => {
      console.error("Error loading goals: ", error);
    });
}

// Render transactions to the table
function renderTransactions(transactions) {
  const tbody = document.querySelector('tbody');
  tbody.innerHTML = '';
  
  transactions.forEach(transaction => {
    const row = document.createElement('tr');
    row.className = 'hover:bg-gray-50 cursor-pointer';
    row.innerHTML = `
      <td class="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
        ${new Date(transaction.date).toLocaleDateString('en-US', { month: 'short', day: 'numeric' })}
      </td>
      <td class="px-6 py-4 whitespace-nowrap">
        <div class="flex items-center">
          <div class="flex-shrink-0 h-10 w-10 rounded-full ${getCategoryColor(transaction.category).bg} flex items-center justify-center mr-3">
            <i class="fas ${getCategoryIcon(transaction.category)} ${getCategoryColor(transaction.category).text}"></i>
          </div>
          <div>
            <div class="text-sm font-medium text-gray-900">${transaction.description}</div>
            <div class="text-sm text-gray-500">${transaction.category}</div>
          </div>
        </div>
      </td>
      <td class="px-6 py-4 whitespace-nowrap text-sm text-gray-500">${transaction.category}</td>
      <td class="px-6 py-4 whitespace-nowrap text-sm font-medium ${transaction.amount < 0 ? 'text-red-600' : 'text-green-600'}">
        ${transaction.amount < 0 ? '-' : '+'}$${Math.abs(transaction.amount).toFixed(2)}
      </td>
      <td class="px-6 py-4 whitespace-nowrap">
        <span class="px-2 inline-flex text-xs leading-5 font-semibold rounded-full bg-green-100 text-green-800">
          ${transaction.status || 'Completed'}
        </span>
      </td>
    `;
    tbody.appendChild(row);
  });
  
  // Reattach event listeners
  document.querySelectorAll('tbody tr').forEach(row => {
    row.addEventListener('click', handleTransactionClick);
  });
}

// Helper functions for categories
function getCategoryIcon(category) {
  const icons = {
    'Food & Dining': 'fa-utensils',
    'Housing': 'fa-home',
    'Transportation': 'fa-car',
    'Shopping': 'fa-shopping-bag',
    'Income': 'fa-wallet',
    'Entertainment': 'fa-film'
  };
  return icons[category] || 'fa-receipt';
}

function getCategoryColor(category) {
  const colors = {
    'Food & Dining': { bg: 'bg-purple-100', text: 'text-purple-600' },
    'Housing': { bg: 'bg-blue-100', text: 'text-blue-600' },
    'Transportation': { bg: 'bg-green-100', text: 'text-green-600' },
    'Shopping': { bg: 'bg-red-100', text: 'text-red-600' },
    'Income': { bg: 'bg-green-100', text: 'text-green-600' },
    'Entertainment': { bg: 'bg-yellow-100', text: 'text-yellow-600' }
  };
  return colors[category] || { bg: 'bg-gray-100', text: 'text-gray-600' };
}

// Handle form submissions with Firebase integration
function handleFormSubmit(e) {
  e.preventDefault();
  const form = e.target;
  const formType = form.querySelector('h3').textContent;
  const userId = auth.currentUser.uid;
  
  if (formType.includes('Transaction')) {
    const transactionData = {
      description: form.querySelector('input[type="text"]').value,
      amount: parseFloat(form.querySelector('input[type="number"]').value),
      category: form.querySelector('select').value,
      date: new Date().toISOString(),
      status: 'Completed'
    };
    
    db.collection('users').doc(userId).collection('transactions')
      .add(transactionData)
      .then(() => {
        showToast('Transaction added successfully!');
        loadUserData(userId); // Refresh data
        form.reset();
      })
      .catch(error => {
        console.error("Error adding transaction: ", error);
        showToast('Error adding transaction', true);
      });
  }
  else if (formType.includes('Goal')) {
    const goalData = {
      name: form.querySelector('input[type="text"]').value,
      targetAmount: parseFloat(form.querySelector('input[type="number"]').value),
      currentAmount: 0,
      targetDate: form.querySelector('input[type="date"]').value,
      completed: false,
      createdAt: new Date().toISOString()
    };
    
    db.collection('users').doc(userId).collection('goals')
      .add(goalData)
      .then(() => {
        showToast('Goal created successfully!');
        loadUserData(userId); // Refresh data
        form.reset();
      })
      .catch(error => {
        console.error("Error adding goal: ", error);
        showToast('Error creating goal', true);
      });
  }
  else if (formType.includes('Note')) {
    const noteData = {
      title: form.querySelector('input[type="text"]').value,
      content: form.querySelector('textarea').value,
      tags: form.querySelectorAll('input[type="text"]')[1].value.split(',').map(tag => tag.trim()),
      createdAt: new Date().toISOString()
    };
    
    db.collection('users').doc(userId).collection('notes')
      .add(noteData)
      .then(() => {
        showToast('Note saved successfully!');
        loadUserData(userId); // Refresh data
        form.reset();
      })
      .catch(error => {
        console.error("Error adding note: ", error);
        showToast('Error saving note', true);
      });
  }
}

// Handle logout
function handleLogout() {
  auth.signOut()
    .then(() => {
      window.location.href = 'login.html';
    })
    .catch(error => {
      console.error("Error signing out: ", error);
      showToast('Error signing out', true);
    });
}

// Initialize the dashboard when DOM is loaded
document.addEventListener('DOMContentLoaded', initDashboard);

// Add logout event listener
if (logoutBtn) {
  logoutBtn.addEventListener('click', handleLogout);
}

// The rest of your existing functions (setupProgressRings, showToast, etc.) remain the same
// ...
