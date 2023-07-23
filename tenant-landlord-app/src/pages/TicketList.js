import { useNavigate, Navigate } from 'react-router-dom';
import styles from "../styles/dashboard.module.css";

// Import React and hooks
import React, { useEffect, useState, useContext } from "react";
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
Box, AccordionIcon, HStack, Button,
    Step,
    StepDescription,
    StepIcon,
    StepIndicator,
    StepNumber,
    StepSeparator,
    StepStatus,
    StepTitle,
    Stepper,
    useSteps,
  } from '@chakra-ui/react';
import { SelectedTicketContext } from '../components/SelectedTicketContext';

/**
Functional component to display service ticket list
Functionalities:
1. Fetch all service tickets dependent on user type (tenant or landlord)
2. Display all service tickets ID and status in a list on the left
3. Display selected service ticket details on the right when clicked 
**/
export default function TicketList() {
    // Initialise states and hooks
    const navigate = useNavigate();
    const [error, setError] = useState("");
    const [tickets, setTickets] = useState(null);
    const [isLoading, setLoading] = useState(true);
    const token = useAuthHeader();
    const authenticated = useIsAuthenticated();
    const userDetails = useAuthUser();
    const {selectedTicket, setSelectedTicket} = useContext(SelectedTicketContext);

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

        const checkStep = (status) => {
            const step_1 = ['tenant_ticket_created','landlord_quotation_sent', 'ticket_quotation_rejected']
            const step_2 = ['landlord_quotation_approved', 'landlord_started_work']
            const step_3 = ['landlord_completed_work']
            const step_4 = ['landlord_ticket_closed']
            if (step_1.includes(status)){
                return 1
            }
            else if (step_2.includes(status)){
                return 2
            }
            else if (step_3.includes(status)){
                return 3
            }
            else {
                return 4
            }
        }

        const convertStatus = (status) => {
            console.log('status?',status)
            if (status === 'tenant_ticket_created'){
                return 'Created'
            } else if (status === 'landlord_ticket_rejected'){
                return 'Rejected By Landlord'
            } else if (status === 'landlord_ticket_approved'){
                return 'Approved By Landlord'
            } else if (status === 'landlord_quotation_sent'){
                return 'Quotation Sent By Landlord'
            } else if (status === 'ticket_quotation_approved'){
                return 'Quotation Approved By Tenant'
            } else if (status === 'ticket_quotation_rejected'){
                return 'Quotation Rejected By Tenant'
            } else if (status === 'landlord_started_work'){
                return 'Work Started By Landlord'
            } else if (status === 'landlord_completed_work'){
                return 'Work Completed By Landlord'
            } else if (status === 'landlord_ticket_closed'){
                return "Closed"
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

            const steps = [
                { title: 'Created'},
                { title: 'Quotation Approved'},
                { title: 'Work Completed'},
                { title: 'Closed'}
              ]

            // Convert every ticket fetched to HTML to be shown on the left
            const tickets_html = tickets.map(ticket => 
                <div key={ticket.service_request_id}>
                <AccordionItem>
                    <AccordionButton justifyContent="space-between">
                        <HStack spacing='24px' width="100%">
                        <Box textAlign='left' width="16vw">
                        {ticket.service_request_id}
                        </Box>
                        <Box textAlign='left' width='34vw'>
                        {ticket.email}
                        </Box>
                        <Box textAlign='left' width='20vw'>
                        {ticket.request_type}
                        </Box>
                        <Box textAlign='left' width='18vw'>
                        {convertStatus(ticket.status)}
                        </Box>
                        </HStack>
                        <AccordionIcon />
                    </AccordionButton>
                    <AccordionPanel>
                        <HStack spacing='24vw'>
                        <Box>
                        Service Request ID: {ticket.service_request_id} <br></br>
                        Email: {ticket.email} <br></br>
                        Request Type: {ticket.request_type} <br></br>
                        Request Description: {ticket.request_description} <br></br>
                        Status: {convertStatus(ticket.status)} <br></br>
                        </Box>
                        <Box width='50vw'>
                            <Stepper index={checkStep(ticket.status)}>
                                {steps.map((step, index) => (
                                    <Step key={index}>
                                    <StepIndicator>
                                        <StepStatus
                                        complete={<StepIcon />}
                                        incomplete={<StepNumber />}
                                        active={<StepNumber />}
                                        />
                                    </StepIndicator>

                                    <Box flexShrink='0'>
                                        <StepTitle width='6vw'>{step.title}</StepTitle>
                                    </Box>

                                    <StepSeparator />
                                    </Step>
                                ))}
                                </Stepper>
                        </Box>
                        </HStack>
                        <br></br>
                        <Button onClick={() => {navigate('/pages/ViewTicketPage/');setSelectedTicket({['id']:ticket.service_request_id})}} bgColor='blue.500' color='white' _hover={{bg: 'blue.800'}}>
                            View Details & Actions
                        </Button>
                    </AccordionPanel>
                </AccordionItem>
                </div>
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
