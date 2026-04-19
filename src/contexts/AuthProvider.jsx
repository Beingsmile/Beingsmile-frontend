import { createContext, useEffect, useState } from "react";
import auth from "../../firebase.init";
import {
  createUserWithEmailAndPassword,
  onAuthStateChanged,
  signInWithEmailAndPassword,
  signOut,
  sendPasswordResetEmail,
  verifyPasswordResetCode,
  confirmPasswordReset,
  sendEmailVerification,
} from "firebase/auth";
import { toast } from "react-toastify";
import axioInstance from "../api/axiosInstance";
import axiosInstance from "../api/axiosInstance";

import { useQueryClient } from "@tanstack/react-query";

export const AuthContext = createContext();

const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const queryClient = useQueryClient();

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (firebaseUser) => {
      if (firebaseUser) {
        axiosInstance.get(`/auth/me/firebase/${firebaseUser.uid}`)
          .then(response => {
            setUser({ ...firebaseUser, data: response.data.user });
            setLoading(false);
          })
          .catch(error => {
            console.error("Error fetching user data:", error);
            setLoading(false);
          });
      } else {
        setUser(null);
        setLoading(false);
      }
    });

    // Clean up the listener on unmount
    return () => unsubscribe();
  }, []);

  const createWithEmail = async (email, password) => {
    try {
      setLoading(true);
      const userCredential = await createUserWithEmailAndPassword(
        auth,
        email,
        password
      );
      return { success: true, user: userCredential.user };
    } catch (error) {
      let errorMessage = "Registration failed";

      switch (error.code) {
        case "auth/email-already-in-use":
          errorMessage = "Email is already in use";
          break;
        case "auth/invalid-email":
          errorMessage = "Invalid email address";
          break;
        case "auth/weak-password":
          errorMessage = "Password is too weak (must be at least 6 characters)";
          break;
        default:
          errorMessage = error.message;
      }
      toast.error(errorMessage);
      return { success: false, error: errorMessage };
    } finally {
      setLoading(false);
    }
  };

  const loginWithEmail = async (email, password) => {
    try {
      setLoading(true);
      const userCredential = await signInWithEmailAndPassword(
        auth,
        email,
        password
      );
      return { success: true, user: userCredential.user };
    } catch (error) {
      let errorMessage = "Login failed";

      switch (error.code) {
        case "auth/user-not-found":
          errorMessage = "No user found with this email";
          break;
        case "auth/wrong-password":
          errorMessage = "Incorrect password";
          break;
        case "auth/invalid-email":
          errorMessage = "Invalid email address";
          break;
        default:
          errorMessage = error.message;
      }

      toast.error(errorMessage);
      return { success: false, error: errorMessage };
    } finally {
      setLoading(false);
    }
  };

  const logout = async () => {
    setLoading(true);
    // Clear all cached queries to prevent data leaking between users
    queryClient.clear();
    await axioInstance.post("/auth/logout").catch((error) => {
      return error;
    });
    setLoading(false);
    return signOut(auth);
  };

  const forgotPassword = async (email) => {
    try {
      setLoading(true);
      // Construct custom link to our app
      const actionCodeSettings = {
        url: `${window.location.origin}/reset-password`,
        handleCodeInApp: true,
      };
      await sendPasswordResetEmail(auth, email, actionCodeSettings);
      toast.success("Password reset link sent to your email!");
      return { success: true };
    } catch (error) {
      let errorMessage = "Failed to send reset email";
      if (error.code === "auth/user-not-found") {
        errorMessage = "No user found with this email";
      }
      toast.error(errorMessage);
      return { success: false, error: errorMessage };
    } finally {
      setLoading(false);
    }
  };

  const verifyResetCode = async (code) => {
    try {
      const email = await verifyPasswordResetCode(auth, code);
      return { success: true, email };
    } catch (error) {
      return { success: false, error: error.message };
    }
  };

  const confirmReset = async (code, newPassword) => {
    try {
      await confirmPasswordReset(auth, code, newPassword);
      toast.success("Password has been reset successfully!");
      return { success: true };
    } catch (error) {
      toast.error(error.message);
      return { success: false, error: error.message };
    }
  };

  const sendVerificationEmail = async () => {
    if (!auth.currentUser) return;
    try {
      setLoading(true);
      await sendEmailVerification(auth.currentUser);
      toast.success("Verification email sent!");
      return { success: true };
    } catch (error) {
      toast.error(error.message);
      return { success: false, error: error.message };
    } finally {
      setLoading(false);
    }
  };

  const authinfo = {
    user,
    setUser,
    createWithEmail,
    loginWithEmail,
    logout,
    forgotPassword,
    verifyResetCode,
    confirmReset,
    sendVerificationEmail,
    loading,
    setLoading
  };

  return (
    <AuthContext.Provider value={authinfo}>{children}</AuthContext.Provider>
  );
};

export default AuthProvider;
