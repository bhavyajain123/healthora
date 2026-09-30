import {
    onAuthStateChanged,
    signOut,
    GithubAuthProvider,
    linkWithPopup
} from "firebase/auth";
import {
    doc,
    getDoc,
    setDoc,
    serverTimestamp
} from "firebase/firestore";

import { auth, db } from "./firebase";

console.log("Dashboard auth check started");

onAuthStateChanged(auth, async (user) => {

    console.log("Firebase user:", user);

    // ================= LOGGED OUT =================

    if (!user) {
        window.location.replace("/login");
        return;
    }

    const token =
    await user.getIdToken();

const response =
    await fetch(
        "https://healthora.onrender.com/api/users/profile",
        {
            method: "GET",

            headers: {
                "Content-Type": "application/json",
                "Authorization":
                    `Bearer ${token}`
            }
        }
    );


if (!response.ok) {

    throw new Error(
        `Profile API failed: ${response.status}`
    );

}


const profileResult =
    await response.json();


console.log(
    "✅ MongoDB profile:",
    profileResult
);

const mongoUser =
    profileResult.data;

console.log(
    "✅ MongoDB user:",
    mongoUser
);



    // ================= FIRESTORE USER =================

    try {

        const userRef = doc(db, "users", user.uid);

        const userSnapshot = await getDoc(userRef);

        if (!userSnapshot.exists()) {

            await setDoc(userRef, {
                uid: user.uid,
                name: user.displayName || "User",
                email: user.email || "",
                interests: [],
                savedArticles: [],
                collections: [],
                stats: {
                    articlesRead: 0,
                    podcastsListened: 0,
                    streakDays: 0,
                    wellnessScore: 0
                },
                createdAt: serverTimestamp()
            });

            console.log("Firestore user profile created");

        } else {

            console.log("Firestore user profile already exists");

        }

    } catch (error) {

        // Firestore error dashboard/logout ko break nahi karega
        console.error("Firestore error:", error);

    }


    // ================= USER NAME & PROFILE IMAGE =================

const userName =
    (mongoUser?.name ||
     user.displayName ||
     user.email ||
     "User").trim();

const profileImage =
    (mongoUser?.profileImage ||
     user.photoURL ||
     "").trim();

const firstLetter =
    userName.charAt(0).toUpperCase();


// ================= HEADER NAME =================

const userNameElement =
    document.getElementById("header-user-name");

if (userNameElement) {
    userNameElement.textContent = `Hi, ${userName}`;
}


// ================= HEADER AVATAR =================

const userAvatarElement =
    document.querySelector(".user-avatar");

if (userAvatarElement) {

    userAvatarElement.innerHTML = "";

    if (profileImage) {

        userAvatarElement.innerHTML = `
            <img
                src="${profileImage}"
                alt="Profile"
                style="
                    width: 100%;
                    height: 100%;
                    object-fit: cover;
                    border-radius: 50%;
                    display: block;
                "
            >
        `;

    } else {

        userAvatarElement.textContent =
            firstLetter;

    }
}


// ================= PROFILE AVATAR =================

// ================= PROFILE AVATAR =================

const profileAvatar =
    document.querySelector(".profile-avatar-large");

if (profileAvatar) {

    profileAvatar.innerHTML = "";

    if (profileImage) {

        profileAvatar.innerHTML = `
            <img
                src="${profileImage}"
                alt="Profile"
                style="
                    width: 100%;
                    height: 100%;
                    object-fit: cover;
                    border-radius: 50%;
                    display: block;
                "
            >
        `;

    } else {

        profileAvatar.textContent =
            firstLetter;

    }
}
// ================= PROFILE NAME =================

const profileName =
    document.querySelector(".profile-info h1");

if (profileName) {

    profileName.textContent =
        userName;

}


// ================= PROFILE EMAIL =================

const profileEmail =
    document.querySelector(".profile-info p:first-of-type");

if (profileEmail) {

    profileEmail.textContent =
        mongoUser?.email ||
        user.email ||
        "";

}

    // ================= HOME GREETING =================

    const homeGreeting =
        document.getElementById("home-greeting");

    if (homeGreeting) {

        homeGreeting.textContent =
            `Good Evening, ${userName} 👋`;

    }


   // ================= PROFILE CARD NAME =================

const profileCardNameElement =
    document.querySelector(".profile-info .profile-name");

if (profileCardNameElement) {
    profileCardNameElement.textContent = userName;
}


const profileCardEmailElement =
    document.querySelector(".profile-info .profile-email");

if (profileCardEmailElement) {
    profileCardEmailElement.textContent =
        mongoUser?.email ||
        user.email ||
        "";
}

    // ================= PROFILE EDIT =================

const editProfileButton =
    document.querySelector(
        ".profile-card .primary-button"
    );

if (editProfileButton) {

    editProfileButton.onclick = async () => {

        const newName =
            prompt(
                "Enter your new name:",
                user.displayName || ""
            );

        if (newName === null) {
            return;
        }

        const cleanName =
            newName.trim();

        if (!cleanName) {

            alert(
                "Name cannot be empty."
            );

            return;
        }


            try {

                const token =
                    await user.getIdToken();

                const response =
    await fetch(
        "https://healthora.onrender.com/api/users/profile",
                        {
                            method: "PUT",

                            headers: {
                                "Content-Type":
                                    "application/json",

                                "Authorization":
                                    `Bearer ${token}`
                            },

                            body: JSON.stringify({
                                name: cleanName
                            })
                        }
                    );


                const result =
                    await response.json();


                if (!response.ok) {

                    throw new Error(
                        result.message ||
                        "Profile update failed"
                    );

                }


                // Firebase display name bhi update
                await import("firebase/auth")
                    .then(
                        ({ updateProfile }) =>
                            updateProfile(
                                user,
                                {
                                    displayName:
                                        cleanName
                                }
                            )
                    );


                // Screen par immediately update
                if (profileName) {

                    profileName.textContent =
                        cleanName;

                }

                if (userNameElement) {

                    userNameElement.textContent =
                        `Hi, ${cleanName}`;

                }

                if (homeGreeting) {

                    homeGreeting.textContent =
                        `Good Evening, ${cleanName} 👋`;

                }

                if (profileAvatar) {

                    profileAvatar.textContent =
                        cleanName
                            .charAt(0)
                            .toUpperCase();

                }


                alert(
                    "Profile updated successfully!"
                );


            } catch (error) {

                console.error(
                    "❌ Profile update error:",
                    error
                );

                alert(
                    "Profile update failed: " +
                    error.message
                );

            }

        }
    

}


    // ================= USER MENU =================

    const userMenu =
        document.querySelector(".user-menu");

    if (!userMenu) {
        return;
    }


    // Prevent duplicate dropdown
    if (document.getElementById("firebase-user-dropdown")) {
        return;
    }


    userMenu.style.cursor = "pointer";
    userMenu.style.position = "relative";


    // ================= DROPDOWN =================

    const dropdown =
        document.createElement("div");

    dropdown.id =
        "firebase-user-dropdown";

    dropdown.innerHTML = `
    <button
        type="button"
        id="firebase-link-github-btn"
    >
        🔗 Link GitHub
    </button>

    <button
        type="button"
        id="firebase-logout-btn"
    >
        🚪 Logout
    </button>
`;


    dropdown.style.cssText = `
        display: none;
        position: absolute;
        top: 52px;
        right: 0;
        width: 150px;
        background: #ffffff;
        border: 1px solid #e5e5e5;
        border-radius: 12px;
        padding: 8px;
        box-shadow: 0 8px 25px rgba(20,70,45,.12);
        z-index: 99999;
    `;


    userMenu.appendChild(dropdown);

    const linkGithubButton =
    document.getElementById(
        "firebase-link-github-btn"
    );


    // ================= LINK GITHUB =================

linkGithubButton.addEventListener(
    "click",
    async (event) => {

        event.preventDefault();
        event.stopPropagation();

        try {

            const provider =
                new GithubAuthProvider();

            console.log(
                "Starting GitHub linking..."
            );

            const result =
                await linkWithPopup(
                    auth.currentUser,
                    provider
                );

            console.log(
                "GitHub linked successfully:",
                result.user
            );

            console.log(
                "Linked Providers:",
                result.user.providerData.map(
                    (provider) =>
                        provider.providerId
                )
            );

            alert(
                "GitHub account linked successfully!"
            );

            dropdown.style.display =
                "none";

        } catch (error) {

            console.error(
                "GitHub Linking Error:",
                error
            );

            if (
                error.code ===
                "auth/provider-already-linked"
            ) {

                alert(
                    "GitHub is already linked to this account."
                );

            } else if (
                error.code ===
                "auth/credential-already-in-use"
            ) {

                alert(
                    "This GitHub account is already linked to another Healthora account."
                );

            } else if (
                error.code ===
                "auth/popup-closed-by-user"
            ) {

                console.log(
                    "GitHub popup closed by user."
                );

            } else if (
                error.code ===
                "auth/cancelled-popup-request"
            ) {

                console.log(
                    "GitHub popup request cancelled."
                );

            } else {

                alert(
                    "GitHub linking failed: " +
                    error.message
                );

            }

        }

    }
);

linkGithubButton.style.cssText = `
    width: 100%;
    border: none;
    background: transparent;
    padding: 10px 12px;
    border-radius: 8px;
    text-align: left;
    cursor: pointer;
    font-size: 13px;
    color: #222;
`;

linkGithubButton.addEventListener(
    "mouseenter",
    () => {
        linkGithubButton.style.background =
            "#f5f5f5";
    }
);

linkGithubButton.addEventListener(
    "mouseleave",
    () => {
        linkGithubButton.style.background =
            "transparent";
    }
);


    // ================= LOGOUT BUTTON =================

    const logoutButton =
        document.getElementById(
            "firebase-logout-btn"
        );


    logoutButton.style.cssText = `
        width: 100%;
        border: none;
        background: transparent;
        padding: 10px 12px;
        border-radius: 8px;
        text-align: left;
        cursor: pointer;
        font-size: 13px;
        color: #d32f2f;
    `;


    // ================= OPEN DROPDOWN =================

    userMenu.addEventListener("click", (event) => {

        // Logout button ko parent click se alag rakho
        if (
            event.target.closest(
                "#firebase-logout-btn"
            )
        ) {
            return;
        }

        event.stopPropagation();

        const isOpen =
            dropdown.style.display === "block";

        dropdown.style.display =
            isOpen ? "none" : "block";

    });


    // ================= LOGOUT =================

    

    logoutButton.addEventListener(
        "click",
        async (event) => {

            event.preventDefault();
            event.stopPropagation();

            console.log("Logout button clicked");

            try {

                await signOut(auth);

                console.log(
                    "Firebase logout successful"
                );

                // Firebase auth state listener
                // automatically redirects to login
                window.location.replace("/login");

            } catch (error) {

                console.error(
                    "Logout failed:",
                    error
                );

                alert(
                    "Logout failed. Please try again."
                );

            }

        }
    );


    // ================= CLOSE DROPDOWN =================

    document.addEventListener("click", (event) => {

    if (!userMenu.contains(event.target)) {
        dropdown.style.display = "none";
    }

});

});