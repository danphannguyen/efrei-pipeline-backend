const express = require('express');

const app = express();
const port = process.env.PORT || 3001;

// 1. Définition des fonctions
function sum(a, b) {
  return a + b;
}

// 2. Définition des routes
app.get('/api', (req, res) => {
  res.json({ message: 'Hello from backend!' });
});

// 3. EXPORTS (Indispensable pour tes tests unitaires)
// On exporte tout à la fin une fois que tout est bien défini
module.exports = { app, sum };

// 4. DÉMARRAGE DU SERVEUR
// On vérifie si le fichier est lancé directement ou importé par un test
// Cela évite que Jest ne laisse un processus ouvert à la fin des tests
if (require.main === module) {
  app.listen(port, () => {
    console.log(`API listening on port ${port}`);
  });
}