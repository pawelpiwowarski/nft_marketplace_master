const assert = require('assert');
const ganache = require('ganache-cli');
const Web3 = require('web3');
const web3 = new Web3(ganache.provider());

const array_of_strings = [
    "FAEwAKRe2NPRrUVUeaPJ",
    "AE4AjvoVy4VXHjjxhzWG",
    "rvTWJL511o1gh7bBycu9",
    "IT0l6Q5oTChoie4xKmJB",
    "OoBzZUFfHwk1FGDs1y1v",
    "rMnQZ92yCrDZqQb04toJ",
    "xX4m5BVsl9Tk1EeUb9mh",
    "U3SiLSwchwlsLmtDCiJs",
    "XwwM2QCHvbDNVIyB5eKz",
    "AIB1uHupD3PIJaWVtukl",
    "CBSEMIv1MOsRaEHOpVsv",
    "VtYHLfHSdWhZkRtJOSgE",
    "Kjm50dOX9V89jyzkhmzO",
    "Yx9PuoVqt9MulaJbDyjp",
    "2V4CPGRuVLsWinr90sFy",
    "r5DVWKGdFK6p1kESQaus",
    "FDpQifIxszgjIsXIAdv2",
    "4O2I08plS5W4k0AawTWc",
    "mTZH7kaW38TREtsTPe0M",
    "Ktp3N70h8C0l1b99y4UQ",
    
]
const compiled_Nft_Contract = require('../etherum_side/build_nft/Plateau_NFT.json');
const compiled_marketplace = require('../etherum_side/build_marketplace/Plateau_Marketplace.json');

let accounts;
let address_of_the_contract
let address_of_the_marketplace;
let second_nft_address;

beforeEach(async () => {
   
    accounts = await web3.eth.getAccounts();
    nft_instance = await new web3.eth.Contract(compiled_Nft_Contract.abi)
    .deploy({data: compiled_Nft_Contract.evm.bytecode.object,
arguments: ["https://gateway.pinata.cloud/ipfs/QmVW3V6FM9R49WPsgNLSwMJ3jJKJXHqhX1GbQjtQLXxRrG"]}).send({from: accounts[0], gas: '5000000'});
        address_of_the_contract = nft_instance._address
;
marketplace_instance = await new web3.eth.Contract(compiled_marketplace.abi).deploy({data: compiled_marketplace.evm.bytecode.object})
.send({from: accounts[0], gas: '5000000'});
address_of_the_marketplace = await marketplace_instance._address;

await web3.eth.sendTransaction({from: accounts[5], to: address_of_the_contract, gas: '1000000', value: Web3.utils.toWei('2', 'ether')})
await nft_instance.methods.set_contract_for_the_marketplace(address_of_the_marketplace).send({from: accounts[0], gas: "1000000"})

second_nft_instance = await new web3.eth.Contract(compiled_Nft_Contract.abi).deploy({data: compiled_Nft_Contract.evm.bytecode.object,
    arguments: ["abc"]}).send({from: accounts[1], gas: '5000000'});

    second_nft_address = second_nft_instance._address
    await second_nft_instance.methods.set_contract_for_the_marketplace(address_of_the_marketplace).send({from: accounts[1], gas: "1000000"})


}); 




