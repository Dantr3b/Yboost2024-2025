const express = require('express');
const cors = require('cors'); // Importer le package cors
const sqlite3 = require('sqlite3').verbose(); // Importer sqlite3
const app = express();

app.use(cors()); // Autoriser toutes les origines à accéder à l'API
app.use(express.json()); // Middleware pour analyser le JSON

// Ouvrir la base de données SQLite
const db = new sqlite3.Database('./BSD/api.db', (err) => {
    if (err) {
        console.error('Erreur lors de l\'ouverture de la base de données :', err.message);
    } else {
        console.log('Connecté à la base de données SQLite.');
    }
});

// Route pour récupérer les utilisateurs
app.get('/cocktails', (req, res) => {
    db.all('SELECT * FROM cocktails', [], (err, rows) => {
        if (err) {
            res.status(500).json({ error: err.message });
            return;
        }
        res.json(rows);
    });
});

// Route pour récupérer les produits
app.get('/ingredient', (req, res) => {
    db.all('SELECT * FROM ingredient', [], (err, rows) => {
        if (err) {
            res.status(500).json({ error: err.message });
            return;
        }
        res.json(rows);
    });
});

// Route pour récupérer les produits
app.get('/cocktail-ingredients-:id', (req, res) => {

    const id = req.params.id;
    console.log(id);
    const query = `
        SELECT cocktails.name AS cocktailName, 
               ingredient.name AS ingredientName, 
               ingredient.type, 
               cocktail_ingredient.quantity, 
               cocktail_ingredient.unit, 
               cocktails.glass_type, 
               cocktails.garnish, 
               cocktails.instructions  
        FROM cocktail_ingredient 
        JOIN cocktails ON cocktail_ingredient.cocktail_id = cocktails.id
        JOIN ingredient ON cocktail_ingredient.ingredient_id = ingredient.id
        WHERE cocktail_ingredient.cocktail_id = ${id}
    `;
    db.all(query, [], (err, rows) => {
        if (err) {
            res.status(500).json({ error: err.message });
            return;
        }
        res.json(rows);
    });
});

// Arrêter la base de données lors de la fermeture du serveur
process.on('SIGINT', () => {
    db.close((err) => {
        if (err) {
            console.error('Erreur lors de la fermeture de la base de données :', err.message);
        }
        console.log('Base de données fermée.');
        process.exit(0);
    });
});

// Démarrer le serveur
app.listen(3000, () => console.log('API running on port 3000'));
