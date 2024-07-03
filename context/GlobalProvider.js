import React, { createContext, useContext, useEffect, useState } from "react";

import { getCurrentUser } from "../lib/useFirebase";
import { onAuthStateChanged } from "firebase/auth";
import { auth } from "../lib/firebase";
import { router } from "expo-router";

const GlobalContext = createContext();
export const useGlobalContext = () => useContext(GlobalContext);

const GlobalProvider = ({ children }) => {
  const [isLogged, setIsLogged] = useState(false);
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    onAuthStateChanged(auth, (user) => {
      getCurrentUser(user?.uid)
        .then((res) => {
          if (res) {
            setUser(res);
            setIsLogged(true);
            router.replace("/home");
          } else {
            setIsLogged(false);
            setUser(null);
          }
        })
        .catch((error) => {
          console.log("GlobalProvider",error);
        })
        .finally(() => {
          setLoading(false);
        });
    });
  }, []);

  return (
    <GlobalContext.Provider
      value={{
        isLogged,
        setIsLogged,
        user,
        setUser,
        loading,
      }}
    >
      {children}
    </GlobalContext.Provider>
  );
};

export default GlobalProvider;
