import { DataTable } from "@/components/data-table/DataTable";
import { columns, CreateEmployee } from "./utils";
import { useDataContext } from "@/context/dataContext";
import { useAuthContext } from "@/context/authContext";

const EmployeeList = () => {
  const { isLoggedIn } = useAuthContext();
  const { employees } = useDataContext();

  let elements = [<CreateEmployee />];
  if (!isLoggedIn) elements = [];

  return <DataTable data={employees} columns={columns} elements={elements} />;
};

export default EmployeeList;
