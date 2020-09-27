import React, { useCallback, useContext, useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { Loader } from "../components/Loader";
import { Message } from "../components/Message";
import { AuthContext } from "../context/AuthContext";
import { DialogContext } from "../context/DialogContext";
import { useHttp } from "../hooks/http.hook";
import { useMessage } from "../hooks/message.hook";

export const Messages = () => {
  const { token } = useContext(AuthContext);
  const { messages, setMessages } = useContext(DialogContext);
  const [needUpdate, setNeedUpdate] = useState(false);
  const { loading, error, request, clearError } = useHttp();
  const message = useMessage();
  const dialogId = useParams().id;

  const loadMessages = useCallback(async () => {
    try {
      const data = await request(`/api/message/:${dialogId}`, "POST", null, {
        authorization: `Bearer ${token}`
      });
      message(data.message);
      function diff(a, b) {
        let change = false;
        a.forEach(function(i) {
          if (b.indexOf(i) === -1) change = true;
        });
        b.forEach(function(i) {
          if (a.indexOf(i) === -1) change = true;
        });
        return change;
      }
      if (data.messages) {
        if (diff(data.messages, messages)) {
          setMessages(data.messages);
        }
      }
    } catch (e) {}
  }, [token, request, needUpdate]);

  const readMessages = async () => {
    try {
      if (global.resetTimeout) return false;
      const data = await request(
        `/api/message/read/:${dialogId}`,
        "POST",
        null,
        {
          authorization: `Bearer ${token}`
        },
        false
      );
      if (global.resetTimeout) return false;

      if (data.needUpdate) {
        message(data.message);
        setNeedUpdate(data.needUpdate);
        setNeedUpdate(false);
      }
      clearTimeout(global.messTimout);

      global.messTimout = setTimeout(() => {
        readMessages();
      }, 1000);
    } catch (e) {}
  };

  useEffect(() => {
    loadMessages();
  }, [needUpdate, token]);

  useEffect(() => {
    clearTimeout(global.messTimout);
    global.resetTimeout = false;
    readMessages();
    return () => {
      global.resetTimeout = true;
      clearTimeout(global.messTimout);
    };
  }, []);

  useEffect(() => {
    var block = document.getElementById("messages-list");
    block.scrollTop = 999999;
  }, [messages]);

  useEffect(() => {
    if (error?.message) message(error);
    clearError();
  }, [error, message, clearError]);

  if (loading && messages.length === 0) return <Loader />;

  return (
    <div
      id="messages-list"
      className="messages-list"
      style={{
        overflowY: "scroll",
        height: "400px",
        padding: "0 10px",
        borderBottom: "1px solid rgba(160,160,160,0.2)",
        borderTop: "1px solid rgba(160,160,160,0.2)"
      }}
    >
      {messages.map((item, k) => {
        return <Message message={item} key={k} />;
      })}
      {messages.length === 0 && <h6>Начните общение</h6>}
    </div>
  );
};
