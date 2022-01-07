import web3 from './web3';
import compiledNFT_contract from './build/High_NFT.json'

const instance = new web3.eth.Contract(
    compiledNFT_contract.abi,
    '0x6F3943f1bc5A973eF69526e004C0c836759CeBF1'
)


export default instance;