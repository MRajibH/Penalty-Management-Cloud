import { DataTable } from "@/components/data-table/DataTable";
import { CreateUser } from "./utils";
import { useAuthContext, useDataContext } from "@/context";

const UserList = () => {
  const { currentUser } = useAuthContext();
  const { users } = useDataContext();

  let elements = [<CreateUser />];

  return <DataTable data={[]} columns={[]} elements={elements} />;
};

export default UserList;
