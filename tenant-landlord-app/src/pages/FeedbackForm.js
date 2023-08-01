import React, { useState, useContext } from 'react';
import { Box, Button, Textarea, useToast, Heading, Stack, Icon } from '@chakra-ui/react';
import { IoIosStarOutline, IoIosStar } from 'react-icons/io/index.esm.js';
import { useNavigate, useLocation } from 'react-router-dom';
import { useAuthHeader }from 'react-auth-kit';
import { useFormik } from 'formik';
import axios, { AxiosError } from 'axios';

import { SelectedTicketContext } from '../components/SelectedTicketContext.js';

function FeedbackForm() {
  const {selectedTicket, setSelectedTicket} = useContext(SelectedTicketContext);
  const token = useAuthHeader();
  const navigate = useNavigate();
  const [rating, setRating] = useState(-1);
  const toast = useToast();
  const location = useLocation();
  const { ticketID } = location.state;
  console.log('ID', ticketID)

  const handleRatingChange = (newRating) => {
    setRating(newRating);
  };

  const onSubmit = (values) => {
    if (values.comment === '' || rating === -1) {
      return;
    }

    const closeTicketPromise = APICloseTicket(values);
    closeTicketPromise.then(() => {navigate('/pages/dashboard');toast({
      title: "Feedback Sent",
      description: "Feedback has been sent.",
      status: "success",
      duration: 5000,
      isClosable: true,
      position: "top",
      })});
  };

  const APICloseTicket = async (data) => {
    console.log(token());
    console.log('VALUES', data);

    try {
      const config = {
        headers: {
          Authorization: `${token()}`,
        },
      };

      const values = {
        status: 'close',
        feedback_text: data.comment,
        feedback_rating: rating,
      };

      const response1 = await axios.patch(
        `http://localhost:5000/api/tenant/addFeedbackText/${ticketID}`,
        values,
        config
      );
      console.log('got response of adding feedback text:');
      console.log(response1);

      const response2 = await axios.patch(
        `http://localhost:5000/api/tenant/addFeedbackRating/${ticketID}`,
        values,
        config
      );
      console.log('got response of adding feedback rating:');
      console.log(response2);


      const response3 = await axios.patch(
        `http://localhost:5000/api/tenant/closeTicketStatus/${ticketID}`,
        values,
        config
      );
      console.log('got response of closing ticket:');
      console.log(response3);
    } catch (err) {
      if (err && err instanceof AxiosError) {
        console.log('Error: ', err);
      } else if (err && err instanceof Error) {
        console.log('Error: ', err);
      }
    }
  };

  const formik = useFormik({
    initialValues: {
      comment: '',
    },
    onSubmit: onSubmit,
  });

  const starIcons = Array.from({ length: 5 }, (_, index) => (
    <Icon
      key={index}
      as={index < rating ? IoIosStar : IoIosStarOutline}
      color={index < rating ? 'yellow.500' : 'gray.300'}
      cursor="pointer"
      fontSize="3xl"
      onClick={() => handleRatingChange(index + 1)}
    />
  ));

  return (
    <Box display="flex" flexDirection="column" justifyContent="center" minHeight="100vh">
      <form onSubmit={formik.handleSubmit}>
        <Box mb={2} width="50%" margin="0 auto">
          <Heading as="h4" align="center" marginBottom="1.5em">
            Please leave your feedback
          </Heading>
          <Textarea
            name="comment"
            placeholder="Comment"
            size="lg"
            marginBottom="1.5em"
            value={formik.values.comment}
            onChange={formik.handleChange}
          />
        </Box>
        <Box display="flex" justifyContent="center" mt={2} mb={2}>
          <Stack direction="row" marginBottom="1.5em" spacing={2}>
            {starIcons}
          </Stack>
        </Box>
        <Box display="flex" justifyContent="center" m={1} p={1}>
          <Button type="submit" 
          size="lg"
          colorScheme="blue" >
            Submit
          </Button>
        </Box>
      </form>
    </Box>
  );
}

export default FeedbackForm;
