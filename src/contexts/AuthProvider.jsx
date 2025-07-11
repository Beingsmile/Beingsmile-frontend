import { createContext, useEffect, useState } from "react";
import auth from "../../firebase.init";
import {
  createUserWithEmailAndPassword,
  onAuthStateChanged,
} from "firebase/auth";
import { toast } from "react-toastify";

export const AuthContext = createContext();

const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (firebaseUser) => {
      if (firebaseUser) {
        setUser(firebaseUser);
      } else {
        setUser(null);
      }
    });

    // Clean up the listener on unmount
    return () => unsubscribe();
  }, []);

  const createWithEmail = async (email, password) => {
    return await createUserWithEmailAndPassword(auth, email, password)
      .then((userCredential) => {
        // Signed up
        setUser(userCredential.user);
        toast.success("Registration Successful!");
      })
      .catch((error) => {
        const errorCode = error.code;

        // Custom messages based on error code
        switch (errorCode) {
          case "auth/email-already-in-use":
            toast.error("Email is already in use");
            break;
          case "auth/invalid-email":
            toast.error("Invalid email address");
            break;
          case "auth/weak-password":
            toast.error("Password is too weak (must be at least 6 characters)");
            break;
          default:
            toast.error("Registration failed: " + error.message);
        }
      });
  };

  const authinfo = {
    user,
    setUser,
    createWithEmail,
  };

  return (
    <AuthContext.Provider value={authinfo}>{children}</AuthContext.Provider>
  );
};

export default AuthProvider;
