import { BrowserRouter as Router, Route, Routes } from "react-router-dom";
import Home from "./pages/Home";
import Stock from "./pages/Stock";
import { Navigate } from "react-router-dom";
import SiteNavbar from "./components/SiteNavbar";
import Register from "./pages/Register";
import Login from "./pages/Login";

function App() {
  return (
    <>
      <Router>
        <SiteNavbar />
        <Routes>
          <Route path="/" element={<Navigate to="/home" />} />
          <Route path="/home" element={<Home />} />
          <Route path="/stock" element={<Stock />} />
          <Route path="/register" element={<Register />} />
          <Route path="/login" element={<Login />} />
        </Routes>
      </Router>
    </>
  );
}

export default App;
