import React, { Component } from "react"; 
import Layout from '../components/Layout';
import {Form, Button, Input, Container, Header, Message, Card, Icon} from 'semantic-ui-react'
import instance from "../etherum_side/instance_of_the_contract";
import Link from 'next/link'
import web3 from "../etherum_side/web3";
import Router, {withRouter } from 'next/router'

class home_page extends Component {
    
   state = {
    
    index: 0,
    loadingflag : true,
    opensea_urls: '',
    account: '',
    is_chainId_right: false,
    is_metamask_running: true,
    does_user_has_metamask_installed: false

   }
   
   async componentDidMount() {
    if (typeof window !== "undefined" && typeof window.ethereum !== "undefined") {
        this.setState({does_user_has_metamask_installed: true})
        if (window.ethereum.chainId =="0x4")
        {
            this.setState({is_chainId_right: true})
        }
        window.ethereum.on('accountsChanged', function (accounts) {
    
            Router.reload(window.location.pathname);

          });
          ethereum.on('chainChanged', (chainId) => {
            // Handle the new chain.
            // Correctly handling chain changes can be complicated.
            // We recommend reloading the page unless you have good reason not to.
            window.location.reload();
          });
        }
   const provider  = window.ethereum
   const accounts = await provider.request({method: 'eth_requestAccounts'})
    this.setState({account:  accounts[0]})

    this.setState({ is_metamask_running: Boolean(this.state.account != undefined)})
    this.setState({opensea_url: "https://rinkeby.etherscan.io/token/" + this.props.instance_address})    
        }
   

    renderNFT() {
    
        return <Card.Group itemsPerRow={3} >{this.props.array_of_metadatas.map((element, index) => 
            {return <Link href = {`/asset/${this.props.instance_address}/${this.state.index}`} >
                <a onMouseEnter={() => this.setState({index: index})}> <Card     
        style={{margin: "25px" }}
        
        key={index} 
        image = {this.props.array_of_metadatas[index].image}  
        description={this.props.array_of_metadatas[index].description} 
        header={this.props.array_of_metadatas[index].name}/> </a></Link>})}</Card.Group>;

    }
   
    
    
    metamaskinfo()
    {

        return <a target='_blank' href='https://chrome.google.com/webstore/detail/metamask/nkbihfbeogaeaoehlefnkodbefgpgknn'><Message size='large' color='orange'> 
            It looks like you don't have Metamask installed in your browser you can download it by clicking on this banner </Message></a>
    }
    

render(){

    return(

        <Layout metamaskflag = {this.state.is_metamask_running} account={this.state.account}>

        {!this.state.is_chainId_right &&  this.state.does_user_has_metamask_installed && <Message color='red' size='large' 
        content="In order to access the marketplace, you need to connect your Metamask wallet to Rinkeby network! " />}
        {!this.state.does_user_has_metamask_installed && this.metamaskinfo()}
  
  

        <Header as='h1'> There have been {this.props.numbers_of_tokens} NFTs minted so far</Header>
        <Header as='h3'> Adress of the NFT contract: <a href={this.state.opensea_url} target="_blank"> {this.props.instance_address} </a> </Header>
        
         {this.renderNFT()} 
         <Header as="h4" color="blue"> Markeplace written by Pawel Piwowarski contact at pawelpiwowarski2000@gmail.com - all rights reserved -
        <a href="https://github.com/pawelpiwowarski" target="_blank">  link to Git Hub page. </a></Header>
        </Layout>
    )


}
}
export async function getServerSideProps(context) {
    const instance_address = instance._address;
        const numbers_of_tokens = await instance.methods.Token_Id().call();
    
        const array_of_metadatas = []
      
       


        const array_of_uris = await Promise.all(Array(parseInt(numbers_of_tokens)).fill().map((element, index) => { return instance.methods._tokens(index).call()}))

        async function fetchJSON(url) {
           
            const response = await fetch(url, {method: "GET", headers: {"Content-type": "application/json"}});
        
            const response_to_json = await response.json();
          
            return response_to_json;
          }
        
        
          for (let i=0; i < numbers_of_tokens; i++) {
            let uri = await fetchJSON(array_of_uris[i])
            array_of_metadatas.push(uri)
          }



   return {
     props: {instance_address,
        numbers_of_tokens,
        array_of_metadatas
  }, // will be passed to the page component as props
   }
 }
export default withRouter(home_page)