import React, { useState, useRef } from "react";
import "bootstrap/dist/css/bootstrap.min.css";
import axios, {AxiosError} from "axios";
import {Helmet} from "react-helmet";
import { Document, Page, pdfjs } from 'react-pdf';



import {
    Box,
    Button,
    Flex,
    FormControl,
    FormLabel,
    Input,
    VStack,
    Heading,

} from "@chakra-ui/react";


const QuotationUpload = () => {
    //requires javascript to be within document.addEventListener("DOMContentLoaded", e => {}) 
    //to ensure html elements get loaded before javascript logic
    document.addEventListener("DOMContentLoaded", e => {
        
        console.log(e)
        console.log("domLoaded")
        const form = document.getElementById('form')

        form.addEventListener('submit', async function(e) {
            e.preventDefault();
    
            const files = document.getElementById("files");
            console.log(files.files[0])
            const formData = new FormData();
            formData.append("files", files.files[0]);
            
            console.log([formData]);
    
            axios
                .post(
                    'http://localhost:5000/api/landlord/uploadQuotation/',
                    formData,
                    {
                        params: { 'api-version': '3.0' },
                        headers: {
                            "Content-Type": "multipart/form-data"
                        },
                    }
                )
                .then(function (response) {
                    console.log(response);
                })
                .catch(function (error) {
                    console.error(error);
                }); 

        })

    }, {once: true});





    const retrieveFile = () => {
        axios
        .get(
            'http://localhost:5000/api/landlord/getQuotation/',
            {responseType: "blob"}
            
        )
        .then((function (response){
            var file = response.data;
            console.log(file);
            readFile(file);
        }))
        .catch(err => console.log(err))
    }

    function readFile(input){
        const fr = new FileReader();
        fr.readAsDataURL(input);
        fr.addEventListener('load', () => {
            const res = fr.result;
            console.log(res);
        })
    }





    ///// code below uses Chakra styling ////////
    return (
        <Flex align="center" justify="center" h="100vh" w="100%">
            <Helmet>
                <meta charSet="utf-8"/>
                <meta http-equiv="Content-Security-Policy" content="default-src *; style-src 'self' 'unsafe-inline'; script-src 'self' 'unsafe-inline' 'unsafe-eval' http://www.google.com"/>
                <meta name="viewport" content="'width=device-width, initial-scale=1.0"/>
            </Helmet>
            <Box w="22em" h="30em" p={8} rounded="md" position="relative" borderRadius="1em" boxShadow="0 0.188em 1.550em rgb(156, 156, 156)">
                <form action="/uploadQuotation/" id="form" method="POST" encType="multipart/form-data">
                    <VStack align="flex-start" alignItems="center">
                        <Heading marginTop="4">Quotation Upload</Heading>
                        <FormControl marginTop="6">
                            <Input
                                id="files" 
                                name="files"
                                type="file" 
                                variant="filled"
                                placeholder="Upload Quotation"
                                accept=".pdf"
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
                                Upload Quotation
                            </Button>
                        </FormControl>
                        
                    </VStack>
                </form>
                <Button 
                    id="GetButton"
                    type="submit"
                    backgroundColor="rgb(192, 17, 55)" 
                    width="full" 
                    textColor="white" 
                    variant="unstyled"
                    onClick={retrieveFile}
                    > 
                    Get Quotation
                </Button>
                <Document file={"http://localhost:3000/uploads/1689667861898-combinepdf-1.pdf"}>
                    <Page pageNumber={1} />
                </Document>



            </Box>
        </Flex>
    )
}



export default QuotationUpload