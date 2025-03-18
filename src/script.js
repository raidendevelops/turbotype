let timer;
let timeElapsed = 0;
let isGameRunning = false;
let wordDisplay;

// Mock word list
const words = [
  "javascript", "react", "tailwind", "monkeytype", 
  "developer", "frontend", "backend", "coding"
];

const startGame = () => {
  if (isGameRunning) return;

  isGameRunning = true;
  timeElapsed = 0;
  document.getElementById("timer").textContent = `Time: 0s`;

  // Generate random words using Typed.js
  const randomText = words.sort(() => Math.random() - 0.5).slice(0, 50).join(" ");
  wordDisplay = new Typed("#text-display", {
    strings: [randomText],
    typeSpeed: 50,
    showCursor: false,
  });

  // Start timer
  timer = setInterval(() => {
    timeElapsed++;
    document.getElementById("timer").textContent = `Time: ${timeElapsed}s`;
  }, 1000);

  // Event listener for input comparison
  const inputField = document.getElementById("text-input");
  inputField.value = "";
  inputField.focus();
  inputField.addEventListener("input", checkTextMatch);
};

const checkTextMatch = () => {
  const input = document.getElementById("text-input").value;
  const displayedText = document.getElementById("text-display").textContent;

  if (displayedText.startsWith(input)) {
    document.getElementById("text-input").classList.add("border-green-500");
    document.getElementById("text-input").classList.remove("border-red-500");

    // Check if complete
    if (input === displayedText) {
      clearInterval(timer);
      isGameRunning = false;
      alert(`Well done! Time: ${timeElapsed}s`);
    }
  } else {
    document.getElementById("text-input").classList.add("border-red-500");
    document.getElementById("text-input").classList.remove("border-green-500");
  }
};

document.getElementById("start-game").addEventListener("click", startGame);
