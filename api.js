const express = require('express'); // Importer le package express pour créer un serveur web
const cors = require('cors'); // Importer le package cors  pour autoriser les requêtes HTTP
const sqlite3 = require('sqlite3').verbose(); // Importer sqlite3 pour accéder à la base de données SQLite
const swaggerJsdoc = require('swagger-jsdoc'); // Importer swagger-jsdoc
const swaggerUi = require('swagger-ui-express'); // Importer swagger-ui-express

const app = express(); // Créer une application express

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

// Configuration de Swagger
const swaggerOptions = {
    definition: {
        openapi: '3.0.0', // Version OpenAPI
        info: {
            title: 'Cocktails API',
            version: '1.0.0',
            description: 'API pour récupérer des cocktails et leurs ingrédients',
        },
    },
    apis: ['./api.js'], // chemin vers le fichier où se trouvent les commentaires Swagger
};

// Initialiser swagger-jsdoc
const swaggerDocs = swaggerJsdoc(swaggerOptions);

// Utiliser swagger-ui-express pour servir l'interface Swagger
app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(swaggerDocs));

// Documentation de l'API pour la route /cocktails/search/:name
/**
 * @swagger
 * /cocktails/search/{name}:
 *   get:
 *     summary: Récupérer des cocktails par nom
 *     description: Récupère les cocktails dont le nom commence par le paramètre fourni.
 *     parameters:
 *       - name: name
 *         in: path
 *         description: Nom du cocktail à rechercher
 *         required: true
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: Liste des cocktails trouvés
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 type: object
 *                 properties:
 *                   id:
 *                     type: integer
 *                   name:
 *                     type: string
 *                   glass_type:
 *                     type: string
 *                   garnish:
 *                     type: string
 *                   instructions:
 *                     type: string
 *       500:
 *         description: Erreur du serveur
 */

// Route pour récupérer les cocktails par nom
app.get('/cocktails/search/:name', (req, res) => {
    const cocktailName = req.params.name; // Récupérer le nom du cocktail depuis l'URL
    const query = `SELECT * FROM cocktails WHERE "name" LIKE ?`;
    const param = `${cocktailName}%`; // Créer le paramètre pour la requête SQL

    if (cocktailName === 'all') {
        db.all('SELECT * FROM cocktails', [], (err, rows) => {
            if (err) {
                res.status(500).json({ error: err.message });
                return;
            }
            res.json(rows);
        });
    } else {
        db.all(query, [param], (err, rows) => {
            if (err) {
                res.status(500).json({ error: err.message });
                return;
            }
            res.json(rows);
        });
    }
});

// Documentation de l'API pour la route /ingredient
/**
 * @swagger
 * /ingredient:
 *   get:
 *     summary: Récupérer tous les ingrédients
 *     responses:
 *       200:
 *         description: Liste des ingrédients
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 type: object
 *                 properties:
 *                   id:
 *                     type: integer
 *                   name:
 *                     type: string
 *       500:
 *         description: Erreur du serveur
 */

// Route pour récupérer les ingrédients
app.get('/ingredient', (req, res) => {
    db.all('SELECT * FROM ingredient', [], (err, rows) => {
        if (err) {
            res.status(500).json({ error: err.message });
            return;
        }
        res.json(rows);
    });
});

// Documentation de l'API pour la route /cocktail-ingredients-:id
/**
 * @swagger
 * /cocktail-ingredients-{id}:
 *   get:
 *     summary: Récupérer les ingrédients d'un cocktail
 *     parameters:
 *       - name: id
 *         in: path
 *         description: ID du cocktail
 *         required: true
 *         schema:
 *           type: integer
 *     responses:
 *       200:
 *         description: Liste des ingrédients du cocktail
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 type: object
 *                 properties:
 *                   cocktailName:
 *                     type: string
 *                   ingredientName:
 *                     type: string
 *                   type:
 *                     type: string
 *                   quantity:
 *                     type: string
 *                   unit:
 *                     type: string
 *                   glass_type:
 *                     type: string
 *                   garnish:
 *                     type: string
 *                   instructions:
 *                     type: string
 *       500:
 *         description: Erreur du serveur
 */

