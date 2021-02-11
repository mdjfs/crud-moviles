const fs = require("fs");
const path = require("path");
const keypair = require("keypair");
const jwt = require("jsonwebtoken");
const {User} = require("./database/models");

const keys = {
    private: null,
    public: null
}
const keys_path = path.join(__dirname, "./keys");

/**
 * Here the server will create the Private Keys in the case that the keys are already cretaed this will only read it
 */
if(!fs.existsSync(keys_path)){
    fs.mkdirSync(keys_path);   
    const pair = keypair();
    keys.private = pair.private;
    keys.public = pair.public;
    fs.writeFileSync(path.join(keys_path, "key"), keys.private);
    fs.writeFileSync(path.join(keys_path, "key.pub"), keys.public);
}else{
    keys.private = fs.readFileSync(path.join(keys_path, "key"), {encoding: "utf-8"});
    keys.public = fs.readFileSync(path.join(keys_path, "key.pub"), {encoding: "utf-8"});
}

/**
 * This will know if the user ID Exist or not
 */
async function findUser(target){
    const user = await User.findOne({
        where: target
    });
    if(!user) throw "Invalid user.";
    return user.dataValues;
}

/**
 * This Function will be use for Authentication, this Will get the JWToken Header 
 */
function protected(req, res, next){
    jwt.verify(req.header("X-User-Token"), keys.private, {algorithms: ['RS256']}, (err, decoded) => {
        if(!err){
            findUser({id : decoded.id})
            .then(user => {
                req.user = user;
                next();
            }).catch(err => res.status(500).send(err));
        }else res.status(500).send(err);
    })
}

/**
 * This Function Creates the "Token", this will get not only the user Info, also will get a Private Key 
 */
async function token(body){
    if(!body.password) throw "No password provided.";
    const user = await findUser(body);
    if(!user) throw "Invalid user or password.";
    else{
        const result = jwt.sign(JSON.stringify(user), keys.private, {algorithm: 'RS256'});
        return result;
    }
}

module.exports = {protected, token};