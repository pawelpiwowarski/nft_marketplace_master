import React, { Component } from "react"; 
import {Link} from '../routes'
import { Button, Menu } from "semantic-ui-react";
import {Router} from '../routes';







const connectMetamask = async () => {

    try {

        await ethereum.request({ method: 'eth_requestAccounts' });
        Router.pushRoute('/');
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
    return <Link route={`/profile/${address}`}>
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
        <Menu inverted>

    
    <Menu.Item active={true} color='teal' />

    
    <Link route='/'>
    <a className='item'> Plateau NFT </a>
    </Link>

    
    
    
    
    <Link route='/mint_nft'>
    <a color="blue" className='item'> Mint a NFT </a>
    </Link>

    <Menu.Menu position='right'>
   
   <Metamask_connect_button   address = {props.address} metamaskflag={props.metamaskflag}/>

    </Menu.Menu>
    
    
        </Menu>
    )
    }

export default Header;
