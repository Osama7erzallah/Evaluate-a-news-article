import "./styles/resets.scss";
import "./styles/base.scss";
import "./styles/footer.scss";
import "./styles/form.scss";
import "./styles/header.scss";
import { handleFormSubmit } from "./js/formHandler";

document
  .getElementById("url-form")
  .addEventListener("submit", handleFormSubmit);

export { handleFormSubmit };
