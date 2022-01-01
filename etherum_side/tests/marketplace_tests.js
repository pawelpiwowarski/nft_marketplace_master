const assert = require('assert')
const ganache = require('ganache-cli');
const Web3 = require('web3');
const web3 = new Web3(ganache.provider());

const compiledMarketplace= require('../src/build/Marketplace.json');
const compiledNft= require('../src/build/High_NFT.json');

beforeEach( async() => { 


    accounts = await web3.eth.getAccounts();
    balance = await web3.eth.getBalance(accounts[0])



Instance_of_marketplace = await new web3.eth.Contract((compiledNft.abi))
.deploy({data: compiledMarketplace.evm.bytecode.object}).send({from: accounts[0], gas: '5000000'});

Instance_of_nft = await new web3.eth.Contract((compiledNft.abi))
.deploy({data: compiledNft.evm.bytecode.object}).send({from: accounts[0], gas: '5000000'});


});


describe("Minting and listing", ()=> {

    it ('sucessfully mints and lists 1 nft', async() => {

        mint_transaction = await Instance_of_nft.methods.mint("asdad").send({from: accounts[0], gas: '5000000'});
        listing_transcation = await Instance_of_marketplace.methods.list_asset(1,100).send({from: accounts[0], gas: '5000000'});


    })
})



