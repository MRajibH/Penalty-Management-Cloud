import { HashRouter } from "react-router-dom";
import RootRouter from "./routes/RootRouter";

function App() {
  return (
    <HashRouter>
      <RootRouter />
    </HashRouter>
  );
}

export default App;
