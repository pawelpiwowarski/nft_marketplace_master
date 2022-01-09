import React, { Component } from "react"; 
import Layout from '../../components/Layout';
import {Form, Button, Input, Container, Header, Message, Card, Icon} from 'semantic-ui-react'
import Link  from 'next/link'
import web3 from "../../etherum_side/web3";
import instance from "../../etherum_side/instance_of_the_contract";
import { withRouter } from 'next/router'

import instance_of_marketplace from "../../etherum_side/instance_of_the_marketplace";


class profile extends Component {

    async componentDidMount() 
    {
        this.setState({account_of_the_user: await web3.eth.getAccounts()})
        const array_of_metadatas = []
        async function fetchJSON(url) {
           
            const response = await fetch(url, {method: "GET", headers: {"Content-type": "application/json"}});
        
            const response_to_json = await response.json();
            
            return response_to_json;
          }
   
    this.setState({is_metamask_running: Boolean(this.state.account_of_the_user != undefined)})
    const numbers_of_tokens = await instance.methods.Token_Id().call();
    const list_of_offers = await Promise.all(Array(parseInt(numbers_of_tokens)).fill().map((element, index) => { return instance_of_marketplace.methods._listingDetails(index).call()}))
    this.setState({list_of_offers: list_of_offers})
    const numbers_of_tokens_the_user_owns = await Promise.all(Array(parseInt(numbers_of_tokens)).fill().map((element, index) => { return instance.methods.balanceOf(String(this.props.account), index).call()}))
    this.setState({numbers_of_tokens_the_user_owns: numbers_of_tokens_the_user_owns})
    const array_of_uris = await Promise.all(Array(parseInt(numbers_of_tokens)).fill().map((element, index) => { return instance.methods._tokens(index).call()}))
    const array_of_uris_filtered = (await Promise.all(numbers_of_tokens_the_user_owns.map( async (element, index) => { 
        if (element==1){
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
      }
      this.setState({array_of_metadatas: array_of_metadatas})

        
         
    }

    state = {
        index_of_the_nft: 0,
        account_of_the_user: "",
        is_metamask_running: false,
        array_of_metadatas: [],
        list_of_offers: [],
        numbers_of_tokens_the_user_owns: 0

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
  
    
       
        
        
        
        
        
        

    renderNFT() {
        
        
        return  <Card.Group itemsPerRow={2} >{this.state.array_of_metadatas.map((element, index) => {
            return <Link href = {`/asset/${this.props.instance_address}/${this.state.index_of_the_nft}`} >
            <a  onMouseEnter={async () => this.setState({index_of_the_nft: this.getactualindex(index)})}>
            <Card 
            key={index}
            style={{margin: "25px" }}
            image = {this.state.array_of_metadatas[index].image}  
            description={this.state.array_of_metadatas[index].description} 
            header={this.state.array_of_metadatas[index].name}
    
        
            />
            </a></Link>})}
    
            </Card.Group>;

    }
render() {

    return(

        <Layout metamaskflag = {this.state.is_metamask_running} account={this.state.account_of_the_user}>

<Header as='h1'>The NFTs that belong to the adrress: {this.props.account}</Header>
        {this.renderNFT()}
        </Layout>
    )
}

}
export async function getServerSideProps(context) {

    
    let account = context.query.index
    if (account == undefined) {
        account = context.query.address
    }

 
    
    const instance_address = await instance._address
 
      
      return {props:{account,
        instance_address, 

 }}


}


export default withRouter(profile)