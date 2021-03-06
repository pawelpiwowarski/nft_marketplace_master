import React from "react"; 
import Link from 'next/link'
import {Icon, Menu, Dropdown, Image } from "semantic-ui-react";
import Head from "next/head"
import Modal_Profile from "./Modal";
import server_url from '../utils/fetch'
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
    <a className='item' > <Icon name="shop"></Icon>  Your NFTs </a>
    
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
        <Menu size='massive' inverted>

    
    <Menu.Item active={true} color='teal' />

    
    <Link href='/'>
    <a className='item'> Plateau NFT </a>
    </Link>

    
    
    
    
    <Link href='/mint_nft'>
    <a color="blue" className='item'> Mint a NFT </a>
    </Link>

    <Menu.Menu position='right' >
  
    <Dropdown fluid  loading={props.loading} item text={props.metamaskflag && !props.loading ? props.local_json.username ||'Plateau Profile': 'Logging in ...'}>
  
    <Dropdown.Menu inverted>
    <Image avatar floated="right" wraped size="mini" src={server_url  + props.local_json.url}></Image>
   <Metamask_connect_button   address = {props.address} metamaskflag={props.metamaskflag}/>
   
   { props.metamaskflag &&
   <Modal_Profile local_json ={ props.local_json} auth = {props.auth} address={props.address}>

   </Modal_Profile>
}
<Link href={`https://pawelpiwowarski2000.gitbook.io/plateau_nft/`}><a target="_blank" class="item"><Icon name="book"></Icon>Documentation </a></Link>

    

   </Dropdown.Menu>
          </Dropdown>
    </Menu.Menu>
    
    
        </Menu>
    </>
    )
    }

export default Header;