let timer;
let countdown;
let timeRemaining = 30; // 30 seconds for the game
let wordIndex = 0;
let typedCharacters = 0;
let mistakes = 0;
let wordsTyped = 0;
let gameStarted = false;

const words = [
  "accuracy", "algorithm", "backend", "binary", "browser", "circuit", "compile",
  "compute", "condition", "console", "constant", "data", "debug", "developer",
  "frontend", "function", "hardware", "interface", "iteration", "keyboard",
  "language", "library", "loop", "network", "optimize", "output", "parameter",
  "react", "repository", "runtime", "server", "software", "syntax", "system",
  "terminal", "variable", "virtual", "visual", "webpack", "wireless", "keyboard",
  "session", "typing", "speed", "progress", "framework", "style", "container",
  "design", "render", "performance", "interaction", "build", "deploy", "engineer"
];

// DOM elements
const textDisplay = document.getElementById("text-display");
const timerDisplay = document.getElementById("timer");
const resultsContainer = document.getElementById("results-container");
const wpmDisplay = document.getElementById("wpm");
const accuracyDisplay = document.getElementById("accuracy");
const ctx = document.getElementById("wpm-chart").getContext("2d");

// Initialize the game when the page loads
window.onload = () => {
  shuffleWords();
  displayWords();

  document.body.addEventListener("keydown", (e) => {
    if (!gameStarted && e.key !== "Shift" && e.key !== "CapsLock") {
      startGame(); // Start the game as soon as the user types
    }

    handleTyping(e);
  });
};

// Function to start the game
const startGame = () => {
  gameStarted = true;

  // Start the countdown timer
  countdown = setInterval(() => {
    timeRemaining--;
    timerDisplay.textContent = `${timeRemaining}s`;

    if (timeRemaining <= 0) {
      clearInterval(countdown);
      endGame();
    }
  }, 1000);
};

// Function to handle user typing
const handleTyping = (e) => {
  if (!gameStarted) return; // Don't respond to typing until the game starts

  const displayedWords = textDisplay.textContent.split(" ");
  const currentWord = displayedWords[wordIndex];

  // Check typed character
  if (e.key === currentWord.charAt(typedCharacters)) {
    typedCharacters++;

    if (typedCharacters === currentWord.length) {
      wordIndex++;
      wordsTyped++;
      typedCharacters = 0;
    }

    // Update the text display
    updateTextDisplay(displayedWords);
  } else if (e.key !== "Shift" && e.key !== "CapsLock") {
    mistakes++;
  }
};

// Function to display words statically in the container
const displayWords = () => {
  textDisplay.innerHTML = words.join(" ");
};

// Function to reset the game
const resetGame = () => {
  clearInterval(countdown);
  timeRemaining = 30;
  wordIndex = 0;
  typedCharacters = 0;
  mistakes = 0;
  wordsTyped = 0;
  gameStarted = false;
  resultsContainer.classList.add("hidden");
  timerDisplay.textContent = "30s";
};

// Function to shuffle words
const shuffleWords = () => {
  for (let i = words.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [words[i], words[j]] = [words[j], words[i]];
  }
};

// Function to update word display with highlights
const updateTextDisplay = (displayedWords) => {
  let formattedWords = "";

  displayedWords.forEach((word, index) => {
    if (index < wordIndex) {
      formattedWords += `<span class="text-green-500">${word} </span>`;
    } else if (index === wordIndex) {
      formattedWords += `<span class="text-blue-500">${word.slice(0, typedCharacters)}</span><span class="text-gray-400">${word.slice(typedCharacters)} </span>`;
    } else {
      formattedWords += `<span class="text-gray-300">${word} </span>`;
    }
  });

  textDisplay.innerHTML = formattedWords.trim();
};

// Function to end the game
const endGame = () => {
  clearInterval(countdown);
  document.body.removeEventListener("keydown", handleTyping);

  const wpm = Math.round((wordsTyped / 30) * 60); // Words per minute
  const accuracy = Math.round(((typedCharacters - mistakes) / typedCharacters) * 100);

  wpmDisplay.textContent = wpm;
  accuracyDisplay.textContent = `${accuracy}%`;

  displayResultsChart(wpm, mistakes);

  resultsContainer.classList.remove("hidden");
};

// Function to display a Chart.js bar chart
const displayResultsChart = (wpm, mistakes) => {
  new Chart(ctx, {
    type: "bar",
    data: {
      labels: ["WPM", "Mistakes"],
      datasets: [{
        label: "Performance",
        data: [wpm, mistakes],
        backgroundColor: ["#4caf50", "#f44336"],
        borderColor: ["#388e3c", "#d32f2f"],
        borderWidth: 1,
      }],
    },
    options: {
      scales: {
        y: { beginAtZero: true },
      },
    },
  });
};
