import { settingsCollectionRef } from "@/db/firebase.db";
import { doc, onSnapshot } from "firebase/firestore";
import {
  createContext,
  ReactNode,
  useContext,
  useEffect,
  useState,
} from "react";

interface DataContextType {
  appSettings: {
    departments: {
      id: string;
      createdAt: number;
      modifiedAt: number;
      department_name: string;
    }[];
    designations: {
      id: string;
      createdAt: number;
      modifiedAt: number;
      department_name: string;
      designation_name: string;
    }[];
  };
}

export const DataContext = createContext({} as DataContextType);
export const useDataContext = () => useContext(DataContext);

export const DataContextProvider = ({ children }: { children: ReactNode }) => {
  const [appSettings, setAppSettings] = useState({
    departments: [],
    designations: [],
  });

  useEffect(() => {
    const docRef = doc(settingsCollectionRef, "app-settings");
    const unscubscribe = onSnapshot(docRef, (snapshot) => {
      if (snapshot.data()) {
        setAppSettings((prev) => ({ ...prev, ...snapshot.data() }));
      }
    });

    return () => {
      unscubscribe();
    };
  }, []);

  const value: any = { appSettings };

  return <DataContext.Provider value={value}>{children}</DataContext.Provider>;
};
