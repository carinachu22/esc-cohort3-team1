import { useNavigate, Navigate } from 'react-router-dom';

// Import React and hooks
import React, { useEffect, useState, useContext } from "react";
import { useAuthUser, useAuthHeader, useIsAuthenticated } from 'react-auth-kit';

// Import bootstrap for automatic styling
import "bootstrap/dist/css/bootstrap.min.css";

// Import axios for http requests
import axios, {AxiosError} from "axios";
import NavigationBar from '../components/NavigationBar.js';
import { Accordion, AccordionButton, AccordionItem, AccordionPanel, TableContainer, Table,
    Thead,
    Tr,
    Th,
Box, AccordionIcon, HStack, Button,
    Step,
    StepIcon,
    StepIndicator,
    StepNumber,
    StepSeparator,
    StepStatus,
    StepTitle,
    Stepper,
    Select,
    Input,
    InputGroup,
    InputRightElement
  } from '@chakra-ui/react';





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
    const [tickets, setTickets] = useState(null);
    const token = useAuthHeader();
    const authenticated = useIsAuthenticated();
    const userDetails = useAuthUser();
    const [searchInput, setSearchInput] = useState("");
    const [searchType, setSearchType] = useState("");
    const [filterOption, setFilterOption] = useState("");
    const [filteredTickets, setFilteredTickets] = useState(null);


    const checkStep = (status) => {
        const step_1 = ['tenant_ticket_created','landlord_quotation_sent', 'ticket_quotation_rejected', 'landlord_ticket_approved']
        const step_2 = ['ticket_quotation_approved', 'landlord_started_work','ticket_work_rejected']
        const step_3 = ['landlord_completed_work']
        const step_4 = ['landlord_ticket_closed','landlord_ticket_rejected']
        if (step_1.includes(status)){
            return 1
        }
        else if (step_2.includes(status)){
            return 2
        }
        else if (step_3.includes(status)){
            return 3
        }
        else if (step_4.includes(status)){
            return 4
        }
        else {
            return 1
        }
    }

    const convertStatus = (status) => {
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
        } else if (status === 'ticket_work_rejected') {
            return 'Work Rejected by Tenant'
        } else if (status === 'landlord_ticket_closed' || status === 'tenant_feedback_given'){
            return "Closed"
        }
    }

    const steps = [
        { title: 'Created'},
        { title: 'Quotation Approved'},
        { title: 'Work Completed'},
        { title: 'Closed'}
      ]

    // Initialise function for 1. Fetch all service tickets dependent on user type (tenant or landlord)
    const GetServiceTickets = (userDetails) => {
        if (userDetails() === undefined){
            return;
        }
        const type = userDetails().type;
        const tickets_list = [];
        let response;

    
        // Initialse function for fetching ALL service tickets if landlord is logged in
        const APIGetTickets = async (type) => {
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
                if (type === 'landlord'){
                    response = await axios.get(
                        "http://localhost:5000/api/landlord/getTicketsByType",
                        config
                    )

                } else if (type === 'tenant'){ 
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
                    console.log("Error: ", err);
                }
                else if (err && err instanceof Error){
                    console.log("Error: ", err);
                }
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
                    tickets_list.push(result[i]);
                }
            }   
            setTickets(tickets_list);
            //console.log('tickets',tickets)



            // Convert every ticket fetched to HTML to be shown on the left
            const tickets_html = tickets_list.map((ticket, index) => 
                <div key={index+1}>
                <AccordionItem>
                    <AccordionButton justifyContent="space-between">
                        <HStack spacing='24px' width="100%">
                        <Box textAlign='left' width="16vw">
                        {index+1}
                        </Box>
                        <Box textAlign='left' width='34vw'>
                        {ticket.email}
                        </Box>
                        <Box textAlign='left' width='20vw'>
                        {ticket.ticket_type}
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
                        Service Request ID: {ticket.public_service_request_id} <br></br>
                        Email: {ticket.email} <br></br>
                        Request Type: {ticket.ticket_type} <br></br>
                        Request Description: {ticket.request_description} <br></br>
                        Status: {convertStatus(ticket.status)} <br></br>
                        Landlord Assigned: {ticket.landlord_email}<br></br>
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
                        <Button onClick={() => navigateToViewTicketPage(ticket.public_service_request_id)} bgColor='blue.500' color='white' _hover={{bg: 'blue.800'}}>
                            View Details & Actions
                        </Button>
                    </AccordionPanel>
                </AccordionItem>
                </div>
            );
            // Update states to be accessed in return
            setFilteredTickets(tickets_html);
        })
    }
    const filterTickets = (tickets, status) => {
        if (status === "") {
            return tickets;
        }
        return tickets.filter((ticket) => convertStatus(ticket.status) === status);
        };
        
    // Function to search tickets based on the search input
    const searchTickets = (tickets, searchInput, searchType) => {
        if (searchInput === "" && searchType === "") {
            return tickets;
        }
        return tickets.filter((ticket) =>
            ticket.email.toLowerCase().includes(searchInput.toLowerCase()) &&
            ticket.ticket_type.toLowerCase().includes(searchType.toLowerCase())
        );
    };

    const navigateToViewTicketPage =  (ticketID) => {
        navigate('/pages/ViewTicketPage/', { state: { ticketID } } );
      }
    

    // Combine filtering and searching
    const getFilteredTickets = () => {
        const filtered_tickets = (searchTickets(
            filterTickets(tickets, filterOption),
            searchInput, searchType
            ))
        console.log(filtered_tickets)
        if (filtered_tickets != null){
        setFilteredTickets(filtered_tickets.map((ticket, index) => (
            <div key={index+1}>
            <AccordionItem>
                <AccordionButton justifyContent="space-between">
                    <HStack spacing='24px' width="100%">
                    <Box textAlign='left' width="16vw">
                    {index+1}
                    </Box>
                    <Box textAlign='left' width='34vw'>
                    {ticket.email}
                    </Box>
                    <Box textAlign='left' width='20vw'>
                    {ticket.ticket_type}
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
                    Service Request ID: {ticket.public_service_request_id} <br></br>
                    Email: {ticket.email} <br></br>
                    Request Type: {ticket.ticket_type} <br></br>
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
                    <Button onClick={() => navigateToViewTicketPage(ticket.public_service_request_id)} bgColor='blue.500' color='white' _hover={{bg: 'blue.800'}}>
                        View Details & Actions
                    </Button>
                </AccordionPanel>
            </AccordionItem>
            </div>
        )))}
    }

        
    


    // This is to ensure that the GET request only happens once on page load
    // This will update the tickets state
    useEffect(() => {
        if (authenticate()){
            GetServiceTickets(userDetails);
        }},
        [])

    useEffect(() => {
        // Function to handle filtering and searching whenever filterOption or searchInput changes
        const handleFilterAndSearch = () => {
            getFilteredTickets();
        };

        // Call handleFilterAndSearch whenever filterOption or searchInput changes
        handleFilterAndSearch();
    }, [filterOption, searchInput, searchType]);


    //console.log("Authenticated.")
    // Warning from react comes from the below block
    // This is because the number of hooks called before and after loading is different
    // If promise is not yet fulfilled, wait
    /*
    if (isLoading){
        return<div className="App">Loading...</div>;
    }*/

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

        {/* Search Bar */}
            <Box my={4}>
            <InputGroup>
                <Input
                type="text"
                placeholder="Search tickets by requester"
                value={searchInput}
                onChange={(e) => setSearchInput(e.target.value)}
                />
                <InputRightElement>
                <Button onClick={() => setSearchInput("")}>Clear</Button>
                </InputRightElement>
            </InputGroup>
            </Box>
            <Box my={4}>
            <InputGroup>
                <Input
                type="text"
                placeholder="Search tickets by type"
                value={searchType}
                onChange={(e) => setSearchType(e.target.value)}
                />
                <InputRightElement>
                <Button onClick={() => setSearchType("")}>Clear</Button>
                </InputRightElement>
            </InputGroup>
            </Box>

            {/* Filter Options */}
            <Box mb={4}>
            <Select
                placeholder="Filter by status"
                value={filterOption}
                onChange={(e) => setFilterOption(e.target.value)}
            >
                <option value="Created">Created</option>
                <option value="Approved">Approved</option>
                <option value="Completed">Completed</option>
                <option value="Closed">Closed</option>
                {/* Add more filter options as needed */}
            </Select>
            </Box>
                <TableContainer>
            <Table variant='simple' id='ticketTable'>
            <Thead>
                <Tr>
                    <Th> No. </Th>
                    <Th> Requester </Th>
                    <Th> Type </Th>
                    <Th> Status </Th>
                </Tr>
            </Thead>
            </Table>
        </TableContainer>
            <Accordion allowToggle>
                {filteredTickets}
                {/*ticketsHTML*/}
            </Accordion>
        </>
    )
}
