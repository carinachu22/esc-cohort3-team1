import axios from "axios";
import { useAuthHeader } from "react-auth-kit";
import { useNavigate } from "react-router-dom"
import React from "react"

import { Box, Button, Textarea, useToast, Heading, Stack, Icon } from '@chakra-ui/react';
import { IoIosStarOutline, IoIosStar } from 'react-icons/io/index.esm.js';

/**
 * Summary.
 * Takes in a ticket and user details.
 * Checks which buttons should be shown based on the two parameters above.
 * Returns to function caller.
 * 
 * @param {*} ticket 
 * @param {*} userDetails 
 * @returns 
 */
export default function CheckTicket(ticket, userDetails){
    const id = ticket.public_service_request_id
    const status = ticket.status
    const navigate = useNavigate();
    const token = useAuthHeader();
    const toast = useToast();

    const navigateToQuotationUploadPage =  (ticketID) => {
      navigate('/pages/QuotationUploadPage/', { state: { ticketID } } );
    }

    const navigateToQuotationPage =  (ticketID) => {
      navigate('/pages/QuotationPage/', { state: { ticketID } } );
    }

    const navigateToFeedbackPage =  (ticketID) => {
      navigate('/pages/FeedbackForm/', { state: { ticketID } } );
    }

    if (userDetails() === null){
        navigate('/')
    }
    if (status === 'landlord_completed_work'){
      if (userDetails().type === 'tenant'){
        return(
          <Button
          variant="solid"
          colorScheme="blue"
          onClick={() => navigateToFeedbackPage(id)}
          width="13em"
          height="3em"
          marginTop="3em"
          borderRadius="0.25em"
          >
          Close Ticket & Give Feedback
          </Button>
        )
      }
    }
    if (status === 'tenant_ticket_created'){
        if (userDetails().type === 'landlord'){
            return (
                <>
                    <Button
                    variant="solid"
                    colorScheme="blue"
                    width="13em"
                    height="3em"
                    marginTop="3em"
                    marginLeft="2.3em"
                    marginRight="2.3em"
                    marginBottom="5vh"
                    borderRadius="0.25em"
                    onClick = {() => {console.log('approving');
                            axios.patch(
                            `http://localhost:5000/api/landlord/ticketApproval/${id}`,
                            {
                                ticket_approved_by_landlord: 1
                            },
                            {
                                headers: {
                                  Authorization: `${token()}`
                                }
                            }
                        );navigate('/pages/TicketList');
                        toast({
                          title: "Ticket Approved",
                          description: "Ticket set to approved.",
                          status: "success",
                          duration: 5000,
                          isClosable: true,
                          position: "top",
                          })}
                        }
                    >
                    Approve Ticket
                    </Button>
                    <Button
                        variant="solid"
                        colorScheme="blue"
                        width="13em"
                        height="3em"
                        marginTop="3em"
                        marginLeft="2.3em"
                        marginRight="2.3em"
                        borderRadius="0.25em"
                        onClick = {() => {console.log('rejecting');
                            axios.patch(
                            `http://localhost:5000/api/landlord/ticketApproval/${id}`,
                            {
                                ticket_approved_by_landlord: 0
                            },
                            {
                                headers: {
                                  Authorization: `${token()}`
                                }
                            }
                        );navigate('/pages/TicketList');
                        toast({
                          title: "Ticket Rejected",
                          description: "Ticket set to rejected.",
                          status: "error",
                          duration: 5000,
                          isClosable: true,
                          position: "top",
                          })}
                        }
                    >
                    Reject Ticket
                    </Button>
                </>
            )
        }
        else {
          return
        }
    }
    if (status === 'landlord_ticket_closed'){
      const rating=ticket.feedback_rating
      const starIcons = Array.from({ length: 5 }, (_, index) => (
        <Icon
          key={index}
          as={index < rating ? IoIosStar : IoIosStarOutline}
          color={index < rating ? 'yellow.500' : 'gray.300'}
          cursor="pointer"
          fontSize="3xl"
        />
      ));
      return(
        <Box display="flex" flexDirection="column" justifyContent="flex-start" minHeight="100vh">
          <Box mb={2} width="50%" margin="0 auto">
            <Heading as="h4" align="center" marginBottom="1.5em">
              Please leave your feedback
            </Heading>
            <Textarea isDisabled
              name="comment"
              placeholder="Comment"
              size="lg"
              marginBottom="1.5em"
              value={ticket.feedback_text}
            />
          </Box>
          <Box display="flex" justifyContent="center" mt={2} mb={2}>
            <Stack direction="row" marginBottom="1.5em" spacing={2}>
              {starIcons}
            </Stack>
          </Box>
      </Box>
      )
    }
    return(
      <>
    <Button
    variant="solid"
    colorScheme="blue"
    onClick={() => {if (userDetails().type === 'landlord'){
      navigateToQuotationUploadPage(ticket.public_service_request_id)}
    else{
      navigateToQuotationPage(ticket.public_service_request_id)
    }}}
    width="13em"
    height="3em"
    marginTop="3em"
    borderRadius="0.25em"
  >
    View/Add Quotation
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
      onClick = {() => {console.log('starting work');
      axios.patch(
      `http://localhost:5000/api/landlord/ticketWork/${id}`,
      {
          ticket_work_status: 1
      },
      {
          headers: {
            Authorization: `${token()}`
          }
      }
      );navigate('/pages/TicketList');
      toast({
        title: "Work Started",
        description: "Ticket work set to started.",
        status: "success",
        duration: 5000,
        isClosable: true,
        position: "top",
        })}
      }
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
        onClick = {() => {console.log('ending work');
        axios.patch(
        `http://localhost:5000/api/landlord/ticketWork/${id}`,
        {
            ticket_work_status: 0
        },
        {
            headers: {
              Authorization: `${token()}`
            }
        }
        );navigate('/pages/TicketList');
        toast({
          title: "Work Completed",
          description: "Ticket work set to completed.",
          status: "success",
          duration: 5000,
          isClosable: true,
          position: "top",
          })}
        }
      >
        End Work
      </Button>
      </>
      
    )
    } 
