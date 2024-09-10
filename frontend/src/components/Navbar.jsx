import React from "react";
import { Link } from "react-router-dom";
import { useLogout } from "../hooks/useLogout";
import { useAuthContext } from "../hooks/useAuthContext";

const Navbar = () => {
  const logout = useLogout();
  const { user } = useAuthContext();

  const handleClick = () => {
    logout();
  };
  return (
    <nav className="navbar navbar-expand bg-body-tertiary">
      <div className="container-fluid">
        <Link className="navbar-brand" to="/">
          Attandace-System
        </Link>
        <ul className="navbar-nav d-flex gap-3">
          <div>
            {user && (
              <>
                <span>{user.email}</span>{" "}
                <button className="btn btn-danger" onClick={handleClick}>
                  Logout
                </button>
              </>
            )}
          </div>
          {!user && (
            <>
              <li className="nav-item">
                <Link className="nav-link" to="/login">
                  Login
                </Link>
              </li>
              <li className="nav-item">
                <Link className="nav-link" to="/register">
                  Register
                </Link>
              </li>
            </>
          )}
        </ul>
      </div>
    </nav>
  );
};

export default Navbar;
