const express = require('express');
const router = express.Router();
const userController = require('../controllers/user');

// POST  : Vérification d'un compte existant
router.post('/account', userController.signup);

// POST : Connexion pour l'administrateur
router.post('/login', userController.login);

module.exports = router;