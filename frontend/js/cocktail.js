const apiUrl = 'http://localhost:3000/cocktailById';
const apiUrl2 = 'http://localhost:3000/cocktail-ingredients-';
const urlParams = new URLSearchParams(window.location.search);
const cocktailId = urlParams.get('id'); // Récupérer l'id du cocktail depuis l'URL
cocktail = null; // Initialiser la variable cocktail


async function fetchInfo() {
    console.log(apiUrl + cocktailId);
    try {
        // Envoyer l'id comme paramètre de requête
        const response = await fetch(`${apiUrl}?id=${cocktailId}`);
        
        if (!response.ok) {
            throw new Error('Erreur lors de la récupération des informations du cocktail');
        }
        cocktail = await response.json(); // Mettre à jour currentMatch
        displayinfo(cocktail);
    } catch (error) {
        console.error('Erreur lors de la récupération des informations du cocktail:', error);
    }
}

async function fetchMatchs(id) {
    try {
        const response = await fetch(`${apiUrl2}${id}`);
        
        if (!response.ok) {
            throw new Error('Erreur lors de la récupération des matchs');
        }

        const data = await response.json();
        return data; // retourne directement les ingrédients
    } catch (error) {
        console.error('Erreur lors de la récupération des matchs:', error);
        return []; // retourne une liste vide en cas d'erreur
    }
}

async function displayinfo(data) {
    const cocktail = data[0];
    console.log(cocktail.name);

    const ingredients = await fetchMatchs(cocktail.id); // 👈 await ici

    const image = document.getElementById('cocktail_img');
    image.src = `../public/img/Cocktail/${cocktail.name}.webp`;

    const name = document.getElementById('cocktail_name');
    name.textContent = cocktail.name;

    const ingredientsList = document.getElementById('ingredients');
    const recette = document.getElementById('recette');

    ingredientsList.innerHTML = '';
    recette.innerHTML = '';

    ingredienttabName = document.getElementById('Ingredients');
    ingredienttabName.textContent = "Ingrédients (" + ingredients.length + ")";

    ingredients.forEach(item => {
        const p = document.createElement('p');
        p.textContent = `- ${item.ingredientName}`;
        ingredientsList.appendChild(p);
    });

    recette.textContent = cocktail.instructions;


}


function showTab(tabName) {
    const tabs = document.querySelectorAll('.tab');
    const contents = document.querySelectorAll('.content');

    tabs.forEach(tab => {
      tab.classList.remove('active');
    });

    contents.forEach(content => {
      content.classList.add('hidden');
    });

    document.querySelector(`.tab[onclick*="${tabName}"]`).classList.add('active');
    document.getElementById(tabName).classList.remove('hidden');
  }

window.onload = fetchInfo;