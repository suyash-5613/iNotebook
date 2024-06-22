const jwt = require("jsonwebtoken");

const verifyToken = (req, res, next) => {
  const token = req.headers["authorization"];

  if (!token) {
    return res.status(500).json({ message: "error" });
  }

  jwt.verify(token, "iNotebook", (err, decoded) => {
    if (err) {
      console.error(`JWT token verification failed: ${err.message}`);
      return res.status(500).json({ message: err });
    }

    req.id = decoded.id;
    next();
  });
};

module.exports = verifyToken;
