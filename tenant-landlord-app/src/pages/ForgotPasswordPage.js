import React from "react";
import { useFormik } from "formik";
import axios, {AxiosError} from "axios";
import { Navigate, useLocation, useNavigate } from "react-router-dom";

import {
    Box,
    Button,
    Flex,
    FormControl,
    Input,
    VStack,
    Heading,
} from "@chakra-ui/react";

const ForgotPasswordPage = () => {
    const location = useLocation();
    const { role } = location.state.state;
    const navigate = useNavigate();
    console.log(role);

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
        try{
            var response
            if(role === "landlord"){
                response = await axios.post(
                    //api to be added
                    "http://localhost:5000/api/landlord/forgot-password",
                    values
                )
                if (response.data.message === "User does not exist!"){
                    console.log(response.data.message);
                    formik.errors.hasError = true;
                }
            }
            if(role === "tenant"){
                response = await axios.post(
                    //api to be added
                    "http://localhost:5000/api/tenant/forgot-password",
                    values
                )
                console.log(response)
                if (response.data.message === "User does not exist!"){
                    console.log(response.data.message);
                    formik.errors.hasError = true;
                }
            }
            if(role === "admin"){
                response = await axios.post(
                    //api to be added
                    "http://localhost:5000/api/admin/forgot-password",
                    values
                )
                if (response.data.message === "User does not exist!"){
                    console.log(response.data.message);
                    formik.errors.hasError = true;
                }
            }
            if (response.data.success === 1) {
                navigate('/')
            }

        } catch (err){
            if (err && err instanceof AxiosError) {
                console.log("Error: ", err);
            }
            else if (err && err instanceof Error){
                console.log("Error: ", err);
            }
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
                            {formik.errors.hasError ? <Box color="red.500" id="errorMessage" marginBottom="-6" >User does not exist!</Box>: null}
                        </FormControl>
                        
                    </VStack>
                </form>
            </Box>
        </Flex>
    )
}

export default ForgotPasswordPage
