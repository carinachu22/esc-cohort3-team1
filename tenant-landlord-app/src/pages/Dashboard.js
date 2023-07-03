// Import components
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

// Import react and hooks
import React, { useEffect, useState } from "react";
import { useAuthUser, useAuthHeader, useSignOut, useIsAuthenticated } from 'react-auth-kit';

// Import bootstrap for automatic styling
import "bootstrap/dist/css/bootstrap.min.css";

// Import axios for http requests
import axios, {AxiosError} from "axios";

function Getname(){
    const user = useAuthUser();
    console.log("AUTH!", user())
    return user().email
}

function NavigationBar(){
    const signOut = useSignOut();
    var name = Getname()
    return(
        <><h1>
        Welcome, {name}
        </h1>
        <Navbar bg="primary" variant="dark">
            <Container>
                <Nav className="me-auto">
                    <Nav.Link href="/pages/Dashboard/"> Homepage </Nav.Link>
                    <Nav.Link href="/pages/CreateTicketPage/"> Create Service Ticket </Nav.Link>
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


function Dashboard() {
    const [error, setError] = useState("");
    const [tickets, setTickets] = useState(null);
    const [ticketsDetails, setTicketsDetails] = useState(null);
    const [isLoading, setLoading] = useState(true);
    const token = useAuthHeader();
    const authenticated = useIsAuthenticated();
    const GetServiceTickets = () => {
        //const count = 10;
        const tickets = [];
    
        const APIGetTickets = async () => {
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
        const test_tickets = APIGetTickets();
        console.log('test_tickets here')
        console.log(test_tickets);
        test_tickets.then(function(result){
            console.log('result',result)
            if (result !== undefined){
                for (let i=0;i<result.length;i++){
                    tickets.push(result[i]);
                }
            }   
            console.log('tickets',tickets)
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
            const tickets_details_html = tickets.map(ticket =>
                <Tab.Pane eventKey={"#"+ticket.service_request_id}>
                    Service Request ID: {ticket.service_request_id} <br></br>
                    Lease ID: {ticket.lease_id} <br></br>
                    Name: {ticket.name} <br></br>
                    Request Type: {ticket.request_type} <br></br>
                    Request Description: {ticket.request_description} <br></br>
                    Status: {ticket.status} <br></br>
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
            console.log('tickets_html?',tickets_html);
            console.log('tickets_details_html?',tickets_details_html)
            setTickets(tickets_html);
            setTicketsDetails(tickets_details_html);
            setLoading(false);
        })
    }

    // This is to ensure that the GET request only happens once on page load
    // This will update the tickets state
    useEffect(() => {
        GetServiceTickets()},
        [])
    if (!authenticated()){
        console.log("Not authenticated, redirecting.")
        return <Navigate to="/"></Navigate>
    }
    console.log("Authenticated.")
    // Warning from react comes from the below block
    // This is because the number of hooks called before and after loading is different
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