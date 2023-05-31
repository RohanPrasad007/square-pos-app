import "./App.css";
import Header from "./components/Header";
import Home from "./components/Home";
import POS from "./components/POS";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";

function App() {
  return (
    <div>
      <Router>
        <Header />
        <Routes>
          <Route exact path="/pos" element={<POS />} />
          <Route exact path="/" element={<Home />} />
        </Routes>
      </Router>
    </div>
  );
}

export default App;
