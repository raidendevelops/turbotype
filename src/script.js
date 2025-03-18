import Chart from 'chart.js/auto';

const words = ["developer", "monkeytype", "turbo", "javascript", "speed", "accuracy", "typing", "frontend", "backend"];
let timer, timeElapsed = 0, typedWords = 0, mistakes = 0;
let wordIndex = 0;

// DOM elements
const textDisplay = document.getElementById("text-display");
const startButton = document.getElementById("start-game");
const themeSelector = document.getElementById("theme-selector");
const resultsContainer = document.getElementById("results-container");
const wpmDisplay = document.getElementById("wpm");
const accuracyDisplay = document.getElementById("accuracy");

// Game logic
const startGame = () => {
  wordIndex = 0;
  typedWords = 0;
  mistakes = 0;
  timeElapsed = 0;

  // Shuffle words and display them
  const shuffledWords = words.sort(() => Math.random() - 0.5).join(" ");
  textDisplay.textContent = shuffledWords;

  // Start timer
  timer = setInterval(() => timeElapsed++, 1000);

  document.body.addEventListener("keydown", handleTyping);
};

const handleTyping = (e) => {
  const displayedText = textDisplay.textContent.split(" ");
  const currentWord = displayedText[wordIndex];

  // Check character match
  if (e.key === currentWord.charAt(typedWords)) {
    typedWords++;
    if (typedWords === currentWord.length) {
      wordIndex++;
      typedWords = 0;
    }
  } else {
    mistakes++;
  }

  if (wordIndex >= displayedText.length) endGame(); // End game
};

const endGame = () => {
  clearInterval(timer);
  const wpm = Math.round((wordIndex / timeElapsed) * 60);
  const accuracy = Math.round(((wordIndex - mistakes) / wordIndex) * 100);

  wpmDisplay.textContent = wpm;
  accuracyDisplay.textContent = accuracy + "%";

  displayChart(wpm, mistakes);
  resultsContainer.classList.remove("hidden");
};

const displayChart = (wpm, mistakes) => {
  const ctx = document.getElementById("wpm-chart").getContext("2d");
  new Chart(ctx, {
    type: "bar",
    data: {
      labels: ["WPM", "Mistakes"],
      datasets: [{
        data: [wpm, mistakes],
        backgroundColor: ["#4caf50", "#f44336"]
      }]
    }
  });
};

// Theme-switcher
themeSelector.addEventListener("change", (e) => {
  document.body.className = e.target.value;
});

// Start button event listener
startButton.addEventListener("click", startGame);
