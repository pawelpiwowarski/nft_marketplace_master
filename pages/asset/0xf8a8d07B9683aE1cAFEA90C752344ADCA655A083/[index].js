import React, { Component } from "react"; 
import Layout from '../../../components/Layout';
import {Form, Button, Input, Header, Message, Card, Grid, Image, Table} from 'semantic-ui-react'
import Link from 'next/link'
import { utils } from "ethers";
import instance from "../../../etherum_side/instance_of_the_contract";
import instance_of_marketplace from "../../../etherum_side/instance_of_the_marketplace";
import Web3 from "web3";
import fetch_metadata from "../../../utils/fetch_json";
import confidential from '../../../utils/credentials'
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
        price: "",
        asset_was_listed: false,
        asset_was_bought: false,
        dissmiss_flag: false,
        is_chainId_right: false,
        uri_to_JSON: [],
        contenttype: [],
        order_history: []
        
    }

    
    async componentDidMount() {
    
        const {array_of_metadatas, array_of_responses} = await fetch_metadata([this.props.uri], 1) // We  are manually inputing one here because we know that we are only fetching one NFT metadata

        const response = await fetch('http://0ba4-79-184-53-203.ngrok.io/orders/'+ this.props.index, {method: 'GET', headers: {'Authorization': 'Basic '+btoa(confidential), "Content-type": "application/json"}, });
        const response_to_json = await response.json()
        this.setState({order_history: response_to_json})

        
      
        this.setState({uri_to_JSON: array_of_metadatas[0], contentype: array_of_responses[0]})
        if (typeof window !== "undefined" && typeof window.ethereum !== "undefined") {
            const provider  = window.ethereum
            const chainId = await provider.request({ method: 'eth_chainId' })
            const accounts = await provider.request({method: 'eth_requestAccounts'})
            this.setState({is_chainId_right: chainId == "0x4", account_of_the_user:  utils.getAddress(accounts[0]), is_metamask_running: Boolean(this.state.account_of_the_user != undefined)})
        }
        

        if (typeof window !== "undefined" && typeof window.ethereum !== "undefined" && typeof this.state.account_of_the_user[0] != "undefined") {
            this.setState({does_user_has_metamask_installed: true}) 
            this.setState({is_user_logged_in: await instance.methods.balanceOf(this.state.account_of_the_user,this.props.index).call()})
          }
        
        let owner = await instance.methods._owners(this.props.index).call()        
        const {price, seller} = await instance_of_marketplace.methods._listingDetails(this.props.index).call()
        this.setState({price: price, owner: owner})

        
       
        if (price != 0) // Asset is listed 
        {
            this.setState({owner: seller, is_the_seller_logged_in: Boolean(this.state.account_of_the_user.toLowerCase() == seller.toLowerCase())})
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



is_file_a_video = () => {

    if (this.state.contentype == 'video/mp4')
    {
       return <video loop  autoPlay="autoplay" controls muted src={this.state.uri_to_JSON.image} ></video>
    }
   return <Image src={this.state.uri_to_JSON.image} /> 
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
        const date = new Date()
        const url = 'http://0ba4-79-184-53-203.ngrok.io/orders/'+ this.props.index +'?time='+ date +' &price='+ this.state.price +'&seller=' + this.state.owner +'&buyer=' +this.state.account_of_the_user
    await instance_of_marketplace.methods.buy_asset(this.props.index).send({from: accounts[0], value: this.state.price})
    this.setState({loading_flag: false, errorMessage: '', asset_was_bought: true})
    const response = await fetch(url,{method:'POST', headers: {'Authorization': 'Basic '+btoa(confidential)}} )

    


    }

    catch(err) {
        this.setState({loading_flag: false, errorMessage: '', error_message: err.message})
    }


}

dissmiss = ()=> {
    this.setState({asset_was_listed: false, asset_was_bought: false}) 
    window.location.reload()
}


render_history() {
   

            return <Table  margin-top= "250px" color="teal" size='small' padded> 
            <Table.Header>
              <Table.Row>
                <Table.HeaderCell>Time of the purchase</Table.HeaderCell>
                <Table.HeaderCell>Price of the purchase</Table.HeaderCell>
                <Table.HeaderCell>Seller address</Table.HeaderCell>
                <Table.HeaderCell>Buyer address</Table.HeaderCell>
              </Table.Row>
            </Table.Header>
            <Table.Body>
                {this.state.order_history.map((element, index)=>{
                    return <Table.Row>
                    <Table.Cell>{this.state.order_history[index].time.slice(0,25)}</Table.Cell>
                    <Table.Cell>{Web3.utils.fromWei(this.state.order_history[index].price, 'ether') + ' ETH'}</Table.Cell>
                    <Table.Cell> <a href={`/profile/${this.state.order_history[index].seller}`}>{this.state.order_history[index].seller.slice(0,9) + ' ...'}  </a> </Table.Cell>
                    <Table.Cell><a href={`/profile/${this.state.order_history[index].buyer}`}> { this.state.order_history[index].buyer.slice(0,9) + ' ...'}</a> </Table.Cell>
                    </Table.Row>
                })}
            </Table.Body>
            </Table>

            
    
    
    
  
            
        
}

onFormSubmit = async(event) => {
    event.preventDefault();
    this.setState({loading_flag: true, errorMessage: ''})

    try {
    const price_in_wei =  Web3.utils.toWei(this.state.price_of_the_listing, 'ether');
    const accounts = await window.ethereum.request({ method: 'eth_accounts' });
  
    await instance_of_marketplace.methods.list_asset(this.props.index, price_in_wei).send({from: accounts[0]})
    this.setState({asset_was_listed: true, loading_flag: false, errorMessage: ''})

    }

    catch(err){
        this.setState({loading_flag: false, errorMessage: '', error_message: err.message})
    }
   

}
render() {

    return(

        <Layout metamaskflag = {this.state.is_metamask_running} account={this.state.account_of_the_user}>
        <Grid>
        <Grid.Column width={8}>
        <Card 
        style = {{width: "100%"}}
        image = {this.is_file_a_video}
        extra = {<Link  href={`/profile/${this.state.owner}`}>
            {"Address of the owner: " + this.state.owner}
        </Link>} 
        header={this.state.uri_to_JSON.name}
        description = {this.state.uri_to_JSON.description} 
  
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
        this.state.price != 0 && !this.state.is_the_seller_logged_in && 
        <Button disabled = {!this.state.does_user_has_metamask_installed} onClick = {this.buy_the_asset}size="massive" color="teal" loading={this.state.loading_flag}> Buy the asset </Button>
        }
        
        
        <Form  error={!!this.state.error_message}> 
         <Message error header="Oops!" margin="10ptx" content={this.state.error_message}  />
         </Form>
         { this.state.asset_was_listed &&
  <Message color="green"   onDismiss = {this.dissmiss}  positive> Congratulation your NFT was successfully listed.</Message>
  }
  { this.state.asset_was_bought &&
  <Message color="green"   onDismiss = {this.dissmiss}  positive> Congratulation you have successfully bought an NFT. </Message>
  }
  
        
       </Grid.Column>
       {
        !this.state.dissmiss_flag && !this.state.does_user_has_metamask_installed && <Message onDismiss={() => {this.setState({dissmiss_flag: true})}} size='large' color='orange'> 
        It looks like you don't have Metamask installed in your browser. In order to access the marketplace you need to download this extension.</Message>
        }

        {
        !this.state.dissmiss_flag  && this.state.does_user_has_metamask_installed && !this.state.is_chainId_right && <Message onDismiss={() => {this.setState({dissmiss_flag: true})}} size='huge' color='red'> 
        Please connect to the Rinkeby test network and refresh the page! This site won't be rendered properly unless you do so! </Message>
        }

       </Grid>
       {this.render_history()}
        </Layout>


    )
}

}

export async function getServerSideProps(context) {
     
          let index = context.query.index || context.query.index_of_the_nft
         
     
        const uri = await instance.methods._tokens(index).call()
    return {
      props: {
        uri,
        index,

   }, // will be passed to the page component as props
    }
  }
export default asset