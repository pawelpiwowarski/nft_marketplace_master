import web3 from './web3';
import compiledNFT_contract from './build/High_NFT.json'

const instance = new web3.eth.Contract(
    compiledNFT_contract.abi,
    '0x8c97E997bC995De9010D90fCd69C9f2b529A4227'
)


export default instance;