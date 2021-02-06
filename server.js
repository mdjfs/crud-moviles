const {sequelize, User} = require("./database/models");
const bodyParser = require('body-parser')
const express = require("express");



//sequelize.sync({force: true});


const app = express();

app.use(bodyParser.json())



/**
 * This Endpoint get the ID of the User and take the Info from the Database
 */
app.get('/user', (req, res) => {
    User.findOne({
        where: {
            id: req.query.id
        }
    })
    .then(found => res.status(200).send(found))
    .catch(error => res.status(500).send(error));
})

/**
 * This Endpoint take all the Info and use it to post the user in the Database
 */
app.post('/user', (req, res) => {
    User.create(req.body)
    .then(created => res.status(200).send(created))
    .catch(error => res.status(500).send(error));
})

/**
 * This Endpoint takes the ID and any specific data you want to modified from the User you selected
 */
app.put('/user', (req, res) => {
    const id = req.body.id;
    delete req.body.id;
    User.update(req.body, {
        where: {
            id: id
        }
    }).then(updated => res.status(200).send(updated))
    .catch(error => res.status(500).send(error));
})

/**
 * This Endpoint take the ID of the user and Delete him from the Database
 */
app.delete('/user', (req, res) => {
    User.destroy({
        where:{
            id: req.query.id
        }
    }).then(destroyed => res.status(200).send(destroyed))
    .catch(error => res.status(500).send(error));
})


/**
 * This is the Port how will listen for the JSONS
 */
app.listen(3000); 

