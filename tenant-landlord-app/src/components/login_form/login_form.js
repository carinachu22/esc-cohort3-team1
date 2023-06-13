import React, { useState } from "react";
import "./login_form.css"
import Button from "react-bootstrap/Button";
import "bootstrap/dist/css/bootstrap.min.css";

const LoginForm = () => {

    return (
        <div className="page">
            <div className="cover">
                <h1>Welcome!</h1>
                <input type="text" placeholder="USERNAME" />
                <input type="password" placeholder="PASSWORD" />

                <div className="login-btn">LOGIN</div>
            </div>
        </div>

    
    )
}

export default LoginForm