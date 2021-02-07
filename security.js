const fs = require("fs");
const path = require("path");
const keygen = require("ssh-keygen");
const jwt = require("jsonwebtoken");
const {User} = require("./database/models");

const keys = {
    private: null,
    public: null
}
const keys_path = path.join(__dirname, "./keys");

if(!fs.existsSync(keys_path)){
    fs.mkdirSync(keys_path);
    keygen({
        location: path.join(keys_path, "key"),
        format: "PEM",
    }, (err, out) => {
        if(!err){
            keys.private = out.key;
            keys.public = out.pubKey;
        }else console.error(err);
    });
}else{
    keys.private = fs.readFileSync(path.join(keys_path, "key"), {encoding: "utf-8"});
    keys.public = fs.readFileSync(path.join(keys_path, "key.pub"), {encoding: "utf-8"});
}


async function findUser(target){
    const user = await User.findOne({
        where: target
    });
    if(!user) throw "Invalid user.";
    return user.dataValues;
}

function protected(req, res, next){
    jwt.verify(req.header("X-User-Token"), keys.private, {algorithms: ['RS256']}, (err, decoded) => {
        if(!err){
            findUser(decoded)
            .then(user => {
                req.user = user;
                next();
            }).catch(err => res.status(500).send(err));
        }else res.status(500).send(err);
    })
}

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