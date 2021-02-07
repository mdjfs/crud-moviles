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

app.all('/token', (req, res) => {
    req.body.password = req.query.hash ? req.query.hash : sha256(req.body.password);
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
 * This Endpoint takes the ID and any specific data you want to modified from the User you selected
 */
app.put('/user', protected, (req, res) => {
    User.update(req.body, {
        where: req.user
    }).then(() => {
        req.body = {
            id: req.user.id
        };
        res.redirect(`/token?hash=${req.user.password}`);
    })
    .catch(error => res.status(500).send(error));
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
 * This is the Port how will listen for the JSONS
 */
app.listen(3000); 

