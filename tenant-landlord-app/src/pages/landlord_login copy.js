import React, { useState } from "react";
import LoginStyles from "../styles/login_form_landlord.module.css";
import PasswordStyles from "../styles/usePasswordToggle.module.css";
import "bootstrap/dist/css/bootstrap.min.css";
import {Link} from 'react-router-dom';
import {useNavigate} from 'react-router-dom';
import {useFormik} from "formik";

const LandlordLogin = () => {
    const navigate = useNavigate();
    const [error, setError] = useState("");

    const [passwordShown, setPasswordShown] = useState(false);

    const togglePassword = () => {
        //passwordShown = true if handler is invoked  
        setPasswordShown(!passwordShown)
      }

    const onSubmit = async (values) => {
        console.log("Values: ", values);

        //api to be added

    }
  
    const navigateToDashboard = () => {
      navigate('/pages/Dashboard');
    };

    const formik = useFormik({
        initialValues: {
            email: "",
            password: "",
        },
        onSubmit,
    });

    return (
        <div className={LoginStyles.page}>
            <form className={LoginStyles.cover} onSubmit={formik.handleSubmit}>
                <h1 className={LoginStyles.header}>Welcome!</h1>
                <input 
                    name="email"
                    type="email" 
                    className={LoginStyles.input} 
                    placeholder="EMAIL" 
                    value={formik.values.email}
                    onChange={formik.handleChange}
                    />
                <div className={PasswordStyles.passwordToggle}>
                    <input
                        name="password" 
                        type={passwordShown ? "text" : "password"} 
                        placeholder="PASSWORD"
                        className={PasswordStyles.passwordInput}
                        value={formik.values.password}
                        onChange={formik.handleChange}
                    />
                    <span onClick={togglePassword}>
                        {passwordShown ? "Hide" : "Show"}
                    </span>
                </div>

                <div className={LoginStyles.login_btn} onClick={navigateToDashboard} isLoading={formik.isSubmitting}>LOGIN</div>
                <div className={LoginStyles.sign_up}>Don't have an account? <Link to="/pages/landlord_signup" className={LoginStyles.sign_up_link}>Sign up!</Link></div>
                <Link className={LoginStyles.password_reset}>forget password?</Link>

            </form>
        </div>

    
    )
}

export default LandlordLogin