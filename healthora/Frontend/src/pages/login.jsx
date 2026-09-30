import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import {
    signInWithEmailAndPassword,
    sendPasswordResetEmail,
    signInWithPopup,
    GoogleAuthProvider,
    GithubAuthProvider,
    
} from "firebase/auth";
import { auth } from "../firebase";
import "../styles/auth.css";
function Login() {
    const navigate = useNavigate();

    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [showPassword, setShowPassword] = useState(false);

    async function syncUserWithBackend() {

    const user = auth.currentUser;

    if (!user) {
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

    const result =
        await response.json();

    console.log(
        "✅ MongoDB user synced:",
        result
    );

}

    async function handleLogin(event) {
        event.preventDefault();

        if (!email || !password) {
            alert("Please enter email and password.");
            return;
        }

        try {
            await signInWithEmailAndPassword(
                auth,
                email,
                password
            );
await syncUserWithBackend();

alert("Login successful!");

window.location.href =
    "/dashboard.html";

       } catch (error) {
    console.error("FULL FIREBASE ERROR:", error);
    console.log("FIREBASE ERROR CODE:", error.code);
    console.log("FIREBASE ERROR MESSAGE:", error.message);

    alert(
        "Firebase Error:\n\n" +
        "Code: " + error.code +
        "\n\nMessage: " + error.message
    );
}
    }

    const handleGoogleLogin = async () => {
    try {
        const provider = new GoogleAuthProvider();

        await signInWithPopup(
    auth,
    provider
);

await syncUserWithBackend();

window.location.href =
    "/dashboard.html";
    } catch (error) {
        console.error("Google Login Error:", error);

        if (error.code !== "auth/popup-closed-by-user") {
            alert("Google login failed: " + error.message);
        }
    }
};

const handleGithubLogin = async () => {
    try {
        const provider = new GithubAuthProvider();

      await signInWithPopup(
    auth,
    provider
);

await syncUserWithBackend();

alert(
    "GitHub login successful!"
);

window.location.href =
    "/dashboard.html";

    } catch (error) {

        console.error("GitHub Login Error:", error);

        if (
            error.code ===
            "auth/account-exists-with-different-credential"
        ) {

            alert(
                "This email is already registered. Please login with Google first, then link GitHub from the dashboard."
            );

        } else if (
            error.code ===
            "auth/popup-closed-by-user"
        ) {

            console.log("GitHub popup closed.");

        } else {

            alert(
                "GitHub login failed: " +
                error.message
            );
        }
    }
};


    return (
        <div className="auth-page">

            {/* LEFT SIDE */}

            <div className="auth-hero">

                <div className="auth-hero-overlay"></div>

                <div className="auth-hero-content">

                    <div className="auth-brand">

                        <div className="brand-icon">
                            ♥
                        </div>

                        <div>
                            <h2>Healthora</h2>

                            <span>
                                Your Health. Your Story.
                            </span>
                        </div>

                    </div>


                    <div className="hero-text">

                        <span className="hero-small-title">
                            MORE THAN A PLATFORM
                        </span>

                        <h1>
                            A Healthier
                            <br />
                            Happier <span>You.</span>
                        </h1>

                        <p>
                            Discover, learn and grow with a
                            community that cares about your
                            well-being.
                        </p>

                    </div>


                    <div className="hero-features">

                        <div className="hero-feature">
                            <div>📖</div>
                            <span>
                                Read
                                <br />
                                Articles
                            </span>
                        </div>

                        <div className="hero-feature">
                            <div>🎧</div>
                            <span>
                                Listen to
                                <br />
                                Podcasts
                            </span>
                        </div>

                        <div className="hero-feature">
                            <div>👥</div>
                            <span>
                                Follow
                                <br />
                                Creators
                            </span>
                        </div>

                        <div className="hero-feature">
                            <div>🔖</div>
                            <span>
                                Save
                                <br />
                                Content
                            </span>
                        </div>

                    </div>


                    <div className="hero-quote">

                        <span>♥</span>

                        <p>
                            “Small steps every day lead to
                            big changes.”
                        </p>

                    </div>

                </div>

            </div>


            {/* RIGHT SIDE */}

            <div className="auth-form-side">

                <div className="auth-top-link">

                    <span>
                        New here?
                    </span>

                    <button
                        type="button"
                        onClick={() => navigate("/signup")}
                    >
                        Sign Up
                    </button>

                </div>


                <div className="auth-form-container">

                    <div className="auth-form-logo">

                        <div className="brand-icon">
                            ♥
                        </div>

                        <div>

                            <h2>
                                Healthora
                            </h2>

                            <span>
                                Your Health. Your Story.
                            </span>

                        </div>

                    </div>


                    <div className="auth-heading">

                        <h1>
                            Welcome Back 👋
                        </h1>

                        <p>
                            Log in to continue your health journey.
                        </p>

                    </div>


                    <form
                        className="login-form"
                        onSubmit={handleLogin}
                    >

                        <div className="input-group">

                            <label>
                                Email address
                            </label>

                            <div className="input-wrapper">

                                <span className="input-icon">
                                    ✉
                                </span>

                                <input
                                    type="email"
                                    placeholder="Enter your email"
                                    value={email}
                                    onChange={(e) =>
                                        setEmail(e.target.value)
                                    }
                                />

                            </div>

                        </div>


                        <div className="input-group">

                            <label>
                                Password
                            </label>

                            <div className="input-wrapper">

                                <span className="input-icon">
                                    🔒
                                </span>

                                <input
                                    type={
                                        showPassword
                                            ? "text"
                                            : "password"
                                    }
                                    placeholder="Enter your password"
                                    value={password}
                                    onChange={(e) =>
                                        setPassword(e.target.value)
                                    }
                                />

                                <button
                                    type="button"
                                    className="password-toggle"
                                    onClick={() =>
                                        setShowPassword(
                                            !showPassword
                                        )
                                    }
                                >
                                    {showPassword ? "◉" : "◌"}
                                </button>

                            </div>

                        </div>


                        <div className="login-options">

                            <label className="remember-me">

                                <input type="checkbox" />

                                <span>
                                    Remember me
                                </span>

                            </label>


                            <button
    type="button"
    className="forgot-password"
    onClick={async () => {
        if (!email) {
            alert("Please enter your email address first.");
            return;
        }

        try {
            await sendPasswordResetEmail(auth, email);
            alert("Password reset email sent! Check your inbox.");
        } catch (error) {
            console.error("Password Reset Error:", error);
            alert("Unable to send password reset email.");
        }
    }}
>
    Forgot password?
</button>

                        </div>


                        <button
                            type="submit"
                            className="login-button"
                        >
                            <span>
                                Log In
                            </span>

                            <span>
                                →
                            </span>

                        </button>

                    </form>


                    <div className="auth-divider">

                        <span></span>

                        <p>
                            OR CONTINUE WITH
                        </p>

                        <span></span>

                    </div>


                   <div className="social-login">

    <button
        type="button"
        onClick={handleGoogleLogin}
    >
        <span>G</span>
        Google
    </button>

    <button
    type="button"
    onClick={handleGithubLogin}
>
    <span>GH</span>
    GitHub
</button>

</div>

                    <p className="auth-footer">

                        By continuing, you agree to our
                        <br />

                        <a href="#">
                            Terms of Service
                        </a>

                        {" "}and{" "}

                        <a href="#">
                            Privacy Policy
                        </a>

                    </p>

                </div>

            </div>

        </div>
    );

  }

export default Login;