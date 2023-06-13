import React, { useState } from "react";
import "./login_form_landlord.css"
import "bootstrap/dist/css/bootstrap.min.css";
import {Link} from 'react-router-dom';

const LoginFormLandlord = () => {

    return (
        <div className="page">
            <div className="cover">
                <h1 className="header">Welcome!</h1>
                <input type="text" placeholder="USERNAME" />
                <input type="password" placeholder="PASSWORD" />
                

                <div className="login-btn">LOGIN</div>
                <div className="sign-up">Don't have an account? <Link to="/pages/landlord_signup" className="sign-up-link">Sign up!</Link></div>
                <Link className="password-reset">forget password?</Link>

            </div>
        </div>

    
    )
}

export default LoginFormLandlord