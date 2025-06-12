const admin = require("../config/firebase-admin");

const loginUser = (req, res) => {
    const { idToken } = req.body;

    admin
    .auth()
    .verifyIdToken(idToken)
    .then((decodedidToken) => {
      res.status(200).json({ decodedidToken });
    })
    .catch((error) => {
      res.status(401).json({ error });
    });
};

module.exports = { loginUser };