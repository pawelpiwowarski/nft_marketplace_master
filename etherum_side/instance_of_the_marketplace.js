import web3 from './web3';
import compiledNFT_contract from './build_marketplace/Plateau_Marketplace.json'
import { MARKETPLACE } from './addresses';
const instance_of_marketplace = new web3.eth.Contract(
    compiledNFT_contract.abi,
    MARKETPLACE
)


export default instance_of_marketplace;