import React, { Component } from "react"; 
import Link from 'next/link'
import { Button, Menu } from "semantic-ui-react";
import {withRouter } from 'next/router'







const connectMetamask = async () => {

    try {

        await ethereum.request({ method: 'eth_requestAccounts' });
       
    }

    catch(error) {

        console.log(error);
    }


}

const  Metamask_connect_button = (props) => {

const address = props.address
const metamaskflag = props.metamaskflag

if (typeof window !== "undefined" && typeof window.ethereum !== "undefined") 
{
if (metamaskflag) 
{
    return <Link href={`/profile/${address}`}>
    <a className='item' > Your Profile        {props.address}</a>

    </Link>
}
else 
{
    return <a  onClick = {connectMetamask} className="item"> Connect your wallet</a> 
}
}
else 
{
    return <a  onClick = {connectMetamask} className="item"> Connect your wallet</a> 
}


}

const Header = (props) => {


    
    return (
        <Menu size='large' inverted>

    
    <Menu.Item active={true} color='teal' />

    
    <Link href='/'>
    <a className='item'> Plateau NFT </a>
    </Link>

    
    
    
    
    <Link href='/mint_nft'>
    <a color="blue" className='item'> Mint a NFT </a>
    </Link>

    <Menu.Menu position='right'>
   
   <Metamask_connect_button   address = {props.address} metamaskflag={props.metamaskflag}/>

    </Menu.Menu>
    
    
        </Menu>
    )
    }

export default withRouter(Header);