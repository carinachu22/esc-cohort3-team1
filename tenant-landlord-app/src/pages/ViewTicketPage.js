import React, { useState, useEffect, useContext } from 'react';
import { Box, Heading, Textarea, Button, Input, Flex } from '@chakra-ui/react';
import { useNavigate } from 'react-router-dom';
import { useAuthUser, useAuthHeader } from 'react-auth-kit';
import { useFormik } from 'formik';
import axios, { AxiosError } from 'axios';

import { SelectedTicketContext } from '../components/SelectedTicketContext';

export default function ViewTicketPage() {
  const navigate = useNavigate();
  const token = useAuthHeader();
  const userDetails = useAuthUser();
  const [error, setError] = useState('');
  const [tenantComment, setTenantComment] = useState('');
  const [ticketType, setTicketType] = useState('');
  const [status, setstatus] = useState('');
  const {selectedTicket, setSelectedTicket} = useContext(SelectedTicketContext);

  console.log('selectedTicket:', selectedTicket);
  const handleCommentChange = (event) => {
    setTenantComment(event.target.value);
  };

  const handleTicketTypeChange = (event) => {
    setTicketType(event.target.value);
  };

  const handlestatusChange = (event) => {
    setstatus(event.target.value);
  };

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
        var status = tickets[0].status;
        var timesubmitted = tickets[0].submitted_date_time;
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

  const handleCreateTicket = async () => {
    console.log(tenantComment);
    console.log(token());
    setError('');

    try {
      const config = {
        headers: {
          Authorization: `${token()}`,
        },
      };
      const currentdate = new Date();
      const values = {
        name: '--',
        email: userDetails().email,
        request_type: ticketType,
        request_description: tenantComment,
        submitted_date_time:
          currentdate.getFullYear().toString() +
          '-' +
          (currentdate.getMonth() + 1).toString() +
          '-' +
          currentdate.getDate().toString() +
          ' ' +
          currentdate.getHours().toString() +
          ':' +
          ('0' + currentdate.getMinutes()).slice(-2) +
          ':' +
          currentdate.getSeconds().toString(),
        status: 'SUBMITTED',
        feedback_text: '',
        feedback_rating: '-1',
      };

      const response1 = await axios.post(
        'http://localhost:5000/api/tenant/createTicket',
        values,
        config
      );
      console.log('got response of creating ticket:');
      console.log(response1);

      navigate('/pages/Dashboard'); // Navigate to the Dashboard form page
    } catch (err) {
      if (err && err instanceof AxiosError) {
        setError(err.response);
      } else if (err && err instanceof Error) {
        setError(err.message);
      }

      console.log('Error: ', err);
    }
  };

  const formik = useFormik({
    initialValues: {
      location: '',
      category: '',
      tenantComment: '',
      status: '',
      timesubmitted: '',
    },
    onSubmit: handleCreateTicket,
  });
  
  useEffect(() => {
    GetServiceTickets(userDetails)
    if (status === 'completed') {
      navigate('/pages/FeedbackForm');
    }
  }, [status, navigate]);

  return (
    <Box
      display="flex"
      flexDirection="column"
      alignItems="center"
      minHeight="100vh"
      fontFamily="'Franklin Gothic Medium', 'Arial Narrow', Arial, sans-serif"
      marginTop="5vh"
    >
      {console.log(selectedTicket)}
      {/* Title */}
      <Heading as="h4" size="2xl" marginBottom="2em">
        Your Service Ticket
      </Heading>

      {/* Comment Boxes */}
      <Box display="flex" flexDirection="row" justifyContent="center" alignItems="center" marginBottom="2em">
        {/* Comment Box 1 */}
        <Box flex="1" marginRight="2em">
          <Heading as="h5" size="lg" marginBottom="1em">
            Location
          </Heading>
          <Textarea
            name="location"
            placeholder="Enter location"
            value={formik.values.location}
            onChange={formik.handleChange}
            marginBottom="2em"
          />
          <Heading as="h5" size="lg" marginBottom="1em">
            Category Of Request
          </Heading>
          <Textarea
            name="category"
            placeholder="Enter category"
            value={formik.values.category}
            onChange={formik.handleChange}
            marginBottom="1em"
          />
          <Heading as="h5" size="lg"  marginBottom="1em">
            Status
          </Heading>
          <Textarea
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
          <Textarea
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
      <Flex justifyContent="center">
        <Button
          variant="solid"
          colorScheme="blue"
          onClick={formik.handleSubmit}
          width="13em"
          height="3em"
          marginTop="3em"
          borderRadius="0.25em"
        >
          Add Quotation
        </Button>
        <Button
          variant="solid"
          colorScheme="blue"
          width="13em"
          height="3em"
          marginTop="3em"
          marginLeft="2.3em"
          marginBottom="5vh"
          borderRadius="0.25em"
        >
          Start Work
        </Button>
        <Button
          variant="solid"
          colorScheme="blue"
          width="13em"
          height="3em"
          marginTop="3em"
          marginLeft="2.3em"
          borderRadius="0.25em"
        >
          End Work
        </Button>
      </Flex>
    </Box>
  );
}

