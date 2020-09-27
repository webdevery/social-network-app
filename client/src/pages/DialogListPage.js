import React, { useCallback, useContext, useEffect, useState } from "react";

import { Loader } from "../components/Loader";
import { AuthContext } from "../context/AuthContext";
import { useHttp } from "../hooks/http.hook";
import { useMessage } from "../hooks/message.hook";
import { Dialogs } from "../modules/Dialogs";

export const DialogListPage = () => {
  const { token } = useContext(AuthContext);
  const { loading, error, request, clearError } = useHttp();
  const message = useMessage();
  const [dialogs, setDialogs] = useState([]);

  const loadDialogs = useCallback(async () => {
    try {
      const data = await request(`/api/dialog/`, "POST", null, {
        authorization: `Bearer ${token}`
      });
      if (data.message) message(data.message);
      setDialogs(data.dialogs);
    } catch (e) {}
  });

  useEffect(() => {
    loadDialogs();
  }, []);

  useEffect(() => {
    if (error?.message) message(error);
    clearError();
  }, [error, message, clearError]);

  if (loading) return <Loader />;
  return (
    <div className="row">
      <div className="col s8 offset-s3">
        <h1>Мои диалоги</h1>
        <hr />
        <Dialogs dialogs={dialogs} />
      </div>
    </div>
  );
};
