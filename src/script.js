let timer;
let countdown;
let timeRemaining = 30; // 30 seconds for the game
let wordIndex = 0;
let typedCharacters = 0;
let mistakes = 0;
let gameStarted = false;
let words = []; // Initialize as an empty array
let wpmPerWord = []; // Track WPM for each word

// DOM elements
const textDisplay = document.getElementById("text-display");
const timerDisplay = document.getElementById("timer");
const resultsContainer = document.getElementById("results-container");
const wpmDisplay = document.getElementById("wpm");
const accuracyDisplay = document.getElementById("accuracy");
const newGameButton = document.getElementById("new-game"); // Button for starting a new game
const wpmChartElement = document.getElementById("wpm-chart");
const ctx = wpmChartElement ? wpmChartElement.getContext("2d") : null;
const liveWpmDisplay = document.getElementById("live-wpm");
const liveErrorsDisplay = document.getElementById("live-errors");
const liveAccuracyDisplay = document.getElementById("live-accuracy");

const updateLiveStats = () => {
  const elapsedTime = 30 - timeRemaining; // Time elapsed in seconds
  const wpm = elapsedTime > 0 ? Math.round((typedCharacters / 5) / (elapsedTime / 60)) : 0;
  const accuracy = typedCharacters > 0 ? Math.round(((typedCharacters - mistakes) / typedCharacters) * 100) : 100;

  liveWpmDisplay.textContent = wpm;
  liveErrorsDisplay.textContent = mistakes;
  liveAccuracyDisplay.textContent = `${accuracy}%`;
};

const repositionText = () => {
  const textDisplay = document.getElementById("text-display");
  textDisplay.scrollLeft = 0; // Reset scroll position
};


// Initialize the game when the page loads
window.onload = async () => {
  const resultsContainer = document.getElementById("results-container");
  if (!resultsContainer) {
    console.error("Results container not found.");
  }

  //resultsContainer.classList.add("hidden"); // Ensure results container is hidden initially
  initializeKeyboardVisualization();
  await fetchWords(); // Fetch words from the API
  shuffleWords();
  displayWords();

  document.body.addEventListener("keydown", handleKeydown);

  newGameButton.addEventListener("click", async () => {
    resetGame();
    await fetchWords(); // Fetch new words for the new game
    shuffleWords();
    displayWords();
  });
};


const initializeKeyboardVisualization = () => {
  const keyboardContainer = document.getElementById("keyboard-visualization");

  // QWERTY layout
  const rows = [
    "1234567890-=",
    "qwertyuiop[]\\",
    "asdfghjkl;'",
    "zxcvbnm,./",
    "space"
  ];

  rows.forEach((row, rowIndex) => {
    row.split("").forEach((key) => {
      const keyElement = document.createElement("div");
      keyElement.classList.add("key");
      keyElement.setAttribute("data-key", key === " " ? "space" : key);
      keyElement.textContent = key === " " ? "" : key; // Spacebar is empty
      if (key === " ") keyElement.classList.add("spacebar"); // Special styling for spacebar
      keyboardContainer.appendChild(keyElement);
    });

    // Add a line break after each row
    const lineBreak = document.createElement("div");
    lineBreak.style.gridColumn = "span 15";
    keyboardContainer.appendChild(lineBreak);
  });
};

// Function to fetch words from a public API
const fetchWords = async () => {
  try {
    const response = await fetch("https://random-word-api.vercel.app/api?words=50");
    if (!response.ok) {
      throw new Error("Failed to fetch words");
    }
    words = await response.json();
  } catch (error) {
    console.error("Error fetching words:", error);
    // Fallback to default words if API fails
    words = [
      "accuracy", "algorithm", "backend", "binary", "browser", "circuit", "compile",
      "compute", "condition", "console", "constant", "data", "debug", "developer",
      "frontend", "function", "hardware", "interface", "iteration", "keyboard",
      "language", "library", "loop", "network", "optimize", "output", "parameter",
      "react", "repository", "runtime", "server", "software", "syntax", "system",
      "terminal", "variable", "virtual", "visual", "webpack", "wireless", "keyboard",
      "session", "typing", "speed", "progress", "framework", "style", "container",
      "design", "render", "performance", "interaction", "build", "deploy", "engineer"
    ];
  }
};

// Function to start the game
const startGame = () => {
  gameStarted = true;

  // Start the countdown timer
  countdown = setInterval(() => {
    timeRemaining--;
    timerDisplay.textContent = `${timeRemaining}s`;
    updateLiveStats(); // Update live stats every second

    if (timeRemaining <= 0) {
      clearInterval(countdown);
      endGame();
    }
  }, 1000);
};

