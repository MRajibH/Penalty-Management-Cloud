import { DataTable } from "@/components/data-table/DataTable";
import { columns, CreateDesignation } from "./utils";
import { useDataContext } from "@/context/dataContext";
import { useAuthContext } from "@/context/authContext";

const Designation = () => {
  const { isLoggedIn } = useAuthContext();
  const { designations } = useDataContext();

  let elements = [<CreateDesignation />];
  if (!isLoggedIn) elements = [];

  return (
    <DataTable columns={columns} data={designations} elements={elements} />
  );
};

export default Designation;
