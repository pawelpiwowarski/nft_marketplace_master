
import React, { Component } from "react"; 
import nft_creator from '../etherum_side/instance_of_the_contract'
import {Form, Button, Input, Header, Message, Checkbox} from 'semantic-ui-react'
import Layout from '../components/Layout';
import { utils } from "ethers";
import ipfs from "../etherum_side/ipfs";
import  { upload_image_to_ipfs, User_cant_mint_info} from "../components/mint_utils/utils";
import { set_tokens} from "../utils/autheniticate";
import {get_access_token} from '../utils/access_token'
import { post_centralized_metadata } from "../utils/minting/post_centralized_metadata";
import { create_new_space } from "../utils/space/space_fetch";
import {CHAIN_ID} from '../etherum_side/addresses'
import { Preview_modal } from "../components/mint_utils/preview_modal";
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
  user_loaded: false,
  file_type: '',
  access_token: '',




}

async componentDidMount() {

  if (typeof window !== "undefined" && typeof window.ethereum !== "undefined") {
  const provider  = window.ethereum
   const accounts = await provider.request({method: 'eth_requestAccounts'})
   await set_tokens(accounts[0])
   const chainId = await provider.request({ method: 'eth_chainId' })
   this.setState({is_chainId_right: chainId == CHAIN_ID})
 

   this.setState({ access_token: get_access_token(),user_loaded: true, account:  utils.getAddress(accounts[0]), is_metamask_running: Boolean(this.state.account != undefined)})

   const instance_address = await nft_creator._address;
   this.setState({instance_address, opensea_url: "https://opensea.io/collection/plateau-nft-art"})

   if (!this.state.is_chainId_right) {

    return;
  }

  this.setState({can_user_mint: await nft_creator.methods.Users_Approved_To_Mint(accounts[0]).call()})
  }


}


onFormSubmit = async(event)=> {
event.preventDefault();






this.setState({loading_flag: true})

this.setState({file_url: await upload_image_to_ipfs(this.state.buffer) })

this.setState({loading_flag: false})

  const nft_metadata_object = {

    "description": this.state.description_of_the_nft,
    "name": this.state.name_of_the_nft,
    "image": this.state.file_url,
    "file_type": this.state.file_type,
    "address_of_the_creator": this.state.account,



}



try {


this.setState({loading_flag: true, errorMessage: ''});

const { cid } = await ipfs.add(JSON.stringify(nft_metadata_object)); 
const metadata = "https://ipfs.io/ipfs/" + cid 
const accounts = await window.ethereum.request({ method: 'eth_accounts' });
await nft_creator.methods.mint(metadata).send({from: accounts[0], gas: '5000000'})
const token_id = parseInt(await nft_creator.methods.Token_Id().call()) - 1
const mongodb_metadata = {
  token_id,
  "description": this.state.description_of_the_nft,
  "name": this.state.name_of_the_nft,
}
console.log(mongodb_metadata)
const form_data = new FormData()
form_data.append("image", this.state.buffer)
const response_from_mongodb = await post_centralized_metadata(mongodb_metadata, form_data)
await create_new_space()
console.log(response_from_mongodb)
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

    if (files[0].size > 5242880) {
      this.setState({content_loading_flag: false})
      throw new Error("File is too large maxium size is 5MB")

    }
    this.setState({file_type: files[0].type})
    this.setState({buffer: files[0]})

    let file_reader = new FileReader
    file_reader.readAsDataURL(files[0])

    file_reader.onloadend = ()=> {
      this.setState({buffer_url:file_reader.result})
    }
    this.setState({ is_content_loaded: true, content_loading_flag: false})
   

   
  
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
<Layout  loading ={!this.state.user_loaded} metamaskflag = {this.state.is_metamask_running} account={this.state.account} auth={this.state.can_user_mint}>
{!this.state.is_chainId_right  && <a target="_blank" href='https://polygon.technology/' ><Message color='purple' size='big' 
        content="In order to access the marketplace, you need to connect your Metamask wallet to the Polygon network. The marketplace will not work correctly unless you switch the networks."/></a> }
  <Header as='h1'> Mint your very own ERC1155 NFT !  Add a name, description and some cool artwork!</Header>
  <Header as='h2'> Address of the NFT smart contract: </Header>
  <Header as='h3' ><a href={`https://polygonscan.com/token/${this.state.instance_address}`} target="_blank"> {this.state.instance_address} </a></Header>  
  <Form onSubmit={this.onFormSubmit} error={!!this.state.error_message}> 
  <Form.Field>
  <label>Name of your NFT </label> 
  <Input value={this.state.name_of_the_nft}
    onChange={event => this.setState({name_of_the_nft: event.target.value})} name="name" />
  </Form.Field>
  <Form.Field>
  <label>Description of your NFT</label> 
  <Input value={this.state.description_of_the_nft} onChange={event => this.setState({description_of_the_nft: event.target.value})}name="description" />
  </Form.Field>
  <Form.Field>

  <label> Image of your NFT (jpg,   jpeg, png,  gif, mp4). Max size 5Mb </label>

                <Button
                  disabled = {!this.state.is_metamask_running || !this.state.can_user_mint}
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
                <br></br>
                <br></br>
                            <Checkbox 
                            onClick={()=> {
                              this.setState({copyright_check: true})
                            }}
                            disabled = {!this.state.can_user_mint}
                             label='I acknowledge that whis work is my own creation. ' />

              </Form.Field>





                { this.state.name_of_the_nft && this.state.description_of_the_nft && this.state.buffer_url &&
                              <div id="preview" > 
              <Preview_modal image = {
                this.state.buffer_url
        
              }name= {this.state.name_of_the_nft} description = {this.state.description_of_the_nft} creator = {this.state.account} owner = {this.state.account}></Preview_modal
                >
              </div> 
                }
 <Button  size= 'large' slider disabled={!this.state.is_content_loaded || !this.state.copyright_check} loading={this.state.loading_flag} type="submit"   primary>Sumbit NFT metadata</Button>

 

<User_cant_mint_info user_cannot_mint= {!this.state.is_metamask_running || this.state.can_user_mint}/>
  
  {!this.state.is_metamask_running &&
  <Message color='orange' size='large' content="You need to connect your wallet to sumbit metadata!"/>
  }
  <Message error header="Oops!" content={this.state.error_message}  />
  { this.state.was_asset_subimitted &&
  <Message color="green" size="big" positive> Congratulation your NFT was sucesfully minted. Please wait around 2 minutes for the blockchain information to sync with our servers. </Message>
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