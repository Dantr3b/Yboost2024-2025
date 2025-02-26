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

// URL de votre API
const apiUrlSearch = 'http://localhost:3000/cocktails/search/';

// Fonction pour récupérer les cocktails
async function fetchcocktails() {
    // Vider la liste existante
    const cocktailList = document.getElementById('cocktail-list');
    cocktailList.innerHTML = "";
    document.getElementById('container').style.display = "none";
    cocktailList.style.display = "block";
  
    // Masquer le conteneur existant (si nécessaire)
    // document.querySelector('.container').style.display = "none";
  
    let param = document.querySelector('.search').value.trim();
    if (param === "") {
      cocktailList.style.display = "none";
      document.getElementById('container').style.display = "block";
    }
  
    try {
      // Récupère la liste des cocktails
      const response = await fetch(apiUrlSearch + param);
      const cocktails = await response.json();
  
      // Pour chaque cocktail, on crée une "carte"
      cocktails.forEach(cocktail => {
        // Conteneur principal de la carte
        const card = document.createElement('div');
        card.classList.add('cocktail-card');
  
        // Image du cocktail (si l’API renvoie un champ "image")
        // Sinon, utilisez une image par défaut (placeholder)
        const cardImage = document.createElement('img');
        cardImage.src = cocktail.image || 'img/Cocktailimg.png';
        cardImage.alt = cocktail.name;
  
        // Nom du cocktail
        const cardName = document.createElement('div');
        cardName.classList.add('card-name');
        cardName.textContent = cocktail.name;
  
        // Assemble la carte
        card.appendChild(cardImage);
        card.appendChild(cardName);
  
        // Au clic sur la carte, redirige vers une page de détails
        card.onclick = () => {
          // Stocke l’ID dans localStorage, ou utilisez un paramètre GET
          localStorage.setItem('selectedCocktailId', cocktail.id);
          window.location.href = 'page2.html'; 
          // OU par paramètre GET :
          // window.location.href = 'page2.html?id=' + cocktail.id;
        };
  
        // Ajoute la carte au conteneur
        cocktailList.appendChild(card);
      });
    } catch (error) {
      console.error('Erreur lors de la récupération des cocktails:', error);
    }
  }
  

// Ajout d'un gestionnaire de clic à l'image du cocktail
document.querySelector('.match').addEventListener('click', showInfo);

// Initialisation au chargement de la page
window.onload = fetchMatchs;


  
  
  