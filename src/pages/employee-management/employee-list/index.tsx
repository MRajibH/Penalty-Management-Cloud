import { useDataContext } from "@/context";
import { DataTable } from "@/components/data-table/DataTable";
import { columns as defaultColumns, CreateEmployee } from "./utils";

const EmployeeList = () => {
  const { employees, designationMapped, userPermissions } = useDataContext();

  let columns = defaultColumns;
  let elements = [<CreateEmployee />];
  if (!userPermissions?.management?.employee_management.includes("create")) {
    elements = [];
  }

  const processedEmployees = employees.map((employee) => ({
    ...employee,
    designation_order: designationMapped[employee?.designation_id]?.order,
    designation_name: designationMapped[employee?.designation_id]?.designation_name,
  }));

  // descending order by order field and name field
  const sortedEmployees = processedEmployees.sort(
    (a, b) =>
      parseInt(b.designation_order) - parseInt(a.designation_order) || a.name.localeCompare(b.name)
  );

  return <DataTable data={sortedEmployees} columns={columns} elements={elements} />;
};

export default EmployeeList;
