import React, { useState } from "react";
import styles from "../../styles/login_form_tenant.module.css";
import "bootstrap/dist/css/bootstrap.min.css";
import {Link} from 'react-router-dom';

const LoginFormTenant = () => {

    return (
        <div className={styles.page}>
            <div className={styles.cover}>
                <h1 className={styles.header}>Welcome!</h1>
                <input type="text" placeholder="USERNAME" />
                <input type="password" placeholder="PASSWORD" />

                <div className={styles.login_btn}>LOGIN</div>
                <div className={styles.sign_up}>Don't have an account? <Link to="/pages/tenant_signup" className={styles.sign_up_link}>Sign up!</Link></div>
                <Link className={styles.password_reset}>forget password?</Link>
            </div>
        </div>

    
    )
}

export default LoginFormTenant