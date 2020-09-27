import React, { useCallback, useContext, useEffect, useState } from "react";
import { Loader } from "../components/Loader";
import { AuthContext } from "../context/AuthContext";
import { useHttp } from "../hooks/http.hook";
import { useMessage } from "../hooks/message.hook";

export const Persons = () => {
  const auth = useContext(AuthContext);
  const { loading, error, request, clearError } = useHttp();
  const message = useMessage();
  const [users, setUsers] = useState([]);

  const loadUsers = useCallback(async () => {
    try {
      const data = await request("/api/search", "POST", null, {
        authorization: `Bearer ${auth.token}`
      });
      message(data.message);
      setUsers(data.users);
    } catch (e) {}
  });
  const addFriendHandler = async e => {
    const friendEmail = e.target.getAttribute("data-email");
    try {
      const data = await request(`/api/friend/add:${friendEmail}`, "POST", null, {
        authorization: `Bearer ${auth.token}`
      });
      message(data.message);
      let _users = users.map(user => {
        if (user.email === friendEmail) user.isFriend = true;
        return user;
      });
      setUsers([..._users]);
    } catch (e) {}
  };
  const removeFriendHandler = async e => {
    const friendEmail = e.target.getAttribute("data-email");
    try {
      const data = await request(`/api/friend/remove:${friendEmail}`, "POST", null, {
        authorization: `Bearer ${auth.token}`
      });
      message(data.message);
      let _users = users.map(user => {
        if (user.email === friendEmail) user.isFriend = false;
        return user;
      });
      setUsers([..._users]);
    } catch (e) {}
  };

  useEffect(() => {
    loadUsers();
  }, []);
  useEffect(() => {
    if (error?.message) message(error);
    clearError();
  }, [error, message, clearError]);

  const setButton = user => {
    if (user.isFriend)
      return (
        <i className="material-icons red-text text-accent-4" data-email={user.email} onClick={removeFriendHandler}>
          Удалить из друзей
        </i>
      );
    else
      return (
        <i className="material-icons" data-email={user.email} onClick={addFriendHandler}>
          Добавить в друзья
        </i>
      );
  };
  if (loading) return <Loader />;
  return (
    <table>
      <thead>
        <tr>
          <th>Имя пользователя</th>
          <th className="secondary-content">Действие</th>
        </tr>
      </thead>
      <tbody>
        {users.map((user, key) => {
          return (
            <tr key={key}>
              <td>
                {user.firstName} {user.lastName}
              </td>
              <td>
                <a href="#!" className="secondary-content">
                  {setButton(user)}
                </a>
              </td>
            </tr>
          );
        })}
      </tbody>
    </table>
  );
};
