import { DataTable } from "@/components/data-table/DataTable";
import { columns, CreateDesignation } from "./utils";
import { useAuthContext, useDataContext } from "@/context";

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
