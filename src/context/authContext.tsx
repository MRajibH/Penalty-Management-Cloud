import { createContext, ReactNode, useContext, useState } from "react";

interface AuthContextType {
  isLoggedIn: boolean;
  sign_out: () => void;
  sign_in: ({ user, pass }: { user: string; pass: string }) => Promise<unknown>;
}

export const AuthContext = createContext({} as AuthContextType);
export const useAuthContext = () => useContext(AuthContext);

export const AuthContextProvider = ({ children }: { children: ReactNode }) => {
  const [isLoggedIn, setIsLoggedIn] = useState(false);

  const sign_in = ({ user, pass }: { user: string; pass: string }) => {
    return new Promise((resolve, reject) => {
      if (user === "admin" && pass === "brotecs@!230") {
        setIsLoggedIn(true);
        resolve(true);
      } else {
        reject("Invalid username or password");
      }
    });
  };

  const sign_out = () => {
    setIsLoggedIn(false);
  };

  const value = { isLoggedIn, sign_in, sign_out };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};
