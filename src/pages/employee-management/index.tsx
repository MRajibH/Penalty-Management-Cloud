import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import EmployeeList from "./employee-list";
import Designation from "./designation";
import Department from "./department";

const EmployeeManagement = () => {
  return (
    <div className=" p-6 mx-auto grid gap-8">
      <Tabs defaultValue="employee" className="">
        <TabsList className="grid w-[600px] grid-cols-3 ">
          <TabsTrigger value="employee">Employee List</TabsTrigger>
          <TabsTrigger value="designation">Manage Designations</TabsTrigger>
          <TabsTrigger value="department">Manage Departments</TabsTrigger>
        </TabsList>
        <TabsContent value="employee" className="mt-8">
          <EmployeeList />
        </TabsContent>
        <TabsContent value="designation" className="mt-8">
          <Designation />
        </TabsContent>
        <TabsContent value="department" className="mt-8">
          <Department />
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default EmployeeManagement;
