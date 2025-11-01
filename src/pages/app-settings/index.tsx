import PenaltyReasons from "./penaltyReasons";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";

const AppSettings = () => {
  return (
    <div className=" p-6 mx-auto grid gap-8">
      <Tabs defaultValue="penaltyReasons" className="">
        <TabsList className="grid w-[400px] grid-cols-2">
          <TabsTrigger value="penaltyReasons">Penalty Reasons</TabsTrigger>
          <TabsTrigger value="uiSettings">UI Settings</TabsTrigger>
        </TabsList>
        <TabsContent value="penaltyReasons" className="mt-8">
          <PenaltyReasons />
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default AppSettings;
