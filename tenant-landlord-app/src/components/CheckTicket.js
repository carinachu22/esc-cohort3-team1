import { Button } from "@chakra-ui/react"
import axios from "axios";
import { useAuthHeader } from "react-auth-kit";
import { useNavigate } from "react-router-dom"

export default function CheckTicket(id, status, userDetails){
    console.log(id)
    console.log(status)
    console.log('testing check ticket',userDetails())
    const navigate = useNavigate();
    const token = useAuthHeader();
    if (userDetails() === null){
        navigate('/')
    }
    if (status === 'landlord_completed_work'){
      if (userDetails().type === 'tenant'){
        return(
          <Button
          variant="solid"
          colorScheme="blue"
          onClick={() => navigate('/pages/FeedbackForm')}
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
                        );navigate('/pages/TicketList')}
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
                        );navigate('/pages/TicketList')}
                        }
                    >
                    Reject Ticket
                    </Button>
                </>
            )
        }
    }
    return(
      <>
    <Button
    variant="solid"
    colorScheme="blue"
    onClick={() => {if (userDetails().type == 'landlord'){
      navigate('/pages/QuotationUploadPage')}
    else{
      navigate('/pages/QuotationPage')
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
      );navigate('/pages/TicketList')}
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
        );navigate('/pages/TicketList')}
        }
      >
        End Work
      </Button>
      </>
      
    )
    } 
