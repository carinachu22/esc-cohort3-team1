import React, { useEffect, useState } from 'react';
import { Box, Button, useToast, Heading, Checkbox } from '@chakra-ui/react';
import { ArrowBackIcon } from '@chakra-ui/icons';
import { useNavigate, useLocation } from 'react-router-dom';

import NavigationBar from '../components/NavigationBar.js';
import axios from 'axios';
import { useAuthHeader, useIsAuthenticated, useAuthUser } from 'react-auth-kit';


function QuotationPage() {
    const [pdfUrl,setPdfUrl] = useState('')
    const [isCheckboxChecked, setCheckboxChecked] = useState(false); 
    const navigate = useNavigate();
    const toast = useToast();
    const token = useAuthHeader();
    const userDetails = useAuthUser();
    const location = useLocation();
    var ticketID;
    var status;
    if (location.state != null){
      ticketID = location.state.ticketID;
      status = location.state.status;
    }
    console.log('ID', ticketID)
    console.log('status', status)

    const navigateToViewTicketPage =  (ticketID) => {
        navigate('/pages/ViewTicketPage/', { state: { ticketID } } );
      }
    const authenticated = useIsAuthenticated();

    const handleApprove = () => {
        const config = {
            headers: {
              Authorization: `${token()}`
            }
        }
        const values = {
            quotation_accepted_by_tenant: 1,
            ticket_id : ticketID
        }
        toast({
        title: "Quotation approved.",
        description: "You have approved the quotation.",
        status: "success",
        duration: 5000,
        isClosable: true,
        position: "top",
        });
        axios.patch(
            `http://localhost:5000/api/tenant/quotationApproval/`,
            values,
            config
        )
        navigateToViewTicketPage(ticketID)
    };

    const handleReject = () => {
        const config = {
            headers: {
              Authorization: `${token()}`
            }
        }
        const values = {
            quotation_accepted_by_tenant: 0,
            ticket_id : ticketID
        }
        toast({
        title: "Quotation rejected.",
        description: "You have rejected the quotation.",
        status: "error",
        duration: 5000,
        isClosable: true,
        position: "top",
        });
        axios.patch(
            `http://localhost:5000/api/tenant/quotationApproval/`,
            values,
            config
        )
        navigate('/pages/ViewTicketPage')
    };

    useEffect(() => {
        if (authenticate()){
            const encodedticketID = encodeURIComponent(ticketID);
            if (userDetails().type === 'tenant') {
                fetch(`http://localhost:5000/api/tenant/getQuotation/?id=${encodedticketID}`,{
                    headers:{
                    Authorization: `${token()}`
                    }
                }
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
                });
            } else {
                fetch(`http://localhost:5000/api/landlord/getQuotation/?id=${encodedticketID}`,{
                    headers:{
                    Authorization: `${token()}`
                }})
                .then((response) => response.blob())
                .then((data) => {
                    console.log('data',data)
                    const pdfBlobUrl = URL.createObjectURL(data);
                    setPdfUrl(pdfBlobUrl);
                })
                .catch((error) => {
                    console.error(error);
                })
            }
        }
    }, []);
    // Ensure that user is authenticated for all renders
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
    useEffect(() => {
        authenticate()
    })

    return (
        <>
        {NavigationBar()}
        <Box p={10} bg="#EDF2F7" borderRadius="md" boxShadow="lg" mr = "10%" ml="10%">
            <Heading mb={5} textAlign="center">Job Quote for Ticket: {ticketID}</Heading>
            <Box display="flex" flexDirection="column" justifyContent="center" minHeight="50vh">
                {pdfUrl && <iframe src={pdfUrl} width="100%" height="600px" />}
                {/* Only allow tenant to approve or reject if ticket is at this status */}
                {status === 'landlord_quotation_sent' && userDetails().type === 'tenant' ? (
                <>
                    <Checkbox id="quotationCheckbox" isChecked={isCheckboxChecked} onChange={(e) => setCheckboxChecked(e.target.checked)}>
                        I have read and agree to the terms 
                    </Checkbox>
                    <Box display="flex" justifyContent="space-around" m={1} p={1}>
                        <Button leftIcon={<ArrowBackIcon />} colorScheme="teal" variant="outline" onClick={() => navigate(-1)}>
                        Back
                        </Button>
                        <Button colorScheme="red" onClick={handleReject}>Reject</Button>
                        <Button colorScheme="green" onClick={handleApprove} isDisabled={!isCheckboxChecked}>Approve</Button>
                    </Box>
                </>
                ): <></>}
            </Box>
        </Box>
        </>
    );
}

export default QuotationPage;