const searchForm = document.getElementById("searchForm");
const searchInput = document.getElementById("searchInput");
const searchButton = document.getElementById("searchBtn");
const resultsContainer = document.querySelector(".results");

const baseUrl = "https://themealdb.com";

// Attach the event listener to the FORM (not the button)
searchForm.addEventListener("submit", searchRecipes);

// Create the async function to fetch data
async function searchRecipes(e) {
  // Prevent the browser from reloading the page
  e.preventDefault();

  // Get the user's search term and trim extra spaces
  const query = searchInput.value.trim();

  if (query.length < 3) return;

  const searchUrl = `${baseUrl}/api/json/v1/1/search.php?s=${query}`;

  try {
    // Make the API call
    const response = await fetch(searchUrl);

    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }

    const data = await response.json();
    searchInput.value = ""; // Clear the input field after search
    searchInput.blur(); // Remove focus from the input field

    // Pass the data to another function to display it on screen
    displayRecipes(data.meals);
  } catch (err) {
    console.error("Error fetching recipes:", err);
  }
}

function displayRecipes(meals) {
  console.log(meals);

  resultsContainer.innerHTML = ""; // Clear previous results

  if (!meals) {
    resultsContainer.innerHTML = "<p>No recipes found. Try another search!</p>";
    return;
  }

  meals.forEach((meal) => {
    const mealCard = document.createElement("div");
    mealCard.classList.add("meal-card");

    // Inject data using template literals
    mealCard.innerHTML = `
  <img
    src="${meal.strMealThumb}"
    alt="${meal.strMeal}"
  />

  <h2>${meal.strMeal}</h2>

  <button
    class="view-recipe-btn"
    onclick="window.location.href='recipe.html?id=${meal.idMeal}'"
  >
    View Recipe
  </button>
`;

    resultsContainer.appendChild(mealCard);
  });
}
