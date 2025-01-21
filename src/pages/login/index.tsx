import { Button, buttonVariants } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Separator } from "@/components/ui/separator";
import { cn } from "@/lib/utils";
import { ArrowLeft } from "lucide-react";
import { Link } from "react-router-dom";
import { FaGithub } from "react-icons/fa6";
import { FcGoogle } from "react-icons/fc";
import { useToast } from "@/hooks/use-toast";
import { useState } from "react";
import { useAuthContext } from "@/context";

const LoginView = () => {
  const { toast } = useToast();
  const { SignIn } = useAuthContext();

  const [user, setUser] = useState("");
  const [pass, setPass] = useState("");

  const handleSubmit = async (e: any) => {
    e.preventDefault();

    try {
      await SignIn({ user, pass });
    } catch (err: any) {
      toast({
        title: err,
        variant: "destructive",
      });
    }
  };

  return (
    <main className="h-screen grid place-items-center bg-slate-50">
      <div className="w-[350px] space-y-4">
        <div className="w-full flex items-center space-x-1">
          <Link
            replace={true}
            to={"/app/dashboard"}
            className={cn(buttonVariants({ variant: "link" }))}
          >
            <ArrowLeft className="mt-[-0.1px]" />
            Go to Dashboard
          </Link>
        </div>

        <Card>
          <CardHeader>
            <CardTitle className="text-xl">Login to your account</CardTitle>
            <CardDescription>Enter your credentials</CardDescription>
          </CardHeader>
          <CardContent className="space-y-5">
            <form onSubmit={handleSubmit} className="space-y-4">
              <div className="space-y-2">
                <Input
                  name="user"
                  type="text"
                  value={user}
                  placeholder="Enter username"
                  onChange={(e) => setUser(e.target.value)}
                />
                <Input
                  value={pass}
                  name="password"
                  type="password"
                  placeholder="Enter password"
                  onChange={(e) => setPass(e.target.value)}
                />
              </div>
              <Button type="submit" className="w-full">
                Continue
              </Button>
            </form>

            <div className="flex items-center space-x-5">
              <Separator className="flex-1" />
              <p>OR</p>
              <Separator className="flex-1" />
            </div>

            <div className="flex flex-col space-y-3">
              <ProvidersButton />
            </div>
          </CardContent>
        </Card>
      </div>
    </main>
  );
};

const ProvidersButton = () => {
  const { toast } = useToast();

  const handleClick = () => {
    toast({
      title: "Login Unavailable !!",
      description: "Provider login is not available right now",
    });
  };

  return (
    <>
      <Button variant={"outline"} className="relative" onClick={handleClick}>
        <FcGoogle className="size-5 absolute left-3 top-1/5" />
        Continue with Google
      </Button>
      <Button variant={"outline"} className="relative" onClick={handleClick}>
        <FaGithub className="size-5 absolute left-3 top-1/5" />
        Continue with Github
      </Button>
    </>
  );
};

export default LoginView;
