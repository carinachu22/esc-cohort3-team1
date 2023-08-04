import React, { useState, useEffect } from "react";
import "bootstrap/dist/css/bootstrap.min.css";
import axios, { AxiosError } from "axios";
import { Helmet } from "react-helmet";
import { Formik, Form, Field, ErrorMessage  } from 'formik'; // Import Formik components
import * as Yup from 'yup';

// Import React and hooks
import { useAuthUser, useAuthHeader, useIsAuthenticated } from 'react-auth-kit';

import {
    Box,
    Button,
    Flex,
    FormControl,
    FormLabel,
    Input,
    VStack,
    Heading,
    useToast
} from "@chakra-ui/react";

import { useNavigate , useLocation } from 'react-router-dom';

import NavigationBar from "../components/NavigationBar.js";

const LeaseUpload = () => {
    const [pdfUrl, setPdfUrl] = useState('');
    const token = useAuthHeader();
    const navigate = useNavigate();
    const toast = useToast();
    const userDetails = useAuthUser();
    const authenticated = useIsAuthenticated();

    const location = useLocation();
    var tenantID;
    if (location.state != null){
      tenantID = location.state.tenantID;
    }
    console.log("tenantID: ", tenantID);

    const navigateToViewLeasePage = (tenantID) => {
        navigate('/pages/ViewLeasePage/', { state: { tenantID } } );
    }

    

    const validationSchema = Yup.object().shape({
        floor: Yup.string().required('Floor is required.'),
        unit_number: Yup.string().required('Unit number is required.'),
      });
      

    var config
    if (authenticated()){
        config = {
            headers: {
            Authorization: `${token()}`
            },
            params: {
                email: userDetails().email,
            }
        }
    }


      const authenticate = () => {
        // Check if still autenticated based on react auth kit
        if (!authenticated()){
            console.log("Not authenticated, redirecting.")
            navigate('/')
            return false
        } else {
            return true
        }
    }
    // Ensure that user is authenticated for all renders
    useEffect(() => {
        authenticate()
    })

    return (
        <>
        {NavigationBar()}
        <Flex justify="center" h="100vh" w="100%" >
            <Helmet>
            {/* ... Your Helmet content ... */}
            </Helmet>
            <Box w="30em" h="35em" p={8} rounded="md" position="relative" borderRadius="1em" boxShadow="0 0.188em 1.550em rgb(156, 156, 156)" marginTop="8em">
            <Formik
                initialValues={{ files: null, floor: "", unit_number: "", landlordEmail: config.params.email, tenantID: tenantID}} // Set initial value
                
                onSubmit={async (values) => { // Handle form submission
                    const formData = new FormData();
                    formData.append("files", values.files);
                    formData.append("floor", values.floor);
                    formData.append("unit_number", values.unit_number);
                    formData.append("landlordEmail", values.landlordEmail);
                    formData.append("tenantID", values.tenantID);
                    try {
                        const response = await axios.post(
                            `http://localhost:5000/api/landlord/createLease/`,
                            formData,
                            {
                                params: { 'api-version': '3.0' },
                                headers: {
                                "Content-Type": "multipart/form-data",
                                Authorization: `${token()}`
                                },
                            }
                        );
                        console.log('lease upload response',response);
                        navigateToViewLeasePage(tenantID);
                        toast({
                            title: "Lease Uploaded",
                            description: "Lease has been uploaded!.",
                            status: "success",
                            duration: 5000,
                            isClosable: true,
                            position: "top",
                            })
                    } catch (error) {
                        console.error(error);
                    }
                }}
                validationSchema={validationSchema}
            >
                {({ handleSubmit, setFieldValue }) => ( // Use Formik's handleSubmit and setFieldValue
                <Form target="_blank" action={`http://localhost:5000/api/landlord/createLease/`} method="POST" encType="multipart/form-data">
                    <VStack align="flex-start" alignItems="center">
                    <Heading marginTop="4">Lease Upload</Heading>
                    <Form>
                        <FormControl marginTop="1em" alignItems="center" width="26em">
                            <FormLabel >
                                Floor *
                            </FormLabel>
                            <Field 
                                as={Input}
                                id="floor" 
                                name="floor"
                                type="text" 
                                variant="filled"
                            />

                            <ErrorMessage name="floor" component="div" style={{ color: 'red' }} />
                        </FormControl>
                        <FormControl marginTop="1em">
                            <FormLabel>
                                Unit Number *
                            </FormLabel>
                            <Field
                                as={Input}
                                id="unit_number" 
                                name="unit_number"
                                type="text" 
                                variant="filled"
                            />
                            <ErrorMessage name="unit_number" component="div" style={{ color: 'red' }} />
                        </FormControl>
                    </Form>
                    <FormControl marginTop="1em">
                        <FormLabel>
                            File Upload 
                        </FormLabel>
                        <Input
                        id="files"
                        name="files"
                        type="file"
                        variant="filled"
                        placeholder="Upload Lease"
                        accept=".pdf"
                        p={1}
                        onChange={(event) => setFieldValue("files", event.currentTarget.files[0])} // Update form values using setFieldValue
                        />
                    </FormControl>
                    <FormControl marginTop="3em">
                        <Button
                        id="UploadButton"
                        type="submit"
                        backgroundColor="rgb(192, 17, 55)"
                        width="10em"
                        textColor="white"
                        marginStart="8em"
                        variant="unstyled"
                        >
                        Upload Lease
                        </Button>
                    </FormControl>
                    </VStack>
                </Form>
                )}
            </Formik>
            <Box>
                {pdfUrl && <iframe src={pdfUrl} width="100%" height="600px" />}
            </Box>
            </Box>
        </Flex>
        </>
    )
}

export default LeaseUpload;