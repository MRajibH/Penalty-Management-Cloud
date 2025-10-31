import {
  departmentRef,
  designationRef,
  employeeRef,
  roleRef,
  userRef,
} from "@/db/firebase.db";
import { onSnapshot } from "firebase/firestore";
import {
  createContext,
  ReactNode,
  useContext,
  useEffect,
  useState,
} from "react";
import {
  DataContextType,
  departmentType,
  designationType,
  employeesType,
  roleType,
  userType,
} from "./types";
import { getQueryRef, getSnapshotData, mappedFunc } from "./functions";

export const DataContext = createContext({} as DataContextType);
export const useDataContext = () => useContext(DataContext);

export const DataContextProvider = ({ children }: { children: ReactNode }) => {
  const [users, setUsers] = useState<userType[]>([]);
  const [roles, setRoles] = useState<roleType[]>([]);
  const [employees, setEmployees] = useState<employeesType[]>([]);
  const [departments, setDepartments] = useState<departmentType[]>([]);
  const [designations, setDesignations] = useState<designationType[]>([]);

  useEffect(() => {
    // =========================
    // Refs with default query
    // =========================
    const QueryUserRef = getQueryRef(userRef);
    const QueryRoleRef = getQueryRef(roleRef);
    const QueryEmployeeRef = getQueryRef(employeeRef);
    const QueryDepartmentRef = getQueryRef(departmentRef);
    const QueryDesignationRef = getQueryRef(designationRef);

    // ===============================
    // Subcribe collections on mount
    // ===============================
    const unsubscribeUser = onSnapshot(QueryUserRef, (snapshot) => {
      setUsers(getSnapshotData(snapshot));
    });

    const unsubscribeRole = onSnapshot(QueryRoleRef, (snapshot) => {
      setRoles(getSnapshotData(snapshot));
    });

    const unsubscribeEmployee = onSnapshot(QueryEmployeeRef, (snapshot) => {
      setEmployees(getSnapshotData(snapshot));
    });

    const unsubscribeDepartment = onSnapshot(QueryDepartmentRef, (snapshot) => {
      setDepartments(getSnapshotData(snapshot));
    });

    const unsubscribeDesignation = onSnapshot(
      QueryDesignationRef,
      (snapshot) => {
        setDesignations(getSnapshotData(snapshot));
      }
    );

    return () => {
      // ======================================
      // UnSubcribe all collections on unmount
      // ======================================
      unsubscribeUser();
      unsubscribeRole();
      unsubscribeEmployee();
      unsubscribeDepartment();
      unsubscribeDesignation();
    };
  }, []);

  // ==================================
  // Converting array to object
  // ==================================
  const userMapped = users.reduce(mappedFunc, {} as any);
  const roleMapped = roles.reduce(mappedFunc, {} as any);
  const employeeMapped = employees.reduce(mappedFunc, {} as any);
  const departmentMapped = departments.reduce(mappedFunc, {} as any);
  const designationMapped = designations.reduce(mappedFunc, {} as any);

  const value: any = {
    // Collections
    users,
    roles,
    employees,
    departments,
    designations,

    // Mapped objects
    userMapped,
    roleMapped,
    employeeMapped,
    departmentMapped,
    designationMapped,
  };

  return <DataContext.Provider value={value}>{children}</DataContext.Provider>;
};
