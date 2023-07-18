import { Navigate } from 'react-router-dom';
import styles from "../styles/dashboard.module.css";

// Import React and hooks
import React, { useEffect, useState } from "react";
import { useAuthUser, useAuthHeader, useSignOut, useIsAuthenticated } from 'react-auth-kit';

// Import bootstrap for automatic styling
import "bootstrap/dist/css/bootstrap.min.css";

// Import axios for http requests
import axios, {AxiosError} from "axios";
import NavigationBar from '../components/NavigationBar';
import { Accordion, AccordionButton, AccordionItem, AccordionPanel, TableContainer, Table,
    Thead,
    Tbody,
    Tfoot,
    Tr,
    Th,
    Td,
    TableCaption,
Box, AccordionIcon, HStack, Button } from '@chakra-ui/react';

/**
Functional component to display service ticket list
Functionalities:
1. Fetch all service tickets dependent on user type (tenant or landlord)
2. Display all service tickets ID and status in a list on the left
3. Display selected service ticket details on the right when clicked 
**/
export default function TicketList() {
    // Initialise states and hooks
    const [error, setError] = useState("");
    const [tickets, setTickets] = useState(null);
    const [isLoading, setLoading] = useState(true);
    const token = useAuthHeader();
    const authenticated = useIsAuthenticated();
    const userDetails = useAuthUser();

    // Initialise function for 1. Fetch all service tickets dependent on user type (tenant or landlord)
    const GetServiceTickets = (userDetails) => {
        if (userDetails() == undefined){
            return;
        }
        const type = userDetails().type;
        const tickets = [];
        let response;
    
        // Initialse function for fetching ALL service tickets if landlord is logged in
        const APIGetTickets = async (type) => {
            setError("");
            //console.log('type',type)
            try{
                const config = {
                    headers: {
                      Authorization: `${token()}`
                    },
                    params: {
                        email: userDetails().email
                    }
                }
                if (type == 'landlord'){
                    response = await axios.get(
                        "http://localhost:5000/api/landlord/getTickets",
                        config
                    )
                } else if (type == 'tenant'){ 
                    response = await axios.get(
                        "http://localhost:5000/api/tenant/getTickets",
                        config
                    )
                }
                console.log("got response:")
                console.log(response);
                return response.data.data;
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


        // Initialise promise
        const test_tickets = APIGetTickets(type)
        // Wait for promise to be fulfilled (fetching tickets from database)
        test_tickets.then(function(result){
            //console.log('result',result)
            // Naive data validation
            if (result !== undefined){
                for (let i=0;i<result.length;i++){
                    tickets.push(result[i]);
                }
            }   
            //console.log('tickets',tickets)

            // Convert every ticket fetched to HTML to be shown on the left
            const tickets_html = tickets.map(ticket => 
                <>
                <AccordionItem>
                    <AccordionButton>
                        <HStack spacing='24px'>
                        <Box textAlign='left' mr='310'>
                        {ticket.service_request_id}
                        </Box>
                        <Box textAlign='left' mr='530'>
                        {ticket.email}
                        </Box>
                        <Box textAlign='left' mr='380'>
                        {ticket.request_type}
                        </Box>
                        <Box textAlign='left' mr='320'>
                        {ticket.status}
                        </Box>
                        </HStack>
                        <AccordionIcon />
                    </AccordionButton>
                    <AccordionPanel>
                        Service Request ID: {ticket.service_request_id} <br></br>
                        Lease ID: {ticket.lease_id} <br></br>
                        Submitted Date & Time: {ticket.submitted_date_time} <br></br>
                        Name: {ticket.name} <br></br>
                        Email: {ticket.email} <br></br>
                        Request Type: {ticket.request_type} <br></br>
                        Request Description: {ticket.request_description} <br></br>
                        Status: {ticket.status} <br></br>
                        Completed Date & Time: {ticket.completed_date_time} <br></br>
                        Feedback Comment: {ticket.feedback_text} <br></br>
                        Feedback Rating: {ticket.feedback_rating} <br></br>
                        <Button href={"/pages/FeedbackForm/?ticketID=" + ticket.service_request_id} bgColor='blue.500' color='white'>
                            Give Feedback & Close Ticket
                        </Button>
                        <br></br>
                        <Button onClick={() => navigate('/pages/ViewTicketPage/' + ticket.service_request_id)} bgColor='blue.500' color='white' _hover={{bg: 'blue.800'}}>
                            View Details & Actions
                        </Button>
                    </AccordionPanel>
                </AccordionItem>
                </>
            );


            // Update states to be accessed in return
            setTickets(tickets_html);
            setLoading(false);
        })
    }

    const authenticate = (() => {
        // Check if still autenticated based on react auth kit
        if (!authenticated()){
            console.log("Not authenticated, redirecting.")
            return <Navigate to="/"></Navigate>
        }
    })

    // This is to ensure that the GET request only happens once on page load
    // This will update the tickets state
    useEffect(() => {
        GetServiceTickets(userDetails);
        authenticate();},
        [])


    //console.log("Authenticated.")
    // Warning from react comes from the below block
    // This is because the number of hooks called before and after loading is different
    // If promise is not yet fulfilled, wait
    /*
    if (isLoading){
        return<div className="App">Loading...</div>;
    }*/
    return (
        <>
        {NavigationBar()}
        <TableContainer>
            <Table variant='simple'>
            <Thead>
                <Tr>
                    <Th> ID </Th>
                    <Th> Requester </Th>
                    <Th> Type </Th>
                    <Th> Status </Th>
                </Tr>
            </Thead>
            </Table>
        </TableContainer>
            <Accordion allowToggle>
                {tickets}
            </Accordion>
        </>
    )
}
