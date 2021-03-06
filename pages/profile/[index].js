import React, { Component } from "react"; 
import Layout from '../../components/Layout';
import { Header, Message, Card, Icon, Image} from 'semantic-ui-react'
import Link  from 'next/link'
import instance from "../../etherum_side/instance_of_the_contract";
import { utils } from "ethers";
import instance_of_marketplace from "../../etherum_side/instance_of_the_marketplace";
import instance_of_profile_authenictaion from '../../etherum_side/instance_of_the_profile'
import fetch_profile_details from '../../utils/fetch_profile'
import profile_url from '../../utils/fetch'
class profile extends Component {

 

    async componentDidUpdate(prevProps) {
        // Typical usage (don't forget to compare props):
        if (this.props.account !== prevProps.account) {
          this.setState({page_loading_flag: true})
          this.setState({array_of_metadatas: []})
          this.componentDidMount()
        }
      }


    async componentDidMount() 
    {

        let contentType
        const array_of_metadatas = []
        const array_of_responses = []
        async function fetchJSON(url) {
           
            const response = await fetch(url, {method: "GET"});
        
            const response_to_json = await response.json();
            
            return response_to_json;
          }
          const {username, email, url} = await fetch_profile_details(this.props.account)

          if (typeof window !== "undefined" && typeof window.ethereum !== "undefined") {
            const provider  = window.ethereum
            const accounts = await provider.request({method: 'eth_requestAccounts'})

            
         
           
            this.setState({ account_of_the_user:utils.getAddress(accounts[0]),user_loaded: true,local_json: await fetch_profile_details(accounts[0]), is_metamask_running: Boolean(this.state.account_of_the_user != undefined),  authentication_flag: await instance_of_profile_authenictaion.methods.verification_map(accounts[0]).call()})
        
        }
        this.setState({email,username,profile_picture: profile_url + url})
    const list_of_offers = await Promise.all(Array(parseInt(this.props.numbers_of_tokens)).fill().map((element, index) => { return instance_of_marketplace.methods._listingDetails(index).call()}))
    const numbers_of_tokens_the_user_owns = await Promise.all(Array(parseInt(this.props.numbers_of_tokens)).fill().map((element, index) => { return instance.methods.balanceOf(String(this.props.account), index).call()}))
    this.setState({numbers_of_tokens_the_user_owns, list_of_offers})
    const array_of_uris = await Promise.all(Array(parseInt(this.props.numbers_of_tokens)).fill().map((element, index) => { return instance.methods._tokens(index).call()}))
    const array_of_uris_filtered = (await Promise.all(numbers_of_tokens_the_user_owns.map( async (element, index) => { 
        if (element==1) {
            return array_of_uris[index]
        }
        
        else{
            
            const {seller} = await instance_of_marketplace.methods._listingDetails(index).call()
         
            if (seller == this.props.account)
            {
            return array_of_uris[index]
            }
            return null
        }

    }))).filter(num => num != null)
    for (let i=0; i < array_of_uris_filtered.length; i++) 
    {
        let uri = await fetchJSON(array_of_uris_filtered[i])
        array_of_metadatas.push(uri)
        let res; 
        try
        {
       
        
   
            res = await fetch(uri.image)
    
        contentType = res.headers.get('Content-Type');
    }

    catch {
        contentType = 'none'
    }
        array_of_responses.push(contentType)
      }
      this.setState({array_of_metadatas,array_of_responses, page_loading_flag: false})
      if (array_of_responses.length == 0)
    {

    this.setState({message_content: "Sorry, this user deos not hold any NFTs ", page_loading_flag: false})

    }
        
         
    }

    state = {
        index_of_the_nft: 0,
        account_of_the_user: "",
        is_metamask_running: false,
        array_of_metadatas: [],
        list_of_offers: [],
        numbers_of_tokens_the_user_owns: [],
        array_of_responses: [],
        page_loading_flag: true,
        message_content: "",
        authenication_flag: false,
        local_json:'',
        profile_picture: '',
        user_loaded: false

    }
     getactualindex(index) {
        const array_of_indexes = []
        const list_to_compare = this.state.numbers_of_tokens_the_user_owns.map((element, index) => {return parseInt(this.state.numbers_of_tokens_the_user_owns[index])})
        const l = list_to_compare.length
        for (let i = 0; i < l; i++){

            if (list_to_compare[i] == 1)
            {
            array_of_indexes.push(i)
            }

            else {
               
            if (this.state.list_of_offers[i].seller == this.props.account){

                array_of_indexes.push(i)

            }
   

            }
        }
  
        return array_of_indexes[index]
    }
  
    
       
        
        
    is_file_a_video = (index)=> {

 
        if (this.state.array_of_responses[index] == 'video/mp4')
          return <video loop  autoPlay="autoplay" muted src={this.state.array_of_metadatas[index].image} ></video>
       return this.state.array_of_metadatas[index].image



     }    
        
        
        

    renderNFT() {
        
        
        return  <Card.Group centered itemsPerRow={2} >{this.state.array_of_metadatas.map((element, index) => {
            return <Link href = {`/asset/${this.props.instance_address}/${this.state.index_of_the_nft}`} >
            <a  onMouseEnter={async () => this.setState({index_of_the_nft: this.getactualindex(index)})}>
            <Card raised
            key={index}
            style={{margin: "25px" }}
            image = {this.is_file_a_video(index)}  
            description={this.state.array_of_metadatas[index].description} 
            header={this.state.array_of_metadatas[index].name}
    
        
            />
            </a></Link>})}
    
            </Card.Group>;

    }
render() {

    return(

        <Layout loading = {!this.state.user_loaded}local_json = {this.state.local_json}metamaskflag = {this.state.is_metamask_running} account={this.state.account_of_the_user} auth={this.state.authentication_flag}>
{ this.state.username && <div>

<Card color="teal" centered image raised size='tiny'>

    <Card.Content>
      <Image fluid bordered wrapped centered size=""src={this.state.profile_picture}></Image>
      <br></br>
      <Card.Header textAllign = "center"> Username: <a target="_blank" href= { "https://rinkeby.etherscan.io/address/" + this.props.account}>{this.state.username} </a>  </Card.Header>
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
        {this.renderNFT()}


        </Layout>
    )
}

}
export async function getServerSideProps(context) {

    
    let account = context.query.index || context.query.address
      
    const instance_address = await instance._address
    const numbers_of_tokens = await instance.methods.Token_Id().call();
      return {props:{account,
        instance_address,numbers_of_tokens 

 }}


}


export default profile