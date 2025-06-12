const admin = require("firebase-admin");
const serviceAccount = require("./fit-found-5448f95255d7.json");

admin.initializeApp({
  credential: admin.credential.cert(serviceAccount),
});

module.exports = admin;