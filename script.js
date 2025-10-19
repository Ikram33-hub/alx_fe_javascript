// ======================
// Dynamic Quote Generator with Filtering + Web Storage + JSON + Server Sync
// ======================

// Quotes array (from localStorage or default)
let quotes = JSON.parse(localStorage.getItem("quotes")) || [
  { text: "The journey of a thousand miles begins with one step.", category: "Motivation" },
  { text: "Code is like humor. When you have to explain it, it’s bad.", category: "Programming" },
  { text: "In the middle of every difficulty lies opportunity.", category: "Inspiration" }
];

// ======================
// DOM Elements
// ======================
const quoteDisplay = document.getElementById("quoteDisplay");
const categoryFilter = document.getElementById("categoryFilter");
const notification = document.getElementById("notification");

// ======================
// Helper Functions
// ======================
function saveQuotes() {
  localStorage.setItem("quotes", JSON.stringify(quotes));
}

function showRandomQuote() {
  const randomIndex = Math.floor(Math.random() * quotes.length);
  const randomQuote = quotes[randomIndex];
  quoteDisplay.textContent = `"${randomQuote.text}" — ${randomQuote.category}`;
  sessionStorage.setItem("lastViewedQuote", JSON.stringify(randomQuote));
}

function addQuote() {
  const newQuoteText = document.getElementById("newQuoteText").value.trim();
  const newQuoteCategory = document.getElementById("newQuoteCategory").value.trim();

  if (newQuoteText && newQuoteCategory) {
    const newQuote = { text: newQuoteText, category: newQuoteCategory };
    quotes.push(newQuote);
    saveQuotes();
    populateCategories();
    filterQuotes();
    document.getElementById("newQuoteText").value = "";
    document.getElementById("newQuoteCategory").value = "";
  } else {
    alert("Please fill in both fields!");
  }
}

// ======================
// Filtering System
// ======================
function populateCategories() {
  const uniqueCategories = [...new Set(quotes.map(q => q.category))];
  categoryFilter.innerHTML = `<option value="all">All Categories</option>`;
  uniqueCategories.forEach(cat => {
    const option = document.createElement("option");
    option.value = cat;
    option.textContent = cat;
    categoryFilter.appendChild(option);
  });

  const lastCategory = localStorage.getItem("selectedCategory");
  if (lastCategory) {
    categoryFilter.value = lastCategory;
    filterQuotes();
  }
}

function filterQuotes() {
  const selectedCategory = categoryFilter.value;
  localStorage.setItem("selectedCategory", selectedCategory);

  let filteredQuotes = selectedCategory === "all"
    ? quotes
    : quotes.filter(q => q.category === selectedCategory);

  quoteDisplay.innerHTML = "";
  filteredQuotes.forEach(q => {
    const p = document.createElement("p");
    p.textContent = `"${q.text}" — ${q.category}`;
    quoteDisplay.appendChild(p);
  });
}

// ======================
// JSON Import / Export
// ======================
function exportToJsonFile() {
  const dataStr = JSON.stringify(quotes, null, 2);
  const blob = new Blob([dataStr], { type: "application/json" });
  const url = URL.createObjectURL(blob);

  const link = document.createElement("a");
  link.href = url;
  link.download = "quotes.json";
  link.click();
  URL.revokeObjectURL(url);
}

function importFromJsonFile(event) {
  const fileReader = new FileReader();
  fileReader.onload = function (event) {
    const importedQuotes = JSON.parse(event.target.result);
    quotes.push(...importedQuotes);
    saveQuotes();
    populateCategories();
    filterQuotes();
    alert("Quotes imported successfully!");
  };
  fileReader.readAsText(event.target.files[0]);
}

// ======================
// Server Sync + Conflict Resolution
// ======================
async function syncWithServer() {
  try {
    const response = await fetch('https://jsonplaceholder.typicode.com/posts');
    const serverQuotesRaw = await response.json();

    // تحويل البيانات لتوافق هيكل quotes {text, category}
    const serverQuotes = serverQuotesRaw.slice(0, 5).map(item => ({
      text: item.title,
      category: "Server"
    }));

    // حل التعارض: السيرفر عندو الأولوية
    let localDataChanged = JSON.stringify(quotes) !== JSON.stringify(serverQuotes);
    if (localDataChanged) {
      quotes = serverQuotes;
      saveQuotes();
      populateCategories();
      filterQuotes();
      showNotification("Quotes updated from server!");
    }
  } catch (error) {
    console.error("Error syncing with server:", error);
  }
}

function showNotification(msg) {
  if (!notification) return;
  notification.textContent = msg;
  notification.style.display = "block";
  setTimeout(() => { notification.style.display = "none"; }, 3000);
}

// ======================
// Initialization
// ======================
window.onload = () => {
  populateCategories();
  filterQuotes();

  const lastViewed = sessionStorage.getItem("lastViewedQuote");
  if (lastViewed) {
    const quote = JSON.parse(lastViewed);
    quoteDisplay.textContent = `"${quote.text}" — ${quote.category}`;
  }

  // مزامنة كل دقيقة
  setInterval(syncWithServer, 60000);
};
