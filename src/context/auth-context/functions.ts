import { Dispatch, SetStateAction } from "react";
import { SignInAugument } from "./types";

interface SignInProps {
  setState: Dispatch<SetStateAction<boolean>>;
  formData: SignInAugument;
}

interface SignOutProps {
  setState: Dispatch<SetStateAction<boolean>>;
}

export const SubmitSignIn = ({ setState, formData }: SignInProps) => {
  const { user, pass } = formData;

  return new Promise((resolve, reject) => {
    if (user === "admin" && pass === "brotecs@!230") {
      setState(true);
      resolve(true);
    } else {
      reject("Invalid username or password");
    }
  });
};

export const SubmitSignOut = ({ setState }: SignOutProps) => {
  return new Promise((resolve, _) => {
    setState(false);
    resolve(true);
  });
};
