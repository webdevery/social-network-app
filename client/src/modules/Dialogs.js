import React from "react";
import { NavLink } from "react-router-dom";

export const Dialogs = ({ dialogs }) => {
  const cutStr = str => {
    if (!str) return;
    if (str < 30) return str;
    if (str.length > 30) {
      str = str.substring(30, str.length - 30);
      str += "...";
    }
    return str;
  };

  if (dialogs.length == 0)
    return (
      <div>
        <h4>У вас нет диалогов(</h4>
        <div>
          <NavLink to={"/search-friend/"}>
            <h6 style={{ display: "inline" }}>Найдите друзей для общения</h6>
          </NavLink>
          <h6 style={{ display: "inline" }}> или </h6>
          <NavLink to={"/friends/"}>
            <h6 style={{ display: "inline" }}>Начните диалог с другом</h6>
          </NavLink>
        </div>
      </div>
    );
  return (
    <table className="striped">
      <thead>
        <tr>
          <th>Имя пользователя</th>
          <th>Последнее сообщение</th>
          <th className="secondary-content">Количество сообщений</th>
        </tr>
      </thead>
      <tbody>
        {dialogs.map((dialog, key) => {
          return (
            <tr key={key}>
              <td>
                <NavLink to={"/dialog/" + dialog.id} key={key}>
                  <h6>{dialog.fullName}</h6>
                </NavLink>
              </td>
              <td>{cutStr(dialog.message)}</td>
              <td className="secondary-content" style={{ color: "#333", marginTop: "8px", fontSize: "12px" }}>
                {dialog.count}
              </td>
            </tr>
          );
        })}
      </tbody>
    </table>
  );
};
