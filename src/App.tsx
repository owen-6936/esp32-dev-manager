import "./App.css";
import Navbar from "./components/Navbar";
import { BrowserRouter } from "react-router-dom";
import Analytics from "./components/pages/Analytics";

function App() {
  return (
    <>
      <BrowserRouter>
        <Navbar />
        <Analytics />
      </BrowserRouter>
    </>
  );
}

export default App;
