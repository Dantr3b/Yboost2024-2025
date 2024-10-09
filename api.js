const express = require('express');
const cors = require('cors'); // Importer le package cors
const app = express();

app.use(cors()); // Autoriser toutes les origines à accéder à l'API

app.get('/users', (req, res) => {
    res.json([{ id: 1, name: "Barbara" }, { id: 2, name: "Bob" }]);
}); // <-- L'accolade fermante manquait ici

app.get('/products', (req, res) => {
    res.json([{ id: 1, name: "Acer" }, { id: 2, name: "HP" }]);
});

app.listen(3000, () => console.log('API running on port 3000'));
