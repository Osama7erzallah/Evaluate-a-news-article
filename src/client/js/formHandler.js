import axios from "axios";
import { isValidURL } from "./validateURL";

const validateURLInput = (urlValue) => {
  const feedbackSection = document.querySelector(".feedback-wrapper");

  const isURLValid = isValidURL(urlValue);
  if (!isURLValid) {
    feedbackSection.innerHTML =
      "<p class='feedback-error'>Please enter a valid URL. URLs should start with http:// or https:// and include a domain name.</p>";
    return false;
  }
  return true;
};

const setLoaderVisibility = (isVisible) => {
  const loadingSpinner = document.querySelector(".loader");

  loadingSpinner.style.visibility = isVisible ? "visible" : "hidden";
};

const displayErrorMessage = (isVisible, message) => {
  const errorSection = document.querySelector(".error-wrapper");

  errorSection.innerHTML = `<p class='error-message'>${message}</p>`;
  errorSection.style.display = isVisible ? "block" : "none";
};

const displayResults = (responseData) => {
  const resultContainer = document.getElementById("results");

  if (!responseData) {
    displayErrorMessage(
      true,
      "An unexpected internal error occurred. Please try again later."
    );
    return;
  }

  if (responseData?.error) {
    displayErrorMessage(true, responseData.error);
    return;
  }

  resultContainer.innerHTML = `
    <p class="result-part">Sentiment Score: <span>${responseData.score_tag}</span></p>
    <p class="result-part">Agreement Level: <span>${responseData.agreement}</span></p>
    <p class="result-part">Subjectivity Level: <span>${responseData.subjectivity}</span></p>
    <p class="result-part">Confidence Level: <span>${responseData.confidence}</span></p>
    <p class="result-part">Irony Detected: <span>${responseData.irony}</span></p>
  `;
};

const submitFormHandler = async (event) => {
  event.preventDefault();

  const urlInputElement = document.querySelector("#url-form input");
  const feedbackSection = document.querySelector(".feedback-wrapper");
  feedbackSection.innerHTML = "";
  displayErrorMessage(false, "");

  const isURLValid = validateURLInput(urlInputElement.value);
  if (!isURLValid) {
    return;
  }

  setLoaderVisibility(true);
  try {
    const apiResponse = await axios.post("http://localhost:8000/", {
      url: urlInputElement.value,
    });
    displayResults(apiResponse.data);
    feedbackSection.innerHTML =
      "<p class='feedback-success'>The URL was successfully analyzed! Check the results below.</p>";
  } catch (error) {
    displayErrorMessage(
      true,
      "There was an error processing your request. Please try again later."
    );
  } finally {
    setLoaderVisibility(false);
  }
};

export { submitFormHandler };
