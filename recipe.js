const baseUrl = "https://www.themealdb.com";

const container = document.getElementById("meal-details-container");

// Get the ID from the URL
const params = new URLSearchParams(window.location.search);

const mealId = params.get("id");

// If there is no recipe ID
if (!mealId) {
  container.innerHTML = `
    <p class="error-message">
      No recipe was selected.
    </p>
  `;
} else {
  getMealDetails(mealId);
}

async function getMealDetails(mealId) {
  const mealUrl = `${baseUrl}/api/json/v1/1/lookup.php?i=${mealId}`;

  try {
    const response = await fetch(mealUrl);

    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }

    const data = await response.json();

    // Check whether the recipe exists
    if (!data.meals) {
      container.innerHTML = `
        <p class="error-message">
          Recipe not found.
        </p>
      `;

      return;
    }

    // Get the recipe
    const meal = data.meals[0];

    // Create ingredients array
    const ingredientsList = [];

    for (let i = 1; i <= 20; i++) {
      const ingredient = meal[`strIngredient${i}`];

      const measure = meal[`strMeasure${i}`];

      if (ingredient && ingredient.trim() !== "") {
        ingredientsList.push(`
          <li>
            <span class="ingredient-measure">
              ${measure ? measure : ""}
            </span>

            ${ingredient}
          </li>
        `);
      }
    }

    // Display recipe
    container.innerHTML = `

      <!-- Recipe Header -->

      <section class="recipe-header">

        <div>
          <p class="recipe-category">
            ${meal.strCategory}
          </p>

          <h1>
            ${meal.strMeal}
          </h1>

          <p class="recipe-area">
            Cuisine: ${meal.strArea}
          </p>
        </div>

      </section>


      <!-- Recipe Hero -->

      <section class="recipe-hero">

        <div class="recipe-image-container">

          <img
            src="${meal.strMealThumb}"
            alt="${meal.strMeal}"
            class="recipe-image"
          />

        </div>


        <div class="ingredients-container">

          <h2>
            Ingredients
          </h2>

          <ul class="ingredients-list">

            ${ingredientsList.join("")}

          </ul>

        </div>

      </section>


      <!-- Instructions -->

      <section class="instructions-container">

        <h2>
          Instructions
        </h2>

        <p class="instructions">
          ${meal.strInstructions}
        </p>

      </section>


      <!-- YouTube Video -->

      ${
        meal.strYoutube
          ? `
            <section class="video-container">

              <a
                href="${meal.strYoutube}"
                target="_blank"
                class="video-btn"
              >
                ▶ Watch Video Recipe
              </a>

            </section>
          `
          : ""
      }

    `;
  } catch (error) {
    console.error("Error fetching recipe:", error);

    container.innerHTML = `
      <p class="error-message">
        Something went wrong while loading the recipe.
      </p>
    `;
  }
}
