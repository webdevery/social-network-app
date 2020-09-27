import React, { useCallback, useContext, useEffect, useState } from "react";
import { AuthContext } from "../context/AuthContext";
import { useHttp } from "../hooks/http.hook";
import { useMessage } from "../hooks/message.hook";
import { Friends } from "../modules/Friends";

export const FriendsPage = () => {
  const auth = useContext(AuthContext);
  const { error, request, clearError } = useHttp();
  const message = useMessage();
  const [friends, setFriends] = useState([]);

  const loadFriends = useCallback(async () => {
    try {
      const data = await request("/api/friend/list", "POST", null, {
        authorization: `Bearer ${auth.token}`
      });
      message(data.message);
      if (data.friends) setFriends(data.friends);
    } catch (e) {}
  });

  useEffect(() => {
    loadFriends();
  }, []);
  useEffect(() => {
    if (error?.message) message(error);
    clearError();
  }, [error, message, clearError]);

  return (
    <div className="row">
      <div className="col s8 offset-s3">
        <h1>Мои друзья</h1>
        <Friends friends={friends} setFriends={setFriends} />
      </div>
    </div>
  );
};
