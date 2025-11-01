import {
  CollectionReference,
  DocumentData,
  orderBy,
  query,
  QuerySnapshot,
} from "firebase/firestore";

export const getSnapshotData = (snapshot: QuerySnapshot<DocumentData, DocumentData>) => {
  const data: any = [];
  snapshot.forEach((doc) => {
    data.push({ ...doc.data(), id: doc.id });
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
