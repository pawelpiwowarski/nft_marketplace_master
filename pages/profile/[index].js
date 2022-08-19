import React, { Component } from "react"; 
import Layout from '../../components/Layout';
import { Header, Message, Card, Icon, Image} from 'semantic-ui-react'
import Link  from 'next/link'
import instance from "../../etherum_side/instance_of_the_contract";
import { utils } from "ethers";
import fetch_profile_details from '../../utils/fetch_profile'
import profile_url from '../../utils/fetch'
import { set_tokens} from "../../utils/autheniticate";
import {fetch_metadata_for_specific_token} from '../../utils/minting/post_centralized_metadata'
import { get_tokens_owned_by_a_user } from "../../utils/grapql_query";
import {get_access_token} from '../../utils/access_token'
import {CHAIN_ID} from '../../etherum_side/addresses'
import url from '../../utils/fetch'
class profile extends Component {

 

    async componentDidUpdate(prevProps) {
        // Typical usage (don't forget to compare props):
        if (this.props.account !== prevProps.account) {
          this.setState({page_loading_flag: true,array_of_metadatas: []})
          this.componentDidMount()
        }
      }


    async componentDidMount() 
    {
      const array_of_metadatas = await Promise.all(this.props.tokens.map(async (element, index) => { 
        let response = await fetch_metadata_for_specific_token(element.tokenID)
        return response}))

        this.setState({array_of_metadatas})
          const {name, email} = await fetch_profile_details(this.props.account)

    
          if (typeof window !== "undefined" && typeof window.ethereum !== "undefined") {
            const provider  = window.ethereum
            const accounts = await provider.request({method: 'eth_requestAccounts'})
     
          
            await set_tokens(accounts[0])

            this.setState({ access_token: get_access_token(),account_of_the_user:utils.getAddress(accounts[0]),user_loaded: true, is_metamask_running: Boolean(this.state.account_of_the_user != undefined)})
            const chainId = await provider.request({ method: 'eth_chainId' })
            this.setState({is_chainId_right: chainId == CHAIN_ID})
          
             
        }
        this.setState({email,name})

     
  
      
    if (this.state.array_of_metadatas.length == 0)
    {

    this.setState({message_content: "Sorry, this user deos not hold any NFTs ", page_loading_flag: false})

    }
    this.setState({page_loading_flag: false})

    if (!this.state.is_chainId_right ) {
      return;
    }

    this.setState({authenication_flag: await instance.methods.Users_Approved_To_Mint(this.state.account_of_the_user).call()})
    }

    state = {

        account_of_the_user: "",
        is_metamask_running: false,
        page_loading_flag: true,
        message_content: "",
        authenication_flag: false,
        profile_picture: '',
        user_loaded: false,
        access_token: ''

    }
 
    
       
        
        
    is_file_a_video = (index)=> {

        if (this.state.array_of_metadatas[index].mimetype === 'video/mp4')
          return <video  ui="false" wrapped="true" loop  autoPlay="autoplay" muted src={`${this.state.array_of_metadatas[index].url}`}> </video>
       return `${this.state.array_of_metadatas[index].url}`



     }    
        
        
        

    renderNFT() {
        
        
        return  <Card.Group centered itemsPerRow={2} >{this.state.array_of_metadatas.map((element, index) => {
            return <Link   key={index}href = {`/asset/${this.props.instance_address}/${this.props.tokens[index].tokenID}`} >
            <a >
            <Card raised
            key={index}
            style={{margin: "25px" }}
            image = {this.is_file_a_video(index)}  
            description={this.state.array_of_metadatas[index].description} 
            header={this.state.array_of_metadatas[index].name}
            extra={this.state.array_of_metadatas[index].price == 0 ? "Not for sale ": `${this.state.array_of_metadatas[index].price} MATIC`}

        
            />
            </a></Link>})}
    
            </Card.Group>;

    }
render() {

    return(

        <Layout auth = {this.state.authenication_flag} loading = {!this.state.user_loaded} metamaskflag = {this.state.is_metamask_running} account={this.state.account_of_the_user} >
{ this.state.name && <div>



<Card color="teal" centered raised size='tiny'>

    <Card.Content>
      <Image fluid bordered wrapped centered src={ profile_url + `users/${this.props.account.toLowerCase()}/avatar`}></Image>
      <br></br>
      <Card.Header style ={{"textAllign": "center"}}> Username: <a target="_blank" href= { "https://polygonscan.com/address/" + this.props.account}>{this.state.name} </a>  </Card.Header>
      <Card.Meta></Card.Meta>
      <Card.Description>
      Email: {this.state.email}
      </Card.Description>
    </Card.Content>
    <Card.Content extra>
      <a>
        <Icon name='shop' />
        {this.state.array_of_metadatas.length} NFTs
      </a>
    </Card.Content>
    
  </Card>

</div>}
{!this.state.is_chainId_right  && <a target="_blank" href='https://polygon.technology/' ><Message color='purple' size='big' 
        content="In order to access the marketplace, you need to connect your Metamask wallet to the Polygon network. The marketplace will not work correctly unless you switch the networks."/></a> }
{ !this.state.username &&
<Header as='h2'>The NFTs that belong to the address: <a target="_blank" href= { "https://rinkeby.etherscan.io/address/" + this.props.account}>{this.props.account} </a> </Header>
}
{this.state.username &&
<Header textAlign= "center"as='h1'> This profile NFTs: </Header>
}
{this.state.page_loading_flag && <Message color='teal'  size='huge' icon>
    <Icon name='circle notched' loading />
    <Message.Content>
      <Message.Header>Just one second</Message.Header>
      We are fetching profile info 
    </Message.Content>
  </Message>}
  {this.state.message_content != "" && <Message size='huge' color="teal">{this.state.message_content } </Message>}
        {!this.state.page_loading_flag && this.renderNFT()}

    

        </Layout>
    )
}

}
export async function getServerSideProps(context) {
    

  console.log(context.query)
  
  let account =  context.query.address || context.query.index
  let tokens = (await get_tokens_owned_by_a_user(account)).data.tokens
      return {props:{
        account,
        tokens,
        instance_address: await instance._address,
        numbers_of_tokens:  await tokens.length,


 }}


}


export default profile