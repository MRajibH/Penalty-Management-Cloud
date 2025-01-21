import { SubmitSignIn, SubmitSignOut } from "./functions";
import { AuthContextType, SignInAugument } from "./types";
import { createContext, ReactNode, useContext, useState } from "react";

export const AuthContext = createContext({} as AuthContextType);
export const useAuthContext = () => useContext(AuthContext);

export const AuthContextProvider = ({ children }: { children: ReactNode }) => {
  const [isLoggedIn, setIsLoggedIn] = useState(false);

  const SignIn = (formData: SignInAugument) => {
    return SubmitSignIn({ formData, setState: setIsLoggedIn });
  };

  const SignOut = () => {
    return SubmitSignOut({ setState: setIsLoggedIn });
  };

  const value = { isLoggedIn, SignIn, SignOut };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};
