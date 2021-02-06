const {sequelize, User} = require("./database/models");
const bodyParser = require('body-parser')
const express = require("express");



// sequelize.sync({force: true});


const app = express();

app.use(bodyParser.json())



/**
 * 
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
 * 
 */
app.post('/user', (req, res) => {
    User.create(req.body)
    .then(created => res.status(200).send(created))
    .catch(error => res.status(500).send(error));
})

/**
 * 
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
 * 
 */
app.delete('/user', (req, res) => {
    User.destroy({
        where:{
            id: req.query.id
        }
    }).then(destroyed => res.status(200).send(destroyed))
    .catch(error => res.status(500).send(error));
})

app.listen(3000);

