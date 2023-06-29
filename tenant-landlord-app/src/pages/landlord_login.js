import React, { useState } from "react";
import LoginStyles from "../styles/login_form_landlord.module.css";
import PasswordStyles from "../styles/usePasswordToggle.module.css";
import "bootstrap/dist/css/bootstrap.min.css";
import {Link} from 'react-router-dom';
import {useNavigate} from 'react-router-dom';
import {useFormik} from "formik";
import axios, {AxiosError} from "axios";
import {useSignIn} from "react-auth-kit";

const LandlordLogin = () => {
    const navigate = useNavigate();
    const [error, setError] = useState("");
    const signIn = useSignIn();

    const [passwordShown, setPasswordShown] = useState(false);

    const togglePassword = () => {
        //passwordShown = true if handler is invoked  
        setPasswordShown(!passwordShown)
      }

    const onSubmit = async (values) => {
        console.log("Values: ", values);
        setError("");

        try{
            const response = await axios.post(
                "http://localhost:5000/api/landlord/login",
                values
            )
            console.log(response);
            signIn({
                token: response.data.token,
                expiresIn: 3600,
                tokenType: "Bearer",
                authState: {email: values.email}
            });
            if (response.data.message === "Login successfully"){
                navigateToDashboard();
            }
            else if (response.data.message === "Invalid email or password"){
                
            }


        } catch (err){
            if (err && err instanceof AxiosError) {
                setError(err.response?.data.message);
            }
            else if (err && err instanceof Error){
                setError(err.message);
            }

            console.log("Error: ", err);
        }
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

                <button className={LoginStyles.login_btn} type="submit" isLoading={formik.isSubmitting}>LOGIN</button>
                <div className={LoginStyles.sign_up}>Don't have an account? <Link to="/pages/landlord_signup" className={LoginStyles.sign_up_link}>Sign up!</Link></div>
                <Link className={LoginStyles.password_reset}>forget password?</Link>

            </form>
        </div>

    
    )
}

export default LandlordLogin