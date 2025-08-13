import "./App.css";
import Navbar from "./components/Navbar";
import { BrowserRouter } from "react-router-dom";
import Project from "./components/pages/Project";

function App() {
  return (
    <>
      <BrowserRouter>
        <Navbar />
        <Project />
      </BrowserRouter>
    </>
  );
}

export default App;
