// ===============================
// Types of Auth Context
// ===============================

export type SignInAugument = { user: string; pass: string };

export interface AuthContextType {
  isLoggedIn: boolean;
  SignOut: () => Promise<unknown>;
  SignIn: ({}: SignInAugument) => Promise<unknown>;
}
