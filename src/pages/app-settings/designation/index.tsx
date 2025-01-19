import { DataTable } from "@/components/data-table/DataTable";
import { columns, CreateDesignation } from "./utils";

const Designation = () => {
  return (
    <DataTable data={[]} columns={columns} elements={[<CreateDesignation />]} />
  );
};

export default Designation;
