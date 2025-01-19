import { HashRouter } from "react-router-dom";
import RootRouter from "./routes/RootRouter";
import { AuthContextProvider } from "./context/authContext";
import { Toaster } from "./components/ui/toaster";
import { DataContextProvider } from "./context/dataContext";

function App() {
  return (
    <AuthContextProvider>
      <DataContextProvider>
        <HashRouter>
          <RootRouter />
          <Toaster />
        </HashRouter>
      </DataContextProvider>
    </AuthContextProvider>
  );
}

export default App;
