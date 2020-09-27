import React from "react";
import { BrowserRouter as Router } from "react-router-dom";
import { useRoutes } from "./routes";
import { useAuth } from "./hooks/auth.hook";
import { AuthContext } from "./context/AuthContext";
import "materialize-css";
import { Navbar } from "./components/Navbar";
import { Loader } from "./components/Loader";
import { useHttp } from "./hooks/http.hook";

function App() {
  const { token, login, logout, userId, ready } = useAuth();
  const IsAuthenticated = !!token;
  const routes = useRoutes(IsAuthenticated);

  if (!ready) {
    return <Loader />;
  }
  return (
    <AuthContext.Provider
      value={{
        token,
        login,
        logout,
        userId,
        IsAuthenticated
      }}
    >
      <Router>
        {IsAuthenticated && <Navbar />}
        <div className="container">{routes}</div>
      </Router>
    </AuthContext.Provider>
  );
}

export default App;
