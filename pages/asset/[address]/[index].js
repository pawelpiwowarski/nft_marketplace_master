import React, { Component } from "react"; 
import Layout from '../../../components/Layout';
import {Form, Icon, Button, Input, Header, Message, Card, Grid, Image, Table} from 'semantic-ui-react'
import Link from 'next/link'
import { utils } from "ethers";
import instance from "../../../etherum_side/instance_of_the_contract";
import instance_of_marketplace from "../../../etherum_side/instance_of_the_marketplace";
import Web3 from "web3";
import Actions from '../../../components/asset_utils/actions_button'
import {fetch_metadata_for_specific_token} from '../../../utils/minting/post_centralized_metadata'
import {  fetch_transaction_history_from_the_graph, is_user_approved } from "../../../utils/grapql_query";
import { fetch_sales_for_id } from "../../../utils/sales_grqpqlquery";
import timestamp from 'unix-timestamp'
import { set_tokens} from "../../../utils/autheniticate";
import {get_access_token} from '../../../utils/access_token'
import {CHAIN_ID} from '../../../etherum_side/addresses'
import { sale_fetch } from "../../../utils/sale_fetch/sale_fetch";

class asset extends Component {


    state = {
        price_of_the_listing: "",
        loading_flag: false,
        error_message: "",
        account_of_the_user: "",
        does_user_has_metamask_installed: false,
        is_metamask_running: false,
        is_user_logged_in: 0,
        owner: "",
        price: "",
        asset_was_listed: false,
        asset_was_bought: false,
        dissmiss_flag: false,
        is_chainId_right: false,
        order_history: [],
        authenication_flag: false,
        asset_info_loaded: false,
        user_loaded: false,
        address_of_the_marketplace: "",
        is_the_owner_logged_in: false,
        access_token: ''
        
    }

    
    async componentDidMount() {

        let owner = (await fetch_transaction_history_from_the_graph(this.props.index)).data.tokens[0].owner.id
        console.log(owner)
        try {
        
 
        const metadata = await fetch_metadata_for_specific_token(this.props.index)
        const {name,description,creator, mimetype} = metadata

        this.setState({name,description,creator,mimetype, metadata, owner})


        this.setState({order_history: await fetch_sales_for_id(this.props.index,this.props.address)})
        }

        catch(e) {

            this.setState({error_message: e.message + ' price history data. Working on a fix. '})
        }

        
      

        if (typeof window !== "undefined" && typeof window.ethereum !== "undefined") {
            const provider  = window.ethereum
            const chainId = await provider.request({ method: 'eth_chainId' })
            const accounts = await provider.request({method: 'eth_requestAccounts'})

            await set_tokens(accounts[0])
        
            this.setState({  access_token:  get_access_token(),user_loaded: true,is_chainId_right: chainId == CHAIN_ID, account_of_the_user:  utils.getAddress(accounts[0]), is_metamask_running: Boolean(this.state.account_of_the_user != undefined)})
            if (!this.state.is_chainId_right) {
                this.setState({does_user_has_metamask_installed: true}) 
                return this.setState({asset_info_loaded: true});
              }
              this.setState({address_of_the_marketplace: await instance_of_marketplace._address })
            this.setState({authenication_flag: await instance.methods.Users_Approved_To_Mint(accounts[0]).call(),
                is_the_user_appproved :await instance.methods.isApprovedForAll(accounts[0], this.state.address_of_the_marketplace).call() }


            ) 


           

        }
        if (typeof window !== "undefined" && typeof window.ethereum !== "undefined" && typeof this.state.account_of_the_user[0] != "undefined") {
            this.setState({does_user_has_metamask_installed: true}) 
          }
    

        

        const {price, seller} = await instance_of_marketplace.methods.Listing_details(instance._address,this.props.index).call()

        this.setState({price: price, owner: owner, is_the_owner_logged_in: Boolean(this.state.account_of_the_user.toLowerCase() == this.state.owner.toLowerCase())})
  
        console.log(this.state.is_the_owner_logged_in)
        console.log(this.state.price)
        if (price != 0) // Asset is listed 
        {
            this.setState({owner: seller, is_the_owner_logged_in: Boolean(this.state.account_of_the_user.toLowerCase() == this.state.owner.toLowerCase())})
        }
        else if (price == 0 && seller != "0x0000000000000000000000000000000000000000")/// Asset was delisted 
        {
            this.setState({owner: seller})
        }
        this.setState({asset_info_loaded: true})
            }




async link_address_to_profile(){

    return <Link href={`/profile/${this.state.owner}`}>
    <a className='item' > {this.state.owner}</a>

    </Link>
}



is_file_a_video = () => {

    if(this.state.mimetype === 'video/mp4') {
    
       return <video ui="false" wrapped="true" loop  autoPlay="autoplay" controls muted src={`${this.state.metadata.url}`} ></video>
    }
   return <Image src={`${this.state.metadata.url}`} /> 
}

is_asset_listed() {
 
    if (this.state.price != 0) // Asset is currently listed 
    {
    
        return (
        <Header size="huge" color="teal">
        Current Price:  {Web3.utils.fromWei(this.state.price, 'ether')} MATIC
        </Header>
        )
    }

    else {
        return <Header size="large" color="orange">
        Asset is not currently on sale
        </Header>
    }

}


set_approval_for_all = async()=> {
    this.setState({loading_flag: true})
    try {
    await instance.methods.setApprovalForAll(this.state.address_of_the_marketplace, true).send({from: this.state.account_of_the_user})
    this.setState({loading_flag: false, message_content: 'You have approved the marketplace '})
    }
    catch(e)
    {
    this.setState({loading_flag: false,error_message: e.message})
    }
}

buy_the_asset = async()=> {

    this.setState({loading_flag: true, errorMessage: ''})
    try {

        const accounts = await window.ethereum.request({ method: 'eth_accounts' });

        
    const {events: {Sell}} = await instance_of_marketplace.methods.buy_asset(this.props.index,  await instance._address).send({from: accounts[0], value: this.state.price})

    console.log(Sell)
    const response = await sale_fetch(Sell)
    console.log(response)

    this.setState({loading_flag: false, error_message: '', message_content: 'Congratulation you have successfully bought an NFT.'})




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
   

            return <Table   margin-top= "250px" color="teal" size='small' padded> 
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
                    return <Table.Row key={index}>
                    <Table.Cell>{timestamp.toDate(parseInt(this.state.order_history[index].time)).toLocaleDateString() + " | " + timestamp.toDate(parseInt(this.state.order_history[index].time)).toLocaleTimeString() }</Table.Cell>
                    <Table.Cell>{Web3.utils.fromWei(this.state.order_history[index].price, 'ether') + ' MATIC'}</Table.Cell>
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
    await instance_of_marketplace.methods.list_asset(this.props.index, price_in_wei, await instance._address).send({from: accounts[0]})
    this.setState({loading_flag: false, errorMessage: '', message_content: 'Congratulation your NFT was successfully listed. You might have to wait up to 5 minutes for the changes to be visible. '})

    }

    catch(err){
        this.setState({loading_flag: false, error_message: err.message})
    }
   

}

   
render() {

    return(

        <Layout auth= {this.state.authenication_flag} loading={!this.state.user_loaded} metamaskflag = {this.state.is_metamask_running} account={this.state.account_of_the_user} >
        {!this.state.asset_info_loaded && <Message  color='teal' size='huge' icon>
    <Icon name='circle notched' loading />
    <Message.Content>
      <Message.Header>Just one second</Message.Header>
      We are loading this NFT for you
    </Message.Content>
  </Message>}
  { this.state.asset_info_loaded &&
        <Grid>
        <Grid.Column width={8}>
        <Card 
        style = {{width: "100%", overflowWrap: "break-word"}}
        image = {this.is_file_a_video()}  

        extra = {<div id="extra">
        <a  href={`/profile/${this.state.owner}`}>
        <h4 > {"Address of the owner: " + this.state.owner.toLowerCase()} </h4>
        </a> 
        <a  href={`/space/${this.state.creator}`}>
        
        <h4>{"Address of the creator: " + this.state.creator.toLowerCase()} </h4>
        </a>
        <a target = "_blank" href={`https://opensea.io/assets/matic/${instance._address}/${this.props.index}`}> 
        <div id="opensea">
        <h2> {"View asset on opensea"}</h2>
        </div>
        </a>
        </div>
        }
    
 
        header={this.state.name}
        description = {this.state.description} 
  
        />

        </Grid.Column>
        <Grid.Column width={4}>
        {this.is_asset_listed()}
        { this.state.is_the_owner_logged_in  && Boolean(this.state.price == 0)  && this.state.is_the_user_appproved  &&
        <Form onSubmit={this.onFormSubmit} error={!!this.state.error_message}>
        <Form.Field> 
        <label>Price for which you want to list the asset in MATIC</label> 
        <Input value={this.state.price_of_the_listing} onChange={event => this.setState({price_of_the_listing: event.target.value})}/>
        </Form.Field>
        <Button  size='huge' color='teal' content="List the asset"  loading={this.state.loading_flag}></Button>
        </Form>
        }

        {
              this.state.is_the_owner_logged_in && !this.state.is_the_user_appproved  &&
              <div>
                <Message color="teal"> You need to approve the marketplace before listing the item </Message>
                <Button loading = {this.state.loading_flag} onClick = {()=> {this.set_approval_for_all() }}size="massive" color="green"> Approve </Button>
                </div>
        }
        {
        this.state.price != 0 && !this.state.is_the_owner_logged_in && 
        <Button disabled = {!this.state.does_user_has_metamask_installed} onClick = {this.buy_the_asset}size="massive" color="teal" loading={this.state.loading_flag}> Buy the asset </Button>
        }
        
        
        <Form  error={!!this.state.error_message}> 
        <br></br>
         <Message error header="Oops!" margin="10ptx" onDismiss = {()=> { this.setState({error_message: ''})}} content={this.state.error_message}  />
         </Form>
         {
         !this.loading_flag && this.state.message_content && <Message onDismiss = {this.dissmiss} positive> {this.state.message_content}</Message>    
         }
    

  { this.state.is_the_owner_logged_in &&
  <Actions asset_listed = {Boolean(this.state.price != 0)} flag = {this.state.price} index = {this.props.index} account = {this.state.account_of_the_user} props={this.state.metadata}> </Actions>
}
       </Grid.Column>
       {
        !this.state.dissmiss_flag && !this.state.does_user_has_metamask_installed && <Message onDismiss={() => {this.setState({dissmiss_flag: true})}} size='large' color='orange'> 
        It looks like you don't have Metamask installed in your browser. In order to access the marketplace you need to download this extension.</Message>
        }

       

       </Grid>
}
{
        !this.state.dissmiss_flag  && this.state.does_user_has_metamask_installed && !this.state.is_chainId_right && <Message onDismiss={() => {this.setState({dissmiss_flag: true})}} size='huge' color='purple'> 
        If you wish to interact with the asset please connect to the Polygon network and refresh the page! </Message>
        }
       {this.render_history()}


        </Layout>


    )
}

}

export async function getServerSideProps(context) {

          let address   = context.query.instance_address || context.query.address
    
          let index = context.query.index_of_the_nft || context.query.index
  

          console.log(context.query)


    return {
      props: {
        address,
        index,



   }, // will be passed to the page component as props
    }
  }
export default asset