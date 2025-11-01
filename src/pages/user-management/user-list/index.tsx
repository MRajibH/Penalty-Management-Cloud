import { useDataContext } from "@/context";
import { columns, CreateUser } from "./utils";
import { DataTable } from "@/components/data-table/DataTable";

const UserList = () => {
  const { users, userPermissions } = useDataContext();

  let elements = [<CreateUser />];
  if (!userPermissions?.management?.users_management.includes("create")) {
    elements = [];
  }

  return <DataTable data={users} columns={columns} elements={elements} />;
};

export default UserList;
