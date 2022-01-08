import web3 from './web3';
import compiledNFT_contract from './build/High_NFT.json'

const instance = new web3.eth.Contract(
    compiledNFT_contract.abi,
    '0x1DEDa0e734465B737e2999532dc424ee39721DB5'
)


export default instance;