import React, { Component } from "react"; 
import Layout from '../components/Layout';
import { Header, Message, Card, Icon, Image, Container} from 'semantic-ui-react'
import instance from "../etherum_side/instance_of_the_contract";
import Link from 'next/link'
import { utils } from "ethers";
import { set_tokens} from "../utils/autheniticate";
import {get_access_token} from '../utils/access_token'
import { fetch_all_spaces } from "../utils/space/space_fetch";
import {CHAIN_ID} from '../etherum_side/addresses'
import url from '../utils/fetch'

class home_page extends Component {
    
   state = {
    
    index: 0,
    loadingflag : true,
    opensea_urls: '',
    account: '',
    is_chainId_right: false,
    is_metamask_running: false,
    does_user_has_metamask_installed: false,
    array_of_responses: [],
    array_of_metadatas: [],
    page_loading_flag: true,
    user_loaded: false,
    authenication_flag: false,
    access_token: ''



   }
   
   async componentDidMount() {
  
    this.setState({array_of_metadatas: this.props.array_of_uris})



    if (typeof window !== "undefined" && typeof window.ethereum !== "undefined") {
      
      const provider  = window.ethereum
      const accounts = await provider.request({method: 'eth_requestAccounts'})

      await set_tokens(accounts[0])
     

      const chainId = await provider.request({ method: 'eth_chainId' })
      
    
      this.setState({access_token: get_access_token(),user_loaded: true, is_chainId_right: chainId === CHAIN_ID, account:  utils.getAddress(accounts[0]), is_metamask_running: Boolean(this.state.account != undefined),does_user_has_metamask_installed: true, 
    })

    if (!this.state.is_chainId_right) {

      return this.setState({page_loading_flag: false})
    }
    this.setState({authenication_flag: await instance.methods.Users_Approved_To_Mint(accounts[0]).call()})


     
        window.ethereum.on('accountsChanged', function (accounts) {
    
          window.location.reload();

          });
          ethereum.on('chainChanged', (chainId) => {
            // Handle the new chain.
            // Correctly handling chain changes can be complicated.
            // We recommend reloading the page unless you have good reason not to.
            window.location.reload();
          });
        }
     
    this.setState({ opensea_url: "https://mumbai.polygonscan.com/token/" + this.props.instance_address, page_loading_flag: false})
        }
   
        
  
    renderNFT() {

      


        return  <Card.Group centered  style={{width: "100%", height: "100%"}} itemsPerRow={3} >{this.state.array_of_metadatas.map((element, index) => 
            {return <Link     key={index} href = {`/space/${element._id}`} >
          <a onMouseEnter={() => this.setState({index: index})}> 

          <Card   color="teal"raised style={{margin: "25px", width: "300px",overflowWrap: "break-word"}}
        key={index} 
      
      
        >
        <Image style={{height: "250px", width: "300px"}}src={`${url}/space/image/${element._id}`}></Image>
        <Card.Content>
        <Card.Header>{this.state.array_of_metadatas[index].description}</Card.Header>
        <Card.Description>{`Created by : ${this.state.array_of_metadatas[index]._id}`}</Card.Description>
        </Card.Content>
        </Card>
     </a></Link>})}</Card.Group>;

    }
   
    
    
    metamaskinfo()
    {

        return <a target='_blank' href='https://chrome.google.com/webstore/detail/metamask/nkbihfbeogaeaoehlefnkodbefgpgknn'><Message size='large' color='orange'> 
            It looks like you don't have Metamask installed in your browser. In order to access the marketplace you need to download this extension. You can download it by clicking on this banner </Message></a>
    }
    

render(){

    return(
   
        <Layout loading = {!this.state.user_loaded } auth = {this.state.authenication_flag} metamaskflag = {this.state.is_metamask_running} account={this.state.account}  >

        {!this.state.is_chainId_right &&  this.state.does_user_has_metamask_installed && <a target="_blank" href='https://polygon.technology/' ><Message color='purple' size='big' 
        content="In order to access the marketplace, you need to connect your Metamask wallet to the Polygon network. The marketplace will not work correctly unless you switch the networks."/></a> }
        {!this.state.does_user_has_metamask_installed && !this.state.page_loading_flag && this.metamaskinfo()}
  
  
        <Header icon textAlign ="center" color='teal' as='h1'>   Welcome to plateau-nft.art! Simple proof of skill minimalistic NFT marketplace and minting framework working on the Polygon network.</Header>
        <Header style={{color: 'teal'}}textAlign="left" color="teal" as="h2"> Plateau Spotlight Collections: </Header>
          {this.state.page_loading_flag && <Message  color='teal' size='huge' icon>
    <Icon name='circle notched' loading />
    <Message.Content>
      <Message.Header>Just one second</Message.Header>
      We are fetching the NFT data for you
    </Message.Content>
  </Message>}
         {this.renderNFT()} 





  <div className="footer">


<ul>

  <a  style={{color: 'black'}}target="_blank" href="https://github.com/pawelpiwowarski/nft_marketplace_master"><li> <Icon name="code branch"></Icon>Github</li></a>
 <a style={{color: 'black'}} href="mailto:support@plateau-nft.art"> <li><Icon name="mail"></Icon> Email</li></a>
 <a style={{color: 'black'}}target="_blank" href="https://twitter.com/ArtPlateau"> <li><Icon name="twitter"></Icon> Twitter</li></a>
 <a style={{color: 'black', hoover: {color: "violet"}}} target="_blank" href={this.state.opensea_url}><li><Icon name="compass"></Icon>PolygonScan</li></a>        

</ul>
</div>



  
        </Layout>
 
        
    )

  
}
}
export async function getServerSideProps(context) {

    const spaces_data = await fetch_all_spaces()
    const instance_address = instance._address;
    const numbers_of_tokens = spaces_data.length;



   return {
     props: {instance_address,
        numbers_of_tokens,
        array_of_uris:spaces_data
   
  }
   }


 }
export default home_page