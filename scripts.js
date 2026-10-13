// Sends the food name to /api/recipe and shows the recipe on the page

const form = document.querySelector("#recipe-form");
const input = document.querySelector("#food");
const button = document.querySelector("#generate");
const output = document.querySelector("#recipe");

form.addEventListener("submit", async (event) => {
  event.preventDefault();

  button.disabled = true;
  button.textContent = "Cooking…";
  output.hidden = false;
  output.textContent = "Thinking up a recipe for " + input.value + "…";

  try {
    const response = await fetch("/api/recipe", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ food: input.value })
    });
    const data = await response.json();
    output.textContent = data.recipe || data.error;
  } catch {
    output.textContent = "Couldn't reach the server. Is it running?";
  }

  button.disabled = false;
  button.textContent = "Generate recipe";
});
