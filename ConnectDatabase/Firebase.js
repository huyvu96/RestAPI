
var admin = require("firebase-admin");

var serviceAccount = require("../livestreaming-46229-firebase-adminsdk-p003d-bef483287f");

const firebase = admin.initializeApp({
    credential: admin.credential.cert(serviceAccount),
    databaseURL: "https://livestreaming-46229.firebaseio.com"
});
module.exports = firebase;