const handleKeydown = (e) => {
  const displayedWords = words.join(" "); // Combine all words into a single string
  const currentChar = displayedWords.charAt(typedCharacters);

  // Highlight the pressed key in the keyboard visualization
  const keyElement = document.querySelector(`#keyboard-visualization .key[data-key="${e.key}"]`);
  if (keyElement) {
    keyElement.classList.add("active");
    setTimeout(() => keyElement.classList.remove("active"), 200); // Remove highlight after 200ms
  }

  // Check typed character
  if (e.key === currentChar) {
    typedCharacters++;
    if (currentChar === " ") {
      wordIndex++; // Increment word index when a space is correctly typed
    }
    updateTextDisplay(displayedWords);
  } else if (e.key.length === 1) { // Ignore non-character keys like Shift, CapsLock, etc.
    mistakes++;
    updateTextDisplay(displayedWords, e.key); // Pass the incorrect key for highlighting
  }

  // Reposition text if it goes off-screen
  const textDisplay = document.getElementById("text-display");
  if (textDisplay.scrollWidth > textDisplay.clientWidth) {
    textDisplay.scrollLeft = 0; // Reset scroll position
  }
};

// Function to display words in a multiline container
const displayWords = () => {
  if (words.length === 0) {
    console.error("No words available to display.");
    return;
  }

  textDisplay.innerHTML = words.map((word, index) => {
    return `<span class="word ${index === wordIndex ? 'current-word' : ''}">${word}</span>`;
  }).join(" ");
};

// Function to reset the game
const resetGame = () => {
  clearInterval(countdown);
  timeRemaining = 30;
  wordIndex = 0;
  typedCharacters = 0;
  mistakes = 0;
  wpmPerWord = [];
  gameStarted = false;

  // Hide the results container
  resultsContainer.classList.add("hidden");

  // Reset the timer display
  timerDisplay.textContent = "30s";

  // Re-enable typing
  document.body.addEventListener("keydown", handleKeydown);
};

// Function to shuffle words
const shuffleWords = () => {
  for (let i = words.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [words[i], words[j]] = [words[j], words[i]];
  }
};

// Function to update the word display with highlights and cursor
const updateTextDisplay = (displayedWords, incorrectKey = null) => {
  let formattedWords = "";
  for (let i = 0; i < displayedWords.length; i++) {
    const char = displayedWords[i];

    if (i < typedCharacters) {
      formattedWords += `<span class="text-gray-500">${char}</span>`; // Grayed-out for correct characters
    } else if (i === typedCharacters) {
      if (incorrectKey) {
        formattedWords += `<span class="text-red-500 cursor-blink">${char}</span>`; // Red for incorrect character
      } else {
        formattedWords += `<span class="text-blue-500 cursor-blink">${char}</span>`; // Cursor on the current character
      }
    } else {
      formattedWords += `<span class="text-gray-400">${char}</span>`; // Remaining characters
    }
  }

  textDisplay.innerHTML = formattedWords;

  // Smoothly move the cursor to the next character
  const cursorElement = document.querySelector(".cursor-blink");
  const cursor = document.getElementById("cursor-indicator");

  if (cursorElement && cursor) {
    const rect = cursorElement.getBoundingClientRect();
    const parentRect = textDisplay.getBoundingClientRect();

    // Use transform for smooth movement
    const x = rect.left - parentRect.left;
    const y = rect.top - parentRect.top;
    cursor.style.transform = `translate(${x}px, ${y}px)`;
  }
};

// Function to end the game
const endGame = () => {
  clearInterval(countdown);
  gameStarted = false; // Prevent further typing after the game ends
  document.body.removeEventListener("keydown", handleKeydown); // Disable typing

  // Calculate WPM based on the number of correctly typed words
  const wpm = Math.round((wordIndex / 30) * 60); // Words per minute

  // Calculate accuracy based on correctly typed characters
  const accuracy = Math.round(((typedCharacters - mistakes) / typedCharacters) * 100);

  // Update the results display
  wpmDisplay.textContent = wpm;
  accuracyDisplay.textContent = `${accuracy}%`;

  // Show the results container
  resultsContainer.classList.remove("hidden");

  // Display the results chart
  displayResultsChart(wpm, mistakes);
};

const displayResultsChart = (wpm, mistakes) => {
  const wpmChartElement = document.getElementById("wpm-chart");
  if (!wpmChartElement) {
    console.error("WPM chart element not found.");
    return;
  }

  const ctx = wpmChartElement.getContext("2d");

  new Chart(ctx, {
    type: "bar",
    data: {
      labels: words.slice(0, wordIndex), // Show only typed words
      datasets: [{
        label: "WPM per Word",
        data: wpmPerWord,
        backgroundColor: "#4caf50",
        borderColor: "#388e3c",
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
