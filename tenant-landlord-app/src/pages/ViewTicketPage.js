import React, { useState, useEffect, useContext } from 'react';
import { Box, Heading, Textarea, Button, Input, Flex } from '@chakra-ui/react';
import { useNavigate } from 'react-router-dom';
import { useAuthUser, useAuthHeader } from 'react-auth-kit';
import { useFormik } from 'formik';
import axios, { AxiosError } from 'axios';

import { SelectedTicketContext } from './App';

function CreateTicketPage() {
  const navigate = useNavigate();
  const token = useAuthHeader();
  const userDetails = useAuthUser();
  const [error, setError] = useState('');
  const [tenantComment, setTenantComment] = useState('');
  const [ticketType, setTicketType] = useState('');
  const [additionalHeading, setAdditionalHeading] = useState('');
  const {selectedTicket, setSelectedTicket} = useContext(SelectedTicketContext);
  const stats = 'nill';

  const handleCommentChange = (event) => {
    setTenantComment(event.target.value);
  };

  const handleTicketTypeChange = (event) => {
    setTicketType(event.target.value);
  };

  const handleAdditionalHeadingChange = (event) => {
    setAdditionalHeading(event.target.value);
  };

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
        additional_heading: additionalHeading,
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
      additionalHeading: '',
    },
    onSubmit: handleCreateTicket,
  });

  useEffect(() => {
    if (stats === 'completed') {
      navigate('/pages/FeedbackForm');
    }
  }, [stats, navigate]);

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
            value={formik.values.submitted_date_time}
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

export default CreateTicketPage;
