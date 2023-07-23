import React, { useState, useEffect, useContext } from 'react';
import { Box, Heading, Textarea, Button, Input, Flex } from '@chakra-ui/react';
import { useNavigate } from 'react-router-dom';
import { useAuthUser, useAuthHeader, useIsAuthenticated } from 'react-auth-kit';
import { useFormik } from 'formik';
import axios, { AxiosError } from 'axios';

import { SelectedTicketContext } from '../components/SelectedTicketContext';
import NavigationBar from '../components/NavigationBar';
import CheckTicket from '../components/CheckTicket';

export default function ViewTicketPage() {
  const navigate = useNavigate();
  const token = useAuthHeader();
  const userDetails = useAuthUser();
  const [error, setError] = useState('');
  const [tenantComment, setTenantComment] = useState('');
  const [ticketType, setTicketType] = useState('');
  const [status, setstatus] = useState('');
  const {selectedTicket, setSelectedTicket} = useContext(SelectedTicketContext);
  const [ticket, setTicket] = useState('');
  const authenticated = useIsAuthenticated();

  console.log('selectedTicket:', selectedTicket);
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
                  `http://localhost:5000/api/landlord/getTicketById/${selectedTicket.id}`,
                    // console.log(`http://localhost:5000/api/landlord/getTicketById/${selectedTicket}`),
                    config
                )
            } else if (type == 'tenant'){ 
                response = await axios.get(
                  `http://localhost:5000/api/landlord/getTicketById/${selectedTicket.id}`,
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
    const ticket = APIGetTickets(type)
    // Wait for promise to be fulfilled (fetching tickets from database)
    ticket.then(function(result){
        //console.log('result',result)
        // Naive data validation
        // console.log('result',result)
        // console.log(result !== undefined)
        if (result !== undefined){
            tickets.push(result);
        }   
        console.log('tickets',tickets)
        console.log('tickets[0]',tickets[0])
        console.log('tickets[0].request_description',tickets[0].request_description)
        var tenantComment = tickets[0].request_description;
        var category = tickets[0].request_type;
        setstatus(tickets[0].status)
        var timesubmitted = tickets[0].submitted_date_time;
        setTicket(tickets[0])
        // console.log('tenantComment', tenantComment);
        // console .log('category', category);
        // console.log('status', status);
        // console.log('timesubmitted', timesubmitted);
        formik.setValues({
          // location: response.data.data.location, // Replace 'location' with the appropriate field names from your response
          category: category,
          tenantComment: tenantComment,
          status: status,
          timesubmitted: timesubmitted,
        });
        // console.log('formik', formik.values);
    })
}

  const formik = useFormik({
    initialValues: {
      location: '',
      category: '',
      tenantComment: '',
      status: '',
      timesubmitted: '',
    },
    onSubmit: {},
  });

  
  useEffect(() => {

    GetServiceTickets(userDetails);
    if (status === 'completed') {
      navigate('/pages/FeedbackForm');
    }
  }, [status, navigate]);

  return (
    <>
    {NavigationBar()}

    <Box
      className='main container'
      display="flex"
      flexDirection="column"
      alignItems="center"
      minHeight="50vh"
      fontFamily="'Franklin Gothic Medium', 'Arial Narrow', Arial, sans-serif"
      marginTop="5vh"
    >
      {console.log(selectedTicket)}
      {/* Title */}
      <Heading as="h4" size="2xl" marginBottom="1em">
        Your Service Ticket
      </Heading>

      {/* Comment Boxes */}
      <Box display="flex" flexDirection="row" justifyContent="center" alignItems="center" marginBottom="2em">
        {/* Comment Box 1 */}
        <Box flex="1" marginRight="2em">
          <Heading as="h5" size="lg" marginBottom="1em">
            Location
          </Heading>
          <Textarea isDisabled
            name="location"
            placeholder="Enter location"
            value={formik.values.location}
            onChange={formik.handleChange}
            marginBottom="2em"
          />
          <Heading as="h5" size="lg" marginBottom="1em">
            Category Of Request
          </Heading>
          <Textarea isDisabled
            name="category"
            placeholder="Enter category"
            value={formik.values.category}
            onChange={formik.handleChange}
            marginBottom="1em"
          />
          <Heading as="h5" size="lg"  marginBottom="1em">
            Status
          </Heading>
          <Textarea isDisabled
            name="category"
            placeholder="Enter category"
            value={formik.values.status}
            onChange={formik.handleChange}
            marginBottom="1em"
          />
        </Box>

        {/* Comment Box 3 */}
        <Box flex="1" marginLeft="2em">
          <Heading as="h5" size="lg" marginBottom="1em">
            Description
          </Heading>
          <Textarea isDisabled
            name="tenantComment"
            placeholder="Enter your comment"
            value={formik.values.tenantComment}
            onChange={formik.handleChange}
            marginBottom="1em"
            rows={8}
          />
          <Heading as="h5" size="lg" marginBottom="1em">
            Time Submitted
          </Heading>
          <Input
            name="Submitted time"
            value={formik.values.timesubmitted}
            isReadOnly
            marginBottom="2em"
          />
        </Box>
      </Box>

      {/* Submit Ticket Button */}

    </Box>
    <Box className='bottom container' justifyContent="center">
    {CheckTicket(ticket, userDetails)}
    </Box>
    </>
  );
}

