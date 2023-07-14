import React, { useState, Component } from "react";
import "bootstrap/dist/css/bootstrap.min.css";
import {Link} from 'react-router-dom';
import {useNavigate} from 'react-router-dom';
import {setIn, useFormik} from "formik";
import axios, {AxiosError} from "axios";
import {useSignIn} from "react-auth-kit";
import LoginForm from "../components/login_form";
import {
    Box,
    Button,
    Checkbox,
    Flex,
    FormControl,
    FormLabel,
    Input,
    InputGroup,
    InputRightElement,
    VStack,
    Heading,
    Center,
    Text,
    FormHelperText,
    FormErrorMessage,
} from "@chakra-ui/react";

const ForgotPasswordPage = () => {
    const [error, setError] = useState("");

    const validate = values => {
        let errors = {};
        
        if (!values.email){
            errors.email = "Required";
        } else if (!/^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,4}$/i.test(values.email)){
            errors.email = "Invalid email";
        }

        return errors;
    }



    const onSubmit = async (values) => {
        console.log("Values: ", values);
        setError("");

        try{
            const response = await axios.post(
                //api to be added
                "http://localhost:5000/api/landlord/forgot-password",
                values
            )
            console.log(response);

            if (response.data.message === "User does not exist!"){
                console.log(response.data.message);
                formik.errors.hasError = true;
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
  
    const formik = useFormik({
        initialValues: {
            email: "",
            hasError: false
        },
        onSubmit,
        validate
    });


    /////// code below uses Chakra styling ////////
    return (
        <Flex align="center" justify="center" h="100vh" w="100%">
            <Box w="22em" h="22em" p={8} rounded="md" position="relative" borderRadius="1em" boxShadow="0 0.188em 1.550em rgb(156, 156, 156)">
                <form onSubmit={formik.handleSubmit}>
                    <VStack align="flex-start" alignItems="center">
                        <Heading marginTop="4">Forgot Password</Heading>
                        <FormControl marginTop="6">
                            <Input
                                id="email" 
                                name="email"
                                type="email" 
                                variant="filled"
                                placeholder="Email"
                                value={formik.values.email}
                                onChange={formik.handleChange}
                            />
                            {formik.errors.email ? <Box color="red.500" marginBottom="-6">{formik.errors.email}</Box>: null}
                        </FormControl>
                        <FormControl marginTop="6" >
                            <Button 
                                id="sendButton"
                                type="submit" 
                                isLoading={formik.isSubmitting} 
                                backgroundColor="rgb(192, 17, 55)" 
                                width="full" 
                                textColor="white" 
                                variant="unstyled"
                                onClick={formik.onSubmit}
                                > 
                                Send Link
                            </Button>
                            {formik.errors.hasError ? <Box color="red.500" id="errorMessage" marginBottom="-6" >Invalid email or password</Box>: null}
                        </FormControl>
                        
                    </VStack>
                </form>
            </Box>
        </Flex>
    )
}

export default ForgotPasswordPage
