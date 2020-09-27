import React, { useContext, useEffect, useState } from "react";
import { useHistory } from "react-router-dom";
import { AuthContext } from "../context/AuthContext";
import { useHttp } from "../hooks/http.hook";
import { useMessage } from "../hooks/message.hook";

export const RegPage = () => {
  const { login } = useContext(AuthContext);
  const history = useHistory();
  const message = useMessage();
  const {  error, request, clearError } = useHttp();

  const [form, setForm] = useState({
    firstName: "",
    lastName: "",
    email: "",
    password: ""
  });

  useEffect(() => {
    message(error);
    clearError();
  }, [error, message, clearError]);

  useEffect(() => {
    window.M.updateTextFields();
  }, []);

  const changeHandler = e => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const registerHandler = async () => {
    try {
      const data = await request("/api/auth/register", "POST", { ...form });
      message(data.message);
      if (data.success) {
        message('Авторизация');
        const { email, password } = data;
        const dataLogin = await request("/api/auth/login", "POST", { email, password });
        message(dataLogin.message);
        login(dataLogin.token, dataLogin.userId);
      }
    } catch (e) {}
  };
  const loginHandler = () => {
    history.push("/login");
  };
  return (
    <div className="row">
      <div className="col s8 offset-s3">
        <h1>Социальная сеть</h1>
        <div className="card ">
          <div className="card-content black-text">
            <span className="card-title">Регистрацая</span>
            <div>
              <div className="input-field">
                <input
                  id="firstName"
                  name="firstName"
                  type="text"
                  className="validate"
                  value={form.firstName}
                  onChange={changeHandler}
                />
                <label htmlFor="firstName">Имя</label>
              </div>
              <div className="input-field">
                <input
                  id="lastName"
                  name="lastName"
                  type="text"
                  className="validate"
                  value={form.lastName}
                  onChange={changeHandler}
                />
                <label htmlFor="lastName">Фамилия</label>
              </div>
              <div className="input-field">
                <input
                  id="email"
                  name="email"
                  type="text"
                  className="validate"
                  value={form.email}
                  onChange={changeHandler}
                />
                <label htmlFor="email">Email</label>
              </div>
              <div className="input-field">
                <input
                  id="password"
                  type="password"
                  name="password"
                  className="validate"
                  value={form.password}
                  onChange={changeHandler}
                />
                <label htmlFor="password">Пароль</label>
              </div>
            </div>
          </div>
          <div className="card-action">
            <button className="btn yellow accent-4 black-text" onClick={loginHandler} style={{ marginRight: 10 }}>
              Войти
            </button>
            <button className="btn gray accent-1 black-text" onClick={registerHandler}>
              Регистрация
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
