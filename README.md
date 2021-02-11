### Tech

This Simple CRUD uses a number of open source projects to work properly:

* [node.js] - evented I/O for the backend
* [Express] - fast node.js network app framework [@tjholowaychuk]
* [Sequelize] - Plugin to help us simplified all querys and comunitcation with almost any database available.
* [Sequelize - cli] - This plugin is a tool for migration and structure creation of databases

### Installation

This Simple Crud requires [Node.js](https://nodejs.org/) v4+ to run.

```sh
$ cd crud-moviles
$ npm install -d
```
after completing the npm install put the next command to create the database folder in the specified location.

```sh
$ cd crud-moviles/database
$ npx sequelize init:config
```

By doing this we will create the Config.json file, where we need to put our database credentials and name, also we will need to uncomment and specific line for the synchronization of the database with our models.

```sh
//sequelize.sync({force: true}); Line 7, server.js
```

now we can migrate our database model to the database you put in the config.json File just initializing the server for the first time, then we can delete the line because we only need to synchronize our models one time.

```sh
$ node .
```

The server will work on Port 3000, this port can be changed in the server.js File, for the management of the route for the server can be located in http://localhost:(selected port)/user.

And that would be all the installation you will need for this CRUD.

### Security Update 

In this Update we added 2 new Security Features:

* [JsonWebToken] - With JwToken the server will know if the user is a really Log in.
* [Sha256] - With this Algorithim the Server can Encrypt all the Passwords of the users.
* [Keypair] - This is a Private/Public Key Generator

When the server starts for the first time wil created a Private Key, The time a user gets Created the Function Token will take the Users Data and the Private Keys to create a Token. With this token the server can know if the user Exist in the Database and if the User is real thanks to the Tokens Value.