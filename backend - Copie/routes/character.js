const express = require('express');
const router = express.Router();
const characterController = require('../controllers/character');
const auth = require('../middlewares/auth');

// POST : Création d'un personnage
router.post('/create', auth, characterController.create);

// POST : Récupérer les informations d'un personnage
router.get('/account/:email/:id', characterController.showOne);

// GET : Récupérer les informations de tous les personnages
router.get('/account/:email', characterController.showAll);

// PUT : Modifier les informations d'un personnage
router.put('/update/:id', auth, characterController.modify);

// DELETE : Supprimer un personnage
router.delete('/delete/:id', auth, characterController.delete);

module.exports = router;