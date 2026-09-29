const { initializeApp, cert, getApps } =
    require("firebase-admin/app");

const { getAuth } =
    require("firebase-admin/auth");

const serviceAccount =
    require("./serviceAccountKey.json");


const firebaseApp =
    getApps().length > 0
        ? getApps()[0]
        : initializeApp({
            credential: cert(serviceAccount)
        });


const auth =
    getAuth(firebaseApp);


module.exports = {
    firebaseApp,
    auth
};