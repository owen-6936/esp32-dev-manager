import "./App.css";
import Navbar from "./components/Navbar";
import { BrowserRouter } from "react-router-dom";
import Dashboard from "./components/pages/Dashboard";

function App() {
  return (
    <>
      <BrowserRouter>
        <Navbar />
        <Dashboard />
      </BrowserRouter>
    </>
  );
}

export default App;
