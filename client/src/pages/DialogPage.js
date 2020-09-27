import React, { useCallback, useContext, useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { AuthContext } from "../context/AuthContext";
import { DialogContext } from "../context/DialogContext";
import { useHttp } from "../hooks/http.hook";
import { useMessage } from "../hooks/message.hook";
import { Messages } from "../modules/Messages";

export const DialogPage = () => {
  const { token } = useContext(AuthContext);
  const { loading, error, request, clearError } = useHttp();
  const message = useMessage();
  const [messages, setMessages] = useState([]);
  const [name, setName] = useState("");
  const [mess, setMess] = useState("");
  const dialogId = useParams().id;

  const changeHandler = e => {
    setMess(e.target.value);
  };
  const messHandler = async e => {
    try {
      const _mess = mess;
      setMess("");
      const data = await request(
        `/api/message/mess`,
        "POST",
        { text: _mess, dialogId },
        {
          authorization: `Bearer ${token}`
        },
        false
      );
      message(data.message);
      const newMess = data.newMess;

      setMessages([...messages, newMess]);
    } catch (e) {}
  };
  const getName = useCallback(
    async e => {
      try {
        const data = await request(`/api/friend/get:${dialogId}`, "POST", null, {
          authorization: `Bearer ${token}`
        });
        setName(data.friendName);
      } catch (e) {}
    },
    [token]
  );
  useEffect(() => {
    getName();
  }, [token]);

  useEffect(() => {
    if (error?.message) message(error);
    clearError();
  }, [error, message, clearError]);

  return (
    <DialogContext.Provider
      value={{
        messages,
        setMessages
      }}
    >
      <div>
        {loading && <h1>Загрузка...</h1>}
        {!loading && <h1>{name}</h1>}
        <div className="card">
          <div className="card-content black-text">
            <h5>сообщения:</h5>
          </div>
          <div className="card-action" style={{ borderTop: "0" }}>
            <Messages />
            <div>
              <div className="input-field">
                <input
                  id="message"
                  name="message"
                  placeholder="Введите сообщение"
                  type="text"
                  value={mess}
                  onChange={changeHandler}
                  onKeyDown={e => {
                    if (e.keyCode === 13) messHandler();
                  }}
                />
              </div>
            </div>
            <button className="btn yellow accent-4 black-text" onClick={messHandler}>
              Отправить
            </button>
          </div>
        </div>
      </div>
    </DialogContext.Provider>
  );
};
