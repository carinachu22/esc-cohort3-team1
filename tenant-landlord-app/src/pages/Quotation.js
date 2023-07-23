import { Box, Text, Heading, VStack, SimpleGrid, List, ListItem, Table, Thead, Tbody, Tr, Th, Td, Flex, Button } from "@chakra-ui/react";

function Quotation() {
  // Replace these with your actual data
  const ticketName = "Ticket 1";
  const accountName = "Account 1";
  const tenantName = "Tenant 1";
  const paymentAccount = "Payment Account 1";
  const companyContact = "Company Contact 1";
  const jobDescriptions = ["Job 1", "Job 2", "Job 3"];
  const amounts = ["$100", "$200", "$300"];
  const subTotal = "600";
  const gst = "48";
  const grandTotal = "648";

  return (
    <Box p={10} bg="gray.100" borderRadius="md" boxShadow="lg" m="10%">
      <Heading mb={5} textAlign="center">Job Quote for Ticket: {ticketName}</Heading>
      <SimpleGrid columns={2} spacing={10}>
        <VStack align="start" spacing={5}>
          <Heading size="md">Details</Heading>
          <List spacing={3}>
            <ListItem><Text fontSize="lg" fontWeight="bold">Account name:</Text><Text fontSize="lg">{accountName}</Text></ListItem>
            <ListItem><Text fontSize="lg" fontWeight="bold">Tenant Name:</Text><Text fontSize="lg">{tenantName}</Text></ListItem>
            <ListItem><Text fontSize="lg" fontWeight="bold">Payment Account:</Text><Text fontSize="lg">{paymentAccount}</Text></ListItem>
            <ListItem><Text fontSize="lg" fontWeight="bold">Company Contact:</Text><Text fontSize="lg">{companyContact}</Text></ListItem>
          </List>
        </VStack>
        <VStack align="start" spacing={5} align="stretch">
          <Heading size="md">Quotation</Heading>
          <Table variant="simple" size="md" colorScheme="blue">
            <Thead>
              <Tr>
                <Th>Job Description</Th>
                <Th isNumeric>Amount</Th>
              </Tr>
            </Thead>
            <Tbody>
              {jobDescriptions.map((job, index) => (
                <Tr key={index}>
                  <Td>{job}</Td>
                  <Td isNumeric>{amounts[index]}</Td>
                </Tr>
              ))}
            </Tbody>
          </Table>
          <Box borderWidth="1px" borderRadius="md" p={4} borderColor="blue.800" mt={4} w="100%" mr="15%">
            <Flex justifyContent="space-between"><Text color="gray.500">Sub total:</Text><Text color="gray.500">${subTotal}</Text></Flex>
            <Flex justifyContent="space-between"><Text color="gray.500">GST 8%:</Text><Text color="gray.500">${gst}</Text></Flex>
          </Box>
          <Box borderWidth="1px" borderRadius="md" p={4} borderColor="blue.800" mt={4} w="100%" mr="15%">
            <Flex justifyContent="space-between"><Text fontSize="xl" fontWeight="bold">Grand total:</Text><Text fontSize="xl" fontWeight="bold">${grandTotal}</Text></Flex>
          </Box>
        </VStack>
      </SimpleGrid>
      <Flex mt={10} justifyContent="space-between">
        <Button colorScheme="red" ml="20%">Reject</Button>
        <Button colorScheme="green" mr="20%">Approve</Button>
      </Flex>
    </Box>
  );
}

export default Quotation;
