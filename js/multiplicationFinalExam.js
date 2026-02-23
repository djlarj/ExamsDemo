const nameModal = document.getElementById("nameModal");
const closeNameModal = document.getElementById("closeNameModal");
const nameSubmitButton = document.getElementById("nameSubmit");

// Show the name modal when the page loads
window.onload = function () {
  nameModal.style.display = "block";
};

// Close the modal when the "Close" button is clicked
// closeNameModal.onclick = function () {
//     nameModal.style.display = 'none';
// };

// Close the modal when the user clicks outside of it
// window.onclick = function (event) {
//     if (event.target === nameModal) {
//         nameModal.style.display = 'none';
//     }
// };

// Add an event listener for the name submission modal
nameSubmitButton.addEventListener("click", function () {
  // Validate and process the user's name, then hide the modal
  const firstName = document.getElementById("firstName").value;
  const lastName = document.getElementById("lastName").value;

  if (firstName && lastName) {
    userName = `${firstName} ${lastName}`;
    nameModal.style.display = "none";
    displayQuestion();
  } else {
    alert("You must fill in both first and last name fields to get started.");
  }
});

// Enter key event listener for the name submission modal
const firstNameInput = document.getElementById("firstName");
const lastNameInput = document.getElementById("lastName");

// Add an event listener for the Enter key on the first name input field
firstNameInput.addEventListener("keydown", function (event) {
  if (event.key === "Enter") {
    event.preventDefault();
    simulateClick(nameSubmit);
  }
});

// Add an event listener for the Enter key on the last name input field
lastNameInput.addEventListener("keydown", function (event) {
  if (event.key === "Enter") {
    event.preventDefault();
    simulateClick(nameSubmit);
  }
});

// Function to simulate a click on a button
function simulateClick(button) {
  const clickEvent = new Event("click");
  button.dispatchEvent(clickEvent);
}

// Function to shuffle an array
function shuffleArray(array) {
  for (let i = array.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [array[i], array[j]] = [array[j], array[i]];
  }
}

// Quiz Data: Generate 10 multiplication problems (1–12 times tables)
const quizData = [];

for (let i = 0; i < 10; i++) {
  const num1 = Math.floor(Math.random() * 12) + 1; // 1–12
  const num2 = Math.floor(Math.random() * 13); // 0–12
  const correctAnswer = num1 * num2;

  const question = {
    question: `${num1} × ${num2} = ?`,
    options: [],
    answer: correctAnswer.toString(),
  };

  // Add the correct answer first
  question.options.push(correctAnswer.toString());

  const distractors = new Set();

  // Generate smart distractors
  while (distractors.size < 3) {
    let wrong;

    const method = Math.floor(Math.random() * 3);

    if (method === 0) {
      // Off-by-one or two
      wrong =
        correctAnswer +
        (Math.random() < 0.5 ? -1 : 1) * (Math.floor(Math.random() * 2) + 1);
    } else if (method === 1) {
      // Using nearby multiplier (num2 ± 1)
      const altMultiplier = num2 + (Math.random() < 0.5 ? -1 : 1);
      if (altMultiplier >= 0 && altMultiplier <= 12) {
        wrong = num1 * altMultiplier;
      } else {
        continue;
      }
    } else {
      // Another random multiplication from 1–12 × 0–12
      const altNum1 = Math.floor(Math.random() * 12) + 1;
      const altNum2 = Math.floor(Math.random() * 13);
      wrong = altNum1 * altNum2;
    }

    // Ensure it's valid and not the correct answer
    if (wrong >= 0 && wrong <= 144 && wrong !== correctAnswer) {
      distractors.add(wrong.toString());
    }
  }

  // Add distractors to options
  question.options.push(...distractors);

  // Shuffle options
  shuffleArray(question.options);

  quizData.push(question);
}

const quizContainer = document.getElementById("quiz");
const resultContainer = document.getElementById("result");
const submitButton = document.getElementById("submit");
const mainMenuButton = document.getElementById("mainMenu");
// const retryButton = document.getElementById('retry');
const showAnswerButton = document.getElementById("showAnswer");

let currentQuestion = 0;
let score = 0;
let incorrectAnswers = [];

function displayQuestion() {
  const questionData = quizData[currentQuestion];

  const questionElement = document.createElement("div");
  questionElement.className = "question";
  questionElement.innerHTML = questionData.question;

  const optionsElement = document.createElement("div");
  optionsElement.className = "options";

  for (let i = 0; i < questionData.options.length; i++) {
    const option = document.createElement("label");
    option.className = "option";

    const radio = document.createElement("input");
    radio.type = "radio";
    radio.name = "quiz";
    radio.value = questionData.options[i];

    const optionText = document.createTextNode(" " + questionData.options[i]);

    option.appendChild(radio);
    option.appendChild(optionText);
    optionsElement.appendChild(option);
  }

  quizContainer.innerHTML = "";
  quizContainer.appendChild(questionElement);
  quizContainer.appendChild(optionsElement);
}

