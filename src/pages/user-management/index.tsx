import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import EmployeeList from "./employee-list";
import { DataTable } from "@/components/data-table/DataTable";

const UserManagement = () => {
  return (
    <div className=" p-6 mx-auto grid gap-8">
      <Tabs defaultValue="employee" className="">
        <TabsList className="grid w-[600px] grid-cols-3 ">
          <TabsTrigger value="employee">Employee List</TabsTrigger>
          <TabsTrigger value="user">Manage User</TabsTrigger>
          <TabsTrigger value="role">Manage Roles</TabsTrigger>
        </TabsList>
        <TabsContent value="employee" className="mt-8">
          <EmployeeList />
        </TabsContent>
        <TabsContent value="user" className="mt-8">
          <DataTable data={[]} columns={[]} />
        </TabsContent>
        <TabsContent value="role" className="mt-8">
          <DataTable data={[]} columns={[]} />
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default UserManagement;
