import React, { Component } from "react"; 

import { Menu } from "semantic-ui-react";

const Header = (props) => {

    return (
        <Menu style={{ marginTop: '10px'}}>
    
    <a className='item'> Plateau NFT </a>
    
    
    
    <Menu.Menu position='right'>
 
 
   
    

    <a className='item'> Your profile </a>
   
    </Menu.Menu>
    
    
        </Menu>
    )
    }

export default Header;