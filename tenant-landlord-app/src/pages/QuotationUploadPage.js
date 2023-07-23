import React, { useState, useRef, useContext } from "react";
import "bootstrap/dist/css/bootstrap.min.css";
import axios, {AxiosError} from "axios";
import {Helmet} from "react-helmet";
import { Worker, Viewer } from '@react-pdf-viewer/core'
import { PDFViewer, View } from '@react-pdf/renderer'
import ReactPDF from '@react-pdf/renderer';
import { useEffect } from "react";
import { Document, Page } from 'react-pdf';
import { Base64 } from 'js-base64';

import { useAuthHeader } from "react-auth-kit";

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


import { SelectedTicketContext } from '../components/SelectedTicketContext';
import { Navigate } from "react-router-dom";

import NavigationBar from "../components/NavigationBar";


const QuotationUpload = () => {
    //requires javascript to be within document.addEventListener("DOMContentLoaded", e => {}) 
    //to ensure html elements get loaded before javascript logic
    const [text,setText] = useState('')
    const [pdfUrl,setPdfUrl] = useState('')
    const {selectedTicket, setSelectedTicket} = useContext(SelectedTicketContext);
    const token = useAuthHeader();

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
        console.log(selectedTicket);
        const config = {
            headers: {
                Authorization: `${token()}`
            },
            params: {
                id: selectedTicket.id,
                responseType: "blob"
            }
        }
        fetch(`http://localhost:5000/api/landlord/getQuotation/?id=${selectedTicket.id}`,
        ) // Replace with the actual backend URL serving the PDF
          .then((response) => response.blob())
          .then((data) => {
            console.log('data',data)
            const pdfBlobUrl = URL.createObjectURL(data);
            setPdfUrl(pdfBlobUrl);
          })
          .catch((error) => {
            console.error(error);
            // Handle error
          })
    }

    function readFile(input){
        const fr = new FileReader();
        fr.readAsDataURL(input);
        fr.addEventListener('load', () => {
            const res = fr.result;
            //console.log(res);
        })
    }


    // useEffect(() => {
    //     fetch(`http://localhost:5000/api/landlord/getQuotation/?id=${selectedTicket.id}`,
    //     ) // Replace with the actual backend URL serving the PDF
    //       .then((response) => response.blob())
    //       .then((data) => {
    //         console.log('data',data)
    //         const pdfBlobUrl = URL.createObjectURL(data);
    //         setPdfUrl(pdfBlobUrl);
    //       })
    //       .catch((error) => {
    //         console.error(error);
    //         // Handle error
    //       });
    //   }, []);

    ///// code below uses Chakra styling ////////
    return (
        <>
        {NavigationBar()}
        <Flex align="center" justify="center" h="100vh" w="100%">
        <Helmet>
            <meta charSet="utf-8"/>
            {/* <meta http-equiv="Content-Security-Policy" content="default-src *; style-src 'self' 'unsafe-inline'; script-src 'self' 'unsafe-inline' 'unsafe-eval' http://www.google.com"/> */}
            <meta name="viewport" content="'width=device-width, initial-scale=1.0"/>
        </Helmet>
        <Box w="22em" h="30em" p={8} rounded="md" position="relative" borderRadius="1em" boxShadow="0 0.188em 1.550em rgb(156, 156, 156)">
            <form target="_blank" action={`http://localhost:5000/api/landlord/uploadQuotation/${selectedTicket.id}`} id="form" method="POST" encType="multipart/form-data">
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
            <Box>
                {pdfUrl && <iframe src={pdfUrl} width="100%" height="600px" />}
            </Box>
        </Box>
    </Flex>
    </>
    )
}



export default QuotationUpload