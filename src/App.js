import { useState } from "react";
import "./App.css";
import Header from "./components/Header";
import Home from "./components/Home";
import Invioces from "./components/Invioces";
import POS from "./components/POS";
import Loader from "./components/Loader";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";

function App() {
  const [loading, setLoading] = useState(false);
  return (
    <div>
      <Router>
        <Header />
        <Routes>
          <Route
            exact
            path="/invoices"
            element={<Invioces setLoading={setLoading} />}
          />
          <Route exact path="/pos" element={<POS setLoading={setLoading} />} />
          <Route exact path="/" element={<Home />} />
        </Routes>
        {loading && <Loader />}
      </Router>
    </div>
  );
}

export default App;
