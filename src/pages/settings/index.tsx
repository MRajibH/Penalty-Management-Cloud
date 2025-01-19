import { ProfileForm } from "@/components/form/ProfileForm";
import { Separator } from "@/components/ui/separator";

const Settings = () => {
  return (
    <>
      <div className="space-y-6 p-4 max-w-[800px]">
        <div>
          <h3 className="text-lg font-medium">Profile</h3>
          <p className="text-sm text-muted-foreground">
            This is how others will see you on the site.
          </p>
        </div>
        <Separator />
        <ProfileForm />
      </div>
    </>
  );
};

export default Settings;
