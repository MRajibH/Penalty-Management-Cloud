import { HashRouter } from "react-router-dom";
import RootRouter from "./routes/RootRouter";
import { AuthContextProvider } from "./context/authContext";
import { Toaster } from "./components/ui/toaster";

function App() {
  return (
    <AuthContextProvider>
      <HashRouter>
        <RootRouter />
        <Toaster />
      </HashRouter>
    </AuthContextProvider>
  );
}

export default App;
