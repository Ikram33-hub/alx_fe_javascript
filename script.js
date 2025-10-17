// Array ديال الكوتس
let quotes = [
  { text: "The best way to get started is to quit talking and begin doing.", category: "Motivation" },
  { text: "Success is not final; failure is not fatal.", category: "Inspiration" },
  { text: "Dream big and dare to fail.", category: "Courage" }
];

// نجيب العناصر من الـ DOM
const quoteDisplay = document.getElementById("quoteDisplay");
const newQuoteBtn = document.getElementById("newQuote");
const addQuoteBtn = document.getElementById("addQuoteBtn");

// دالة باش توريني كوت عشوائية
function showRandomQuote() {
  const randomIndex = Math.floor(Math.random() * quotes.length);
  const quote = quotes[randomIndex];
  quoteDisplay.innerHTML = `<p>"${quote.text}"</p><small>— ${quote.category}</small>`;
}

// دالة باش نضيف كوت جديدة
function addQuote() {
  const textInput = document.getElementById("newQuoteText");
  const categoryInput = document.getElementById("newQuoteCategory");

  const newText = textInput.value.trim();
  const newCategory = categoryInput.value.trim();

  if (newText === "" || newCategory === "") {
    alert("Please fill in both fields!");
    return;
  }

  // نضيف الكوت الجديدة للـ array
  quotes.push({ text: newText, category: newCategory });

  // نفرغ الخانات
  textInput.value = "";
  categoryInput.value = "";

  alert("Quote added successfully!");
}

// الأحداث (Event listeners)
newQuoteBtn.addEventListener("click", showRandomQuote);
addQuoteBtn.addEventListener("click", addQuote);
