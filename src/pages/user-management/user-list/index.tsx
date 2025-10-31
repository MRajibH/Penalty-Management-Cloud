import { DataTable } from "@/components/data-table/DataTable";
import { columns, CreateUser } from "./utils";
import { useAuthContext, useDataContext } from "@/context";

const UserList = () => {
  const { currentUser } = useAuthContext();
  const { users } = useDataContext();

  let elements = [<CreateUser />];

  return <DataTable data={users} columns={columns} elements={elements} />;
};

export default UserList;
