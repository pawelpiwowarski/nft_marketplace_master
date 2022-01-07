import React, { Component } from "react"; 
import Layout from '../../components/Layout';
import {Form, Button, Input, Container, Header, Message, Card, Icon} from 'semantic-ui-react'
import {Link} from '../../routes'
import web3 from "../../etherum_side/web3";
import instance from "../../etherum_side/instance_of_the_contract";
import lodash from 'lodash'
import Router, { withRouter } from 'next/router'

import instance_of_marketplace from "../../etherum_side/instance_of_the_marketplace";


class profile extends Component {

    async componentDidMount() {

        Router.pushRoute(`/profile/${this.props.account}`)
    }
    
    state = {
        index_of_the_nft: 0
    }
     getactualindex(index) {
        const array_of_indexes = []
        const list_to_compare = this.props.numbers_of_tokens_the_user_owns.map((element, index) => {return parseInt(this.props.numbers_of_tokens_the_user_owns[index])})
        const l = list_to_compare.length
        for (let i = 0; i < l; i++){

            if (list_to_compare[i] == 1)
            {
            array_of_indexes.push(i)
            }

            else {
               
            if (this.props.list_of_offers[i].seller == this.props.account){

                array_of_indexes.push(i)

            }
   

            }
        }
        
        return array_of_indexes[index]
    }
    static async getInitialProps(props) {
    
       
        
        
        const array_of_metadatas = []
        async function fetchJSON(url) {
           
            const response = await fetch(url, {method: "GET", headers: {"Content-type": "application/json"}});
        
            const response_to_json = await response.json();
            
            return response_to_json;
          }
        let account = props.query.address
       
        if (account == undefined) {
            let arr = props.req.url.split("/").length -1 
            account = props.req.url.split("/")[arr]
        
        }
        
        const account_of_the_user = await web3.eth.getAccounts()
        const is_metamask_running = Boolean(account != undefined)
        
        const numbers_of_tokens = await instance.methods.Token_Id().call();
        const instance_address = await instance._address
        const list_of_offers = await Promise.all(Array(parseInt(numbers_of_tokens)).fill().map((element, index) => { return instance_of_marketplace.methods._listingDetails(index).call()}))
    
        const numbers_of_tokens_the_user_owns = await Promise.all(Array(parseInt(numbers_of_tokens)).fill().map((element, index) => { return instance.methods.balanceOf(String(account), index).call()}))
        const array_of_uris = await Promise.all(Array(parseInt(numbers_of_tokens)).fill().map((element, index) => { return instance.methods._tokens(index).call()}))
        const array_of_uris_filtered = (await Promise.all(numbers_of_tokens_the_user_owns.map( async (element, index) => { 
            if (element==1){
                return array_of_uris[index]
            }
            else{
                
                const {seller} = await instance_of_marketplace.methods._listingDetails(index).call()
                if (seller == account)
                {
                return array_of_uris[index]
                }
                return null
            }

        }))).filter(num => num != null)

        for (let i=0; i < array_of_uris_filtered.length; i++) {
            let uri = await fetchJSON(array_of_uris_filtered[i])
            array_of_metadatas.push(uri)
          }
        
        
        return {account,
            account_of_the_user,
            array_of_metadatas,
            is_metamask_running,
            instance_address, 
            numbers_of_tokens_the_user_owns,
            list_of_offers }


    }

    renderNFT() {
        
        
        return  <Card.Group itemsPerRow={2} >{this.props.array_of_metadatas.map((element, index) => {
            return <Link route = {`/asset/${this.props.instance_address}/${this.state.index_of_the_nft}`} >
            <a  onMouseEnter={async () => this.setState({index_of_the_nft: this.getactualindex(index)})}>
            <Card 
            key={index}
            style={{margin: "25px" }}
            image = {this.props.array_of_metadatas[index].image}  
            description={this.props.array_of_metadatas[index].description} 
            header={this.props.array_of_metadatas[index].name}
    
        
            />
            </a></Link>})}
    
            </Card.Group>;

    }
render() {

    return(

        <Layout metamaskflag = {this.props.is_metamask_running} account={this.props.account_of_the_user}>

<Header as='h1'>The NFTs that belong to the adrress: {this.props.account}</Header>
        {this.renderNFT()}
        </Layout>
    )
}

}


export default withRouter(profile)