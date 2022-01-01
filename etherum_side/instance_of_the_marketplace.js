import web3 from './web3';
import compiledNFT_contract from './build/Marketplace.json'

const instance_of_marketplace = new web3.eth.Contract(
    compiledNFT_contract.abi,
    '0x5855282F8CCaFa89889F90b0E314dd21157563AD'
)


export default instance_of_marketplace;