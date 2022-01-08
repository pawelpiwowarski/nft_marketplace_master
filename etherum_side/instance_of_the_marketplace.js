import web3 from './web3';
import compiledNFT_contract from './build/Marketplace.json'

const instance_of_marketplace = new web3.eth.Contract(
    compiledNFT_contract.abi,
    '0x213a2474dDF05846Df0950D1aC8A220c54416594'
)


export default instance_of_marketplace;