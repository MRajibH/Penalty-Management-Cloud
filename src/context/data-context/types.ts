// ===============================
// Types of Data Context
// ===============================

type PermissionAction = "view" | "create" | "update" | "delete";

export type RolePermissions = {
  overview: {
    dashboard: PermissionAction[];
    penalties: PermissionAction[];
  };
  management: {
    users_management: PermissionAction[];
    employee_management: PermissionAction[];
    manage_constitution: PermissionAction[];
  };
  settings: {
    app_logs: PermissionAction[];
    app_settings: PermissionAction[];
  };
};

export type roleType = {
  id: string;
  roles: RolePermissions;
  role_name: string;
  createdAt: number;
  modifiedAt: number;
};

export type userType = {
  id: string;
  name: string;
  email: string;
  avatar: string;
  role_id: string;
  auth_id: string;
  password: string;
  createdAt: number;
  modifiedAt: number;
};

export type employeesType = {
  id: string;
  name: string;
  email: string;
  phone: string;
  avatar: string;
  createdAt: number;
  modifiedAt: number;
  designation_id: string;
};

export type departmentType = {
  id: string;
  createdAt: number;
  modifiedAt: number;
  department_name: string;
};

export type designationType = {
  id: string;
  order: string;
  createdAt: number;
  modifiedAt: number;
  department_id: string;
  designation_name: string;
};

export type penaltyReasonType = {
  id: string;
  createdAt: number;
  modifiedAt: number;
  reason_name: string;
};

export type penaltyStatusType = "PENDING" | "PAID" | "DISPUTED";

export type penaltyDataType = {
  id: string;
  date: string;
  amount: number;
  reason_id: string;
  createdAt: number;
  modifiedAt: number;
  employee_id: string;
  description?: string;
  status: penaltyStatusType;
};

export type ProcessedPenaltyDataType = {
  employee: employeesType;
  designation: designationType;
  department: departmentType;
  penalties: (penaltyDataType & { reason: penaltyReasonType })[];
};

export interface DataContextType {
  users: userType[];
  roles: roleType[];
  employees: employeesType[];
  departments: departmentType[];
  penaltyData: penaltyDataType[];
  designations: designationType[];
  penaltyReasons: penaltyReasonType[];

  userMapped: Record<string, userType>;
  roleMapped: Record<string, roleType>;
  employeeMapped: Record<string, employeesType>;
  departmentMapped: Record<string, departmentType>;
  penaltyDataMapped: Record<string, penaltyDataType>;
  designationMapped: Record<string, designationType>;
  penaltyReasonMapped: Record<string, penaltyReasonType>;

  userPermissions: RolePermissions;
}
