import React from "react";
import { NavLink } from "react-router-dom";
import "./Navbar.css";
import AuthContext from "../../context/AuthContext";

function Navbar() {
  return (
    <AuthContext.Consumer>
      {(value) => {
        return (
          <header className="main">
            <div className="main-navbar">
              <h1>EasyEvent</h1>
            </div>
            <nav className="main-navbar-items">
              <ul>
                {!value.token && (
                  <li>
                    <NavLink to="/auth">Authenticate</NavLink>
                  </li>
                )}
                <li>
                  <NavLink to="/events">Event</NavLink>
                </li>
                {value.token && (
                  <>
                    <li>
                      <NavLink to="/booking">Booking</NavLink>
                    </li>
                    <li>
                      <button type="button" onClick={value.logout}>
                        logout
                      </button>
                    </li>
                  </>
                )}
              </ul>
            </nav>
          </header>
        );
      }}
    </AuthContext.Consumer>
  );
}

export default Navbar;
