import React, { useContext, useEffect } from "react";
import { NavLink, useHistory } from "react-router-dom";
import { Loader } from "../components/Loader";
import { AuthContext } from "../context/AuthContext";
import { useHttp } from "../hooks/http.hook";
import { useMessage } from "../hooks/message.hook";

export const Friends = ({ friends, setFriends }) => {
  const history = useHistory();
  const { token } = useContext(AuthContext);
  const { loading, error, request, clearError } = useHttp();
  const message = useMessage();

  const dialogHandler = async e => {
    const friendEmail = e.target.getAttribute("data-email");
    try {
      const data = await request(`/api/dialog/findOne/:${friendEmail}`, "POST", null, {
        authorization: `Bearer ${token}`
      });
      message(data.message);
      history.push(`/dialog/${data.dialogId}`);
    } catch (e) {}
  };
  const removeFriendHandler = async e => {
    const friendEmail = e.target.getAttribute("data-email");
    try {
      const data = await request(`/api/friend/remove:${friendEmail}`, "POST", null, {
        authorization: `Bearer ${token}`
      });
      message(data.message);
      let _friends = friends.filter(friend => {
        if (friend.email === friendEmail) return false;
        return friend;
      });
      setFriends([..._friends]);
    } catch (e) {}
  };

  useEffect(() => {
    if (error?.message) message(error);
    clearError();
  }, [error, message, clearError]);

  if (loading) return <Loader />;
  if (friends.length == 0)
    return (
      <div>
        <h4>У вас нет друзей(</h4>
        <div>
          <NavLink to={"/search-friend/"}>
            <h6 style={{ display: "inline" }}>Найдите друзей для общения</h6>
          </NavLink>
        </div>
      </div>
    );
  return (
    <ul className="collection with-header">
      {friends.map((friend, key) => {
        return (
          <li key={key} className="collection-item avatar">
            <img src="https://materializecss.com/images/yuna.jpg" alt="" className="circle" />
            <span className="title">
              {friend.firstName} <br /> {friend.lastName}
            </span>
            <p>
              <a href="#!">
                <i className="material-icons" data-email={friend.email} onClick={dialogHandler}>
                  перейти к диалогу
                </i>
              </a>
            </p>
            <a href="#!" className="secondary-content">
              <i
                className="material-icons red-text text-accent-4"
                data-email={friend.email}
                onClick={removeFriendHandler}
              >
                Удалить из друзей
              </i>
            </a>
          </li>
        );
      })}
    </ul>
  );
};
