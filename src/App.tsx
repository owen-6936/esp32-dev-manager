import "./App.css";
import Navbar from "./components/Navbar";
import { BrowserRouter } from "react-router-dom";
import Journal from "./components/pages/Journal";

function App() {
  return (
    <>
      <BrowserRouter>
        <Navbar />
        <Journal />
      </BrowserRouter>
    </>
  );
}

export default App;