describe("NFT Tests", ()=> {





describe('Basic Properties', ()=> {
    it('deploys the nft contract' , ()=> {
        assert.ok(nft_instance._address);

    })

    it('the address of the owner is the same as the address of the person that deployed the contract', async ()=> {
        const owner = await nft_instance.methods.owner().call();
        assert.equal(accounts[0], owner);

    });

    it('owner is able to mint', async()=> {
        assert.ok(await nft_instance.methods.Users_Approved_To_Mint(accounts[0]).call())
    })

    it("users can send the tokens", async()=> {
        await nft_instance.methods.safeTransferFrom(accounts[0], accounts[1], 0, 1, []).send({from: accounts[0], gas: "1000000"})
        assert.equal(await nft_instance.methods.balanceOf(accounts[1], 0).call(), 1)
    })


})



describe('Security feautures', ()=> {


    it('can transfer ownership', async()=> {
        await nft_instance.methods.transferOwnership(accounts[1]).send({from: accounts[0], gas:'1000000'})
        assert.equal(await nft_instance.methods.owner().call(), accounts[1])


            try {
            await nft_instance.methods.withdraw_minting_fees().send({from: accounts[0], gas: '100000'})
            assert.fail()
            }

            catch(e) { 
         
                    assert.equal(e.name, 'c')

            }
        
        const balance_before = await web3.eth.getBalance(accounts[1])

        await nft_instance.methods.withdraw_minting_fees().send({from: accounts[1], gas: '100000'})

        assert.ok(parseInt(balance_before)  < parseInt(await web3.eth.getBalance(accounts[1])))

    })
     
    it('users who didnt pay the fee cannot mint', async()=> {
            try {
            await nft_instance.methods.mint('').send({from: accounts[1], gas: '1000000'});
            assert.fail()
            }
            catch(e) {
                assert.equal(e.name, 'c')
            }

     
         

     
    })

    it('only owner can withdraw the fees', async()=> {
        try{
            await nft_instance.methods.withdraw_minting_fees().send({from:accounts[1], gas: '1000000'})
            assert.fail()
        }
        catch(e) {
            assert.equal(e.name, 'c')
  
        }
      })

      it('only owner can set the address of the primary marketplace', async()=> {
        try{
            await nft_instance.methods.set_contract_for_the_marketplace(accounts[2]).send({from:accounts[1], gas: '1000000'})
            assert.fail()
        }
        catch(e) {
            assert.equal(e.name, 'c')
           
  
        }
      })


})


describe('Payable functions', ()=> {


    it('owner withdraws the correct ammount of money for the fees', async()=> {


        await nft_instance.methods.approve_user_to_mint().send({from: accounts[1], gas: '1000000', value: Web3.utils.toWei('0.1', 'ether')})
        const balance_before_transaction = await web3.eth.getBalance(accounts[0]);
        await nft_instance.methods.withdraw_minting_fees().send({from: accounts[0], gas: '1000000'})
        const balance_after_transaction = await web3.eth.getBalance(accounts[0]);

        assert((parseInt(balance_after_transaction) > parseInt(balance_before_transaction)))



    })


it('the fallback function recives money', async()=> {
    const balance_before_transaction =  await web3.eth.getBalance(address_of_the_contract)
    await web3.eth.sendTransaction({from: accounts[1],to: address_of_the_contract, gas: '1000000', value: Web3.utils.toWei('1', 'ether')})
    const balance_after_transaction =  await web3.eth.getBalance(address_of_the_contract)

    assert(balance_after_transaction > balance_before_transaction)
})

it('user cannot authentiate by paying a smaller than the specified fee', async()=> {
    try {
await nft_instance.methods.approve_user_to_mint().send({from: accounts[1], gas: '1000000', value: Web3.utils.toWei('0.01', 'ether')})
assert.fails()
    }
    catch(e) {
        assert.equal(e.name, 'c')
    }

})


const common_good_mint = async()=> {

    await nft_instance.methods.approve_user_to_mint().send({from: accounts[1], gas: '1000000', value: Web3.utils.toWei('0.1', 'ether')})
    await nft_instance.methods.mint('abc').send({from: accounts[1],  gas: '1000000'})
}

it('user can mint after paying the correct ammount and the metadata for the token is correctly set ', async()=> {
await common_good_mint()
const metadata = await nft_instance.methods.uri(0).call()
assert.equal(metadata, 'https://gateway.pinata.cloud/ipfs/QmVW3V6FM9R49WPsgNLSwMJ3jJKJXHqhX1GbQjtQLXxRrG')
assert.equal(await nft_instance.methods.uri(1).call(), 'abc')

})

it('contract handles 20 mint transactions and the metadata is persistant', async ()=> {
 

    const array_from_contract = await Promise.all(Array(20).fill().map(async (element, i)=> {
        await nft_instance.methods.approve_user_to_mint().send({from:accounts[i % 10], gas:'1000000', value: Web3.utils.toWei('0.1', 'ether')})
        await nft_instance.methods.mint(array_of_strings[i]).send({from: accounts[i % 10],  gas: '1000000'})
        return await nft_instance.methods.uri(i+1).call()

    })) 
 
    assert.ok(array_of_strings.every((val, index)=> {
        return val == array_from_contract[index]
    }))

    assert.equal(await nft_instance.methods.Token_Id().call(), 21)
})

})


describe('Primary marketplace feautures', ()=> {


    it('can  setup the primary marketplace', async()=> {
        await nft_instance.methods.set_contract_for_the_marketplace(accounts[3]).send({from: accounts[0], gas: '1000000'})
        assert.equal(await nft_instance.methods.primary_Marketplace().call(), accounts[3])
    })
    it ('after mint marketplace is approved to spend tokens', async ()=> {
        await nft_instance.methods.set_contract_for_the_marketplace(accounts[3]).send({from: accounts[0], gas: '1000000'})
        await nft_instance.methods.approve_user_to_mint().send({from: accounts[2], gas: '1000000', value: Web3.utils.toWei('0.1', 'ether')})
        await nft_instance.methods.mint('abc').send({from: accounts[2],  gas: '1000000'})
        assert.ok(await nft_instance.methods.isApprovedForAll(accounts[2], accounts[3]).call())

    })
    it('Primary marketplace is approved to spend tokens of authenticated users', async ()=> {
        await nft_instance.methods.set_contract_for_the_marketplace(address_of_the_marketplace).send({from: accounts[0], gas: '1000000'})
        await nft_instance.methods.approve_user_to_mint().send({from: accounts[2], gas: '1000000', value: Web3.utils.toWei('0.1', 'ether')})
        const marketplace = await nft_instance.methods.primary_Marketplace().call()
        assert.ok( ! await nft_instance.methods.isApprovedForAll(accounts[9], marketplace).call())
       assert.ok(await nft_instance.methods.isApprovedForAll( accounts[2], address_of_the_marketplace).call())
    })
})


})
describe("Marketplace tests", ()=> {

    beforeEach(async()=> {

        array_of_listings_from_second_marketplace = await Promise.all(Array(2).fill().map(async (element,i)=>{
            await second_nft_instance.methods.approve_user_to_mint().send({from:accounts[i % 9], gas:'1000000', value: Web3.utils.toWei('0.1', 'ether')})
            await second_nft_instance.methods.mint(array_of_strings[i]).send({from: accounts[i % 9],  gas: '1000000'})
            await marketplace_instance.methods.list_asset(i +1, Web3.utils.toWei('1', 'ether'),second_nft_address).send({from:accounts[i%9], gas:'500000'})
            return await marketplace_instance.methods.Listing_details(second_nft_address, i+1).call()

        }))
        array_of_listings_from_marketplace = await Promise.all(Array(20).fill().map(async (element, i)=> {
            await nft_instance.methods.approve_user_to_mint().send({from:accounts[i % 9], gas:'1000000', value: Web3.utils.toWei('0.1', 'ether')})
            await nft_instance.methods.mint(array_of_strings[i]).send({from: accounts[i % 9],  gas: '1000000'})
            await marketplace_instance.methods.list_asset(i +1, Web3.utils.toWei('1', 'ether'),address_of_the_contract).send({from:accounts[i%9], gas:'500000'})
            return await marketplace_instance.methods.Listing_details(address_of_the_contract, i+1).call()
    
        }))})
 

    it('deploys the marketplace', async ()=> {
        assert.ok(address_of_the_marketplace)
    })

    it("the marketplace cannot list tokens without being approved to spend tokes", async()=>{
        try {
        await marketplace_instance.methods.list_asset(0, 1000, await nft_instance._address).send({from: accounts[0], gas: '100000'})
        assert.fail()
        }
        catch(e){
            assert.equal(e.name, 'c');
        }

    })
    it("after approving the marketplace the user can list and the listing details are correct", async ()=> {
        await nft_instance.methods.setApprovalForAll(address_of_the_marketplace, true).send({from: accounts[0], gas: '5000000'})
        await marketplace_instance.methods.list_asset(0, 1000, await nft_instance._address).send({from: accounts[0], gas: '500000'})
        assert.equal((await marketplace_instance.methods.return_listing_details(0, address_of_the_contract).call()).price, 1000);
        assert.equal((await marketplace_instance.methods.return_listing_details(0, address_of_the_contract).call()).seller, accounts[0]);
        assert.equal((await marketplace_instance.methods.return_listing_details(0, address_of_the_contract).call()).token_id, 0);


    })

    it("long buying test 20 tokens minted and bought by one address and data checking for multiple nft contract in the marketplace", async ()=> {
        assert.ok(array_of_listings_from_second_marketplace)

        const new_test = await Promise.all(array_of_listings_from_second_marketplace.map(async (element, index)=> {
        return (element.seller === (await marketplace_instance.methods.Listing_details(second_nft_address, index +1).call()).seller)
        

       }))
         

       assert.ok(new_test.every( (element)=> {
        return element } ))
        try {
            await marketplace_instance.methods.buy_asset(1,address_of_the_contract).send({from: accounts[2], gas: "2000000", value: 120})
            assert.fail()
        }
        catch(e) {

            assert.equal(e.name, 'c');

        }
        

        for (let j=0; j<20; j++) {
            
            let {seller} = array_of_listings_from_marketplace[j]
            const balance_of_owner_of_marketplace_before_the_sale = await web3.eth.getBalance(accounts[0])
            
           const balance_before_sell = await web3.eth.getBalance(seller)
            await marketplace_instance.methods.buy_asset(j+1,address_of_the_contract).send({from:accounts[9], gas: "2000000", value:array_of_listings_from_marketplace[j].price})
            assert.ok(await nft_instance.methods.balanceOf(accounts[j%10],j+1).call())
            const balance_after_sell = await web3.eth.getBalance(seller)
            const balance_of_owner_of_marketplace_after_the_sale = await web3.eth.getBalance(accounts[0])

            assert.ok(parseInt(balance_before_sell) <= parseInt(balance_after_sell))
            assert.ok(parseInt(balance_of_owner_of_marketplace_before_the_sale) < parseInt(balance_of_owner_of_marketplace_after_the_sale))
            assert.equal(await nft_instance.methods.balanceOf(accounts[9], j+1).call() , 1)


      
        }
        await nft_instance.methods.setApprovalForAll(address_of_the_marketplace, true).send({from: accounts[9], gas: "1000000"})
        await marketplace_instance.methods.list_asset(5, 10000000000,address_of_the_contract).send({from:accounts[9], gas: "100000"})
        const {price} = await marketplace_instance.methods.Listing_details(address_of_the_contract,5).call()

        assert.equal(price,10000000000 )
    })


    it ('users can delist their asset and cannot delist assest of other users', async ()=> {

        try {

            await marketplace_instance.methods.delist_asset(2, address_of_the_contract).send({from: accounts[0], gas: "1000000"})
            assert.fail()
        }
        catch(e) {

            assert.equal(e.name, 'c');


        }
        await marketplace_instance.methods.delist_asset(1, address_of_the_contract).send({from: accounts[0], gas: "1000000"})
        assert.equal( await nft_instance.methods.balanceOf(accounts[0], 1).call(), 1);
        assert.equal( (await marketplace_instance.methods.Listing_details(address_of_the_contract,1).call()).price, 0)
        
    })
 it ('buyer cannot be the seller', async ()=> {
    try {
    await marketplace_instance.methods.buy_asset(1, address_of_the_contract).send({from: accounts[0], gas: "1000000", value: "100"})

    assert.fail()
    }

    catch(e) {
        assert.equal(e.name, 'c');

    }
 })

})