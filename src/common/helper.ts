import { toast } from "@/hooks/use-toast";
import { addDoc, CollectionReference, doc, DocumentData, updateDoc } from "firebase/firestore";

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

export const WithErrorHandle = async (promise: Promise<any>) => {
  try {
    return await promise;
  } catch (err: any) {
    toast({
      title: "Something went wrong",
      description: JSON.stringify(err?.message || err, null, 2),
    });
  }
};
