import React, { useState } from "react";
import "./login_form.css"

const LoginForm = () => {

    const [popupStyle, showPopup] = useState("hide")

    const popup = () => {
        showPopup("login-popup")
    }


    return (
        <div className="cover">
            <h1>LOGIN</h1>
            <input type="text" placeholder="USERNAME" />
            <input type="password" placeholder="PASSWORD" />

            <div className="login-btn" onClick={popup}>LOGIN</div>


        </div>
    )
}

export default LoginForm