const jwt = require("jsonwebtoken");
const cfg = require("../config/cfg");

const criar_token = (id, usuario, email) => {
    return jwt.sign({id:id,usuario:usuario,email:email},cfg.jwt_secret,{expiresIn:cfg.jwt_expires});
}

module.exports = criar_token;