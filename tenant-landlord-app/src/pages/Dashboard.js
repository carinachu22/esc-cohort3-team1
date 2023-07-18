// Import react-bootstrap components
import Navbar from 'react-bootstrap/Navbar';
import NavDropdown from 'react-bootstrap/NavDropdown';
import Container from 'react-bootstrap/Container';
import Nav from 'react-bootstrap/Nav';
import ListGroup from 'react-bootstrap/ListGroup'
import Col from 'react-bootstrap/Col';
import Row from 'react-bootstrap/Row';
import Tab from 'react-bootstrap/Tab';
import Button from 'react-bootstrap/Button'

import { Navigate } from 'react-router-dom';
import styles from "../styles/dashboard.module.css";

// Import React and hooks
import React, { useEffect, useState } from "react";
import { useAuthUser, useAuthHeader, useSignOut, useIsAuthenticated } from 'react-auth-kit';

// Import bootstrap for automatic styling
import "bootstrap/dist/css/bootstrap.min.css";

// Import axios for http requests
import axios, {AxiosError} from "axios";

/**
Functional component to display the navigation bar
Functionalities:
1. Show welcome text
2. Display links to other pages (Homepage, Create Ticket, Filter Ticket)
3. Sign Out
**/ 
function NavigationBar(){
    const signOut = useSignOut();
    const userDetails = useAuthUser();
    var email = userDetails().email;
    return(
        <><h1>
        Welcome, {email}
        </h1>
        <Navbar bg="primary" variant="dark">
            <Container>
                <Nav className="me-auto">
                    <Nav.Link href="/pages/Dashboard/"> Homepage </Nav.Link>
                    <Nav.Link href="/pages/CreateTicketPage/"> Create Service Ticket </Nav.Link>
                    <Nav.Link href="/pages/QuotationUploadPage/"> Upload Quotation </Nav.Link>
                    <NavDropdown title="Search for Service Ticket by" id="basic-nav-dropdown">
                        <NavDropdown.Item href="#action/3.1">Creation Date</NavDropdown.Item>
                        <NavDropdown.Item href="#action/3.2">Status</NavDropdown.Item>
                        <NavDropdown.Item href="#action/3.3">Something</NavDropdown.Item>
                    </NavDropdown>
                        <Nav.Item>
                        <Button onClick={() => signOut()}> Sign out </Button>
                        </Nav.Item>
                </Nav>
            </Container>
        </Navbar></>
    )
}

/**
Functional component to display the content of the dashboard
Functionalities:
1. Fetch all service tickets dependent on user type (tenant or landlord)
2. Display all service tickets ID and status in a list on the left
3. Display selected service ticket details on the right when clicked 
**/
function Dashboard() {
    // Initialise states and hooks
    const [error, setError] = useState("");
    const [tickets, setTickets] = useState(null);
    const [ticketsDetails, setTicketsDetails] = useState(null);
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
    
        // Initialse function for fetching ALL service tickets if landlord is logged in
        const APIGetTicketsLandlord = async () => {
            //console.log("getting service tickets from database");
            //console.log(token())
            setError("");
            try{
                const config = {
                    headers: {
                      Authorization: `${token()}`
                    }
                };
                const response = await axios.get(
                    "http://localhost:5000/api/landlord/getTickets",
                    config
                )
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

        // Initialise function for fetching ONLY RELEVANT service tickets if tenant is logged in
        const APIGetTicketsTenant = async () => {
            //console.log("getting service tickets from database");
            //console.log(token())
            setError("");
            try{
                const config = {
                    headers: {
                      Authorization: `${token()}`
                    }
                };

                const values = {
                    params: {
                        email: userDetails().email
                    }
                }

                const response = await axios.get(
                    "http://localhost:5000/api/tenant/getTickets",
                    config,
                    values
                )
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
        //console.log("TYPE", type)

        // Initialise promise
        const test_tickets = APIGetTicketsLandlord();
        if (type == "tenant"){
            const test_tickets = APIGetTicketsTenant();
        }

        //console.log('test_tickets here')
        //console.log(test_tickets);

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
                <ListGroup.Item className={styles['ticketList']} action href={"#" + ticket.service_request_id}>
                    <div className={styles['ticketID']}>
                        {ticket.service_request_id}
                    </div>
                    <div className={styles['ticketstatus']}>
                        {ticket.status}
                    </div>
                </ListGroup.Item>
            );

            // Convert details of every ticket fetched to HTML to be shown on the right
            const tickets_details_html = tickets.map(ticket =>
                <Tab.Pane eventKey={"#"+ticket.service_request_id}>
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
                    <Button href={"/pages/FeedbackForm/?ticketID=" + ticket.service_request_id}>
                        Give Feedback & Close Ticket
                    </Button>
                    <br></br>
                    <br></br>
                    <Button>
                        Approve Service Ticket
                    </Button>
                </Tab.Pane>
            )
            //console.log('tickets_html?',tickets_html);
            //console.log('tickets_details_html?',tickets_details_html)

            // Update states to be accessed in return
            setTickets(tickets_html);
            setTicketsDetails(tickets_details_html);
            setLoading(false);
        })
    }

    // This is to ensure that the GET request only happens once on page load
    // This will update the tickets state
    useEffect(() => {
        GetServiceTickets(userDetails)},
        [])

    // Check if still autenticated based on react auth kit
    if (!authenticated()){
        console.log("Not authenticated, redirecting.")
        return <Navigate to="/"></Navigate>
    }
    //console.log("Authenticated.")
    // Warning from react comes from the below block
    // This is because the number of hooks called before and after loading is different
    // If promise is not yet fulfilled, wait
    if (isLoading){
        return<div className="App">Loading...</div>;
    }
    return (
        <>
        {NavigationBar()}
        <Tab.Container id="list-group-tabs-example" defaultActiveKey="0">
            <br></br>
            <Row>
                <Col sm={4}>
                    <ListGroup>
                        {console.log('hm?',tickets)}
                        {tickets}
                    </ListGroup>
                </Col>
                <Col sm={8}>
                    <Tab.Content>
                        {ticketsDetails}
                    </Tab.Content>
                </Col>
            </Row>
        </Tab.Container>
        </>
    )
}

export default Dashboard