function checkAnswer() {
  const selectedOption = document.querySelector('input[name="quiz"]:checked');
  if (selectedOption) {
    const answer = selectedOption.value;
    if (answer === quizData[currentQuestion].answer) {
      score++;
    } else {
      incorrectAnswers.push({
        question: quizData[currentQuestion].question,
        incorrectAnswer: answer,
        correctAnswer: quizData[currentQuestion].answer,
      });
    }
    currentQuestion++;
    selectedOption.checked = false;
    if (currentQuestion < quizData.length) {
      displayQuestion();
    } else {
      displayResult();
    }
  }
}

function displayResult() {
  quizContainer.style.display = "none";
  submitButton.style.display = "none";

  // Calculate the percentage
  const percentage = (score / quizData.length) * 100;

  // Initialize a message variable
  let message = `<br>${userName}<br>You scored ${score} out of ${quizData.length} (${percentage}%)`;

  // Check if the user's score is 80% or more and add a congratulatory message
  if (percentage >= 80) {
    message = `Congratulations! You Passed!\n${message}`;
  }

  // Add date and time stamp on separate lines
  const currentDate = new Date();
  const date = currentDate.toLocaleDateString("en-US", {
    month: "2-digit",
    day: "2-digit",
    year: "numeric",
  });

  // Format the time manually to ensure 12 AM is displayed as '00'
  let hours = currentDate.getHours().toString().padStart(2, "0");
  let minutes = currentDate.getMinutes().toString().padStart(2, "0");

  const time = `${hours}:${minutes}`;

  message += `<br>Date: ${date}\nTime: ${time}<br>Please Print this page before exiting.`;

  // Display the result with the message
  resultContainer.innerHTML = message;

  // Check if the user's score is 100%
  if (score === quizData.length) {
    mainMenuButton.style.display = "inline-block";
    // retryButton.style.display = 'none';
    showAnswerButton.style.display = "none";
  } else {
    // retryButton.style.display = 'inline-block';
    showAnswerButton.style.display = "inline-block";
  }
}

// function retryQuiz() {
//     currentQuestion = 0;
//     score = 0;
//     incorrectAnswers = [];
//     quizContainer.style.display = 'block';
//     submitButton.style.display = 'inline-block';
//     retryButton.style.display = 'none';
//     showAnswerButton.style.display = 'none';
//     resultContainer.innerHTML = '';
//     displayQuestion();
// }

function showAnswer() {
  quizContainer.style.display = "none";
  submitButton.style.display = "none";
  mainMenuButton.style.display = "inline-block";
  // retryButton.style.display = 'inline-block';
  showAnswerButton.style.display = "none";

  let incorrectAnswersHtml = "";
  for (let i = 0; i < incorrectAnswers.length; i++) {
    incorrectAnswersHtml += `
            <p>
                <strong>Question:</strong> ${incorrectAnswers[i].question}<br>
                <strong>Your Answer:</strong> ${incorrectAnswers[i].incorrectAnswer}<br>
                <strong>Correct Answer:</strong> ${incorrectAnswers[i].correctAnswer}
            </p>
        `;
  }

  // Calculate the percentage
  const percentage = (score / quizData.length) * 100;

  // Initialize a message variable
  let message = `<br>${userName}<br>You scored ${score} out of ${quizData.length} (${percentage}%)`;

  // Check if the user's score is 80% or more and add a congratulatory message
  if (percentage >= 80) {
    message = `Congratulations! You Passed!\n${message}`;
  }

  // Add date and time stamp on separate lines
  const currentDate = new Date();
  const date = currentDate.toLocaleDateString("en-US", {
    month: "2-digit",
    day: "2-digit",
    year: "numeric",
  });

  // Format the time manually to ensure 12 AM is displayed as '00'
  let hours = currentDate.getHours().toString().padStart(2, "0");
  let minutes = currentDate.getMinutes().toString().padStart(2, "0");

  const time = `${hours}:${minutes}`;

  message += `<br>Date: ${date}\nTime: ${time}<br>Please Print this page before exiting.`;

  // Display the result with the message and incorrect answers
  resultContainer.innerHTML = `${message}\n\nIncorrect Answers:${incorrectAnswersHtml}`;
}

function goHome() {
  window.location.href = "index.html";
}

submitButton.addEventListener("click", checkAnswer);
mainMenuButton.addEventListener("click", goHome);
// retryButton.addEventListener('click', retryQuiz);
showAnswerButton.addEventListener("click", showAnswer);

// Function to shuffle the quiz questions before displaying
shuffleArray(quizData);

// Display the first question when the page loads
// displayQuestion();

//Back-to-Top button
const btn = $("#btt-button");

$(window).scroll(function () {
  btn.toggleClass("show", $(window).scrollTop() > 100);
});

btn.on("click", function (e) {
  e.preventDefault();
  $("html, body").animate({ scrollTop: 0 }, 100);
});
