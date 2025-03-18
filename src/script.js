let timer;
let timeElapsed = 0;
let wordIndex = 0;
let typedCharacters = 0;
let mistakes = 0;
let wordsTyped = 0;

const words = [
  "developer", "javascript", "frontend", "backend", "speed",
  "accuracy", "typing", "monkeytype", "framework", "react"
];

// DOM elements
const textDisplay = document.getElementById("text-display");
const startButton = document.getElementById("start-game");
const themeSelector = document.getElementById("theme-selector");
const resultsContainer = document.getElementById("results-container");
const wpmDisplay = document.getElementById("wpm");
const accuracyDisplay = document.getElementById("accuracy");
const ctx = document.getElementById("wpm-chart").getContext("2d");

let typedWordData; // To store WPM and mistakes for chart

// Function to start the game
const startGame = () => {
  resetGame();
  shuffleWords();
  displayWords();

  document.body.addEventListener("keydown", handleTyping);

  // Start timer
  timer = setInterval(() => {
    timeElapsed++;
  }, 1000);
};

// Function to handle user input
const handleTyping = (e) => {
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

    // End game when all words are typed
    if (wordIndex === displayedWords.length) {
      endGame();
    }
  } else {
    mistakes++;
  }

  updateTextDisplay(displayedWords);
};

// Function to display words dynamically
const displayWords = () => {
  textDisplay.textContent = words.join(" ");
};

// Function to reset the game
const resetGame = () => {
  clearInterval(timer);
  timeElapsed = 0;
  wordIndex = 0;
  typedCharacters = 0;
  mistakes = 0;
  wordsTyped = 0;
  resultsContainer.classList.add("hidden");
};

// Function to shuffle words
const shuffleWords = () => {
  for (let i = words.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [words[i], words[j]] = [words[j], words[i]];
  }
};

// Function to update word display with typed highlights
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
  clearInterval(timer);
  document.body.removeEventListener("keydown", handleTyping);

  const wpm = Math.round((wordsTyped / timeElapsed) * 60);
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

// Theme selector
themeSelector.addEventListener("change", (e) => {
  document.body.className = e.target.value;
});

// Start button
startButton.addEventListener("click", startGame);
