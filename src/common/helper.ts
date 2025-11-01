import { SubmitSignIn, SubmitSignOut } from "@/context/auth-context/functions";
import { roleType } from "@/context/data-context/types";
import { authRef, roleRef, userRef } from "@/db/firebase.db";
import { toast } from "@/hooks/use-toast";
import { defaultRole } from "@/schema/RoleSchema";
import { createUserWithEmailAndPassword, deleteUser, getAuth } from "firebase/auth";
import {
  addDoc,
  CollectionReference,
  doc,
  DocumentData,
  getDoc,
  getDocs,
  query,
  updateDoc,
  where,
} from "firebase/firestore";

type CreateDocumentProps = {
  data: any;
  ref: CollectionReference<DocumentData, DocumentData>;
};

export const CreateDocument = async ({ ref, data }: CreateDocumentProps) => {
  const createdData = {
    ...data,
    createdAt: new Date().getTime(),
    modifiedAt: new Date().getTime(),
  };

  return await WithErrorHandle(addDoc(ref, createdData));
};

type UpdateDocumentProps = {
  data: any;
  docId: string;
  ref: CollectionReference<DocumentData, DocumentData>;
};

export const UpdateDocument = async ({ ref, docId, data }: UpdateDocumentProps) => {
  const { createdAt, ...restData } = data;

  const createdData = {
    ...restData,
    modifiedAt: new Date().getTime(),
  };

  return await WithErrorHandle(updateDoc(doc(ref, docId), createdData));
};

export const WithErrorHandle = async <T>(promise: Promise<T>): Promise<T> => {
  try {
    return await promise;
  } catch (err: any) {
    toast({
      title: "Something went wrong",
      description: JSON.stringify(err?.message || err, null, 2),
    });
    throw err;
  }
};

export const getUserByAuthId = async (auth_id: string) => {
  const q = query(userRef, where("auth_id", "==", auth_id));
  const querySnapshot = await getDocs(q);
  if (querySnapshot.empty) {
    throw new Error("User not found");
  }
  return querySnapshot.docs[0].data();
};

export const getRolePermissionsById = async (role_id: string) => {
  const role = await getDoc(doc(roleRef, role_id));
  if (!role.exists()) {
    return defaultRole;
  }

  const roleData = role.data() as roleType;
  return roleData.roles;
};

export const signInCurrentUser = async (auth_id: string) => {
  const currentUser = await getUserByAuthId(auth_id);
  await SubmitSignOut();
  await SubmitSignIn({
    formData: {
      email: currentUser.email,
      pass: currentUser.password,
    },
  });
};

export const CreateFirebaseUser = async (
  current_auth_id: string,
  email: string,
  password: string
) => {
  const userCredential = await WithErrorHandle(
    createUserWithEmailAndPassword(authRef, email, password)
  );
  await signInCurrentUser(current_auth_id);
  return userCredential.user.uid;
};

export const DeleteFirebaseUser = async (delete_auth_id: string) => {
  const auth = getAuth();
  if (!auth.currentUser) {
    throw new Error("Please login to continue");
  }
  const current_auth_id = auth.currentUser.uid;
  await signInCurrentUser(delete_auth_id);
  await WithErrorHandle(deleteUser(auth.currentUser));
  await signInCurrentUser(current_auth_id);
};
