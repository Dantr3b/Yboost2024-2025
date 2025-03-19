// URL de l'API
const apiUrl = 'http://localhost:3000/cocktails/searchbyingredients?ingredients=';

// Fonction pour récupérer les paramètres GET de l'URL
function getQueryParams() {
    const params = new URLSearchParams(window.location.search);
    const ingredientIds = params.get("ingredients"); // Récupérer la valeur du paramètre "ingredients"
    return ingredientIds ? ingredientIds.split(",").map(Number) : []; // Convertir en tableau de nombres
}

// Récupération des ID
const selectedIngredientIds = getQueryParams();

if (selectedIngredientIds.length > 0) {
    fetch(`${apiUrl}${selectedIngredientIds.join(",")}`)
        .then(response => response.json())
        .then(data => {
            displayCocktails(data);
        })
        .catch(error => console.error("Erreur lors de la récupération des cocktails :", error));
}

// 🔥 Fonction pour afficher les cocktails sous forme de carte
function displayCocktails(cocktails) {
    const container = document.querySelector(".result");
    container.innerHTML = ""; // 🧹 Vider l'affichage précédent

    cocktails.forEach((cocktail, index) => {
        // Création de la carte
        const card = document.createElement("div");
        card.classList.add("cocktail-card");

        // Si le nombre de cocktails est impair, le premier prend toute la largeur
        if (cocktails.length % 2 !== 0 && index === 0) {
            card.classList.add("large"); // Premier cocktail en grand si impair
        } else {
            card.classList.add("normal");
        }

        // Ajouter l'événement "click" pour rediriger
        card.addEventListener("click", () => {
            window.location.href = `cocktail.html?id=${cocktail.cocktailId}`; // Redirection vers la page détails
        });

        // Image du cocktail
        const cocktailImage = document.createElement("img");
        cocktailImage.src = `img/Cocktail/${cocktail.cocktailName}.webp`;
        cocktailImage.alt = cocktail.cocktailName;
        cocktailImage.classList.add("cocktail-image");

        // Nom du cocktail (superposé)
        const cocktailName = document.createElement("h3");
        cocktailName.textContent = cocktail.cocktailName;
        cocktailName.classList.add("cocktail-name");

        // Ajouter les éléments à la carte
        card.appendChild(cocktailImage);
        card.appendChild(cocktailName);

        // Ajouter la carte au conteneur
        container.appendChild(card);
    });

    // Ajuster la grille après l'ajout des cartes
    adjustGrid(cocktails.length);
}

function adjustGrid(count) {
    const container = document.querySelector(".result");

    if (count % 2 !== 0) {
        // Si le nombre est impair, 1ère ligne = 1 grand + reste en 2x2
        container.style.gridTemplateColumns = "1fr 1fr";
    } else {
        // Sinon, tout est en 2x2
        container.style.gridTemplateColumns = "1fr 1fr";
    }
}

