import web3 from './web3';
import compiledNFT_contract from './build/High_NFT.json'

const instance = new web3.eth.Contract(
    compiledNFT_contract.abi,
    '0x3F3638012cd5b807a2aeDA39E7cdA7571507DA56'
)


export default instance;