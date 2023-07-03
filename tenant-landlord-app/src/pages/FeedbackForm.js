import React, { useState } from 'react';
import TextField from '@mui/material/TextField';
import Button from '@mui/material/Button';
import Rating from '@mui/material/Rating';
import Box from '@mui/material/Box';
import Typography from '@mui/material/Typography';
import { Navigate, useNavigate, useSearchParams } from 'react-router-dom';

import { useAuthUser, useAuthHeader } from 'react-auth-kit';
import {useFormik} from "formik";
import axios, {AxiosError} from "axios";

function FeedbackForm() {
    const [error, setError] = useState("");
    const token = useAuthHeader();
    const navigate = useNavigate();
    const [searchParams, setSearchParams] = useSearchParams();
    const ticketID = searchParams.get("ticketID");
    const onSubmit = values => {
        //event.preventDefault();  // prevent submission of default form
        /*alert(`Feedback: ${comment} Rating: ${rating}`); // popup after submission */
        APICloseTicket(values);
        navigate('/pages/dashboard');
    };

  
    const APICloseTicket = async (values) => {
    
    console.log(token())
    console.log("VALUES",values)
    setError("");

    try{
        const config = {
            headers: {
              Authorization: `${token()}`
            }
          };
        // NOTE: Backticks (`) are used here so ticketID can be evaluated
        const response = await axios.post(
            `http://localhost:5000/api/tenant/closeTicket/${ticketID}`,
            config,
            values
        )
        console.log("got response:")
        console.log(response);
        return response;

    } catch (err){
        if (err && err instanceof AxiosError) {
            setError(err.response);
        }
        else if (err && err instanceof Error){
            setError(err.message);
        }

        console.log("Error: ", err);
    }

    }

    const formik = useFormik({
        initialValues: {
            comment: "",
            rating: -1
        },
        onSubmit: event => onSubmit(event, formik.values.comment, formik.values.rating),
    });

  return (
    
    <Box display="flex" flexDirection="column" justifyContent="center" minHeight="100vh">
        {console.log(ticketID)};
      <form onSubmit={formik.handleSubmit}>
        <Box mb={2} sx={{ width: '50%', margin: '0 auto' }}>
          <Typography variant="h4" component="h1" align="center" gutterBottom>
            Please leave your feedback
          </Typography>
          <TextField
            label="Comment"
            multiline
            rows={4}
            variant="outlined"
            fullWidth
            value={formik.values.comment}
            onChange={formik.handleChange} // store user comment 
          />
        </Box>
        <Box display="flex" justifyContent="center" mt={2} mb={2}>
          <Rating
            name="rating"
            size="large"
            value={Number(formik.values.rating)}
            onChange={formik.handleChange} // store user rating
          />
        </Box>
        <Box display="flex" justifyContent="center" m={1} p={1}>
          <Button variant="contained" type="submit">Submit</Button>
        </Box>
      </form>
    </Box>
  );
}

export default FeedbackForm;
