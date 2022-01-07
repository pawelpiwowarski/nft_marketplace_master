import web3 from './web3';
import compiledNFT_contract from './build/Marketplace.json'

const instance_of_marketplace = new web3.eth.Contract(
    compiledNFT_contract.abi,
    '0xCE97f31A1e109604486fa21B8f081026a49EC6ed'
)


export default instance_of_marketplace;