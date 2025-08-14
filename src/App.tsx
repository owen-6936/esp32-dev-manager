import "./App.css";
import Navbar from "./components/Navbar";
import { BrowserRouter } from "react-router-dom";
import Inventory from "./components/pages/Inventory";

function App() {
  return (
    <>
      <BrowserRouter>
        <Navbar />
        <Inventory />
      </BrowserRouter>
    </>
  );
}

export default App;
