/**
 * Checks if the given string contains only letters and spaces.
 * @param {string} str - The string to be checked.
 * @returns {boolean} - True if the string contains only letters and spaces, false otherwise.
 */
const containsOnlyLettersAndSpaces = (str) => {
  return /^[A-Za-z\s]*$/.test(str);
};

/**
 * Validates the name input. It checks if the name is not empty, contains only letters and spaces, and is not longer than 255 characters. Updates the error message accordingly.
 * @param {string} name - The name to be validated.
 * @returns {boolean} - True if the name is valid, false otherwise.
 */
const validateName = (name) => {
  if (!name) {
    error.innerText = "Name is Empty!";
    return false;
  } else if (!containsOnlyLettersAndSpaces(name)) {
    error.innerText = "Name should only contain letters and spaces!";
    return false;
  } else if (name.length > 255) {
    error.innerText = "Name should be at most 255 characters!";
    return false;
  }
  return true;
};

/**
 * Validates the gender selection. Checks if either the male or female option is checked.
 * @returns {boolean} - True if a gender is selected, false otherwise.
 */
const validateGender = () => {
  if (!isMale.checked && !isFemale.checked) {
    error.innerText = "Gender is not selected!";
    return false;
  }
  return true;
};

/**
 * Displays the gender prediction or an appropriate error message if the prediction is not available.
 * @param {Object} prediction - The prediction object containing gender and probability.
 * @param {string} name - The name for which the prediction is made.
 */
const showPrediction = ({ gender, probability }, name) => {
  if (!gender) {
    error.innerText = "No prediction is available for this name!";
    predictionText.innerText = "No prediction is available for this name!";
  } else {
    const percentage = (probability * 100).toFixed(2);
    predictionText.innerText = `${percentage}% ${gender}`;
  }
};

/**
 * Fetches the gender prediction for the given name using an external API.
 * @param {string} name - The name for which the prediction is required.
 */
const fetchPrediction = async (name) => {
  const url = new URL("https://api.genderize.io/");
  url.search = new URLSearchParams({ name }).toString();

  try {
    const response = await fetch(url, { method: "GET" });
    if (response.ok) {
      const body = await response.json();
      showPrediction(body, name);
    } else {
      handleResponseError(response.status);
    }
  } catch (e) {
    error.innerText = "An error occurred! Please try again later.";
  }
};

/**
 * Handles different response errors based on the status code.
 * @param {number} statusCode - The HTTP status code returned by the fetch request.
 */
const handleResponseError = (statusCode) => {
  switch (statusCode) {
    case 404:
      error.innerText = "No prediction is available for this name!";
      break;
    case 429:
      error.innerText = "Too many requests! Please try again later.";
      break;
    case 500:
    default:
      error.innerText = "An error occurred! Please try again later.";
  }
};

/**
 * Updates the text element to display the saved answer.
 * @param {string} name - The name that was saved.
 * @param {string} gender - The gender that was saved.
 */
const updateSavedAnswer = (name, gender) => {
  savedAnswerText.innerText = `${name} is ${gender}`;
  currentSavedAnswer.name = name;
  currentSavedAnswer.gender = gender;
};

/**
 * Retrieves and displays saved gender values for the given name.
 * @param {string} name - The name for which to retrieve saved values.
 */
const getSavedValues = (name) => {
  const gender = localStorage.getItem(name);
  gender ? updateSavedAnswer(name, gender) : savedAnswerText.innerText = `No gender is saved for ${name}`;
};

/**
 * Handles the form submission. Validates the name, fetches prediction, and displays saved values.
 * @param {Event} event - The form submission event.
 */
const handleFormSubmit = (event) => {
  event.preventDefault();
  const name = nameInput.value.trim();
  if (validateName(name)) {
    error.innerText = "";
    getSavedValues(name);
    fetchPrediction(name);
  }
};

/**
 * Handles saving the gender selection for the given name to localStorage.
 */
const handleSave = () => {
  const name = nameInput.value.trim();
  if (validateName(name) && validateGender()) {
    error.innerText = "";
    const gender = isMale.checked ? "male" : "female";
    localStorage.setItem(name, gender);
    updateSavedAnswer(name, gender);
  }
};

/**
 * Clears the saved gender value for the currently displayed name.
 */
const handleClear = () => {
  const name = currentSavedAnswer.name;
  localStorage.removeItem(name);
  savedAnswerText.innerText = `Cleared saved gender for ${name}`;
};

// DOM elements
const nameInput = document.getElementById("name");
const error = document.getElementById("error");
const form = document.getElementById("form");
const isMale = document.getElementById("male");
const isFemale = document.getElementById("female");
const predictionText = document.getElementById("prediction");
const savedAnswerText = document.getElementById("saved-answer");

// Object to store the current saved answer
const currentSavedAnswer = { name: "", gender: "" };

// Event listeners
form.onsubmit = handleFormSubmit;
