const express = require('express'); // Importer le package express pour créer un serveur web
const cors = require('cors'); // Importer le package cors pour autoriser les requêtes HTTP
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

// Documentation de l'API pour la route /ingredient/search
/**
 * @swagger
 * /ingredient/search:
 *   get:
 *     summary: Récupérer des ingrédients par nom
 *     parameters:
 *       - name: name
 *         in: query
 *         description: Nom de l'ingrédient à rechercher
 *         required: false
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: Liste des ingrédients trouvés
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

// Route pour rechercher des ingrédients par nom
app.get('/ingredient/search', (req, res) => {
    const name = req.query.name;
    const query = name ? `SELECT * FROM ingredient WHERE name LIKE ?` : `SELECT * FROM ingredient`;
    const params = name ? [`%${name}%`] : [];

    db.all(query, params, (err, rows) => {
        if (err) {
            res.status(500).json({ error: err.message });
            return;
        }
        res.json(rows);
    });
});

// Documentation de l'API pour les recettes de cocktails
/**
 * @swagger
 * /cocktails:
 *   get:
 *     summary: Récupérer toutes les recettes de cocktails
 *     responses:
 *       200:
 *         description: Liste de toutes les recettes de cocktails
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

// Route pour récupérer toutes les recettes de cocktails
app.get('/cocktails', (req, res) => {
    db.all('SELECT * FROM cocktails', [], (err, rows) => {
        if (err) {
            res.status(500).json({ error: err.message });
            return;
        }
        res.json(rows);
    });
});

// Documentation de l'API pour les ingrédients d'un cocktail
/**
 * @swagger
 * /cocktail/{id}/ingredients:
 *   get:
 *     summary: Récupérer les ingrédients d'un cocktail par ID
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
 *                   id:
 *                     type: integer
 *                   name:
 *                     type: string
 *       500:
 *         description: Erreur du serveur
 */

// Route pour récupérer les ingrédients d'un cocktail par ID
app.get('/cocktail/:id/ingredients', (req, res) => {
    const cocktailId = req.params.id; // Récupérer l'ID du cocktail depuis l'URL
    db.all('SELECT ingredient.name FROM cocktail_ingredients JOIN ingredient ON cocktail_ingredients.ingredient_id = ingredient.id WHERE cocktail_ingredients.cocktail_id = ?', [cocktailId], (err, rows) => {
        if (err) {
            res.status(500).json({ error: err.message });
            return;
        }
        res.json(rows);
    });
});

// Démarrer le serveur sur le port 3000
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
    console.log(`Le serveur est en cours d'exécution sur http://localhost:${PORT}`);
});
