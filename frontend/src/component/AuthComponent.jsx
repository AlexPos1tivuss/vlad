import React, { useState } from "react";
import { authAuthenticate, authRegister } from "../services/UrlService";
import styles from "../styles/SigningComponent.module.css";
import { redirect, useNavigate } from "react-router-dom";

const AuthComponent = () => {
  const [isSignIn, setIsSignIn] = useState(true);
  const [isSignUp, setIsSignUp] = useState(false);

  const [showLoginPassword, setShowLoginPassword] = useState(false);
  const [showRegisterPassword, setShowRegisterPassword] = useState(false);
  const [showRegisterConfirmPassword, setShowRegisterConfirmPassword] = useState(false);

  const navigate = useNavigate();

  const [loginData, setLoginData] = useState({
    login: "",
    password: ""
  });

  const [registerData, setRegisterData] = useState({
    login: "",
    firstName: "",
    lastName: "",
    email: "",
    position: "",
    password: "",
    confirmPassword: ""
  });

  const [errors, setErrors] = useState({});

  const handleSignIn = () => {
    setIsSignIn(true);
    setIsSignUp(false);
    setLoginData({ login: "", password: "" });
    setErrors({});
  };

  const handleSignUp = () => {
    setIsSignIn(false);
    setIsSignUp(true);
    setRegisterData({
      login: "",
      firstName: "",
      lastName: "",
      email: "",
      position: "",
      password: "",
      confirmPassword: ""
    });
    setErrors({});
  };

  const handleLoginChange = (e) => {
    const { name, value } = e.target;
    setLoginData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleRegisterChange = (e) => {
    const { name, value } = e.target;
    
      setRegisterData(prev => ({
        ...prev,
        [name]: value
      }));
    
  };

  const validateLoginForm = () => {
    const newErrors = {};
    
    if (!loginData.login.trim()) {
      newErrors.login = "Логин обязателен";
    } else if (loginData.login.length > 20) {
      newErrors.login = "Логин не должен превышать 20 символов";
    }
    
    if (!loginData.password) {
      newErrors.password = "Пароль обязателен";
    } else if (loginData.password.length > 40) {
      newErrors.password = "Пароль не должен превышать 40 символов";
    }
    
    return newErrors;
  };

  const validateRegisterForm = () => {
    const newErrors = {};
    
    if (!registerData.login.trim()) {
      newErrors.login = "Логин обязателен";
    } else if (registerData.login.length > 20) {
      newErrors.login = "Логин не должен превышать 20 символов";
    }
    
    if (!registerData.firstName.trim()) {
      newErrors.firstName = "Имя обязательно";
    } else if (registerData.firstName.length > 20) {
      newErrors.firstName = "Имя не должно превышать 20 символов";
    }
    
    if (!registerData.lastName.trim()) {
      newErrors.lastName = "Фамилия обязательна";
    } else if (registerData.lastName.length > 20) {
      newErrors.lastName = "Фамилия не должна превышать 20 символов";
    }
    
    if (!registerData.email.trim()) {
      newErrors.email = "Email обязателен";
    } else if (registerData.email.length > 30) {
      newErrors.email = "Email не должен превышать 30 символов";
    }
    
    if(!registerData.position.trim()){
        newErrors.position = "Позиция обязателен";
    } else if (registerData.position.length > 40){
        newErrors.position = "Позиция не должна превышать 40 симоволов";
    }
    
    if (!registerData.password) {
      newErrors.password = "Пароль обязателен";
    } else if (registerData.password.length > 60) {
      newErrors.password = "Пароль не должен превышать 60 символов";
    } else if (registerData.password.length < 6) {
      newErrors.password = "Пароль должен содержать минимум 6 символов";
    }
    
    if (!registerData.confirmPassword) {
      newErrors.confirmPassword = "Подтвердите пароль";
    } else if (registerData.password !== registerData.confirmPassword) {
      newErrors.confirmPassword = "Пароли не совпадают";
    }
    
    return newErrors;
  };

  const handleLoginSubmit = async (e) => {
    e.preventDefault();
    const newErrors = validateLoginForm();
    
    if (Object.keys(newErrors).length > 0) {
      setErrors(newErrors);
      return;
    }
    
    setErrors({});
    
    try {
      const response = await authAuthenticate(loginData);
      console.log("Login successful:", response.data);
      if(response.data.token){
        localStorage.setItem('authToken', response.data.token)
        const payload = JSON.parse(atob(response.data.token.split('.')[1]));
        localStorage.setItem("userRole", payload.role);
      }
      navigate("/");
    } catch (error) {
      console.error("Login error:", error);
      if (error.response?.data) {
        setErrors({ submit: error.response.data });
      } else {
        setErrors({ submit: "Ошибка при входе" });
      }
    }
  };


  const handleRegisterSubmit = async (e) => {
    e.preventDefault();
    const newErrors = validateRegisterForm();
    
    if (Object.keys(newErrors).length > 0) {
      setErrors(newErrors);
      return;
    }
    
    setErrors({});
    
    const { confirmPassword, ...userData } = registerData;
    
    try {
      const response = await authRegister(userData);
      console.log("Registration successful:", response.data);
      
      handleSignIn(); 
    } catch (error) {
      console.error("Registration error:", error);
      if (error.response?.data) {
        setErrors({ submit: error.response.data });
      } else {
        setErrors({ submit: "Ошибка при регистрации" });
      }
    }
  };

  return (
  <div className={styles.body}>
    <article className={styles.container}>
      <div className={styles.block}>
        <section className={`${styles.block_item} ${styles["block-item"]} ${isSignIn ? styles.hidden : ""}`}>
          <h2 className={styles["block-item_title"]}>У вас уже есть аккаунт?</h2>
          <button className={styles["block-item_btn"]} onClick={handleSignIn}>Войти</button>
        </section>
        <section className={`${styles.block_item} ${styles["block-item"]} ${isSignUp ? styles.hidden : ""}`}>
          <h2 className={styles["block-item_title"]}>У вас нет аккаунта?</h2>
          <button className={styles["block-item_btn"]} onClick={handleSignUp}>Зарегистрироваться</button>
        </section>
      </div>

      <div className={`${styles.wrapper} ${isSignUp ? styles.active : ""}`}>
        {isSignIn && (
          <form onSubmit={handleLoginSubmit}>
            <h1>Логин</h1>

            <div className={styles["input-box"]}>
              <input
                type="text"
                name="login"
                placeholder="Логин"
                value={loginData.login}
                onChange={handleLoginChange}
                required
              />
              <i className='bx bx-user'></i>
              {errors.login && <span className={styles.error}>{errors.login}</span>}
            </div>

            <div className={styles["input-box"]}>
              <input
                type={showLoginPassword? "text":"password"}
                name="password"
                placeholder="Пароль"
                value={loginData.password}
                onChange={handleLoginChange}
                required
              />
                <i className={`bx ${showLoginPassword ? "bx-show" : "bx-hide"}`}
                  onClick={() => setShowLoginPassword(prev => !prev)}
                  style={{ cursor: "pointer" }}>
                </i>
              {errors.password && <span className={styles.error}>{errors.password}</span>}
            </div>

            <div className={styles.remember}>
              <a href="#">Забыл пароль</a>
            </div>

            {errors.submit && <div className={`${styles.error} ${styles["submit-error"]}`}>{errors.submit}</div>}

            <button type="submit" className={styles.btn}>Войти</button>
          </form>
        )}

        {isSignUp && (
          <form onSubmit={handleRegisterSubmit}>
            <h1>Регистрация</h1>

            <div className={styles["input-box"]}>
              <input
                type="text"
                name="login"
                placeholder="Логин"
                value={registerData.login}
                onChange={handleRegisterChange}
                required
              />
              <i className='bx bx-user'></i>
              {errors.login && <span className={styles.error}>{errors.login}</span>}
            </div>

            <div className={styles["input-box"]}>
              <input
                type="text"
                name="firstName"
                placeholder="Имя"
                value={registerData.firstName}
                onChange={handleRegisterChange}
                required
              />
              {errors.firstName && <span className={styles.error}>{errors.firstName}</span>}
            </div>

            <div className={styles["input-box"]}>
              <input
                type="text"
                name="lastName"
                placeholder="Фамилия"
                value={registerData.lastName}
                onChange={handleRegisterChange}
                required
              />
              {errors.lastName && <span className={styles.error}>{errors.lastName}</span>}
            </div>

            <div className={styles["input-box"]}>
              <input
                type="text"
                name="position"
                placeholder="Позиция"
                value={registerData.position}
                onChange={handleRegisterChange}
                required
              />
              <i class='bx  bx-briefcase-alt-2'    ></i> 
              {errors.position && <span className={styles.error}>{errors.position}</span>}
            </div>

            <div className={styles["input-box"]}>
              <input
                type="email"
                name="email"
                placeholder="Почта"
                value={registerData.email}
                onChange={handleRegisterChange}
                required
              />
              <i className='bx bx-envelope-open'></i>
              {errors.email && <span className={styles.error}>{errors.email}</span>}
            </div>

            <div className={styles["input-box"]}>
              <input
                type={showRegisterPassword ? "text" : "password"}
                name="password"
                placeholder="Пароль"
                value={registerData.password}
                onChange={handleRegisterChange}
                required
              />
                <i className={`bx ${showRegisterPassword ? "bx-show" : "bx-hide"}`}
                  onClick={() => setShowRegisterPassword(prev => !prev)}
                  style={{ cursor: "pointer" }}>
                </i>
              {errors.password && <span className={styles.error}>{errors.password}</span>}
            </div>

            <div className={styles["input-box"]}>
              <input
                type={showRegisterConfirmPassword ? "text" : "password"}
                name="confirmPassword"
                placeholder="Подтвердите пароль"
                value={registerData.confirmPassword}
                onChange={handleRegisterChange}
                required
              />
               <i className={`bx ${showRegisterConfirmPassword ? "bx-show" : "bx-hide"}`}
                  onClick={() => setShowRegisterConfirmPassword(prev => !prev)}
                  style={{ cursor: "pointer" }}>
                </i>
              {errors.confirmPassword && <span className={styles.error}>{errors.confirmPassword}</span>}
            </div>

            {errors.submit && <div className={`${styles.error} ${styles["submit-error"]}`}>{errors.submit}</div>}

            <button type="submit" className={styles.btn}>Регистрация</button>
          </form>
        )}
      </div>
    </article>
  </div>
);
};

export default AuthComponent;