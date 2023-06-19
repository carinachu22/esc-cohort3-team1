import React, { useState } from "react";
import styles from "../styles/usePasswordToggle.module.css";
import "bootstrap/dist/css/bootstrap.min.css";

const UsePasswordToggle = () => {
    const [passwordShown, setPasswordShown] = useState(false);

    const togglePassword = () => {
        //passwordShown = true if handler is invoked  
        setPasswordShown(!passwordShown)
      }
    return (
        <div className={styles.passwordToggle}>
            <input 
                type={passwordShown ? "text" : "password"} 
                placeholder="PASSWORD"
                className={styles.passwordInput}
            />
            <span onClick={togglePassword}>
                {passwordShown ? "Hide" : "Show"}
            </span>
        </div>
    )
}


export default UsePasswordToggle