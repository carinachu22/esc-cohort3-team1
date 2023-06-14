import React, { useState } from "react";
import styles from "../../styles/signup_form_landlord.module.css";
import "bootstrap/dist/css/bootstrap.min.css";
import {Link} from 'react-router-dom';

const SignupLandlord = () => {

    return (
        <div className={styles.page}>
            <div className={styles.cover}>
                <h1 className={styles.header}>Register</h1>
                <div className={styles.context}>sign up as a landlord</div>
                <input type="text" placeholder="USERNAME" />
                <input type="email" placeholder="EMAIL" />
                <input type="text" placeholder="ORGANISATION" />
                <input type="password" placeholder="PASSWORD" />
                

                <div className={styles.next_btn}>NEXT</div>


            </div>
        </div>

    
    )
}

export default SignupLandlord