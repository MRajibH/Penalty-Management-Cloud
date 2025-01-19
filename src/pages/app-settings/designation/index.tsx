import { DataTable } from "@/components/data-table/DataTable";
import { columns, CreateDesignation } from "./utils";
import { useDataContext } from "@/context/dataContext";

const Designation = () => {
  const { appSettings } = useDataContext();
  const { designations } = appSettings;

  return (
    <DataTable
      columns={columns}
      data={designations}
      elements={[<CreateDesignation />]}
    />
  );
};

export default Designation;
