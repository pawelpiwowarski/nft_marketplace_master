
import React, { Component } from "react"; 
import nft_creator from '../etherum_side/instance_of_the_contract'
import {Form, Button, Input, Header, Message} from 'semantic-ui-react'
import Layout from '../components/Layout';
import pinata from '../etherum_side/pinata';
import { utils } from "ethers";
import ipfs from "../etherum_side/ipfs";
import instance_of_profile_authenictaion from '../etherum_side/instance_of_the_profile'
import fetch_profile_details from '../utils/fetch_profile'
class mint_nft extends Component 
{

  fileInputRef = React.createRef();

state = {
  name_of_the_nft: "",
  description_of_the_nft: "",
  loading_flag: false,
  file_url: "",
  error_message: "",
  is_content_loaded: false,
  account: '',
  is_metamask_running: false,
  instance_adress: "",
  opensea_url: "",
  was_asset_subimitted: false,
  content_loading_flag: false,
  authentication_flag: false,
  local_json: '',
  user_loaded: false



}

async componentDidMount() {
  
  if (typeof window !== "undefined" && typeof window.ethereum !== "undefined") {
  const provider  = window.ethereum
   const accounts = await provider.request({method: 'eth_requestAccounts'})
  
   this.setState({ local_json: await fetch_profile_details(accounts[0]),user_loaded: true, account:  utils.getAddress(accounts[0]), is_metamask_running: Boolean(this.state.account != undefined), authentication_flag: await instance_of_profile_authenictaion.methods.verification_map(accounts[0]).call()})
  }
  const instance_address = await nft_creator._address;
  this.setState({instance_address, opensea_url: "https://testnets.opensea.io/collection/plateau-nft-9owk6a6mmf"})

}


onFormSubmit = async(event)=> {
event.preventDefault();
  const nft_metadata_object = {

    "description": this.state.description_of_the_nft,
    "name": this.state.name_of_the_nft,
    "image": this.state.file_url


}

const options = {pinataMetadata: {
  name: this.state.name_of_the_nft
}}


try {


this.setState({loading_flag: true, errorMessage: ''});


const { cid } = await ipfs.add(JSON.stringify(nft_metadata_object)); 
const metadata = "https://ipfs.io/ipfs/" + cid 
const accounts = await window.ethereum.request({ method: 'eth_accounts' });
await nft_creator.methods.mint(metadata).send({from: accounts[0]})
this.setState({was_asset_subimitted: true})
}

catch(err)
{
this.setState({error_message: err.message})
}

this.setState({loading_flag: false, error_message: ''})

}







handleSubmission = async (e) => {

  try {

    this.setState({error_message: ''});
    if (this.state.name_of_the_nft == "" || this.state.description_of_the_nft == ""){
      throw new Error('One or more necessary data fields is not completed!');
    }
    this.setState({content_loading_flag: true})
    const files = e.target.files
    const reader = new FileReader()
  reader.readAsArrayBuffer(files[0]);
   reader.onloadend = async () => {
    const { cid } = await ipfs.add(reader.result) // Display as a buffer
    const img_source = "https://ipfs.io/ipfs/" + cid
    this.setState({file_url: img_source, is_content_loaded: true, content_loading_flag: false})
   }
   }

   catch (err)
   {
    this.setState({error_message: err.message})
  }
    
}

isfileloaded(){
  
  if (this.state.is_content_loaded){
    return "File Uploaded!"
  }
  else {
    return "Choose a file to upload"
  }
}


  render() {



    
return (
<Layout  loading ={!this.state.user_loaded}local_json={this.state.local_json} metamaskflag = {this.state.is_metamask_running} account={this.state.account} auth={this.state.authentication_flag}>
  <Header as='h1'> Mint your very own NFT!  Add a name, description and some cool artwork!</Header>
  <Header as='h2'> Address of the NFT smart contract: </Header>
  <Header as='h3' ><a href={"https://rinkeby.etherscan.io/token/" + this.state.instance_address} target="_blank"> {this.state.instance_address} </a></Header>  
  <Form onSubmit={this.onFormSubmit} error={!!this.state.error_message}> 
  <Form.Field>
  <label>Name of your NFT </label> 
  <Input value={this.state.name_of_the_nft}
    onChange={event => this.setState({name_of_the_nft: event.target.value})}name="name" />
  </Form.Field>
  <Form.Field>
  <label>Description of your NFT</label> 
  <Input value={this.state.description_of_the_nft} onChange={event => this.setState({description_of_the_nft: event.target.value})}name="description" />
  </Form.Field>
  <Form.Field>
  
  <label> Image of your NFT (jpg,   jpeg, png,  gif, mp4)</label>

                <Button
                  disabled = {!this.state.is_metamask_running}
                  loading = {this.state.content_loading_flag}
                  size = 'large'
                  positive = {this.state.is_content_loaded}
                  type='button'
                  content={this.isfileloaded()}
                  labelPosition="left"
                  icon="file"
                  onClick={() => this.fileInputRef.current.click()}
                />
                <input
                  ref={this.fileInputRef}
                  type="file"
                  hidden
                  onChange={this.handleSubmission}
                />
              
              </Form.Field>




  
  
 <Button  size= 'large' disabled={!this.state.is_content_loaded} loading={this.state.loading_flag} type="submit"   primary>Sumbit NFT metadata</Button>

  
  {!this.state.is_metamask_running &&
  <Message color='orange' size='large' content="You need to connect your wallet to sumbit metadata!"/>
  }
  <Message error header="Oops!" content={this.state.error_message}  />
  { this.state.was_asset_subimitted &&
  <Message color="green"  positive> Congratulation your NFT was sucesfully minted. You can see it by going to the home page.</Message>
  }
  
 </Form >
	
  <Header>
    <a href={this.state.opensea_url} target="_blank" >
   Check minted NFTS on Opensea.
    </a>
  </Header>



 </Layout>
);
  
}
}

export default mint_nft;
