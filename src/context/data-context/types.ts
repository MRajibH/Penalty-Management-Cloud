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
  createdAt: number;
  modifiedAt: number;
  department_id: string;
  designation_name: string;
};

export interface DataContextType {
  users: userType[];
  roles: roleType[];
  employees: employeesType[];
  departments: departmentType[];
  designations: designationType[];

  userMapped: Record<string, userType>;
  roleMapped: Record<string, roleType>;
  employeeMapped: Record<string, employeesType>;
  departmentMapped: Record<string, departmentType>;
  designationMapped: Record<string, designationType>;

  userPermissions: RolePermissions;
}
