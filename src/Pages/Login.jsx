import React, { useState } from "react";
import InputWithError from "../Components/UI/InputWithError";
import logo from "./logo.png";
import { Link } from "react-router-dom";
import useFormAndValidation from "../Hooks/useFormAndValidation";
import axios from "axios";
const URL_API = `${window.location.protocol}//${window.location.hostname}:1721/sneakers`;

function Login({ onSubmit, isLoading }) {
  const [ checkForm, setCheckFrom ] = useState(false)
  const { handleChange, values, errors, isFormValid, resetForm } =
    useFormAndValidation();

  const login = (event) => {
    event.preventDefault();
    postUser();
    
  };
  const postUser = () => {
    let userData = {
      email: values["email"],
      password: values["password"]
    }
    axios.post(URL_API + '/sign-in', JSON.stringify(userData))
    .then(res =>{
      if(!res.data){
        alert("Неправильні дані!");
        setCheckFrom(false)
      }
      else{
        setCheckFrom(true)
        localStorage.setItem('userName', userData.email)
        window.location = "/"
        
      }
    })
  }

  return (
    <div className="login">
      <form onSubmit={login} className="login__form" noValidate>
        <img className="logo logo_type_login" src={logo} alt="Кросівки" />
        <h1 className="login__title">Вхід</h1>
        <InputWithError
          value={values["email"] || ""}
          onChange={handleChange}
          type="email"
          placeholder="Пошта"
          name="email"
          isInvalid={errors["email"] ? true : false}
          errorText={errors["email"]}
          required
        />
        <InputWithError
          value={values["password"] || ""}
          onChange={handleChange}
          type="password"
          placeholder="Пароль"
          name="password"
          minLength="8"
          maxLength="40"
          isInvalid={errors["password"] ? true : false}
          errorText={errors["password"]}
          required
        />
        <button
          className={`button_log button_type_login ${
            isFormValid ? "" : "button_type_disabled"
          }`}
          disabled={!isFormValid}
        >
          {isLoading ? "Завантаження..." : "Увійти"}
        </button>
        <p className="login__text">
          Немає акаунту?{" "}
          <Link className="login__link" to="/sign-up">
            Зареєструватися
          </Link>
        </p>
      </form>
    </div>
  );
}

export default Login;