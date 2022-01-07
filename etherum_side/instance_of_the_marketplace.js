import web3 from './web3';
import compiledNFT_contract from './build/Marketplace.json'

const instance_of_marketplace = new web3.eth.Contract(
    compiledNFT_contract.abi,
    '0x3Aaa164d7968324361A3c3869a9897C3ce846B08'
)


export default instance_of_marketplace;