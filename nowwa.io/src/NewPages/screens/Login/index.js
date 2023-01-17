import React, { useState, useEffect, useContext } from "react";
import cn from "classnames";
import styles from "./Login.module.sass";
import ArrowBackIcon from "@mui/icons-material/ArrowBack";
import { ConquerContext } from "../../contexts/ConquerContext";

const Login = ({ }) => {
  const { loggedin, login } = useContext(ConquerContext)
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState(null);
  useEffect(() => {
    if (loggedin) goHome();
  }, [loggedin])


  const goHome = async () => {
    window.location.href = "/";
  };
  function isValidEmail(email) {
    return /\S+@\S+\.\S+/.test(email);
  }

  const onClickLogin = async () => {
    if (!isValidEmail(email)) {
      setError("Email is invalid");
      return;
    } else {
      setError(null);
    }

    await login(email, password);

    // axios
    //   .post("https://nowwa.io/authLogin", {
    //     email: email,
    //     password: password,
    //   })
    //   .then((response) => {
    //     var result = response.data;
    //     if (result.success) {
    //       onSuccessLogin();
    //     } else {
    //       alert(`Failed: ${result.error}`);
    //     }
    //   });
  };

  return (
    <div className={styles.login}>
      <button className={cn("button-stroke")} onClick={goHome}>
        <ArrowBackIcon />
      </button>
      <div className={styles.login__column}>
        <div className={styles.login__title}>Log In</div>
        <div className={styles.login__inputbox}>
          <input
            type="email"
            placeholder="Email"
            className={styles.input}
            value={email}
            onChange={(e) => setEmail(e.target.value)}
          />
          {error && <p style={{ color: "red" }}>{error}</p>}
          <input
            type="password"
            placeholder="Password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
          />
        </div>
        <div className={styles.login__btn}>
          <button
            className={cn("button-stroke", styles.button)}
            onClick={onClickLogin}
          >
            Login
          </button>
        </div>
      </div>
    </div>
  );
};

export default Login;
