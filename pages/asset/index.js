import React, { Component } from "react"; 
import Layout from '../../components/Layout';
import {Form, Button, Input, Container, Header, Message, Card, Icon} from 'semantic-ui-react'
import {Link} from '../../routes'
import web3 from "../../etherum_side/web3";
import instance from "../../etherum_side/instance_of_the_contract";
import {Router} from '../../routes';


class asset extends Component {


    
    async componentDidMount() {

        
        
        Router.pushRoute(`/asset/${this.props.instance_addres}/${this.props.index}`);
        
            }

    static async getInitialProps(props) {
        async function fetchJSON(url) {
           
            const response = await fetch(url, {method: "GET", headers: {"Content-type": "application/json"}});
        
            const response_to_json = await response.json();
            
            return response_to_json;
          }
    
        
        const instance_addres = props.query.instance_address
        const index = props.query.index_of_the_nft
        const uri = await instance.methods._tokens(index).call()
        const uri_to_JSON = await fetchJSON(uri)
        const account = await web3.eth.getAccounts()
        const is_metamask_running = Boolean(account.length !== 0)
        
        return {account,is_metamask_running,instance_addres,index,uri_to_JSON}
        
    }

    
render() {

    return(

        <Layout metamaskflag = {this.props.is_metamask_running} account={this.props.account}>


        <Card 
        style = {{width: "50%"}}
        image = {this.props.uri_to_JSON.image}  
        description={this.props.uri_to_JSON.description} 
        header={this.props.uri_to_JSON.name}
        />
     
        


        </Layout>
    )
}

}

export default asset