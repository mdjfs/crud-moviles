const {sequelize, User} = require("./database/models");
const bodyParser = require("body-parser");
const express = require("express");
const {protected, token} = require("./security");
const sha256 = require("tiny-sha256");

//sequelize.sync({force: true});

const app = express();

app.use(bodyParser.json());

/**
 * This Endpoint take all the Info and use it to post the user in the Database
 */
app.post('/user', (req, res) => {
    User.create(req.body)
    .then(() => res.redirect(307, '/token'))
    .catch(err => res.status(500).send(err));
})

/**
 * This Endpoint will be used for getting into the Token Route wich by the Method "all" The route can be accessed by using any other Endpoint
 */
app.all('/token', (req, res) => {
    req.body.password = sha256(req.body.password);
    token(req.body)
    .then(token => res.status(200).send(token))
    .catch(err => res.status(500).send(err));
})

/**
 * This Endpoint get the ID of the User and take the Info from the Database
 */
app.get('/user', protected, (req, res) => {
    res.status(200).send(req.user);
})

/**
 * This Endpoint takes the ID and any specific data you want to modified from the User you selected.
 * In the Security Update this EndPoint was Modified by adding the ability of taking not only the 
 * User Info but also the Token, This is because when you change your password, the Token will change as well
 */
app.put('/user', protected, (req, res) => {
    const pass = req.body.password ? sha256(req.body.password) : req.user.password;
    const promises = [
        User.update(req.body, {where: req.user}),
        token({
            id: req.user.id,
            password: pass
        })
    ];
    Promise.all(promises)
    .then(result => res.status(200).send(result[1]))
    .catch(err => res.status(500).send(err));
})

/**
 * This Endpoint take the ID of the user and Delete him from the Database
 */
app.delete('/user', protected, (req, res) => {
    User.destroy({
        where: req.user
    }).then(() => res.sendStatus(200))
    .catch(() => res.sendStatus(500));
})

/**
 * This is the Port who will listen to the JSONS
 */
app.listen(3000); 