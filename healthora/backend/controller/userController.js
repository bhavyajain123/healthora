const User = require("../models/User");
const Article = require("../models/Article");


// =========================
// GET CURRENT USER PROFILE
// =========================

const getProfile = async (req, res) => {

  try {

    const firebaseUid = req.user.uid;

    console.log("Firebase UID:", firebaseUid);
console.log("Firebase Email:", req.user.email);

    const email =
      (req.user.email || "").toLowerCase();


    let user =
      await User.findOne({
        firebaseUid: firebaseUid
      }).select("-password");

      console.log("MongoDB User:", user);


    // Existing user ko Firebase UID se link karo
    if (!user && email) {

      user =
        await User.findOne({
          email: email
        }).select("-password");


      if (user) {

        user.firebaseUid =
          firebaseUid;

        await user.save();

      }

    }


    // MongoDB mein user nahi hai
    if (!user) {

      user =
        await User.create({

          firebaseUid: firebaseUid,

          name:
            req.user.name ||
            email.split("@")[0] ||
            "User",

          email: email,

          profileImage:
            req.user.picture || "",

          role: "user"

        });

    }


    return res.status(200).json({

      success: true,

      data: user

    });

  }

  catch (error) {

    console.error(
      "❌ Get profile error:",
      error
    );

    return res.status(500).json({

      success: false,

      message: "Failed to fetch profile",

      error: error.message

    });

  }

};


// =========================
// UPDATE PROFILE
// =========================

const updateProfile = async (req, res) => {

  try {

    const firebaseUid =
      req.user.uid;

    const {
      name,
      profileImage
    } = req.body;


    const user =
      await User.findOne({
        firebaseUid: firebaseUid
      });


    if (!user) {

      return res.status(404).json({

        success: false,

        message: "User not found"

      });

    }


    if (
      name !== undefined &&
      name.trim() !== ""
    ) {

      user.name =
        name.trim();

    }


    if (
      profileImage !== undefined
    ) {

      user.profileImage =
        profileImage;

    }


    await user.save();


    return res.status(200).json({

      success: true,

      message:
        "Profile updated successfully",

      data: {

        id:
          user._id,

        firebaseUid:
          user.firebaseUid,

        name:
          user.name,

        email:
          user.email,

        profileImage:
          user.profileImage,

        role:
          user.role

      }

    });

  }

  catch (error) {

    console.error(
      "❌ Update profile error:",
      error
    );

    return res.status(500).json({

      success: false,

      message:
        "Failed to update profile",

      error:
        error.message

    });

  }

};



// =========================
// GET SAVED ARTICLES
// =========================

const getSavedArticles = async (req, res) => {

    try {

        const user =
            await User.findOne({
                firebaseUid: req.user.uid
            }).populate("savedArticles");

        if (!user) {

            return res.status(404).json({
                success: false,
                message: "User not found"
            });

        }

        return res.status(200).json({
            success: true,
            count: user.savedArticles.length,
            data: user.savedArticles
        });

    } catch (error) {

        console.error(
            "❌ Get saved articles error:",
            error
        );

        return res.status(500).json({
            success: false,
            message: "Failed to fetch saved articles",
            error: error.message
        });

    }

};


// =========================
// SAVE ARTICLE
// =========================

const saveArticle = async (req, res) => {

    try {

        const user =
            await User.findOne({
                firebaseUid: req.user.uid
            });

        if (!user) {

            return res.status(404).json({
                success: false,
                message: "User not found"
            });

        }


        const article =
            await Article.findById(
                req.params.articleId
            );

        if (!article) {

            return res.status(404).json({
                success: false,
                message: "Article not found"
            });

        }


        const alreadySaved =
            user.savedArticles.some(
                (id) =>
                    id.toString() ===
                    article._id.toString()
            );


        if (!alreadySaved) {

            user.savedArticles.push(
                article._id
            );

            await user.save();

        }


        return res.status(200).json({

            success: true,

            message:
                alreadySaved
                    ? "Article already saved"
                    : "Article saved successfully",

            data: article

        });

    } catch (error) {

        console.error(
            "❌ Save article error:",
            error
        );

        return res.status(500).json({

            success: false,

            message:
                "Failed to save article",

            error:
                error.message

        });

    }

};


// =========================
// REMOVE SAVED ARTICLE
// =========================

const removeSavedArticle = async (req, res) => {

    try {

        const user =
            await User.findOne({
                firebaseUid: req.user.uid
            });

        if (!user) {

            return res.status(404).json({
                success: false,
                message: "User not found"
            });

        }


        user.savedArticles =
            user.savedArticles.filter(
                (id) =>
                    id.toString() !==
                    req.params.articleId
            );


        await user.save();


        return res.status(200).json({

            success: true,

            message:
                "Article removed from saved articles"

        });

    } catch (error) {

        console.error(
            "❌ Remove saved article error:",
            error
        );

        return res.status(500).json({

            success: false,

            message:
                "Failed to remove saved article",

            error:
                error.message

        });

    }

};

module.exports = {
    getProfile,
    updateProfile,
    getSavedArticles,
    saveArticle,
    removeSavedArticle
};

