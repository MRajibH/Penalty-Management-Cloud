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
}

export const DataContext = createContext({} as DataContextType);
export const useDataContext = () => useContext(DataContext);

export const DataContextProvider = ({ children }: { children: ReactNode }) => {
  const [employees, setEmployees] = useState([]);
  const [departments, setDepartments] = useState([]);
  const [designations, setDesignations] = useState([]);

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

  const value: any = { employees, departments, designations };

  return <DataContext.Provider value={value}>{children}</DataContext.Provider>;
};
