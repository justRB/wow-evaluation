const Character = require('../models/Character');
const User = require('../models/User');

exports.create = (req, res, next) => {

    const classes = ['guerrier', 'paladin', 'chasseur', 
    'voleur', 'prêtre', 'chaman', 'mage', 'démoniste', 'moine',
    'druide', 'chasseur de démons', 'chevalier de la mort', 'évocateur'];

    if (!classes.includes(req.body.class)){
        return res.status(400).json({error: "Classe non valide"});
    }
  
    const character = new Character({
        name: req.body.name,
        class: req.body.class,
        level: req.body.level,
        userId: "63edf26db1b49c75d9cbfa58" //req.auth.userId
    });

    character.save()
        .then(() => {
            res.status(201).json({message: "Création du personnage avec succès"});
        })
        .catch(error => res.status(400).json({error}));
}

exports.showOne = (req, res, next) => {

    User.findOne({email: req.params.email})
        .then(user => {

            if(!user){
                return res.status(401).json({message: "Utilisateur introuvable"});
            }

            Character.findOne({_id: req.params.id, userId: user._id})
                .then(character => res.status(200).json(character))
                .catch(error => res.status(400).json({error}));
        })
        .catch(error => res.status(400).json({error}));
}

exports.showAll = (req, res, next) => {

    User.findOne({email: req.params.email})
        .then(user => {

            if(!user){
                return res.status(401).json({message: "Utilisateur introuvable"});
            }

            Character.find({userId: user._id})
                .then(character => res.status(200).json(character))
                .catch(error => res.status(400).json({error}));
        })
        .catch(error => res.status(400).json({error}));
}

exports.modify = (req, res, next) => {

    Character.findOne({_id: req.params.id})
        .then((character) => {

            if (character.userId !== req.auth.userId && !req.hasOwnProperty('admintoken')) {
                return res.status(401).json({message: "Non autorisé"});
            } 

            Character.updateOne(
                {
                    _id: req.params.id
                },
                {
                    name: req.body.name,
                    class: req.body.class,
                    level: req.body.level , _id: req.params.id
                }        
            )
            .then(() => {
                res.status(200).json({message: "Personnage modifié avec succès"})
            }) 
            .catch(error => res.status(400).json({error}));
        })
        .catch(error => res.status(400).json({error}));
}

exports.delete = (req, res, next) => {

    Character.findById({_id: req.params.id})
        .then((character) => {
  
            if (character.userId !== req.auth.userId && !req.hasOwnProperty('admintoken')) {
                return res.status(401).json({message: "Non autorisé"});
            } 

            Character.deleteOne({_id: req.params.id}) 
                .then(() => res.status(200).json({message: "Personnage supprimé avec succès"}))
                .catch(error => res.status(400).json({error}))    
        })
        .catch(error => res.status(400).json({error}));
}

