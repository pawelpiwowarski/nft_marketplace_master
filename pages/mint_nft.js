
import React, { Component } from "react"; 
import nft_creator from '../etherum_side/instance_of_the_contract'
import {Form, Button, Input, Container, Header, Message} from 'semantic-ui-react'
import Layout from '../components/Layout';
import pinata from '../etherum_side/pinata';
import web3 from "../etherum_side/web3";
import ipfs from "../etherum_side/ipfs";

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
  opensea_url: ""



}

async componentDidMount() {

  const provider  = window.ethereum
   const accounts = await provider.request({method: 'eth_requestAccounts'})
   this.setState({account:  accounts[0]})
   this.setState({ is_metamask_running: Boolean(this.state.account != undefined)})
  const instance_address = await nft_creator._address;


  this.setState({instance_address})
  this.setState({opensea_url: "https://rinkeby.etherscan.io/token/" + instance_address})

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
if (!this.state.is_content_loaded || this.state.name_of_the_nft === "" || this.state.description_of_the_nft === ""){
  throw new Error('One or more necessary data fields is not completed!');
}

const pinata_resopsnse = await pinata.pinJSONToIPFS(nft_metadata_object,options);
const metadata = 'https://gateway.pinata.cloud/ipfs/' + pinata_resopsnse.IpfsHash;    
const accounts = await window.ethereum.request({ method: 'eth_accounts' });
console.log(metadata)
await nft_creator.methods.mint(metadata).send({from: accounts[0]})
}

catch(err)
{
this.setState({error_message: err.message})
}

this.setState({loading_flag: false, errorMessage: ''})

}







handleSubmission = async (e) => {
  
  
  

  try {
    this.setState({is_content_loaded: true})

    const files = e.target.files
    const reader = new FileReader()
  reader.readAsArrayBuffer(files[0]);
   reader.onloadend = async () => {
  
    


    const { cid } = await ipfs.add(reader.result) // Display as a buffer
    const img_source = "https://ipfs.io/ipfs/" + cid
    console.log(img_source)
    this.setState({file_url: img_source})
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
<Layout  metamaskflag = {this.state.is_metamask_running} account={this.state.account}>






  <Header> Mint your very own NFT! Add a name, description and some cool artwork!</Header>
  <Header> Address of the NFT smart contract: </Header>
  <Header><a href={this.state.opensea_url} target="_blank"> {this.state.instance_address} </a></Header>



  
  <Form onSubmit={this.onFormSubmit} error={!!this.state.error_message}> 
  <Form.Field>
  <label>Name of your NFT </label> 
  <Input value={this.state.name_of_the_nft}
    onChange={event => this.setState({name_of_the_nft: event.target.value})}name="name" />
  </Form.Field>
  <Form.Field>
  <label>Description of your NFT</label> 
  <Input value={this.state.description_of_the_nft}
    onChange={event => this.setState({description_of_the_nft: event.target.value})}name="description" />
  </Form.Field>
  <Form.Field>
  
  <label> Image of your NFT </label>

                <Button
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




  
  
 <Button  size= 'large' disabled={!this.state.is_metamask_running} loading={this.state.loading_flag} type="submit"   primary>Sumbit NFT metadata</Button>

  
  {!this.state.is_metamask_running &&
  <Message color='orange' size='large' content="You need to connect your wallet to sumbit metadata!"/>
  }
  <Message error header="Oops!" content={this.state.error_message}  />
  
  
 </Form >
	
  <Header>
    <a href='https://testnets.opensea.io/collection/choroszc-nft-v3' target="_blank" >
   Check minted NFTS on Opensea.
    </a>
  </Header>



 </Layout>
);
  
}
}

export default mint_nft;
