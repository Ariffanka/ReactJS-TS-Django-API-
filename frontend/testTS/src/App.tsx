import React from "react";
import { BrowserRouter as Router, Routes, Route, Navigate } from "react-router-dom";
import 'bootstrap/dist/css/bootstrap.min.css';
import './showD';
import { ShowData } from "./showD";
import AddData from "./function/add";
import EditData from "./function/edit";
import LoginPage from "./function/login";
import Register from "./function/regis";

interface PrivateRouteProps {
  element: React.ReactNode;
}

const PrivateRoute: React.FC<PrivateRouteProps> = ({ element }) => {
  const isAuthenticated = localStorage.getItem('token') !== null;
  return isAuthenticated ? <>{element}</> : <Navigate to="/login" />;
};

const App: React.FC = () => {
  return (
    <Router>
      <Routes>
        <Route path="/login" element={<LoginPage />} />
        <Route path="/register" element={<Register />} />
        <Route
          path="/"
          element={
            <PrivateRoute
              element={<ShowData />}
            />
          }
        />
        <Route
          path="/add"
          element={
            <PrivateRoute
              element={<AddData />}
            />
          }
        />
        <Route
          path="/edit/:id"
          element={
            <PrivateRoute
              element={<EditData />}
            />
          }
        />
      </Routes>
    </Router>
  );
}

export default App;
