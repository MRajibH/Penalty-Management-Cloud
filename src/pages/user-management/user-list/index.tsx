import { DataTable } from "@/components/data-table/DataTable";
import { columns, CreateUser } from "./utils";
import { useDataContext } from "@/context";

const UserList = () => {
  const { users, userPermissions } = useDataContext();

  let elements = [<CreateUser />];
  if (!userPermissions?.management?.users_management.includes("create")) {
    elements = [];
  }

  return <DataTable data={users} columns={columns} elements={elements} />;
};

export default UserList;
