import { DataTable } from "@/components/data-table/DataTable";
import { columns, CreateEmployee } from "./utils";

const EmployeeList = () => {
  return (
    <DataTable data={[]} columns={columns} elements={[<CreateEmployee />]} />
  );
};

export default EmployeeList;
