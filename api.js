const express = require('express'); 
const cors = require('cors');
const sqlite3 = require('sqlite3').verbose();
const swaggerJsdoc = require('swagger-jsdoc');
const swaggerUi = require('swagger-ui-express');

const app = express();
app.use(cors());
app.use(express.json());

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
        openapi: '3.0.0',
        info: {
            title: 'Cocktails API',
            version: '1.0.0',
            description: 'API pour récupérer des cocktails et leurs ingrédients',
        },
    },
    apis: ['./api.js'],
};

const swaggerDocs = swaggerJsdoc(swaggerOptions);
app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(swaggerDocs));

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
app.get('/cocktails/search/:name', (req, res) => {
    const cocktailName = req.params.name;
    const query = cocktailName === 'all' 
        ? 'SELECT * FROM cocktails' 
        : 'SELECT * FROM cocktails WHERE "name" LIKE ?';
    const param = cocktailName === 'all' ? [] : [`${cocktailName}%`];

    db.all(query, param, (err, rows) => {
        if (err) {
            res.status(500).json({ error: err.message });
            return;
        }
        res.json(rows);
    });
});

/**
 * @swagger
 * /ingredient:
 *   get:
 *     summary: Récupérer tous les ingrédients
 *     responses:
 *       200:
 *         description: Liste des ingrédients
 */
app.get('/ingredient', (req, res) => {
    db.all('SELECT * FROM ingredient', [], (err, rows) => {
        if (err) {
            res.status(500).json({ error: err.message });
            return;
        }
        res.json(rows);
    });
});

/**
 * @swagger
 * /cocktail-ingredients-{id}:
 *   get:
 *     summary: Récupérer les ingrédients d'un cocktail
 *     description: Retourne les informations d'un cocktail et ses ingrédients associés en fonction de l'ID du cocktail.
 *     parameters:
 *       - name: id
 *         in: path
 *         description: ID du cocktail
 *         required: true
 *         schema:
 *           type: integer
 *     responses:
 *       200:
 *         description: Liste des ingrédients du cocktail avec les détails
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 type: object
 *                 properties:
 *                   cocktailName:
 *                     type: string
 *                     description: Nom du cocktail
 *                   ingredientName:
 *                     type: string
 *                     description: Nom de l'ingrédient
 *                   type:
 *                     type: string
 *                     description: Type de l'ingrédient
 *                   quantity:
 *                     type: number
 *                     format: float
 *                     description: Quantité de l'ingrédient utilisée dans le cocktail
 *                   unit:
 *                     type: string
 *                     description: Unité de mesure de l'ingrédient
 *                   glass_type:
 *                     type: string
 *                     description: Type de verre utilisé pour le cocktail
 *                   garnish:
 *                     type: string
 *                     description: Garniture du cocktail
 *                   instructions:
 *                     type: string
 *                     description: Instructions pour préparer le cocktail
 *       500:
 *         description: Erreur du serveur lors de la récupération des données
 */

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
            res.status(500).json({ error: err.message });
            return;
        }
        res.json(rows);
    });
}); 


/**
 * @swagger
 * /cocktails/searchbyingredients:
 *   get:
 *     summary: Rechercher des cocktails par ingrédients
 *     description: Récupère les cocktails qui contiennent les ingrédients spécifiés.
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
 *                   cocktailId:
 *                     type: integer
 *                   cocktailName:
 *                     type: string
 *                   commonIngredientCount:
 *                     type: integer
 *                   ingredientNames:
 *                     type: string
 *       500:
 *         description: Erreur du serveur
 */

app.get('/cocktails/searchbyingredients', (req, res) => {

    // Récupérer les ingrédients depuis la requête et les transformer en tableau
    const ingredientNames = req.query.ingredients.split(',').map(ingredient => ingredient.trim());
    console.log(ingredientNames);

    // Construction des placeholders pour la requête SQL
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
    
    // Exécution de la requête SQL
    db.all(query, ingredientNames, (err, rows) => {
        if (err) {
            res.status(500).json({ error: err.message });
            return;
        }
        res.json(rows);
    });
});

app.get('/ingredient/search', (req, res) => {
    const name = req.query.name;
    // Construction de la requête SQL avec une condition en fonction de `name`
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



/**
 * @swagger
 * /matchs:
 *   get:
 *     summary: Récupérer un cocktail alcoolisé aléatoire en excluant les matchs refusés
 *     description: Retourne un cocktail alcoolisé aléatoire avec ses ingrédients, en excluant les cocktails dont les IDs sont fournis dans le paramètre `rejected`.
 *     parameters:
 *       - name: rejected
 *         in: query
 *         description: Liste des IDs des cocktails refusés, séparés par des virgules
 *         required: false
 *         schema:
 *           type: string
 *           example: "1,3,5"
 *     responses:
 *       200:
 *         description: Un cocktail alcoolisé aléatoire avec ses ingrédients
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 id:
 *                   type: integer
 *                   description: ID du cocktail
 *                 name:
 *                   type: string
 *                   description: Nom du cocktail
 *                 ingredients:
 *                   type: array
 *                   description: Liste des ingrédients du cocktail
 *                   items:
 *                     type: object
 *                     properties:
 *                       name:
 *                         type: string
 *                         description: Nom de l'ingrédient
 *                       quantity:
 *                         type: number
 *                         description: Quantité de l'ingrédient
 *                       unit:
 *                         type: string
 *                         description: Unité de mesure de l'ingrédient
 *       404:
 *         description: Aucun cocktail disponible
 *       500:
 *         description: Erreur du serveur lors de la récupération des données
 */



app.get('/matchs', (req, res) => {
    const rejected = req.query.rejected ? req.query.rejected.split(',').map(Number) : [];

    // Requête SQL pour sélectionner tous les cocktails alcoolisés en excluant les rejetés
    let cocktailQuery = `SELECT id, name FROM cocktails`;
    if (rejected.length > 0) {
        const placeholders = rejected.map(() => '?').join(',');
        cocktailQuery += ` WHERE id NOT IN (${placeholders})`;
    }

    db.all(cocktailQuery, rejected, (err, cocktails) => {
        if (err) {
            res.status(500).json({ error: err.message });
            return;
        }

        if (cocktails.length === 0) {
            return res.json({
                id: "0",
                name: "Aucun cocktail disponible",
            });
        }
        

        // Sélectionner un cocktail aléatoirement parmi ceux restants
        const randomCocktail = cocktails[Math.floor(Math.random() * cocktails.length)];
        const ingredientQuery = `
            SELECT ingredient.name, cocktail_ingredient.quantity, cocktail_ingredient.unit
            FROM cocktail_ingredient
            JOIN ingredient ON cocktail_ingredient.ingredient_id = ingredient.id
            WHERE cocktail_ingredient.cocktail_id = ?
        `;

        db.all(ingredientQuery, [randomCocktail.id], (err, ingredients) => {
            if (err) {
                res.status(500).json({ error: err.message });
                return;
            }
            res.json({
                id: randomCocktail.id,
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


process.on('SIGINT', () => {
    db.close((err) => {
        if (err) console.error('Erreur lors de la fermeture de la base de données :', err.message);
        console.log('Base de données fermée.');
        process.exit(0);
    });
});

app.listen(3000, () => console.log('API running on port 3000'));
