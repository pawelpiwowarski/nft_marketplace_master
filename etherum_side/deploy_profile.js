import Web3 from "web3";
import HDWalletProvider  from '@truffle/hdwallet-provider'
import fs from 'fs'
const compiledNFT_contract = JSON.parse(fs.readFileSync('./build_profile/Submit_Profile.json'));

const provider = new HDWalletProvider (
    'exhaust spoon mirror pony guard diagram palm sister poet pulp original coil', 
'https://rinkeby.infura.io/v3/6d6b6d3a7c164567a05a88d04c2a3c92'

); 


const web3 = new Web3(provider);


const deploy = async ()=> {

    const accounts = await web3.eth.getAccounts();
    
    console.log('Attempting to deploy from account', accounts[0]);
    
    
    const result = await new web3.eth.Contract(compiledNFT_contract.abi)
    .deploy({data: compiledNFT_contract.evm.bytecode.object})
    .send({gas: '5000000', from: accounts[0]});
    
    
    console.log('Contract deployed to', result.options.address);
    }
    
    deploy();
    