import { useState } from "react";
import "./App.css";
import Header from "./components/Header";
import Home from "./components/Home";
import Invioces from "./components/Invioces";
import POS from "./components/POS";
import Loader from "./components/Loader";
import { HashRouter as Router, Routes, Route } from "react-router-dom";
import { Snackbar, Alert as MuiAlert } from "@mui/material";

function App() {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(false);
  const [errorMessage, setErrorMessage] = useState();

  const showError = (mes) => {
    setErrorMessage(mes);
    setError(true);
  };

  const handleClose = (event, reason) => {
    if (reason === "clickaway") {
      return;
    }
    setError(false);
  };

  const defaultBasename = "/";
  return (
    <div>
      <Router basename={defaultBasename}>
        <Header />
        <Routes>
          <Route
            exact
            path="/invoices"
            element={<Invioces setLoading={setLoading} />}
          />
          <Route
            exact
            path="/pos"
            element={<POS setLoading={setLoading} showError={showError} />}
          />
          <Route exact path="/" element={<Home />} />
        </Routes>
        {loading && <Loader />}
      </Router>
      <Snackbar
        open={error}
        autoHideDuration={6000}
        anchorOrigin={{
          vertical: "bottom",
          horizontal: "right",
        }}
        onClose={handleClose}
      >
        <MuiAlert
          elevation={6}
          variant="filled"
          onClose={handleClose}
          severity="error"
          sx={{ width: "100%" }}
        >
          {errorMessage}
        </MuiAlert>
      </Snackbar>
    </div>
  );
}

export default App;
