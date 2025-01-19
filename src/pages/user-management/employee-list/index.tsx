import { DataTable } from "../component/DataTable";
import { columns } from "./column";

const EmployeeList = () => {
  return <DataTable data={[]} columns={columns} />;
};

export default EmployeeList;
