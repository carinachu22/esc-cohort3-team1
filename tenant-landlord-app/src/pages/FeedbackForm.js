import React, { useState } from 'react';
import { Box, Button, Text, Textarea, useToast, IconButton } from '@chakra-ui/react';
import { StarIcon } from '@chakra-ui/icons';
import { Navigate, useNavigate, useSearchParams } from 'react-router-dom';

import { useAuthUser, useAuthHeader } from 'react-auth-kit';
import { useFormik } from "formik";
import axios, { AxiosError } from "axios";

import NavigationBar from './NavigationBar';

function StarRating({ value, onChange }) {
  const [hoverValue, setHoverValue] = useState(0);

  const getColor = (index) => {
    if (hoverValue >= index) {
      return "blue.500";
    } else if (!hoverValue && value >= index) {
      return "blue.500";
    }
    return "gray.300";
  };

  return (
    <Box d="flex">
      {[1, 2, 3, 4, 5].map((index) => (
        <StarIcon 
          key={index} 
          boxSize={8} // Increase the size of the stars
          _hover={{ color: "blue.300" }}
          color={getColor(index)}
          onMouseEnter={() => setHoverValue(index)}
          onMouseLeave={() => setHoverValue(0)}
          onClick={() => onChange(index)}
          mr={2}
          />
        ))}
    </Box>
  );
}

function FeedbackForm() {
    const [error, setError] = useState("");
    const token = useAuthHeader();
    const navigate = useNavigate();
    const [searchParams, setSearchParams] = useSearchParams();
    const ticketID = searchParams.get("ticketID");
    const toast = useToast();

    const onSubmit = values => {
      console.log("ONSUBMIT VALUES", values)
      if (values.comment === "" && values.rating === -1) {
          toast({
              title: "Feedback Error.",
              description: "Please leave a comment and select a rating.",
              status: "error",
              duration: 5000,
              isClosable: true,
              position: "top",
          });
          return;
      }
      if (values.comment === "") {
          toast({
              title: "Feedback Error.",
              description: "Please leave a comment.",
              status: "error",
              duration: 5000,
              isClosable: true,
              position: "top",
          });
          return;
      }
      if (values.rating === -1) {
          toast({
              title: "Feedback Error.",
              description: "Please select a rating.",
              status: "error",
              duration: 5000,
              isClosable: true,
              position: "top",
          });
          return;
      }
      const closeTicketPromise = APICloseTicket(values);
      closeTicketPromise.then(() => {
          navigate('/pages/dashboard');
          toast({
              title: "Feedback submitted.",
              description: "Thank you for your feedback!",
              status: "success",
              duration: 5000,
              isClosable: true,
              position: "top",
          });
      });
  };
  

    const APICloseTicket = async (data) => {
        console.log(token())
        console.log("VALUES", data)
        setError("");

        try {
            const config = {
                headers: {
                    Authorization: `${token()}`
                }
            };

            const values = {
                status: "close",
                feedback_text: data.comment,
                feedback_rating: data.rating
            };

            const response1 = await axios.patch(
                `http://localhost:5000/api/tenant/addFeedbackText/${ticketID}`,
                values,
                config
            )
            console.log("got response of adding feedback text:")
            console.log(response1);

            const response2 = await axios.patch(
                `http://localhost:5000/api/tenant/addFeedbackRating/${ticketID}`,
                values,
                config
            )
            console.log("got response of adding feedback rating:")
            console.log(response2);

            const response3 = await axios.patch(
                `http://localhost:5000/api/tenant/closeTicketStatus/${ticketID}`,
                values,
                config
            )
            console.log("got response of closing ticket:")
            console.log(response3);

        } catch (err) {
            if (err && err instanceof AxiosError) {
                setError(err.response);
            }
            else if (err && err instanceof Error) {
                setError(err.message);
            }

            console.log("Error: ", err);
        }

    }

    const formik = useFormik({
        initialValues: {
            comment: "",
            rating: -1
        },
        onSubmit: event => onSubmit(event, formik.values.comment, formik.values.rating),
    });

    return (
        <>
          <NavigationBar />
          <Box p={10} bg="#EDF2F7" borderRadius="md" boxShadow="lg" m="10%">
            <Box display="flex" flexDirection="column" justifyContent="center" minHeight="50vh">
                <form onSubmit={formik.handleSubmit}>
                    <Box mb={2} w="50%" m="0 auto">
                        <Text fontSize="2xl" textAlign="center" mb={4}>
                            Please leave your feedback
                        </Text>
                        <Textarea
                          placeholder="Comment"
                          size="md"
                          rows={4}
                          name="comment"
                          value={formik.values.comment}
                          onChange={formik.handleChange} // store user comment 
                          bg="white"
                          shadow="lg"
                      />
                    </Box>
                    <Box display="flex" justifyContent="center" mt={5} mb={2}>
                        <StarRating
                            value={formik.values.rating}
                            onChange={(rate) => formik.setFieldValue('rating', rate)}
                        />
                    </Box>
                    <Box display="flex" justifyContent="center" m={10} p={1}>
                      <Button colorScheme="blue" mr={3} onClick={() => navigate(-1)}>Back</Button>
                      <Button colorScheme="blue" type="submit">Submit</Button>
                  </Box>
                </form>
            </Box>
        </Box> 
    </> 
  );
}

export default FeedbackForm;
