import Navbar from 'react-bootstrap/Navbar';
import NavDropdown from 'react-bootstrap/NavDropdown';
import Container from 'react-bootstrap/Container';
import Nav from 'react-bootstrap/Nav';
import ListGroup from 'react-bootstrap/ListGroup'
import Col from 'react-bootstrap/Col';
import Row from 'react-bootstrap/Row';
import Tab from 'react-bootstrap/Tab';
import Button from 'react-bootstrap/Button'

import * as React from 'react';

import "bootstrap/dist/css/bootstrap.min.css";

function Getname(){
    return "test"
}

function NavigationBar(){
    var name = Getname()
    return(
        <><h1>
        Welcome, {name}
        </h1><Navbar bg="primary" variant="dark">
                <Container>
                    <Navbar.Brand>Navbar</Navbar.Brand>
                    <Nav className="me-auto">
                        <Nav.Link> Homepage </Nav.Link>
                        <Nav.Link href="/pages/CreateTicketPage/"> Create Service Ticket </Nav.Link>
                        <NavDropdown title="Search for Service Ticket by" id="basic-nav-dropdown">
                            <NavDropdown.Item href="#action/3.1">Creation Date</NavDropdown.Item>
                            <NavDropdown.Item href="#action/3.2">Status</NavDropdown.Item>
                            <NavDropdown.Item href="#action/3.3">Something</NavDropdown.Item>
                        </NavDropdown>
                        <Nav.Link href="/"> Sign out</Nav.Link>
                    </Nav>
                </Container>
            </Navbar></>
        )
}

function GetServiceTickets() {
    var count = 10;
    const tickets = [];
    /* Actually here would be the API Call to get all the tickets */
    for (let i=0;i<count;i++){
        tickets.push(i);
    }
    console.log(tickets);
    const tickets_html = tickets.map(ticket => <ListGroup.Item action href={"#" + ticket}>{ticket}</ListGroup.Item>);
    console.log(tickets_html);
    return (
        <>{tickets_html}</>
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
        testing {ticket}
    </Tab.Pane>);
    console.log(tickets_html)
    return (
        <>{tickets_html}</>
    )
}

function Dashboard() {
    return (
        <>
        {NavigationBar()}
        <Tab.Container id="list-group-tabs-example" defaultActiveKey="0">
        <br></br>
        <Row>
        <Col sm={4}>
            <ListGroup>
                {GetServiceTickets()}
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
        {/*
        <ListGroup>
            <ListGroup.Item>Service Ticket 1</ListGroup.Item>
            <ListGroup.Item>Service Ticket 1</ListGroup.Item>
            <ListGroup.Item>Service Ticket 1</ListGroup.Item>
            <ListGroup.Item>Service Ticket 1</ListGroup.Item>
            <ListGroup.Item>Service Ticket 1</ListGroup.Item>
        </ListGroup>
        */}
        </>
    )
}

export default Dashboard