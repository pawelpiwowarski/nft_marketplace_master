import React, { Component } from "react"; 
import Link from 'next/link'
import { Button, Menu } from "semantic-ui-react";
import {withRouter } from 'next/router'
import Head from "next/head"







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
        <>
      <Head>

          <title>plateau-nft.art</title>
          <link rel="icon" type="image/png" sizes="32x32" href="/favicon-32x32.png" />
          <link rel="icon" type="image/png" sizes="16x16" href="/favicon-16x16.png" />
          <link rel="apple-touch-icon" sizes="180x180" href="/apple-touch-icon.png" />
          <link rel="manifest" href="/site.webmanifest" />
          <link rel="mask-icon" href="/safari-pinned-tab.svg" color="#5bbad5" />
          <meta name="theme-color" content="#ffffff" />
        </Head>
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
    </>
    )
    }

export default withRouter(Header);