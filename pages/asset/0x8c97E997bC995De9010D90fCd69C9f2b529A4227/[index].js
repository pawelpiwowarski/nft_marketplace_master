import React, { Component } from "react"; 
import Layout from '../../components/Layout';
import {Form, Button, Input, Container, Header, Message, Card, Grid} from 'semantic-ui-react'
import {Link} from '../../routes'
import web3 from "../../etherum_side/web3";
import instance from "../../etherum_side/instance_of_the_contract";
import instance_of_marketplace from "../../etherum_side/instance_of_the_marketplace";
import {Router} from '../../routes';
import Web3 from "web3";

class asset extends Component {


    state = {
        price: "",
        loading_flag: false,
        error_message: ""
    }

    
    async componentDidMount() {
        
        Router.pushRoute(`/asset/${this.props.instance_addres}/${this.props.index}`);
        
            }

    static async getInitialProps(props) {
        async function fetchJSON(url) {
           
            const response = await fetch(url, {method: "GET", headers: {"Content-type": "application/json"}});
        
            const response_to_json = await response.json();
            
            return response_to_json;
          }
          let is_user_logged_in  = 0
          const account = await web3.eth.getAccounts()
          let does_user_has_metamask_installed = false
          const index = props.query.index_of_the_nft

          if (typeof window !== "undefined" && typeof window.ethereum !== "undefined" && typeof account[0] != "undefined") {
            does_user_has_metamask_installed = true
            is_user_logged_in = await instance.methods.balanceOf(account[0],index).call()
            console.log(does_user_has_metamask_installed)


          }
        const instance_addres = props.query.instance_address
        
        const uri = await instance.methods._tokens(index).call()
        const uri_to_JSON = await fetchJSON(uri)
        const is_metamask_running = Boolean(account.length !== 0)
        let owner = await instance.methods._owners(index).call()
        const {price, seller} = await instance_of_marketplace.methods._listingDetails(index).call()
        const is_the_seller_logged_in = account == seller
        if (price != 0) // Asset is listed 
        {
        owner = seller
        }
        else if (price == 0)// Asset was delisted 
        {
        owner = seller
        }
        return {
            account,is_metamask_running,instance_addres,
            index,uri_to_JSON,owner,
            price,seller,is_user_logged_in,
            is_the_seller_logged_in,
        does_user_has_metamask_installed }
        
    }


async link_address_to_profile(){

    return <Link route={`/profile/${this.props.owner}`}>
    <a className='item' > {this.props.owner}</a>

    </Link>
}





is_asset_listed() {
 
    if (this.props.price != 0) // Asset is currently listed 
    {
    
        return (
        <Header size="huge" color="teal">
        Current Price:  {Web3.utils.fromWei(this.props.price, 'ether')} ETH
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
    await instance_of_marketplace.methods.buy_asset(this.props.index).send({from: accounts[0], value: this.props.price})
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
    const price_in_wei =  Web3.utils.toWei(this.state.price, 'ether');
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

        <Layout metamaskflag = {this.props.is_metamask_running} account={this.props.account}>
        <Grid>
        <Grid.Column width={8}>
        <Card 
        style = {{width: "100%"}}
        image = {this.props.uri_to_JSON.image}
        extra = {<Link route={`/profile/${this.props.owner}`}>
            {"Address of the owner: " + this.props.owner}
        </Link>} 
        header={this.props.uri_to_JSON.name}
        description = {this.props.uri_to_JSON.description} 
  
        />
        </Grid.Column>
        <Grid.Column width={4}>
        {this.is_asset_listed()}
        {this.props.is_user_logged_in == 1 &&
        <Form onSubmit={this.onFormSubmit} error={!!this.state.error_message}>
        <Form.Field> 
        <label>Price for which you want to list the asset in ETH</label> 
        <Input value={this.state.price} onChange={event => this.setState({price: event.target.value})}/>
        </Form.Field>
        <Button content="List an asset" primary loading={this.state.loading_flag}></Button>
        </Form>
        }
        {
        this.props.price != 0 && !this.props.is_the_seller_logged_in && this.props.does_user_has_metamask_installed &&
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

export default asset