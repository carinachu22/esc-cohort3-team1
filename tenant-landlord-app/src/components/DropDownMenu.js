import {
    Menu,
    MenuButton,
    MenuList,
    MenuItem,
    MenuItemOption,
    MenuGroup,
    MenuOptionGroup,
    MenuDivider,
  } from '@chakra-ui/react'


import React, { useEffect } from 'react';


// Import bootstrap for automatic styling
import "bootstrap/dist/css/bootstrap.min.css";

/**
 * Drop down menu that takes in an array of items
 * @param {*} items an array of items 
 * @returns 
 */
export default function DropDownMenu({items}){

  return (
    <>
    <Menu>
        <MenuButton as={Button} rightIcon={<ChevronDownIcon />}>
            Actions
        </MenuButton>
        <MenuList>
            {items.map((item, index) => (
                <MenuItem key={index}>{item}</MenuItem>     //generate a list of menu items based on the input array
            ))}
        </MenuList>
    </Menu>
    </>
  )
}