const bcrypt = require('bcrypt');
const User = require('../models/User');
const jwt = require('jsonwebtoken');
const fs = require('fs');
const axios = require('axios');

exports.signup = (req, res, next) => {

    axios.post('https://backend-tp-final-nodejs.agence-pixi.fr/wow/compte/check', {
        username: req.body.username,
        password: req.body.password
    })
    .then((response) => {
        const data = response.data;
        const decoded = jwt.verify(data.token, "SR1wKQYqlTLVWZSlYkot3xTu0qdZuWDn");

        res.status(200).json({
            userId: decoded.compteID,
            token: jwt.sign(
                { userId: decoded.compteID},
                data.token,
                { expiresIn: '24h'}
            )
        });
    })
    .catch((error) => {
        connectionFail();
        res.status(400).json({error});
    });
}

const connectionFail = () => {
    const date = new Date();
    const formatDate = 
        date.getFullYear() + 
        "-" + 
        date.getMonth().toString().padStart(2, '0') + 
        "-" + 
        date.getDay().toString().padStart(2, '0') +
        " " +
        date.getHours() +
        ":" +
        date.getMinutes() +
        ":" +
        date.getSeconds();

    fs.writeFile(
        './log/log.txt',
        `${formatDate} : tentative de connexion invalide\n`,
        {flag: 'a'},
        (err) => {if (err) throw err;}
    );
} 

exports.login = (req, res, next) => {

    User.findOne({email: req.body.email})
        .then(user => {

            if (!user){
                connectionFail();
                return res.status(401).json({message: "email ou mot de passe non valide"});
            }

            bcrypt.compare(req.body.password, user.password)
                .then(valid => {

                    if (!valid){
                        connectionFail();
                        return res.status(401).json({message: "email ou mot de passe non valide"});
                    }
                    
                    res.status(200).json({
                        userId: user._id,
                        token: jwt.sign(
                            { userId: user._id},
                            {admintoken: 'RANDOM_TOKEN_SECRET'},
                            { expiresIn: '1y'}
                        )
                    });

                })
                .catch(error => res.status(500).json({error}))

        })
        .catch(error => res.status(400).json({error}))
}