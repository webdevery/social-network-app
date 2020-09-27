import React, { useContext, useEffect } from "react";
import { NavLink, useHistory } from "react-router-dom";
import { AuthContext } from "../context/AuthContext";

export const Navbar = () => {
  const history = useHistory();
  const { logout } = useContext(AuthContext);
  const logoutHandler = e => {
    e.preventDefault();
    logout();
    history.push("/");
  };
  useEffect(() => {
    global.resetTimeout = true;
  });
  return (
    <nav>
      <div className="nav-wrapper blue darken-1" style={{ padding: "0 2rem" }}>
        <span className="brand-logo">Социальная сеть</span>
        <ul id="nav-mobile" className="right hide-on-med-and-down">
          <li>
            <NavLink to="/dialogs-list">Диалоги</NavLink>
          </li>
          <li>
            <NavLink to="/friends">Друзья</NavLink>
          </li>
          <li>
            <NavLink to="/search-friend">Найти друга</NavLink>
          </li>
          <li>
            <a onClick={logoutHandler}>Выйти</a>
          </li>
        </ul>
      </div>
    </nav>
  );
};
