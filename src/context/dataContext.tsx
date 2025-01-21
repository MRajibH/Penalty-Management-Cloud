import { departmentRef, designationRef, employeeRef } from "@/db/firebase.db";
import { onSnapshot } from "firebase/firestore";
import {
  createContext,
  ReactNode,
  useContext,
  useEffect,
  useState,
} from "react";

export type employeesType = {
  id: string;
  name: string;
  email: string;
  createdAt: number;
  modifiedAt: number;
  designation_id: string;
  department_name: string;
  designation_name: string;
};

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
  employees: employeesType[];
  departments: departmentType[];
  designations: designationType[];

  employeeMapped: Record<string, employeesType>;
  departmentMapped: Record<string, departmentType>;
  designationMapped: Record<string, designationType>;
}

export const DataContext = createContext({} as DataContextType);
export const useDataContext = () => useContext(DataContext);

export const DataContextProvider = ({ children }: { children: ReactNode }) => {
  const [employees, setEmployees] = useState<employeesType[]>([]);
  const [departments, setDepartments] = useState<departmentType[]>([]);
  const [designations, setDesignations] = useState<designationType[]>([]);

  // ===============================
  // Snapshot of Employee Collection
  // ===============================
  useEffect(() => {
    const unscubscribeDepartment = onSnapshot(employeeRef, (snapshot) => {
      const employees: any = [];
      snapshot.forEach((doc) => {
        employees.push({
          ...doc.data(),
          id: doc.id,
        });
      });
      setEmployees(employees);
    });

    return () => {
      unscubscribeDepartment();
    };
  }, []);

  // =================================
  // Snapshot of Department Collection
  // =================================
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

    return () => {
      unscubscribeDepartment();
    };
  }, []);

  // ==================================
  // Snapshot of Designation Collection
  // ==================================
  useEffect(() => {
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
      unscubscribeDesignation();
    };
  }, []);

  // ==================================
  // Converting array to object
  // ==================================
  const mappedFunc = (previous: any, current: any) => {
    const { id, createdAt, modifiedAt, ...rest } = current;
    previous[id] = rest;
    return previous;
  };

  const employeeMapped = employees.reduce(mappedFunc, {} as any);
  const departmentMapped = departments.reduce(mappedFunc, {} as any);
  const designationMapped = designations.reduce(mappedFunc, {} as any);

  const value: any = {
    employees,
    departments,
    designations,
    employeeMapped,
    departmentMapped,
    designationMapped,
  };

  return <DataContext.Provider value={value}>{children}</DataContext.Provider>;
};
