import React, { useState, useRef, useContext } from "react";
import "bootstrap/dist/css/bootstrap.min.css";
import axios, { AxiosError } from "axios";
import { Helmet } from "react-helmet";
import { Formik, Form, Field } from 'formik'; // Import Formik components

// Import React and hooks
import { useAuthUser, useAuthHeader, useSignOut, useIsAuthenticated } from 'react-auth-kit';

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
    const [text, setText] = useState('');
    const [pdfUrl, setPdfUrl] = useState('');
    const token = useAuthHeader();
    const navigate = useNavigate();
    const toast = useToast();
    const userDetails = useAuthUser();

    const location = useLocation();
    const { tenantID } = location.state;
    console.log("tenantID: ", tenantID);

    const navigateToViewLeasePage = (tenantID) => {
        navigate('/pages/ViewLeasePage/', { state: { tenantID } } );
    }

    const config = {
        headers: {
          Authorization: `${token()}`
        },
        params: {
            email: userDetails().email,
        }
      }


    return (
        <>
        {NavigationBar()}
        <Flex align="center" justify="center" h="100vh" w="100%">
            <Helmet>
            {/* ... Your Helmet content ... */}
            </Helmet>
            <Box w="30em" h="40em" p={8} rounded="md" position="relative" borderRadius="1em" boxShadow="0 0.188em 1.550em rgb(156, 156, 156)" >
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
            >
                {({ handleSubmit, setFieldValue }) => ( // Use Formik's handleSubmit and setFieldValue
                <Form target="_blank" action={`http://localhost:5000/api/landlord/createLease/`} method="POST" encType="multipart/form-data">
                    <VStack align="flex-start" alignItems="center">
                    <Heading marginTop="4">Lease Upload</Heading>
                    <Form >
                        <FormControl marginTop="6" alignItems="center" >
                            <Field
                                id="floor" 
                                name="floor"
                                type="text" 
                                variant="filled"
                                placeholder="Floor"
                            />
                        </FormControl>
                        <FormControl marginTop="6">
                            <Field
                                id="unit_number" 
                                name="unit_number"
                                type="text" 
                                variant="filled"
                                placeholder="Unit Number"
                            />
                        </FormControl>
                    </Form>

                    <FormControl marginTop="6">
                        <Input
                        id="files"
                        name="files"
                        type="file"
                        variant="filled"
                        placeholder="Upload Lease"
                        accept=".pdf"
                        onChange={(event) => setFieldValue("files", event.currentTarget.files[0])} // Update form values using setFieldValue
                        />
                    </FormControl>
                    <FormControl marginTop="6" >
                        <Button
                        id="UploadButton"
                        type="submit"
                        backgroundColor="rgb(192, 17, 55)"
                        width="full"
                        textColor="white"
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