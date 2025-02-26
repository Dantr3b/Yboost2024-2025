const apiUrl = 'http://localhost:3000/matchs';
const apiUrl2 = 'http://localhost:3000/cocktail-ingredients-';
let rejectedMatches = [];
let currentMatch = null; // Déclaration de currentMatch à l'échelle globale

async function fetchMatchs() {
    console.log(apiUrl + '?rejected=' + rejectedMatches.join(','));
    try {
        // Envoyer rejectedMatches comme paramètre de requête
        const response = await fetch(`${apiUrl}?rejected=${rejectedMatches.join(',')}`);
        
        if (!response.ok) {
            throw new Error('Erreur lors de la récupération des matchs');
        }
        currentMatch = await response.json(); // Mettre à jour currentMatch
        displayMatch(currentMatch);
        fetchInfo();
    } catch (error) {
        console.error('Erreur lors de la récupération des matchs:', error);
    }
}

async function fetchInfo() {
    console.log(apiUrl2 + currentMatch.id);
    try {
        // Envoyer rejectedMatches comme paramètre de requête
        const response = await fetch(`${apiUrl2}${currentMatch.id}`);
        
        if (!response.ok) {
            throw new Error('Erreur lors de la récupération des matchs');
        }
        currentMatch = await response.json(); // Mettre à jour currentMatch
        console.log("dka");
        displayinfo(currentMatch);
    } catch (error) {
        console.error('Erreur lors de la récupération des matchs:', error);
    }
}

function displayMatch(match) {
    const matchDiv = document.querySelector('.match');
    matchDiv.querySelector('.nom').textContent = match.name;
    if (match.name != "Aucun cocktail disponible"){
        matchDiv.querySelector('.ingredients').textContent = match.ingredient_count+" - ingrédients";
    }
    else{
        matchDiv.querySelector('.ingredients').textContent = "";
    }
}

function displayinfo(data) {
    const ingredientsList = document.getElementById('ingredients_list');
    
    // Effacer les éléments précédents pour éviter les doublons
    ingredientsList.innerHTML = '';

    // Ajouter chaque ingrédient en tant qu'élément <li>
    data.forEach(item => {
        const li = document.createElement('li');
        li.textContent = `- ${item.ingredientName}`;
        ingredientsList.appendChild(li);
    });

    // Ajouter la garniture et les instructions
    const garnishDiv = document.querySelector('.garniture');
    garnishDiv.textContent = `Garniture : ${data[0].garnish}`;
}

function skip() {
    // Ajouter l'ID du match actuel aux refusés et rechercher un nouveau match
    if (currentMatch && currentMatch.id) {
        rejectedMatches.push(currentMatch.id);
    }
    fetchMatchs();
}

function Make() {
    // Ajouter l'ID du match actuel aux refusés et rechercher un nouveau match
    if (currentMatch && currentMatch.id) {
        localStorage.setItem('selectedCocktailId', currentMatch.id); // Stocke l'ID dans localStorage
        window.location.href = 'page2.html'; // Redirige vers la page 2
    }
}

// Fonction pour ouvrir la page d'informations
function showInfo() {
    const infoPage = document.getElementById('info-page');
    if (infoPage.classList.contains('hidden')) {
      infoPage.classList.remove('hidden');
      infoPage.classList.add('visible');
    }else {
      infoPage.classList.remove('visible');
      infoPage.classList.add('hidden');
    }
  }
  
  // Fonction pour fermer la page
  function closeInfo() {
    console.log('closeInfo');
    const infoPage = document.getElementById('info-page');
    infoPage.classList.remove('visible');
    infoPage.classList.add('hidden');
  }
// Ajout d'un gestionnaire de clic à l'image du cocktail
document.querySelector('.match').addEventListener('click', showInfo);

// Initialisation au chargement de la page
window.onload = fetchMatchs;


  
  
  