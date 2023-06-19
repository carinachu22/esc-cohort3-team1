import React, { useState } from "react";
import styles from "../../styles/login_form_tenant.module.css";
import "bootstrap/dist/css/bootstrap.min.css";
import {Link} from 'react-router-dom';
import UsePasswordToggle from "../../hooks/usePasswordToggle";
import {useNavigate} from 'react-router-dom';

const LoginFormTenant = () => {
    const navigate = useNavigate();
  
    const navigateToDashboard = () => {
      navigate('/pages/Dashboard');
    };

    return (
        <div className={styles.page}>
            <div className={styles.cover}>
                <h1 className={styles.header}>Welcome!</h1>
                <input type="text" className={styles.input} placeholder="USERNAME" />
                <UsePasswordToggle />

                <div className={styles.login_btn} onClick={navigateToDashboard}>LOGIN</div>
                <Link className={styles.password_reset}>forget password?</Link>
            </div>
        </div>

    
    )
}

export default LoginFormTenant