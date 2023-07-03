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

// Import react and hooks
import React, { useEffect, useState } from "react";
import { useAuthUser, useAuthHeader, useSignOut, useIsAuthenticated } from 'react-auth-kit';

// Import bootstrap for automatic styling
import "bootstrap/dist/css/bootstrap.min.css";

// Import axios for http requests
import axios, {AxiosError} from "axios";

function Getname(){
    return useAuthUser().email
}

function NavigationBar(){
    const signOut = useSignOut();
    var name = Getname()
    return(
        <><h1>
        Welcome, {name}
        </h1><Navbar bg="primary" variant="dark">
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

function GetServiceTicketsDetails() {
    var count = 10;
    const tickets = [];
    for (let i=0;i<count;i++){
        tickets.push(i);
    }
    console.log(tickets)
    const tickets_html = tickets.map(ticket => 
    <Tab.Pane eventKey={"#"+ticket}>
        <Button href="/pages/FeedbackForm/">
            Give Feedback & Close Ticket
        </Button>
        <Button>
            Approve Service Ticket
        </Button>
        testing {ticket}
    </Tab.Pane>);
    console.log(tickets_html)
    return (
        <>{tickets_html}</>
    )
}

function Dashboard() {

    const [error, setError] = useState("");
    const [tickets, setTickets] = useState(null);
    const [isLoading, setLoading] = useState(true);
    const token = useAuthHeader();
    const authenticated = useIsAuthenticated();
    const GetServiceTickets = () => {
        const count = 10;
        const tickets = [];
    
        const APIGetTickets = async () => {
            console.log("getting service tickets from database");
            console.log(token())
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
    
        for (let i=0;i<count;i++){
            tickets.push(i);
        }
        test_tickets.then(function(result){
            console.log('result',result)
            if (result != undefined){
            for (let i=0;i<result.length;i++){
                tickets.push(i);
            }
            }   
            const tickets_html = tickets.map(ticket => <ListGroup.Item action href={"#" + ticket}>{ticket}</ListGroup.Item>);
            console.log('html?',tickets_html);
            setTickets(tickets_html);
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
                <ListGroup.Item action href="#link1">
                Link 1
                </ListGroup.Item>
                <ListGroup.Item action href="#link2">
                Link 2
                </ListGroup.Item>
            </ListGroup>
        </Col>
        <Col sm={8}>
            <Tab.Content>
                {GetServiceTicketsDetails()}
                <Tab.Pane eventKey="#link1">Tab pane content 1</Tab.Pane>
                <Tab.Pane eventKey="#link2">Tab pane content 2</Tab.Pane>
            </Tab.Content>
        </Col>
        </Row>
        </Tab.Container>
        </>
    )
}

export default Dashboard