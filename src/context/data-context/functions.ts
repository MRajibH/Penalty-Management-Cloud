import { CollectionReference, DocumentData, orderBy, query, QuerySnapshot } from "firebase/firestore";

const secureConfidentialInformation = (data: any, isLoggedIn: boolean): any => {
  if (isLoggedIn) {
    return data;
  }

  if (Object.prototype.hasOwnProperty.call(data, "email")) {
    const email = data.email;
    const emailParts = email.split("@");
    const username = emailParts[0];
    const domain = emailParts[1];
    const maskedUsername = Array(username.length).fill("*").join("");
    const maskedEmail = `${maskedUsername}@${domain}`;
    data.email = maskedEmail;
  }

  if (Object.prototype.hasOwnProperty.call(data, "phone")) {
    const phone = data.phone;
    const maskedPhone = Array(phone.length).fill("*").join("");
    data.phone = maskedPhone;
  }

  return data;
};

export const getSnapshotData = (snapshot: QuerySnapshot<DocumentData, DocumentData>, isLoggedIn: boolean = false) => {
  const data: any = [];
  snapshot.forEach((doc) => {
    const rawData = doc.data();
    data.push({ ...secureConfidentialInformation(rawData, isLoggedIn), id: doc.id });
  });
  return data;
};

export const getQueryRef = (
  ref: CollectionReference<DocumentData, DocumentData>,
  OrderBy: string = "createdAt",
  Order: "asc" | "desc" = "asc"
) => {
  return query(ref, orderBy(OrderBy, Order));
};

export const mappedFunc = (previous: any, current: any) => {
  const { id, createdAt, modifiedAt, ...rest } = current;
  previous[id] = rest;
  return previous;
};
