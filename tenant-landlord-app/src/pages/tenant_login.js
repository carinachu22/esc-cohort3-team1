import React, { useState } from "react";
import LoginStyles from "../styles/login_form_tenant.module.css";
import PasswordStyles from "../styles/usePasswordToggle.module.css";
import "bootstrap/dist/css/bootstrap.min.css";
import {Link} from 'react-router-dom';
import {useNavigate} from 'react-router-dom';

const TenantLogin = () => {
    const navigate = useNavigate();

    const [passwordShown, setPasswordShown] = useState(false);

    const togglePassword = () => {
        //passwordShown = true if handler is invoked  
        setPasswordShown(!passwordShown)
      }
  
    const navigateToDashboard = () => {
      navigate('/pages/Dashboard');
    };

    return (
        <div className={LoginStyles.page}>
            <div className={LoginStyles.cover}>
                <h1 className={LoginStyles.header}>Welcome!</h1>
                <input type="text" className={LoginStyles.input} placeholder="EMAIL" />
                <div className={PasswordStyles.passwordToggle}>
                    <input 
                        type={passwordShown ? "text" : "password"} 
                        placeholder="PASSWORD"
                        className={PasswordStyles.passwordInput}
                    />
                    <span onClick={togglePassword}>
                        {passwordShown ? "Hide" : "Show"}
                    </span>
                </div>
                <div className={LoginStyles.login_btn} onClick={navigateToDashboard}>LOGIN</div>
                <Link className={LoginStyles.password_reset}>forget password?</Link>
            </div>
        </div>

    
    )
}

export default TenantLogin