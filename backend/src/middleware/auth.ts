import { Strategy, ExtractJwt } from "passport-jwt";
import { read as readUser } from "../helpers/user";
import config from "../config";

const options = { 
    jwtFromRequest:  ExtractJwt.fromAuthHeaderAsBearerToken(),
    secretOrKey: config.secretKey
}

export default new Strategy(options, (user, done) => {
    readUser({id: user.id})
    .then(user => {
        done(null, user ? user : false);
    }).catch(err => done(err, false))
})  