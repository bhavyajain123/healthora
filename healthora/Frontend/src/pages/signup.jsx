import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";

import {
  User,
  Mail,
  Lock,
  Eye,
  EyeOff,
  ArrowRight,
} from "lucide-react";

import {
  createUserWithEmailAndPassword,
  updateProfile,
  signInWithPopup,
  GoogleAuthProvider,
  GithubAuthProvider,
  getAdditionalUserInfo,
} from "firebase/auth";

import { auth } from "../firebase";

import "../styles/signup.css";


const Signup = () => {

  const navigate = useNavigate();

  const [showPassword, setShowPassword] =
    useState(false);

  const [formData, setFormData] = useState({
    name: "",
    email: "",
    password: "",
  });


  const handleChange = (event) => {

    const {
      name,
      value,
    } = event.target;

    setFormData((previous) => ({
      ...previous,
      [name]: value,
    }));

  };



  const syncUserWithMongoDB = async (user) => {

    const token =
      await user.getIdToken();

    const API_URL =
      `${window.location.protocol}//${window.location.hostname}:5000`;

    const response =
      await fetch(
        `${API_URL}/api/users/profile`,
        {
          method: "GET",

          headers: {
            "Content-Type":
              "application/json",

            "Authorization":
              `Bearer ${token}`,
          },
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
      "✅ MongoDB user synced:",
      profileResult
    );


    return profileResult;

  };




  const handleSubmit = async (event) => {

    event.preventDefault();


    try {

      const userCredential =
        await createUserWithEmailAndPassword(
          auth,
          formData.email.trim(),
          formData.password
        );


      const user =
        userCredential.user;


      // Save name in Firebase
      await updateProfile(
        user,
        {
          displayName:
            formData.name.trim(),
        }
      );


      // MongoDB sync
      await syncUserWithMongoDB(
        user
      );


      alert(
        "Account created successfully!"
      );


 

      window.location.href = "/avatar-setup";


    } catch (error) {

      console.error(
        "❌ Signup Error:",
        error
      );


      if (
        error.code ===
        "auth/email-already-in-use"
      ) {

        alert(
          "This email is already registered. Please login."
        );

      }

      else if (
        error.code ===
        "auth/invalid-email"
      ) {

        alert(
          "Please enter a valid email address."
        );

      }

      else if (
        error.code ===
        "auth/weak-password"
      ) {

        alert(
          "Password should be at least 6 characters."
        );

      }

      else {

        alert(
          "Signup failed: " +
          error.message
        );

      }

    }

  };


  const handleGoogleSignup =
    async () => {

      try {

        const provider =
          new GoogleAuthProvider();


        const result =
          await signInWithPopup(
            auth,
            provider
          );


        const user =
          result.user;


        await syncUserWithMongoDB(
          user
        );


       const isNewUser = getAdditionalUserInfo(result)?.isNewUser;

if (isNewUser) {
  window.location.href = "/avatar-setup";
} else {
  window.location.href = "/dashboard.html";
}

      } catch (error) {

        console.error(
          "❌ Google Signup Error:",
          error
        );


        if (
          error.code ===
          "auth/popup-closed-by-user"
        ) {

          return;

        }


        alert(
          "Google signup failed: " +
          error.message
        );

      }

    };



  const handleGithubSignup =
    async () => {

      try {

        const provider =
          new GithubAuthProvider();


        const result =
          await signInWithPopup(
            auth,
            provider
          );


        const user =
          result.user;


       await syncUserWithMongoDB(user);

const isNewUser = getAdditionalUserInfo(result)?.isNewUser;

if (isNewUser) {
  window.location.href = "/avatar-setup";
} else {
  window.location.href = "/dashboard.html";
}


      } catch (error) {

        console.error(
          "❌ GitHub Signup Error:",
          error
        );


        if (
          error.code ===
          "auth/account-exists-with-different-credential"
        ) {

          alert(
            "This email is already registered with another login method. Please login with that method first."
          );

        }

        else if (
          error.code ===
          "auth/popup-closed-by-user"
        ) {

          return;

        }

        else {

          alert(
            "GitHub signup failed: " +
            error.message
          );

        }

      }

    };


  return (

    <div className="auth-page">

     

      <section className="auth-visual">

        <div className="visual-overlay"></div>

        <div className="visual-content">

          <div className="auth-brand">

            <div className="brand-icon">
              ♥
            </div>

            <div>

              <h2>
                Healthora
              </h2>

              <p>
                Your Health. Your Story.
              </p>

            </div>

          </div>


          <div className="visual-heading">

            <span>
              YOUR JOURNEY STARTS HERE
            </span>

            <h1>

              A Healthier
              <br />

              Happier
              <strong>
                You.
              </strong>

            </h1>

            <p>

              Build healthy habits, discover
              meaningful content
              <br />

              and connect with a wellness
              community.

            </p>

          </div>


          <div className="feature-list">

            <div className="feature-item">

              <div className="feature-icon">
                ♥
              </div>

              <span>
                Discover
                <br />
                Wellness
              </span>

            </div>


            <div className="feature-item">

              <div className="feature-icon">
                ✓
              </div>

              <span>
                Track Your
                <br />
                Progress
              </span>

            </div>


            <div className="feature-item">

              <div className="feature-icon">
                ♧
              </div>

              <span>
                Join Our
                <br />
                Community
              </span>

            </div>


            <div className="feature-item">

              <div className="feature-icon">
                ☆
              </div>

              <span>
                Save Your
                <br />
                Favorites
              </span>

            </div>

          </div>


          <div className="quote-card">

            <span className="quote-symbol">
              ♥
            </span>

            <p>

              “Your health is
              <br />

              your greatest
              <br />

              investment.”

            </p>

          </div>


          <div className="visual-bottom">

            <div className="slider-lines">

              <span className="active"></span>

              <span></span>

              <span></span>

            </div>

            <p>
              Be Informed. Be Inspired. Be Healthier.
            </p>

          </div>

        </div>

      </section>


     

      <section className="auth-form-section">

        <div className="auth-topbar">

          <span>
            Already a member?
          </span>

          <Link
            to="/login"
            className="outline-button"
          >
            Log In
          </Link>

        </div>


        <div className="auth-form-wrapper signup-wrapper">

          <div className="form-brand">

            <div className="brand-icon">
              ♥
            </div>

            <div>

              <h2>
                Healthora
              </h2>

              <p>
                Your Health. Your Story.
              </p>

            </div>

          </div>


          <div className="form-heading">

            <h1>

              Create Account
              <span>
                🌿
              </span>

            </h1>

            <p>
              Start your personalized health journey.
            </p>

          </div>


          

          <form
            onSubmit={handleSubmit}
            className="auth-form"
          >

            <div className="input-group">

              <User size={21} />

              <input
                type="text"
                name="name"
                placeholder="Full name"
                value={formData.name}
                onChange={handleChange}
                required
              />

            </div>


            <div className="input-group">

              <Mail size={21} />

              <input
                type="email"
                name="email"
                placeholder="Email address"
                value={formData.email}
                onChange={handleChange}
                required
              />

            </div>


            <div className="input-group">

              <Lock size={21} />

              <input
                type={
                  showPassword
                    ? "text"
                    : "password"
                }
                name="password"
                placeholder="Create password"
                value={formData.password}
                onChange={handleChange}
                minLength={6}
                required
              />


              <button
                type="button"
                className="password-toggle"
                onClick={() =>
                  setShowPassword(
                    (previous) =>
                      !previous
                  )
                }
                aria-label="Toggle password visibility"
              >

                {
                  showPassword
                    ? <EyeOff size={20} />
                    : <Eye size={20} />
                }

              </button>

            </div>


            <label className="terms-checkbox">

              <input
                type="checkbox"
                required
              />

              <span>

                I agree to the{" "}

                <Link to="/terms">
                  Terms of Service
                </Link>

                {" "}

                and{" "}

                <Link to="/privacy">
                  Privacy Policy
                </Link>.

              </span>

            </label>


            <button
              type="submit"
              className="primary-button"
            >

              Create Account

              <ArrowRight size={21} />

            </button>

          </form>


        

          <div className="divider">

            <span></span>

            <p>
              OR SIGN UP WITH
            </p>

            <span></span>

          </div>


          <div className="social-buttons">

            <button
              type="button"
              onClick={
                handleGoogleSignup
              }
            >

              <span className="google-logo">
                G
              </span>

              Google

            </button>


            <button
              type="button"
              onClick={
                handleGithubSignup
              }
            >

              <span className="github-logo">
                ●
              </span>

              GitHub

            </button>

          </div>


          <p className="terms-text">

            Already have an account?{" "}

            <Link to="/login">
              Log in here
            </Link>

          </p>

        </div>

      </section>

    </div>

  );

};


export default Signup;