import web3 from './web3';
import compiledNFT_contract from './build/Marketplace.json'

const instance_of_marketplace = new web3.eth.Contract(
    compiledNFT_contract.abi,
    '0x18e53A8EC367AEC06c58F28584a53EBA3bd35810'
)


export default instance_of_marketplace;