import { DataTable } from "@/components/data-table/DataTable";
import { columns, CreateDepartment } from "./utils";
import { useDataContext } from "@/context/dataContext";
import { useAuthContext } from "@/context/authContext";

const Department = () => {
  const { isLoggedIn } = useAuthContext();
  const { departments } = useDataContext();

  let elements = [<CreateDepartment />];
  if (!isLoggedIn) elements = [];

  return <DataTable data={departments} columns={columns} elements={elements} />;
};

export default Department;
