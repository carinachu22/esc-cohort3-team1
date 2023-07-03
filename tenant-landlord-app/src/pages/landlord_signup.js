import React, { useState } from "react";
import SignupStyles from "../styles/signup_form_landlord.module.css";
import PasswordStyles from "../styles/usePasswordToggle.module.css";
import "bootstrap/dist/css/bootstrap.min.css";
import {useNavigate} from 'react-router-dom';
import {useFormik} from "formik";
import axios, {AxiosError} from "axios";
import {useSignIn} from "react-auth-kit";

const LandlordSignup = () => {
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
            "http://localhost:5000/api/landlord/create",
            values
        )
        console.log(response);
        signIn({
            token: response.data.token,
            expiresIn: 3600,
            tokenType: "Bearer",
            authState: {email: values.email}
        });
        if (response.data.message === "created successfully"){
            navigateToDashboard();
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
        ticket_type: ""
    },
    onSubmit,
  });

  return (
      <div className={SignupStyles.page}>
          <form className={SignupStyles.cover} onSubmit={formik.handleSubmit}>
              <h1 className={SignupStyles.header}>Register</h1>
              <div className={SignupStyles.context}>sign up as a landlord</div>
              <input
                name="email" 
                type="email" 
                className={SignupStyles.input} 
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
              <input 
                name="ticket_type"
                type="text" 
                className={SignupStyles.input} 
                placeholder="TICKET TYPE" 
                value={formik.values.ticket_type}
                onChange={formik.handleChange}
              />
              <button className={SignupStyles.next_btn} type="submit" isLoading={formik.isSubmitting}>FINISH</button>


          </form>
      </div>

  
  )
}

export default LandlordSignup