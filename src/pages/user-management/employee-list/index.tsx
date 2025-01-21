import { DataTable } from "@/components/data-table/DataTable";
import { columns, CreateEmployee } from "./utils";
import { useAuthContext, useDataContext } from "@/context";

const EmployeeList = () => {
  const { isLoggedIn } = useAuthContext();
  const { employees } = useDataContext();

  let elements = [<CreateEmployee />];
  if (!isLoggedIn) elements = [];

  return <DataTable data={employees} columns={columns} elements={elements} />;
};

export default EmployeeList;
