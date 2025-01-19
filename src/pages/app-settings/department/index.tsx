import { DataTable } from "@/components/data-table/DataTable";
import { columns, CreateDepartment } from "./utils";
import { useDataContext } from "@/context/dataContext";

const Department = () => {
  const { appSettings } = useDataContext();
  const { departments } = appSettings;

  return (
    <DataTable
      data={departments}
      columns={columns}
      elements={[<CreateDepartment />]}
    />
  );
};

export default Department;
