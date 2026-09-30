const {
    initializeApp,
    cert,
    getApps
} = require("firebase-admin/app");

const {
    getAuth
} = require("firebase-admin/auth");

let serviceAccount;

if (process.env.FIREBASE_SERVICE_ACCOUNT_B64) {
    serviceAccount = JSON.parse(
        Buffer.from(
            process.env.FIREBASE_SERVICE_ACCOUNT_B64,
            "base64"
        ).toString("utf8")
    );
} else {
    serviceAccount = require("./serviceAccountKey.json");
}

const firebaseApp =
    getApps().length > 0
        ? getApps()[0]
        : initializeApp({
              credential: cert(serviceAccount)
          });

const auth = getAuth(firebaseApp);

module.exports = {
    firebaseApp,
    auth
};