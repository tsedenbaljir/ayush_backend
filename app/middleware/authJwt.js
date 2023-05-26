const jwt = require("jsonwebtoken");
const config = require("../config/auth.config.js");

verifyToken = (req, res, next) => {
  let token = req.headers["x-access-token"];
  // const bearer = token.split(" ");
  // token = bearer[1];

  if (!token) {
    return res.status(403).send({
      message: "No token provided!"
    });
  }

  jwt.verify(token, config.secret, (err, decoded) => {
    if (err) {
      return res.status(401).send({
        message: "Unauthorized!"
      });
    }
    req.userId = decoded.id;
    next();
  });
};
isArticle = (req, res, next) => {
  User.findByPk(req.userId).then((user) => {
    user.getRoles().then((roles) => {
      for (let i = 0; i < roles.length; i++) {
        if (roles[i].name === "admin") {
          next();
          return;
        }

        if (roles[i].name === "article") {
          next();
          return;
        }
      }

      res.status(403).send({
        message: "Мэдээний эрхээр хандана уу!",
      });
    });
  });
};


const authJwt = {
  isArticle: isArticle, 
  verifyToken: verifyToken
};
module.exports = authJwt;
