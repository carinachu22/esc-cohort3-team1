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
  } from '@chakra-ui/react'

import axios, { AxiosError } from "axios";

import {ChevronDownIcon} from '@chakra-ui/icons'
import PropTypes from 'prop-types';

import React, { useEffect, useState } from 'react';

import { useFormik } from "formik";

// Import bootstrap for automatic styling
import "bootstrap/dist/css/bootstrap.min.css";

/**
 * Drop down menu that takes in an array of items
 * @param {*} items an array of items 
 * @returns 
 */
export default function DropDownMenu(items){
  const [error, setError] = useState("");
  console.log('items', items)


  return (
    <>
    <Menu>
        <MenuButton as={Button} rightIcon={<ChevronDownIcon />} colorScheme='blue'>
          Assign Landlord
        </MenuButton>
          <MenuList>
             {items.items.map((item, index) => (
                  <MenuItem key={index}>{item}</MenuItem>     //generate a list of menu items based on the input array
                ))
              }
          </MenuList>
    </Menu>
    </>
  )
}

//set the items type
DropDownMenu.propTypes = {
  items: PropTypes.arrayOf(PropTypes.string).isRequired,
};


//set default value
DropDownMenu.defaultProps = {
  items: [], // Set an empty array as the default value
};