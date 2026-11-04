
// 1. Store experiment data

let currentText = "";
let round = 0;
let isGenerating = false;


// 2. Find HTML elements

const inputBox = document.getElementById("userInput");

const startButton = document.getElementById("startButton");

const generateButton = document.getElementById("generateButton");

const resetButton = document.getElementById("resetButton");

const historyBox = document.getElementById("history");

const roundCount = document.getElementById("roundCount");

const message = document.getElementById("message");


// 3. Start the experiment

startButton.addEventListener("click", function() {

  currentText = inputBox.value.trim();

  if (currentText === "") {
    message.textContent = "Please enter some text first.";
    return;
  }

  round = 0;

  historyBox.innerHTML = "";

  roundCount.textContent = round;

  generateButton.disabled = false;

  message.textContent = "Experiment started!";

});


// 4. Generate the next round

generateButton.addEventListener("click", generateNext);


async function generateNext() {

  if (isGenerating) {
    return;
  }

  isGenerating = true;

  generateButton.disabled = true;

  message.textContent = "AI is thinking...";


  try {

    // Send text to Ollama

    const response = await fetch(
      "http://127.0.0.1:11434/api/generate",
      {
        method: "POST",

        headers: {
          "Content-Type": "application/json"
        },

        body: JSON.stringify({

          model: "llama3.2:3b",

          prompt:
            "Rewrite the following text in different words. " +
            "Keep the original meaning if possible. " +
            "Use only the rewritten text. Do not explain.\n\n" +
            currentText,

          stream: false

        })

      }
    );


    if (!response.ok) {
      throw new Error("Could not connect to Ollama.");
    }


    const data = await response.json();

    const newText = data.response.trim();


    // Update the current text

    currentText = newText;

    round++;


    // Display the result

    const card = document.createElement("div");

    card.className = "round-card";

    const title = document.createElement("div");

    title.className = "round-title";

    title.textContent = "ROUND " + String(round).padStart(2, "0");

    const text = document.createElement("div");

    text.className = "round-text";

    text.textContent = newText;


    card.appendChild(title);

    card.appendChild(text);

    historyBox.appendChild(card);


    // Update the counter

    roundCount.textContent = round;

    message.textContent = "Ready for the next round!";

  }

  catch (error) {

    message.textContent = "Error: " + error.message;

  }

  finally {

    isGenerating = false;

    generateButton.disabled = false;

  }

}


// 5. Reset the experiment

resetButton.addEventListener("click", function() {

  currentText = "";

  round = 0;

  isGenerating = false;

  inputBox.value = "";

  historyBox.innerHTML = "";

  roundCount.textContent = 0;

  generateButton.disabled = true;

  message.textContent = "Experiment reset.";

});
