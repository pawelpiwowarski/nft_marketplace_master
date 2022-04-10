import React, { Component } from "react"; 
import Layout from '../components/Layout';
import { Header, Message, Card, Icon} from 'semantic-ui-react'
import instance from "../etherum_side/instance_of_the_contract";
import instance_of_profile_authenictaion from '../etherum_side/instance_of_the_profile'
import Link from 'next/link'
import { utils } from "ethers";
import fetch_metadata from "../utils/fetch_json";
import fetch_profile_details from '../utils/fetch_profile'
import Pagination from "../components/Pagination";

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
    profile_details: '',
    local_json: '',



   }
   
   async componentDidMount() {

    if (typeof window !== "undefined" && typeof window.ethereum !== "undefined") {
      
      const provider  = window.ethereum
      const accounts = await provider.request({method: 'eth_requestAccounts'})
   
      const chainId = await provider.request({ method: 'eth_chainId' })
     
      this.setState({local_json: await fetch_profile_details(accounts[0]),user_loaded: true, is_chainId_right: chainId == "0x4", account:  utils.getAddress(accounts[0]), is_metamask_running: Boolean(this.state.account != undefined),does_user_has_metamask_installed: true, 
    })

     this.setState({authenication_flag: this.state.is_chainId_right ? await instance_of_profile_authenictaion.methods.verification_map(accounts[0]).call(): false})

     
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
     
      const {array_of_metadatas, array_of_responses} = await fetch_metadata(this.props.array_of_uris, this.props.numbers_of_tokens, this.state.current_range)
  
    this.setState({array_of_metadatas, array_of_responses, page_loading_flag: false, opensea_url: "https://rinkeby.etherscan.io/token/" + this.props.instance_address})
        }
   
        
        is_file_a_video(index) {

          if (this.state.array_of_responses[index] == 'video/mp4')
            return <video src={this.state.array_of_metadatas[index].image} ></video>
         return this.state.array_of_metadatas[index].image

          

       }
    renderNFT() {

      

      


        return  <Card.Group itemsPerRow={3} >{this.state.array_of_metadatas.map((element, index) => 
            {return <Link href = {`/asset/${this.props.instance_address}/${this.state.index}`} >
                <a onMouseEnter={() => this.setState({index: index})}> <Card     
        style={{margin: "25px"}}
        key={index} 
        image = {this.is_file_a_video(index)}
        description={this.state.array_of_metadatas[index].description} 
        header={this.state.array_of_metadatas[index].name}/> </a></Link>})}</Card.Group>;

    }
   
    
    
    metamaskinfo()
    {

        return <a target='_blank' href='https://chrome.google.com/webstore/detail/metamask/nkbihfbeogaeaoehlefnkodbefgpgknn'><Message size='large' color='orange'> 
            It looks like you don't have Metamask installed in your browser. In order to access the marketplace you need to download this extension. You can download it by clicking on this banner </Message></a>
    }
    

render(){

    return(
   
        <Layout loading = {!this.state.user_loaded}local_json={this.state.local_json} metamaskflag = {this.state.is_metamask_running} account={this.state.account} auth={this.state.authenication_flag} profile_details={this.state.profile_details}>

        {!this.state.is_chainId_right &&  this.state.does_user_has_metamask_installed && <a target="_blank" href='https://faucets.chain.link/rinkeby' ><Message color='red' size='big' 
        content="In order to access the marketplace, you need to connect your Metamask wallet to Rinkeby network. The marketplace will not work unless you switch the networks.
        You can get some sample ETH to work with using this link https://faucets.chain.link/rinkeby"/></a> }
        {!this.state.does_user_has_metamask_installed && !this.state.page_loading_flag && this.metamaskinfo()}
  
  
        <Header color='teal' as='h1'> Welcome to plateau-nft.art - simple NFT marketplace and minting framework working on Ethereum's Rinkeby test network. </Header>
        <Header as='h2'> There have been {this.props.numbers_of_tokens} NFTs minted so far. Currently in order to list an asset you need to mint something on the marketplace as well.</Header>
        <Header as='h3'> Address of the NFT contract: <a href={this.state.opensea_url} target="_blank"> {this.props.instance_address} </a> </Header>
        
          {this.state.page_loading_flag && <Message  color='teal' size='huge' icon>
    <Icon name='circle notched' loading />
    <Message.Content>
      <Message.Header>Just one second</Message.Header>
      We are fetching the NFT data for you
    </Message.Content>
  </Message>}
         {this.renderNFT()} { /* 
         <Pagination num = {this.props.numbers_of_tokens} callback={(page)=> {
     
           this.setState({active_page: page.activePage}, async ()=> {
        
            const {array_of_metadatas, array_of_responses} = await fetch_metadata(this.props.array_of_uris, 6, this.state.active_page)
            console.log(array_of_metadatas)
            //this.setState({array_of_metadatas, array_of_responses})
           })
          
         }}></Pagination >
        */ } 
         <Header size='large'  color="blue"> Marketplace written by Pawel Piwowarski contact at pawelpiwowarski2000@gmail.com - all rights reserved -
        <a href="https://github.com/pawelpiwowarski" target="_blank">  link to GitHub page. </a> </Header>
       
        </Layout>
 
        
    )

  
}
}
export async function getServerSideProps(context) {
    const instance_address = instance._address;
    const numbers_of_tokens = await instance.methods.Token_Id().call();

     
        const array_of_uris = await Promise.all(Array(parseInt(numbers_of_tokens)).fill().map((element, index) => { return instance.methods._tokens(index).call()}))
       

   return {
     props: {instance_address,
        numbers_of_tokens,
        array_of_uris
   
  }, // will be passed to the page component as props
   }
 }
export default home_page