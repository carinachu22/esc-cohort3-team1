import React from 'react';
import { Document, Page, pdfjs } from 'react-pdf';
import { Box, Button, useToast, Heading } from '@chakra-ui/react';
import { ArrowBackIcon } from '@chakra-ui/icons';
import { useNavigate } from 'react-router-dom';

import NavigationBar from './NavigationBar';

pdfjs.GlobalWorkerOptions.workerSrc = `//cdnjs.cloudflare.com/ajax/libs/pdf.js/${pdfjs.version}/pdf.worker.min.js`;

function QuotationPage() {
    const ticketName = "Ticket 1"; // placeholder
    const navigate = useNavigate();
    const toast = useToast();

    const handleApprove = () => {
        toast({
        title: "Quotation approved.",
        description: "You have approved the quotation.",
        status: "success",
        duration: 5000,
        isClosable: true,
        position: "top",
        });
    };

    const handleReject = () => {
        toast({
        title: "Quotation rejected.",
        description: "You have rejected the quotation.",
        status: "error",
        duration: 5000,
        isClosable: true,
        position: "top",
        });
    };

    return (
        <>
        <NavigationBar />
        <Box p={10} bg="#EDF2F7" borderRadius="md" boxShadow="lg" mr = "10%" ml="10%">
            <Heading mb={5} textAlign="center">Job Quote for Ticket: {ticketName}</Heading>
            <Box display="flex" flexDirection="column" justifyContent="center" minHeight="50vh">
            <Document file="/lab7.pdf">
                <Page pageNumber={1} />
            </Document>
            <Box display="flex" justifyContent="space-around" m={1} p={1}>
                <Button leftIcon={<ArrowBackIcon />} colorScheme="teal" variant="outline" onClick={() => navigate(-1)}>
                Back
                </Button>
                <Button colorScheme="red" onClick={handleReject}>Reject</Button>
                <Button colorScheme="green" onClick={handleApprove}>Approve</Button>
            </Box>
            </Box>
        </Box>
        </>
    );
}

export default QuotationPage;
