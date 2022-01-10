import React, { Component } from "react"; 
import Layout from '../../../components/Layout';
import {Form, Button, Input, Container, Header, Message, Card, Grid} from 'semantic-ui-react'
import Link from 'next/link'
import { utils } from "ethers";
import instance from "../../../etherum_side/instance_of_the_contract";
import instance_of_marketplace from "../../../etherum_side/instance_of_the_marketplace";
import Router, {withRouter } from 'next/router'
import Web3 from "web3";

class asset extends Component {


    state = {
        price_of_the_listing: "",
        loading_flag: false,
        error_message: "",
        account_of_the_user: "",
        does_user_has_metamask_installed: false,
        is_metamask_running: false,
        is_user_logged_in: 0,
        is_the_seller_logged_in: false,
        owner: "",
        price: ""
        
    }

    
    async componentDidMount() {
        if (typeof window !== "undefined" && typeof window.ethereum !== "undefined") {
            const provider  = window.ethereum
            const accounts = await provider.request({method: 'eth_requestAccounts'})
            this.setState({account_of_the_user:  utils.getAddress(accounts[0])})
            this.setState({ is_metamask_running: Boolean(this.state.account_of_the_user != undefined)})
        }
        

        if (typeof window !== "undefined" && typeof window.ethereum !== "undefined" && typeof this.state.account_of_the_user[0] != "undefined") {
            
            this.setState({does_user_has_metamask_installed: true})
            this.setState({is_user_logged_in: await instance.methods.balanceOf(this.state.account_of_the_user,this.props.index).call()})
            
          }
        
        
        
        let owner = await instance.methods._owners(this.props.index).call()
        
        const {price, seller} = await instance_of_marketplace.methods._listingDetails(this.props.index).call()
        this.setState({price: price})
        this.setState({owner: owner})
        
        
       
        if (price != 0) // Asset is listed 
        {
            this.setState({owner: seller})
            this.setState({is_the_seller_logged_in: Boolean(this.state.account_of_the_user.toLowerCase() == seller.toLowerCase())})
        }
        else if (price == 0 && seller != "0x0000000000000000000000000000000000000000")/// Asset was delisted 
        {
            this.setState({owner: seller})
        }
        
            }




async link_address_to_profile(){

    return <Link href={`/profile/${this.props.owner}`}>
    <a className='item' > {this.props.owner}</a>

    </Link>
}





is_asset_listed() {
 
    if (this.state.price != 0) // Asset is currently listed 
    {
    
        return (
        <Header size="huge" color="teal">
        Current Price:  {Web3.utils.fromWei(this.state.price, 'ether')} ETH
        </Header>
        )
    }

    else {
        return <Header size="large" color="orange">
        Asset is not currently on sale
        </Header>
    }

}


buy_the_asset = async()=> {

    this.setState({loading_flag: true, errorMessage: ''})
    try {
    const accounts = await window.ethereum.request({ method: 'eth_accounts' });
    await instance_of_marketplace.methods.buy_asset(this.props.index).send({from: accounts[0], value: this.state.price})
    this.setState({loading_flag: false, errorMessage: ''})

    }

    catch(err) {
        this.setState({loading_flag: false, errorMessage: ''})
        this.setState({error_message: err.message})
    }


}

onFormSubmit = async(event) => {
    event.preventDefault();
    this.setState({loading_flag: true, errorMessage: ''})

    try {
    const price_in_wei =  Web3.utils.toWei(this.state.price_of_the_listing, 'ether');
    const accounts = await window.ethereum.request({ method: 'eth_accounts' });
    
    await instance_of_marketplace.methods.list_asset(this.props.index, price_in_wei).send({from: accounts[0]})
    this.setState({loading_flag: false, errorMessage: ''})

    }

    catch(err){
        this.setState({loading_flag: false, errorMessage: ''})
        this.setState({error_message: err.message})
    }
   

}
render() {

    return(

        <Layout metamaskflag = {this.state.is_metamask_running} account={this.state.account_of_the_user}>
        <Grid>
        <Grid.Column width={8}>
        <Card 
        style = {{width: "100%"}}
        image = {this.props.uri_to_JSON.image}
        extra = {<Link  href={`/profile/${this.state.owner}`}>
            {"Address of the owner: " + this.state.owner}
        </Link>} 
        header={this.props.uri_to_JSON.name}
        description = {this.props.uri_to_JSON.description} 
  
        />
        </Grid.Column>
        <Grid.Column width={4}>
        {this.is_asset_listed()}
        {this.state.is_user_logged_in == 1 &&
        <Form onSubmit={this.onFormSubmit} error={!!this.state.error_message}>
        <Form.Field> 
        <label>Price for which you want to list the asset in ETH</label> 
        <Input value={this.state.price_of_the_listing} onChange={event => this.setState({price_of_the_listing: event.target.value})}/>
        </Form.Field>
        <Button  size='huge' color='teal' content="List the asset"  loading={this.state.loading_flag}></Button>
        </Form>
        }
        {
        this.state.price != 0 && !this.state.is_the_seller_logged_in && this.state.does_user_has_metamask_installed &&
        <Button onClick = {this.buy_the_asset}size="massive" color="teal" loading={this.state.loading_flag}> Buy the asset </Button>
        }
        <Form  error={!!this.state.error_message}> 
         <Message error header="Oops!" margin="10ptx" content={this.state.error_message}  />
         </Form>
        
       </Grid.Column>
       </Grid>
        </Layout>


    )
}

}

export async function getServerSideProps(context) {
     async function fetchJSON(url) {
            
            const response = await fetch(url, {method: "GET", headers: {"Content-type": "application/json"}});
        
            const response_to_json = await response.json();
            
            return response_to_json;
          }

   

          let index = context.query.index
          if (index == undefined) {
              index = context.query.index_of_the_nft
          }
     
          
 
          
    
        const uri = await instance.methods._tokens(index).call()
        const uri_to_JSON = await fetchJSON(uri)
     
  


    return {
      props: {
        index,
        uri_to_JSON,
   }, // will be passed to the page component as props
    }
  }
export default withRouter(asset)