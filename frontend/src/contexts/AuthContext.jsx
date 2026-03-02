import { createContext, useContext, useEffect, useState } from "react";
import { auth } from "../services/firebase";
import { onAuthStateChanged } from "firebase/auth";
import { userApi } from "../services/api";

const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true); // new state
  const [isGuest, setIsGuest] = useState(false);

  const login = (userData) => setUser(userData);
  const logout = () => {
    setUser(null);
    setIsGuest(false);
  };

  const loginAsGuest = () => {
    // Guest user object with basic IDs/role so UI can render without backend
    const guestUser = {
      userId: "guest-user-1",
      profileId: "guest-profile-1",
      role: "employer",
      email: "guest@fitfound.demo",
      guest: true,
    };
    setUser(guestUser);
    setIsGuest(true);
  };

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, async (firebaseUser) => {
      if (firebaseUser) {
        const email = firebaseUser.email;
        try {
          const res = await userApi.getUserByEmail({ email });
          if (res.data.userId) {
            setUser(res.data); // sync user from Mongo
          } else {
            setUser(null);
          }
        } catch (error) {
          console.error("Failed to fetch user from MongoDB:", error);
          setUser(null);
        }
      } else {
        setUser(null);
      }
      setLoading(false); // only after Firebase check
    });

    return () => unsubscribe();
  }, []);

  return (
    <AuthContext.Provider
      value={{ user, login, logout, loading, isGuest, loginAsGuest }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => useContext(AuthContext);
