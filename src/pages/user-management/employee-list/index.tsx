import { DataTable } from "@/components/data-table/DataTable";
import { columns, CreateEmployee } from "./utils";
import { useDataContext } from "@/context/dataContext";

const EmployeeList = () => {
  const { employees } = useDataContext();

  return (
    <DataTable
      data={employees}
      columns={columns}
      elements={[<CreateEmployee />]}
    />
  );
};

export default EmployeeList;
