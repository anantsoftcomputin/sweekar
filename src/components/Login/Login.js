import React, { useEffect, useState } from "react";
import { toast } from "react-toastify";
import { useNavigate } from "react-router-dom";
import { auth } from "../../firebase";
import { GoogleAuthProvider, signInWithPopup } from "firebase/auth";
import logo from "../../images/logo.png";

const Login = () => {
  // Initialize Google Provider
  const googleProvider = new GoogleAuthProvider();
  const navigate = useNavigate();
  const [deferredPrompt, setDeferredPrompt] = useState(null);
  const [showInstallButton, setShowInstallButton] = useState(false);

  const handleGoogleSignIn = async () => {
    try {
      const result = await signInWithPopup(auth, googleProvider);
      // This gives you a Google Access Token. You can use it to access the Google API.
      const credential = GoogleAuthProvider.credentialFromResult(result);
      const token = credential.accessToken;
      console.log("----token---->", token);
      console.log("User Info:", result.user);
      toast.success("Login Successful");
      navigate("/");
    } catch (error) {
      // Handle Errors here.
      const errorCode = error.code;
      const errorMessage = error.message;
      const email = error.customData.email;
      console.error(
        "Error during Google Sign-In:",
        errorCode,
        errorMessage,
        email
      );
    }
  };

  // Listen for the 'beforeinstallprompt' event
  useEffect(() => {
    const handleBeforeInstallPrompt = (event) => {
      event.preventDefault();
      setDeferredPrompt(event); // Save the event for later use
      setShowInstallButton(true); // Show install button
    };

    window.addEventListener("beforeinstallprompt", handleBeforeInstallPrompt);

    return () =>
      window.removeEventListener(
        "beforeinstallprompt",
        handleBeforeInstallPrompt
      );
  }, []);

  // Function to handle PWA installation
  const handleInstallClick = () => {
    if (deferredPrompt) {
      deferredPrompt.prompt();
      deferredPrompt.userChoice.then((choiceResult) => {
        if (choiceResult.outcome === "accepted") {
          console.log("User accepted the install prompt");
        } else {
          console.log("User dismissed the install prompt");
        }
        setDeferredPrompt(null);
        setShowInstallButton(false);
      });
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-lavender-100 to-lavender-300 flex items-center justify-center p-12">
      <div className="max-w-md w-full bg-white rounded-2xl shadow-xl overflow-hidden">
        <div className="p-8">
          <div className="flex justify-center mb-8">
            <img
              src={logo}
              alt="Sweekar Logo"
              className="w-32 h-32 rounded-full border-4 border-lavender-300 shadow-lg"
            />
          </div>
          <h2 className="text-3xl font-bold text-center text-lavender-900 mb-2">
            Welcome to Sweekar
          </h2>
          <p className="text-center text-lavender-600 mb-8">
            Please sign in to continue
          </p>
          <button
            onClick={handleGoogleSignIn}
            className="w-full bg-lavender-600 text-white py-3 px-4 rounded-lg font-semibold hover:bg-lavender-700 transition duration-300 ease-in-out flex items-center justify-center"
          >
            <svg
              className="w-6 h-6 mr-2"
              viewBox="0 0 24 24"
              xmlns="http://www.w3.org/2000/svg"
            >
              <path
                d="M12.24 10.285V14.4h6.806c-.275 1.765-2.056 5.174-6.806 5.174-4.095 0-7.439-3.389-7.439-7.574s3.345-7.574 7.439-7.574c2.33 0 3.891.989 4.785 1.849l3.254-3.138C18.189 1.186 15.479 0 12.24 0c-6.635 0-12 5.365-12 12s5.365 12 12 12c6.926 0 11.52-4.869 11.52-11.726 0-.788-.085-1.39-.189-1.989H12.24z"
                fill="currentColor"
              />
            </svg>
            Sign in with Google
          </button>
        </div>
        {showInstallButton && (
          <div className="px-8 pb-8">
            <button
              onClick={handleInstallClick}
              className="w-full bg-green-500 text-white py-3 px-4 rounded-lg font-semibold hover:bg-green-600 transition duration-300 ease-in-out"
            >
              Install App
            </button>
          </div>
        )}
      </div>
    </div>
  );
};

export default Login;