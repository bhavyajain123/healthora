const { auth } =
  require("../config/firebase");


const firebaseAuth =
  async (req, res, next) => {

    try {

      const authHeader =
        req.headers.authorization;


      if (
        !authHeader ||
        !authHeader.startsWith("Bearer ")
      ) {

        return res.status(401).json({
          success: false,
          message:
            "Authorization token required"
        });

      }


      const token =
        authHeader.split("Bearer ")[1];


      const decodedToken =
        await auth.verifyIdToken(token);


      req.user =
        decodedToken;


      console.log(
        "✅ Firebase user verified:",
        decodedToken.uid
      );


      next();

    }

    catch (error) {

      console.error(
        "❌ Firebase auth error:",
        error.message
      );


      return res.status(401).json({

        success: false,

        message:
          "Invalid or expired Firebase token"

      });

    }

  };


module.exports = firebaseAuth;

