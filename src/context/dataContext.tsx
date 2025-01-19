import { departmentRef, designationRef } from "@/db/firebase.db";
import { onSnapshot } from "firebase/firestore";
import {
  createContext,
  ReactNode,
  useContext,
  useEffect,
  useState,
} from "react";

export type departmentType = {
  id: string;
  createdAt: number;
  modifiedAt: number;
  department_name: string;
};

export type designationType = {
  id: string;
  createdAt: number;
  modifiedAt: number;
  department_name: string;
  designation_name: string;
};

interface DataContextType {
  departments: departmentType[];
  designations: designationType[];
}

export const DataContext = createContext({} as DataContextType);
export const useDataContext = () => useContext(DataContext);

export const DataContextProvider = ({ children }: { children: ReactNode }) => {
  const [departments, setDepartments] = useState([]);
  const [designations, setDesignations] = useState([]);

  useEffect(() => {
    const unscubscribeDepartment = onSnapshot(departmentRef, (snapshot) => {
      const departments: any = [];
      snapshot.forEach((doc) => {
        departments.push({
          ...doc.data(),
          id: doc.id,
        });
      });
      setDepartments(departments);
    });

    const unscubscribeDesignation = onSnapshot(designationRef, (snapshot) => {
      const designation: any = [];
      snapshot.forEach((doc) => {
        designation.push({
          ...doc.data(),
          id: doc.id,
        });
      });
      setDesignations(designation);
    });

    return () => {
      unscubscribeDepartment();
      unscubscribeDesignation();
    };
  }, []);

  const value: any = { departments, designations };

  return <DataContext.Provider value={value}>{children}</DataContext.Provider>;
};
