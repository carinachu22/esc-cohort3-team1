import {
    Menu,
    MenuButton,
    MenuList,
    MenuItem,
    MenuItemOption,
    MenuGroup,
    MenuOptionGroup,
    MenuDivider,
    Button,
    useToast
  } from '@chakra-ui/react'


import {ChevronDownIcon} from '@chakra-ui/icons'
import PropTypes from 'prop-types';

import React, { useEffect, useState } from 'react';
import axios, {AxiosError} from "axios";

// Import bootstrap for automatic styling
import "bootstrap/dist/css/bootstrap.min.css";

/**
 * Drop down menu that takes in parameters inside items. (e.g. items.type, items.items, items.ticketID)
 * @param {*} items an array of items 
 * @returns 
 */
export default function DropDownMenu(items){
  const [error, setError] = useState("");
  console.log('items', items)
  const [selectedItem, setSelectedItem] = useState("")
  const toast = useToast();

  //click event for button to call different APIs
  const onButtonClick = async (event) => {
    console.log("clicked", selectedItem)
    console.log(event.target.disabled)
    let URL = ''

    //call different API based on the parameter: items.type
    //add a new case if you want another use for this drop down menu
    switch (items.type){
      case "Assign Staff":
        URL = "http://localhost:5000/api/landlord/assignLandlord?landlordEmail=" + selectedItem +  "&ticketID=" + items.ticketID
        console.log("selected item: ", selectedItem)
        console.log("ticketID: ", items.ticketID)
        break
      case "Assign To Self":
        URL = "http://localhost:5000/api/landlord/assignLandlord?landlordEmail=" + selectedItem +  "&ticketID=" + items.ticketID
        console.log("selected item: ", selectedItem)
        console.log("ticketID: ", items.ticketID)
        break
      default:
        break
    }

    const response = await axios.patch(URL)
    console.log(response)
    if(response.status === 200){
      items.refreshParent()
      toast({
        title: "Ticket assigned to " + selectedItem,
        status: "success",
        duration: 3000,
        isClosable: true,
        position: "top",
        })
    }
    else {
      toast({
        title: "Unable to assign ticket!",
        status: "success",
        duration: 3000,
        isClosable: true,
        position: "top",
        })
    }
    //return response

  }

  //change the value of the Menu Button based on the item clicked
  const handleSelectChange = event => {
    event.preventDefault()
    setSelectedItem(event.target.value)
  }



  console.log(selectedItem === '')

  return (
    <>
    <Menu>
        <MenuButton as={Button} rightIcon={<ChevronDownIcon />} colorScheme='blue'>
          {selectedItem === "" ? items.type : selectedItem}
        </MenuButton>
          <MenuList>
             {items.items.map((item, index) => (
                  <MenuItem key={index} onClick={handleSelectChange} value={item}>{item}</MenuItem>     //generate a list of menu items based on the input array
                ))
              }
          </MenuList>
    </Menu>
    <Button marginLeft="2em" display="inline" isDisabled ={selectedItem === ''} colorScheme='blue' onClick={onButtonClick}>
      Confirm Assignment
    </Button>
    </>
  )
}

//set the items type
DropDownMenu.propTypes = {
  items: PropTypes.arrayOf(PropTypes.string).isRequired,
  type: PropTypes.string.isRequired
};


//set default value
DropDownMenu.defaultProps = {
  items: [], // Set an empty array as the default value
  type: "Dropdown"
};