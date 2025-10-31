import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";

// Components
import UserList from "./user-list";
import RoleList from "./role-list";

const UserManagement = () => {
  return (
    <div className=" p-6 mx-auto grid gap-8">
      <Tabs defaultValue="user" className="">
        <TabsList className="grid w-[400px] grid-cols-2">
          <TabsTrigger value="user">Manage User</TabsTrigger>
          <TabsTrigger value="role">Manage Roles</TabsTrigger>
        </TabsList>
        <TabsContent value="user" className="mt-8">
          <UserList />
        </TabsContent>
        <TabsContent value="role" className="mt-8">
          <RoleList />
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default UserManagement;
