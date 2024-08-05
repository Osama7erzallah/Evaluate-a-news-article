import axios from "axios";
import { isValidURL } from "./validateURL";

const handleURLValidation = (value) => {
  const feedback = document.querySelector(".feedback-wrapper");

  const isValid = isValidURL(value);
  if (!isValid) {
    feedback.innerHTML = "<p class='feedback-error'>Enter a valid URL</p>";
    return false;
  }
  return true;
};

const setLoading = (show) => {
  const loader = document.querySelector(".loading-spinner");
  loader.style.visibility = show ? "visible" : "hidden";
};

const handleError = (show, msg) => {
  const error = document.querySelector(".error-container");
  error.innerHTML = `<p>${msg}</p>`;
  error.style.display = show ? "block" : "none";
};

const renderResponse = (data) => {
  const results = document.getElementById("results");

  if (!data) {
    handleError(true, "Internal error");
    return;
  }

  if (data?.error) {
    handleError(true, data.error);
    return;
  }

  results.innerHTML = `
    <p class="result-part">Score: <span>${data.score_tag || "N/A"}</span></p>
    <p class="result-part">Agreement: <span>${
      data.agreement || "N/A"
    }</span></p>
    <p class="result-part">Subjectivity: <span>${
      data.subjectivity || "N/A"
    }</span></p>
    <p class="result-part">Confidence: <span>${
      data.confidence || "N/A"
    }</span></p>
    <p class="result-part">Irony: <span>${data.irony || "N/A"}</span></p>
  `;
};

export const handleSubmit = async (event) => {
  event.preventDefault();

  const input = document.querySelector("#url-input");
  const feedback = document.querySelector(".feedback-container");
  feedback.innerHTML = "";
  handleError(false, "");

  const isValid = handleURLValidation(input.value);
  if (!isValid) {
    return;
  }

  setLoading(true);
  try {
    const response = await axios.post("http://localhost:8000/", {
      url: input.value,
    });
    console.log("Server response:", response.data);
    renderResponse(response.data);
    feedback.innerHTML = "<p class='feedback-success'>Analysis successful!</p>";
  } catch (error) {
    console.error("Error during submission:", error);
    handleError(true, "Failed to analyze URL. Please try again.");
  } finally {
    setLoading(false);
  }
};
