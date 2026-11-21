
import React, { useState } from "react";
import Login from "./components/Login";
import Register from "./components/Register";
import { Chat } from "./components/Chat";
import "bootstrap/dist/js/bootstrap.min.js";
import "bootstrap/dist/css/bootstrap.min.css";

const App = () => {
  const [user, setUser] = useState(null);

  const handleLogout = () => {
    localStorage.removeItem("token");
    setUser(null);
  };

  return (
    <div className="app">
      {!user ? (
        <div className="container mt-5 text-center">
          <div className="row">
            <div className="col-md-6">
              <Register />
            </div>

            <div className="col-md-6">
              <Login setUser={setUser} />
            </div>
          </div>
        </div>
      ) : (
        <Chat user={user} onLogout={handleLogout} />
      )}
    </div>
  );
};

export default App;
