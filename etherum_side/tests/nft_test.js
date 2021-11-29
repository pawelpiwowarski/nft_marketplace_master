const assert = require('assert')
const ganache = require('ganache-cli');
const Web3 = require('web3');
const web3 = new Web3(ganache.provider());


const compiledNft= require('../src/build/High_NFT.json');



beforeEach (async () => {

accounts = await web3.eth.getAccounts();
balance = await web3.eth.getBalance(accounts[0])

Instance_of_the_deployed_contract = await new web3.eth.Contract((compiledNft.abi))
.deploy({data: compiledNft.evm.bytecode.object}).send({from: accounts[0], gas: '5000000'});

// console.log(Instance_of_the_deployed_contract);

});


describe("Deployment", ()=> {
it('deploys a NFT contract', ()=> {
assert.ok(Instance_of_the_deployed_contract._address)

})
describe("Minting", ()=> {
it ('sucessfully mints 1 nft', async ()=> {
    mint_transaction = await Instance_of_the_deployed_contract.methods.mint(1,1).send({from: accounts[0], gas: '5000000'});
    address_of_the_owner = await Instance_of_the_deployed_contract.methods.owner().call();
    

    
    number_of_minted_assets = await Instance_of_the_deployed_contract.methods.balanceOf(address_of_the_owner,1).call();
  
    assert.ok(address_of_the_owner)
    assert.equal(number_of_minted_assets, 1)
    console.log(number_of_minted_assets)
    //token_id_tested =  mint_transaction.events.Transfer.returnValues.tokenId

    // assert.equal(token_id_tested, 0)

})
})
describe("Indexing", ()=> {
   it ('sucessfully mints 10 nfts', async ()=> {

    await Instance_of_the_deployed_contract.methods.mint(1,10).send({from: accounts[0], gas: '5000000'});    
    address_of_the_owner = await Instance_of_the_deployed_contract.methods.owner().call();

    number_of_minted_assets = await Instance_of_the_deployed_contract.methods.balanceOf(address_of_the_owner,1).call();

    console.log(number_of_minted_assets)
    assert.equal(number_of_minted_assets, 10);
   
    

   })
describe('Restrictions', ()=> {

    it('Only the owner can call the mint function, calling the function with different account', async ()=> {

        try {
        await Instance_of_the_deployed_contract.methods.mint(1,10).send({from: accounts[2], gas: '5000000'});  
        } catch (error){
            assert(error)
            console.log(error.results)
        }
        
    })
})

})
})
