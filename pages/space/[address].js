import React, { Component } from "react"; 
import Layout from '../../components/Layout';
import { Header, Message, Card, Icon, Input,Image, Button} from 'semantic-ui-react'
import Link  from 'next/link'
import instance from "../../etherum_side/instance_of_the_contract";
import { utils } from "ethers";
import fetch_profile_details from '../../utils/fetch_profile'
import profile_url from '../../utils/fetch'
import url from '../../utils/fetch'
import {  get_tokens_created_by_a_user } from "../../utils/grapql_query";
import { set_tokens} from "../../utils/autheniticate";
import { fetch_description, update_banner, update_description } from "../../utils/space/space_fetch";
import { fetch_all_tokens_created_by_a_user } from "../../utils/minting/post_centralized_metadata";
import {CHAIN_ID} from '../../etherum_side/addresses'
class space extends Component {

    fileInputRef = React.createRef();


    state = {
        description: "",
        account_of_the_user: "",
        is_metamask_running: false,
        page_loading_flag: true,
        message_content: "",
        authenication_flag: false,
        user_loaded: false,
        is_creator_logged_in: false,
        positive_message: '',
        error_message: '',
        array_of_metadatas:[]

    }
async componentDidMount() {

    this.setState({array_of_metadatas: (await fetch_all_tokens_created_by_a_user(this.props.creator)).assets})
    console.log(this.state.array_of_metadatas)
    if (typeof window !== "undefined" && typeof window.ethereum !== "undefined") {

        const provider  = window.ethereum
        const accounts = await provider.request({method: 'eth_requestAccounts'})
        await set_tokens(accounts[0])
        const chainId = await provider.request({ method: 'eth_chainId' })
        this.setState({is_chainId_right: chainId == CHAIN_ID})
        if (!this.state.is_chainId_right) {

            return;
          }
        this.setState({  authenication_flag: await instance.methods.Users_Approved_To_Mint(accounts[0]).call(), is_creator_logged_in: accounts[0].toLowerCase() === this.props.creator.toLowerCase(),account_of_the_user:utils.getAddress(accounts[0]),user_loaded: true, is_metamask_running: Boolean(this.state.account_of_the_user != undefined)})

    }
    
    const {username, email, url} = await fetch_profile_details(this.state.account_of_the_user)
    this.setState({description: await fetch_description(this.props.creator)})
    this.setState({email,username,profile_picture: profile_url + url})

}

submitBanner = async () => {


    try {
        const data = new FormData()
        data.append('banner',this.state.rawfile)
        const response = await update_banner(data, this.state.account_of_the_user)
        if (response.error) {
            return this.setState({error_message: response.error})
        }
        this.setState({positive_message: response})
    }
    catch(e) {
        this.setState({error_message: e.Message})

    }
}
handleSubmission = async (e) => {

    try {


      const files = e.target.files[0]
    this.setState({rawfile: files})
    const reader = new FileReader();
    reader.readAsDataURL(files)
    reader.onloadend = ()=> {
        this.setState({src: reader.result
    })

    this.setState({submit_button: true})
      }


     }
  
     catch (err)
     {
        this.setState({error_message: err.Message})
    }
      
  }
  is_file_a_video = (index)=> {



    if (this.state.array_of_metadatas[index].mimetype === 'video/mp4')
    return <video  ui="false" wrapped="true" loop  autoPlay="autoplay" muted src={`${this.state.array_of_metadatas[index].url}`}> </video>
 return `${this.state.array_of_metadatas[index].url}`





 }  
    render() {
        return (
            <Layout auth = {this.state.authenication_flag} loading = {!this.state.user_loaded} metamaskflag = {this.state.is_metamask_running} account={this.state.account_of_the_user} >
                {!this.state.is_chainId_right  && <a target="_blank" href='https://polygon.technology/' ><Message color='purple' size='big' 
        content="In order to access the marketplace, you need to connect your Metamask wallet to the Polygon network. The marketplace will not work correctly unless you switch the networks."/></a> }
        {this.state.positive_message && <Message positive content={this.state.positive_message}></Message>}
        {this.state.error_message && <Message negative content={this.state.error_message}></Message>}

            <Card.Group>
            <Card centered  fluid color='teal'>
                <Image style={{height: "300px"}}src={ this.state.src || `${profile_url}space/image/${this.props.creator.toLowerCase()}`}></Image>
                { this.state.is_creator_logged_in &&
             
                <Button onClick={() => this.fileInputRef.current.click()}
            size="medium" color="teal">
                <input
                  ref={this.fileInputRef}
                  type="file"
                  hidden
                  onChange={this.handleSubmission}
                 ></input>
                 Change background
                 </Button>

                

                } 
                 {
                     this.state.submit_button && <Button positive onClick={()=> {
                        this.submitBanner()
                        this.setState({submit_button: false})}}> Submit banner </Button>
                 } {this.state.is_creator_logged_in &&
                <Header size="huge" textAlign = "center" > Description: <Input> <input 

                placeholder= {this.state.description}
                onChange={(e)=> {
                    this.setState({description: e.currentTarget.value})
                }}></input></Input> <Button onClick= {async ()=> {

                    try {
                    const response = await update_description(this.state.description, this.state.account_of_the_user)
                this.setState({positive_message: response, is_creator_logged_in: false, description: await fetch_description(this.props.creator)})} 
                catch(e) {
                    this.setState({error_message: e.Message})

                }
                    }

                   
                    } size="big" content="Submit Changes"positive></
                Button > </Header> }
                {
                    !this.state.is_creator_logged_in && <Header size="huge" textAlign = "center"> {this.state.description}</Header>
                }
                <Header size="small" textAlign = "center" > Tokens minted by: <Link href={`/profile/${this.props.creator}`}>
    <a className='item' > {this.props.creator}</a>

    </Link> </Header></Card>

          </Card.Group>

          <Card.Group centered itemsPerRow={2} >{this.state.array_of_metadatas.map((element, index) => {
            return <Link  key={index} href = {`/asset/${this.props.instance_address}/${element._id}`} >
            <a >
            <Card raised
            key={index}
            style={{margin: "25px" }}
            image = {this.is_file_a_video(index)}  
            description={this.state.array_of_metadatas[index].description} 
            extra={this.state.array_of_metadatas[index].price == 0 ? "Not for sale ": `${this.state.array_of_metadatas[index].price} MATIC`}
            header={this.state.array_of_metadatas[index].name}
    
        
            />
            </a></Link>})}
    
            </Card.Group>


<div className="footer">


<ul>

  <a  style={{color: 'black'}}target="_blank" href="https://github.com/pawelpiwowarski/nft_marketplace_master"><li> <Icon name="code branch"></Icon>Github</li></a>
 <a style={{color: 'black'}} href="mailto:support@plateau-nft.art"> <li><Icon name="mail"></Icon> Email</li></a>
 <a style={{color: 'black'}}target="_blank" href="https://twitter.com/ArtPlateau"> <li><Icon name="twitter"></Icon> Twitter</li></a>
 <a style={{color: 'black', hoover: {color: "violet"}}} target="_blank" href={`https://mumbai.polygonscan.com/token/${instance._address}`}><li><Icon name="compass"></Icon>PolygonScan</li></a>        

</ul>
</div>

          </Layout>
        )
    }


}

export async function getServerSideProps(context) {


    const tokens_created_by_user = await get_tokens_created_by_a_user(context.params.address)
    const instance_address = await instance._address
    console.log(context.params.address)
    console.log(tokens_created_by_user)
    
    return {props: {creator: context.params.address,
tokens: tokens_created_by_user,
instance_address}}
}
export default space