// Route pour récupérer les ingrédients d'un cocktail par ID
app.get('/cocktail-ingredients-:id', (req, res) => {
    const id = req.params.id;
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
        WHERE cocktail_ingredient.cocktail_id = ?
    `;
    db.all(query, [id], (err, rows) => {
        if (err) {
            console.log(err);
            res.status(500).json({ error: err.message });
            return;
        }
        res.json(rows);
    });
});






// Documentation de l'API pour la route /cocktails/searchbyingredients
/**
 * @swagger
 * /cocktails/searchbyingredients:
 *   get:
 *     summary: Récupérer des cocktails par ingrédients
 *     description: Récupère les cocktails contenant les ingrédients spécifiés.
 *     parameters:
 *       - name: ingredients
 *         in: query
 *         description: Liste des ingrédients séparés par des virgules
 *         required: true
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: Liste des cocktails trouvés
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 type: object
 *                 properties:
 *                   cocktailName:
 *                     type: string
 *                   commonIngredientCount:
 *                     type: integer
 *                   ingredientNames:
 *                     type: string
 *                   glass_type:
 *                     type: string
 *                   garnish:
 *                     type: string
 *                   instructions:
 *                     type: string
 *       500:
 *         description: Erreur du serveur
 */

// Route pour récupérer les cocktails contenant les ingrédients spécifiés
app.get('/cocktails/searchbyingredients', (req, res) => {
    // Récupérer les ingrédients depuis la requête et les transformer en tableau
    const ingredientNames = req.query.ingredients.split(',').map(ingredient => ingredient.trim());

    // Construction des placeholders pour la requête
    const placeholders = ingredientNames.map(() => '?').join(',');

    // Requête SQL pour trouver les cocktails contenant les ingrédients spécifiés
    const query = `
        SELECT cocktails.id AS cocktailId,
               cocktails.name AS cocktailName, 
               COUNT(cocktail_ingredient.ingredient_id) AS commonIngredientCount,
               GROUP_CONCAT(ingredient.name) AS ingredientNames,
               cocktails.glass_type, 
               cocktails.garnish, 
               cocktails.instructions  
        FROM cocktails
        JOIN cocktail_ingredient ON cocktails.id = cocktail_ingredient.cocktail_id
        JOIN ingredient ON cocktail_ingredient.ingredient_id = ingredient.id
        WHERE ingredient.id IN (${placeholders})
        GROUP BY cocktails.id
        ORDER BY commonIngredientCount DESC
    `;
    
    db.all(query, ingredientNames, (err, rows) => {
        if (err) {
            res.status(500).json({ error: err.message });
            return;
        }
        res.json(rows);
    });
});

app.get('/matchs', (req,res) => {
    // Requête SQL pour sélectionner tous les cocktails alcoolisés
    const cocktailQuery = `SELECT id, name FROM cocktails`;

    db.all(cocktailQuery, (err, cocktails) => {
        if (err) {
            console.error('Erreur lors de la récupération des cocktails:', err);
            res.status(500).json({ error: 'Erreur lors de la récupération des cocktails' });
            return;
        }

        if (cocktails.length === 0) {
            res.status(404).json({ message: "Aucun cocktail disponible." });
            return;
        }

        // Sélectionner un cocktail aléatoirement
        const randomCocktail = cocktails[Math.floor(Math.random() * cocktails.length)];

        // Requête pour obtenir les ingrédients du cocktail sélectionné
        const ingredientQuery = `
            SELECT ingredient.name, cocktail_ingredient.quantity, cocktail_ingredient.unit
            FROM cocktail_ingredient
            JOIN ingredient ON cocktail_ingredient.ingredient_id = ingredient.id
            WHERE cocktail_ingredient.cocktail_id = ?
        `;

        db.all(ingredientQuery, [randomCocktail.id], (err, ingredients) => {
            if (err) {
                console.error('Erreur lors de la récupération des ingrédients:', err);
                res.status(500).json({ error: 'Erreur lors de la récupération des ingrédients' });
                return;
            }

            // Envoyer le nom et les ingrédients du cocktail sélectionné
            res.json({
                name: randomCocktail.name,
                ingredients: ingredients.map(ingredient => ({
                    name: ingredient.name,
                    quantity: ingredient.quantity,
                    unit: ingredient.unit
                }))
            });
        });
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
