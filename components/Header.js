import React, {useEffect} from "react"; 
import Link from 'next/link'
import {Icon, Menu, Dropdown, Image } from "semantic-ui-react";
import Head from "next/head"
import Modal_Profile from "./Modal";
import fetch_profile_details from '../utils/fetch_profile'
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
    return  <a href={`/profile/${address}`} className='item' > <Icon name="shop"></Icon>  Your NFTs </a>
    

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
  
    const [local_json, set_local_json] = React.useState('')



    useEffect(async ()=> {
        if (props.address){
        set_local_json(await fetch_profile_details(props.address.toLowerCase()))
        }
      }, [props.address])
    
      
   
 



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
    <a className='item' id="menu"> Plateau NFT </a>
    </Link>

    
    
    
    
    <Link href='/mint_nft'>
    <a color="blue" id="menu" className='item'> Mint a NFT </a>
    </Link>

    <Menu.Menu id="menu" position='right' >
  
    <Dropdown fluid  loading={props.loading} item text={props.metamaskflag ? local_json.name || props.address: 'Logging in ...'}>
  
    <Dropdown.Menu>
    <Image avatar floated="right" size="mini" src={ 'https://www.samenfiks.nl/wp-content/uploads/2020/02/no-profile-picture.jpg'}></Image>
   <Metamask_connect_button   address = {props.address} metamaskflag={props.metamaskflag}/>
   
   { props.metamaskflag &&
   <Modal_Profile auth = {props.auth} address={props.address}>

   </Modal_Profile>
}
<Link href={`https://pawelpiwowarski2000.gitbook.io/plateau_nft/`}><a target="_blank" className="item">
    <Icon name="book"></Icon>Documentation </a></Link>



   </Dropdown.Menu>
          </Dropdown>
    </Menu.Menu>
    
    
        </Menu>
    </>
    )
    }

export default Header;