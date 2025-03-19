document.addEventListener("DOMContentLoaded", function() {
    const input = document.querySelector(".add-input");
    const ingredientList = document.querySelector(".ingredient");
    const apiUrl="http://localhost:3000/ingredient";


    // Charger les ingrédients stockés
    function loadIngredients() {
        const storedIngredients = JSON.parse(localStorage.getItem("ingredients")) || [];
        ingredientList.innerHTML = "";
        storedIngredients.forEach(ingredient => {
            addIngredientToDOM(ingredient.name);
        });
    }

    

    async function fetchIngredients() {
        document.querySelector('.ingredient_list').innerHTML = "";
        try {
            const response = await fetch(apiUrl);
            const ingredients = await response.json();
            
            const ingredientList = document.querySelector('.ingredient_list');
            ingredients.forEach(ingredient => {
                // Créer la carte de l'ingrédient
                const ingredientCard = document.createElement('div');
                ingredientCard.className = 'ingredient-card';
            
                // Image de l'ingrédient
                const ingredientImage = document.createElement('img');
                ingredientImage.src = `img/ingredient/${ingredient.name}`; // Assurez-vous que l'API renvoie `ingredient.image`
                ingredientImage.alt = ingredient.name;
                ingredientImage.className = 'ingredient-image';
            
                // Nom de l'ingrédient
                const ingredientName = document.createElement('p');
                ingredientName.textContent = ingredient.name;
                ingredientName.className = 'ingredient-name';
            
                // Bouton Ajouter (+)
                const addButton = document.createElement('button');
                addButton.className = 'add-button';
                addButton.innerHTML = '<i class="bx bx-plus"></i>'; // Icône de bouton
                addButton.onclick = () => ajouter(ingredient.id, ingredient.name);
            
                // Ajouter les éléments à la carte
                ingredientCard.appendChild(ingredientImage);
                ingredientCard.appendChild(ingredientName);
                ingredientCard.appendChild(addButton);
            
                // Ajouter la carte à la liste
                document.querySelector(".ingredient_list").appendChild(ingredientCard);
            });
            
            
        } catch (error) {
            console.error('Erreur lors de la récupération des ingrédients:', error);
        }
    }
    
    
    
    window.onload = fetchIngredients;
    // Charger les ingrédients existants au démarrage
    loadIngredients();
});

function searchIngredient() {
    const searchValue = document.querySelector('.add-input').value;
    const searchApiUrl = `http://localhost:3000/ingredient/search?name=${encodeURIComponent(searchValue)}`;

    fetch(searchApiUrl)
    .then(response => response.json())
    .then(ingredients => {
        const ingredientList = document.querySelector('.ingredient_list');
        ingredientList.innerHTML = ''; // Vider la liste actuelle

        ingredients.forEach(ingredient => {
            // Créer la carte de l'ingrédient
            const ingredientCard = document.createElement('div');
            ingredientCard.className = 'ingredient-card';
        
            // Image de l'ingrédient
            const ingredientImage = document.createElement('img');
            ingredientImage.src = `img/ingredients/${ingredient.name}`; // Assurez-vous que l'API renvoie `ingredient.image`
            ingredientImage.alt = ingredient.name;
            ingredientImage.className = 'ingredient-image';
        
            // Nom de l'ingrédient
            const ingredientName = document.createElement('p');
            ingredientName.textContent = ingredient.name;
            ingredientName.className = 'ingredient-name';
        
            // Bouton Ajouter (+)
            const addButton = document.createElement('button');
            addButton.className = 'add-button';
            addButton.innerHTML = '<i class="bx bx-plus"></i>'; // Icône de bouton
            addButton.onclick = () => ajouter(ingredient.id, ingredient.name);
        
            // Ajouter les éléments à la carte
            ingredientCard.appendChild(ingredientImage);
            ingredientCard.appendChild(ingredientName);
            ingredientCard.appendChild(addButton);
        
            // Ajouter la carte à la liste
            document.querySelector(".ingredient_list").appendChild(ingredientCard);
        });
        
        
    })
    .catch(error => {
        console.error('Erreur lors de la recherche des ingrédients:', error);
    });
}


function afficheringredients() {
    const storedIngredients = JSON.parse(localStorage.getItem("ingredients")) || [];
    const ingredientList = document.querySelector(".ingredient_list-container");
    if (ingredientList) {
        ingredientList.classList.add("show"); // Ajoute la classe pour l'affichage
    }
}

document.addEventListener("click", function(event) {
    const ingredientList = document.querySelector(".ingredient_list-container");
    const input = document.querySelector(".add-button");

    if (ingredientList &&
        !ingredientList.contains(event.target) &&
        !input.contains(event.target)) {
        
        ingredientList.classList.remove("show"); // Cache l'élément avec animation
    }
});

// Ajouter un ingrédient au DOM avec une icône de suppression
function addIngredientToDOM(ingredient) {
    const li = document.createElement("li");
    li.style.listStyle = "none"; // Supprime les puces de la liste
    li.textContent = ingredient; 

    // Création de l'icône de suppression
    const deleteIcon = document.createElement("i");
    deleteIcon.className = "bx bxs-trash"; // Ajoute l'icône de suppression
    deleteIcon.style.cursor = "pointer"; // Change le curseur pour indiquer un bouton cliquable
    deleteIcon.style.marginLeft = "10px"; // Espacement entre le texte et l'icône

    // Ajouter un événement pour supprimer l'ingrédient au clic
    deleteIcon.addEventListener("click", function() {
        removeIngredient(ingredient, li);
    });

    // Ajouter l'icône à l'élément <li>
    li.appendChild(deleteIcon);

    // Ajouter l'élément <li> à la liste
    document.querySelector(".ingredient").appendChild(li);
}


// Ajouter un ingrédient
function ajouter(id, name) {
    let ingredientsDom = JSON.parse(localStorage.getItem("ingredients")) || [];

    // Vérifier si l'ingrédient est déjà ajouté
    if (ingredientsDom.some(ingredient => ingredient.id === id)) {
        alert(`L'ingrédient ${name} est déjà sélectionné.`);
        return; // Ne pas ajouter l'ingrédient si déjà sélectionné
    }

    // Créer un objet ingrédient
    let newIngredient = { id: id, name: name };

    // Ajouter l'ingrédient à la liste
    ingredientsDom.push(newIngredient);

    // Stocker l'ingrédient dans LocalStorage
    localStorage.setItem("ingredients", JSON.stringify(ingredientsDom));

    // Ajouter au DOM
    addIngredientToDOM(newIngredient.name);
}

function removeIngredient(ingredient, li) {
    let ingredientsDom = JSON.parse(localStorage.getItem("ingredients")) || [];

    // Supprimer l'ingrédient correspondant
    ingredientsDom = ingredientsDom.filter(item => item.name !== ingredient);


    // Mettre à jour le localStorage
    localStorage.setItem("ingredients", JSON.stringify(ingredientsDom));

    // Supprimer l'élément du DOM
    if (li) {
        li.remove();
    } else {
        console.log("Erreur : élément LI introuvable.");
    }
}
