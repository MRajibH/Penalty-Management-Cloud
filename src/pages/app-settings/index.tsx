import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import Department from "./department";
import Designation from "./designation";

const AppSettings = () => {
  return (
    <div className=" p-6 mx-auto grid gap-8">
      <Tabs defaultValue="designation" className="">
        <TabsList className="grid w-[400px] grid-cols-2 ">
          <TabsTrigger value="designation">Manage Designations</TabsTrigger>
          <TabsTrigger value="department">Manage Departments</TabsTrigger>
        </TabsList>
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

export default AppSettings;
